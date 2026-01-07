"use client";

// ==============================================
// Board View Page - Kanban Board with Drag & Drop
// ==============================================

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
    DragOverlay,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { boardApi, columnApi, taskApi, BoardWithDetails, Column, Task } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { KanbanColumn } from "@/components/board/kanban-column";
import { TaskCard } from "@/components/board/task-card";

export default function BoardViewPage() {
    const params = useParams();
    const router = useRouter();
    const boardId = params.id as string;

    const [board, setBoard] = useState<BoardWithDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    // Dialog states
    const [columnDialogOpen, setColumnDialogOpen] = useState(false);
    const [taskDialogOpen, setTaskDialogOpen] = useState(false);
    const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
    const [newColumn, setNewColumn] = useState({ title: "" });
    const [newTask, setNewTask] = useState({ title: "", description: "" });
    const [isCreating, setIsCreating] = useState(false);

    // DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

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

    // Drag handlers
    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const taskId = active.id as string;

        for (const column of board?.columns || []) {
            const task = column.tasks.find((t) => t.id === taskId);
            if (task) {
                setActiveTask(task);
                break;
            }
        }
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over || !board) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        let sourceColumn: Column | null = null;
        let sourceTask: Task | null = null;
        for (const col of board.columns) {
            const task = col.tasks.find((t) => t.id === activeId);
            if (task) {
                sourceColumn = col;
                sourceTask = task;
                break;
            }
        }

        if (!sourceColumn || !sourceTask) return;

        let targetColumn: Column | null = null;
        for (const col of board.columns) {
            if (col.id === overId) {
                targetColumn = col;
                break;
            }
            const task = col.tasks.find((t) => t.id === overId);
            if (task) {
                targetColumn = col;
                break;
            }
        }

        if (!targetColumn || sourceColumn.id === targetColumn.id) return;

        setBoard((prev) => {
            if (!prev) return prev;

            const newColumns = prev.columns.map((col) => {
                if (col.id === sourceColumn!.id) {
                    return {
                        ...col,
                        tasks: col.tasks.filter((t) => t.id !== activeId),
                    };
                }
                if (col.id === targetColumn!.id) {
                    return {
                        ...col,
                        tasks: [...col.tasks, { ...sourceTask!, columnId: targetColumn!.id }],
                    };
                }
                return col;
            });

            return { ...prev, columns: newColumns };
        });
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveTask(null);

        if (!over || !board) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        let taskColumn: Column | null = null;
        let taskIndex = -1;
        for (const col of board.columns) {
            const idx = col.tasks.findIndex((t) => t.id === activeId);
            if (idx !== -1) {
                taskColumn = col;
                taskIndex = idx;
                break;
            }
        }

        if (!taskColumn) return;

        const overTaskIndex = taskColumn.tasks.findIndex((t) => t.id === overId);
        if (overTaskIndex !== -1 && overTaskIndex !== taskIndex) {
            setBoard((prev) => {
                if (!prev) return prev;

                const newColumns = prev.columns.map((col) => {
                    if (col.id === taskColumn!.id) {
                        const newTasks = arrayMove(col.tasks, taskIndex, overTaskIndex);
                        return { ...col, tasks: newTasks };
                    }
                    return col;
                });

                return { ...prev, columns: newColumns };
            });
        }

        try {
            await taskApi.move(activeId, {
                columnId: taskColumn.id,
                order: taskIndex,
            });
        } catch (error) {
            toast.error("Gagal memindahkan task");
            loadBoard();
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

    async function handleDeleteTask(taskId: string) {
        try {
            await taskApi.delete(taskId);
            setBoard((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    columns: prev.columns.map((col) => ({
                        ...col,
                        tasks: col.tasks.filter((t) => t.id !== taskId),
                    })),
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
                <div className="text-muted-foreground">Memuat board...</div>
            </div>
        );
    }

    if (!board) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-muted-foreground mb-4">Board tidak ditemukan</p>
                <Button onClick={() => router.push("/")}>Kembali ke Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Link href="/" className="hover:text-foreground">Dashboard</Link>
                        <span>/</span>
                        <Link href={`/workspaces/${board.workspaceId}`} className="hover:text-foreground">Workspace</Link>
                        <span>/</span>
                        <span className="text-foreground">{board.name}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">{board.name}</h1>
                </div>
                <Dialog open={columnDialogOpen} onOpenChange={setColumnDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>+ Tambah Column</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border">
                        <form onSubmit={handleCreateColumn}>
                            <DialogHeader>
                                <DialogTitle className="text-foreground">Tambah Column</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-foreground">Nama Column</Label>
                                    <Input
                                        id="title"
                                        placeholder="Contoh: To Do, In Progress, Done"
                                        value={newColumn.title}
                                        onChange={(e) => setNewColumn({ title: e.target.value })}
                                        required
                                        className="bg-background border-input text-foreground"
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

            {/* Kanban Board with DnD */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {board.columns.length === 0 ? (
                        <Card className="border-border bg-card/50 min-w-[300px]">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <p className="text-muted-foreground mb-4">Belum ada column</p>
                                <Button onClick={() => setColumnDialogOpen(true)}>Buat Column Pertama</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        board.columns.map((column: Column) => (
                            <KanbanColumn
                                key={column.id}
                                column={column}
                                onDeleteColumn={handleDeleteColumn}
                                onDeleteTask={handleDeleteTask}
                                onAddTask={openTaskDialog}
                            />
                        ))
                    )}
                </div>

                {/* Drag Overlay */}
                <DragOverlay>
                    {activeTask ? (
                        <div className="opacity-80">
                            <TaskCard task={activeTask} onDelete={() => { }} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Task Dialog */}
            <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
                <DialogContent className="bg-card border-border">
                    <form onSubmit={handleCreateTask}>
                        <DialogHeader>
                            <DialogTitle className="text-foreground">Tambah Task</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="taskTitle" className="text-foreground">Judul Task</Label>
                                <Input
                                    id="taskTitle"
                                    placeholder="Apa yang perlu dikerjakan?"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    required
                                    className="bg-background border-input text-foreground"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="taskDescription" className="text-foreground">Deskripsi (opsional)</Label>
                                <Input
                                    id="taskDescription"
                                    placeholder="Detail tambahan..."
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    className="bg-background border-input text-foreground"
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
