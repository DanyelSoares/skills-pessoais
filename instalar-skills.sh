#!/usr/bin/env bash
# =============================================================================
# instalar-skills.sh — Gerenciador de Skills Pessoais v4.0.0
# 35 skills em 6 categorias
#
# USO:
#   bash instalar-skills.sh                    # Claude Code (padrão)
#   bash instalar-skills.sh --tool cursor
#   bash instalar-skills.sh --tool windsurf
#   bash instalar-skills.sh --tool gemini
#   bash instalar-skills.sh --tool codex
#   bash instalar-skills.sh --tool antigravity
#   bash instalar-skills.sh --tool all
#   bash instalar-skills.sh --list
#   bash instalar-skills.sh --version
# =============================================================================

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VERSION=$(cat "$SCRIPT_DIR/.version" 2>/dev/null || echo "4.0.0")

SKILLS_CONTEXTO=(
  "meu-perfil"
  "doe-framework"
  "saas-dashboard"
)

SKILLS_DEV=(
  "revisar-diff"
  "pr-review-expert"
  "debugar"
  "commitar"
  "changelog-generator"
  "documentar"
  "webapp-testing"
  "env-secrets-manager"
  "iniciar-projeto"
  "skill-creator"
  "doe-executar"
)

SKILLS_WEB=(
  "site-premium"
  "landing-page"
  "animacoes-web"
  "frontend-design-oficial"
  "design-anti-slop"
  "identidade-visual"
  "componentes-ui"
  "recursos-frontend"
  "seo-basico"
  "deploy-web"
  "app-mobile"
  "claude-design"
)

SKILLS_CONTEUDO=(
  "conteudo-social"
  "conteudo-email"
  "workflow-visualizer"
)

SKILLS_NEGOCIO=(
  "trafego-pago-meta"
  "obsidian-pkm"
  "app-ambientes"
)

SKILLS_INTEGRACOES=(
  "mercadopago"
  "google-calendar"
  "google-drive"
)

SKILLS=(
  "${SKILLS_CONTEXTO[@]}"
  "${SKILLS_DEV[@]}"
  "${SKILLS_WEB[@]}"
  "${SKILLS_CONTEUDO[@]}"
  "${SKILLS_NEGOCIO[@]}"
  "${SKILLS_INTEGRACOES[@]}"
)

declare -A TOOL_DIRS
TOOL_DIRS["claude"]="$HOME/.claude/skills"
TOOL_DIRS["cursor"]="$HOME/.cursor/rules"
TOOL_DIRS["windsurf"]="$HOME/.windsurf/skills"
TOOL_DIRS["gemini"]="$HOME/.gemini/skills"
TOOL_DIRS["codex"]="$HOME/.codex/skills"
TOOL_DIRS["antigravity"]="$HOME/.gemini/antigravity/skills"

print_header() {
  echo ""
  echo "╔══════════════════════════════════════════════════════════╗"
  echo "║      Gerenciador de Skills Pessoais — v$VERSION          ║"
  echo "║      ${#SKILLS[@]} skills em 6 categorias                       ║"
  echo "╚══════════════════════════════════════════════════════════╝"
  echo ""
}

instalar_skill() {
  local skill="$1" dest_base="$2" tool="$3"
  local SRC="$SCRIPT_DIR/$skill"
  [ ! -d "$SRC" ] && { echo "  ⚠  $skill — não encontrada"; return 1; }

  if [ "$tool" = "cursor" ]; then
    mkdir -p "$dest_base"
    local mdc="$dest_base/${skill}.mdc"
    { echo "---"
      desc=$(grep -m1 'description:' "$SRC/SKILL.md" 2>/dev/null | sed 's/description: //' | tr -d '"')
      echo "description: ${desc:-$skill}"
      echo "alwaysApply: false"
      echo "---"
      echo ""
      awk 'BEGIN{f=0} /^---/{f++; if(f==2){skip=1;next}} skip{print}' "$SRC/SKILL.md"
    } > "$mdc" 2>/dev/null
    echo "  ✓  $skill"
  else
    mkdir -p "$dest_base/$skill"
    cp -r "$SRC/." "$dest_base/$skill/"
    echo "  ✓  $skill"
  fi
}

instalar_para_ferramenta() {
  local tool="$1" dir="${TOOL_DIRS[$1]}"
  [ -z "$dir" ] && { echo "❌ '$tool' não reconhecida."; return 1; }
  echo "▶  $tool → $dir"; echo ""
  [ "$tool" != "cursor" ] && mkdir -p "$dir"
  local ok=0 fail=0
  for skill in "${SKILLS[@]}"; do
    instalar_skill "$skill" "$dir" "$tool" && ((ok++)) || ((fail++))
  done
  echo ""; echo "   ✓ $ok instaladas  ⚠ $fail puladas"; echo ""
  case "$tool" in
    claude)      echo "   → Reinicie o Claude Code." ;;
    cursor)      echo "   → Reload Window (Ctrl+Shift+P)." ;;
    windsurf)    echo "   → Reinicie o Windsurf." ;;
    gemini|codex|antigravity) echo "   → Ativo na próxima sessão." ;;
  esac; echo ""
}

listar_skills() {
  print_header
  local d="${TOOL_DIRS[claude]}"
  declare -A TIPOS
  TIPOS["meu-perfil"]="[bg]"; TIPOS["doe-framework"]="[bg]"; TIPOS["saas-dashboard"]="[bg]"
  TIPOS["obsidian-pkm"]="[bg/paths]"
  TIPOS["commitar"]="[manual]"; TIPOS["iniciar-projeto"]="[manual]"
  TIPOS["skill-creator"]="[manual]"; TIPOS["doe-executar"]="[manual]"
  TIPOS["deploy-web"]="[manual]"; TIPOS["trafego-pago-meta"]="[manual]"

  local cats=("CONTEXTO" "DEV" "WEB" "CONTEUDO" "NEGOCIO" "INTEGRACOES")
  for cat in "${cats[@]}"; do
    local arr="SKILLS_${cat}[@]"
    echo "── $cat ──────────────────────────────────────────"
    for s in "${!arr}"; do
      [ -d "$d/$s" ] && st="✓" || st="·"
      printf "  %s  %-34s %s\n" "$st" "$s" "${TIPOS[$s]:-[auto]}"
    done
    echo ""
  done
  echo "  ✓ instalada  · não instalada  [bg] background  [manual] só você dispara"
  echo "  Total: ${#SKILLS[@]} skills | v$VERSION"
  echo ""
}

TOOL="claude"
case "${1:-}" in
  --tool)    TOOL="${2:-claude}" ;;
  --list|-l) listar_skills; exit 0 ;;
  --version|-v) echo "v$VERSION — ${#SKILLS[@]} skills"; exit 0 ;;
  --help|-h|"") TOOL="claude" ;;
  *) echo "Uso: bash instalar-skills.sh [--tool FERRAMENTA] [--list] [--version]"; exit 1 ;;
esac

print_header
if [ "$TOOL" = "all" ]; then
  for t in claude cursor windsurf gemini codex antigravity; do
    instalar_para_ferramenta "$t"
    echo "────────────────────────────────────────────────────────────"; echo ""
  done
else
  instalar_para_ferramenta "$TOOL"
fi
echo "Concluído. Use --list para ver o status."
