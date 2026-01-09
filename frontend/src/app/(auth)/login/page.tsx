"use client";

// ==============================================
// Login Page - Modern Glassmorphism
// ==============================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(formData.identifier, formData.password);
            toast.success("Login berhasil! 🎉");
            router.push("/");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Login gagal");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border border-white/20 dark:border-slate-700/50 shadow-2xl relative">
            {/* Theme Toggle - Top Right of Card */}
            <div className="absolute top-3 right-3 z-10">
                <ThemeToggle />
            </div>

            <CardHeader className="space-y-1 text-center pt-10">
                {/* Logo/Icon */}
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">Selamat Datang!</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                    Masuk ke TaskScale untuk mengelola tugas Anda
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="identifier" className="text-slate-700 dark:text-slate-300">Email atau Username</Label>
                        <Input
                            id="identifier"
                            type="text"
                            placeholder="nama@email.com atau username"
                            value={formData.identifier}
                            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                            required
                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold shadow-lg"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Loading...
                            </div>
                        ) : (
                            "Masuk"
                        )}
                    </Button>
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                        Belum punya akun?{" "}
                        <Link href="/register" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium hover:underline">
                            Daftar Sekarang
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
