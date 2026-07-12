"use client";

// ==============================================
// Dashboard Home - Workspace List
// ==============================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { workspaceApi, Workspace } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, FolderKanban } from "lucide-react";
import { toast } from "sonner";
import { colorFor } from "@/lib/utils";

export default function DashboardPage() {
    const { user } = useAuth();
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newWorkspace, setNewWorkspace] = useState({ name: "", description: "" });

    useEffect(() => {
        loadWorkspaces();
    }, []);

    async function loadWorkspaces() {
        try {
            const response = await workspaceApi.list();
            if (response?.data?.workspaces) {
                setWorkspaces(response.data.workspaces);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "";
            if (!message.includes("login")) {
                toast.error("Gagal memuat workspace");
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCreateWorkspace(e: React.FormEvent) {
        e.preventDefault();
        if (!newWorkspace.name.trim()) return;

        setIsCreating(true);
        try {
            const response = await workspaceApi.create(newWorkspace);
            if (response?.data?.workspace) {
                setWorkspaces([response.data.workspace, ...workspaces]);
                setNewWorkspace({ name: "", description: "" });
                setDialogOpen(false);
                toast.success("Workspace berhasil dibuat!");
            } else {
                toast.error("Gagal membuat workspace: Response tidak valid");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Gagal membuat workspace");
        } finally {
            setIsCreating(false);
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="h-44 lg:col-span-2 rounded-2xl bg-muted/40 animate-pulse" />
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                        <div className="h-[88px] rounded-2xl bg-muted/40 animate-pulse" />
                        <div className="h-[88px] rounded-2xl bg-muted/40 animate-pulse" />
                    </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 rounded-2xl bg-muted/40 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <DashboardHero
                userName={user?.name || ""}
                workspaces={workspaces}
                onAddWorkspace={() => setDialogOpen(true)}
            />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Workspace kamu</h2>
                    {workspaces.length > 0 && (
                        <span className="text-sm text-muted-foreground">{workspaces.length} total</span>
                    )}
                </div>

                {workspaces.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-card/40 py-16 text-center">
                        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                            <FolderKanban className="h-7 w-7" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-foreground">Belum ada workspace</h3>
                        <p className="mx-auto mt-2 mb-6 max-w-md text-sm text-muted-foreground">
                            Mulai dengan membuat workspace untuk mengorganisir board dan tugas-tugas kamu.
                        </p>
                        <Button variant="brand" size="lg" onClick={() => setDialogOpen(true)}>
                            Buat Workspace Pertama
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {workspaces.map((workspace) => {
                            const color = colorFor(workspace.id);
                            return (
                                <Link
                                    key={workspace.id}
                                    href={`/workspaces/${workspace.id}`}
                                    className="group relative block overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
                                >
                                    {/* top accent bar (workspace identity color) */}
                                    <span
                                        className="absolute inset-x-0 top-0 h-1"
                                        style={{ backgroundColor: color }}
                                    />
                                    <div className="flex items-start gap-3">
                                        <span
                                            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-base font-bold text-white"
                                            style={{ backgroundColor: color }}
                                        >
                                            {workspace.name.charAt(0).toUpperCase()}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate font-semibold text-foreground transition-colors group-hover:text-primary">
                                                {workspace.name}
                                            </h3>
                                            <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                                                {workspace.description || "Tidak ada deskripsi"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                            <LayoutDot />
                                            {workspace._count?.boards || 0} Board
                                            {(workspace._count?.boards || 0) !== 1 ? "s" : ""}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-primary">
                                            Buka <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

            {/* Create workspace dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="bg-card border-border">
                    <form onSubmit={handleCreateWorkspace}>
                        <DialogHeader>
                            <DialogTitle className="text-foreground">Buat Workspace Baru</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Workspace adalah wadah untuk mengelompokkan board-board kamu.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-foreground">Nama Workspace</Label>
                                <Input
                                    id="name"
                                    placeholder="Contoh: Personal, Kantor"
                                    value={newWorkspace.name}
                                    onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                                    required
                                    className="bg-background border-input text-foreground"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-foreground">Deskripsi (opsional)</Label>
                                <Input
                                    id="description"
                                    placeholder="Deskripsi singkat..."
                                    value={newWorkspace.description}
                                    onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                                    className="bg-background border-input text-foreground"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" variant="brand" disabled={isCreating}>
                                {isCreating ? "Membuat..." : "Buat Workspace"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
        </div>
    );
}

function LayoutDot() {
    return <span className="h-1.5 w-1.5 rounded-full bg-primary" />;
}
