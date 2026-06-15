---
name: env-secrets-manager
description: Gerencia arquivos .env, detecta vazamento de credenciais, valida estrutura e gera templates seguros. Use ao configurar projeto novo, revisar segredos, ou antes de commitar/publicar qualquer coisa.
allowed-tools: Bash(cat *) Bash(grep *) Bash(git *) Bash(ls *) Bash(find *)
---

## Contexto do projeto

```!
ls -la .env* 2>/dev/null || echo "[nenhum arquivo .env encontrado]"
```

```!
cat .gitignore 2>/dev/null | grep -E "env|secret|key|token|credential" || echo "[.gitignore não encontrado ou sem regras de segredos]"
```

## Argumento (o que fazer): $ARGUMENTS

## Instruções

Identifique a tarefa a partir do argumento e execute:

---

### Se for auditoria / sem argumento

**1. Detectar arquivos sensíveis não protegidos**

Verifique se estes arquivos estão no `.gitignore`:
```bash
find . -maxdepth 3 -name "*.env" -o -name ".env*" -o -name "credentials.json" \
  -o -name "token.json" -o -name "*.key" -o -name "*.pem" -o -name "*.p12" \
  | grep -v ".git/" | grep -v "node_modules/"
```

Para cada arquivo encontrado: confirme se está listado no `.gitignore`. Se não estiver → **alerta crítico**.

**2. Verificar histórico git por vazamentos**

```bash
git log --oneline -20 2>/dev/null
git diff HEAD -- .env 2>/dev/null | head -30
```

Procure por padrões de credenciais em commits recentes:
- Strings com `=` após palavras como `KEY`, `TOKEN`, `SECRET`, `PASSWORD`, `API`
- URLs com credenciais embutidas (`://user:pass@`)
- Hashes longas que parecem chaves de API

**3. Validar estrutura do .env atual**

Leia o `.env` e classifique cada variável:
- ✅ Apenas nome e valor placeholder (ex: `DATABASE_URL=postgres://...`)
- ⚠️ Valor parece real mas não é sensível (ex: `PORT=3000`)
- 🔴 Valor parece credencial real (chave longa, hash, senha)

**4. Reportar**

Liste:
- Arquivos sensíveis encontrados e status de proteção
- Variáveis que parecem conter credenciais reais
- Commits suspeitos se houver
- Ações corretivas necessárias

---

### Se for "gerar template" ou "criar .env"

Crie `.env.example` com:
- Todas as variáveis necessárias do projeto (detectadas em código-fonte: `process.env.X`, `os.getenv("X")`, `os.environ["X"]`)
- Valores placeholder descritivos, nunca valores reais
- Comentários explicando cada variável

```bash
# Detectar variáveis usadas no código
grep -r "process\.env\." --include="*.js" --include="*.ts" --include="*.jsx" --include="*.tsx" . 2>/dev/null | \
  grep -oP "process\.env\.\K[A-Z_]+" | sort -u

grep -r "os\.getenv\|os\.environ" --include="*.py" . 2>/dev/null | \
  grep -oP '["'"'"']\K[A-Z_]+(?=["'"'"'])' | sort -u
```

Formato do `.env.example`:
```
# Banco de dados
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Autenticação
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# API externa
EXTERNAL_API_KEY=your-api-key-here
EXTERNAL_API_URL=https://api.example.com
```

---

### Se for "verificar antes de publicar/deploy"

Checklist de segurança pré-deploy:

- [ ] `.env` está no `.gitignore` e não aparece em `git status`
- [ ] `.env.example` existe com placeholders (sem valores reais)
- [ ] `git log` não contém commits com credenciais reais
- [ ] Nenhum arquivo `*.key`, `*.pem`, `credentials.json` no índice git
- [ ] Variáveis de produção estão em sistema externo (Railway, Vercel, etc.), não hardcoded

---

### Regras gerais

- Nunca imprima o conteúdo completo de um arquivo `.env` — mostre apenas os nomes das variáveis
- Se detectar credencial real exposta: classifique como risco **Crítico** (DOE Framework) e pare para alertar
- Para projetos DOE: confirme que `.tmp/` e `.env` estão no `.gitignore`
