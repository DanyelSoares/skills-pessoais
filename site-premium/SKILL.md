---
name: site-premium
description: Constrói sites com design profissional, não genérico — layouts intencionais, tipografia forte, animações fluidas, sem "AI slop". Use para sites de portfólio, landing pages, sites institucionais, apps web que precisam parecer caros e personalizados.
---

## Argumento (tipo de site ou briefing): $ARGUMENTS

---

## Filosofia de design

Claude Code sem orientação produz "AI slop": Inter em tudo, gradiente roxo-azul, cards empilhados, ícones arredondados sobre cada título, texto cinza sobre fundo colorido. Esse site não é isso.

**Princípios inegociáveis:**

- **Tipografia é a fundação** — escolha uma família serif expressiva para headings + uma sans neutra para corpo. Nunca Inter/DM Sans como escolha padrão.
- **Cor com intenção** — palette de 2-3 cores máximo. Uma delas é dominante (>60%). Sem gradientes genéricos.
- **Espaço é design** — whitespace generoso. Seções com respiração real entre elas.
- **Hierarquia visual clara** — o olho deve saber onde ir primeiro, segundo, terceiro sem pensar.
- **Movimento com propósito** — animações que guiam atenção, não decoram.

---

## Checklist de um site de R$10.000 (vs R$200)

Antes de gerar qualquer código, confirme mentalmente cada item:

**Identidade**
- [ ] Tipografia diferenciada da escolha padrão do modelo
- [ ] Paleta coerente com personalidade da marca, não com tendências genéricas
- [ ] Logo/marca integrada ao layout, não apenas colada no header
- [ ] Voz visual consistente em todas as seções

**Layout**
- [ ] Grid intencional — colunas assimétricas onde faz sentido
- [ ] Hierarquia de tamanho real (h1 muito maior que h2, h2 visivelmente maior que h3)
- [ ] Margens/paddings em escala consistente (sistema 4px ou 8px)
- [ ] Responsivo com breakpoints pensados, não apenas "flex-wrap"

**Hero / primeira dobra**
- [ ] Proposta de valor clara em menos de 5 segundos de leitura
- [ ] CTA principal visível sem scroll
- [ ] Imagem ou visual que suporta a mensagem, não decora

**Conteúdo**
- [ ] Texto persuasivo, não descritivo ("o que você ganha" antes de "o que é")
- [ ] Social proof (depoimentos, números, logos) se aplicável
- [ ] FAQ ou seção de objeções se produto/serviço complexo

**Técnica**
- [ ] Performance: imagens com lazy load, fontes com font-display: swap
- [ ] Acessibilidade: contraste suficiente, alt text, roles semânticos
- [ ] Meta tags completas (title, description, OG)

---

## Stack padrão

**HTML/CSS puro:** use CSS custom properties para tokens, CSS Grid para layout principal, Flexbox para alinhamento interno. Sem frameworks externos.

**React/Next.js:** Tailwind para utilitários, mas nunca apenas Tailwind — componentes com CSS Modules ou styled-components para design específico.

**Animações:** CSS transitions para hover, CSS `@keyframes` para entrada de elementos, Intersection Observer para scroll-triggered. GSAP apenas se solicitado.

**Fontes:** Google Fonts (gratuitas) — preferir: Playfair Display, Lora, Fraunces (serifs), Plus Jakarta Sans, Syne, Space Grotesk (sans modernas).

---

## Processo de geração

### 1. Brief (se não fornecido, infira do argumento)
- Quem é o público?
- Qual é a ação principal que o visitante deve tomar?
- Qual personalidade visual? (elegante/tech/criativo/institucional/jovem)

### 2. Escolhas de design (declare antes de codar)
- Tipografia escolhida e justificativa
- Paleta de cores (hex) com papel de cada cor
- Estilo de layout (clean/denso/editorial/minimalista)

### 3. Estrutura de seções
Construa na ordem: Hero → Problema/Solução → Social proof → CTA principal → Footer

### 4. Polish passes (pelo menos 2)
**Pass 1:** tudo funcional e responsivo
**Pass 2:** revisar tipografia, espaçamento, hover states, mobile — o que parece genérico? Tornar específico.

---

## Anti-padrões proibidos

- ❌ Gradiente roxo-azul no hero
- ❌ Inter ou DM Sans como única fonte
- ❌ Cards com border-radius: 12px em tudo
- ❌ Ícone SVG arredondado acima de cada feature
- ❌ "Lorem ipsum" ou texto de placeholder no output final
- ❌ Seções sem identidade visual própria (todas iguais)
- ❌ Animações sem propósito (girar, pulsar sem motivo)
- ❌ Cores de botão que não contrastam com o fundo
