// ==============================================
// Column Repository
// ==============================================

import { prisma } from "../lib/prisma.js";

export async function findByBoardId(boardId: string) {
    return prisma.column.findMany({
        where: { boardId },
        orderBy: { order: "asc" },
        include: {
            tasks: {
                orderBy: { order: "asc" },
            },
        },
    });
}

export async function findById(id: string) {
    return prisma.column.findUnique({
        where: { id },
        include: { board: true },
    });
}

export async function create(data: { title: string; boardId: string; order: number }) {
    return prisma.column.create({ data });
}

export async function update(id: string, data: { title?: string }) {
    return prisma.column.update({ where: { id }, data });
}

export async function remove(id: string) {
    return prisma.column.delete({ where: { id } });
}

export async function getMaxOrder(boardId: string): Promise<number> {
    const result = await prisma.column.aggregate({
        where: { boardId },
        _max: { order: true },
    });
    return result._max.order ?? -1;
}

export async function reorder(columnIds: string[]) {
    const updates = columnIds.map((id, index) =>
        prisma.column.update({ where: { id }, data: { order: index } })
    );
    return prisma.$transaction(updates);
}

export async function getBoardId(columnId: string): Promise<string | null> {
    const column = await prisma.column.findUnique({
        where: { id: columnId },
        select: { boardId: true },
    });
    return column?.boardId ?? null;
}
