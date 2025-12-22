// ==============================================
// Column Controller
// ==============================================

import { Response } from "express";
import * as columnService from "../services/column.service.js";
import { AuthenticatedRequest, ApiResponse } from "../types/index.js";

export async function createColumn(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { boardId } = req.params;
        const userId = req.user!.userId;
        const { title } = req.body;
        const column = await columnService.createColumn({ title, boardId }, userId);
        res.status(201).json({ success: true, data: { column }, message: "Column berhasil dibuat" } as ApiResponse);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        res.status(500).json({ success: false, error: message });
    }
}

export async function updateColumn(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;
        const { title } = req.body;
        const column = await columnService.updateColumn(id, { title }, userId);
        res.status(200).json({ success: true, data: { column }, message: "Column berhasil diupdate" } as ApiResponse);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        res.status(message.includes("tidak") ? 404 : 500).json({ success: false, error: message });
    }
}

export async function deleteColumn(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;
        await columnService.deleteColumn(id, userId);
        res.status(200).json({ success: true, message: "Column berhasil dihapus" } as ApiResponse);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        res.status(message.includes("tidak") ? 404 : 500).json({ success: false, error: message });
    }
}

export async function reorderColumns(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = req.user!.userId;
        const { columnIds } = req.body;
        const columns = await columnService.reorderColumns(columnIds, userId);
        res.status(200).json({ success: true, data: { columns }, message: "Urutan column berhasil diubah" } as ApiResponse);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        res.status(500).json({ success: false, error: message });
    }
}
