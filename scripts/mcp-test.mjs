#!/usr/bin/env node
/**
 * MCP stdio client test for the TestSprite MCP server.
 * Spawns the server via npx, performs the initialize handshake,
 * then lists available tools. Verifies the connection end-to-end.
 */
import { spawn } from "node:child_process";

const API_KEY = process.env.API_KEY;

function send(proc, obj) {
  const line = JSON.stringify(obj) + "\n";
  proc.stdin.write(line);
}

function run() {
  return new Promise((resolve) => {
    const proc = spawn("npx", ["@testsprite/testsprite-mcp@latest"], {
      env: { ...process.env, API_KEY },
      stdio: ["pipe", "pipe", "pipe"],
    });

    let buffer = "";
    const responses = {};
    let stderr = "";

    const timeout = setTimeout(() => {
      console.error("TIMEOUT: no response from MCP server within 90s");
      proc.kill();
      resolve({ ok: false, responses, stderr });
    }, 90000);

    proc.stdout.on("data", (chunk) => {
      buffer += chunk.toString();
      // MCP stdio transport: newline-delimited JSON-RPC
      let idx;
      while ((idx = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 1);
        if (!line) continue;
        try {
          const msg = JSON.parse(line);
          if (msg.id !== undefined && (msg.result || msg.error)) {
            responses[msg.id] = msg;
          }
        } catch {
          // non-JSON log line — ignore
        }
      }
    });

    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    proc.on("error", (err) => {
      console.error("SPAWN ERROR:", err.message);
      clearTimeout(timeout);
      resolve({ ok: false, responses, stderr });
    });

    proc.on("close", (code) => {
      clearTimeout(timeout);
      resolve({ ok: false, responses, stderr, exitCode: code });
    });

    // 1. initialize handshake
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

    const waitFor = (id, cb, tries = 0) => {
      if (responses[id]) return cb(responses[id]);
      if (tries > 300) return; // ~30s
      setTimeout(() => waitFor(id, cb, tries + 1), 100);
    };

    waitFor(1, (initResp) => {
      // 2. initialized notification
      send(proc, { jsonrpc: "2.0", method: "notifications/initialized" });
      // 3. list tools
      send(proc, { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });

      waitFor(2, (toolsResp) => {
        console.log("=== MCP CONNECTION SUCCESSFUL ===");
        const info = initResp.result?.serverInfo ?? {};
        console.log("Server:", info.name, info.version ?? "");
        console.log("Protocol:", initResp.result?.protocolVersion);

        const tools = toolsResp.result?.tools ?? [];
        console.log(`\nTools available: ${tools.length}`);
        for (const t of tools) {
          console.log(`\n- ${t.name}`);
          if (t.description) {
            console.log(`  ${(t.description || "").split("\n")[0].slice(0, 200)}`);
          }
        }
        clearTimeout(timeout);
        proc.kill();
        resolve({ ok: true, tools });
      });
    });
  });
}

const result = await run();
process.exit(result.ok ? 0 : 1);
