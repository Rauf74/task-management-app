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
        <Card className="glass-card w-[400px] relative">
            {/* Theme Toggle - Top Right of Card */}
            <div className="absolute top-3 right-3 z-10">
                <ThemeToggle />
            </div>

            <CardHeader className="space-y-1 text-center pt-8">
                {/* Logo/Icon */}
                <div className="mx-auto mb-6 w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner ring-1 ring-primary/20">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">Selamat Datang!</CardTitle>
                <CardDescription>
                    Masuk ke TaskScale untuk mengelola tugas Anda
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="identifier">Email atau Username</Label>
                        <Input
                            id="identifier"
                            type="text"
                            placeholder="nama@email.com atau username"
                            value={formData.identifier}
                            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button
                        type="submit"
                        className="w-full shadow-lg shadow-primary/20"
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
                    <p className="text-sm text-muted-foreground text-center">
                        Belum punya akun?{" "}
                        <Link href="/register" className="text-primary hover:underline font-medium">
                            Daftar Sekarang
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
