"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles, Loader2, CheckCircle2, ArrowRight, Copy, KeyRound, UserCheck } from "lucide-react";
import { toast } from "sonner";

export function DemoLoginModal() {
    const router = useRouter();
    const { quickDemo } = useAuth();

    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [credentials, setCredentials] = useState<{
        username: string;
        password: string;
        redirectUrl: string;
    } | null>(null);

    async function handleGenerateDemo() {
        setIsLoading(true);
        try {
            const res = await quickDemo();
            setCredentials(res);
            toast.success("Akun demo & data sampel berhasil dibuat!");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Gagal membuat akun demo");
        } finally {
            setIsLoading(false);
        }
    }

    function handleEnterDashboard() {
        setOpen(false);
        const target = credentials?.redirectUrl || "/";
        window.location.href = target;
    }

    function copyToClipboard(text: string, label: string) {
        navigator.clipboard.writeText(text);
        toast.success(`${label} berhasil disalin!`);
    }

    function handleOpenChange(newOpen: boolean) {
        if (!isLoading) {
            setOpen(newOpen);
            if (!newOpen) {
                // Reset state when closed
                setTimeout(() => setCredentials(null), 300);
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 border-dashed border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-200 font-semibold"
                >
                    <Sparkles className="mr-2 h-4 w-4 animate-pulse text-primary" />
                    ⚡ Akses Cepat (Demo)
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-card border-border sm:max-w-md">
                {!credentials ? (
                    <>
                        <DialogHeader>
                            <div className="mx-auto sm:mx-0 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary mb-2">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <DialogTitle className="text-xl font-bold text-foreground">
                                Coba Demo TaskScale Instant
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                                Ingin menguji aplikasi tanpa perlu mendaftar? Sistem akan membuatkan <strong>akun demo acak</strong> beserta data sampel (Workspace, Board, Kolom, Task, & Label) agar kamu bisa langsung mencoba fitur Drag & Drop Kanban.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-3">
                            <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-2">
                                <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                                    <UserCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                                    <span>Akun otomatis ter-autentikasi via HTTP-only Cookie</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                                    <KeyRound className="h-4 w-4 text-primary shrink-0" />
                                    <span>Kredensial acak unik di-generate otomatis di server</span>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="brand"
                                size="lg"
                                className="w-full font-semibold shadow-md"
                                onClick={handleGenerateDemo}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Menyiapkan Data Sampel...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        Buat Akun Demo Instant
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <div className="mx-auto sm:mx-0 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500 mb-2">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <DialogTitle className="text-xl font-bold text-foreground">
                                🎉 Akun Demo Berhasil Dibuat!
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground text-sm">
                                Sesi login kamu telah aktif. Kredensial berikut dapat kamu simpan jika ingin login kembali nanti:
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-3 py-2">
                            <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                                <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2.5">
                                    <span className="text-xs font-medium text-muted-foreground">Username</span>
                                    <div className="flex items-center gap-2">
                                        <code className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                            {credentials.username}
                                        </code>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                            onClick={() => copyToClipboard(credentials.username, "Username")}
                                            title="Salin Username"
                                        >
                                            <Copy className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-medium text-muted-foreground">Password</span>
                                    <div className="flex items-center gap-2">
                                        <code className="text-sm font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                                            {credentials.password}
                                        </code>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                            onClick={() => copyToClipboard(credentials.password, "Password")}
                                            title="Salin Password"
                                        >
                                            <Copy className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs text-center text-muted-foreground">
                                Klik tombol di bawah ini untuk langsung menuju ke Dashboard.
                            </p>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="brand"
                                size="lg"
                                className="w-full font-semibold shadow-md group"
                                onClick={handleEnterDashboard}
                            >
                                Masuk ke Dashboard
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
