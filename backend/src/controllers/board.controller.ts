// ==============================================
// Board Controller
// ==============================================

import { Response } from "express";
import * as boardService from "../services/board.service.js";
import { AuthenticatedRequest, ApiResponse } from "../types/index.js";

export async function getBoards(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { workspaceId } = req.params;
        const userId = req.user!.userId;
        const boards = await boardService.getBoards(workspaceId, userId);
        res.status(200).json({ success: true, data: { boards } } as ApiResponse);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        res.status(message.includes("tidak") ? 404 : 500).json({ success: false, error: message });
    }
}

export async function getBoard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;
        const board = await boardService.getBoardById(id, userId);
        res.status(200).json({ success: true, data: { board } } as ApiResponse);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        res.status(message.includes("tidak") ? 404 : 500).json({ success: false, error: message });
    }
}

export async function createBoard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { workspaceId } = req.params;
        const userId = req.user!.userId;
        const { name, description } = req.body;
        const board = await boardService.createBoard({ name, description, workspaceId }, userId);
        res.status(201).json({ success: true, data: { board }, message: "Board berhasil dibuat" } as ApiResponse);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        res.status(500).json({ success: false, error: message });
    }
}

export async function updateBoard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;
        const { name, description } = req.body;
        const board = await boardService.updateBoard(id, { name, description }, userId);
        res.status(200).json({ success: true, data: { board }, message: "Board berhasil diupdate" } as ApiResponse);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        res.status(message.includes("tidak") ? 404 : 500).json({ success: false, error: message });
    }
}

export async function deleteBoard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;
        await boardService.deleteBoard(id, userId);
        res.status(200).json({ success: true, message: "Board berhasil dihapus" } as ApiResponse);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        res.status(message.includes("tidak") ? 404 : 500).json({ success: false, error: message });
    }
}
