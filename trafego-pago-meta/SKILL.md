---
name: trafego-pago-meta
description: Gerencia campanhas Meta Ads (Facebook/Instagram) via MCP oficial da Meta — cria, analisa, otimiza e reporta campanhas em linguagem natural. Use para criar anúncios, verificar métricas, diagnosticar performance e tomar decisões de tráfego pago.
user-invocable: true
---

## Argumento (o que fazer): $ARGUMENTS

---

## Contexto: Meta Ads MCP Oficial

Em 29 de abril de 2026, a Meta lançou o MCP oficial para Meta Ads em open beta. Isso permite que o Claude gerencie campanhas diretamente via OAuth padrão — **sem risco de ban, sem Meta Developer App, sem aprovação manual da Marketing API**.

O servidor MCP oficial está em: `https://mcp.facebook.com/ads`
Conta com **29 ferramentas** (22 de leitura, 7 de escrita).

---

## Como conectar (setup único)

Se o MCP ainda não estiver conectado:

1. Abra **Central de Negócios Meta** → seção "Manage Ads from an AI Agent"
2. Copie a URL do MCP oficial
3. No Claude Code, adicione o conector:
   ```bash
   claude mcp add meta-ads https://mcp.facebook.com/ads
   ```
4. Autorize via OAuth com sua conta Meta Business
5. Confirme acesso às contas de anúncio desejadas

---

## Capacidades disponíveis

### Leitura (22 ferramentas)
- Listar campanhas, conjuntos de anúncios, anúncios
- Métricas de performance por período (hoje, ontem, 7d, 30d, custom)
- Breakdown por dispositivo, posicionamento, faixa etária, gênero
- Análise de criativos (CTR, custo por resultado, frequência)
- Status de pixel e eventos de conversão
- Públicos-alvo salvos e lookalikes

### Escrita (7 ferramentas)
- Criar campanhas com objetivo definido
- Criar conjuntos de anúncios (segmentação, orçamento, período)
- Criar anúncios (copy, imagem, CTA)
- Pausar/ativar campanhas, conjuntos, anúncios
- Duplicar campanhas
- Ajustar orçamentos
- Editar segmentação de públicos

---

## Fluxos de trabalho comuns

### Análise de performance diária

Prompt natural:
> "Analise minhas campanhas ativas hoje. Mostre CPA, ROAS e gasto. Sinalize qualquer campanha com CPA acima de R$X ou gasto >30% fora do esperado."

O Claude vai:
1. Buscar métricas de todas as campanhas ativas
2. Comparar com período anterior (ontem, semana passada)
3. Identificar anomalias e tendências
4. Sugerir ações concretas

### Criar campanha nova

Prompt natural:
> "Crie uma campanha de conversão para [produto], público de [descrição], orçamento diário de R$[valor], início hoje."

O Claude vai:
1. Criar a campanha com objetivo correto
2. Configurar o conjunto de anúncios com a segmentação
3. Solicitar ou gerar o copy do anúncio
4. Confirmar antes de publicar (risco Médio → confirma antes de executar)

### Diagnóstico de campanha em queda

Prompt natural:
> "Minha campanha [nome] caiu muito nos últimos 3 dias. O que aconteceu?"

O Claude vai analisar:
- Evolução de CPM, CTR, CPA nos últimos 7 dias
- Frequência dos criativos (fadiga?)
- Alterações no público competindo pelo leilão
- Performance por posicionamento
- Sugestões de ação (novos criativos, novo público, orçamento)

---

## Métricas essenciais a monitorar

| Métrica | O que indica | Alerta |
|---|---|---|
| **CPA** (Custo por Aquisição) | Eficiência de conversão | >20% acima da meta |
| **ROAS** (Return on Ad Spend) | Retorno sobre gasto | <1.5× meta |
| **CPM** (Custo por 1000 impressões) | Custo do leilão | Subindo sem explicação |
| **CTR** (Taxa de clique) | Relevância do criativo | <1% para feed |
| **Frequência** | Saturação do público | >3× em 7 dias = trocar criativo |
| **Relevance Score** | Qualidade do anúncio | <6 = revisar copy/imagem |

---

## Criação de anúncios — estrutura de copy

Para criar anúncios de alta performance, use a estrutura:

```
HOOK (primeira linha — para o scroll):
[Dor específica do público ou promessa concreta]

CORPO:
[Agitação do problema — o custo de não resolver]
[Solução — o que você oferece]
[Prova social — número, depoimento, resultado]

CTA:
[Ação específica] → [Benefício imediato]
```

**Variações para teste A/B:**
- Hook por dor vs. hook por desejo
- CTA direto ("Compre agora") vs. suave ("Saiba mais")
- Formato: imagem única vs. carrossel vs. vídeo

---

## Boas práticas de estrutura de conta

```
Conta de Anúncios
├── Campanha 1: Topo de funil (Reconhecimento/Alcance)
│   ├── Conjunto A: Público frio lookalike 1-3%
│   └── Conjunto B: Público frio por interesse
├── Campanha 2: Meio de funil (Consideração/Tráfego)
│   └── Conjunto A: Retargeting visitantes do site (30d)
└── Campanha 3: Fundo de funil (Conversão)
    ├── Conjunto A: Retargeting carrinho abandonado (7d)
    └── Conjunto B: Retargeting visualizou produto (14d)
```

---

## Regras de segurança (DOE)

- **Criação de campanha** → risco **Médio**: confirme antes de publicar
- **Pausar campanha ativa** → risco **Médio**: descreva impacto antes
- **Editar orçamento** → risco **Alto** se variação >50%: dupla confirmação
- **Deletar** → risco **Crítico**: nunca execute sem confirmação explícita
- Nunca ajuste campanhas em período de aprendizado (primeiros 7 dias pós-lançamento) sem avisar sobre o impacto na fase de otimização

---

## Relatório semanal

Para gerar um relatório semanal completo:
> "/trafego-pago-meta relatório semanal"

Entrega:
1. Resumo executivo (3-5 bullets)
2. Tabela de campanhas: gasto, resultados, CPA, ROAS
3. Top 3 anúncios em performance
4. Bottom 3 anúncios (candidatos a pausar)
5. Recomendações para a próxima semana
