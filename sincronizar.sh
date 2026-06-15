#!/usr/bin/env bash
# =============================================================================
# sincronizar.sh — Atualiza skills do repositório e reinstala em todas as IDEs
#
# USO:
#   bash sincronizar.sh              # atualiza e instala no Claude Code
#   bash sincronizar.sh --all        # atualiza e instala em todas as IDEs
#   bash sincronizar.sh --check      # verifica atualizações sem instalar
# =============================================================================

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

VERSION_ANTES=$(cat .version 2>/dev/null || echo "?")

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║         Sincronizar Skills Pessoais          ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── Verificar se é repositório Git ────────────────────────────────────────────
if [ ! -d ".git" ]; then
  echo "❌ Esta pasta não é um repositório Git."
  echo ""
  echo "   Para inicializar, execute:"
  echo "   cd $(pwd)"
  echo "   git init"
  echo "   git remote add origin https://github.com/SEU_USUARIO/skills-pessoais.git"
  echo "   git add . && git commit -m 'feat: versão inicial'"
  echo "   git push -u origin main"
  exit 1
fi

# ── Modo --check ──────────────────────────────────────────────────────────────
if [ "${1:-}" = "--check" ]; then
  echo "Verificando atualizações..."
  git fetch origin main 2>/dev/null
  ATRÁS=$(git rev-list HEAD..origin/main --count 2>/dev/null || echo "0")
  
  if [ "$ATRÁS" = "0" ]; then
    echo "✓ Você está na versão mais recente (v$VERSION_ANTES)"
  else
    echo "⬆  $ATRÁS commit(s) disponível(is) — execute: bash sincronizar.sh"
  fi
  echo ""
  exit 0
fi

# ── Pull do repositório ───────────────────────────────────────────────────────
echo "▶  Buscando atualizações..."

# Verifica se há mudanças locais não commitadas
if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
  echo ""
  echo "⚠  Há mudanças locais não commitadas:"
  git status --short
  echo ""
  echo "   Opções:"
  echo "   1) Commitar suas mudanças antes: git add . && git commit -m 'suas mudanças'"
  echo "   2) Descartar mudanças locais: git checkout -- ."
  echo ""
  read -p "   Continuar mesmo assim? (pull pode causar conflito) [s/N]: " RESP
  if [[ ! "$RESP" =~ ^[Ss]$ ]]; then
    echo "   Operação cancelada."
    exit 0
  fi
fi

git pull origin main 2>&1 | sed 's/^/   /'
echo ""

VERSION_DEPOIS=$(cat .version 2>/dev/null || echo "?")

if [ "$VERSION_ANTES" != "$VERSION_DEPOIS" ]; then
  echo "   ✓ Atualizado: v$VERSION_ANTES → v$VERSION_DEPOIS"
else
  echo "   ✓ Já estava na versão mais recente (v$VERSION_DEPOIS)"
fi
echo ""

# ── Reinstalar ────────────────────────────────────────────────────────────────
if [ "${1:-}" = "--all" ]; then
  echo "▶  Instalando em todas as IDEs..."
  echo ""
  bash "$SCRIPT_DIR/instalar-skills.sh" --tool all
else
  echo "▶  Instalando no Claude Code..."
  echo ""
  bash "$SCRIPT_DIR/instalar-skills.sh"
fi

echo ""
echo "✓ Sincronização concluída — v$VERSION_DEPOIS"
echo ""
