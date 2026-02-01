import { Response } from "express";
import * as labelService from "../services/label.service.js";
import { z } from "zod";
import { AuthenticatedRequest } from "../types/index.js";

const createLabelSchema = z.object({
    name: z.string().min(1, "Nama label wajib diisi"),
    color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Format warna tidak valid"),
});

export async function createLabel(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { workspaceId } = req.params;
        const userId = req.user!.userId;

        const validated = createLabelSchema.parse(req.body);

        const label = await labelService.createLabel(workspaceId, validated, userId);

        res.status(201).json({
            success: true,
            message: "Label berhasil dibuat",
            data: { label },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ success: false, message: error.issues[0].message });
        } else if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        } else {
            res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
        }
    }
}

export async function getLabels(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { workspaceId } = req.params;
        const userId = req.user!.userId;

        const labels = await labelService.getLabels(workspaceId, userId);

        res.json({
            success: true,
            data: { labels },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Gagal memuat labels",
        });
    }
}

export async function deleteLabel(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;

        await labelService.deleteLabel(id, userId);

        res.json({
            success: true,
            message: "Label berhasil dihapus",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Gagal menghapus label",
        });
    }
}
