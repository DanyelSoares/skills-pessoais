---
name: design-anti-slop
description: Audita e corrige design genérico de AI ("AI slop") em qualquer interface — sites, dashboards, componentes. Use quando o resultado parecer genérico, com "cara de IA", ou quando quiser elevar a qualidade visual sem redesign completo.
---

## Argumento (o que auditar/corrigir): $ARGUMENTS

---

## O que é AI Slop

AI slop é o conjunto de padrões visuais que os modelos reproduzem por padrão porque foram treinados em templates genéricos. É funcional, mas imediatamente reconhecível como "feito por IA":

**Typography slop:**
- Inter ou DM Sans em 100% do texto
- Hierarquia fraca (h1 apenas 1.5× maior que h2)
- Line-height e letter-spacing no default do browser

**Color slop:**
- Gradiente roxo → azul no hero
- `#6366f1` (Indigo-500 do Tailwind) como cor de destaque
- Texto cinza `#64748b` sobre tudo

**Layout slop:**
- Cards com border-radius: 12px empilhados em grid 3 colunas
- Ícone arredondado acima de cada feature (ícone + título + texto × 3 ou × 6)
- Seções alternando background branco / cinza claro sem variação

**Motion slop:**
- Nenhuma animação, ou fade-in em tudo sem diferenciação
- Hover apenas muda cor do botão

---

## Diagnóstico (execute primeiro)

Analise o código/design fornecido e pontue de 0 a 10 cada dimensão:

| Dimensão | Pontuação | Problemas encontrados |
|---|---|---|
| Tipografia | /10 | |
| Cor e contraste | /10 | |
| Layout e espaçamento | /10 | |
| Hierarquia visual | /10 | |
| Movimento/interação | /10 | |
| **Total** | /50 | |

**< 25:** redesign necessário
**25-35:** correções cirúrgicas resolvem
**> 35:** polish fino suficiente

---

## Correções por nível de impacto

### Alto impacto (fazer primeiro)

**Tipografia:**
- Substituir Inter por fonte com personalidade para headings
  - Editorial: Fraunces, Playfair Display, Lora
  - Tech/moderno: Syne, Space Grotesk, Plus Jakarta Sans
  - Neutro premium: Geist, IBM Plex Sans
- Aumentar contraste de tamanho entre h1, h2, h3 (mínimo 1.4× entre cada nível)
- Definir line-height por tamanho: headings 1.1-1.2, corpo 1.5-1.7

**Cor:**
- Identificar a cor dominante e criar 1 cor de acento real (não Indigo-500)
- Usar HSL ou OKLCH para variações consistentes da mesma cor
- Verificar contraste WCAG AA: texto normal mín. 4.5:1, grande 3:1

**Espaçamento:**
- Definir escala (4px base): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128
- Padding de seções: mínimo 80px top/bottom em desktop
- Gap entre elementos relacionados: menor que gap entre seções

### Médio impacto

**Layout:**
- Quebrar simetria onde possível: texto 60% / visual 40%, não 50/50
- Seções alternadas com variação real, não apenas cor de fundo
- Elementos âncora que criam peso visual (uma foto grande, um número enorme)

**Hover states:**
- Botões: mudança de cor + transform: translateY(-2px) + box-shadow
- Cards clicáveis: border ou shadow no hover
- Links de texto: underline animado ou cor de acento

### Baixo impacto (polish)

**Micro-interações:**
- Focus states visíveis (outline com cor de acento, não default do browser)
- Transições de 150-200ms para elementos pequenos, 250-350ms para grandes
- Cursor: pointer em todos os elementos clicáveis

**Detalhes:**
- Imagens com object-fit: cover e aspect-ratio definido
- Ícones SVG com tamanho consistente (16, 20 ou 24px — escolher um)
- Border-radius variado: botões arredondados + cards com raio menor

---

## Vocabulário de comandos rápidos

Após a auditoria, você pode usar estes comandos para refinamento:

- **`polish`** — uma passagem de melhoria geral no código atual
- **`bolder`** — tornar mais ousado: aumentar contraste, tamanho, impacto
- **`quieter`** — reduzir ruído visual: menos elementos, mais espaço
- **`animate`** — adicionar movimento com propósito
- **`critique`** — nova rodada de análise após mudanças

---

## Output esperado

1. Pontuação de diagnóstico com problemas específicos (não genéricos)
2. Lista priorizada de correções com justificativa
3. Código corrigido apenas das partes problemáticas (diff, não arquivo completo)
4. Pontuação estimada após as correções
