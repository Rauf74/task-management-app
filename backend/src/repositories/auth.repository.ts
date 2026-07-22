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
// Find User by Email OR Name (for login)
// ==============================================

export async function findByEmailOrName(identifier: string): Promise<UserWithPassword | null> {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: identifier },
                { name: identifier },
            ],
        },
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

// Find User by ID WITH password (for password verification)
export async function findByIdWithPassword(id: string): Promise<UserWithPassword | null> {
    return prisma.user.findUnique({
        where: { id },
    });
}

// ==============================================
// Update User (Profile)
// ==============================================

export async function updateUser(id: string, data: { name?: string }): Promise<User> {
    const user = await prisma.user.update({
        where: { id },
        data,
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

// ==============================================
// Update User Password
// ==============================================

export async function updatePassword(id: string, hashedPassword: string): Promise<void> {
    await prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
    });
}

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

export async function createDemoUserWithData(data: {
    name: string;
    email: string;
    password: string;
}): Promise<User> {
    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                isDemo: true,
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

        const workspace = await tx.workspace.create({
            data: {
                name: "Project Launch (Demo)",
                description: "Workspace contoh dengan data sampel untuk pengujian TaskScale",
                userId: user.id,
            },
        });

        const labelFeature = await tx.label.create({
            data: { name: "Feature", color: "#3B82F6", workspaceId: workspace.id },
        });
        const labelBug = await tx.label.create({
            data: { name: "Bug", color: "#EF4444", workspaceId: workspace.id },
        });
        const labelDesign = await tx.label.create({
            data: { name: "Design", color: "#8B5CF6", workspaceId: workspace.id },
        });

        const board = await tx.board.create({
            data: {
                name: "Sprint Planning",
                description: "Papan Kanban interaktif dengan tugas sampel",
                workspaceId: workspace.id,
            },
        });

        const colTodo = await tx.column.create({
            data: { title: "To Do", order: 0, boardId: board.id },
        });
        const colProgress = await tx.column.create({
            data: { title: "In Progress", order: 1, boardId: board.id },
        });
        const colDone = await tx.column.create({
            data: { title: "Done", order: 2, boardId: board.id },
        });

        await tx.task.create({
            data: {
                title: "Eksplor Fitur Drag & Drop Kanban",
                description: "Coba geser kartu ini ke kolom lain (In Progress / Done)",
                priority: "URGENT",
                order: 0,
                columnId: colTodo.id,
                creatorId: user.id,
                labels: { connect: [{ id: labelFeature.id }] },
            },
        });
        await tx.task.create({
            data: {
                title: "Uji Fitur Dark Mode & Tema",
                description: "Coba ganti tema di ikon kanan atas",
                priority: "HIGH",
                order: 1,
                columnId: colTodo.id,
                creatorId: user.id,
                labels: { connect: [{ id: labelDesign.id }] },
            },
        });
        await tx.task.create({
            data: {
                title: "Analisis Arsitektur Backend & API Docs",
                description: "Lihat dokumentasi Swagger di /api/docs",
                priority: "MEDIUM",
                order: 0,
                columnId: colProgress.id,
                creatorId: user.id,
                labels: { connect: [{ id: labelFeature.id }] },
            },
        });
        await tx.task.create({
            data: {
                title: "Inisialisasi Akun Demo TaskScale",
                description: "Akun demo berhasil dibuat secara otomatis oleh sistem",
                priority: "LOW",
                order: 0,
                columnId: colDone.id,
                creatorId: user.id,
                labels: { connect: [{ id: labelBug.id }] },
            },
        });

        await tx.activity.create({
            data: {
                action: "CREATE_WORKSPACE",
                entityType: "WORKSPACE",
                entityId: workspace.id,
                entityTitle: workspace.name,
                details: "Akun demo berhasil dibuat dengan data sampel",
                userId: user.id,
                workspaceId: workspace.id,
            },
        });

        return user;
    }, {
        maxWait: 10000,
        timeout: 25000,
    });
}

