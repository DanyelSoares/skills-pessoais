---
name: google-calendar
description: Integra Google Calendar em aplicações — criar, listar, atualizar e deletar eventos, verificar disponibilidade, sincronizar agendas, configurar lembretes. Use ao implementar agendamento, reservas ou qualquer funcionalidade de calendário.
---

## Argumento (o que implementar): $ARGUMENTS

---

## Setup inicial — OAuth 2.0

O Google Calendar exige OAuth 2.0. Nunca use API Key para dados do usuário.

### 1. Configurar no Google Cloud Console

```
1. Acesse: console.cloud.google.com
2. Crie um projeto (ou selecione existente)
3. Ative a API: APIs e Serviços → Biblioteca → "Google Calendar API" → Ativar
4. Crie credenciais: APIs e Serviços → Credenciais → Criar credenciais → ID do cliente OAuth
5. Tipo: "Aplicativo da Web"
6. URIs de redirecionamento autorizados: http://localhost:3000/auth/callback (dev)
                                         https://seu-site.com/auth/callback (prod)
7. Baixe o arquivo credentials.json
```

### 2. Instalar SDK

```bash
npm install googleapis
```

### 3. Configurar autenticação (Node.js)

```javascript
import { google } from 'googleapis';
import fs from 'fs';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',        // leitura + escrita
  'https://www.googleapis.com/auth/calendar.readonly' // só leitura (use quando possível)
];

// Para aplicações server-side (seus próprios dados)
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: SCOPES,
});

// Para dados de usuários (OAuth flow)
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
```

### 4. Fluxo OAuth para usuários

```javascript
// Rota 1: Gerar URL de autorização
app.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',     // recebe refresh_token
    scope: SCOPES,
    prompt: 'consent',          // força mostrar tela de consentimento
  });
  res.redirect(authUrl);
});

// Rota 2: Callback após autorização
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  
  // Salve os tokens no banco de dados do usuário
  await salvarTokens(userId, tokens);
  // tokens.access_token (expira em 1h)
  // tokens.refresh_token (longa duração, só na primeira autorização)
  
  res.redirect('/dashboard');
});

// Uso posterior: restaurar tokens salvos
oauth2Client.setCredentials(tokensDoUsuario);
// Se o access_token expirar, o SDK renova automaticamente com o refresh_token
```

---

## Operações principais

### Listar eventos

```javascript
const response = await calendar.events.list({
  calendarId: 'primary', // 'primary' = calendário principal do usuário
  timeMin: new Date().toISOString(),   // a partir de agora
  timeMax: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // próximos 7 dias
  maxResults: 50,
  singleEvents: true,    // expande eventos recorrentes em ocorrências individuais
  orderBy: 'startTime',
});

const eventos = response.data.items;
// evento.summary = título
// evento.start.dateTime = início (ISO 8601)
// evento.end.dateTime = fim
// evento.location = local
// evento.description = descrição
// evento.attendees = participantes
// evento.hangoutLink = link do Google Meet (se criado com conferência)
```

### Criar evento

```javascript
const novoEvento = await calendar.events.insert({
  calendarId: 'primary',
  requestBody: {
    summary: 'Reunião com cliente',
    description: 'Discussão sobre o projeto X',
    location: 'Maceió, AL ou Google Meet',
    start: {
      dateTime: '2026-07-01T10:00:00-03:00', // horário de Brasília = UTC-3
      timeZone: 'America/Maceio',
    },
    end: {
      dateTime: '2026-07-01T11:00:00-03:00',
      timeZone: 'America/Maceio',
    },
    attendees: [
      { email: 'cliente@empresa.com' },
      { email: 'colega@empresa.com' },
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 dia antes por email
        { method: 'popup', minutes: 30 },       // 30 min antes notificação
      ],
    },
    // Criar link do Google Meet automaticamente:
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      }
    },
  },
  conferenceDataVersion: 1, // necessário para criar o Meet
});

console.log('Evento criado:', novoEvento.data.htmlLink);
console.log('Google Meet:', novoEvento.data.hangoutLink);
```

