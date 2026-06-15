---
name: identidade-visual
description: Define identidade visual completa para um projeto — paleta de cores, tipografia, tokens de design, tom visual. Use ao iniciar um projeto novo ou quando precisar de consistência visual entre site, app e materiais de conteúdo.
---

## Argumento (marca, tipo de projeto, referências): $ARGUMENTS

---

## O que é identidade visual (no contexto de código)

Identidade visual = conjunto de decisões documentadas que garantem consistência.
No código, isso vira **design tokens** — variáveis CSS ou de configuração que todos os componentes usam.

Sem identidade definida: cada componente inventa sua própria cor, fonte e espaçamento.
Com identidade: um arquivo central controla tudo, mudança em um lugar reflete em todo o sistema.

---

## Processo de definição

### Passo 1 — Personalidade da marca

Escolha 3 adjetivos que descrevem o projeto. Eles guiam todas as decisões visuais:

| Personalidade | Tipografia | Cor dominante | Espaçamento |
|---|---|---|---|
| Profissional / Corporativo | Serif clássica + Sans limpa | Azul navy, cinza grafite | Generoso, estruturado |
| Moderno / Tech | Geometric sans | Preto, branco, 1 acento neon | Denso, eficiente |
| Criativo / Agência | Display expressiva | Paleta ousada, contraste alto | Assimétrico |
| Amigável / Consumer | Rounded sans | Cores quentes, saturadas | Médio, acolhedor |
| Elegante / Luxo | Serif fina + Script para detalhe | Preto, dourado ou off-white | Muito generoso |
| Energético / Esportivo | Condensed bold | Vermelho, laranja ou amarelo | Compacto, dinâmico |

### Passo 2 — Paleta de cores (tokens)

```css
:root {
  /* Cor principal — 60% do design */
  --color-brand-50:  #f0f4ff;
  --color-brand-100: #dde6ff;
  --color-brand-500: #3b5bdb;  /* ← cor de destaque principal */
  --color-brand-700: #2f4ac4;
  --color-brand-900: #1e3a8a;

  /* Neutros — 30% do design */
  --color-neutral-0:   #ffffff;
  --color-neutral-50:  #f8fafc;
  --color-neutral-100: #f1f5f9;
  --color-neutral-300: #cbd5e1;
  --color-neutral-500: #64748b;
  --color-neutral-700: #334155;
  --color-neutral-900: #0f172a;

  /* Acento — 10% do design */
  --color-accent: #f59e0b;  /* apenas para highlights, badges, CTAs secundários */

  /* Semânticos */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error:   #ef4444;
  --color-info:    #3b82f6;

  /* Papéis de cor (o que vai onde) */
  --bg-page:       var(--color-neutral-0);
  --bg-subtle:     var(--color-neutral-50);
  --bg-elevated:   var(--color-neutral-0);
  --text-primary:  var(--color-neutral-900);
  --text-secondary: var(--color-neutral-500);
  --text-disabled: var(--color-neutral-300);
  --border:        var(--color-neutral-200);
  --border-strong: var(--color-neutral-300);
}
```

**Regra 60-30-10:** cor principal 60% (fundos, áreas grandes), neutros 30% (texto, bordas), acento 10% (CTAs, destaques).

### Passo 3 — Tipografia

```css
:root {
  /* Famílias */
  --font-display: 'Fraunces', Georgia, serif;     /* headings expressivos */
  --font-body:    'Plus Jakarta Sans', system-ui;  /* texto corrido */
  --font-mono:    'JetBrains Mono', monospace;     /* código */

  /* Escala modular (razão 1.25 — Major Third) */
  --text-xs:   0.64rem;   /* 10.2px */
  --text-sm:   0.8rem;    /* 12.8px */
  --text-base: 1rem;      /* 16px   */
  --text-lg:   1.25rem;   /* 20px   */
  --text-xl:   1.563rem;  /* 25px   */
  --text-2xl:  1.953rem;  /* 31.2px */
  --text-3xl:  2.441rem;  /* 39px   */
  --text-4xl:  3.052rem;  /* 48.8px */
  --text-5xl:  3.815rem;  /* 61px   */

  /* Pesos */
  --font-normal:    400;
  --font-medium:    500;
  --font-semibold:  600;
  --font-bold:      700;
  --font-extrabold: 800;

  /* Line heights */
  --leading-tight:  1.1;   /* headings grandes */
  --leading-snug:   1.3;   /* headings médios */
  --leading-normal: 1.5;   /* corpo */
  --leading-relaxed: 1.7;  /* texto longo, artigos */

  /* Letter spacing */
  --tracking-tight:  -0.025em;  /* headings grandes */
  --tracking-normal:  0;
  --tracking-wide:    0.05em;   /* labels, badges */
  --tracking-widest:  0.1em;    /* caps, subheadings */
}
```

### Passo 4 — Espaçamento e layout

```css
:root {
  /* Escala de espaçamento (base 4px) */
  --space-1:   4px;
  --space-2:   8px;
  --space-3:   12px;
  --space-4:   16px;
  --space-5:   20px;
  --space-6:   24px;
  --space-8:   32px;
  --space-10:  40px;
  --space-12:  48px;
  --space-16:  64px;
  --space-20:  80px;
  --space-24:  96px;
  --space-32: 128px;

  /* Border radius */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-full: 9999px;  /* pílula */

  /* Sombras */
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.08);
  --shadow-md:  0 4px 12px rgba(0,0,0,0.10);
  --shadow-lg:  0 8px 24px rgba(0,0,0,0.12);
  --shadow-xl:  0 16px 48px rgba(0,0,0,0.15);

  /* Z-index scale */
  --z-base:    0;
  --z-raised:  10;
  --z-dropdown: 100;
  --z-modal:   1000;
  --z-toast:   2000;

  /* Container */
  --container-sm:  640px;
  --container-md:  768px;
  --container-lg:  1024px;
  --container-xl:  1280px;
  --container-2xl: 1536px;
}
```

### Passo 5 — Componentes base

```css
/* Botão primário */
.btn-primary {
  background: var(--color-brand-500);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
}
.btn-primary:hover {
  background: var(--color-brand-700);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Card */
.card {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}

/* Input */
.input {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  transition: border-color 0.15s, box-shadow 0.15s;
}
.input:focus {
  outline: none;
  border-color: var(--color-brand-500);
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--color-brand-500) 20%, transparent);
}
```

---

## Output esperado

Para um projeto novo, entregue:
1. **Arquivo `tokens.css`** com todas as variáveis CSS organizadas
2. **Paleta visual** — lista de cores com código hex e papel de cada uma
3. **Tipografia escolhida** — fontes, onde usar cada uma, escala de tamanhos
4. **Guia de uso resumido** — 1 página com as regras principais
5. **Snippet de botão + card + input** usando os tokens

Para auditar identidade existente:
1. Quais tokens estão definidos vs. valores hardcoded
2. Inconsistências (cores repetidas com valores diferentes, fontes misturadas)
3. O que centralizar primeiro para maior ganho de consistência
