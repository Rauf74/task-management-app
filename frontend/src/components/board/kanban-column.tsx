"use client";

// ==============================================
// Droppable Column Component
// ==============================================

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Column as ColumnType, Task } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Check, Pencil } from "lucide-react";
import { TaskCard } from "./task-card";

interface ColumnProps {
    column: ColumnType;
    onDeleteColumn: (columnId: string) => void;
    onDeleteTask: (taskId: string) => void;
    onAddTask: (columnId: string) => void;
    onEditColumn: (columnId: string, title: string) => void;
    onEditTask?: (task: Task) => void;
}

export function KanbanColumn({
    column,
    onDeleteColumn,
    onDeleteTask,
    onAddTask,
    onEditColumn,
    onEditTask,
}: ColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
        data: { type: "column", column },
    });

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(column.title);

    function startEdit() {
        setTitle(column.title);
        setIsEditing(true);
    }

    function save() {
        const next = title.trim();
        if (next && next !== column.title) {
            onEditColumn(column.id, next);
        }
        setIsEditing(false);
    }

    return (
        <div className="w-full sm:min-w-[300px] sm:max-w-[300px] sm:snap-center">
            <Card className={`glass border-border/40 bg-secondary/40 h-full transition-colors ${isOver ? "border-primary/50 ring-2 ring-primary/20" : ""
                }`}>
                <CardHeader className="px-4 pt-4 pb-3 sticky top-0 z-10 rounded-t-lg bg-secondary/60 backdrop-blur-md border-b border-border/30">
                    <div className="flex items-center justify-between gap-2">
                        <CardTitle className="flex items-center gap-2 text-foreground text-sm font-semibold tracking-tight min-w-0 flex-1">
                            {isEditing ? (
                                <Input
                                    autoFocus
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onBlur={save}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") save();
                                        if (e.key === "Escape") setIsEditing(false);
                                    }}
                                    className="h-7 px-2 py-0 text-sm bg-background border-input"
                                />
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={startEdit}
                                        className="truncate text-left hover:text-primary transition-colors flex items-center gap-1.5 group/title"
                                        title="Klik untuk edit nama column"
                                    >
                                        <span className="truncate">{column.title}</span>
                                        <Pencil className="h-3 w-3 opacity-0 group-hover/title:opacity-60 transition-opacity" />
                                    </button>
                                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-background/70 text-muted-foreground text-xs font-medium">
                                        {column.tasks.length}
                                    </span>
                                </>
                            )}
                        </CardTitle>
                        <div className="flex items-center shrink-0 gap-1">
                            {isEditing && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={save}
                                    className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 h-6 w-6 p-0 rounded-full"
                                    aria-label="Simpan"
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDeleteColumn(column.id)}
                                className="text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 h-6 w-6 p-0 rounded-full transition-colors"
                                aria-label="Delete column"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent ref={setNodeRef} className="space-y-3 min-h-[100px] p-3 pt-0">
                    <SortableContext
                        items={column.tasks.map((t) => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {column.tasks.map((task: Task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onDelete={onDeleteTask}
                                onEdit={onEditTask}
                            />
                        ))}
                    </SortableContext>
                    <Button
                        variant="outline"
                        className="w-full text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 border-dashed transition-all rounded-lg h-10 font-medium"
                        onClick={() => onAddTask(column.id)}
                    >
                        + Tambah Task
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
