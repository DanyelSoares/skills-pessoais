# Skills Pessoais — Claude Code & IDEs

> **v4.0.0** — 35 skills em 6 categorias

Repositório privado de skills para Claude Code, Cursor, Windsurf, Gemini CLI, Codex e Antigravity.

---

## Instalação rápida

```bash
# Clonar em qualquer máquina
git clone https://github.com/SEU_USUARIO/skills-pessoais.git
cd skills-pessoais

# Instalar em todas as IDEs de uma vez
bash instalar-skills.sh --tool all

# Ou só no Claude Code
bash instalar-skills.sh
```

## Atualizar (após mudanças no repo)

```bash
git pull
bash instalar-skills.sh --tool all
```

## Verificar status

```bash
bash instalar-skills.sh --list
bash instalar-skills.sh --version
```

---

## Categorias

| Categoria | Skills | Descrição |
|---|---|---|
| **Contexto** | 3 | Background — Claude carrega automaticamente |
| **Dev** | 11 | Fluxo de desenvolvimento, Git, debug, DOE |
| **Web** | 12 | Sites, design, frontend, mobile, deploy |
| **Conteúdo** | 3 | Social media, email, visualização |
| **Negócio** | 3 | Tráfego pago, Obsidian, app de ambientes |
| **Integrações** | 3 | Mercado Pago, Google Calendar, Google Drive |

---

## Ferramentas suportadas

```bash
bash instalar-skills.sh --tool claude      # ~/.claude/skills/
bash instalar-skills.sh --tool cursor      # ~/.cursor/rules/
bash instalar-skills.sh --tool windsurf    # ~/.windsurf/skills/
bash instalar-skills.sh --tool gemini      # ~/.gemini/skills/
bash instalar-skills.sh --tool codex       # ~/.codex/skills/
bash instalar-skills.sh --tool antigravity # ~/.gemini/antigravity/skills/
bash instalar-skills.sh --tool all         # todas de uma vez
```

---

## Adicionar skill nova

```bash
# 1. Criar pasta e arquivo
mkdir nova-skill
# Editar nova-skill/SKILL.md

# 2. Adicionar ao array SKILLS no instalar-skills.sh

# 3. Atualizar versão
echo "4.1.0" > .version

# 4. Commitar e sincronizar
git add .
git commit -m "feat(skills): adiciona nova-skill"
git push

# 5. Em qualquer máquina: git pull && bash instalar-skills.sh --tool all
```

---

## Estrutura

```
skills-pessoais/
├── README.md
├── ATUALIZANDO.md       ← guia de atualização detalhado
├── instalar-skills.sh   ← instalador multi-ferramenta
├── .version             ← versão atual (ex: 4.0.0)
├── .gitignore
├── [nome-da-skill]/
│   └── SKILL.md         ← instrução da skill
└── ...
```

---

## Notas de segurança

- Repositório **privado** — nunca tornar público
- Nunca commitar `.env`, credenciais ou tokens
- Skills com integração de API usam variáveis de ambiente, não valores hardcoded
