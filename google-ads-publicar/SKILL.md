---
name: google-ads-publicar
description: "Publica e consulta campanhas do Google Ads direto pelo Claude usando o conector MCP google-ads-pessoal: lista contas, lê métricas (GAQL), cria campanhas de pesquisa completas SEMPRE PAUSADAS e pausa/ativa com confirmação. Use para subir, revisar ou acompanhar campanhas no Google Ads."
---

# Google Ads — publicar pela API

Usa as ferramentas do servidor MCP `google-ads-pessoal`
(`listar_contas`, `consultar`, `buscar_local`, `criar_campanha_pesquisa`, `alterar_status_campanha`).

Se as ferramentas não estiverem disponíveis ou retornarem erro de configuração, explique que o
conector precisa ser configurado (`mcp-google-ads/GUIA-CREDENCIAIS.md` no repositório
skills-pessoais) e ofereça a alternativa da skill `google-ads-editor` (arquivo para importar).

## Fluxo para criar campanha

1. **Conta**: `listar_contas` e confirme com o usuário qual conta usar.
2. **Briefing e plano**: mesmo processo da skill `google-ads-editor` (grupos por intenção,
   10–15 títulos ≤30, 2–4 descrições ≤90, negativas). Converta cidades em IDs com `buscar_local`
   e use-os em `locais_ids`.
3. **Mostre o plano** ao usuário em tabela (campanha, orçamento, lance, locais, grupos, palavras,
   títulos/descrições) e peça aprovação.
4. **Simule**: `criar_campanha_pesquisa` com `simular: true`. Corrija o que o Google recusar.
5. **Crie**: só após o "pode criar" explícito, rode com `simular: false`. A campanha nasce **PAUSADA**.
6. **Ativar** gasta dinheiro: só com pedido explícito do usuário, via `alterar_status_campanha`
   com `status: "ENABLED"` e `confirmar: true`.

## Consultas úteis (ferramenta `consultar`)

- Desempenho por campanha (30 dias):
  `SELECT campaign.id, campaign.name, campaign.status, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM campaign WHERE segments.date DURING LAST_30_DAYS`
- Termos de pesquisa:
  `SELECT search_term_view.search_term, metrics.clicks, metrics.cost_micros, metrics.conversions FROM search_term_view WHERE segments.date DURING LAST_30_DAYS ORDER BY metrics.cost_micros DESC LIMIT 50`
- Palavras-chave e índice de qualidade:
  `SELECT ad_group_criterion.keyword.text, ad_group_criterion.quality_info.quality_score, metrics.clicks FROM keyword_view WHERE segments.date DURING LAST_30_DAYS`

`cost_micros` ÷ 1.000.000 = valor em reais.

## Regras

- Nunca ative, aumente orçamento ou exclua nada sem pedido explícito.
- Não invente dados de desempenho: sempre consulte.
- Não exponha credenciais nem o conteúdo de `~/.google-ads-mcp/config.json`.
