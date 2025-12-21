// ==============================================
// Auth Controller
// ==============================================
//
// Handle HTTP requests untuk authentication.
// - Terima request
// - Panggil service
// - Kirim response
//
// ==============================================

import { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { RegisterRequest, LoginRequest, ApiResponse, AuthenticatedRequest } from "../types/index.js";

// ==============================================
// Cookie Options
// ==============================================

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
};

// ==============================================
// Register
// ==============================================

export async function register(req: Request, res: Response): Promise<void> {
    try {
        const data: RegisterRequest = req.body;
        const user = await authService.register(data);

        const response: ApiResponse = {
            success: true,
            data: { user },
            message: "Registrasi berhasil",
        };

        res.status(201).json(response);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        const response: ApiResponse = {
            success: false,
            error: message,
        };

        // Check if it's a duplicate email error
        const statusCode = message.includes("terdaftar") ? 409 : 500;
        res.status(statusCode).json(response);
    }
}

// ==============================================
// Login
// ==============================================

export async function login(req: Request, res: Response): Promise<void> {
    try {
        const data: LoginRequest = req.body;
        const { user, token } = await authService.login(data);

        // Set JWT in HttpOnly cookie
        res.cookie("token", token, COOKIE_OPTIONS);

        const response: ApiResponse = {
            success: true,
            data: { user },
            message: "Login berhasil",
        };

        res.status(200).json(response);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        const response: ApiResponse = {
            success: false,
            error: message,
        };

        res.status(401).json(response);
    }
}

// ==============================================
// Logout
// ==============================================

export async function logout(_req: Request, res: Response): Promise<void> {
    // Clear the token cookie
    res.clearCookie("token", { path: "/" });

    const response: ApiResponse = {
        success: true,
        message: "Logout berhasil",
    };

    res.status(200).json(response);
}

// ==============================================
// Get Current User (Me)
// ==============================================

export async function me(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        if (!req.user) {
            const response: ApiResponse = {
                success: false,
                error: "Unauthorized",
            };
            res.status(401).json(response);
            return;
        }

        const user = await authService.getUserById(req.user.userId);

        if (!user) {
            const response: ApiResponse = {
                success: false,
                error: "User tidak ditemukan",
            };
            res.status(404).json(response);
            return;
        }

        const response: ApiResponse = {
            success: true,
            data: { user },
        };

        res.status(200).json(response);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        const response: ApiResponse = {
            success: false,
            error: message,
        };

        res.status(500).json(response);
    }
}
