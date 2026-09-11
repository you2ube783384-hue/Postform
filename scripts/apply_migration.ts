#!/usr/bin/env bun
/** Apply prisma/migration.sql to Turso */
import { createClient } from '@libsql/client'
import { readFileSync } from 'fs'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

async function main() {
  const sql = readFileSync('./prisma/migration.sql', 'utf-8')
  const statements = sql
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n')
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  for (const stmt of statements) {
    await client.execute(stmt)
  }
  console.log(`✓ Applied ${statements.length} statements`)

  const tables = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
  )
  console.log('Tables:', tables.rows.map(r => r.name).join(', '))
}

main().catch(e => { console.error(e); process.exit(1) })
