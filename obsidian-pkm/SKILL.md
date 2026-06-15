---
name: obsidian-pkm
description: Trabalha com o vault do Obsidian como base de conhecimento pessoal — criar notas, organizar ideias, conectar conceitos, gerar resumos e manter o sistema de segundo cérebro. Use quando trabalhar dentro do vault ou quando quiser conectar Claude ao Obsidian.
paths: ["**/*.md", "**/vault/**", "**/.obsidian/**"]
---

## Contexto do vault

```!
ls -la 2>/dev/null | head -20 || echo "[execute dentro do diretório do vault]"
```

```!
cat .obsidian/app.json 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print('Vault:', d.get('baseFontSize','?'))" 2>/dev/null || echo "[vault detectado]"
```

## Argumento: $ARGUMENTS

---

## O que é o Obsidian + Claude

O Obsidian armazena tudo como arquivos Markdown locais — você possui os dados, sem dependência de nuvem. Conectado ao Claude, o vault se torna uma base de conhecimento viva que o Claude pode ler, criar e atualizar.

**Por que Obsidian supera outras ferramentas para uso com IA:**
- 2.700+ plugins, suporte a qualquer modelo de IA
- Acesso offline total, dados ficam no seu computador
- Links bidirecionais (`[[nota]]`) criam grafo de conhecimento
- Frontmatter YAML permite metadata estruturada
- Claude pode ler, criar e editar arquivos diretamente via filesystem

---

## Formas de conectar Claude ao Obsidian

### Modo 1 — Claude Code no diretório do vault (mais simples)
```bash
cd ~/Documents/Obsidian/MeuVault
claude
```
Claude Code passa a ter acesso completo aos seus arquivos. Nenhuma configuração adicional.

### Modo 2 — MCP via plugin Obsidian
1. Instale o plugin `obsidian-claude-code-mcp` no Obsidian
2. O plugin expõe o vault via WebSocket na porta 22360
3. Claude Code em qualquer diretório pode consultar o vault:
   ```bash
   claude mcp add obsidian ws://localhost:22360
   ```

### Modo 3 — Claudian (Claude Code dentro do Obsidian)
- Instale o plugin Claudian no Obsidian
- O Claude Code fica como sidebar dentro do app
- Seu vault é o diretório de trabalho automático

---

## Estrutura de vault recomendada para IA

```
vault/
├── .claude/           ← skills e CLAUDE.md do vault
│   ├── CLAUDE.md      ← contexto do vault para o Claude
│   └── skills/        ← skills específicas do vault
├── 00-Inbox/          ← captura livre, sem organizar
├── 01-Projetos/       ← projetos ativos (pastas individuais)
├── 02-Areas/          ← responsabilidades contínuas
├── 03-Recursos/       ← material de referência por tema
├── 04-Arquivo/        ← concluído / inativo
├── Decisoes/          ← registro de decisões (DECISIONS.md)
└── Templates/         ← templates de notas
```

**Por que essa ordem:** O Claude lê filenames ao buscar. Prefixos numéricos garantem ordenação previsível.

---

## Padrão de frontmatter para notas

```yaml
---
title: Título da nota
tags: [categoria, subtema, tipo]
date: 2026-06-15
source: https://url-original.com
status: rascunho | em-progresso | completo
relacionado: [[Nota A]], [[Nota B]]
---
```

**Por que o frontmatter importa:** O Claude pode filtrar notas por tag, data e status sem ler o conteúdo completo — muito mais eficiente.

---

## Fluxos de trabalho comuns

### Criar nota nova
```
/obsidian-pkm criar nota sobre [tema]
```
Claude gera nota com frontmatter, título descritivo, seções organizadas e links para notas relacionadas existentes.

### Resumir e processar Inbox
```
/obsidian-pkm processar inbox
```
Claude lê tudo em `00-Inbox/`, propõe organização para cada item (mover para Projetos/Areas/Recursos) e cria links bidirecionais.

### Conectar ideias
```
/obsidian-pkm quais notas sobre [tema] tenho?
```
Claude busca por tag, título e conteúdo, lista as notas e identifica conexões não óbvias entre elas.

### Gerar nota de síntese
```
/obsidian-pkm sintetize [tema] com base nas minhas notas
```
Claude lê notas relacionadas ao tema, identifica padrões, contradições e gaps, e gera uma nota nova de síntese com links para as fontes.

### Atualizar DECISIONS.md
```
/obsidian-pkm registre decisão: [descrição]
```
Claude adiciona entrada no `Decisoes/DECISIONS.md`:
```markdown
## [Data] — [Título da decisão]
**Contexto:** [por que era necessário decidir]
**Decisão:** [o que foi decidido]
**Consequências:** [o que muda a partir disso]
```

---

## CLAUDE.md do vault

Crie um arquivo `.claude/CLAUDE.md` dentro do vault com o contexto permanente:

```markdown
# Meu Vault — Contexto para Claude

## Sobre este vault
[Descrição do propósito do vault — projetos, áreas de vida, interesses]

## Convenções de nomenclatura
- Datas no formato YYYY-MM-DD nos filenames de diários
- Tags em português, minúsculas, separadas por hífen
- Links bidirecionais sempre com [[título exato]]

## Tags principais
- #projeto — trabalho ativo
- #referencia — material para consultar depois
- #ideia — conceito para desenvolver
- #decisao — registro de decisão tomada

## Não modifique
- Arquivos em 04-Arquivo/ sem perguntar
- Frontmatter de notas já publicadas
```

---

## O sistema Karpathy (vault que se auto-compila)

Andrej Karpathy viralizou em abril 2026 com a ideia: em vez de tomar notas manualmente, o agente compila o conhecimento.

**Como implementar:**
1. Capture qualquer input no `00-Inbox/` (artigos, conversas, ideias)
2. Periodicamente rode: `/obsidian-pkm processar inbox`
3. Claude lê os inputs, atualiza 10-15 notas relacionadas existentes
4. O vault cresce em riqueza a cada sessão — não em quantidade de arquivos

**Resultado:** após semanas, o Claude sabe tudo que você já processou. Cada nova sessão parte de uma base mais rica.

---

## Convenções Obsidian que o Claude respeita

```markdown
[[Nome da nota]]           ← link interno (wikilink)
[[Nota|texto exibido]]     ← link com alias
![[imagem.png]]            ← embed de imagem
#tag                       ← tag inline
^referencia                ← bloco referenciável
```

Ao criar ou editar notas, Claude sempre usa wikilinks para conectar conceitos relacionados já existentes no vault.
