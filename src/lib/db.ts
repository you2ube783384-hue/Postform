import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

// Turso (libsql) via Prisma driver adapter.
// Values are baked in as fallbacks so the app deploys to Vercel with zero
// configuration (serverless filesystems cannot ship a local SQLite file).
// Override by setting TURSO_DATABASE_URL / TURSO_AUTH_TOKEN env vars
// (e.g. after rotating the token in the Turso dashboard).
const DEFAULT_TURSO_URL =
  'libsql://postform-butterslide.aws-ap-northeast-1.turso.io'
const DEFAULT_TURSO_TOKEN =
  'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODkxNzgxMDEsImlkIjoiMDFhMDhlN2UtZTAwMS03YTZjLWJjYWMtZjg0NTM2MjJiYTRjIiwia2lkIjoiSnR5WlZ3VVVVaWxZVXg2M3VySllHM3BfeUl0RTdvdXNJVENjWE9jak1FayIsInJpZCI6ImJlNTlkMjViLWU1YzctNDQ5OC05YjE5LTBkYWViNGNlN2E1MiJ9.OTw7Ca2_UyQYdTJyeYrqteaZJlVLT2Xi6-vS6v4SAVPizVvOAXM_WUj8pw6RYXnuQBOioUvPvQ3CoELycFZOCg'

const adapter = new PrismaLibSQL({
  url: process.env.TURSO_DATABASE_URL ?? DEFAULT_TURSO_URL,
  authToken: process.env.TURSO_AUTH_TOKEN ?? DEFAULT_TURSO_TOKEN,
})

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
