// ==============================================
// Workspace Service
// ==============================================

import * as workspaceRepository from "../repositories/workspace.repository.js";

// ==============================================
// Get User's Workspaces
// ==============================================

export async function getWorkspaces(userId: string) {
    return workspaceRepository.findByUserId(userId);
}

// ==============================================
// Get Workspace Detail
// ==============================================

export async function getWorkspaceById(id: string, userId: string) {
    // Check ownership
    const isOwner = await workspaceRepository.isOwner(id, userId);
    if (!isOwner) {
        throw new Error("Workspace tidak ditemukan atau tidak memiliki akses");
    }

    return workspaceRepository.findById(id);
}

// ==============================================
// Create Workspace
// ==============================================

export async function createWorkspace(data: { name: string; description?: string }, userId: string) {
    return workspaceRepository.create({
        ...data,
        userId,
    });
}

// ==============================================
// Update Workspace
// ==============================================

export async function updateWorkspace(id: string, data: { name?: string; description?: string }, userId: string) {
    // Check ownership
    const isOwner = await workspaceRepository.isOwner(id, userId);
    if (!isOwner) {
        throw new Error("Workspace tidak ditemukan atau tidak memiliki akses");
    }

    return workspaceRepository.update(id, data);
}

// ==============================================
// Delete Workspace
// ==============================================

export async function deleteWorkspace(id: string, userId: string) {
    // Check ownership
    const isOwner = await workspaceRepository.isOwner(id, userId);
    if (!isOwner) {
        throw new Error("Workspace tidak ditemukan atau tidak memiliki akses");
    }

    return workspaceRepository.remove(id);
}
