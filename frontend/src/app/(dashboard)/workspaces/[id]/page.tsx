"use client";

// ==============================================
// Workspace Detail Page
// ==============================================

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { workspaceApi, boardApi, WorkspaceWithBoards, Board } from "@/lib/api";
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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

export default function WorkspaceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const workspaceId = params.id as string;

    const [workspace, setWorkspace] = useState<WorkspaceWithBoards | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newBoard, setNewBoard] = useState({ name: "", description: "" });
    const [deleteWorkspaceDialog, setDeleteWorkspaceDialog] = useState(false);

    useEffect(() => {
        loadWorkspace();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workspaceId]);

    async function loadWorkspace() {
        try {
            const response = await workspaceApi.get(workspaceId);
            if (response?.data?.workspace) {
                setWorkspace(response.data.workspace);
            }
        } catch {
            toast.error("Gagal memuat workspace");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCreateBoard(e: React.FormEvent) {
        e.preventDefault();
        if (!newBoard.name.trim()) return;

        setIsCreating(true);
        try {
            const response = await boardApi.create(workspaceId, newBoard);
            if (response?.data?.board) {
                setWorkspace((prev) =>
                    prev ? { ...prev, boards: [...prev.boards, response.data.board] } : prev
                );
                setNewBoard({ name: "", description: "" });
                setDialogOpen(false);
                toast.success("Board berhasil dibuat!");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Gagal membuat board");
        } finally {
            setIsCreating(false);
        }
    }

    async function handleDeleteWorkspace() {
        try {
            await workspaceApi.delete(workspaceId);
            toast.success("Workspace berhasil dihapus");
            router.push("/");
        } catch {
            toast.error("Gagal menghapus workspace");
        } finally {
            setDeleteWorkspaceDialog(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Memuat workspace...</div>
            </div>
        );
    }

    if (!workspace) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-muted-foreground mb-4">Workspace tidak ditemukan</p>
                <Button onClick={() => router.push("/")}>Kembali ke Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground">Dashboard</Link>
                <span>/</span>
                <span className="text-foreground truncate max-w-[200px]">{workspace.name}</span>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold text-foreground truncate">{workspace.name}</h1>
                    {workspace.description && (
                        <p className="text-muted-foreground mt-1 line-clamp-2">{workspace.description}</p>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">+ Buat Board</Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border">
                            <form onSubmit={handleCreateBoard}>
                                <DialogHeader>
                                    <DialogTitle className="text-foreground">Buat Board Baru</DialogTitle>
                                    <DialogDescription className="text-muted-foreground">
                                        Board adalah papan Kanban untuk mengelola tugas.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-foreground">Nama Board</Label>
                                        <Input
                                            id="name"
                                            placeholder="Contoh: Sprint 1, Project ABC"
                                            value={newBoard.name}
                                            onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
                                            required
                                            className="bg-background border-input text-foreground"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-foreground">Deskripsi (opsional)</Label>
                                        <Input
                                            id="description"
                                            placeholder="Deskripsi singkat..."
                                            value={newBoard.description}
                                            onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
                                            className="bg-background border-input text-foreground"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={isCreating}>
                                        {isCreating ? "Membuat..." : "Buat Board"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="destructive" onClick={() => setDeleteWorkspaceDialog(true)}>
                        Hapus Workspace
                    </Button>
                </div>
            </div>

            {/* Board Grid */}
            {workspace.boards.length === 0 ? (
                <Card className="glass border-border/50 bg-card/30">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">📋</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Belum ada board</h3>
                        <p className="text-muted-foreground mb-6 max-w-md">
                            Buat board Kanban pertama Anda untuk mulai melacak tugas-tugas dalam workspace ini.
                        </p>
                        <Button onClick={() => setDialogOpen(true)} size="lg" className="shadow-lg shadow-primary/20">
                            Buat Board Pertama
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {workspace.boards.map((board: Board) => (
                        <Link key={board.id} href={`/boards/${board.id}`} className="group block h-full">
                            <Card className="glass-card h-full relative overflow-hidden group-hover:border-primary/50 transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardHeader>
                                    <CardTitle className="text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                                        <span className="text-xl">📋</span>
                                        {board.name}
                                    </CardTitle>
                                    <CardDescription className="text-muted-foreground line-clamp-2">
                                        {board.description || "Tidak ada deskripsi"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                                        <span className="px-2 py-1 rounded-md bg-secondary">
                                            Kanban Board
                                        </span>
                                        <span className="group-hover:translate-x-1 transition-transform">
                                            Buka Board →
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}

            {/* Delete Workspace Confirmation */}
            <ConfirmDialog
                open={deleteWorkspaceDialog}
                onOpenChange={setDeleteWorkspaceDialog}
                title="Hapus Workspace"
                description="Yakin ingin menghapus workspace ini? Semua board dan task di dalamnya juga akan terhapus."
                onConfirm={handleDeleteWorkspace}
            />
        </div>
    );
}
