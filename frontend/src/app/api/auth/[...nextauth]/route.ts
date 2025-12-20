// ============================================
// NextAuth API Route Handler
// ============================================
// 
// File ini adalah "pintu masuk" untuk semua request auth:
// - GET/POST /api/auth/signin
// - GET/POST /api/auth/signout
// - GET /api/auth/session
// - POST /api/auth/callback/credentials
// - dll
//
// Semua ditangani otomatis oleh NextAuth handlers.
//
// ============================================

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
