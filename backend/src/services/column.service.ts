// ==============================================
// Column Service
// ==============================================

import * as columnRepository from "../repositories/column.repository.js";
import * as boardRepository from "../repositories/board.repository.js";
import * as workspaceRepository from "../repositories/workspace.repository.js";
import * as activityService from "./activity.service.js";

async function checkBoardAccess(boardId: string, userId: string) {
    const workspaceId = await boardRepository.getWorkspaceId(boardId);
    if (!workspaceId) throw new Error("Board tidak ditemukan");
    const isOwner = await workspaceRepository.isOwner(workspaceId, userId);
    if (!isOwner) throw new Error("Tidak memiliki akses");
    return { workspaceId };
}

export async function createColumn(data: { title: string; boardId: string }, userId: string) {
    const { workspaceId } = await checkBoardAccess(data.boardId, userId);
    const maxOrder = await columnRepository.getMaxOrder(data.boardId);

    const column = await columnRepository.create({ ...data, order: maxOrder + 1 });

    await activityService.logActivity({
        action: "CREATE_COLUMN",
        entityType: "COLUMN",
        entityId: column.id,
        entityTitle: column.title,
        details: "Created column",
        userId,
        workspaceId
    });

    return column;
}

export async function updateColumn(id: string, data: { title?: string }, userId: string) {
    const column = await columnRepository.findById(id);
    if (!column) throw new Error("Column tidak ditemukan");
    await checkBoardAccess(column.boardId, userId);
    return columnRepository.update(id, data);
}

export async function deleteColumn(id: string, userId: string) {
    const column = await columnRepository.findById(id);
    if (!column) throw new Error("Column tidak ditemukan");

    const { workspaceId } = await checkBoardAccess(column.boardId, userId);

    await columnRepository.remove(id);

    await activityService.logActivity({
        action: "DELETE_COLUMN",
        entityType: "COLUMN",
        entityId: column.id,
        entityTitle: column.title,
        details: "Deleted column",
        userId,
        workspaceId
    });
}

export async function reorderColumns(columnIds: string[], userId: string) {
    if (columnIds.length === 0) return [];
    const boardId = await columnRepository.getBoardId(columnIds[0]);
    if (!boardId) throw new Error("Column tidak ditemukan");
    await checkBoardAccess(boardId, userId);
    return columnRepository.reorder(columnIds);
}
