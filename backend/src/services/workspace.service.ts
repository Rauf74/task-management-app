// ==============================================
// Workspace Service
// ==============================================

import * as workspaceRepository from "../repositories/workspace.repository.js";
import { AppError } from "../types/index.js";

export async function getWorkspaces(userId: string) {
    return workspaceRepository.findByUserId(userId);
}

export async function getWorkspaceById(id: string, userId: string) {
    const isOwner = await workspaceRepository.isOwner(id, userId);
    if (!isOwner) throw new AppError("Workspace tidak ditemukan atau tidak memiliki akses", 404);

    return workspaceRepository.findById(id);
}

export async function createWorkspace(data: { name: string; description?: string }, userId: string) {
    return workspaceRepository.create({ ...data, userId });
}

export async function updateWorkspace(id: string, data: { name?: string; description?: string }, userId: string) {
    const isOwner = await workspaceRepository.isOwner(id, userId);
    if (!isOwner) throw new AppError("Workspace tidak ditemukan atau tidak memiliki akses", 404);

    return workspaceRepository.update(id, data);
}

export async function deleteWorkspace(id: string, userId: string) {
    const isOwner = await workspaceRepository.isOwner(id, userId);
    if (!isOwner) throw new AppError("Workspace tidak ditemukan atau tidak memiliki akses", 404);

    return workspaceRepository.remove(id);
}

export async function getWorkspaceAnalytics(id: string, userId: string) {
    const isOwner = await workspaceRepository.isOwner(id, userId);
    if (!isOwner) throw new AppError("Workspace tidak ditemukan atau tidak memiliki akses", 404);

    return workspaceRepository.getAnalytics(id);
}
