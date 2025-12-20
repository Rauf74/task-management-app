// ============================================
// Register API Route
// ============================================
// 
// Endpoint: POST /api/auth/register
// 
// Karena NextAuth tidak punya built-in register,
// kita buat sendiri endpoint untuk registrasi user baru.
//
// ============================================

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Validasi input sederhana
function validateInput(data: { name?: string; email?: string; password?: string }) {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 2) {
        errors.push("Nama minimal 2 karakter");
    }

    if (!data.email || !data.email.includes("@")) {
        errors.push("Email tidak valid");
    }

    if (!data.password || data.password.length < 6) {
        errors.push("Password minimal 6 karakter");
    }

    return errors;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        // Validasi input
        const validationErrors = validateInput({ name, email, password });
        if (validationErrors.length > 0) {
            return NextResponse.json(
                { error: validationErrors.join(", ") },
                { status: 400 }
            );
        }

        // Cek apakah email sudah terdaftar
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email sudah terdaftar" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Buat user baru
        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase(),
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        return NextResponse.json(
            { message: "Registrasi berhasil", user },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}
