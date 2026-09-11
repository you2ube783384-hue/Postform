#!/usr/bin/env node
/**
 * Calls testsprite_check_account_info via MCP to verify the API key is valid.
 */
import { spawn } from "node:child_process";

const API_KEY = process.env.API_KEY;

function send(proc, obj) {
  proc.stdin.write(JSON.stringify(obj) + "\n");
}

const proc = spawn("npx", ["@testsprite/testsprite-mcp@latest"], {
  env: { ...process.env, API_KEY },
  stdio: ["pipe", "pipe", "pipe"],
});

let buffer = "";
const responses = {};

proc.stdout.on("data", (chunk) => {
  buffer += chunk.toString();
  let idx;
  while ((idx = buffer.indexOf("\n")) !== -1) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;
    try {
      const msg = JSON.parse(line);
      if (msg.id !== undefined && (msg.result || msg.error)) responses[msg.id] = msg;
    } catch {}
  }
});

const waitFor = (id, cb, tries = 0) => {
  if (responses[id]) return cb(responses[id]);
  if (tries > 600) return cb(null);
  setTimeout(() => waitFor(id, cb, tries + 1), 100);
};

send(proc, {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "postform-mcp-test", version: "1.0.0" },
  },
});

waitFor(1, () => {
  send(proc, { jsonrpc: "2.0", method: "notifications/initialized" });
  send(proc, {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: { name: "testsprite_check_account_info", arguments: {} },
  });

  waitFor(2, (resp) => {
    if (!resp) {
      console.log("NO RESPONSE (timeout)");
    } else if (resp.error) {
      console.log("TOOL ERROR:", JSON.stringify(resp.error, null, 2));
    } else {
      const content = resp.result?.content ?? [];
      for (const c of content) {
        if (c.type === "text") console.log(c.text);
        else console.log(JSON.stringify(c).slice(0, 500));
      }
      if (resp.result?.isError) console.log("(tool reported an error)");
    }
    proc.kill();
    process.exit(0);
  });
});
