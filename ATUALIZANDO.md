# Como Atualizar as Skills

## Fluxo de atualização

Quando quiser adicionar ou modificar uma skill, o processo é sempre o mesmo:

```
1. Edite o SKILL.md da skill desejada (nesta pasta)
2. Execute: bash instalar-skills.sh --tool [ferramenta]
3. Reinicie a IDE
```

O script sempre sobrescreve o destino com o conteúdo mais recente da pasta de origem.

---

## Cenários comuns

### Modificar uma skill existente

```bash
# 1. Edite o arquivo diretamente
notepad meu-perfil/SKILL.md        # Windows
code meu-perfil/SKILL.md           # VS Code

# 2. Reinstale
bash instalar-skills.sh            # atualiza Claude Code
bash instalar-skills.sh --tool cursor  # atualiza Cursor
```

### Adicionar uma skill nova

```bash
# 1. Crie a pasta e o arquivo
mkdir nova-skill
# Crie nova-skill/SKILL.md com o conteúdo

# 2. Adicione o nome à lista SKILLS no instalar-skills.sh

# 3. Atualize a versão em .version (ex: 1.0.0 → 1.1.0)

# 4. Instale
bash instalar-skills.sh
```

### Remover uma skill

```bash
# 1. Remova do array SKILLS no instalar-skills.sh
# 2. Delete a pasta localmente
rm -rf nome-da-skill/

# 3. Delete do destino instalado
rm -rf ~/.claude/skills/nome-da-skill/

# 4. Reinstale para garantir consistência
bash instalar-skills.sh
```

---

## Convenção de versão

Use versionamento semântico no arquivo `.version`:

| Tipo de mudança | Exemplo |
|---|---|
| Nova skill adicionada | `1.0.0` → `1.1.0` |
| Skill existente melhorada | `1.0.0` → `1.0.1` |
| Mudança estrutural grande | `1.0.0` → `2.0.0` |

---

## Verificar o que está instalado

```bash
bash instalar-skills.sh --list
```

Mostra cada skill, seu tipo (background/auto+manual/manual) e se está instalada no Claude Code.

---

## Ferramentas suportadas

```bash
bash instalar-skills.sh                      # Claude Code (padrão)
bash instalar-skills.sh --tool cursor        # Cursor (.cursor/rules/*.mdc)
bash instalar-skills.sh --tool windsurf      # Windsurf (.windsurf/skills/)
bash instalar-skills.sh --tool gemini        # Gemini CLI (.gemini/skills/)
bash instalar-skills.sh --tool codex         # OpenAI Codex (.codex/skills/)
bash instalar-skills.sh --tool antigravity   # Antigravity (.gemini/antigravity/skills/)
bash instalar-skills.sh --tool all           # Todas de uma vez
```

---

## Dica: editar skills com ajuda do Claude Code

Dentro do Claude Code, use a skill `/skill-creator` para gerar o conteúdo de uma skill nova ou melhorar uma existente. Depois cole no arquivo `.md` correspondente e rode o instalador.
