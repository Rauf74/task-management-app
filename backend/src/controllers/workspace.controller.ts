import { Response } from "express";
import * as workspaceService from "../services/workspace.service.js";
import { AuthenticatedRequest, getUserId } from "../types/index.js";
import { asyncHandler } from "../middleware/async-handler.js";

export const getWorkspaces = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = getUserId(req);

    const workspaces = await workspaceService.getWorkspaces(userId);

    res.status(200).json({ success: true, data: { workspaces } });
});

export const getWorkspace = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req);

    const workspace = await workspaceService.getWorkspaceById(id, userId);

    res.status(200).json({ success: true, data: { workspace } });
});

export const createWorkspace = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = getUserId(req);
    const { name, description } = req.body;

    const workspace = await workspaceService.createWorkspace({ name, description }, userId);

    res.status(201).json({ success: true, data: { workspace }, message: "Workspace berhasil dibuat" });
});

export const updateWorkspace = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req);
    const { name, description } = req.body;

    const workspace = await workspaceService.updateWorkspace(id, { name, description }, userId);

    res.status(200).json({ success: true, data: { workspace }, message: "Workspace berhasil diupdate" });
});

export const deleteWorkspace = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req);

    await workspaceService.deleteWorkspace(id, userId);

    res.status(200).json({ success: true, message: "Workspace berhasil dihapus" });
});

export const getAnalytics = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req);

    const analytics = await workspaceService.getWorkspaceAnalytics(id, userId);

    res.status(200).json({ success: true, data: analytics });
});
