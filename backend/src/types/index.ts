// ==============================================
// TypeScript Types & Interfaces
// ==============================================

import { Request } from "express";

// ==============================================
// User Types
// ==============================================

export interface User {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserWithPassword extends User {
    password: string;
}

// ==============================================
// Auth Request/Response Types
// ==============================================

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UpdateMeRequest {
    name: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

// ==============================================
// JWT Types
// ==============================================

export interface JWTPayload {
    userId: string;
    email: string;
}

// ==============================================
// Express Request with User
// ==============================================

export interface AuthenticatedRequest extends Request {
    user?: JWTPayload;
}

// ==============================================
// Custom Error with HTTP Status Code
// ==============================================

export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";
    }
}

// ==============================================
// Helper: extract userId from authenticated request
// ==============================================

export function getUserId(req: AuthenticatedRequest): string {
    if (!req.user) {
        throw new AppError("Unauthorized", 401);
    }
    return req.user.userId;
}

// ==============================================
// API Response Types
// ==============================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
