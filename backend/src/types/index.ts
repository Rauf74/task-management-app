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

// User with password (internal use only)
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

export interface AuthResponse {
    user: User;
    message: string;
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
// API Response Types
// ==============================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
