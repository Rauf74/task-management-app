"use client";

// ==============================================
// Draggable Task Card Component
// ==============================================

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, isPast, isToday } from "date-fns";

interface TaskCardProps {
    task: Task;
    onDelete: (taskId: string) => void;
    onEdit?: (task: Task) => void;
}

export function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
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
        touchAction: "none" as const, // Required for mobile drag and drop
    };

    function handleCardClick() {
        // Only open edit if not dragging and onEdit is provided
        if (!isDragging && onEdit) {
            onEdit(task);
        }
    }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={`cursor-grab group transition-all duration-200 border border-border/60 bg-card hover:border-primary/40 hover:shadow-md ${isDragging ? "shadow-xl ring-2 ring-primary/20 rotate-2 scale-105 opacity-90 z-50" : "shadow-sm"
                }`}
            {...attributes}
            {...listeners}
        >
            <CardContent className="p-3" onClick={handleCardClick}>
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 cursor-pointer" onClick={handleCardClick}>
                        <p className="text-foreground text-sm font-medium leading-none mb-1.5">{task.title}</p>
                        {task.description && (
                            <p className="text-muted-foreground text-[10px] sm:text-xs line-clamp-2 leading-relaxed">
                                {task.description}
                            </p>
                        )}

                        {/* Labels */}
                        {task.labels && task.labels.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {task.labels.map((label) => (
                                    <div
                                        key={label.id}
                                        className="h-1.5 w-6 rounded-full"
                                        style={{ backgroundColor: label.color }}
                                        title={label.name}
                                    />
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-between gap-2 mt-2.5">
                            <div className="flex gap-2 items-center">
                                <span
                                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${task.priority === "URGENT"
                                        ? "bg-red-500/10 text-red-600 border-red-200 dark:border-red-900/30"
                                        : task.priority === "HIGH"
                                            ? "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-900/30"
                                            : task.priority === "MEDIUM"
                                                ? "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-900/30"
                                                : "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900/30"
                                        }`}
                                >
                                    {task.priority}
                                </span>

                                {task.dueDate && (
                                    <div
                                        className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
                                            ? "text-red-600 bg-red-500/10"
                                            : isToday(new Date(task.dueDate))
                                                ? "text-orange-600 bg-orange-500/10"
                                                : "text-muted-foreground"
                                            }`}
                                    >
                                        <CalendarIcon className="h-3 w-3" />
                                        {format(new Date(task.dueDate), "MMM d")}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive h-6 w-6 p-0 hover:bg-destructive/10 rounded-full"
                    >
                        ×
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
