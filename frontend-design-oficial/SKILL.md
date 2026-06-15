---
name: frontend-design-oficial
description: Cria interfaces frontend distintivas e de qualidade de produção, rejeitando estética genérica de IA. Use para qualquer componente web, página, aplicação ou interface que precise ser visualmente memorável — não apenas funcional.
---

## Contexto do projeto

```!
ls src/ 2>/dev/null | head -10 || ls 2>/dev/null | head -10
```

## Argumento (o que construir): $ARGUMENTS

---

## Design Thinking — antes de qualquer código

Entenda o contexto e comprometa-se com uma **direção estética OUSADA**:

**Propósito:** Que problema esta interface resolve? Quem usa?

**Tom — escolha um extremo:**
- Brutalmente minimal
- Caos maximalista
- Retro-futurista
- Orgânico/natural
- Luxo/refinado
- Lúdico/brinquedo
- Editorial/revista
- Brutalista/cru
- Art déco/geométrico
- Soft/pastel
- Industrial/utilitário

**Diferenciação:** O que torna isso **INESQUECÍVEL**? O que o usuário vai lembrar?

**CRÍTICO:** Escolha uma direção conceitual clara e execute com precisão. Maximalismo ousado e minimalismo refinado funcionam igualmente — a chave é **intencionalidade, não intensidade**.

---

## Implementação

Após definir a direção estética, implemente código funcional (HTML/CSS/JS, React, Vue, etc.) que seja:

- **Production-grade e funcional** — nada de placeholders
- **Visualmente marcante e memorável**
- **Coerente** com um ponto de vista estético claro
- **Meticulosamente refinado** em cada detalhe

### Pilares de design

**Tipografia — fundação de tudo**
- Escolha fontes belas, únicas, interessantes
- Evite fontes genéricas como Arial e Inter como escolha padrão
- Prefira escolhas com caráter que elevem a estética
- Hierarquia de tamanho real (h1 significativamente maior que h2)
- Letter-spacing e line-height definidos intencionalmente

**Cor e tema**
- Use CSS custom properties (`--color-*`, `--bg-*`, `--text-*`) para todos os tokens
- Palette coerente com a direção estética escolhida
- Modos claro/escuro quando fizer sentido
- Nunca: gradiente roxo-azul como escolha padrão

**Movimento e interação**
- Animações CSS com propósito — guiam atenção, confirmam ações
- Scroll-triggered effects quando amplifica a narrativa
- Hover states com transform + shadow (não apenas mudança de cor)
- Timing: 150ms hover, 400-600ms entrada, nunca >1000ms

**Composição espacial**
- Whitespace como elemento de design, não vazio a preencher
- Grid assimétrico onde faz sentido criativo
- Elementos âncora que criam peso visual
- Margens em escala consistente (sistema 4px ou 8px)

**Textura e detalhe**
- Gradientes sutis, ruído, bordas, sombras com personalidade
- Microdetalhes que só aparecem em zoom — sinal de qualidade
- Bordas e separadores com caráter, não apenas `1px solid #eee`

---

## Escala de complexidade

**Para designs minimalistas refinados:**
- CSS limpo e preciso
- Código simples que implementa as escolhas com perfeição
- Cada elemento justificado

**Para designs maximalistas elaborados:**
- CSS Grid complexo, layers múltiplos, animações encadeadas
- JavaScript para interações sofisticadas
- Cada seção com identidade visual própria

---

## Proibições absolutas

- ❌ Inter ou DM Sans como única fonte (clichê de IA)
- ❌ Gradiente roxo → azul no hero
- ❌ Cards idênticos com ícone arredondado + título + texto × 3 ou × 6
- ❌ Background alternando branco/cinza-claro sem variação real
- ❌ Placeholder ou lorem ipsum no output final
- ❌ Botões sem hover state
- ❌ Imagens sem `alt`, sem dimensões, sem `loading="lazy"`
- ❌ `border-radius: 12px` em tudo indiscriminadamente
- ❌ Animações sem propósito (girar, pulsar sem motivo)

---

## Output

Entregue código completo e funcional. Declare a direção estética escolhida e a justificativa antes de mostrar o código.

Se o pedido for um componente isolado: HTML + CSS + JS num único arquivo.
Se for uma página: estrutura semântica completa com `<head>` e meta tags.
Se for React/Vue: componente com styles próprios.
