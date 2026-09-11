#!/usr/bin/env node
/**
 * POSTFORM — Push local SQLite database to Turso (or any libsql URL).
 *
 * Mirrors the full schema (tables + indexes) and all rows from the local
 * `db/custom.db` into the target database. Safe to re-run: uses
 * INSERT OR REPLACE semantics, so existing rows are updated in place.
 *
 * Usage:
 *   TURSO_DATABASE_URL=libsql://your-db.turso.io \
 *   TURSO_AUTH_TOKEN=eyJ... \
 *   node scripts/push-to-turso.mjs [--reset]
 *
 * Env vars:
 *   TURSO_DATABASE_URL  Target libsql URL (required).
 *                       Also accepts file:./path.db for local testing.
 *   TURSO_AUTH_TOKEN    Auth token for Turso (required for libsql:// URLs).
 *   SOURCE_DB           Local source DB (default: ./db/custom.db).
 *
 * Flags:
 *   --reset   DROP target tables before copying (destructive on target).
 */

import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------- args/env
const args = process.argv.slice(2);
const RESET = args.includes("--reset");

const TARGET_URL = process.env.TURSO_DATABASE_URL;
const TARGET_TOKEN = process.env.TURSO_AUTH_TOKEN;
const SOURCE_DB = process.env.SOURCE_DB ?? path.resolve("db/custom.db");

if (!TARGET_URL) {
  console.error(
    "Error: TURSO_DATABASE_URL is not set.\n\n" +
      "  For a Turso target:\n" +
      "    TURSO_DATABASE_URL=libsql://<db-name>-<org>.turso.io \\\n" +
      "    TURSO_AUTH_TOKEN=eyJ... \\\n" +
      "    node scripts/push-to-turso.mjs\n\n" +
      "  For a local-file dry run:\n" +
      "    TURSO_DATABASE_URL=file:./db/dry-run.db node scripts/push-to-turso.mjs --reset\n"
  );
  process.exit(1);
}

const isRemote = TARGET_URL.startsWith("libsql://") || TARGET_URL.startsWith("wss://");
if (isRemote && !TARGET_TOKEN) {
  console.error("Error: TURSO_AUTH_TOKEN is required for libsql:// targets.");
  process.exit(1);
}

// ---------------------------------------------------------------- clients
const source = createClient({ url: `file:${SOURCE_DB}` });
const target = createClient(
  isRemote ? { url: TARGET_URL, authToken: TARGET_TOKEN } : { url: TARGET_URL }
);

const log = (msg) => console.log(msg);
const fail = (msg) => {
  console.error(`Error: ${msg}`);
  process.exit(1);
};

// ------------------------------------------------------------ read source
async function readSource() {
  const tables = (
    await source.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
  ).rows.map((r) => r.name);

  const ddlStatements = (
    await source.execute(
      "SELECT type, name, sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%'"
    )
  ).rows.filter((r) => r.type === "table" || r.type === "index");

  const data = {};
  const columns = {};
  for (const t of tables) {
    const colRows = (await source.execute(`PRAGMA table_info("${t}")`)).rows;
    columns[t] = colRows.map((r) => r.name);
    const rows = (await source.execute(`SELECT * FROM "${t}"`)).rows;
    data[t] = rows;
  }
  return { tables, ddlStatements, data, columns };
}

// ------------------------------------------------------------- migration
async function migrate() {
  log(`Source: file:${SOURCE_DB}`);
  log(`Target: ${TARGET_URL}${isRemote ? " (Turso, remote)" : " (local file)"}${RESET ? " [--reset]" : ""}\n`);

  const { tables, ddlStatements, data, columns } = await readSource();

  const totalRows = Object.values(data).reduce((n, rows) => n + rows.length, 0);
  log(`Schema objects: ${ddlStatements.length} | tables: ${tables.length} | total rows: ${totalRows}`);

  // -- optional destructive reset
  if (RESET) {
    const existing = (
      await target.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    ).rows.map((r) => r.name);
    if (existing.length) {
      log(`Dropping ${existing.length} existing target table(s): ${existing.join(", ")}`);
      // drop in reverse order is not strictly needed (no FK enforcement pragma set), but be safe
      await target.executeMultiple(
        existing.map((t) => `DROP TABLE IF EXISTS "${t}";`).join("\n")
      );
    }
  }

  // -- create schema (idempotent)
  log("\n[1/3] Creating schema...");
  const ddl = ddlStatements
    .map((r) => {
      const s = r.sql.trim();
      return s.endsWith(";") ? s : s + ";";
    })
    .join("\n");
  // make table creation idempotent without relying on the original DDL text
  const idempotentDdl = ddl
    .replace(/CREATE TABLE "/g, 'CREATE TABLE IF NOT EXISTS "')
    .replace(/CREATE UNIQUE INDEX "/g, 'CREATE UNIQUE INDEX IF NOT EXISTS "')
    .replace(/CREATE INDEX "/g, 'CREATE INDEX IF NOT EXISTS "');
  try {
    await target.executeMultiple(idempotentDdl);
  } catch (e) {
    fail(`schema creation failed: ${e.message}\nDDL was:\n${idempotentDdl}`);
  }
  log(`  -> ${ddlStatements.length} statements applied (IF NOT EXISTS)`);

  // -- copy data
  log("\n[2/3] Copying data...");
  // parent tables first (Product), then children, then k/v settings
  const order = ["Product", "ProductImage", "ProductVariant", "StoreSetting"].filter((t) =>
    tables.includes(t)
  );
  const rest = tables.filter((t) => !order.includes(t));
  const copyOrder = [...order, ...rest];

  for (const t of copyOrder) {
    const cols = columns[t];
    const rows = data[t];
    if (!rows.length) {
      log(`  -> ${t}: 0 rows (skipped)`);
      continue;
    }
    const placeholders = cols.map(() => "?").join(", ");
    const colList = cols.map((c) => `"${c}"`).join(", ");
    const sql = `INSERT OR REPLACE INTO "${t}" (${colList}) VALUES (${placeholders})`;
    const stmts = rows.map((row) => ({
      sql,
      args: cols.map((c) => (row[c] === undefined ? null : row[c])),
    }));
    try {
      await target.batch(stmts, "write");
    } catch (e) {
      fail(`copying table ${t} failed: ${e.message}`);
    }
    log(`  -> ${t}: ${rows.length} rows`);
  }

  // -- verify
  log("\n[3/3] Verifying...");
  let ok = true;
  for (const t of copyOrder) {
    const targetCount = (await target.execute(`SELECT COUNT(*) AS n FROM "${t}"`)).rows[0];
    const n = Number(targetCount.n);
    const match = n === data[t].length;
    if (!match) ok = false;
    log(`  ${match ? "OK " : "BAD"} ${t}: target=${n} source=${data[t].length}`);
  }

  if (!ok) fail("row-count verification FAILED — target does not match source.");
  log("\nMigration complete and verified. ✓");
}

migrate().catch((e) => {
  console.error("Unhandled migration error:", e);
  process.exit(1);
});
