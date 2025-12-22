// ==============================================
// Workspace Controller
// ==============================================

import { Response } from "express";
import * as workspaceService from "../services/workspace.service.js";
import { AuthenticatedRequest, ApiResponse } from "../types/index.js";

// ==============================================
// Get All Workspaces
// ==============================================

export async function getWorkspaces(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = req.user!.userId;
        const workspaces = await workspaceService.getWorkspaces(userId);

        const response: ApiResponse = {
            success: true,
            data: { workspaces },
        };
        res.status(200).json(response);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        res.status(500).json({ success: false, error: message });
    }
}

// ==============================================
// Get Workspace by ID
// ==============================================

export async function getWorkspace(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;
        const workspace = await workspaceService.getWorkspaceById(id, userId);

        const response: ApiResponse = {
            success: true,
            data: { workspace },
        };
        res.status(200).json(response);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        const statusCode = message.includes("tidak ditemukan") ? 404 : 500;
        res.status(statusCode).json({ success: false, error: message });
    }
}

// ==============================================
// Create Workspace
// ==============================================

export async function createWorkspace(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = req.user!.userId;
        const { name, description } = req.body;
        const workspace = await workspaceService.createWorkspace({ name, description }, userId);

        const response: ApiResponse = {
            success: true,
            data: { workspace },
            message: "Workspace berhasil dibuat",
        };
        res.status(201).json(response);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        res.status(500).json({ success: false, error: message });
    }
}

// ==============================================
// Update Workspace
// ==============================================

export async function updateWorkspace(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;
        const { name, description } = req.body;
        const workspace = await workspaceService.updateWorkspace(id, { name, description }, userId);

        const response: ApiResponse = {
            success: true,
            data: { workspace },
            message: "Workspace berhasil diupdate",
        };
        res.status(200).json(response);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        const statusCode = message.includes("tidak ditemukan") ? 404 : 500;
        res.status(statusCode).json({ success: false, error: message });
    }
}

// ==============================================
// Delete Workspace
// ==============================================

export async function deleteWorkspace(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;
        await workspaceService.deleteWorkspace(id, userId);

        const response: ApiResponse = {
            success: true,
            message: "Workspace berhasil dihapus",
        };
        res.status(200).json(response);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        const statusCode = message.includes("tidak ditemukan") ? 404 : 500;
        res.status(statusCode).json({ success: false, error: message });
    }
}
