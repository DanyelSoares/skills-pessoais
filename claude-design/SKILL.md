---
name: claude-design
description: Guia para usar o Claude Design (claude.ai/design) — ferramenta de prototipagem visual da Anthropic para criar protótipos, slides, landing pages, wireframes e mockups sem código. Use quando quiser criar ou briefar um design visual antes de codificar.
user-invocable: true
---

## Argumento (o que criar no Claude Design): $ARGUMENTS

---

## O que é Claude Design

Lançado em 17 de abril de 2026, o Claude Design é uma ferramenta da Anthropic Labs disponível em `claude.ai/design` (menu lateral esquerdo — ícone de paleta).

**Powered by:** Claude Opus 4.7 (modelo com visão mais avançado)
**Disponível para:** Claude Pro, Max, Team e Enterprise

**O que cria:**
- Protótipos interativos com código real (não mockups estáticos)
- Slides e apresentações com exportação para PPTX e Canva
- Landing pages e one-pagers
- Wireframes de features e fluxos de produto
- Assets de marketing (posts, banners, materiais de campanha)
- Interfaces com 3D, shaders, voice, video (modo "Frontier Design")

---

## Por que usar ANTES de codificar

O Claude Design não substitui o Claude Code — ele **precede** o código. O fluxo ideal:

```
Ideia → Claude Design (protótipo) → feedback/aprovação → Claude Code (implementação)
```

**Sem o Design:** você vai direto ao código e descobre problemas de layout/UX depois de horas de trabalho.
**Com o Design:** valida visual e fluxo em minutos, depois passa um bundle de handoff para o Claude Code implementar.

---

## Como funciona na prática

### 1. Iniciar um projeto

Acesse `claude.ai/design` e descreva o que quer:

```
"Crie uma landing page para um SaaS de gestão de tickets 
com plano gratuito e paid. Estilo clean, cores escuras, 
público de equipes de TI."
```

### 2. Refinar através de conversa

Após o primeiro resultado, ajuste em linguagem natural:
- "Torna o header mais impactante"
- "Adiciona uma seção de depoimentos antes do pricing"
- "Muda as cores para um tom mais vibrante"
- "Adiciona animação de entrada nos cards de features"

### 3. Edições diretas

- **Comentários inline:** clique em qualquer elemento para comentar
- **Edição direta de texto:** clique e edite no próprio protótipo
- **Sliders personalizados:** o Claude cria controles de ajuste (spacing, cores, tamanho) específicos para o seu projeto

### 4. Aplicar seu sistema de design

Durante o onboarding (ou depois via settings):
1. Aponte para seu repositório ou arquivo de design
2. Claude lê seu código e arquivos Figma
3. Todos os projetos futuros usam automaticamente suas cores, fontes e componentes

### 5. Exportar e fazer handoff

**Exportar:**
- PDF (estático)
- PPTX (slides editáveis)
- HTML standalone (código real)
- Canva (para editar e publicar)
- URL interna (compartilhar com equipe)

**Handoff para Claude Code:**
```
"Empacote esse design para implementação no Claude Code"
```
Claude gera um bundle com todas as especificações para o Claude Code implementar.

---

## Casos de uso práticos

### Para você (desenvolvedor/criador)

**Antes de codar qualquer projeto:**
```
"Crie um wireframe de [app/site/feature] com as seções 
[lista das seções]. Não precisa de estilo definitivo — 
quero validar o fluxo."
```

**Explorar direções de design:**
```
"Crie 3 variações de hero section para [produto]: 
uma minimalista, uma com imagem hero, uma com demo animado."
```

**Criar apresentação rápida:**
```
"Transforme esse documento [cole o texto] em uma 
apresentação de 8 slides com visualizações dos dados."
```

### Para conteúdo e marketing

**Post para redes sociais:**
```
"Crie um post visual para Instagram anunciando [novidade/produto]. 
Estilo: profissional mas acessível. Inclua: título, subtítulo, CTA."
```

**Landing page de lançamento:**
```
"Landing page para o lançamento de [produto/serviço]. 
Inclua: hero com proposta de valor, 3 benefícios principais, 
depoimento, pricing simplificado, CTA final."
```

---

## Import de fontes externas

Claude Design aceita:
- **Texto e documentos** (DOCX, PPTX, XLSX → transforma em design)
- **Imagens** (reference visual para estilo)
- **URL do seu site** (web capture para protótipos fiéis ao produto real)
- **Codebase** (onboarding lê seu repo para aprender o design system)

---

## Limites importantes

- **Não é Figma:** sem componentes reutilizáveis exportáveis, sem design system versionado
- **Não substitui designer:** para projetos com brand rigoroso ou múltiplas telas complexas, um designer ainda é necessário
- **Research preview:** funcionalidades podem mudar; nem tudo está disponível para todos os usuários simultaneamente
- **Colaboração limitada:** compartilhamento é por URL, sem edição simultânea real (em desenvolvimento)

---

## Integração com seu fluxo de skills

```
1. /claude-design → prototipa no claude.ai/design
2. Exporta HTML ou bundle de handoff
3. /site-premium ou /landing-page → Claude Code implementa
4. /design-anti-slop → audita o resultado
5. /animacoes-web → adiciona movimento
6. /deploy-web → publica
```

---

## Dicas de prompt para Claude Design

**Seja específico sobre o público:**
> "Para gestores de TI de médias empresas, não para devs individuais"

**Mencione o contexto de uso:**
> "Vai ser exportado para PPTX e apresentado em reunião executiva"

**Dê referências visuais:**
> "Inspiração: Notion, Linear — clean, muito whitespace, tipografia forte"

**Defina o que NÃO quer:**
> "Sem gradientes coloridos, sem ícones ilustrativos — quero algo mais sério"
