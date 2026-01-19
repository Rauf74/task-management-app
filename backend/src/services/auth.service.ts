// ==============================================
// Auth Service
// ==============================================
//
// Business logic untuk authentication.
// - Validasi business rules
// - Hash password
// - Generate JWT
// - Verify credentials
//
// ==============================================

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as authRepository from "../repositories/auth.repository.js";
import { RegisterRequest, LoginRequest, User, JWTPayload } from "../types/index.js";

// ==============================================
// Constants
// ==============================================

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const SALT_ROUNDS = 10;

// ==============================================
// Register
// ==============================================

export async function register(data: RegisterRequest): Promise<{ user: User; token: string }> {
    // Check if email already exists
    const existingUser = await authRepository.findByEmail(data.email);

    if (existingUser) {
        throw new Error("Email sudah terdaftar");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Create user
    const user = await authRepository.create({
        ...data,
        password: hashedPassword,
    });

    // Generate JWT for auto-login after register
    const payload: JWTPayload = {
        userId: user.id,
        email: user.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    return { user, token };
}

// ==============================================
// Login
// ==============================================

export async function login(data: LoginRequest): Promise<{ user: User; token: string }> {
    // Find user by email OR username
    const user = await authRepository.findByEmailOrName(data.email);

    if (!user) {
        throw new Error("Email/username atau password salah");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
        throw new Error("Email atau password salah");
    }

    // Generate JWT
    const payload: JWTPayload = {
        userId: user.id,
        email: user.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "7d",
    } as jwt.SignOptions);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return {
        user: userWithoutPassword,
        token,
    };
}

// ==============================================
// Verify Token
// ==============================================

export function verifyToken(token: string): JWTPayload {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch {
        throw new Error("Token tidak valid atau sudah expired");
    }
}

// ==============================================
// Get User by ID
// ==============================================

export async function getUserById(id: string): Promise<User | null> {
    return authRepository.findById(id);
}
