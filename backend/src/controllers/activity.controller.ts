import { Response } from "express";
import * as activityService from "../services/activity.service.js";
import { AuthenticatedRequest, getUserId } from "../types/index.js";
import { asyncHandler } from "../middleware/async-handler.js";

export const getActivities = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { workspaceId } = req.params;
    const userId = getUserId(req);

    const activities = await activityService.getWorkspaceActivities(workspaceId, userId);

    res.status(200).json({
        success: true,
        data: { activities },
    });
});
