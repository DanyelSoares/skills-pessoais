---
name: webapp-testing
description: Testa aplicação web local com Playwright — verifica funcionalidades, captura screenshots e identifica problemas de UI. Use ao terminar feature, antes de commitar ou quando algo visual precisar ser verificado.
allowed-tools: Bash(npx playwright *) Bash(npm *) Bash(python3 *) Bash(pip *) Read Write
---

## Argumento (o que testar): $ARGUMENTS

## Estado atual

```!
git diff --name-only HEAD 2>/dev/null | head -10 || echo "[sem mudanças no git]"
```

## Instruções

### 1. Verificar ambiente

Cheque se o Playwright está disponível:
```bash
npx playwright --version 2>/dev/null || echo "não instalado"
```

Se não estiver instalado:
```bash
npm install -D @playwright/test
npx playwright install chromium
```

### 2. Identificar a aplicação

Determine a URL da aplicação local:
- Procure por `package.json` para identificar a porta padrão (vite: 5173, react: 3000, next: 3000)
- Se o argumento especificar URL, use-a
- Default: `http://localhost:3000`

### 3. Executar testes

**Se `$ARGUMENTS` especificar fluxo a testar**, crie e execute um script Playwright inline:

```javascript
// Foco no fluxo específico solicitado
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:PORT');
  
  // [passos específicos para o argumento recebido]
  
  await page.screenshot({ path: 'screenshot-teste.png', fullPage: true });
  await browser.close();
})();
```

**Se não houver argumento**, execute smoke test padrão:
- Abre a aplicação
- Verifica que carrega sem erros de console
- Captura screenshot da tela inicial
- Testa navegação básica se houver menu/tabs

### 4. Reportar

Ao final, entregue:
- ✅ O que passou
- ❌ O que falhou (com mensagem de erro exata)
- 📸 Caminho do screenshot gerado
- 🔧 Sugestão de correção para cada falha

### Regras

- Nunca modifique código-fonte para forçar testes passarem
- Se a aplicação não estiver rodando, informe como iniciá-la antes de testar
- Screenshots salvos na pasta `tests/screenshots/` ou raiz do projeto
- Timeout padrão: 10 segundos por ação
