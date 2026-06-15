---
name: componentes-ui
description: Cria e busca componentes UI de alta qualidade — heroes, cards, buttons, modals, navbars, pricing sections, forms e muito mais. Usa padrões de 21st.dev, Bootstrap 5 e referências visuais de Dribbble/Awwwards. Use quando precisar de qualquer componente de interface pronto ou inspiração de design.
---

## Argumento (componente ou tipo de interface): $ARGUMENTS

---

## Ecossistema de referências

### 21st.dev — Componentes React/Tailwind da comunidade
O maior marketplace de componentes prontos para copiar. Categorias principais disponíveis:

**Marketing Blocks:**
- Heroes (73 variações), Features (36), CTAs (34), Pricing Sections (17)
- Testimonials (15), Footers (14), Navigation Menus (11)
- Backgrounds (33), Borders (12), Shaders (15), Texts (58)

**UI Components:**
- Buttons (130), Cards (79), Dialogs/Modals (37), Forms, Inputs
- Calendars (34), Tables, Badges (25), Alerts (23), Avatars (17)
- AI Chats (30), Carousels (16), Accordions (40)

**Como usar:** Descreva o componente → Claude gera código inspirado nos padrões de 21st.dev.

### Bootstrap 5 — Sistema de grid e componentes sólidos
Framework CSS mais estável para projetos que precisam de consistência rápida.

**Grid system:** 12 colunas, breakpoints: xs (<576px), sm (≥576), md (≥768), lg (≥992), xl (≥1200), xxl (≥1400)

**Componentes principais:** Navbar, Modal, Accordion, Carousel, Toast, Offcanvas, Dropdown, Tabs, Badge, Alert, Progress

**Utilitários:** `d-flex`, `gap-*`, `p-*`, `m-*`, `text-*`, `bg-*`, `rounded-*`, `shadow-*`

### Dribbble / Awwwards — Inspiração visual
- **Dribbble:** design detalhado de componentes individuais, cores, microinterações
- **Awwwards:** sites completos com design premiado, foco em experiência

---

## Como gerar componentes

### 1. Componente simples (React + Tailwind)

```tsx
// Exemplo: Card de produto com animação
interface ProductCardProps {
  title: string;
  price: number;
  image: string;
  badge?: string;
}

export function ProductCard({ title, price, image, badge }: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-sm 
                    border border-neutral-100 hover:shadow-lg 
                    transition-all duration-300 hover:-translate-y-1">
      {badge && (
        <span className="absolute top-3 left-3 z-10 px-2 py-1 
                         text-xs font-semibold bg-black text-white rounded-full">
          {badge}
        </span>
      )}
      <div className="aspect-square overflow-hidden">
        <img src={image} alt={title} 
             className="w-full h-full object-cover group-hover:scale-105 
                        transition-transform duration-500" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 truncate">{title}</h3>
        <p className="text-lg font-bold text-neutral-900 mt-1">
          R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}
```

### 2. Hero section com gradiente e CTA

```html
<section class="relative min-h-screen flex items-center overflow-hidden bg-neutral-950">
  <!-- Background grain texture -->
  <div class="absolute inset-0 opacity-30"
       style="background-image: url('data:image/svg+xml,...')"></div>
  
  <div class="relative z-10 max-w-5xl mx-auto px-6 text-center">
    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
                border border-white/10 bg-white/5 text-sm text-white/60 mb-8">
      <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
      Agora disponível
    </div>
    <h1 class="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
      Título que <span class="text-transparent bg-clip-text 
                              bg-gradient-to-r from-violet-400 to-cyan-400">
        para o scroll
      </span>
    </h1>
    <p class="mt-6 text-lg text-white/60 max-w-2xl mx-auto">
      Subheadline com proposta de valor clara.
    </p>
    <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
      <button class="px-8 py-3.5 bg-white text-black font-semibold rounded-full
                     hover:bg-white/90 transition-colors">
        Começar agora
      </button>
      <button class="px-8 py-3.5 border border-white/20 text-white rounded-full
                     hover:bg-white/5 transition-colors">
        Ver demonstração
      </button>
    </div>
  </div>
</section>
```

### 3. Pricing section com destaque

```html
<div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
  <!-- Plano popular (destacado) -->
  <div class="relative md:scale-105 md:-my-4 bg-black text-white rounded-3xl p-8 shadow-2xl">
    <div class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 
                bg-violet-500 text-white text-xs font-bold rounded-full">
      MAIS POPULAR
    </div>
    <h3 class="text-xl font-bold">Pro</h3>
    <div class="mt-4 flex items-baseline gap-1">
      <span class="text-4xl font-black">R$97</span>
      <span class="text-white/50">/mês</span>
    </div>
    <ul class="mt-6 space-y-3">
      <li class="flex items-center gap-3 text-white/80">
        <svg class="w-5 h-5 text-violet-400 shrink-0" ...>✓</svg>
        Feature importante
      </li>
    </ul>
    <button class="mt-8 w-full py-3 bg-violet-500 text-white font-semibold 
                   rounded-xl hover:bg-violet-400 transition-colors">
      Começar agora
    </button>
  </div>
</div>
```

---

## Padrões de componentes por categoria

### Navbar
- Logo à esquerda, links no centro, CTA à direita
- Mobile: hamburger menu com overlay fullscreen ou slide lateral
- Sticky com backdrop-blur ao scrollar: `position:sticky + backdrop-filter:blur(12px)`

### Modal / Dialog
- Overlay com `opacity:0.6` sobre `rgba(0,0,0)`
- Conteúdo centralizado com `max-width` e padding interno
- Fechar ao clicar fora (event listener no overlay) e tecla Escape
- Animação: scale 0.95→1 + opacity 0→1 em 200ms

### Form inputs modernos
```css
.input {
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 15px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.input:focus {
  outline: none;
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
}
```

### Toast / Notification
- Posição: bottom-right (mobile: bottom-center)
- Auto-dismiss: 4-5 segundos
- Stack com gap entre múltiplos toasts
- Variantes: success (verde), error (vermelho), warning (amarelo), info (azul)

---

## Shaders e efeitos avançados (21st.dev)

Para efeitos de background com WebGL/Canvas:

```javascript
// Gradient mesh animado (CSS puro)
.gradient-bg {
  background: 
    radial-gradient(ellipse at 20% 50%, rgba(120,40,200,0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(0,200,255,0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 80%, rgba(255,100,50,0.15) 0%, transparent 50%),
    #0a0a0a;
  animation: gradientShift 8s ease infinite alternate;
}
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
```

---

## Referências para buscar inspiração

| Necessidade | Onde buscar |
|---|---|
| Componente específico (button, card, modal) | 21st.dev → categoria específica |
| Visual geral de um produto/startup | Dribbble → busca por tipo de produto |
| Site completo premium | Awwwards → categoria ou most-awarded |
| Bootstrap rápido | getbootstrap.com/docs/5.3/components/ |

---

## Output esperado

Para qualquer componente solicitado, entregue:
1. **Código completo** — HTML/CSS/JS ou React/Tailwind, pronto para usar
2. **Variações** — pelo menos 2 versões (ex: com/sem dark mode, compacto/expandido)
3. **Estados** — hover, focus, disabled, loading quando aplicável
4. **Responsividade** — mobile-first, breakpoints explícitos
