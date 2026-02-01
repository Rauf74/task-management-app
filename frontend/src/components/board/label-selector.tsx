"use client";

import { useEffect, useState } from "react";
import { Label, labelApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Plus, Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface LabelSelectorProps {
    workspaceId: string;
    selectedLabelIds: string[];
    onSelect: (labelId: string) => void;
    onDeselect: (labelId: string) => void;
}

const PRESET_COLORS = [
    "#ef4444", "#f97316", "#f59e0b", "#10b981",
    "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6",
    "#d946ef", "#f43f5e", "#71717a"
];

export function LabelSelector({ workspaceId, selectedLabelIds, onSelect, onDeselect }: LabelSelectorProps) {
    const [labels, setLabels] = useState<Label[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newLabel, setNewLabel] = useState({ name: "", color: PRESET_COLORS[0] });

    useEffect(() => {
        loadLabels();
    }, [workspaceId]);

    async function loadLabels() {
        try {
            const response = await labelApi.list(workspaceId);
            if (response.success) {
                setLabels(response.data.labels);
            }
        } catch (err) {
            console.error("Failed to load labels", err);
        }
    }

    async function handleCreateLabel() {
        if (!newLabel.name.trim()) return;
        setIsLoading(true);
        try {
            const response = await labelApi.create(workspaceId, newLabel);
            if (response.success) {
                setLabels([...labels, response.data.label]);
                setNewLabel({ ...newLabel, name: "" });
                setIsCreating(false);
                toast.success("Label dibuat");
            }
        } catch (err) {
            toast.error("Gagal membuat label");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDeleteLabel(id: string) {
        try {
            await labelApi.delete(id);
            setLabels(labels.filter(l => l.id !== id));
            onDeselect(id);
            toast.success("Label dihapus");
        } catch (err) {
            toast.error("Gagal menghapus label");
        }
    }

    const selectedLabels = labels.filter(l => selectedLabelIds.includes(l.id));

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
                {selectedLabels.map(label => (
                    <Badge
                        key={label.id}
                        style={{ backgroundColor: label.color }}
                        className="text-white border-none flex items-center gap-1 pr-1"
                    >
                        {label.name}
                        <X
                            className="h-3 w-3 cursor-pointer hover:bg-black/20 rounded-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeselect(label.id);
                            }}
                        />
                    </Badge>
                ))}
            </div>

            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 border-dashed">
                        <Plus className="h-4 w-4 mr-1" />
                        Label
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 bg-card border-border shadow-xl">
                    <div className="space-y-3">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                            Pilih Label
                        </div>

                        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                            {labels.length === 0 && !isCreating && (
                                <div className="text-[10px] text-muted-foreground text-center py-2">
                                    Belum ada label
                                </div>
                            )}
                            {labels.map(label => {
                                const isSelected = selectedLabelIds.includes(label.id);
                                return (
                                    <div
                                        key={label.id}
                                        className="flex items-center justify-between group px-1"
                                    >
                                        <div
                                            className={`flex-1 flex items-center gap-2 p-1.5 rounded-md cursor-pointer transition-colors ${isSelected ? "bg-primary/10" : "hover:bg-secondary"
                                                }`}
                                            onClick={() => isSelected ? onDeselect(label.id) : onSelect(label.id)}
                                        >
                                            <div
                                                className="h-3 w-3 rounded-full shrink-0"
                                                style={{ backgroundColor: label.color }}
                                            />
                                            <span className="text-xs truncate">{label.name}</span>
                                            {isSelected && <Check className="h-3 w-3 ml-auto text-primary" />}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                                            onClick={() => handleDeleteLabel(label.id)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>

                        {!isCreating ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full h-8 text-xs justify-start px-2 font-normal"
                                onClick={() => setIsCreating(true)}
                            >
                                <Plus className="h-3 w-3 mr-2" />
                                Buat label baru
                            </Button>
                        ) : (
                            <div className="space-y-2 pt-1 border-t border-border mt-1">
                                <Input
                                    placeholder="Nama label..."
                                    className="h-8 text-xs bg-background"
                                    value={newLabel.name}
                                    onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
                                    autoFocus
                                />
                                <div className="flex flex-wrap gap-1.5">
                                    {PRESET_COLORS.map(color => (
                                        <div
                                            key={color}
                                            className={`h-5 w-5 rounded-full cursor-pointer border-2 transition-transform hover:scale-110 ${newLabel.color === color ? "border-primary" : "border-transparent"
                                                }`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setNewLabel({ ...newLabel, color })}
                                        />
                                    ))}
                                </div>
                                <div className="flex gap-2 justify-end pt-1">
                                    <Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => setIsCreating(false)}>Batal</Button>
                                    <Button size="sm" className="h-7 text-[10px]" onClick={handleCreateLabel} disabled={isLoading}>
                                        {isLoading ? "..." : "Simpan"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
