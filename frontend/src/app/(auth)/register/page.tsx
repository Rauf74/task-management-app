"use client";

// ==============================================
// Register Page - Modern Glassmorphism
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
            // Small delay to ensure cookie is properly set before redirect
            await new Promise(resolve => setTimeout(resolve, 100));
            router.push("/");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Registrasi gagal");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="glass-card w-[450px] relative">
            {/* Theme Toggle - Top Right of Card */}
            <div className="absolute top-3 right-3 z-10">
                <ThemeToggle />
            </div>

            <CardHeader className="space-y-1 text-center pt-8">
                {/* Logo/Icon */}
                <div className="mx-auto mb-6 w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner ring-1 ring-primary/20">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">Buat Akun</CardTitle>
                <CardDescription>
                    Daftar untuk mulai menggunakan TaskScale
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Username</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Username Anda"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <p className="text-xs text-muted-foreground">Username bisa digunakan untuk login</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="nama@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Min 6 karakter"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Konfirmasi</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Ulangi password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
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
                            "Daftar Sekarang"
                        )}
                    </Button>
                    <p className="text-sm text-muted-foreground text-center">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Masuk
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
