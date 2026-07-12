import { Response } from "express";
import * as columnService from "../services/column.service.js";
import { AuthenticatedRequest, getUserId } from "../types/index.js";
import { asyncHandler } from "../middleware/async-handler.js";

export const createColumn = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { boardId } = req.params;
    const userId = getUserId(req);
    const { title } = req.body;

    const column = await columnService.createColumn({ title, boardId }, userId);

    res.status(201).json({ success: true, data: { column }, message: "Column berhasil dibuat" });
});

export const updateColumn = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req);
    const { title } = req.body;

    const column = await columnService.updateColumn(id, { title }, userId);

    res.status(200).json({ success: true, data: { column }, message: "Column berhasil diupdate" });
});

export const deleteColumn = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req);

    await columnService.deleteColumn(id, userId);

    res.status(200).json({ success: true, message: "Column berhasil dihapus" });
});

export const reorderColumns = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = getUserId(req);
    const { columnIds } = req.body;

    const columns = await columnService.reorderColumns(columnIds, userId);

    res.status(200).json({ success: true, data: { columns }, message: "Urutan column berhasil diubah" });
});
