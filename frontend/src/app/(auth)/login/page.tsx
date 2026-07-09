"use client";

// ==============================================
// Login Page - Split layout (brand panel + form)
// ==============================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";
import { Mail, Lock, Loader2, Sparkles, Check, LayoutGrid, Users } from "lucide-react";

const FEATURES = [
    { icon: LayoutGrid, text: "Board Kanban untuk tiap project" },
    { icon: Users, text: "Workspace kolaboratif untuk tim" },
    { icon: Check, text: "Lacak progress task secara real-time" },
];

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ identifier: "", password: "" });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(formData.identifier, formData.password);
            toast.success("Login berhasil!");
            router.push("/");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Login gagal");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background lg:grid lg:grid-cols-2">
            {/* Brand panel (desktop) */}
            <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-emerald-600 to-teal-600 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
                <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-black/10 blur-3xl" />

                <div className="relative flex items-center gap-3 text-white">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur">
                        <Sparkles className="h-6 w-6" />
                    </span>
                    <span className="text-2xl font-bold tracking-tight">TaskScale</span>
                </div>

                <div className="relative space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                            Kelola tugas,<br />nyelesaiin lebih cepat.
                        </h1>
                        <p className="mt-4 max-w-md text-base text-white/80">
                            Satu tempat untuk merencanakan, melacak, dan menyelesaikan semua pekerjaan tim kamu.
                        </p>
                    </div>
                    <ul className="space-y-3">
                        {FEATURES.map((f) => (
                            <li key={f.text} className="flex items-center gap-3 text-white/90">
                                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/15 backdrop-blur">
                                    <f.icon className="h-4 w-4" />
                                </span>
                                <span className="text-sm">{f.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative text-sm text-white/60">© {new Date().getFullYear()} TaskScale</p>
            </div>

            {/* Form side */}
            <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6">
                <div className="absolute right-4 top-4">
                    <ThemeToggle />
                </div>

                {/* Mobile logo */}
                <div className="mb-8 flex items-center gap-2 lg:hidden">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                        <Sparkles className="h-5 w-5" />
                    </span>
                    <span className="text-xl font-bold tracking-tight text-foreground">TaskScale</span>
                </div>

                <div className="w-full max-w-[400px]">
                    <div className="mb-6 text-center lg:text-left">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Selamat Datang!</h2>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            Masuk ke akun TaskScale kamu
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="identifier" className="text-sm font-medium">Email atau Username</Label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="identifier"
                                    type="text"
                                    placeholder="nama@email.com atau username"
                                    value={formData.identifier}
                                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                                    required
                                    className="h-11 pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                            </div>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="h-11 pl-10"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="h-11 w-full shadow-lg shadow-primary/20" disabled={isLoading}>
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                                </span>
                            ) : (
                                "Masuk"
                            )}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Belum punya akun?{" "}
                        <Link href="/register" className="font-medium text-primary hover:underline">
                            Daftar Sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
