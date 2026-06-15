---
name: mercadopago
description: Integra Mercado Pago em qualquer aplicação — Checkout Pro, Checkout Transparente, Checkout Bricks, PIX, cartão de crédito, assinaturas. Use ao implementar pagamentos, configurar webhooks ou diagnosticar problemas de integração.
---

## Argumento (tipo de integração ou problema): $ARGUMENTS

---

## Modalidades de integração

### Qual escolher?

| Modalidade | Quando usar | Controle visual |
|---|---|---|
| **Checkout Pro** | Quer o mínimo de código, redirect para MP | MP cuida do design |
| **Checkout Bricks** | Quer componentes prontos no seu site | Parcial (customizável) |
| **Checkout Transparente** | Controle total da experiência | Total (você cria tudo) |
| **Link de Pagamento** | Zero código, apenas link | Nenhum |

---

## Checkout Pro — O mais simples

Redireciona o usuário para o ambiente do Mercado Pago.

### Backend (Node.js)

```javascript
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const preference = new Preference(client);

const result = await preference.create({
  body: {
    items: [
      {
        id: 'produto-001',
        title: 'Nome do Produto',
        quantity: 1,
        unit_price: 99.90,
        currency_id: 'BRL',
      }
    ],
    payer: {
      email: 'comprador@email.com',
    },
    back_urls: {
      success: 'https://seu-site.com/pagamento/sucesso',
      failure: 'https://seu-site.com/pagamento/erro',
      pending: 'https://seu-site.com/pagamento/pendente',
    },
    auto_return: 'approved',
    notification_url: 'https://seu-site.com/webhook/mercadopago',
    external_reference: 'PEDIDO-123', // seu ID interno
  }
});

// Redirecionar para: result.init_point (produção) ou result.sandbox_init_point (teste)
```

### Frontend

```html
<!-- Botão que abre o checkout -->
<script src="https://sdk.mercadopago.com/js/v2"></script>
<script>
  const mp = new MercadoPago('SEU_PUBLIC_KEY', { locale: 'pt-BR' });
  const checkout = mp.checkout({
    preference: { id: 'PREFERENCE_ID_DO_BACKEND' },
    render: {
      container: '#mp-button',
      label: 'Pagar agora',
    }
  });
</script>
<div id="mp-button"></div>
```

---

## Checkout Bricks — Componentes prontos

Componentes de UI do MP embutidos no seu site.

```html
<script src="https://sdk.mercadopago.com/js/v2"></script>
<script>
const mp = new MercadoPago('SEU_PUBLIC_KEY', { locale: 'pt-BR' });

const bricksBuilder = mp.bricks();

// Brick de pagamento completo (cartão + PIX + boleto)
const renderPaymentBrick = async (bricksBuilder) => {
  const settings = {
    initialization: {
      amount: 99.90,
      preferenceId: 'PREFERENCE_ID',
    },
    customization: {
      paymentMethods: {
        creditCard: 'all',
        debitCard: 'all',
        ticket: 'all',      // boleto
        bankTransfer: 'all', // PIX
        atm: 'all',
      },
      visual: {
        style: {
          theme: 'default', // 'default', 'dark', 'flat', 'bootstrap'
          customVariables: {
            textPrimaryColor: '#000000',
            inputBorderColor: '#e5e7eb',
            borderRadiusFull: '8px',
          }
        }
      }
    },
    callbacks: {
      onReady: () => console.log('Brick carregado'),
      onSubmit: async ({ selectedPaymentMethod, formData }) => {
        // Enviar formData para seu backend
        const result = await fetch('/api/pagamento', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await result.json();
        if (data.status === 'approved') {
          window.location.href = '/sucesso';
        }
      },
      onError: (error) => console.error(error),
    },
  };
  
  await bricksBuilder.create('payment', 'payment-brick-container', settings);
};

renderPaymentBrick(bricksBuilder);
</script>
<div id="payment-brick-container"></div>
```

---

## Checkout Transparente — Controle total

Você cria o formulário, MP processa no backend.

### Frontend — Captura do cartão com tokenização

```javascript
const mp = new MercadoPago('SEU_PUBLIC_KEY', { locale: 'pt-BR' });

// NUNCA envie dados de cartão diretamente para seu backend
// Use sempre a tokenização do MP

async function processar() {
  const token = await mp.createCardToken({
    cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''),
    cardholderName: document.getElementById('cardName').value,
    cardExpirationMonth: document.getElementById('expMonth').value,
    cardExpirationYear: document.getElementById('expYear').value,
    securityCode: document.getElementById('cvv').value,
    identificationType: 'CPF',
    identificationNumber: document.getElementById('cpf').value,
  });
  
  // Envie apenas o token para o backend
  await fetch('/api/pagamento', {
    method: 'POST',
    body: JSON.stringify({ token: token.id, installments: 1 }),
  });
}
```

