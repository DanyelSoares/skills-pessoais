# Guia — Repositório Git para Skills em Múltiplas Máquinas

## Passo 1 — Criar repositório privado no GitHub

1. Acesse **github.com** e faça login
2. Clique em **"New repository"** (botão verde no canto superior direito)
3. Configure:
   - **Repository name:** `skills-pessoais` (ou qualquer nome)
   - **Visibility:** ✅ **Private** (obrigatório — nunca deixe público)
   - **NÃO** marque "Add a README file" (já temos)
4. Clique em **"Create repository"**
5. Copie a URL que aparece — algo como:
   `https://github.com/danyel/skills-pessoais.git`

---

## Passo 2 — Inicializar o repositório (primeira máquina)

Abra o **Git Bash** (Windows) ou terminal na pasta `skills-danyel`:

```bash
# Entrar na pasta das skills
cd skills-danyel

# Inicializar Git
git init

# Configurar seu nome e email (se ainda não configurou)
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Conectar ao repositório do GitHub
git remote add origin https://github.com/SEU_USUARIO/skills-pessoais.git

# Primeiro commit com todas as skills
git add .
git commit -m "feat: versão inicial — 35 skills v4.0.0"

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

Pronto! As skills estão no GitHub.

---

## Passo 3 — Instalar na máquina atual

```bash
# Ainda dentro da pasta skills-danyel
bash instalar-skills.sh --tool all
```

---

## Passo 4 — Instalar na máquina do trabalho

Na **máquina do trabalho**, abra o Git Bash e execute:

```bash
# Clonar o repositório
git clone https://github.com/SEU_USUARIO/skills-pessoais.git
cd skills-pessoais

# Instalar em todas as IDEs
bash instalar-skills.sh --tool all
```

Pronto. As duas máquinas têm as mesmas skills instaladas.

---

## Fluxo diário — Após qualquer atualização

**Quando criar ou modificar uma skill em qualquer máquina:**

```bash
# Salvar e enviar para o GitHub
git add .
git commit -m "feat(skills): adiciona/atualiza nome-da-skill"
git push
```

**Na outra máquina, para receber a atualização:**

```bash
# Opção 1: script automático (recomendado)
bash sincronizar.sh         # Claude Code
bash sincronizar.sh --all   # todas as IDEs

# Opção 2: manual
git pull
bash instalar-skills.sh --tool all
```

---

## Verificar se há atualizações

```bash
bash sincronizar.sh --check
```

Mostra quantos commits estão disponíveis sem instalar nada.

---

## Autenticação no GitHub (se pedir senha)

O GitHub não aceita mais senha — use **token de acesso pessoal**:

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token** → marque `repo` (acesso completo a repositórios privados)
3. Copie o token gerado
4. Quando o Git pedir "password", cole o token (não a senha da conta)

**Para não precisar digitar sempre (salvar credenciais):**

```bash
# Windows
git config --global credential.helper wincred

# Mac
git config --global credential.helper osxkeychain

# Linux
git config --global credential.helper store
```

---

## Resumo dos comandos

| Ação | Comando |
|---|---|
| Verificar atualizações | `bash sincronizar.sh --check` |
| Sincronizar + instalar no Claude Code | `bash sincronizar.sh` |
| Sincronizar + instalar em tudo | `bash sincronizar.sh --all` |
| Listar skills e status | `bash instalar-skills.sh --list` |
| Enviar mudanças para o GitHub | `git add . && git commit -m "mensagem" && git push` |
| Ver versão atual | `bash instalar-skills.sh --version` |
