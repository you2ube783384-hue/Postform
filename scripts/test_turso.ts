#!/usr/bin/env bun
/** Test Turso connection and list existing tables */
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

async function main() {
  try {
    const res = await client.execute('SELECT 1 AS ok')
    console.log('✓ Connection OK:', JSON.stringify(res.rows[0]))

    const tables = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma%'"
    )
    console.log('Existing tables:', tables.rows.map(r => r.name).join(', ') || '(none)')
  } catch (e) {
    console.error('✗ Connection failed:', e)
    process.exit(1)
  }
}

main()
