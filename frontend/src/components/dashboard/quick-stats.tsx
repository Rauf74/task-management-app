"use client";

// ==============================================
// Quick Stats - overview cards derived from workspace data
// ==============================================

import { Workspace } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { LayoutGrid, FolderKanban, Plus } from "lucide-react";

export function QuickStats({
    workspaces,
    onAddWorkspace,
}: {
    workspaces: Workspace[];
    onAddWorkspace: () => void;
}) {
    const totalWorkspaces = workspaces.length;
    const totalBoards = workspaces.reduce(
        (sum, ws) => sum + (ws._count?.boards || 0),
        0
    );

    const stats = [
        {
            label: "Workspaces",
            value: totalWorkspaces,
            icon: FolderKanban,
            accent: "text-sky-500 bg-sky-500/10",
        },
        {
            label: "Boards",
            value: totalBoards,
            icon: LayoutGrid,
            accent: "text-violet-500 bg-violet-500/10",
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
                <Card key={stat.label} className="glass-card border-border/50">
                    <CardContent className="flex items-center gap-4 p-4">
                        <div
                            className={`h-11 w-11 rounded-xl flex items-center justify-center ${stat.accent}`}
                        >
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-2xl font-bold text-foreground tabular-nums leading-none">
                                {stat.value}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.label}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <button
                type="button"
                onClick={onAddWorkspace}
                className="group flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 p-4 min-h-[68px]"
            >
                <Plus className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="text-sm font-medium">Buat Workspace</span>
            </button>
        </div>
    );
}
