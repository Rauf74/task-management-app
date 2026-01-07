"use client";

// ==============================================
// Draggable Task Card Component
// ==============================================

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
    task: Task;
    onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={`border-border bg-secondary cursor-grab hover:bg-accent ${isDragging ? "shadow-lg" : ""
                }`}
            {...attributes}
            {...listeners}
        >
            <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <p className="text-foreground text-sm font-medium">{task.title}</p>
                        {task.description && (
                            <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                                {task.description}
                            </p>
                        )}
                        <div className="flex gap-2 mt-2">
                            <span
                                className={`text-xs px-2 py-0.5 rounded ${task.priority === "URGENT"
                                    ? "bg-red-500/20 text-red-600 dark:text-red-400"
                                    : task.priority === "HIGH"
                                        ? "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                                        : task.priority === "MEDIUM"
                                            ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                                            : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                    }`}
                            >
                                {task.priority}
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task.id);
                        }}
                        className="text-muted-foreground hover:text-destructive h-5 w-5 p-0"
                    >
                        ×
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
