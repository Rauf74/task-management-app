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
            <Card className={`border-border bg-card h-full transition-colors ${isOver ? "border-primary bg-accent" : ""
                }`}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-foreground text-sm font-medium">
                            {column.title}
                            <span className="ml-2 text-muted-foreground">({column.tasks.length})</span>
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteColumn(column.id)}
                            className="text-muted-foreground hover:text-destructive h-6 w-6 p-0"
                        >
                            ×
                        </Button>
                    </div>
                </CardHeader>
                <CardContent ref={setNodeRef} className="space-y-2 min-h-[100px]">
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
                        className="w-full text-muted-foreground hover:text-foreground hover:bg-accent"
                        onClick={() => onAddTask(column.id)}
                    >
                        + Tambah Task
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
