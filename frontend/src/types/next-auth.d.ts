// ============================================
// NextAuth Type Extensions
// ============================================
// 
// TypeScript membutuhkan deklarasi tambahan untuk
// properti custom yang kita tambahkan ke session.
// Tanpa ini, TypeScript akan error saat akses session.user.id
//
// ============================================

import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}
