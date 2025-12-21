// ==============================================
// Auth Middleware
// ==============================================
//
// Middleware untuk proteksi route yang butuh authentication.
// - Cek JWT dari cookie
// - Verify token
// - Attach user ke request object
//
// ==============================================

import { Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import { AuthenticatedRequest, ApiResponse } from "../types/index.js";

// ==============================================
// Require Authentication
// ==============================================

export function requireAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void {
    try {
        // Get token from cookie
        const token = req.cookies?.token;

        if (!token) {
            const response: ApiResponse = {
                success: false,
                error: "Silakan login terlebih dahulu",
            };
            res.status(401).json(response);
            return;
        }

        // Verify token
        const decoded = authService.verifyToken(token);

        // Attach user info to request
        req.user = decoded;

        next();
    } catch (error) {
        const message = error instanceof Error ? error.message : "Token tidak valid";
        const response: ApiResponse = {
            success: false,
            error: message,
        };

        res.status(401).json(response);
    }
}

// ==============================================
// Optional Auth (tidak wajib login)
// ==============================================

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
        // Token invalid, tapi tidak error - lanjut tanpa user
    }

    next();
}
