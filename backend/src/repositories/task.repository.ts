// ==============================================
// Task Repository
// ==============================================

import { prisma } from "../lib/prisma.js";
import { Priority } from "@prisma/client";

export async function findById(id: string) {
    return prisma.task.findUnique({
        where: { id },
        include: { labels: true, column: { include: { board: true } } },
    });
}

export async function create(data: {
    title: string;
    description?: string;
    priority?: Priority;
    dueDate?: Date;
    columnId: string;
    creatorId: string;
    order: number;
}) {
    return prisma.task.create({
        data,
        include: { labels: true },
    });
}

export async function update(id: string, data: {
    title?: string;
    description?: string;
    priority?: Priority;
    dueDate?: Date | null;
}) {
    return prisma.task.update({
        where: { id },
        data,
        include: { labels: true },
    });
}

export async function remove(id: string) {
    return prisma.task.delete({ where: { id } });
}

export async function getMaxOrder(columnId: string): Promise<number> {
    const result = await prisma.task.aggregate({
        where: { columnId },
        _max: { order: true },
    });
    return result._max.order ?? -1;
}

export async function moveTask(id: string, columnId: string, order: number) {
    return prisma.task.update({
        where: { id },
        data: { columnId, order },
        include: { labels: true },
    });
}

export async function getColumnId(taskId: string): Promise<string | null> {
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        select: { columnId: true },
    });
    return task?.columnId ?? null;
}
