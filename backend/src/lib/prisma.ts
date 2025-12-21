// ==============================================
// Prisma Client Singleton (Prisma 7.x)
// ==============================================
//
// Prisma 7 memerlukan driver adapter untuk koneksi
// database PostgreSQL. Menggunakan @prisma/adapter-pg.
//
// ==============================================

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Get database URL from environment
const connectionString = process.env.DATABASE_URL || "";

// Create PostgreSQL connection pool with SSL
const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false, // Required for Supabase/cloud databases
    },
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Singleton pattern for development
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
