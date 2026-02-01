"use client";

// ==============================================
// Edit Task Dialog Component
// ==============================================

import { useState, useEffect } from "react";
import { Task } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LabelSelector } from "./label-selector";
import { DatePicker } from "./date-picker";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface EditTaskDialogProps {
    task: Task | null;
    workspaceId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (taskId: string, data: { title: string; description: string; priority: string; dueDate?: string; labelIds?: string[] }) => Promise<void>;
}

export function EditTaskDialog({ task, workspaceId, open, onOpenChange, onSave }: EditTaskDialogProps) {
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        priority: string;
        dueDate?: Date;
        labelIds: string[];
    }>({
        title: "",
        description: "",
        priority: "LOW",
        labelIds: [],
    });
    const [isSaving, setIsSaving] = useState(false);

    // Sync form data when task changes
    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || "",
                priority: task.priority,
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
                labelIds: task.labels?.map(l => l.id) || [],
            });
        }
    }, [task]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!task || !formData.title.trim()) return;

        setIsSaving(true);
        try {
            await onSave(task.id, {
                ...formData,
                dueDate: formData.dueDate?.toISOString(),
            });
            onOpenChange(false);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Edit Task</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="editTitle" className="text-foreground">Judul Task</Label>
                            <Input
                                id="editTitle"
                                placeholder="Judul task..."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="bg-background border-input text-foreground"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="editDescription" className="text-foreground">Deskripsi</Label>
                            <Input
                                id="editDescription"
                                placeholder="Deskripsi task..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="bg-background border-input text-foreground"
                            />
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                            <Label htmlFor="editPriority" className="text-foreground">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) => setFormData({ ...formData, priority: value })}
                            >
                                <SelectTrigger className="bg-background border-input text-foreground">
                                    <SelectValue placeholder="Pilih priority" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border">
                                    <SelectItem value="LOW">Low</SelectItem>
                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                    <SelectItem value="HIGH">High</SelectItem>
                                    <SelectItem value="URGENT">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Labels */}
                        <div className="space-y-2">
                            <Label className="text-foreground">Labels</Label>
                            <LabelSelector
                                workspaceId={workspaceId}
                                selectedLabelIds={formData.labelIds}
                                onSelect={(id) => setFormData({ ...formData, labelIds: [...formData.labelIds, id] })}
                                onDeselect={(id) => setFormData({ ...formData, labelIds: formData.labelIds.filter(lid => lid !== id) })}
                            />
                        </div>

                        {/* Due Date */}
                        <div className="space-y-2">
                            <Label className="text-foreground">Due Date</Label>
                            <DatePicker
                                date={formData.dueDate}
                                setDate={(date) => setFormData({ ...formData, dueDate: date })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
