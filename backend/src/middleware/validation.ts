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
        .email("Format email tidak valid"),
    password: z
        .string()
        .min(1, "Password wajib diisi"),
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
