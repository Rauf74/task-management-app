// ============================================
// Prisma Client Singleton
// ============================================
// 
// Di development, hot-reload bisa membuat banyak instance Prisma.
// Singleton pattern ini mencegah error "too many connections".
// 
// Cara pakai:
// import { prisma } from "@/lib/prisma";
// const users = await prisma.user.findMany();
//
// ============================================

import { PrismaClient } from "@prisma/client";

// Tambahkan prisma ke global type untuk TypeScript
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Gunakan existing instance jika ada, atau buat baru
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

// Simpan ke global hanya di development
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
