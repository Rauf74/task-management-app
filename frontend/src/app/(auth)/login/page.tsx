"use client";

// ==============================================
// Login Page - Modern with Illustration
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
import { Mail, Lock, Loader2 } from "lucide-react";

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
        <>
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
                <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-white/30">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                </div>
            </div>

            <Card className="w-full max-w-[420px] mx-auto border-0 shadow-2xl bg-white/95 dark:bg-card/95 backdrop-blur-sm">
                {/* Theme Toggle */}
                <div className="absolute top-4 right-4 z-10">
                    <ThemeToggle />
                </div>

                <CardHeader className="space-y-1 text-center pt-8 pb-4">
                    {/* Desktop Logo */}
                    <div className="hidden lg:flex mx-auto mb-4 w-14 h-14 bg-primary/10 rounded-xl items-center justify-center">
                        <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Selamat Datang!</CardTitle>
                    <CardDescription className="text-sm">
                        Masuk ke TaskScale untuk mengelola tugas Anda
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 px-6">
                        <div className="space-y-2">
                            <Label htmlFor="identifier" className="text-sm font-medium">
                                Email atau Username
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="identifier"
                                    type="text"
                                    placeholder="nama@email.com atau username"
                                    value={formData.identifier}
                                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                                    required
                                    className="pl-10 h-11"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="pl-10 h-11"
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 px-6 pb-6">
                        <Button
                            type="submit"
                            className="w-full h-11 shadow-lg shadow-primary/20"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Loading...
                                </div>
                            ) : (
                                "Masuk"
                            )}
                        </Button>

                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-card px-2 text-muted-foreground">
                                    atau
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground text-center">
                            Belum punya akun?{" "}
                            <Link href="/register" className="text-primary hover:underline font-medium">
                                Daftar Sekarang
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </>
    );
}
