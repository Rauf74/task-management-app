// ==============================================
// Auth Repository
// ==============================================
//
// Repository layer untuk akses database User.
// Semua query Prisma untuk authentication ada di sini.
//
// ==============================================

import { prisma } from "../lib/prisma.js";
import { RegisterRequest, User, UserWithPassword } from "../types/index.js";

// ==============================================
// Find User by Email
// ==============================================

export async function findByEmail(email: string): Promise<UserWithPassword | null> {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    return user;
}

// ==============================================
// Find User by ID
// ==============================================

export async function findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            updatedAt: true,
            // password: false (excluded)
        },
    });

    return user;
}

// ==============================================
// Create User
// ==============================================

export async function create(data: RegisterRequest & { password: string }): Promise<User> {
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password, // Already hashed by service
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return user;
}
