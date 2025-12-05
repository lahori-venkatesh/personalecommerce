import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  // Force update the global instance to pick up schema changes
  globalForPrisma.prisma = prisma
}

// Force reload for schema updates
