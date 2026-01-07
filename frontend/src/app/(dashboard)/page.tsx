"use client";

// ==============================================
// Dashboard Home - Workspace List
// ==============================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { workspaceApi, Workspace } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function DashboardPage() {
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
            setWorkspaces([response.data.workspace, ...workspaces]);
            setNewWorkspace({ name: "", description: "" });
            setDialogOpen(false);
            toast.success("Workspace berhasil dibuat!");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Gagal membuat workspace");
        } finally {
            setIsCreating(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Memuat workspace...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Workspace</h1>
                    <p className="text-muted-foreground">Kelola semua workspace Anda</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>+ Buat Workspace</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border">
                        <form onSubmit={handleCreateWorkspace}>
                            <DialogHeader>
                                <DialogTitle className="text-foreground">Buat Workspace Baru</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    Workspace adalah wadah untuk mengelompokkan board-board Anda.
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
                                <Button type="submit" disabled={isCreating}>
                                    {isCreating ? "Membuat..." : "Buat Workspace"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Workspace Grid */}
            {workspaces.length === 0 ? (
                <Card className="border-border bg-card/50">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-muted-foreground mb-4">Belum ada workspace</p>
                        <Button onClick={() => setDialogOpen(true)}>Buat Workspace Pertama</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {workspaces.map((workspace) => (
                        <Link key={workspace.id} href={`/workspaces/${workspace.id}`}>
                            <Card className="border-border bg-card hover:bg-accent transition-colors cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle className="text-foreground">{workspace.name}</CardTitle>
                                    <CardDescription className="text-muted-foreground">
                                        {workspace.description || "Tidak ada deskripsi"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {workspace._count?.boards || 0} board
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
