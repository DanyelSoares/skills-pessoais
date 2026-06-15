---
name: documentar
description: Gera ou atualiza documentação técnica — README, docstrings, comentários, runbook. Use ao terminar uma feature, antes de PR, ou quando o código estiver sem documentação.
---

## Contexto do repositório

```!
git status --short 2>/dev/null || echo "[fora de repositório]"
```

## Arquivos modificados recentemente

```!
git diff --name-only HEAD 2>/dev/null | head -20 || echo "[sem mudanças]"
```

## Argumento (o que documentar): $ARGUMENTS

## Instruções

Identifique o tipo de documentação necessária e execute:

### Se for README (sem argumento ou "readme")
Gere ou atualize o `README.md` com:
- **O que é** — 2-3 frases diretas
- **Pré-requisitos** — o que precisa estar instalado
- **Setup** — passos para rodar localmente
- **Uso** — exemplo real e funcional
- **Estrutura** — mapa das pastas principais
- **Como contribuir** — se for projeto colaborativo

### Se for função/módulo específico (argumento = arquivo ou função)
- Docstrings em todas as funções públicas (formato padrão da linguagem: JSDoc, Python docstring, etc)
- Comentários apenas onde a lógica não é óbvia — nunca comentar "o que", só "por que"
- Tipos explícitos se a linguagem suportar

### Se for runbook/processo (argumento = "runbook" ou processo específico)
Gere documento com:
- **Objetivo** — quando executar este runbook
- **Pré-condições** — o que deve estar ok antes
- **Passos** — numerados, com comandos copiáveis
- **Verificação** — como confirmar que funcionou
- **Rollback** — como desfazer se algo der errado

### Regras gerais
- Escreva para quem não conhece o projeto
- Comandos sempre testáveis — sem placeholders vagos como `<your-value>`
- Em português para README e runbooks; inglês para docstrings e comentários de código
- Se o arquivo já existe, mostre apenas o diff do que muda
