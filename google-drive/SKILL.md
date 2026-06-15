---
name: google-drive
description: Integra Google Drive em aplicações — upload, download, listagem, criação de pastas, compartilhamento, busca de arquivos, Google Docs/Sheets/Slides via API. Use ao implementar armazenamento em nuvem, backup, colaboração ou gerenciamento de documentos.
---

## Argumento (o que implementar): $ARGUMENTS

---

## Setup — mesmo OAuth do Google Calendar

O Drive usa a mesma infraestrutura OAuth. Se já configurou o Google Calendar, o cliente OAuth é reutilizável.

```bash
npm install googleapis
```

```javascript
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Scopes para Drive
const DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive',           // acesso completo
  'https://www.googleapis.com/auth/drive.file',      // apenas arquivos criados pelo app (recomendado)
  'https://www.googleapis.com/auth/drive.readonly',  // só leitura
];

const drive = google.drive({ version: 'v3', auth: oauth2Client });
```

**Prefira `drive.file`** em vez de `drive` quando possível — menor permissão, mais fácil de aprovar pelo usuário.

---

## Operações principais

### Listar arquivos

```javascript
const response = await drive.files.list({
  pageSize: 20,
  fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime, webViewLink)',
  q: "'root' in parents and trashed = false", // apenas arquivos na raiz, não deletados
  orderBy: 'modifiedTime desc',
});

const arquivos = response.data.files;
// arquivo.id, arquivo.name, arquivo.mimeType, arquivo.webViewLink
```

**Filtros úteis (`q`):**

```javascript
// Apenas PDFs
`mimeType = 'application/pdf'`

// Arquivos em uma pasta específica
`'FOLDER_ID' in parents and trashed = false`

// Busca por nome
`name contains 'relatorio' and trashed = false`

// Google Docs
`mimeType = 'application/vnd.google-apps.document'`

// Modificados hoje
`modifiedTime > '2026-06-15T00:00:00' and trashed = false`

// Combinando filtros
`'FOLDER_ID' in parents and mimeType = 'application/pdf' and trashed = false`
```

### Upload de arquivo

```javascript
import fs from 'fs';
import path from 'path';

async function uploadArquivo(caminhoLocal, nomeDrive, pastaId = null) {
  const mimeType = obterMimeType(path.extname(caminhoLocal));
  
  const response = await drive.files.create({
    requestBody: {
      name: nomeDrive,
      parents: pastaId ? [pastaId] : ['root'],
    },
    media: {
      mimeType: mimeType,
      body: fs.createReadStream(caminhoLocal),
    },
    fields: 'id, name, webViewLink, webContentLink',
  });
  
  return response.data;
}

// Upload de conteúdo em memória (sem arquivo local)
async function uploadConteudo(conteudo, nome, mimeType, pastaId = null) {
  const { Readable } = await import('stream');
  
  const response = await drive.files.create({
    requestBody: {
      name: nome,
      parents: pastaId ? [pastaId] : ['root'],
    },
    media: {
      mimeType: mimeType,
      body: Readable.from(conteudo),
    },
    fields: 'id, name, webViewLink',
  });
  
  return response.data;
}

// Upload multipart (para arquivos grandes)
async function uploadGrande(caminhoLocal, nome) {
  const stat = fs.statSync(caminhoLocal);
  // Para arquivos > 5MB, o SDK usa resumable upload automaticamente
  // Para forçar resumable:
  const response = await drive.files.create({
    requestBody: { name: nome },
    media: { body: fs.createReadStream(caminhoLocal) },
    fields: 'id',
  }, {
    // Callbacks de progresso
    onUploadProgress: (evt) => {
      const progress = (evt.bytesRead / stat.size) * 100;
      console.log(`Upload: ${progress.toFixed(1)}%`);
    },
  });
  return response.data;
}
```

### Download de arquivo

```javascript
import fs from 'fs';

// Download de arquivo binário
async function downloadArquivo(fileId, destinoLocal) {
  const dest = fs.createWriteStream(destinoLocal);
  
  const response = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' }
  );
  
  return new Promise((resolve, reject) => {
    response.data
      .on('error', reject)
      .pipe(dest)
      .on('finish', resolve);
  });
}

// Exportar Google Doc como PDF
async function exportarComoObter(fileId, mimeTypeDestino = 'application/pdf') {
  const response = await drive.files.export(
    { fileId, mimeType: mimeTypeDestino },
    { responseType: 'stream' }
  );
  return response.data; // stream para salvar ou retornar
}

// mimeType de exportação:
// Google Docs → 'application/pdf' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
// Google Sheets → 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
// Google Slides → 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
```

### Criar pasta

```javascript
async function criarPasta(nome, pastaParenteId = null) {
  const response = await drive.files.create({
    requestBody: {
      name: nome,
      mimeType: 'application/vnd.google-apps.folder',
      parents: pastaParenteId ? [pastaParenteId] : ['root'],
    },
    fields: 'id, name',
  });
  return response.data;
}
```

