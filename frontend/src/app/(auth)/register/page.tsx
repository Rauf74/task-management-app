"use client";

// ==============================================
// Register Page - Modern with Illustration
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
import { User, Mail, Lock, Loader2 } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Password tidak cocok");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password minimal 6 karakter");
            return;
        }

        setIsLoading(true);

        try {
            await register(formData.name, formData.email, formData.password);
            toast.success("Registrasi berhasil! 🎉");
            await new Promise(resolve => setTimeout(resolve, 100));
            router.push("/");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Registrasi gagal");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-white/30">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                </div>
            </div>

            <Card className="w-full max-w-[460px] mx-auto border-0 shadow-2xl bg-white/95 dark:bg-card/95 backdrop-blur-sm">
                {/* Theme Toggle */}
                <div className="absolute top-4 right-4 z-10">
                    <ThemeToggle />
                </div>

                <CardHeader className="space-y-1 text-center pt-8 pb-4">
                    {/* Desktop Logo */}
                    <div className="hidden lg:flex mx-auto mb-4 w-14 h-14 bg-primary/10 rounded-xl items-center justify-center">
                        <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Buat Akun</CardTitle>
                    <CardDescription className="text-sm">
                        Daftar untuk mulai menggunakan TaskScale
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 px-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Username
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Username Anda"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="pl-10 h-11"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Username bisa digunakan untuk login</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nama@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="pl-10 h-11"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Min 6 karakter"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        minLength={6}
                                        className="pl-10 h-11"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                    Konfirmasi
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Ulangi password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                        className="pl-10 h-11"
                                    />
                                </div>
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
                                "Daftar Sekarang"
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
                            Sudah punya akun?{" "}
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                Masuk
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </>
    );
}
