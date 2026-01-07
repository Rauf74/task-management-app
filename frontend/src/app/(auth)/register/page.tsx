"use client";

// ==============================================
// Register Page
// ==============================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

        setIsLoading(true);

        try {
            await register(formData.name, formData.email, formData.password);
            toast.success("Registrasi berhasil!");
            router.push("/");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Registrasi gagal");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="border-border bg-card/80 backdrop-blur">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-foreground">Daftar</CardTitle>
                <CardDescription className="text-muted-foreground">
                    Buat akun baru untuk mulai menggunakan aplikasi
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground">Nama</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Nama lengkap"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="nama@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-foreground">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Minimal 6 karakter"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            minLength={6}
                            className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-foreground">Konfirmasi Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Ulangi password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                            className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Loading..." : "Daftar"}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            Login
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
