#!/usr/bin/env node
// Testa o conector: sobe o servidor MCP, lista as ferramentas e, se houver
// configuração, lista as contas acessíveis. Rode: npm run testar
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { CONFIG_FILE } from "./lib.mjs";

const servidor = fileURLToPath(new URL("./server.mjs", import.meta.url));
const client = new Client({ name: "teste", version: "1.0.0" });
await client.connect(new StdioClientTransport({ command: process.execPath, args: [servidor] }));
const { tools } = await client.listTools();
console.log("Ferramentas:", tools.map((t) => t.name).join(", "));
if (existsSync(CONFIG_FILE)) {
  const r = await client.callTool({ name: "listar_contas", arguments: {} });
  console.log(r.isError ? "ERRO: " : "Contas: ", r.content[0].text);
} else {
  console.log(`Sem credenciais ainda (${CONFIG_FILE}). Rode: npm run autorizar`);
}
await client.close();
