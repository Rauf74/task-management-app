import { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { AuthenticatedRequest, getUserId, AppError } from "../types/index.js";
import { asyncHandler } from "../middleware/async-handler.js";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
};

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { user, token } = await authService.register(req.body);

    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(201).json({
        success: true,
        data: { user },
        message: "Registrasi berhasil",
    });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { user, token } = await authService.login(req.body);

    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(200).json({
        success: true,
        data: { user },
        message: "Login berhasil",
    });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie("token", {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
        success: true,
        message: "Logout berhasil",
    });
});

export const me = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = getUserId(req);

    const user = await authService.getUserById(userId);
    if (!user) throw new AppError("User tidak ditemukan", 404);

    res.status(200).json({
        success: true,
        data: { user },
    });
});

export const updateMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = getUserId(req);

    const user = await authService.updateProfile(userId, req.body);

    res.status(200).json({
        success: true,
        data: { user },
        message: "Profil berhasil diperbarui",
    });
});

export const changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = getUserId(req);

    await authService.changePassword(userId, req.body);

    res.status(200).json({
        success: true,
        message: "Password berhasil diubah",
    });
});

export const quickDemo = asyncHandler(async (_req: Request, res: Response) => {
    const { user, token, credentials } = await authService.createDemoUser();

    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(200).json({
        success: true,
        data: {
            user,
            credentials,
            redirectUrl: "/",
        },
        message: "Akun demo berhasil dibuat",
    });
});

