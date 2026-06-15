---
name: doe-executar
description: Executa uma tarefa usando o loop formal DOE (PLAN/EXECUTE/VERIFY/COMMIT). Use para tarefas de risco Alto ou Crítico em projetos Antigravity, ou quando quiser estrutura formal de execução com rollback garantido.
disable-model-invocation: true
allowed-tools: Bash(cat *) Bash(ls *) Bash(mkdir *) Bash(cp *) Bash(python3 *) Bash(git *) Read Write
---

## Tarefa a executar

$ARGUMENTS

## Estado atual do projeto

```!
ls -la 2>/dev/null | head -20
```

```!
cat .tmp/session_state.md 2>/dev/null || echo "[sem session_state.md]"
```

```!
ls .tmp/logs/ 2>/dev/null | tail -3 || echo "[sem logs]"
```

## Directives disponíveis

```!
ls directives/ 2>/dev/null || echo "[sem pasta directives/]"
```

## Scripts disponíveis

```!
ls execution/ 2>/dev/null || echo "[sem pasta execution/]"
```

---

## Instruções — Loop PLAN/EXECUTE/VERIFY/COMMIT

### FASE 1 — PLAN

Antes de qualquer ação, produza e apresente ao usuário:

1. **Objetivo** — o que será alcançado ao final
2. **Escopo** — o que está incluído e o que está fora
3. **Classificação de risco** — Baixo / Médio / Alto / Crítico (justifique)
4. **Passos** — sequência numerada de ações concretas
5. **Riscos** — o que pode quebrar e como será mitigado
6. **Rollback** — como reverter cada passo se necessário

Aguarde aprovação explícita antes de avançar. Silêncio não é aprovação.

---

### FASE 2 — EXECUTE

Execute apenas o plano aprovado, na ordem definida.

Para cada passo:
- Registre no log `.tmp/logs/[sessão].md`:
  ```
  [HH:MM:SS] EXECUÇÃO | [descrição do passo]
  Arquivos afetados: [lista]
  Resultado: [sucesso | falha | pendente]
  Erro: [mensagem ou "nenhum"]
  ```
- Se desvio necessário: **pause → informe → apresente plano atualizado → aguarde reaprovação**
- Nunca acumule desvios para explicar depois

Para risco Alto/Crítico (Safe Mode ativo):
- Uma ação por vez
- Confirmação antes de cada modificação de estado externo
- `⚠️ Safe Mode ativo — confirmarei cada ação antes de executar`

---

### FASE 3 — VERIFY

Para cada passo do plano executado, confirme:
- ✓ Foi executado conforme planejado?
- ✓ O output existe e é válido?
- ✓ Efeitos colaterais esperados ocorreram?
- ✓ Efeitos colaterais inesperados ocorreram?

Se qualquer item falhar: não avance para COMMIT. Classifique o desvio (técnico/estratégico/contextual) e acione o loop correspondente da skill `debugar`.

Entregue relatório explícito: **aprovado** ou **reprovado**.

---

### FASE 4 — COMMIT

Somente após VERIFY aprovado:

1. Mova entregáveis de `.tmp/` para destino final
2. Atualize directives com aprendizados:
   - Tipo A (aditivo): faça diretamente, registre em `## Aprendizados — [data]`
   - Tipo B (estrutural): apresente ao usuário e aguarde aprovação
3. Atualize `.tmp/session_state.md`:
   ```
   Etapa atual: [concluída]
   Próxima ação: [próximo passo ou "nenhuma"]
   Arquivos relevantes: [lista]
   Decisões tomadas: [resumo]
   Pendências: [lista ou "nenhuma"]
   ```
4. Encerre o log da sessão:
   ```
   [HH:MM:SS] SESSÃO ENCERRADA
   Status: concluída
   Pendências: nenhuma
   ```

Para risco Crítico: reporte resultado ao usuário antes de considerar encerrado.

---

## Checklist de DONE (obrigatório antes de encerrar)

- ✓ Entregável existe e foi validado (não apenas "foi criado")
- ✓ Está no local correto (nuvem se entregável, `.tmp/` se intermediário)
- ✓ Scripts novos testados com input real
- ✓ Diretriz atualizada se houver aprendizado novo
- ✓ `session_state.md` atualizado
- ✓ Nenhuma decisão implícita não aprovada
- ✓ Nenhum erro silenciado sem registro
- ✓ Nenhum TODO, placeholder ou "fix later" no output
