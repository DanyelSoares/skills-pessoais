# Conector Google Ads — como obter as credenciais

Você faz isso **uma vez**. Leva ~20 minutos + o prazo de análise do Google para o developer token.
Nenhuma credencial vai para o GitHub: tudo fica em `%USERPROFILE%\.google-ads-mcp\config.json`.

## 1. Conta de administrador (MCC)

1. Acesse <https://ads.google.com/home/tools/manager-accounts/> e crie uma **conta de administrador**
   com o mesmo login Google (é gratuita).
2. Dentro dela, vincule sua conta de anúncios: **Contas › + › Vincular conta existente** e aceite o
   convite na conta de anúncios.
3. Anote o ID da conta de administrador (formato `123-456-7890`).

## 2. Developer token

1. Na conta de **administrador**: **Ferramentas › Configuração › Central de API**.
2. Preencha o formulário (site, e-mail de contato, uso: "gerenciar as campanhas da minha própria
   empresa") e aceite os termos.
3. Copie o **developer token** exibido.
4. Verifique o **nível de acesso** mostrado na Central de API. Se ele não permitir alterar contas
   reais, clique em **Solicitar acesso básico** e responda que o uso é interno, para as próprias
   contas. A análise do Google costuma levar alguns dias úteis.

## 3. Projeto no Google Cloud (OAuth)

1. <https://console.cloud.google.com/> › **Criar projeto** (ex.: `google-ads-claude`).
2. **APIs e serviços › Biblioteca** › ative **Google Ads API**.
3. **APIs e serviços › Tela de consentimento OAuth**: tipo **Externo**, nome do app, seu e-mail.
   Em **Público-alvo**, adicione seu e-mail como usuário de teste e depois clique em
   **Publicar app** (status *Em produção*). Sem isso, o acesso expira a cada 7 dias.
4. **Credenciais › Criar credenciais › ID do cliente OAuth › App para computador**.
   Copie o **ID do cliente** e a **chave secreta do cliente**.

## 4. Autorizar no computador

No PowerShell:

```powershell
cd $env:USERPROFILE\Downloads\skills-pessoais\mcp-google-ads
cmd /c npm run autorizar
```

Cole as 3 credenciais e o ID da conta de administrador. O navegador abre: entre com sua conta
Google. Se aparecer "o Google não verificou este app", clique em **Avançado › Acessar** — o app é
seu. Depois teste:

```powershell
cmd /c npm run testar
```

Deve listar suas contas. Reinicie o Claude Code e peça, por exemplo:
"liste minhas campanhas do Google Ads dos últimos 30 dias".

## Problemas comuns

| Mensagem | Solução |
|---|---|
| `DEVELOPER_TOKEN_NOT_APPROVED` | O token só tem acesso de teste: peça o **acesso básico** (passo 2.4) |
| `USER_PERMISSION_DENIED` | O ID da conta de administrador está errado ou a conta não está vinculada |
| `invalid_grant` | O acesso expirou: publique o app (passo 3.3) e rode `npm run autorizar` de novo |
| Versão da API indisponível | Edite `api_version` no `config.json` (ex.: `v26`) |
