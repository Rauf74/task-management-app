"use client";

// ==============================================
// Draggable Task Card Component
// ==============================================

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, GripVertical, X } from "lucide-react";
import { format, isPast, isToday } from "date-fns";

interface TaskCardProps {
    task: Task;
    onDelete: (taskId: string) => void;
    onEdit?: (task: Task) => void;
}

const PRIORITY = {
    URGENT: { strip: "accent-strip-urgent", badge: "badge-urgent", label: "Urgent" },
    HIGH: { strip: "accent-strip-high", badge: "badge-high", label: "High" },
    MEDIUM: { strip: "accent-strip-medium", badge: "badge-medium", label: "Medium" },
    LOW: { strip: "accent-strip-low", badge: "badge-low", label: "Low" },
} as const;

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
        touchAction: "none" as const,
    };

    const p = PRIORITY[task.priority] ?? PRIORITY.MEDIUM;

    function handleCardClick() {
        if (!isDragging && onEdit) onEdit(task);
    }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={`group relative overflow-hidden cursor-grab transition-all duration-200 ease-out border border-border/70 bg-card
                hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg
                active:scale-[0.985] active:shadow-inner
                ${isDragging ? "shadow-xl ring-2 ring-primary/30 rotate-1 scale-[1.02] z-50 opacity-95" : "shadow-sm"}`}
            {...attributes}
        >
            {/* Priority accent strip (left) */}
            <span
                className={`absolute left-0 top-0 h-full w-1 ${p.strip} opacity-60 transition-opacity duration-200 group-hover:opacity-100`}
                aria-hidden
            />

            <CardContent className="p-3.5 pl-4" onClick={handleCardClick}>
                <div className="flex items-start gap-2.5">
                    {/* Drag handle */}
                    <button
                        type="button"
                        aria-label="Drag task"
                        className="mt-0.5 shrink-0 cursor-grab text-muted-foreground/50 hover:text-primary transition-colors active:cursor-grabbing touch-none"
                        {...attributes}
                        {...listeners}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GripVertical className="h-4 w-4" />
                    </button>

                    <div className="flex-1 min-w-0 cursor-pointer" onClick={handleCardClick}>
                        <p className="text-foreground text-sm font-semibold leading-snug mb-1.5 line-clamp-2">
                            {task.title}
                        </p>

                        {task.description && (
                            <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-2">
                                {task.description}
                            </p>
                        )}

                        {/* Labels */}
                        {task.labels && task.labels.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2.5">
                                {task.labels.map((label) => (
                                    <span
                                        key={label.id}
                                        className="h-1.5 w-7 rounded-full"
                                        style={{ backgroundColor: label.color }}
                                        title={label.name}
                                    />
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${p.badge}`}
                                >
                                    {p.label}
                                </span>

                                {task.dueDate && (
                                    <span
                                        className={`flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-md ${
                                            isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
                                                ? "text-red-600 bg-red-500/10"
                                                : isToday(new Date(task.dueDate))
                                                ? "text-orange-600 bg-orange-500/10"
                                                : "text-muted-foreground"
                                        }`}
                                    >
                                        <CalendarIcon className="h-3 w-3" />
                                        {format(new Date(task.dueDate), "MMM d")}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Delete */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task.id);
                        }}
                        className="shrink-0 h-7 w-7 rounded-full text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-70 sm:opacity-0 sm:group-hover:opacity-100"
                        aria-label="Delete task"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
