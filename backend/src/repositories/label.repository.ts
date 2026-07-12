import { prisma } from "../lib/prisma.js";

export async function findByWorkspaceId(workspaceId: string) {
    return prisma.label.findMany({
        where: { workspaceId },
        orderBy: { createdAt: "asc" },
    });
}

export async function findById(id: string) {
    return prisma.label.findUnique({ where: { id } });
}

export async function create(data: { name: string; color: string; workspaceId: string }) {
    return prisma.label.create({ data });
}

export async function remove(id: string) {
    return prisma.label.delete({ where: { id } });
}
