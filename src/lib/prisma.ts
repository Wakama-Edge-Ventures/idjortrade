import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// Lazy — only instantiate on first DB access, not at module load time
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_, prop) {
    if (!globalForPrisma.prisma) {
      const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL!,
      });
      globalForPrisma.prisma = new PrismaClient({ adapter });
    }
    const value = Reflect.get(globalForPrisma.prisma, prop);
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(globalForPrisma.prisma)
      : value;
  },
});
