---
name: pr-review-expert
description: Revisão profunda de pull request — blast radius, segurança, cobertura de testes, qualidade de código e impacto. Use antes de mergear qualquer PR, especialmente em branches protegidas ou com mudanças em código crítico.
allowed-tools: Bash(git *)
---

## Diff do PR

```!
git diff main...HEAD 2>/dev/null || git diff master...HEAD 2>/dev/null || git diff HEAD~1 2>/dev/null || echo "[sem diff disponível — execute em branch com mudanças]"
```

## Arquivos modificados

```!
git diff --name-only main...HEAD 2>/dev/null || git diff --name-only HEAD~1 2>/dev/null || echo "[sem mudanças]"
```

## Commits neste PR

```!
git log main..HEAD --oneline 2>/dev/null || git log HEAD~5..HEAD --oneline 2>/dev/null || echo "[sem commits]"
```

## Argumento (foco específico se houver): $ARGUMENTS

---

## Instruções — Revisão em 5 dimensões

### 1. Blast Radius

Avalie o alcance das mudanças:

- **Escopo:** as mudanças estão contidas (um módulo, uma feature) ou tocam múltiplas camadas?
- **Dependências afetadas:** quais outros módulos/componentes consomem o que foi alterado?
- **Risco de regressão:** existe código que chama as funções/APIs modificadas sem estar no diff?
- **Banco de dados / estado persistido:** há migrations, alterações de schema ou mudança em estrutura de dados?

Classifique o blast radius: **Contido** / **Moderado** / **Amplo** / **Sistêmico**

---

### 2. Segurança

Verifique ativamente:

- **Inputs não sanitizados** — dados do usuário usados sem validação em queries, comandos shell, templates
- **Credenciais ou segredos** — hardcoded, em comentários, em logs, em mensagens de erro
- **Autorização** — endpoints novos têm verificação de permissão? Lógica de auth foi alterada?
- **Dependências novas** — pacotes adicionados têm histórico suspeito ou versão desatualizada?
- **Exposição de dados** — respostas de API retornam mais do que deveriam? Logs expõem dados sensíveis?

Classifique cada achado: 🔴 Crítico / 🟡 Atenção / ✅ OK

---

### 3. Cobertura de Testes

- Código novo tem testes correspondentes?
- Casos de borda estão cobertos (null, vazio, limite, erro)?
- Testes existentes foram quebrados ou precisam de atualização?
- Se não há testes: o risco é aceitável? Quais cenários mínimos deveriam ser cobertos?

---

### 4. Qualidade de Código

Avalie sem preferências estéticas — foque em:

- **Legibilidade:** alguém que não escreveu esse código consegue entendê-lo em 2 minutos?
- **Responsabilidade única:** funções fazem uma coisa só?
- **Duplicação:** há lógica copiada que deveria estar extraída?
- **Erros silenciados:** catch vazio, `console.log` de debug esquecido, TODO sem issue?
- **Nomenclatura:** variáveis e funções comunicam intenção?

---

### 5. Impacto Operacional

- Performance: há queries N+1, loops aninhados, operações síncronas que deveriam ser assíncronas?
- Compatibilidade: quebra API pública, contrato de dados ou interface de outro serviço?
- Rollback: se der errado, é fácil reverter? Há migration irreversível?
- Deploy: requer reinício de serviço, migração de dados ou coordenação com outra equipe?

---

## Output obrigatório

### Veredicto

**APROVADO** / **APROVADO COM RESSALVAS** / **REPROVADO**

### Resumo executivo
2-3 frases sobre o que o PR faz e o nível de risco geral.

### Achados por dimensão
Para cada dimensão, liste apenas o que é acionável — sem preencher com "está OK" onde não há problemas.

### Ações necessárias antes do merge
Lista numerada do que precisa ser resolvido para aprovação. Vazio se aprovado sem ressalvas.

### Sugestões (não bloqueantes)
Melhorias que valem considerar mas não bloqueiam o merge.
