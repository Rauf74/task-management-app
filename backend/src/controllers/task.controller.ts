import { Response } from "express";
import * as taskService from "../services/task.service.js";
import { AuthenticatedRequest, getUserId } from "../types/index.js";
import { asyncHandler } from "../middleware/async-handler.js";

export const createTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { columnId } = req.params;
    const userId = getUserId(req);
    const { title, description, priority, dueDate, labelIds } = req.body;

    const task = await taskService.createTask({ title, description, priority, dueDate, labelIds, columnId }, userId);

    res.status(201).json({ success: true, data: { task }, message: "Task berhasil dibuat" });
});

export const updateTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req);
    const { title, description, priority, dueDate, labelIds } = req.body;

    const task = await taskService.updateTask(id, { title, description, priority, dueDate, labelIds }, userId);

    res.status(200).json({ success: true, data: { task }, message: "Task berhasil diupdate" });
});

export const deleteTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req);

    await taskService.deleteTask(id, userId);

    res.status(200).json({ success: true, message: "Task berhasil dihapus" });
});

export const moveTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req);
    const { columnId, order } = req.body;

    const task = await taskService.moveTask(id, columnId, order, userId);

    res.status(200).json({ success: true, data: { task }, message: "Task berhasil dipindahkan" });
});
