import { Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import { AuthenticatedRequest, AppError } from "../types/index.js";

export function requireAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void {
    const token = req.cookies?.token;

    if (!token) {
        res.status(401).json({ success: false, error: "Silakan login terlebih dahulu" });
        return;
    }

    try {
        const decoded = authService.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        const message = error instanceof AppError ? error.message : "Token tidak valid";
        res.status(401).json({ success: false, error: message });
    }
}

export function optionalAuth(
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
): void {
    try {
        const token = req.cookies?.token;
        if (token) {
            const decoded = authService.verifyToken(token);
            req.user = decoded;
        }
    } catch {
        // Token invalid, lanjut tanpa user
    }
    next();
}
