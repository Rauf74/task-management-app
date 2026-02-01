import { prisma } from "../lib/prisma.js";

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
        // We don't throw here to avoid blocking the main action if logging fails
    }
}

export async function getWorkspaceActivities(workspaceId: string, limit = 20) {
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
