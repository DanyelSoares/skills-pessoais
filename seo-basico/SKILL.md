---
name: seo-basico
description: Aplica SEO técnico e on-page a sites e landing pages — meta tags, estrutura semântica, performance, schema markup. Use ao finalizar um site ou quando quiser melhorar o posicionamento orgânico de uma página.
---

## Argumento (URL, página ou tipo de site): $ARGUMENTS

---

## SEO técnico — checklist completo

### Meta tags essenciais

```html
<head>
  <!-- Básico -->
  <title>Palavra-chave Principal | Nome da Marca</title>
  <meta name="description" content="Descrição de 150-160 caracteres com palavra-chave principal. O que o usuário encontra nessa página.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://seu-site.com/pagina/">

  <!-- Open Graph (Facebook, LinkedIn, WhatsApp) -->
  <meta property="og:title" content="Mesmo título ou variação">
  <meta property="og:description" content="Mesma descrição ou variação">
  <meta property="og:image" content="https://seu-site.com/og-image.jpg">
  <meta property="og:url" content="https://seu-site.com/pagina/">
  <meta property="og:type" content="website">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Título">
  <meta name="twitter:description" content="Descrição">
  <meta name="twitter:image" content="https://seu-site.com/og-image.jpg">
</head>
```

**Imagem OG:** 1200×630px, máx 1MB, sem texto essencial nas bordas.

---

### Estrutura semântica HTML

```html
<!-- Hierarquia de headings — uma H1 por página -->
<h1>Palavra-chave principal da página</h1>
  <h2>Subtópico importante</h2>
    <h3>Detalhe do subtópico</h3>

<!-- Landmarks semânticos -->
<header><!-- logo, nav --></header>
<nav aria-label="Principal"><!-- menu --></nav>
<main><!-- conteúdo principal --></main>
<article><!-- conteúdo independente --></article>
<section aria-labelledby="titulo-secao"><!-- seção com título --></section>
<aside><!-- conteúdo relacionado, sidebar --></aside>
<footer><!-- rodapé --></footer>

<!-- Imagens sempre com alt -->
<img src="produto.jpg" alt="[descrição específica do que está na imagem]">
<!-- alt="" para imagens decorativas -->
```

---

### Performance (Core Web Vitals)

**LCP — Largest Contentful Paint (< 2.5s)**
```html
<!-- Pré-carregar a imagem hero -->
<link rel="preload" as="image" href="hero.webp">

<!-- Imagens com dimensões explícitas (evita layout shift) -->
<img src="hero.webp" width="1200" height="600" alt="..." loading="eager">

<!-- Demais imagens com lazy load -->
<img src="foto.webp" width="400" height="300" alt="..." loading="lazy">
```

**CLS — Cumulative Layout Shift (< 0.1)**
```css
/* Sempre definir aspect-ratio em imagens e vídeos */
img { aspect-ratio: attr(width) / attr(height); }

/* Reservar espaço para fontes */
@font-face {
  font-family: 'MinhaFonte';
  font-display: swap; /* mostra fallback enquanto carrega */
}
```

**INP — Interaction to Next Paint (< 200ms)**
- Evitar JavaScript pesado no thread principal
- Usar `requestIdleCallback` para tarefas não urgentes
- Debounce em inputs e scroll listeners

---

### Schema Markup (dados estruturados)

```html
<!-- Organização/empresa -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Nome da Empresa",
  "url": "https://seu-site.com",
  "logo": "https://seu-site.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+55-11-9999-9999",
    "contactType": "customer service"
  }
}
</script>

<!-- Artigo/blog post -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Título do Artigo",
  "author": { "@type": "Person", "name": "Nome do Autor" },
  "datePublished": "2026-06-01",
  "dateModified": "2026-06-15"
}
</script>

<!-- FAQ (aparece no Google como accordion) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Pergunta 1?",
      "acceptedAnswer": { "@type": "Answer", "text": "Resposta 1." }
    }
  ]
}
</script>
```

---

### sitemap.xml básico

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://seu-site.com/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://seu-site.com/sobre/</loc>
    <lastmod>2026-06-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### robots.txt básico

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://seu-site.com/sitemap.xml
```

---

## Checklist pré-publicação SEO

**Técnico:**
- [ ] HTTPS ativo
- [ ] Canonical tags em todas as páginas
- [ ] sitemap.xml enviado ao Google Search Console
- [ ] robots.txt configurado
- [ ] 404 personalizado e funcional
- [ ] Redirecionamentos www → sem www (ou vice-versa) configurados

**On-page:**
- [ ] Uma H1 única por página com palavra-chave principal
- [ ] Title tag 50-60 caracteres
- [ ] Meta description 150-160 caracteres
- [ ] Imagens com alt text descritivo
- [ ] URLs amigáveis (sem `?id=123`, use `/nome-do-produto/`)

**Performance:**
- [ ] PageSpeed Insights: mobile > 70, desktop > 85
- [ ] Imagens em WebP/AVIF
- [ ] Fontes com font-display: swap

---

## Output esperado

Para uma página específica, entregue:
1. **Meta tags completas** prontas para colar no `<head>`
2. **Schema markup** adequado ao tipo de conteúdo
3. **Lista de ajustes** no HTML para melhorar semântica
4. **3 pontos de performance** mais críticos para resolver
5. **Estimativa de impacto** de cada ajuste (alto/médio/baixo)
