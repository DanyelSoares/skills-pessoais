---
name: debugar
description: Sessão estruturada de debug — reproduzir, isolar, diagnosticar e corrigir. Use com stack trace, mensagem de erro, comportamento inesperado, ou "está quebrando em X".
---

## Contexto do erro

$ARGUMENTS

## Estado atual do repositório

```!
git status --short 2>/dev/null || echo "[fora de repositório git]"
```

## Arquivos modificados recentemente

```!
git diff --name-only HEAD 2>/dev/null || echo "[sem histórico]"
```

## Instruções

### Passo 0 — Classificar o tipo de erro (DOE Framework)

Antes de qualquer ação, classifique:

**Técnico** — causa no código, API, sintaxe ou execução
- Sintoma: script falha, exceção, timeout, output errado
- Ação: entre no loop técnico abaixo

**Estratégico** — causa no escopo, abordagem ou arquitetura
- Sintoma: script roda mas produz resultado inútil; solução certa para o problema errado
- Ação: pare. Não itere código. Apresente diagnóstico de escopo e 2 alternativas

**Contextual** — causa em informação ausente ou ambígua
- Sintoma: premissa incorreta, input faltando, comportamento inesperado de sistema externo
- Ação: identifique o que falta, formule pergunta específica, aguarde resposta

> Regra crítica: não tente resolver erro estratégico ou contextual iterando código.

---

### Loop técnico

1. **Reproduzir** — identifique o caminho exato que leva ao erro; é reproduzível sempre ou só em condições específicas?
2. **Isolar** — separe o sintoma da causa raiz; identifique arquivo/função/linha responsável
3. **Diagnosticar** — explique *por que* acontece (estado inválido? tipo errado? referência nula? race condition? edge case não coberto?)
4. **Corrigir** — proponha a correção mínima; mostre apenas o diff do que muda
5. **Prevenir** — sugira teste ou verificação simples para evitar regressão

**Critério de parada — escale ao usuário se:**
- Mesma causa raiz após 3 tentativas
- Erro diferente a cada tentativa (causa raiz instável)
- A correção exige informação que você não tem
- O fix envolve chamada de API paga ou efeito colateral

**Ao escalar:** o que foi tentado + erro atual exato + hipótese da causa raiz + o que precisa para continuar. Nunca escale com "não consegui".

---

### Se o projeto usa DOE Framework

Se existir pasta `execution/` ou `directives/`:
- Verifique se existe backup em `.tmp/backups/` antes de modificar qualquer script
- Se for criar backup: `.tmp/backups/[nome_script]_[timestamp]`
- Registre o erro e a correção no log `.tmp/logs/` se existir sessão ativa
- Após corrigir: atualize a diretriz correspondente com seção `## Aprendizados` (Tipo A — sem precisar perguntar)
