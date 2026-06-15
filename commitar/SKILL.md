---
name: commitar
description: Faz stage e commit das mudanças atuais. Só invocável manualmente — Claude não dispara por conta própria.
disable-model-invocation: true
allowed-tools: Bash(git add *) Bash(git commit *) Bash(git status *) Bash(git diff *) Bash(git log *)
---

## Tarefa

Commitar as mudanças atuais do repositório.

**Argumento recebido (mensagem ou instrução):** $ARGUMENTS

### Passos

1. Rode `git status` — veja o que está pendente
2. Rode `git diff HEAD` — revise o conteúdo das mudanças
3. **Verifique arquivos sensíveis:** se encontrar `.env`, `credentials.json`, `token.json`, `*.key`, `*.pem` ou qualquer arquivo com credencial no diff → **pare e alerte antes de qualquer ação**
4. Se `$ARGUMENTS` for uma mensagem de commit, use-a diretamente
5. Se não houver argumento, analise o diff e gere mensagem no formato `tipo(escopo): descrição em português`
6. Execute `git add -A` (ou arquivos específicos se o argumento indicar)
7. Execute `git commit -m "mensagem"`
8. Confirme com `git log --oneline -1`

### Se o projeto usa DOE Framework

Se existir `.tmp/logs/`:
- Após o commit, registre no log da sessão ativa:
  ```
  [HH:MM:SS] COMMIT | [mensagem do commit]
  Arquivos afetados: [lista de arquivos commitados]
  Resultado: sucesso
  Erro: nenhum
  ```
- Nunca commite nada dentro de `.tmp/` — é espaço transitório por design

### Classificação de risco (DOE)

- Commit em branch de feature → **Baixo** — prossiga
- Commit direto em `main`/`master` → **Médio** — sinalize antes de executar
- Commit com credenciais detectadas → **Crítico** — bloqueie e alerte

### Regras

- Nunca commite arquivos `.env`, secrets ou credenciais
- Mensagem sempre em português, formato convencional
- Se houver arquivos que não devem ser commitados, alerte antes de prosseguir
