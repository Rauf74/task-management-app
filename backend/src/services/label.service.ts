import * as labelRepository from "../repositories/label.repository.js";
import * as workspaceRepository from "../repositories/workspace.repository.js";
import { AppError } from "../types/index.js";

export async function createLabel(workspaceId: string, data: { name: string; color: string }, userId: string) {
    const isOwner = await workspaceRepository.isOwner(workspaceId, userId);
    if (!isOwner) throw new AppError("Tidak memiliki akses ke workspace ini", 403);

    return labelRepository.create({ ...data, workspaceId });
}

export async function getLabels(workspaceId: string, userId: string) {
    const isOwner = await workspaceRepository.isOwner(workspaceId, userId);
    if (!isOwner) throw new AppError("Tidak memiliki akses ke workspace ini", 403);

    return labelRepository.findByWorkspaceId(workspaceId);
}

export async function deleteLabel(id: string, userId: string) {
    const label = await labelRepository.findById(id);
    if (!label) throw new AppError("Label tidak ditemukan", 404);

    const isOwner = await workspaceRepository.isOwner(label.workspaceId, userId);
    if (!isOwner) throw new AppError("Tidak memiliki akses untuk menghapus label ini", 403);

    return labelRepository.remove(id);
}
