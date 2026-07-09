"use client";

// ==============================================
// Droppable Column Component
// ==============================================

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Column as ColumnType, Task } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TaskCard } from "./task-card";

interface ColumnProps {
    column: ColumnType;
    onDeleteColumn: (columnId: string) => void;
    onDeleteTask: (taskId: string) => void;
    onAddTask: (columnId: string) => void;
    onEditTask?: (task: Task) => void;
}

export function KanbanColumn({ column, onDeleteColumn, onDeleteTask, onAddTask, onEditTask }: ColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
        data: { type: "column", column },
    });

    return (
        <div className="w-full sm:min-w-[300px] sm:max-w-[300px] sm:snap-center">
            <Card className={`glass border-border/40 bg-secondary/40 h-full transition-colors ${isOver ? "border-primary/50 ring-2 ring-primary/20" : ""
                }`}>
                <CardHeader className="px-4 pt-4 pb-3 sticky top-0 z-10 rounded-t-lg bg-secondary/60 backdrop-blur-md border-b border-border/30">
                    <div className="flex items-center justify-between gap-2">
                        <CardTitle className="flex items-center gap-2 text-foreground text-sm font-semibold tracking-tight min-w-0">
                            <span className="truncate">{column.title}</span>
                            <span className="shrink-0 px-2 py-0.5 rounded-full bg-background/70 text-muted-foreground text-xs font-medium">
                                {column.tasks.length}
                            </span>
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteColumn(column.id)}
                            className="shrink-0 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 h-6 w-6 p-0 rounded-full transition-colors"
                            aria-label="Delete column"
                        >
                            <X className="h-4 w-4" />
                        </Button>
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