### Atualizar evento

```javascript
await calendar.events.patch({
  calendarId: 'primary',
  eventId: 'EVENT_ID',
  requestBody: {
    summary: 'Título atualizado',
    // Só inclua os campos que quer alterar
  },
});
```

### Deletar evento

```javascript
await calendar.events.delete({
  calendarId: 'primary',
  eventId: 'EVENT_ID',
  sendUpdates: 'all', // notifica participantes: 'all' | 'externalOnly' | 'none'
});
```

### Verificar disponibilidade (freebusy)

```javascript
const response = await calendar.freebusy.query({
  requestBody: {
    timeMin: '2026-07-01T00:00:00-03:00',
    timeMax: '2026-07-01T23:59:59-03:00',
    timeZone: 'America/Maceio',
    items: [
      { id: 'primary' },
      { id: 'outro-calendario@group.calendar.google.com' },
    ],
  },
});

const periodoOcupado = response.data.calendars.primary.busy;
// [{ start: '2026-07-01T10:00:00Z', end: '2026-07-01T11:00:00Z' }, ...]
```

---

## Casos de uso práticos

### Sistema de agendamento — verificar horários disponíveis

```javascript
async function getHorariosDisponiveis(data, duracao = 60) {
  const inicio = new Date(`${data}T08:00:00-03:00`);
  const fim = new Date(`${data}T18:00:00-03:00`);
  
  // Buscar eventos do dia
  const { data: { items } } = await calendar.events.list({
    calendarId: 'primary',
    timeMin: inicio.toISOString(),
    timeMax: fim.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });
  
  // Calcular slots disponíveis
  const slots = [];
  let cursor = inicio;
  
  for (const evento of items) {
    const eventoInicio = new Date(evento.start.dateTime);
    
    // Se tem espaço antes do evento
    while (new Date(cursor.getTime() + duracao * 60000) <= eventoInicio) {
      slots.push(new Date(cursor));
      cursor = new Date(cursor.getTime() + 30 * 60000); // intervalos de 30min
    }
    
    cursor = new Date(Math.max(cursor, new Date(evento.end.dateTime)));
  }
  
  // Slots restantes após o último evento
  while (new Date(cursor.getTime() + duracao * 60000) <= fim) {
    slots.push(new Date(cursor));
    cursor = new Date(cursor.getTime() + 30 * 60000);
  }
  
  return slots;
}
```

### Evento recorrente (reunião semanal)

```javascript
await calendar.events.insert({
  calendarId: 'primary',
  requestBody: {
    summary: 'Reunião de equipe',
    start: {
      dateTime: '2026-07-07T09:00:00-03:00',
      timeZone: 'America/Maceio',
    },
    end: {
      dateTime: '2026-07-07T10:00:00-03:00',
      timeZone: 'America/Maceio',
    },
    recurrence: [
      'RRULE:FREQ=WEEKLY;BYDAY=MO', // toda segunda-feira
      // 'RRULE:FREQ=WEEKLY;COUNT=10' — 10 ocorrências
      // 'RRULE:FREQ=MONTHLY;BYMONTHDAY=15' — dia 15 de cada mês
    ],
  },
});
```

---

## Variáveis de ambiente

```env
GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
```

---

## Limites da API (quotas)

| Recurso | Limite |
|---|---|
| Requisições por dia | 1.000.000 |
| Requisições por 100 segundos | 1.000 |
| Requisições por usuário por 100 segundos | 100 |

Para aumentar os limites, solicite quota adicional no Google Cloud Console.

---

## Documentação oficial

- Guia completo: `developers.google.com/workspace/calendar/api/guides/overview`
- Referência da API v3: `developers.google.com/workspace/calendar/api/v3/reference`
- Autenticação: `developers.google.com/workspace/guides/auth-overview`
