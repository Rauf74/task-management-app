// ==============================================
// Task Controller
// ==============================================

import { Response } from "express";
import * as taskService from "../services/task.service.js";
import { AuthenticatedRequest, ApiResponse } from "../types/index.js";

export async function createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { columnId } = req.params;
        const userId = req.user!.userId;
        const { title, description, priority, dueDate, labelIds } = req.body;
        const task = await taskService.createTask({ title, description, priority, dueDate, labelIds, columnId }, userId);
        res.status(201).json({ success: true, data: { task }, message: "Task berhasil dibuat" } as ApiResponse);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        res.status(500).json({ success: false, error: message });
    }
}

export async function updateTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;
        const { title, description, priority, dueDate, labelIds } = req.body;
        const task = await taskService.updateTask(id, { title, description, priority, dueDate, labelIds }, userId);
        res.status(200).json({ success: true, data: { task }, message: "Task berhasil diupdate" } as ApiResponse);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        res.status(message.includes("tidak") ? 404 : 500).json({ success: false, error: message });
    }
}

export async function deleteTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;
        await taskService.deleteTask(id, userId);
        res.status(200).json({ success: true, message: "Task berhasil dihapus" } as ApiResponse);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        res.status(message.includes("tidak") ? 404 : 500).json({ success: false, error: message });
    }
}

export async function moveTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;
        const { columnId, order } = req.body;
        const task = await taskService.moveTask(id, columnId, order, userId);
        res.status(200).json({ success: true, data: { task }, message: "Task berhasil dipindahkan" } as ApiResponse);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        res.status(message.includes("tidak") ? 404 : 500).json({ success: false, error: message });
    }
}
