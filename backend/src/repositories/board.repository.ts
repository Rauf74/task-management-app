// ==============================================
// Board Repository
// ==============================================

import { prisma } from "../lib/prisma.js";

export async function findByWorkspaceId(workspaceId: string) {
    return prisma.board.findMany({
        where: { workspaceId },
        include: {
            _count: { select: { columns: true } },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function findById(id: string) {
    return prisma.board.findUnique({
        where: { id },
        include: {
            columns: {
                orderBy: { order: "asc" },
                include: {
                    tasks: {
                        orderBy: { order: "asc" },
                        include: {
                            labels: true,
                        },
                    },
                },
            },
        },
    });
}

export async function create(data: { name: string; description?: string; workspaceId: string }) {
    return prisma.board.create({ data });
}

export async function update(id: string, data: { name?: string; description?: string }) {
    return prisma.board.update({ where: { id }, data });
}

export async function remove(id: string) {
    return prisma.board.delete({ where: { id } });
}

export async function getWorkspaceId(boardId: string): Promise<string | null> {
    const board = await prisma.board.findUnique({
        where: { id: boardId },
        select: { workspaceId: true },
    });
    return board?.workspaceId ?? null;
}
