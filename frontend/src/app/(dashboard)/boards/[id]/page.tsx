"use client";

// ==============================================
// Board View Page - Kanban Board
// ==============================================

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { boardApi, columnApi, taskApi, BoardWithDetails, Column, Task } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function BoardViewPage() {
    const params = useParams();
    const router = useRouter();
    const boardId = params.id as string;

    const [board, setBoard] = useState<BoardWithDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Dialog states
    const [columnDialogOpen, setColumnDialogOpen] = useState(false);
    const [taskDialogOpen, setTaskDialogOpen] = useState(false);
    const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
    const [newColumn, setNewColumn] = useState({ title: "" });
    const [newTask, setNewTask] = useState({ title: "", description: "" });
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        loadBoard();
    }, [boardId]);

    async function loadBoard() {
        try {
            const response = await boardApi.get(boardId);
            if (response?.data?.board) {
                setBoard(response.data.board);
            }
        } catch (error) {
            toast.error("Gagal memuat board");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCreateColumn(e: React.FormEvent) {
        e.preventDefault();
        if (!newColumn.title.trim()) return;

        setIsCreating(true);
        try {
            const response = await columnApi.create(boardId, newColumn);
            if (response?.data?.column) {
                setBoard((prev) =>
                    prev ? { ...prev, columns: [...prev.columns, { ...response.data.column, tasks: [] }] } : prev
                );
                setNewColumn({ title: "" });
                setColumnDialogOpen(false);
                toast.success("Column berhasil dibuat!");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Gagal membuat column");
        } finally {
            setIsCreating(false);
        }
    }

    async function handleCreateTask(e: React.FormEvent) {
        e.preventDefault();
        if (!newTask.title.trim() || !selectedColumnId) return;

        setIsCreating(true);
        try {
            const response = await taskApi.create(selectedColumnId, newTask);
            if (response?.data?.task) {
                setBoard((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        columns: prev.columns.map((col) =>
                            col.id === selectedColumnId
                                ? { ...col, tasks: [...col.tasks, response.data.task] }
                                : col
                        ),
                    };
                });
                setNewTask({ title: "", description: "" });
                setTaskDialogOpen(false);
                toast.success("Task berhasil dibuat!");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Gagal membuat task");
        } finally {
            setIsCreating(false);
        }
    }

    async function handleDeleteColumn(columnId: string) {
        if (!confirm("Yakin ingin menghapus column ini?")) return;

        try {
            await columnApi.delete(columnId);
            setBoard((prev) =>
                prev ? { ...prev, columns: prev.columns.filter((c) => c.id !== columnId) } : prev
            );
            toast.success("Column berhasil dihapus");
        } catch (error) {
            toast.error("Gagal menghapus column");
        }
    }

    async function handleDeleteTask(taskId: string, columnId: string) {
        try {
            await taskApi.delete(taskId);
            setBoard((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    columns: prev.columns.map((col) =>
                        col.id === columnId
                            ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
                            : col
                    ),
                };
            });
            toast.success("Task berhasil dihapus");
        } catch (error) {
            toast.error("Gagal menghapus task");
        }
    }

    function openTaskDialog(columnId: string) {
        setSelectedColumnId(columnId);
        setTaskDialogOpen(true);
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Memuat board...</div>
            </div>
        );
    }

    if (!board) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-slate-400 mb-4">Board tidak ditemukan</p>
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
                        <Link href={`/workspaces/${board.workspaceId}`} className="hover:text-white">Workspace</Link>
                        <span>/</span>
                        <span className="text-white">{board.name}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">{board.name}</h1>
                </div>
                <Dialog open={columnDialogOpen} onOpenChange={setColumnDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>+ Tambah Column</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700">
                        <form onSubmit={handleCreateColumn}>
                            <DialogHeader>
                                <DialogTitle className="text-white">Tambah Column</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-slate-200">Nama Column</Label>
                                    <Input
                                        id="title"
                                        placeholder="Contoh: To Do, In Progress, Done"
                                        value={newColumn.title}
                                        onChange={(e) => setNewColumn({ title: e.target.value })}
                                        required
                                        className="bg-slate-900 border-slate-600 text-white"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isCreating}>
                                    {isCreating ? "Membuat..." : "Buat Column"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Kanban Board */}
            <div className="flex gap-4 overflow-x-auto pb-4">
                {board.columns.length === 0 ? (
                    <Card className="border-slate-700 bg-slate-800/50 min-w-[300px]">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <p className="text-slate-400 mb-4">Belum ada column</p>
                            <Button onClick={() => setColumnDialogOpen(true)}>Buat Column Pertama</Button>
                        </CardContent>
                    </Card>
                ) : (
                    board.columns.map((column: Column) => (
                        <div key={column.id} className="min-w-[300px] max-w-[300px]">
                            <Card className="border-slate-700 bg-slate-800 h-full">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-white text-sm font-medium">
                                            {column.title}
                                            <span className="ml-2 text-slate-400">({column.tasks.length})</span>
                                        </CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteColumn(column.id)}
                                            className="text-slate-400 hover:text-red-400 h-6 w-6 p-0"
                                        >
                                            ×
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {column.tasks.map((task: Task) => (
                                        <Card key={task.id} className="border-slate-600 bg-slate-700 cursor-pointer hover:bg-slate-650">
                                            <CardContent className="p-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <p className="text-white text-sm font-medium">{task.title}</p>
                                                        {task.description && (
                                                            <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                                                                {task.description}
                                                            </p>
                                                        )}
                                                        <div className="flex gap-2 mt-2">
                                                            <span className={`text-xs px-2 py-0.5 rounded ${task.priority === "URGENT" ? "bg-red-500/20 text-red-400" :
                                                                    task.priority === "HIGH" ? "bg-orange-500/20 text-orange-400" :
                                                                        task.priority === "MEDIUM" ? "bg-yellow-500/20 text-yellow-400" :
                                                                            "bg-blue-500/20 text-blue-400"
                                                                }`}>
                                                                {task.priority}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteTask(task.id, column.id)}
                                                        className="text-slate-400 hover:text-red-400 h-5 w-5 p-0"
                                                    >
                                                        ×
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    <Button
                                        variant="ghost"
                                        className="w-full text-slate-400 hover:text-white hover:bg-slate-700"
                                        onClick={() => openTaskDialog(column.id)}
                                    >
                                        + Tambah Task
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    ))
                )}
            </div>

            {/* Task Dialog */}
            <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
                <DialogContent className="bg-slate-800 border-slate-700">
                    <form onSubmit={handleCreateTask}>
                        <DialogHeader>
                            <DialogTitle className="text-white">Tambah Task</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="taskTitle" className="text-slate-200">Judul Task</Label>
                                <Input
                                    id="taskTitle"
                                    placeholder="Apa yang perlu dikerjakan?"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    required
                                    className="bg-slate-900 border-slate-600 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="taskDescription" className="text-slate-200">Deskripsi (opsional)</Label>
                                <Input
                                    id="taskDescription"
                                    placeholder="Detail tambahan..."
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    className="bg-slate-900 border-slate-600 text-white"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isCreating}>
                                {isCreating ? "Membuat..." : "Buat Task"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
