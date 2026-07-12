import { prisma } from "../lib/prisma.js";
import * as workspaceRepository from "../repositories/workspace.repository.js";
import { AppError } from "../types/index.js";

interface LogActivityParams {
    action: string;
    entityType: "TASK" | "BOARD" | "COLUMN";
    entityId: string;
    entityTitle: string;
    details?: string;
    userId: string;
    workspaceId: string;
}

export async function logActivity(params: LogActivityParams) {
    try {
        await prisma.activity.create({
            data: {
                action: params.action,
                entityType: params.entityType,
                entityId: params.entityId,
                entityTitle: params.entityTitle,
                details: params.details,
                userId: params.userId,
                workspaceId: params.workspaceId,
            },
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
}

export async function getWorkspaceActivities(workspaceId: string, userId: string, limit = 20) {
    const isOwner = await workspaceRepository.isOwner(workspaceId, userId);
    if (!isOwner) throw new AppError("Tidak memiliki akses ke workspace ini", 403);

    return prisma.activity.findMany({
        where: { workspaceId },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
    });
}
