#!/usr/bin/env node
// Conector MCP do Google Ads para o Claude Code.
// Segurança: campanhas são criadas PAUSADAS; "simular" vem ligado por padrão;
// ativar exige confirmar=true. Credenciais ficam em ~/.google-ads-mcp/config.json.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { chamar, montarOperacoes, validarPlano, soDigitos } from "./lib.mjs";

const server = new McpServer({ name: "google-ads-pessoal", version: "1.0.0" });
const ok = (obj) => ({ content: [{ type: "text", text: typeof obj === "string" ? obj : JSON.stringify(obj, null, 2) }] });
const falha = (e) => ({ isError: true, content: [{ type: "text", text: String(e?.message ?? e) }] });
const cliente = z.string().describe("ID da conta Google Ads (com ou sem traços), ex.: 123-456-7890");

server.registerTool("listar_contas", {
  title: "Listar contas acessíveis",
  description: "Lista as contas do Google Ads que o login autorizado pode acessar.",
  inputSchema: {},
}, async () => {
  try { return ok(await chamar("GET", "customers:listAccessibleCustomers")); } catch (e) { return falha(e); }
});

server.registerTool("consultar", {
  title: "Consultar (GAQL)",
  description: "Executa uma consulta GAQL somente leitura (campanhas, métricas, palavras-chave, termos de pesquisa). Ex.: SELECT campaign.name, metrics.clicks, metrics.cost_micros FROM campaign WHERE segments.date DURING LAST_30_DAYS",
  inputSchema: { customer_id: cliente, gaql: z.string() },
}, async ({ customer_id, gaql }) => {
  try {
    const r = await chamar("POST", `customers/${soDigitos(customer_id)}/googleAds:search`, { query: gaql });
    return ok({ linhas: r.results?.length ?? 0, results: r.results ?? [], nextPageToken: r.nextPageToken });
  } catch (e) { return falha(e); }
});

server.registerTool("buscar_local", {
  title: "Buscar ID de local",
  description: "Converte nomes de cidades/estados em IDs de segmentação geográfica (geoTargetConstants) para usar em criar_campanha_pesquisa.",
  inputSchema: { nomes: z.array(z.string()), pais: z.string().default("BR") },
}, async ({ nomes, pais }) => {
  try {
    const r = await chamar("POST", "geoTargetConstants:suggestGeoTargetConstants",
      { locale: "pt", countryCode: pais, locationNames: { names: nomes } });
    return ok((r.geoTargetConstantSuggestions ?? []).map((s) => ({
      busca: s.searchTerm, id: s.geoTargetConstant?.id, nome: s.geoTargetConstant?.canonicalName,
      tipo: s.geoTargetConstant?.targetType, alcance: s.reach,
    })));
  } catch (e) { return falha(e); }
});

const palavra = z.union([z.string(), z.object({ texto: z.string(), tipo: z.enum(["ampla", "frase", "exata"]).default("frase") })]);
server.registerTool("criar_campanha_pesquisa", {
  title: "Criar campanha de pesquisa (pausada)",
  description: "Cria campanha de pesquisa completa (orçamento, segmentação, grupos, palavras-chave, negativas e anúncios responsivos) numa única operação, SEMPRE PAUSADA. Com simular=true (padrão) só valida no Google, sem gravar nada. Mostre o plano ao usuário e só use simular=false depois da aprovação dele.",
  inputSchema: {
    customer_id: cliente,
    simular: z.boolean().default(true),
    plano: z.object({
      nome: z.string(),
      orcamento_diario: z.number().describe("Em reais"),
      lance: z.enum(["maximizar_cliques", "cpc_manual", "maximizar_conversoes", "cpa_desejado"]).default("maximizar_cliques"),
      cpa_desejado: z.number().optional(),
      locais_ids: z.array(z.union([z.string(), z.number()])).describe("IDs obtidos com buscar_local"),
      idiomas: z.array(z.string()).default(["pt"]),
      parceiros_pesquisa: z.boolean().default(false),
      negativas_campanha: z.array(palavra).default([]),
      grupos: z.array(z.object({
        nome: z.string(),
        cpc_max: z.number().optional(),
        palavras: z.array(palavra),
        negativas: z.array(palavra).default([]),
        anuncios: z.array(z.object({
          titulos: z.array(z.union([z.string(), z.object({ texto: z.string(), fixar: z.number().int().min(1).max(3).optional() })])),
          descricoes: z.array(z.string()),
          url_final: z.string(),
          caminho1: z.string().optional(),
          caminho2: z.string().optional(),
        })),
      })),
    }),
  },
}, async ({ customer_id, simular, plano }) => {
  try {
    const erros = validarPlano(plano);
    if (erros.length) return falha("Plano inválido:\n- " + erros.join("\n- "));
    const ops = montarOperacoes(customer_id, plano);
    const r = await chamar("POST", `customers/${soDigitos(customer_id)}/googleAds:mutate`,
      { mutateOperations: ops, partialFailure: false, validateOnly: simular });
    if (simular) return ok(`SIMULAÇÃO OK: o Google aceitou as ${ops.length} operações. Nada foi gravado. Para criar de verdade (pausada), chame de novo com simular=false após aprovação do usuário.`);
    const camp = (r.mutateOperationResponses ?? []).map((x) => x.campaignResult?.resourceName).find(Boolean);
    return ok({ criado: true, status: "PAUSED", campanha: camp, operacoes: ops.length,
      proximo_passo: "Revise no Google Ads. Para ativar, use alterar_status_campanha com confirmar=true." });
  } catch (e) { return falha(e); }
});

server.registerTool("alterar_status_campanha", {
  title: "Pausar ou ativar campanha",
  description: "Pausa ou ativa uma campanha. ATIVAR gasta dinheiro: só use com confirmar=true depois que o usuário pedir explicitamente.",
  inputSchema: {
    customer_id: cliente,
    campaign_id: z.string(),
    status: z.enum(["PAUSED", "ENABLED"]),
    confirmar: z.boolean().default(false),
  },
}, async ({ customer_id, campaign_id, status, confirmar }) => {
  try {
    if (status === "ENABLED" && !confirmar) return falha("Ativação bloqueada: confirme com o usuário e chame com confirmar=true.");
    const cid = soDigitos(customer_id);
    const rn = `customers/${cid}/campaigns/${soDigitos(campaign_id)}`;
    await chamar("POST", `customers/${cid}/googleAds:mutate`, { mutateOperations: [
      { campaignOperation: { update: { resourceName: rn, status }, updateMask: "status" } }] });
    return ok(`Campanha ${campaign_id} agora está ${status === "ENABLED" ? "ATIVA" : "PAUSADA"}.`);
  } catch (e) { return falha(e); }
});

await server.connect(new StdioServerTransport());
