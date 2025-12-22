// ==============================================
// Workspace Repository
// ==============================================

import { prisma } from "../lib/prisma.js";

// ==============================================
// Get All Workspaces by User
// ==============================================

export async function findByUserId(userId: string) {
    return prisma.workspace.findMany({
        where: { userId },
        include: {
            _count: {
                select: { boards: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

// ==============================================
// Get Workspace by ID
// ==============================================

export async function findById(id: string) {
    return prisma.workspace.findUnique({
        where: { id },
        include: {
            boards: {
                orderBy: { createdAt: "desc" },
            },
        },
    });
}

// ==============================================
// Create Workspace
// ==============================================

export async function create(data: { name: string; description?: string; userId: string }) {
    return prisma.workspace.create({
        data,
    });
}

// ==============================================
// Update Workspace
// ==============================================

export async function update(id: string, data: { name?: string; description?: string }) {
    return prisma.workspace.update({
        where: { id },
        data,
    });
}

// ==============================================
// Delete Workspace
// ==============================================

export async function remove(id: string) {
    return prisma.workspace.delete({
        where: { id },
    });
}

// ==============================================
// Check Ownership
// ==============================================

export async function isOwner(workspaceId: string, userId: string): Promise<boolean> {
    const workspace = await prisma.workspace.findFirst({
        where: { id: workspaceId, userId },
    });
    return !!workspace;
}
