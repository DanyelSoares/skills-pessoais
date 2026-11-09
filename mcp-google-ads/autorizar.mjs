#!/usr/bin/env node
// Assistente de configuração: pede as credenciais, abre o login do Google e grava
// ~/.google-ads-mcp/config.json (fora do repositório). Rode: npm run autorizar
import { createServer } from "node:http";
import { createHash, randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { exec } from "node:child_process";
import { CONFIG_DIR, CONFIG_FILE } from "./lib.mjs";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const atual = existsSync(CONFIG_FILE) ? JSON.parse(readFileSync(CONFIG_FILE, "utf8")) : {};
const pergunta = async (txt, chave) => {
  const v = (await rl.question(`${txt}${atual[chave] ? " [Enter mantém o atual]" : ""}: `)).trim();
  return v || atual[chave] || "";
};

console.log("\n=== Conector Google Ads — configuração ===\n");
const cfg = {
  client_id: await pergunta("Client ID (OAuth, tipo App para computador)", "client_id"),
  client_secret: await pergunta("Client secret", "client_secret"),
  developer_token: await pergunta("Developer token (Central de API da conta de administrador)", "developer_token"),
  login_customer_id: await pergunta("ID da conta de ADMINISTRADOR (MCC), ex.: 123-456-7890", "login_customer_id"),
  api_version: atual.api_version || "v25",
};
rl.close();
if (!cfg.client_id || !cfg.client_secret || !cfg.developer_token) {
  console.error("Client ID, client secret e developer token são obrigatórios."); process.exit(1);
}

const verifier = randomBytes(32).toString("base64url");
const challenge = createHash("sha256").update(verifier).digest("base64url");
const state = randomBytes(16).toString("hex");

const srv = createServer();
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const redirect = `http://127.0.0.1:${srv.address().port}`;
const url = "https://accounts.google.com/o/oauth2/v2/auth?" + new URLSearchParams({
  client_id: cfg.client_id, redirect_uri: redirect, response_type: "code",
  scope: "https://www.googleapis.com/auth/adwords", access_type: "offline", prompt: "consent",
  code_challenge: challenge, code_challenge_method: "S256", state,
});

console.log("\nAbrindo o navegador para você entrar com a conta Google que acessa o Google Ads...");
console.log("Se não abrir, copie este link:\n" + url + "\n");
exec(process.platform === "win32" ? `start "" "${url}"` : `open "${url}" || xdg-open "${url}"`);

const code = await new Promise((resolve, reject) => {
  srv.on("request", (req, res) => {
    const q = new URL(req.url, redirect).searchParams;
    if (!q.get("code") && !q.get("error")) { res.end(); return; }
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    if (q.get("state") !== state || q.get("error")) {
      res.end("<h2>Autorização cancelada ou inválida. Feche esta aba e tente de novo.</h2>");
      reject(new Error(q.get("error") || "state inválido")); return;
    }
    res.end("<h2>Pronto! Pode fechar esta aba e voltar ao terminal.</h2>");
    resolve(q.get("code"));
  });
});
srv.close();

const r = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ client_id: cfg.client_id, client_secret: cfg.client_secret, code,
    code_verifier: verifier, grant_type: "authorization_code", redirect_uri: redirect }),
});
const tok = await r.json();
if (!r.ok || !tok.refresh_token) { console.error("Falha ao obter o token:", tok); process.exit(1); }
cfg.refresh_token = tok.refresh_token;

mkdirSync(CONFIG_DIR, { recursive: true });
writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2), { mode: 0o600 });
console.log(`\nConfiguração salva em ${CONFIG_FILE}`);
console.log('Teste com: npm run testar');
