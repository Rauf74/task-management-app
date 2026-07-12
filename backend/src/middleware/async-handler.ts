import { Request, Response, NextFunction } from "express";
import { AppError, ApiResponse } from "../types/index.js";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function asyncHandler(fn: AsyncHandler) {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch((error) => {
            if (error instanceof AppError) {
                const response: ApiResponse = {
                    success: false,
                    error: error.message,
                };
                res.status(error.statusCode).json(response);
                return;
            }

            const message = error instanceof Error ? error.message : "Terjadi kesalahan server";
            const response: ApiResponse = {
                success: false,
                error: message,
            };
            res.status(500).json(response);
        });
    };
}
