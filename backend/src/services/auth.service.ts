import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as authRepository from "../repositories/auth.repository.js";
import { RegisterRequest, LoginRequest, UpdateMeRequest, ChangePasswordRequest, User, JWTPayload, AppError } from "../types/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const SALT_ROUNDS = 10;

export async function register(data: RegisterRequest): Promise<{ user: User; token: string }> {
    const existingUser = await authRepository.findByEmail(data.email);
    if (existingUser) throw new AppError("Email sudah terdaftar", 409);

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await authRepository.create({ ...data, password: hashedPassword });

    const payload: JWTPayload = { userId: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);

    return { user, token };
}

export async function login(data: LoginRequest): Promise<{ user: User; token: string }> {
    const user = await authRepository.findByEmailOrName(data.email);
    if (!user) throw new AppError("Email/username atau password salah", 401);

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) throw new AppError("Email atau password salah", 401);

    const payload: JWTPayload = { userId: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
}

export function verifyToken(token: string): JWTPayload {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        throw new AppError("Token tidak valid atau sudah expired", 401);
    }
}

export async function getUserById(id: string): Promise<User | null> {
    return authRepository.findById(id);
}

export async function updateProfile(userId: string, data: UpdateMeRequest): Promise<User> {
    const trimmedName = data.name.trim();
    if (trimmedName.length < 2) throw new AppError("Nama minimal 2 karakter", 400);

    return authRepository.updateUser(userId, { name: trimmedName });
}

export async function changePassword(userId: string, data: ChangePasswordRequest): Promise<void> {
    const user = await authRepository.findByIdWithPassword(userId);
    if (!user) throw new AppError("User tidak ditemukan", 404);

    const isCurrentValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isCurrentValid) throw new AppError("Password saat ini salah", 400);

    if (data.newPassword.length < 6) throw new AppError("Password baru minimal 6 karakter", 400);

    const hashedPassword = await bcrypt.hash(data.newPassword, SALT_ROUNDS);
    await authRepository.updatePassword(userId, hashedPassword);
}

export async function createDemoUser(): Promise<{
    user: User;
    token: string;
    credentials: { username: string; password: string };
}> {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const rawUsername = `demo_user_${randomCode}`;
    const rawEmail = `demo_${randomCode}@taskscale.site`;
    const rawPassword = `pass${randomCode}`;

    const hashedPassword = await bcrypt.hash(rawPassword, SALT_ROUNDS);

    const user = await authRepository.createDemoUserWithData({
        name: `Demo Reviewer #${randomCode}`,
        email: rawEmail,
        password: hashedPassword,
    });

    const payload: JWTPayload = { userId: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);

    return {
        user,
        token,
        credentials: {
            username: rawUsername,
            password: rawPassword,
        },
    };
}

