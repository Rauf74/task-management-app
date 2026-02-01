import { Request, Response } from "express";
import * as activityService from "../services/activity.service.js";
import * as workspaceRepository from "../repositories/workspace.repository.js";

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

export async function getActivities(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { workspaceId } = req.params;
        const userId = req.user!.userId;

        // Check ownership
        const isOwner = await workspaceRepository.isOwner(workspaceId, userId);
        if (!isOwner) {
            res.status(403).json({ success: false, error: "Tidak memiliki akses ke workspace ini" });
            return;
        }

        const activities = await activityService.getWorkspaceActivities(workspaceId);

        res.status(200).json({
            success: true,
            data: activities,
        });
    } catch (error) {
        console.error("Get Activities Error:", error);
        res.status(500).json({ success: false, error: "Gagal memuat aktivitas" });
    }
}
