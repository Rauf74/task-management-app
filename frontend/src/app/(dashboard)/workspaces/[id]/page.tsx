"use client";

// ==============================================
// Workspace Detail Page
// ==============================================

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { workspaceApi, boardApi, WorkspaceWithBoards, Board } from "@/lib/api";
import { Button } from "@/components/ui/button";
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
import { AnalyticsWidget } from "@/components/dashboard/analytics-widget";
import { ArrowRight, KanbanSquare, Plus, Trash2, Pencil } from "lucide-react";

const WS_COLORS = ["#059669", "#7C3AED", "#F97316", "#0EA5E9", "#EC4899", "#F59E0B"];
function colorFor(id: string) {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    return WS_COLORS[h % WS_COLORS.length];
}

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
    const [editWorkspaceDialog, setEditWorkspaceDialog] = useState(false);
    const [editWorkspace, setEditWorkspace] = useState({ name: "", description: "" });
    const [isUpdating, setIsUpdating] = useState(false);

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

    function openEditWorkspace() {
        if (!workspace) return;
        setEditWorkspace({ name: workspace.name, description: workspace.description || "" });
        setEditWorkspaceDialog(true);
    }

    async function handleUpdateWorkspace(e: React.FormEvent) {
        e.preventDefault();
        if (!editWorkspace.name.trim()) return;
        setIsUpdating(true);
        try {
            const response = await workspaceApi.update(workspaceId, {
                name: editWorkspace.name.trim(),
                description: editWorkspace.description.trim(),
            });
            if (response?.data?.workspace) {
                setWorkspace((prev) =>
                    prev ? { ...prev, name: response.data.workspace.name, description: response.data.workspace.description } : prev
                );
            }
            setEditWorkspaceDialog(false);
            toast.success("Workspace berhasil diperbarui");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Gagal memperbarui workspace");
        } finally {
            setIsUpdating(false);
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-4 w-40 rounded bg-muted/40 animate-pulse" />
                <div className="h-28 rounded-2xl bg-muted/40 animate-pulse" />
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 rounded-2xl bg-muted/40 animate-pulse" />
                    ))}
                </div>
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

    const color = colorFor(workspace.id);
    const boardCount = workspace.boards.length;

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
                <Link href="/" className="hover:text-foreground transition-colors">Dashboard</Link>
                <span className="text-muted-foreground/40">/</span>
                <span className="text-foreground font-medium truncate max-w-[200px]">{workspace.name}</span>
            </div>

            {/* Workspace hero header */}
            <div
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-6"
                style={{ borderTopColor: color, borderTopWidth: 3 }}
            >
                <div
                    className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full blur-3xl opacity-20"
                    style={{ backgroundColor: color }}
                />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4 min-w-0">
                        <span
                            className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-xl font-bold text-white"
                            style={{ backgroundColor: color }}
                        >
                            {workspace.name.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold text-foreground truncate">{workspace.name}</h1>
                            {workspace.description && (
                                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{workspace.description}</p>
                            )}
                            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                <KanbanSquare className="h-3.5 w-3.5" />
                                {boardCount} Board{boardCount !== 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="brand" size="sm">
                                    <Plus className="h-4 w-4" /> Buat Board
                                </Button>
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
                                        <Button type="submit" variant="brand" disabled={isCreating}>
                                            {isCreating ? "Membuat..." : "Buat Board"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={editWorkspaceDialog} onOpenChange={setEditWorkspaceDialog}>
                            <DialogContent className="bg-card border-border">
                                <form onSubmit={handleUpdateWorkspace}>
                                    <DialogHeader>
                                        <DialogTitle className="text-foreground">Edit Workspace</DialogTitle>
                                        <DialogDescription className="text-muted-foreground">
                                            Perbarui nama dan deskripsi workspace.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-ws-name" className="text-foreground">Nama Workspace</Label>
                                            <Input
                                                id="edit-ws-name"
                                                placeholder="Nama workspace"
                                                value={editWorkspace.name}
                                                onChange={(e) => setEditWorkspace({ ...editWorkspace, name: e.target.value })}
                                                required
                                                className="bg-background border-input text-foreground"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-ws-desc" className="text-foreground">Deskripsi (opsional)</Label>
                                            <Input
                                                id="edit-ws-desc"
                                                placeholder="Deskripsi singkat..."
                                                value={editWorkspace.description}
                                                onChange={(e) => setEditWorkspace({ ...editWorkspace, description: e.target.value })}
                                                className="bg-background border-input text-foreground"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="ghost" onClick={() => setEditWorkspaceDialog(false)}>Batal</Button>
                                        <Button type="submit" variant="brand" disabled={isUpdating}>
                                            {isUpdating ? "Menyimpan..." : "Simpan"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="outline" onClick={openEditWorkspace}>
                            <Pencil className="h-4 w-4" /> Edit
                        </Button>
                        <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => setDeleteWorkspaceDialog(true)}>
                            <Trash2 className="h-4 w-4" /> Hapus
                        </Button>
                    </div>
                </div>
            </div>

            {/* Analytics + Boards (full width, activity moved to topbar) */}
            <div className="space-y-8">
                <section>
                    <AnalyticsWidget workspaceId={workspaceId} />
                </section>

                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Boards</h2>

                    {workspace.boards.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border bg-card/40 py-16 text-center">
                            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                                <KanbanSquare className="h-7 w-7" />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold text-foreground">Belum ada board</h3>
                            <p className="mx-auto mt-2 mb-6 max-w-md text-sm text-muted-foreground">
                                Buat board Kanban pertama kamu untuk mulai melacak tugas dalam workspace ini.
                            </p>
                            <Button variant="brand" size="lg" onClick={() => setDialogOpen(true)}>
                                Buat Board Pertama
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {workspace.boards.map((board: Board) => (
                                <Link
                                    key={board.id}
                                    href={`/boards/${board.id}`}
                                    className="group relative block overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                            <KanbanSquare className="h-5 w-5" />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate font-semibold text-foreground transition-colors group-hover:text-primary">
                                                {board.name}
                                            </h3>
                                            <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                                                {board.description || "Tidak ada deskripsi"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-end">
                                        <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-primary">
                                            Buka Board <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>

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
