import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Force new PrismaClient to ensure latest schema is used
// This is important during development when schema changes
if (process.env.NODE_ENV !== 'production' && globalForPrisma.prisma) {
  // Disconnect old client if exists
  globalForPrisma.prisma.$disconnect().catch(() => {})
}

export const db = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db