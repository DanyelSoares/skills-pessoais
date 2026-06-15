---
name: skill-creator
description: Cria uma nova skill personalizada para Claude Code. Use quando quiser automatizar um fluxo recorrente, codificar uma instrução que você sempre repete, ou transformar um processo em comando invocável.
disable-model-invocation: true
---

## Tarefa

Criar uma nova skill pessoal com base em: **$ARGUMENTS**

## Processo

### 1. Entender o que criar

A partir do argumento, identifique:
- **Nome da skill** (kebab-case, ex: `revisar-pr`)
- **Quando deve ser invocada** — automaticamente pelo Claude ou só pelo usuário?
- **O que faz** — passo a passo do fluxo
- **Precisa de contexto dinâmico?** — output de comandos shell com `` !`cmd` ``
- **Precisa de argumentos?** — `$ARGUMENTS` ou `$0`, `$1`...
- **Precisa de ferramentas especiais?** — `allowed-tools`

### 2. Gerar o arquivo SKILL.md

Estrutura padrão:

```markdown
---
name: [nome-da-skill]
description: [O que faz e quando usar — primeira frase é o gatilho principal]
[disable-model-invocation: true  # se só o usuário deve disparar]
[allowed-tools: Bash(cmd *) Read Write  # se precisar de permissões específicas]
---

## [Seção de contexto dinâmico, se aplicável]

!`comando que injeta contexto`

## Instruções

[Passos claros e diretos para o Claude executar]
```

### 3. Entregar

Mostre o conteúdo completo do `SKILL.md` gerado.

Em seguida, mostre o comando para instalar:

```bash
# Skill pessoal (todos os projetos):
mkdir -p ~/.claude/skills/[nome-da-skill]
# Cole o SKILL.md em ~/.claude/skills/[nome-da-skill]/SKILL.md

# Skill de projeto (só este projeto):
mkdir -p .claude/skills/[nome-da-skill]
# Cole o SKILL.md em .claude/skills/[nome-da-skill]/SKILL.md
```

### Boas práticas ao gerar

- `description` começa pelo **gatilho de uso** — o que o usuário vai dizer ou fazer
- Instrução concisa — máx. 500 linhas no SKILL.md total
- Conteúdo dinâmico (`` !`cmd` ``) só quando realmente necessário
- `disable-model-invocation: true` para qualquer skill com efeitos colaterais (escreve arquivo, faz commit, envia mensagem)
- `user-invocable: false` para contexto de background que o Claude deve carregar sozinho
