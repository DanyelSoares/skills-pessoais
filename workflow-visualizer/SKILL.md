---
name: workflow-visualizer
description: Transforma um processo, sistema ou fluxo operacional em mapa visual interativo (HTML). Use para mapear processos de CRM, ticketing, automações, fluxos de dados ou qualquer sistema que seja difícil de explicar só com texto.
allowed-tools: Bash(cat *) Bash(ls *) Write
---

## Contexto do projeto

```!
ls directives/ 2>/dev/null | head -10 || echo "[sem pasta directives/]"
```

## Argumento (processo a visualizar): $ARGUMENTS

---

## Instruções

### Passo 1 — Entender o processo

A partir do argumento e do contexto disponível, identifique:

- **Nome do processo**
- **Atores/sistemas envolvidos** (quem faz o quê)
- **Etapas em sequência** (ordem lógica)
- **Decisões/bifurcações** (se X então Y, senão Z)
- **Ferramentas/sistemas** em cada etapa (CRM, planilha, API, etc.)
- **Entradas e saídas** de cada etapa

Se o argumento for vago, infira a partir do contexto do projeto (DOE, CRM, dashboard, etc.).

### Passo 2 — Gerar o HTML

Crie um arquivo `workflow-[nome].html` com mapa visual interativo usando apenas HTML/CSS/JS inline (sem dependências externas).

**Requisitos do visual:**

- **Diagrama de fluxo** com caixas conectadas por setas — esquerda para direita ou cima para baixo
- **Código de cores** por tipo de elemento:
  - `#3b82f6` azul — etapas de processo
  - `#10b981` verde — início/fim/sucesso
  - `#f59e0b` amarelo — decisão/bifurcação
  - `#ef4444` vermelho — erro/exceção/alerta
  - `#8b5cf6` roxo — sistema externo/integração
- **Hover** nas caixas mostra detalhes da etapa
- **Legenda** no canto inferior direito
- **Título** do processo no topo
- Fundo escuro (`#0f172a`), texto claro — compatível com ambiente de desenvolvimento

**Estrutura HTML mínima:**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>[Nome do Processo]</title>
  <style>
    /* Reset e base */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; color: #e2e8f0; font-family: system-ui, sans-serif; min-height: 100vh; }
    
    /* Container principal */
    .workflow { padding: 2rem; max-width: 1400px; margin: 0 auto; }
    h1 { font-size: 1.5rem; color: #94a3b8; margin-bottom: 2rem; letter-spacing: 0.05em; text-transform: uppercase; }
    
    /* Caixas de etapa */
    .step { 
      border-radius: 8px; padding: 1rem 1.5rem; 
      cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
      position: relative; min-width: 160px; text-align: center;
    }
    .step:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
    .step .label { font-weight: 600; font-size: 0.9rem; }
    .step .detail { font-size: 0.75rem; color: rgba(255,255,255,0.7); margin-top: 0.25rem; }
    
    /* Tooltip */
    .tooltip {
      position: absolute; bottom: 110%; left: 50%; transform: translateX(-50%);
      background: #1e293b; border: 1px solid #334155; border-radius: 6px;
      padding: 0.75rem 1rem; font-size: 0.8rem; white-space: nowrap;
      opacity: 0; pointer-events: none; transition: opacity 0.2s; z-index: 10;
    }
    .step:hover .tooltip { opacity: 1; }
    
    /* Setas */
    .arrow { color: #475569; font-size: 1.5rem; display: flex; align-items: center; padding: 0 0.5rem; }
    
    /* Legenda */
    .legend { 
      position: fixed; bottom: 1.5rem; right: 1.5rem; 
      background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 1rem;
    }
    .legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; margin-bottom: 0.4rem; }
    .legend-dot { width: 12px; height: 12px; border-radius: 3px; }
  </style>
</head>
<body>
  <div class="workflow">
    <h1>[Nome do Processo]</h1>
    <!-- DIAGRAMA AQUI -->
  </div>
  
  <div class="legend">
    <div class="legend-item"><div class="legend-dot" style="background:#3b82f6"></div> Processo</div>
    <div class="legend-item"><div class="legend-dot" style="background:#10b981"></div> Início/Fim</div>
    <div class="legend-item"><div class="legend-dot" style="background:#f59e0b"></div> Decisão</div>
    <div class="legend-item"><div class="legend-dot" style="background:#ef4444"></div> Erro/Alerta</div>
    <div class="legend-item"><div class="legend-dot" style="background:#8b5cf6"></div> Sistema externo</div>
  </div>
</body>
</html>
```

### Passo 3 — Adaptar ao processo real

Construa o diagrama refletindo fielmente o processo descrito no argumento. Exemplos de layouts comuns:

**Fluxo linear** (pipeline de dados):
```
[Início] → [Etapa 1] → [Etapa 2] → [Etapa 3] → [Fim]
```

**Fluxo com decisão** (processo de ticket):
```
[Entrada] → [Triagem] → {Classificação?}
                            ↓ Incidente → [Atendimento urgente]
                            ↓ Requisição → [Fila normal]
                            ↓ Problema → [Análise de causa]
```

**Fluxo DOE** (Directive/Orchestration/Execution):
```
[Diretriz] → [Orquestrador] → [Script Python] → [Output]
                    ↓ erro
              [Loop correção]
```

### Passo 4 — Salvar e reportar

Salve o arquivo como `workflow-[nome-kebab-case].html` na raiz do projeto (ou em `.tmp/` se for rascunho).

Informe o caminho do arquivo e como abri-lo:
```
Arquivo: ./workflow-[nome].html
Abrir: start workflow-[nome].html  (Windows)
       open workflow-[nome].html   (Mac)
       xdg-open workflow-[nome].html (Linux)
```
