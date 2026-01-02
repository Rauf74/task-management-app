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

    useEffect(() => {
        loadWorkspace();
    }, [workspaceId]);

    async function loadWorkspace() {
        try {
            const response = await workspaceApi.get(workspaceId);
            if (response?.data?.workspace) {
                setWorkspace(response.data.workspace);
            }
        } catch (error) {
            toast.error("Gagal memuat workspace");
            console.error(error);
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
        if (!confirm("Yakin ingin menghapus workspace ini?")) return;

        try {
            await workspaceApi.delete(workspaceId);
            toast.success("Workspace berhasil dihapus");
            router.push("/");
        } catch (error) {
            toast.error("Gagal menghapus workspace");
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Memuat workspace...</div>
            </div>
        );
    }

    if (!workspace) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-slate-400 mb-4">Workspace tidak ditemukan</p>
                <Button onClick={() => router.push("/")}>Kembali ke Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                        <Link href="/" className="hover:text-white">Dashboard</Link>
                        <span>/</span>
                        <span className="text-white">{workspace.name}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">{workspace.name}</h1>
                    {workspace.description && (
                        <p className="text-slate-400">{workspace.description}</p>
                    )}
                </div>
                <div className="flex gap-2">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>+ Buat Board</Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700">
                            <form onSubmit={handleCreateBoard}>
                                <DialogHeader>
                                    <DialogTitle className="text-white">Buat Board Baru</DialogTitle>
                                    <DialogDescription className="text-slate-400">
                                        Board adalah papan Kanban untuk mengelola tugas.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-slate-200">Nama Board</Label>
                                        <Input
                                            id="name"
                                            placeholder="Contoh: Sprint 1, Project ABC"
                                            value={newBoard.name}
                                            onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
                                            required
                                            className="bg-slate-900 border-slate-600 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-slate-200">Deskripsi (opsional)</Label>
                                        <Input
                                            id="description"
                                            placeholder="Deskripsi singkat..."
                                            value={newBoard.description}
                                            onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
                                            className="bg-slate-900 border-slate-600 text-white"
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
                    <Button variant="destructive" onClick={handleDeleteWorkspace}>
                        Hapus Workspace
                    </Button>
                </div>
            </div>

            {/* Board Grid */}
            {workspace.boards.length === 0 ? (
                <Card className="border-slate-700 bg-slate-800/50">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-slate-400 mb-4">Belum ada board di workspace ini</p>
                        <Button onClick={() => setDialogOpen(true)}>Buat Board Pertama</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {workspace.boards.map((board: Board) => (
                        <Link key={board.id} href={`/boards/${board.id}`}>
                            <Card className="border-slate-700 bg-slate-800 hover:bg-slate-750 transition-colors cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle className="text-white">{board.name}</CardTitle>
                                    <CardDescription className="text-slate-400">
                                        {board.description || "Tidak ada deskripsi"}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
