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
}

export function KanbanColumn({ column, onDeleteColumn, onDeleteTask, onAddTask }: ColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
        data: { type: "column", column },
    });

    return (
        <div className="min-w-[300px] max-w-[300px]">
            <Card className={`border-slate-700 bg-slate-800 h-full transition-colors ${isOver ? "border-blue-500 bg-slate-750" : ""
                }`}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-sm font-medium">
                            {column.title}
                            <span className="ml-2 text-slate-400">({column.tasks.length})</span>
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteColumn(column.id)}
                            className="text-slate-400 hover:text-red-400 h-6 w-6 p-0"
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
                            />
                        ))}
                    </SortableContext>
                    <Button
                        variant="ghost"
                        className="w-full text-slate-400 hover:text-white hover:bg-slate-700"
                        onClick={() => onAddTask(column.id)}
                    >
                        + Tambah Task
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
