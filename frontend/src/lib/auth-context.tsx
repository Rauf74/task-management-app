"use client";

// ==============================================
// Auth Context Provider
// ==============================================

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi, User } from "@/lib/api";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const response = await authApi.me();
            setUser(response.data.user);
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }

    async function login(email: string, password: string) {
        const response = await authApi.login({ email, password });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setUser((response as any).data.user);
    }

    async function register(name: string, email: string, password: string) {
        const response = await authApi.register({ name, email, password });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setUser((response as any).data.user);
    }

    async function logout() {
        await authApi.logout();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
