---
name: changelog-generator
description: Gera changelog legível para humanos a partir do histórico de commits. Use ao preparar release, versão ou querer documentar o que mudou.
allowed-tools: Bash(git log *) Bash(git tag *) Bash(git diff *)
---

## Histórico de commits

```!
git log --oneline --no-merges -30 2>/dev/null || echo "[sem repositório git ou sem commits]"
```

## Tags existentes

```!
git tag --sort=-version:refname 2>/dev/null | head -5 || echo "[sem tags]"
```

## Argumento recebido (versão ou intervalo): $ARGUMENTS

## Instruções

Gere um changelog no seguinte formato:

```markdown
## [versão ou data] — [data de hoje]

### ✨ Novidades
- [feat: descrição em linguagem de usuário final]

### 🐛 Correções
- [fix: o que foi corrigido e qual era o impacto]

### ♻️ Melhorias internas
- [refactor/chore/perf: mudanças técnicas relevantes]

### 📝 Documentação
- [docs: o que foi documentado]
```

### Regras

- Transforme mensagens técnicas de commit em linguagem de **usuário final ou stakeholder**
- Agrupe commits relacionados em um único item quando couber
- Ignore commits de merge, bump de versão, e ajustes triviais de formatação
- Se `$ARGUMENTS` especificar versão (ex: `v1.2.0`) ou intervalo (ex: `v1.1.0..HEAD`), filtre os commits desse intervalo
- Se não houver argumento, use os últimos 30 commits
- Ao final, sugira o número de versão semântica adequado (major/minor/patch) com justificativa
