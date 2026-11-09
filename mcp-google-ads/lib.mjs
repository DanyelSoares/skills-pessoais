// Funções do conector Google Ads (REST API, sem dependências externas).
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export const CONFIG_DIR = join(homedir(), ".google-ads-mcp");
export const CONFIG_FILE = join(CONFIG_DIR, "config.json");
const IDIOMAS = { pt: 1014, en: 1000, es: 1003 };
const LANCES = ["maximizar_cliques", "cpc_manual", "maximizar_conversoes", "cpa_desejado"];
const TIPOS = { ampla: "BROAD", frase: "PHRASE", exata: "EXACT" };

export function lerConfig() {
  if (!existsSync(CONFIG_FILE)) {
    throw new Error(`Configuração não encontrada em ${CONFIG_FILE}. Rode "npm run autorizar" na pasta mcp-google-ads.`);
  }
  const c = JSON.parse(readFileSync(CONFIG_FILE, "utf8"));
  for (const k of ["client_id", "client_secret", "refresh_token", "developer_token"]) {
    if (!c[k]) throw new Error(`Campo "${k}" ausente em ${CONFIG_FILE}.`);
  }
  c.api_version = process.env.GOOGLE_ADS_API_VERSION || c.api_version || "v25";
  return c;
}

export const soDigitos = (s) => String(s ?? "").replace(/\D/g, "");
export const micros = (reais) => Math.round(Number(reais) * 1_000_000);

let cache = { token: null, expira: 0 };
async function accessToken(c) {
  if (cache.token && Date.now() < cache.expira - 60_000) return cache.token;
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: c.client_id, client_secret: c.client_secret,
      refresh_token: c.refresh_token, grant_type: "refresh_token",
    }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`Falha ao renovar o acesso do Google (${j.error}): rode "npm run autorizar" de novo.`);
  cache = { token: j.access_token, expira: Date.now() + j.expires_in * 1000 };
  return cache.token;
}

export async function chamar(metodo, caminho, corpo) {
  const c = lerConfig();
  const headers = {
    authorization: `Bearer ${await accessToken(c)}`,
    "developer-token": c.developer_token,
    "content-type": "application/json",
  };
  if (c.login_customer_id) headers["login-customer-id"] = soDigitos(c.login_customer_id);
  const url = `https://googleads.googleapis.com/${c.api_version}/${caminho}`;
  const r = await fetch(url, { method: metodo, headers, body: corpo ? JSON.stringify(corpo) : undefined });
  const texto = await r.text();
  let j; try { j = JSON.parse(texto); } catch { j = { raw: texto }; }
  if (!r.ok) {
    if (r.status === 404 && !j.error) {
      throw new Error(`Versão da API "${c.api_version}" indisponível. Defina "api_version" no config.json (ex.: v26).`);
    }
    throw new Error(`Google Ads API ${r.status}: ${JSON.stringify(j.error?.details ?? j.error ?? j).slice(0, 3000)}`);
  }
  return j;
}

