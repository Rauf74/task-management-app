// ==============================================
// Validation Middleware (Zod)
// ==============================================
//
// Zod schemas untuk validasi input dari client.
// Middleware ini akan validate request body sebelum
// masuk ke controller.
//
// ==============================================

import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";
import { ApiResponse } from "../types/index.js";

// ==============================================
// Auth Schemas
// ==============================================

export const registerSchema = z.object({
    name: z
        .string()
        .min(2, "Nama minimal 2 karakter")
        .max(100, "Nama maksimal 100 karakter"),
    email: z
        .string()
        .email("Format email tidak valid"),
    password: z
        .string()
        .min(6, "Password minimal 6 karakter")
        .max(100, "Password maksimal 100 karakter"),
});

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email atau username wajib diisi"),
    password: z
        .string()
        .min(1, "Password wajib diisi"),
});

// ==============================================
// Workspace Schemas
// ==============================================

export const workspaceSchema = z.object({
    name: z.string().min(1, "Nama workspace wajib diisi").max(100),
    description: z.string().max(500).optional(),
});

export const updateWorkspaceSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
});

// ==============================================
// Board Schemas
// ==============================================

export const boardSchema = z.object({
    name: z.string().min(1, "Nama board wajib diisi").max(100),
    description: z.string().max(500).optional(),
});

export const updateBoardSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
});

// ==============================================
// Column Schemas
// ==============================================

export const columnSchema = z.object({
    title: z.string().min(1, "Judul column wajib diisi").max(100),
});

export const updateColumnSchema = z.object({
    title: z.string().min(1).max(100).optional(),
});

export const reorderColumnsSchema = z.object({
    columnIds: z.array(z.string()),
});

// ==============================================
// Task Schemas
// ==============================================

export const taskSchema = z.object({
    title: z.string().min(1, "Judul task wajib diisi").max(200),
    description: z.string().max(1000).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    dueDate: z.string().datetime().optional(),
    labelIds: z.array(z.string()).optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(1000).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    dueDate: z.string().datetime().nullable().optional(),
    labelIds: z.array(z.string()).optional(),
});

export const moveTaskSchema = z.object({
    columnId: z.string(),
    order: z.number().int().min(0),
});

// ==============================================
// Validation Middleware Factory
// ==============================================

export function validate(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => issue.message).join(", ");
            const response: ApiResponse = {
                success: false,
                error: errors,
            };
            res.status(400).json(response);
            return;
        }

        // Replace body with validated data
        req.body = result.data;
        next();
    };
}
