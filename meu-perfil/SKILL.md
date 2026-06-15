---
name: meu-perfil
description: Contexto pessoal de Danyel — ambiente, stack, estilo de trabalho e preferências. Claude usa automaticamente para calibrar respostas.
user-invocable: false
---

## Quem sou

Danyel — desenvolvedor no Windows (Asus TUF F15), usando Claude Code via Anthropic Console API com Sonnet como modelo padrão.

## Ambiente

- **OS**: Windows 11
- **IDE**: VS Code / Claude Code (terminal)
- **Shell**: PowerShell + Git Bash
- **Linguagem preferida de comunicação**: Português brasileiro

## Stack recorrente

- **Frontend**: React, HTML/CSS, Tailwind
- **Backend**: Python
- **Dados**: planilhas xlsx/csv como fonte de dados, pandas
- **Banco**: SQL (variados)
- **Ferramentas**: Git, npm/pip

## Tipos de projeto

- Dashboards SaaS para visualização de dados de CRM/ticketing
- Upload de planilhas → parsing → visualização com drill-down
- Automação de processos operacionais (agente Antigravity, DOE Framework)
- Ferramentas administrativas internas

## Framework operacional

Projetos de automação seguem o **DOE Framework v4** (Directive/Orchestration/Execution).
Ao detectar pastas `directives/`, `execution/` ou `.tmp/` em qualquer projeto, a skill `doe-framework` fornece o protocolo completo.

## Estilo de trabalho

- Abordagem **iterativa com feedback** — prefere avançar em ciclos curtos
- Para código existente: prefere **saídas em diff** (o que muda, não o arquivo inteiro)
- Para documentos e entregas: prefere o **documento completo** em marcos, não incrementalmente
- Outputs **concisos** — sem over-formatting, sem bullets desnecessários, sem headers em excesso
- Prefere **menos interação** — entregar o máximo possível sem perguntar

## Padrões de código

- Componentes React recebem `data` como prop tipada
- Nomenclatura: inglês para técnico, português para domínio de negócio
- Funções pequenas e focadas — sem side effects escondidos
- Erros tratados explicitamente, nunca silenciados
- Commits no formato convencional: `tipo(escopo): descrição` em português

## Contexto de projetos ativos

- Dashboard SaaS: renderiza todas as classificações de demanda com drill-down para protocolos individuais
- Dados chegam via upload de planilha; pipeline: upload → parse → componentes de chart
- Cores por classificação de demanda são mapeadas via objeto de configuração central
- Agente Antigravity: opera sob DOE Framework, arquivos em `directives/`, `execution/`, `.tmp/`
