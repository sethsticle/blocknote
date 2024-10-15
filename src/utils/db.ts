import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient() // Creates a new PrismaClient instance
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>; // Declares prismaGlobal on globalThis
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
// If globalThis.prismaGlobal is defined, use it; otherwise, create a new PrismaClient

export default prisma // Exports the Prisma instance for use across your app

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
// In development, store the Prisma instance on globalThis to reuse it across reloads
