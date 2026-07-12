"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi, User } from "@/lib/api";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
        if (response.data?.user) {
            setUser(response.data.user);
        }
    }

    async function register(name: string, email: string, password: string) {
        const response = await authApi.register({ name, email, password });
        if (response.data?.user) {
            setUser(response.data.user);
        }
    }

    async function logout() {
        await authApi.logout();
        setUser(null);
    }

    function updateUser(updatedUser: User) {
        setUser(updatedUser);
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
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
