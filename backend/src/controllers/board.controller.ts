import { Response } from "express";
import * as boardService from "../services/board.service.js";
import { AuthenticatedRequest, getUserId } from "../types/index.js";
import { asyncHandler } from "../middleware/async-handler.js";

export const getBoards = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { workspaceId } = req.params;
    const userId = getUserId(req);

    const boards = await boardService.getBoards(workspaceId, userId);

    res.status(200).json({ success: true, data: { boards } });
});

export const getBoard = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req);

    const board = await boardService.getBoardById(id, userId);

    res.status(200).json({ success: true, data: { board } });
});

export const createBoard = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { workspaceId } = req.params;
    const userId = getUserId(req);
    const { name, description } = req.body;

    const board = await boardService.createBoard({ name, description, workspaceId }, userId);

    res.status(201).json({ success: true, data: { board }, message: "Board berhasil dibuat" });
});

export const updateBoard = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req);
    const { name, description } = req.body;

    const board = await boardService.updateBoard(id, { name, description }, userId);

    res.status(200).json({ success: true, data: { board }, message: "Board berhasil diupdate" });
});

export const deleteBoard = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req);

    await boardService.deleteBoard(id, userId);

    res.status(200).json({ success: true, message: "Board berhasil dihapus" });
});
