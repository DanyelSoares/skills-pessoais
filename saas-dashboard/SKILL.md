---
name: saas-dashboard
description: Contexto e padrões para projetos de dashboard SaaS com dados de CRM/ticketing. Claude usa quando trabalhar em dashboards, charts, upload de planilhas, drill-down ou visualização de dados.
user-invocable: false
paths: ["**/dashboard/**", "**/components/**", "**/*.jsx", "**/*.tsx", "**/data/**"]
---

## Contexto do projeto

Dashboard SaaS para visualização de dados operacionais (CRM/ticketing) carregados via upload de planilha.

## Fluxo de dados

```
Upload (xlsx/csv) → parse → normalização → estado React → componentes de chart → drill-down
```

## Padrões de componentes

### Componente de chart
```jsx
// Sempre recebe data como prop tipada, nunca busca dados internamente
function ClassificacaoChart({ data, onSelectItem }) {
  // data: array de objetos normalizados
  // onSelectItem: callback para drill-down
}
```

### Mapa de cores por classificação
```js
// Centralizado em src/config/cores.js — nunca hardcoded nos componentes
const CORES_CLASSIFICACAO = {
  'Incidente':    '#ef4444',
  'Requisição':   '#3b82f6',
  'Problema':     '#f59e0b',
  'Mudança':      '#10b981',
  // adicionar aqui, nunca nos componentes
}
```

### Drill-down
- Classificação → lista de protocolos → detalhe do protocolo
- Estado de navegação no componente pai, passado como prop
- URL ou query param reflete o nível atual

## Estrutura de pastas padrão

```
src/
  components/
    charts/        # Componentes de visualização (recebem data como prop)
    filters/       # Filtros de data, classificação, status
    tables/        # Tabelas de protocolos com paginação
    layout/        # Shell, sidebar, header
  hooks/
    useUpload.js   # Parse e validação do arquivo
    useDados.js    # Normalização e filtragem dos dados
  config/
    cores.js       # Mapa de cores por classificação
    colunas.js     # Mapeamento de colunas da planilha para campos internos
  utils/
    parsePlanilha.js  # xlsx/csv → array de objetos normalizados
    formatacao.js     # Datas, números, textos para exibição
  data/            # Fixtures e exemplos para desenvolvimento
```

## Mapeamento de planilha

As colunas da planilha de entrada mapeiam para campos internos via `config/colunas.js`.
Nunca acessar colunas por nome literal dentro dos componentes — sempre via o mapa de configuração.

## Convenções de nomenclatura

- Campos internos: camelCase inglês (`ticketId`, `openedAt`, `classification`)
- Labels de exibição: português (`"Classificação"`, `"Aberto em"`, `"ID do Protocolo"`)
- Componentes: PascalCase (`ClassificacaoChart`, `DrilldownProtocolo`)
- Hooks: camelCase com prefixo `use` (`useUpload`, `useDados`)

## Armadilhas comuns

- **Não** use `recharts` e `chart.js` no mesmo projeto — escolha um e mantenha
- Parse de datas da planilha: tratar como string e converter explicitamente (xlsx serializa datas como número)
- Filtros: aplicar na camada de hook, nunca dentro do componente de chart
- Re-renders: memoize os dados transformados com `useMemo`, não os componentes

## Checklist antes de novo componente de chart

- [ ] Recebe `data` como prop (não busca dados internamente)
- [ ] Usa cores de `config/cores.js`
- [ ] Tem callback `onSelectItem` se suportar drill-down
- [ ] Renderiza estado vazio (`data.length === 0`) de forma legível
- [ ] Responsivo — funciona em tela menor que 1280px
