import { Response } from "express";
import * as labelService from "../services/label.service.js";
import { AuthenticatedRequest, getUserId } from "../types/index.js";
import { asyncHandler } from "../middleware/async-handler.js";

export const createLabel = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { workspaceId } = req.params;
    const userId = getUserId(req);

    const label = await labelService.createLabel(workspaceId, req.body, userId);

    res.status(201).json({
        success: true,
        message: "Label berhasil dibuat",
        data: { label },
    });
});

export const getLabels = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { workspaceId } = req.params;
    const userId = getUserId(req);

    const labels = await labelService.getLabels(workspaceId, userId);

    res.json({
        success: true,
        data: { labels },
    });
});

export const deleteLabel = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req);

    await labelService.deleteLabel(id, userId);

    res.json({
        success: true,
        message: "Label berhasil dihapus",
    });
});
