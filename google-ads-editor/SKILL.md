---
name: google-ads-editor
description: "Monta campanhas de pesquisa do Google Ads (campanha, grupos, palavras-chave, negativas, anúncios responsivos e frases de destaque) e gera um arquivo pronto para importar no Google Ads Editor, com tudo PAUSADO. Use para criar ou subir campanhas no Google Ads sem conector de API."
---

# Google Ads Editor — campanhas prontas para importar

Gera um arquivo `.csv` (UTF-16, separado por tabulação — o formato nativo do Editor) a partir de um
plano JSON validado. Todas as campanhas saem **pausadas**; o usuário revisa e ativa no Editor.

## Fluxo

1. **Briefing** (pergunte só o que faltar): produto/oferta, URL da página de destino, cidade/região,
   orçamento diário (R$), objetivo (cliques ou conversões), diferenciais e palavras a evitar.
2. **Pesquisa de palavras-chave**: agrupe por intenção (1 tema por grupo, 5–20 palavras). Prefira
   correspondência `frase` e `exata`; use `ampla` só com lance inteligente. Liste negativas óbvias
   (grátis, curso, emprego, usado, etc.).
3. **Anúncios responsivos**: 10–15 títulos (máx. 30 caracteres) e 4 descrições (máx. 90). Varie
   ângulos: benefício, prova, oferta, urgência, local. Inclua a palavra-chave principal em 2–3 títulos.
   Só fixe posição (`"fixar": 1`) quando necessário (ex.: marca).
4. **Escreva o plano** em `plano.json` seguindo `exemplos/plano-exemplo.json`.
5. **Valide e gere**:
   ```
   python scripts/gerar_csv_editor.py plano.json campanha.csv
   ```
   Se houver erros (limite de caracteres, títulos repetidos, URL sem https), corrija e rode de novo
   até sair `OK`.
6. **Entregue** o `campanha.csv` com o passo a passo abaixo e um resumo (campanhas, grupos,
   nº de palavras, orçamento).

## Campos do plano

| Campo | Valores |
|---|---|
| `lance` | `maximizar_cliques` (padrão), `cpc_manual`, `maximizar_conversoes`, `cpa_desejado` (+ `cpa_desejado`) |
| `tipo` da palavra | `frase` (padrão), `exata`, `ampla` |
| `idiomas` | códigos do Editor, ex.: `pt` |
| `locais` | nome como o Editor mostra, ex.: `Maceio, State of Alagoas, Brazil` ou `Brazil` |
| `chamadas` | frases de destaque (máx. 25 caracteres) |

## Como importar (passar ao usuário)

1. Abra o **Google Ads Editor** e baixe a conta (**Conta › Fazer download**).
2. **Conta › Importar › Do arquivo…** e escolha o `.csv`.
3. Confira a tela de revisão e clique em **Finalizar e revisar**.
4. Revise as campanhas (estão **pausadas**), clique em **Postar** e, quando estiver tudo certo,
   ative pela interface do Google Ads.

Se o Editor não reconhecer um local, ajuste o nome em **Locais** dentro do Editor antes de postar.

## Regras

- Nunca prometa resultado ("garantido", "1º lugar") nem use afirmações de saúde/financeiras sem prova.
- Não invente números, preços ou depoimentos: o que não foi informado vira pergunta ao usuário.
- Para publicar direto pela API, use a skill `google-ads-publicar` (requer o conector configurado).
