import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

// Turso (libsql) via Prisma driver adapter
const adapter = new PrismaLibSQL({
  url: process.env.TURSO_DATABASE_URL ?? 'file:./db/custom.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
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