export function validarPlano(p) {
  const e = [];
  if (!p.nome) e.push("nome da campanha ausente");
  if (!(Number(p.orcamento_diario) > 0)) e.push("orcamento_diario deve ser > 0");
  if (!LANCES.includes(p.lance ?? "maximizar_cliques")) e.push(`lance inválido (use ${LANCES.join(", ")})`);
  if (p.lance === "cpa_desejado" && !(Number(p.cpa_desejado) > 0)) e.push("cpa_desejado exige valor > 0");
  if (!p.grupos?.length) e.push("precisa de pelo menos 1 grupo");
  for (const g of p.grupos ?? []) {
    if (!g.palavras?.length) e.push(`[${g.nome}] sem palavras-chave`);
    for (const k of [...(g.palavras ?? []), ...(g.negativas ?? [])]) {
      if (!TIPOS[k.tipo ?? "frase"]) e.push(`[${g.nome}] tipo inválido: ${k.tipo}`);
      if ((k.texto ?? "").length > 80) e.push(`[${g.nome}] palavra-chave > 80 caracteres`);
    }
    for (const [i, a] of (g.anuncios ?? []).entries()) {
      const n = `[${g.nome} > anúncio ${i + 1}]`;
      if (!(a.titulos?.length >= 3 && a.titulos.length <= 15)) e.push(`${n} 3 a 15 títulos`);
      if (!(a.descricoes?.length >= 2 && a.descricoes.length <= 4)) e.push(`${n} 2 a 4 descrições`);
      for (const t of a.titulos ?? []) if ((t.texto ?? t).length > 30) e.push(`${n} título > 30: ${t.texto ?? t}`);
      for (const d of a.descricoes ?? []) if (d.length > 90) e.push(`${n} descrição > 90: ${d}`);
      if (!/^https?:\/\//.test(a.url_final ?? "")) e.push(`${n} url_final inválida`);
      for (const k of ["caminho1", "caminho2"]) if ((a[k] ?? "").length > 15) e.push(`${n} ${k} > 15`);
    }
    if (!g.anuncios?.length) e.push(`[${g.nome}] sem anúncio`);
  }
  return e;
}

// Monta as operações de uma campanha de pesquisa completa, sempre PAUSADA.
export function montarOperacoes(cid, p) {
  cid = soDigitos(cid);
  let tmp = -1;
  const novo = (tipo) => `customers/${cid}/${tipo}/${tmp--}`;
  const ops = [];
  const orc = novo("campaignBudgets");
  ops.push({ campaignBudgetOperation: { create: {
    resourceName: orc, name: `${p.nome} | orçamento ${Date.now()}`,
    amountMicros: String(micros(p.orcamento_diario)), deliveryMethod: "STANDARD", explicitlyShared: false,
  } } });
  const camp = novo("campaigns");
  const lance = p.lance ?? "maximizar_cliques";
  const estrategia = {
    maximizar_cliques: { targetSpend: {} },
    cpc_manual: { manualCpc: {} },
    maximizar_conversoes: { maximizeConversions: {} },
    cpa_desejado: { maximizeConversions: { targetCpaMicros: String(micros(p.cpa_desejado ?? 0)) } },
  }[lance];
  ops.push({ campaignOperation: { create: {
    resourceName: camp, name: p.nome, status: "PAUSED", advertisingChannelType: "SEARCH",
    campaignBudget: orc, ...estrategia,
    networkSettings: { targetGoogleSearch: true, targetSearchNetwork: !!p.parceiros_pesquisa,
      targetContentNetwork: false, targetPartnerSearchNetwork: false },
    containsEuPoliticalAdvertising: "DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING",
  } } });
  for (const geo of p.locais_ids ?? []) {
    ops.push({ campaignCriterionOperation: { create: { campaign: camp,
      location: { geoTargetConstant: `geoTargetConstants/${soDigitos(geo)}` } } } });
  }
  for (const idi of p.idiomas ?? ["pt"]) {
    const id = IDIOMAS[idi] ?? soDigitos(idi);
    ops.push({ campaignCriterionOperation: { create: { campaign: camp,
      language: { languageConstant: `languageConstants/${id}` } } } });
  }
  for (const n of p.negativas_campanha ?? []) {
    const k = typeof n === "string" ? { texto: n } : n;
    ops.push({ campaignCriterionOperation: { create: { campaign: camp, negative: true,
      keyword: { text: k.texto, matchType: TIPOS[k.tipo ?? "frase"] } } } });
  }
  for (const g of p.grupos) {
    const ag = novo("adGroups");
    const grupo = { resourceName: ag, name: g.nome, campaign: camp, status: "ENABLED", type: "SEARCH_STANDARD" };
    if (lance === "cpc_manual" && g.cpc_max) grupo.cpcBidMicros = String(micros(g.cpc_max));
    ops.push({ adGroupOperation: { create: grupo } });
    for (const k0 of g.palavras) {
      const k = typeof k0 === "string" ? { texto: k0 } : k0;
      ops.push({ adGroupCriterionOperation: { create: { adGroup: ag, status: "ENABLED",
        keyword: { text: k.texto, matchType: TIPOS[k.tipo ?? "frase"] } } } });
    }
    for (const k0 of g.negativas ?? []) {
      const k = typeof k0 === "string" ? { texto: k0 } : k0;
      ops.push({ adGroupCriterionOperation: { create: { adGroup: ag, negative: true,
        keyword: { text: k.texto, matchType: TIPOS[k.tipo ?? "frase"] } } } });
    }
    for (const a of g.anuncios) {
      const headlines = a.titulos.map((t) => typeof t === "string" ? { text: t }
        : { text: t.texto, ...(t.fixar ? { pinnedField: `HEADLINE_${t.fixar}` } : {}) });
      ops.push({ adGroupAdOperation: { create: { adGroup: ag, status: "ENABLED", ad: {
        finalUrls: [a.url_final],
        responsiveSearchAd: { headlines, descriptions: a.descricoes.map((d) => ({ text: d })),
          ...(a.caminho1 ? { path1: a.caminho1 } : {}), ...(a.caminho2 ? { path2: a.caminho2 } : {}) },
      } } } });
    }
  }
  return ops;
}
