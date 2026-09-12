#!/usr/bin/env node
/**
 * Reusable TestSprite MCP tool caller.
 * Usage: node mcp-call.mjs <toolName> [jsonArgs] [--timeout ms] [--schema]
 *   --schema     : dump full tools/list JSON (schemas) instead of calling a tool
 * Env: API_KEY (required), MCP_TIMEOUT (default 600000)
 */
import { spawn } from "node:child_process";

const API_KEY = process.env.API_KEY;
const args = process.argv.slice(2);
const schemaMode = args.includes("--schema");
const timeoutIdx = args.indexOf("--timeout");
const TIMEOUT = timeoutIdx !== -1 ? Number(args[timeoutIdx + 1]) : Number(process.env.MCP_TIMEOUT || 600000);
const skipIdx = new Set();
if (timeoutIdx !== -1) {
  skipIdx.add(timeoutIdx);
  skipIdx.add(timeoutIdx + 1);
}
const positional = args.filter((a, i) => a && !skipIdx.has(i) && a !== "--schema");
const toolName = positional[0];
const toolArgs = positional[1] ? JSON.parse(positional[1]) : {};

if (!API_KEY) {
  console.error("API_KEY env required");
  process.exit(1);
}
if (!schemaMode && !toolName) {
  console.error("Usage: node mcp-call.mjs <toolName> [jsonArgs] | --schema");
  process.exit(1);
}

const proc = spawn("npx", ["@testsprite/testsprite-mcp@latest"], {
  env: { ...process.env, API_KEY },
  stdio: ["pipe", "pipe", "pipe"],
});

let buffer = "";
const responses = {};
let stderrTail = "";

proc.stdout.on("data", (chunk) => {
  buffer += chunk.toString();
  let idx;
  while ((idx = buffer.indexOf("\n")) !== -1) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;
    try {
      const msg = JSON.parse(line);
      if (msg.id !== undefined && (msg.result !== undefined || msg.error !== undefined)) {
        responses[msg.id] = msg;
      } else if (msg.method === "notifications/message" || msg.method?.startsWith("notifications/")) {
        // progress / log notifications — surface short text to stderr so long waits are visible
        const note = msg.params?.data ?? msg.params;
        if (note && typeof note === "object" && note.text) process.stderr.write(`[notif] ${String(note.text).slice(0, 300)}\n`);
      }
    } catch {}
  }
});

proc.stderr.on("data", (chunk) => {
  const s = chunk.toString();
  stderrTail = (stderrTail + s).slice(-2000);
});

const send = (obj) => proc.stdin.write(JSON.stringify(obj) + "\n");

send({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "postform-mcp-client", version: "1.0.0" },
  },
});

const killTimer = setTimeout(() => {
  console.error(`\nTIMEOUT after ${TIMEOUT}ms — server stderr tail:\n${stderrTail}`);
  proc.kill();
  process.exit(2);
}, TIMEOUT);

const waitFor = (id, cb, tries = 0) => {
  if (responses[id]) return cb(responses[id]);
  if (tries * 200 > TIMEOUT) return cb(null);
  setTimeout(() => waitFor(id, cb, tries + 1), 200);
};

waitFor(1, (initResp) => {
  if (!initResp) {
    console.error("Handshake failed");
    proc.kill();
    process.exit(2);
  }
  send({ jsonrpc: "2.0", method: "notifications/initialized" });

  if (schemaMode) {
    send({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
    waitFor(2, (resp) => {
      clearTimeout(killTimer);
      const tools = resp?.result?.tools ?? [];
      console.log(JSON.stringify(tools, null, 2));
      proc.kill();
      process.exit(0);
    });
    return;
  }

  send({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: { name: toolName, arguments: toolArgs },
  });

  waitFor(2, (resp) => {
    clearTimeout(killTimer);
    if (!resp) {
      console.error("No response (timeout)");
      proc.kill();
      process.exit(2);
    }
    if (resp.error) {
      console.error("MCP ERROR:", JSON.stringify(resp.error, null, 2));
      proc.kill();
      process.exit(3);
    }
    const content = resp.result?.content ?? [];
    for (const c of content) {
      if (c.type === "text") console.log(c.text);
      else console.log(JSON.stringify(c).slice(0, 2000));
    }
    if (resp.result?.isError) {
      console.error("(tool reported an error)");
      proc.kill();
      process.exit(4);
    }
    proc.kill();
    process.exit(0);
  });
});
