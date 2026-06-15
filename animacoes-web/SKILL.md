---
name: animacoes-web
description: Adiciona animações profissionais a interfaces web — scroll-triggered, hover, entrada de elementos, transições de página. Use quando quiser movimento com propósito, não decorativo. Funciona com CSS puro, Intersection Observer e GSAP.
---

## Argumento (o que animar / tipo de efeito): $ARGUMENTS

---

## Princípios de movimento com propósito

Animação ruim decora. Animação boa **guia atenção** e **comunica estado**.

**Animação tem propósito quando:**
- Indica hierarquia (o que aparece primeiro é mais importante)
- Confirma uma ação (feedback de clique, envio de formulário)
- Cria senso de espaço (paralax sutil, profundidade)
- Retém atenção no momento certo (hero animado enquanto a página carrega)

**Animação é decorativa (evitar) quando:**
- Acontece sem trigger do usuário ou do scroll
- Não comunica nada sobre o conteúdo
- Demora mais de 600ms (o usuário espera, não aprecia)

---

## Categorias de animação

### 1. Entrada de elementos (scroll-triggered)

Implementação com Intersection Observer — sem dependência:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
```

```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Variações de entrada:**
- `translateY(24px)` → sobe (padrão, suave)
- `translateX(-32px)` → entra da esquerda
- `scale(0.95)` → cresce suavemente
- `translateY(16px) + scale(0.98)` → combinado (mais sofisticado)

**Stagger (atraso entre elementos de uma lista):**
```css
.card:nth-child(1) { transition-delay: 0ms; }
.card:nth-child(2) { transition-delay: 80ms; }
.card:nth-child(3) { transition-delay: 160ms; }
```

---

### 2. Hover states

```css
/* Botão */
.btn {
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
.btn:active {
  transform: translateY(0);
}

/* Card clicável */
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.12);
}

/* Link com underline animado */
.link {
  position: relative;
  text-decoration: none;
}
.link::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0;
  width: 0; height: 2px;
  background: currentColor;
  transition: width 0.25s ease;
}
.link:hover::after { width: 100%; }
```

---

### 3. Animações de hero / loading

```css
/* Fade + slide do título principal */
@keyframes heroTitle {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero-title {
  animation: heroTitle 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.hero-subtitle {
  animation: heroTitle 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
}
.hero-cta {
  animation: heroTitle 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}

/* Counter animado (números que sobem) */
```

```javascript
function animateCounter(el, end, duration = 1500) {
  let start = 0;
  const step = end / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    el.textContent = Math.floor(Math.min(start, end)).toLocaleString();
    if (start >= end) clearInterval(timer);
  }, 16);
}
```

---

### 4. Parallax (com CSS moderno)

```css
/* CSS scroll-driven (sem JS, Chrome 115+) */
@keyframes parallax {
  from { transform: translateY(0); }
  to   { transform: translateY(-80px); }
}
.parallax-bg {
  animation: parallax linear both;
  animation-timeline: scroll();
  animation-range: 0% 100%;
}
```

---

### 5. GSAP (quando precisa de mais controle)

Usar apenas quando CSS não é suficiente. Incluir via CDN:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

```javascript
// Sequência de entrada com ScrollTrigger
gsap.from('.feature-card', {
  scrollTrigger: { trigger: '.features', start: 'top 75%' },
  y: 40, opacity: 0, duration: 0.6,
  stagger: 0.1, ease: 'power2.out'
});

// Texto que aparece palavra por palavra
gsap.from('.headline span', {
  y: 60, opacity: 0, rotateX: -30,
  duration: 0.8, stagger: 0.05,
  ease: 'back.out(1.5)'
});
```

---

## Guia de timing

| Elemento | Duração recomendada |
|---|---|
| Hover simples (cor, sombra) | 100-150ms |
| Hover com transform | 150-200ms |
| Entrada de elemento | 400-600ms |
| Sequência de elementos (stagger) | 60-120ms entre cada |
| Transição de página | 300-400ms |
| Animação de hero | 600-900ms |
| Nada deve durar | > 1000ms |

**Easing recomendado:**
- Entrando: `cubic-bezier(0.16, 1, 0.3, 1)` (rápido no início, suave no fim)
- Saindo: `cubic-bezier(0.4, 0, 1, 1)` (suave no início, rápido no fim)
- Spring: `cubic-bezier(0.34, 1.56, 0.64, 1)` (ultrapassa levemente)

---

## Acessibilidade

Sempre respeitar preferência de movimento reduzido:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Output esperado

Entregue o código das animações solicitadas com:
1. CSS/JS completo e funcional
2. Comentários explicando cada escolha de timing/easing
3. Versão sem animação (fallback) para `prefers-reduced-motion`
4. Onde inserir no HTML existente (seletores exatos)
