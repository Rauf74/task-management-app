// ==============================================
// Task Service
// ==============================================

import { Priority } from "@prisma/client";
import * as taskRepository from "../repositories/task.repository.js";
import * as columnRepository from "../repositories/column.repository.js";
import * as boardRepository from "../repositories/board.repository.js";
import * as workspaceRepository from "../repositories/workspace.repository.js";

async function checkColumnAccess(columnId: string, userId: string) {
    const boardId = await columnRepository.getBoardId(columnId);
    if (!boardId) throw new Error("Column tidak ditemukan");
    const workspaceId = await boardRepository.getWorkspaceId(boardId);
    if (!workspaceId) throw new Error("Board tidak ditemukan");
    const isOwner = await workspaceRepository.isOwner(workspaceId, userId);
    if (!isOwner) throw new Error("Tidak memiliki akses");
}

export async function createTask(
    data: { title: string; description?: string; priority?: Priority; dueDate?: string; columnId: string },
    userId: string
) {
    await checkColumnAccess(data.columnId, userId);
    const maxOrder = await taskRepository.getMaxOrder(data.columnId);
    return taskRepository.create({
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        columnId: data.columnId,
        creatorId: userId,
        order: maxOrder + 1,
    });
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
    await checkColumnAccess(task.columnId, userId);
    return taskRepository.remove(id);
}

export async function moveTask(id: string, columnId: string, order: number, userId: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw new Error("Task tidak ditemukan");
    await checkColumnAccess(columnId, userId);
    return taskRepository.moveTask(id, columnId, order);
}
