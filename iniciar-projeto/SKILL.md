---
name: iniciar-projeto
description: Configura estrutura completa de projeto novo com CLAUDE.md, convenções e estrutura de pastas. Use ao criar repositório ou iniciar projeto do zero.
disable-model-invocation: true
allowed-tools: Bash(mkdir *) Bash(touch *) Bash(echo *) Bash(cat *) Bash(ls *) Bash(git *) Write
---

## Tarefa

Inicializar o projeto: **$ARGUMENTS**

### Passo 1 — Detectar o tipo de projeto

A partir do nome e contexto, classifique em um dos tipos:
- **Dashboard SaaS** — visualização de dados, React, upload de planilhas
- **Agente/Automação DOE** — scripts Python, directives, execution
- **API Python** — backend, rotas, modelos
- **Script/Ferramenta** — automação pontual, sem frontend
- **Fullstack** — frontend + backend juntos

Não pergunte — detecte e informe no início o que foi identificado.

---

### Passo 2 — Criar CLAUDE.md

Crie `CLAUDE.md` na raiz com conteúdo real (não placeholder):

```markdown
# [Nome do Projeto]

## O que é
[descrição em 1-2 frases diretas]

## Stack
- [linguagem/framework principal]
- [banco de dados se houver]
- [outras dependências relevantes]

## Comandos essenciais
- `[setup]`
- `[dev]`
- `[build/run]`
- `[test]`

## Estrutura de pastas
[mapa comentado das pastas principais]

## Convenções
- Commits: `tipo(escopo): descrição em português`
- Nomenclatura: inglês para código técnico, português para domínio
- [outras convenções específicas detectadas]

## Contexto de negócio
[para que serve, quem usa, qual problema resolve]
```

---

### Passo 3 — Criar estrutura por tipo

**Dashboard SaaS:**
```
src/components/charts/
src/components/filters/
src/components/tables/
src/components/layout/
src/hooks/
src/config/        ← cores.js, colunas.js
src/utils/         ← parsePlanilha.js, formatacao.js
src/data/          ← fixtures para desenvolvimento
public/
.claude/skills/    ← skills específicas do projeto
```

**Agente/Automação DOE:**
```
directives/        ← POPs em Markdown
execution/         ← Scripts Python determinísticos
.tmp/              ← Transitório (no .gitignore)
.tmp/backups/
.tmp/logs/
.env               ← Variáveis de ambiente (no .gitignore)
.claude/skills/
```
Crie também `.tmp/session_state.md` vazio e `.gitignore` com `.tmp/`, `.env`, `credentials.json`, `token.json`.

**API Python:**
```
app/
app/routes/
app/models/
app/utils/
tests/
.claude/skills/
```

**Script/Ferramenta:**
```
scripts/
data/
output/
logs/
.claude/skills/
```

**Fullstack:**
```
frontend/
backend/
docs/
.claude/skills/
```

---

### Passo 4 — Criar .gitignore adequado

Baseado no tipo detectado. Sempre incluir:
```
.env
*.key
*.pem
credentials.json
token.json
__pycache__/
node_modules/
.DS_Store
```

Para projetos DOE, adicionar:
```
.tmp/
```

---

### Passo 5 — Reportar

Liste o que foi criado. Uma linha por item.
