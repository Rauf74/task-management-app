"use client";

// ==============================================
// Droppable Column Component
// ==============================================

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Column as ColumnType, Task } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
        <div className="w-full sm:min-w-[300px] sm:max-w-[300px]">
            <Card className={`glass border-border/40 bg-secondary/40 h-full transition-colors ${isOver ? "border-primary/50 ring-2 ring-primary/20" : ""
                }`}>
                <CardHeader className="pb-3 sticky top-0 bg-inherit z-10 rounded-t-lg backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-foreground text-sm font-semibold tracking-tight">
                            {column.title}
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-background/50 text-muted-foreground text-xs shadow-sm">
                                {column.tasks.length}
                            </span>
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteColumn(column.id)}
                            className="text-muted-foreground hover:text-destructive h-6 w-6 p-0 hover:bg-destructive/10 rounded-full transition-colors"
                        >
                            ×
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
                        variant="ghost"
                        className="w-full text-muted-foreground hover:text-primary hover:bg-primary/5 border border-dashed border-border/50 hover:border-primary/50 transition-all rounded-lg h-9"
                        onClick={() => onAddTask(column.id)}
                    >
                        + Tambah Task
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
