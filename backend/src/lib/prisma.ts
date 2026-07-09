// ==============================================
// Prisma Client Singleton (Prisma 7.x)
// ==============================================
//
// MariaDB/MySQL driver via @prisma/adapter-mariadb.
// Connection URL is read from DATABASE_URL (set in prisma.config.ts / .env).
// No TLS required for local MariaDB.
// ==============================================

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Get database URL from environment
const connectionString = process.env.DATABASE_URL || "";

// Parse mysql://user:pass@host:port/db into PoolConfig object
const url = new URL(connectionString);
const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    connectionLimit: 5,
});

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
