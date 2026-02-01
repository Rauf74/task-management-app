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

// ==============================================
// Get Workspace Analytics
// ==============================================

export async function getAnalytics(id: string) {
    // 1. Group Tasks by Priority
    const tasksByPriority = await prisma.task.groupBy({
        by: ['priority'],
        where: {
            column: {
                board: {
                    workspaceId: id
                }
            }
        },
        _count: {
            priority: true
        }
    });

    // 2. Get Column Task Counts (Aggregated by Title)
    // We fetch all columns in this workspace and their task counts
    const columns = await prisma.column.findMany({
        where: {
            board: {
                workspaceId: id
            }
        },
        select: {
            title: true,
            _count: {
                select: { tasks: true }
            }
        }
    });

    // Aggregate by title (case-insensitive for better grouping)
    const taskByStatus = columns.reduce((acc, col) => {
        const key = col.title; // Keep original case for display, or normalize if needed
        acc[key] = (acc[key] || 0) + col._count.tasks;
        return acc;
    }, {} as Record<string, number>);

    // Convert to array format for Recharts
    const statusData = Object.entries(taskByStatus).map(([name, value]) => ({
        name,
        value
    }));

    // Format Priority Data
    const priorityData = tasksByPriority.map(item => ({
        name: item.priority,
        value: item._count.priority
    }));

    return {
        priorityData,
        statusData
    };
}
