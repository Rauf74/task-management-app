// ==============================================
// Board Service
// ==============================================

import * as boardRepository from "../repositories/board.repository.js";
import * as workspaceRepository from "../repositories/workspace.repository.js";
import * as activityService from "./activity.service.js";

export async function getBoards(workspaceId: string, userId: string) {
    const isOwner = await workspaceRepository.isOwner(workspaceId, userId);
    if (!isOwner) throw new Error("Workspace tidak ditemukan atau tidak memiliki akses");
    return boardRepository.findByWorkspaceId(workspaceId);
}

export async function getBoardById(id: string, userId: string) {
    const board = await boardRepository.findById(id);
    if (!board) throw new Error("Board tidak ditemukan");

    const isOwner = await workspaceRepository.isOwner(board.workspaceId, userId);
    if (!isOwner) throw new Error("Tidak memiliki akses ke board ini");

    return board;
}

export async function createBoard(data: { name: string; description?: string; workspaceId: string }, userId: string) {
    const isOwner = await workspaceRepository.isOwner(data.workspaceId, userId);
    if (!isOwner) throw new Error("Workspace tidak ditemukan atau tidak memiliki akses");

    const board = await boardRepository.create(data);

    await activityService.logActivity({
        action: "CREATE_BOARD",
        entityType: "BOARD",
        entityId: board.id,
        entityTitle: board.name,
        details: "Created board",
        userId,
        workspaceId: data.workspaceId
    });

    return board;
}

export async function updateBoard(id: string, data: { name?: string; description?: string }, userId: string) {
    const workspaceId = await boardRepository.getWorkspaceId(id);
    if (!workspaceId) throw new Error("Board tidak ditemukan");

    const isOwner = await workspaceRepository.isOwner(workspaceId, userId);
    if (!isOwner) throw new Error("Tidak memiliki akses ke board ini");

    return boardRepository.update(id, data);
}

export async function deleteBoard(id: string, userId: string) {
    const board = await boardRepository.findById(id);
    if (!board) throw new Error("Board tidak ditemukan"); // Need board details for log before finding workspaceId/deleting

    const isOwner = await workspaceRepository.isOwner(board.workspaceId, userId);
    if (!isOwner) throw new Error("Tidak memiliki akses ke board ini");

    await boardRepository.remove(id);

    await activityService.logActivity({
        action: "DELETE_BOARD",
        entityType: "BOARD",
        entityId: board.id,
        entityTitle: board.name,
        details: "Deleted board",
        userId,
        workspaceId: board.workspaceId
    });
}
