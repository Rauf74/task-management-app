"use client";

// ==============================================
// Dashboard Hero - bento greeting + stats panel
// ==============================================

import { Workspace } from "@/lib/api";
import { FolderKanban, LayoutGrid, Plus, TrendingUp } from "lucide-react";

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 11) return "Selamat pagi";
    if (hour < 15) return "Selamat siang";
    if (hour < 19) return "Selamat sore";
    return "Selamat malam";
}

export function DashboardHero({
    userName,
    workspaces,
    onAddWorkspace,
}: {
    userName: string;
    workspaces: Workspace[];
    onAddWorkspace: () => void;
}) {
    const totalWorkspaces = workspaces.length;
    const totalBoards = workspaces.reduce(
        (sum, ws) => sum + (ws._count?.boards || 0),
        0
    );

    return (
        <div className="grid gap-4 lg:grid-cols-3">
            {/* Greeting panel (spans 2 cols) - the focal hero */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 lg:col-span-2">
                {/* decorative glow */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-[var(--accent-brand)]/15 blur-3xl" />

                <div className="relative">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Ringkasan hari ini
                    </span>
                    <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        {getGreeting()}, {userName || "there"}!
                    </h1>
                    <p className="mt-2 max-w-md text-sm text-muted-foreground">
                        Kamu punya{" "}
                        <span className="font-semibold text-foreground">{totalWorkspaces}</span>{" "}
                        workspace dan{" "}
                        <span className="font-semibold text-foreground">{totalBoards}</span>{" "}
                        board aktif. Pilih salah satu dari sidebar atau buat yang baru.
                    </p>
                    <button
                        type="button"
                        onClick={onAddWorkspace}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[var(--accent-brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-[0.98]"
                    >
                        <Plus className="h-4 w-4" />
                        Buat Workspace
                    </button>
                </div>
            </div>

            {/* Stats stack */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                        <FolderKanban className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold leading-none tabular-nums text-foreground">
                            {totalWorkspaces}
                        </p>
                        <p className="mt-1.5 text-xs text-muted-foreground">Workspaces</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--accent-brand)]/10 accent-brand">
                        <LayoutGrid className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold leading-none tabular-nums text-foreground">
                            {totalBoards}
                        </p>
                        <p className="mt-1.5 text-xs text-muted-foreground">Boards</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
