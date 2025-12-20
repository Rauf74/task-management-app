// ============================================
// NextAuth Configuration
// ============================================
// 
// NextAuth v5 (beta) untuk authentication.
// File ini adalah config pusat untuk:
// - Providers (cara login: credentials, google, github, dll)
// - Callbacks (customize session, jwt, dll)
// - Pages (custom login/register pages)
//
// ============================================

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
    // Session strategy: JWT (tidak perlu database session)
    session: {
        strategy: "jwt",
    },

    // Custom pages (kita akan buat halaman sendiri)
    pages: {
        signIn: "/login",
        // signUp: "/register", // NextAuth tidak punya built-in signup page
    },

    // Providers: cara user bisa login
    providers: [
        // Credentials: login dengan email + password
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            // Fungsi authorize: validasi email + password
            async authorize(credentials) {
                // Validasi input
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email dan password wajib diisi");
                }

                const email = credentials.email as string;
                const password = credentials.password as string;

                // Cari user di database
                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    throw new Error("Email atau password salah");
                }

                // Validasi password
                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (!isPasswordValid) {
                    throw new Error("Email atau password salah");
                }

                // Return user object (akan masuk ke JWT)
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),
    ],

    // Callbacks: customize behavior
    callbacks: {
        // JWT callback: tambahkan data ke token
        async jwt({ token, user }) {
            // Saat login pertama, user object ada
            if (user) {
                token.id = user.id;
            }
            return token;
        },

        // Session callback: data yang bisa diakses di client
        async session({ session, token }) {
            // Tambahkan user id ke session
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
});
