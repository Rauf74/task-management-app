// ==============================================
// Task Service
// ==============================================

import { Priority } from "@prisma/client";
import * as taskRepository from "../repositories/task.repository.js";
import * as columnRepository from "../repositories/column.repository.js";
import * as boardRepository from "../repositories/board.repository.js";
import * as workspaceRepository from "../repositories/workspace.repository.js";

import * as activityService from "./activity.service.js";

async function checkColumnAccess(columnId: string, userId: string) {
    const boardId = await columnRepository.getBoardId(columnId);
    if (!boardId) throw new Error("Column tidak ditemukan");
    const workspaceId = await boardRepository.getWorkspaceId(boardId);
    if (!workspaceId) throw new Error("Board tidak ditemukan");
    const isOwner = await workspaceRepository.isOwner(workspaceId, userId);
    if (!isOwner) throw new Error("Tidak memiliki akses");
    return { boardId, workspaceId }; // Return IDs for logging
}

export async function createTask(
    data: { title: string; description?: string; priority?: Priority; dueDate?: string; columnId: string },
    userId: string
) {
    const { workspaceId } = await checkColumnAccess(data.columnId, userId);
    const maxOrder = await taskRepository.getMaxOrder(data.columnId);

    const task = await taskRepository.create({
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        columnId: data.columnId,
        creatorId: userId,
        order: maxOrder + 1,
    });

    await activityService.logActivity({
        action: "CREATE_TASK",
        entityType: "TASK",
        entityId: task.id,
        entityTitle: task.title,
        details: `Created task`,
        userId,
        workspaceId
    });

    return task;
}

export async function updateTask(
    id: string,
    data: { title?: string; description?: string; priority?: Priority; dueDate?: string | null },
    userId: string
) {
    const task = await taskRepository.findById(id);
    if (!task) throw new Error("Task tidak ditemukan");
    await checkColumnAccess(task.columnId, userId);
    return taskRepository.update(id, {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate === null ? null : data.dueDate ? new Date(data.dueDate) : undefined,
    });
}

export async function deleteTask(id: string, userId: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw new Error("Task tidak ditemukan");

    const { workspaceId } = await checkColumnAccess(task.columnId, userId);

    await taskRepository.remove(id);

    await activityService.logActivity({
        action: "DELETE_TASK",
        entityType: "TASK",
        entityId: task.id,
        entityTitle: task.title,
        details: "Deleted task",
        userId,
        workspaceId
    });
}

export async function moveTask(id: string, columnId: string, order: number, userId: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw new Error("Task tidak ditemukan");

    const { workspaceId } = await checkColumnAccess(columnId, userId);

    await taskRepository.moveTask(id, columnId, order);

    await activityService.logActivity({
        action: "MOVE_TASK",
        entityType: "TASK",
        entityId: task.id,
        entityTitle: task.title,
        details: `Moved task`,
        userId,
        workspaceId
    });
}
