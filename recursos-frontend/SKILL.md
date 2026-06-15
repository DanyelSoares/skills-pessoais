---
name: recursos-frontend
description: Referências curadas de recursos frontend — fontes, ícones, cores, animações, imagens, acessibilidade, performance, ferramentas de CSS e muito mais. Use quando precisar de qualquer recurso visual, ferramenta ou biblioteca para frontend.
user-invocable: true
---

## Argumento (tipo de recurso ou necessidade): $ARGUMENTS

---

## Fontes e Tipografia

**Google Fonts** — `fonts.google.com`
Gratuitas, open-source. Para uso no código:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;700&family=Plus+Jakarta+Sans:wght@400;600&display=swap" rel="stylesheet">
```

**Fontes recomendadas por estilo:**
- Elegante/editorial: Fraunces, Playfair Display, Lora, DM Serif Display
- Moderno/tech: Space Grotesk, Syne, Geist, IBM Plex Sans
- Neutro premium: Plus Jakarta Sans, General Sans, Satoshi
- Monospace: JetBrains Mono, Fira Code, Geist Mono

**Font pair** — `fontpair.co` → sugestões de combinação de fontes
**Typescale** — `typescale.com` → gerador visual de escala tipográfica (ferramenta interativa)

---

## Ícones

**Lucide** — `lucide.dev` → open-source, React-friendly, 1500+ ícones
```bash
npm install lucide-react
```
```jsx
import { Search, ArrowRight, Check } from 'lucide-react';
```

**Heroicons** — `heroicons.com` → Tailwind Labs, outline e solid
**Phosphor Icons** — `phosphoricons.com` → mais expressivos, múltiplos pesos
**Tabler Icons** — `tabler.io/icons` → 5000+ ícones SVG gratuitos
**Remix Icon** — `remixicon.com` → sistema dual (line/fill)

**Para SVG inline:**
```html
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <!-- path do ícone -->
</svg>
```

---

## Cores e Paletas

**Coolors** — `coolors.co` → gerador de paletas aleatórias, exporta CSS variables
**Oklch Picker** — `oklch.com` → paletas com oklch (perceptualmente uniforme, recomendado)
**Radix Colors** — `radix-ui.com/colors` → sistema de 12 passos, acessível, dark mode nativo
**Open Color** — `yeun.github.io/open-color` → paleta open-source com 18 cores × 10 tons
**Tailwind Colors** — `tailwindcss.com/docs/customizing-colors` → referência completa

**Verificar contraste WCAG:**
- `webaim.org/resources/contrastchecker` — AA (4.5:1 normal, 3:1 grande)
- `whocanuse.com` — simula como diferentes pessoas veem o contraste

---

## Imagens e Mídia Gratuitas

**Unsplash** — `unsplash.com` → fotos de alta qualidade, gratuitas
**Pexels** — `pexels.com` → fotos e vídeos gratuitos
**Undraw** — `undraw.co` → ilustrações SVG customizáveis por cor
**Storyset** — `storyset.com` → ilustrações animadas, exporta SVG
**Blush** — `blush.design` → ilustrações com estilo consistente

**Para uso em código (placeholders):**
```html
<!-- Placeholder com dimensões específicas -->
<img src="https://picsum.photos/400/300" alt="placeholder">
<!-- Mesma imagem sempre (seed) -->
<img src="https://picsum.photos/seed/meuapp/400/300" alt="placeholder">
```

---

## CSS — Ferramentas e Geradores

**Easing Functions** — `easings.net`
```css
/* Equivalentes em CSS */
.easeInOut { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.easeOutBack { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
```

**CSS Grid Generator** — `cssgrid.io` → gera código de grid visualmente
**Flexbox Froggy** — `flexboxfroggy.com` → aprende flexbox jogando
**CSS Clip-path Maker** — `bennettfeely.com/clippy` → shapes com clip-path
**Neumorphism** — `neumorphism.io` → gerador de box-shadow para neumorfismo
**Glassmorphism** — `ui.glass/generator` → backdrop-filter + blur
**Blob Generator** — `blobmaker.app` → formas orgânicas com SVG
**Gradient Generator** — `cssgradient.io` → gradientes visuais com código

**Centrar elementos (referência rápida):**
```css
/* Flexbox — mais simples */
.pai { display: flex; align-items: center; justify-content: center; }

/* Grid */
.pai { display: grid; place-items: center; }

/* Absolute (posição conhecida) */
.filho { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
```

---

## Animações e Motion

**Animate.css** — `animate.style` → classes CSS prontas
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
<div class="animate__animated animate__fadeInUp">Conteúdo</div>
```

**Framer Motion** — `framer.com/motion` → React, declarativo
```bash
npm install framer-motion
```
```jsx
import { motion } from 'framer-motion';
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Conteúdo
</motion.div>
```

**GSAP** — `gsap.com` → mais poderoso, via CDN
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

**Lottie** — `lottiefiles.com` → animações After Effects em JSON, leves
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"></script>
```

---

## Componentes e UI Kits

**shadcn/ui** — `ui.shadcn.com` → componentes React/Radix UI + Tailwind, copy-paste
```bash
npx shadcn@latest init
npx shadcn@latest add button card dialog
```

**Radix UI** — `radix-ui.com` → primitivos acessíveis sem estilo
**Headless UI** — `headlessui.com` → Tailwind Labs, totalmente acessível
**DaisyUI** — `daisyui.com` → componentes Tailwind sem JS
**MUI** — `mui.com` → Material Design para React
**Mantine** — `mantine.dev` → componentes React completos

**21st.dev** — `21st.dev/community/components`
Categorias com código React pronto para copiar:
- Heroes, Features, CTAs, Pricing → Marketing Blocks
- Buttons (130+), Cards (79+), Modals (37+) → UI Components
- Shaders, Backgrounds, Text effects → Visual Effects

---

## Performance

**PageSpeed Insights** — `pagespeed.web.dev` → análise Core Web Vitals
**WebPageTest** — `webpagetest.org` → teste de velocidade detalhado
**Squoosh** — `squoosh.app` → comprimir imagens sem perda visual
**SVGOMG** — `jakearchibald.github.io/svgomg` → otimizar SVG
**Bundlephobia** — `bundlephobia.com` → verificar tamanho de pacotes npm antes de instalar

**Lazy loading nativo:**
```html
<img src="foto.jpg" loading="lazy" alt="descrição">
<iframe src="..." loading="lazy"></iframe>
```

---

## Acessibilidade

**Axe DevTools** — extensão Chrome para auditoria de acessibilidade
**WAVE** — `wave.webaim.org` → verificar acessibilidade de qualquer URL
**Aria Roles** — `developer.mozilla.org/docs/Web/Accessibility/ARIA`

**Checklist básico:**
```html
<!-- Alt em imagens -->
<img src="foto.jpg" alt="Descrição real da imagem">
<img src="decorativa.jpg" alt="">  <!-- decorativas: alt vazio -->

<!-- Labels em formulários -->
<label for="email">Email</label>
<input id="email" type="email" name="email">

<!-- Botões com texto acessível -->
<button aria-label="Fechar modal">
  <svg>...</svg>  <!-- ícone sem texto visível -->
</button>

<!-- Skip link -->
<a href="#conteudo" class="sr-only focus:not-sr-only">Ir para o conteúdo</a>
```

---

## Referências e Documentação

**MDN Web Docs** — `developer.mozilla.org` → referência HTML/CSS/JS mais completa
**CSS Tricks** — `css-tricks.com` → tutoriais e guias práticos
**Can I Use** — `caniuse.com` → suporte de browsers para qualquer feature CSS/JS
**Dev Docs** — `devdocs.io` → documentação offline de múltiplas tecnologias

**HTML5 & CSS3** — `tableless.github.io/tableless` → referência dos recursos modernos
**CSS Reference** — `cssreference.io` → guia visual de propriedades CSS com exemplos

---

## Inspiração Visual

| Site | Melhor para |
|---|---|
| **Dribbble** — dribbble.com | Componentes individuais, microinterações, cores |
| **Awwwards** — awwwards.com | Sites completos premiados, UX avançada |
| **Behance** — behance.net | Projetos de branding, UI kits completos |
| **Mobbin** — mobbin.com | Patterns de UX mobile, fluxos de apps reais |
| **Pinterest** — pinterest.com | Inspiração livre, moodboard, ambientes, cores |
| **Landingfolio** — landingfolio.com | Landing pages de produtos SaaS |
| **Lapa Ninja** — lapa.ninja | Landing pages categorizadas por estilo |
