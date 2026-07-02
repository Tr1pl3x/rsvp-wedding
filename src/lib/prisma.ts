import "server-only";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Prisma 7 requires a driver adapter; PrismaNeon speaks Neon's serverless
// protocol over the POOLED connection string.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

// Stash on globalThis outside production so `next dev` hot reloads reuse one
// client (and one connection pool) instead of leaking connections.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
