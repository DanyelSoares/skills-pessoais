---
name: deploy-web
description: Publica sites e aplicações web — Vercel, Netlify, GitHub Pages, Hostinger. Use ao terminar um projeto e querer colocá-lo online, ou ao precisar configurar domínio personalizado, variáveis de ambiente ou CI/CD.
disable-model-invocation: true
allowed-tools: Bash(npm *) Bash(npx *) Bash(git *) Bash(vercel *) Bash(netlify *)
---

## Argumento (plataforma ou tipo de projeto): $ARGUMENTS

---

## Detectar plataforma

A partir do argumento ou do projeto atual:

- `vercel` → Next.js, React, Vue, qualquer framework moderno
- `netlify` → sites estáticos, Hugo, Jekyll, Gatsby
- `github-pages` → HTML/CSS puro, projetos open source
- `hostinger` → WordPress, sites tradicionais, hospedagem compartilhada

Se não especificado, detecte pelo `package.json` ou estrutura do projeto e use Vercel como padrão para projetos Node/React.

---

## VERCEL

### Deploy inicial

```bash
# 1. Instalar CLI (se não tiver)
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy do projeto atual
vercel

# 4. Deploy de produção
vercel --prod
```

### Variáveis de ambiente

```bash
# Adicionar variável
vercel env add NOME_DA_VARIAVEL

# Listar variáveis
vercel env ls

# Puxar .env do projeto remoto
vercel env pull .env.local
```

### Domínio personalizado

```bash
# Adicionar domínio
vercel domains add seu-dominio.com.br

# Verificar status
vercel domains inspect seu-dominio.com.br
```

**DNS (no painel do registrador de domínio):**
```
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com

Tipo: A
Nome: @
Valor: 76.76.19.61
```

---

## NETLIFY

### Deploy inicial

```bash
# Instalar CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy de produção
netlify deploy --prod
```

### netlify.toml (configuração)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

---

## GITHUB PAGES

### Para HTML/CSS puro

```bash
# Criar branch gh-pages
git checkout -b gh-pages
git push origin gh-pages
```

No repositório → Settings → Pages → Source: Deploy from branch → gh-pages / root

### Para React (com build)

```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# package.json — adicionar:
# "homepage": "https://seu-usuario.github.io/nome-do-repo",
# "scripts": { "deploy": "gh-pages -d build" }

# Deploy
npm run build && npm run deploy
```

---

## Checklist pré-deploy

**Código:**
- [ ] Build roda sem erros: `npm run build`
- [ ] Sem console.log ou debugger no código
- [ ] Variáveis de ambiente em `.env` e não hardcoded
- [ ] `.env` no `.gitignore`

**Performance:**
- [ ] Imagens otimizadas (WebP quando possível)
- [ ] Fontes com `font-display: swap`
- [ ] Bundle size verificado: `npm run build -- --analyze` (Next.js/Vite)

**SEO e meta:**
- [ ] `<title>` único em cada página
- [ ] `<meta name="description">` presente
- [ ] OG tags para compartilhamento social
- [ ] `favicon.ico` ou `favicon.svg`

**Funcional:**
- [ ] Links internos funcionando
- [ ] Formulários conectados (Formspree, Netlify Forms, etc.)
- [ ] Analytics configurado (se aplicável)
- [ ] Mobile testado

---

## Domínio: onde comprar e configurar

**Registradores recomendados:**
- Hostinger (mais barato, .com.br em destaque)
- Namecheap (internacional, bom suporte)
- Registro.br (oficial para .com.br)

**Tempo de propagação DNS:** 24-48h em média, pode ser menos de 1h.

**Verificar propagação:**
```bash
# Mac/Linux
dig seu-dominio.com.br

# Ou online: whatsmydns.net
```

---

## Solução de problemas comuns

| Problema | Causa provável | Solução |
|---|---|---|
| Build falha na Vercel | Variável de ambiente faltando | Adicionar no painel da Vercel |
| 404 em rotas SPA | Redirect não configurado | Adicionar rewrite rule |
| Domínio não conecta | DNS não propagou | Aguardar 24-48h |
| HTTPS não ativo | Certificado SSL pendente | Aguardar até 24h após DNS |
| Deploy lento | Bundle muito grande | Verificar imports desnecessários |
