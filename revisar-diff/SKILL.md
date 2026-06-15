---
name: revisar-diff
description: Revisa mudanças não commitadas, aponta riscos e sugere mensagem de commit. Use quando perguntar "o que mudei", "quero commitar", "revisa meu diff" ou qualquer variação.
---

## Mudanças atuais

```!
git diff HEAD 2>/dev/null || echo "[sem repositório git ou sem mudanças]"
```

## Status dos arquivos

```!
git status --short 2>/dev/null || echo "[sem repositório git]"
```

## Últimos commits (referência)

```!
git log --oneline -5 2>/dev/null || echo "[sem histórico]"
```

## Instruções

Analise as mudanças acima e entregue:

1. **Resumo** (máx. 3 bullets) — o que foi feito, em linguagem de negócio
2. **Riscos** — lista apenas se houver: lógica incompleta, valores hardcoded, testes desatualizados, imports não usados, tratamento de erro faltando
3. **Mensagem de commit sugerida** — formato: `tipo(escopo): descrição em português`
   - tipos: `feat`, `fix`, `refactor`, `docs`, `chore`, `style`, `test`
   - ex: `feat(dashboard): adiciona drill-down por classificação de demanda`

Se não houver mudanças, informe diretamente.