### Compartilhar arquivo

```javascript
// Compartilhar com email específico
async function compartilharComUsuario(fileId, email, role = 'reader') {
  await drive.permissions.create({
    fileId,
    requestBody: {
      type: 'user',
      role: role, // 'reader' | 'commenter' | 'writer' | 'owner'
      emailAddress: email,
    },
    sendNotificationEmail: true,
    emailMessage: 'Compartilhei este arquivo com você.',
  });
}

// Tornar público (qualquer um com o link pode ver)
async function tornarPublico(fileId) {
  await drive.permissions.create({
    fileId,
    requestBody: {
      type: 'anyone',
      role: 'reader',
    },
  });
  
  // Obter link público
  const file = await drive.files.get({
    fileId,
    fields: 'webViewLink, webContentLink',
  });
  
  return file.data.webViewLink; // link para visualizar
}

// Listar permissões atuais
async function listarPermissoes(fileId) {
  const response = await drive.permissions.list({
    fileId,
    fields: 'permissions(id, type, role, emailAddress)',
  });
  return response.data.permissions;
}

// Remover compartilhamento
async function removerPermissao(fileId, permissionId) {
  await drive.permissions.delete({ fileId, permissionId });
}
```

### Buscar arquivos

```javascript
async function buscar(termo) {
  const response = await drive.files.list({
    q: `name contains '${termo}' and trashed = false`,
    fields: 'files(id, name, mimeType, modifiedTime, webViewLink)',
    orderBy: 'modifiedTime desc',
    pageSize: 10,
  });
  return response.data.files;
}

// Busca com paginação
async function buscarComPaginacao(query, pageToken = null) {
  const response = await drive.files.list({
    q: query,
    pageSize: 20,
    pageToken: pageToken,
    fields: 'nextPageToken, files(id, name, mimeType)',
  });
  return {
    arquivos: response.data.files,
    proximaPagina: response.data.nextPageToken, // null se última página
  };
}
```

---

## Casos de uso práticos

### Backup automático de arquivos

```javascript
async function backupParaDrive(arquivosLocais, pastaNome) {
  // Criar pasta de backup com timestamp
  const pasta = await criarPasta(`Backup ${new Date().toLocaleDateString('pt-BR')}`);
  
  for (const arquivo of arquivosLocais) {
    await uploadArquivo(arquivo.caminho, arquivo.nome, pasta.id);
    console.log(`✓ ${arquivo.nome} enviado`);
  }
  
  return pasta.id;
}
```

### Salvar relatório gerado pela IA

```javascript
async function salvarRelatorioIA(conteudoHTML, nome) {
  // Salva como Google Doc (editável depois)
  const response = await drive.files.create({
    requestBody: {
      name: nome,
      mimeType: 'application/vnd.google-apps.document', // cria como Google Doc
    },
    media: {
      mimeType: 'text/html',
      body: Readable.from(conteudoHTML),
    },
    fields: 'id, webViewLink',
  });
  return response.data.webViewLink;
}
```

### App de ambientes/arquitetura — salvar imagens e projetos

```javascript
// Upload de imagem de referência
async function salvarImagemAmbiente(imagemBuffer, descricao, pastaProjetoId) {
  const response = await drive.files.create({
    requestBody: {
      name: `${descricao}_${Date.now()}.jpg`,
      parents: [pastaProjetoId],
      description: descricao,
    },
    media: {
      mimeType: 'image/jpeg',
      body: Readable.from(imagemBuffer),
    },
    fields: 'id, webViewLink, webContentLink',
  });
  return response.data;
}

// Estrutura de pastas por projeto
async function criarEstruturaProjeto(nomeCliente) {
  const clientePasta = await criarPasta(nomeCliente);
  const referenciaPasta = await criarPasta('Referências', clientePasta.id);
  const simulacoesPasta = await criarPasta('Simulações', clientePasta.id);
  const aprovadoPasta = await criarPasta('Aprovado', clientePasta.id);
  return { clientePasta, referenciaPasta, simulacoesPasta, aprovadoPasta };
}
```

---

## MimeTypes comuns

| Tipo | MIME Type |
|---|---|
| Google Docs | `application/vnd.google-apps.document` |
| Google Sheets | `application/vnd.google-apps.spreadsheet` |
| Google Slides | `application/vnd.google-apps.presentation` |
| Pasta | `application/vnd.google-apps.folder` |
| PDF | `application/pdf` |
| Word (.docx) | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| Excel (.xlsx) | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| Imagem JPEG | `image/jpeg` |
| Imagem PNG | `image/png` |

---

## Documentação oficial

- Visão geral: `developers.google.com/workspace/drive/api/guides/about-sdk`
- Referência v3: `developers.google.com/workspace/drive/api/reference/rest/v3`
- Sobre apps: `developers.google.com/workspace/drive/api/guides/about-apps`
