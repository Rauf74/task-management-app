// ==============================================
// Label Service
// ==============================================

import { prisma } from "../lib/prisma.js";
import * as workspaceRepository from "../repositories/workspace.repository.js";

// Create a new label
export async function createLabel(
    workspaceId: string,
    data: { name: string; color: string },
    userId: string
) {
    const isOwner = await workspaceRepository.isOwner(workspaceId, userId);
    if (!isOwner) throw new Error("Tidak memiliki akses ke workspace ini");

    // Optional: Check connection to DB?
    // Simply create label
    return prisma.label.create({
        data: {
            name: data.name,
            color: data.color,
            workspaceId,
        },
    });
}

// Get all labels in a workspace
export async function getLabels(workspaceId: string, userId: string) {
    const isOwner = await workspaceRepository.isOwner(workspaceId, userId);
    if (!isOwner) throw new Error("Tidak memiliki akses ke workspace ini");

    return prisma.label.findMany({
        where: { workspaceId },
        orderBy: { createdAt: "asc" },
    });
}

// Delete a label
export async function deleteLabel(id: string, userId: string) {
    const label = await prisma.label.findUnique({ where: { id } });
    if (!label) throw new Error("Label tidak ditemukan");

    const isOwner = await workspaceRepository.isOwner(label.workspaceId, userId);
    if (!isOwner) throw new Error("Tidak memiliki akses untuk menghapus label ini");

    return prisma.label.delete({ where: { id } });
}