### Backend — Processar pagamento

```javascript
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
const payment = new Payment(client);

const result = await payment.create({
  body: {
    transaction_amount: 99.90,
    token: req.body.token, // token do frontend
    description: 'Nome do Produto',
    installments: req.body.installments || 1,
    payment_method_id: 'visa', // ou detecte automaticamente
    payer: {
      email: req.body.email,
      identification: {
        type: 'CPF',
        number: req.body.cpf,
      }
    },
    notification_url: 'https://seu-site.com/webhook/mercadopago',
    external_reference: req.body.pedidoId,
  }
});

// result.status: 'approved' | 'pending' | 'rejected' | 'in_process'
```

---

## PIX

```javascript
const result = await payment.create({
  body: {
    transaction_amount: 99.90,
    payment_method_id: 'pix',
    description: 'Compra #123',
    payer: {
      email: 'comprador@email.com',
      first_name: 'João',
      last_name: 'Silva',
      identification: { type: 'CPF', number: '12345678900' }
    }
  }
});

// QR Code está em:
const qrCode = result.point_of_interaction.transaction_data.qr_code;
const qrCodeBase64 = result.point_of_interaction.transaction_data.qr_code_base64;
const pixCopiaECola = result.point_of_interaction.transaction_data.qr_code;
```

---

## Webhook — Receber notificações

```javascript
// POST /webhook/mercadopago
app.post('/webhook/mercadopago', async (req, res) => {
  const { type, data } = req.body;
  
  // Valide a assinatura (recomendado em produção)
  // const isValid = validarAssinatura(req.headers['x-signature'], req.body);
  
  if (type === 'payment') {
    const payment = await new Payment(client).get({ id: data.id });
    
    switch (payment.status) {
      case 'approved':
        await atualizarPedido(payment.external_reference, 'pago');
        break;
      case 'rejected':
        await atualizarPedido(payment.external_reference, 'rejeitado');
        break;
      case 'pending':
      case 'in_process':
        // Aguardar confirmação
        break;
    }
  }
  
  res.status(200).send('OK');
});
```

---

## Assinaturas (pagamentos recorrentes)

```javascript
import { PreApprovalPlan, PreApproval } from 'mercadopago';

// 1. Criar plano
const plan = await new PreApprovalPlan(client).create({
  body: {
    reason: 'Plano Mensal Pro',
    auto_recurring: {
      frequency: 1,
      frequency_type: 'months',
      billing_day: 10,           // dia do mês para cobrar
      transaction_amount: 97.00,
      currency_id: 'BRL',
    },
    back_url: 'https://seu-site.com/assinatura',
  }
});

// 2. Assinar (usuário)
const subscription = await new PreApproval(client).create({
  body: {
    preapproval_plan_id: plan.id,
    payer_email: 'usuario@email.com',
    card_token_id: token, // token do cartão do usuário
  }
});
```

---

## Credenciais e ambiente

```env
# Produção
MP_PUBLIC_KEY=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MP_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Teste (sandbox)
MP_PUBLIC_KEY_TEST=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MP_ACCESS_TOKEN_TEST=TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Obtendo credenciais:**
1. Acesse `mercadopago.com.br/developers/pt/docs/your-integrations/credentials`
2. Crie uma aplicação
3. Copie as chaves de teste e produção separadamente

---

## Cartões de teste

| Número | Resultado |
|---|---|
| `5031 4332 1540 6351` | Aprovado |
| `4235 6477 2802 5682` | Aprovado |
| `3743 781877 55283` | Aprovado (Amex) |
| `4000 0000 0000 0002` | Recusado |
| `5031 4333 3448 1913` | Pendente |

CVV: `123` | Vencimento: qualquer data futura | CPF: qualquer CPF válido

---

## MCP Server (novo)

O Mercado Pago lançou um MCP Server oficial em `mcp.mercadopago.com`.
Com ele, o Claude pode consultar pagamentos, status de transações e relatórios diretamente:

```bash
claude mcp add mercadopago https://mcp.mercadopago.com
```

---

## Documentação oficial

- Checkout Pro: `mercadopago.com.br/developers/pt/docs/checkout-pro/overview`
- Checkout Transparente: `mercadopago.com.br/developers/pt/docs/checkout-api`
- Checkout Bricks: `mercadopago.com.br/developers/pt/docs/checkout-bricks`
- Referência API: `mercadopago.com.br/developers/pt/reference`
- SDKs: `mercadopago.com.br/developers/pt/docs/sdks-library/landing`
