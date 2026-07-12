"use client";

// ==============================================
// Welcome Section - dynamic greeting + workspace count
// ==============================================

import { Workspace } from "@/lib/api";

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 11) return "Selamat pagi";
    if (hour < 15) return "Selamat siang";
    if (hour < 19) return "Selamat sore";
    return "Selamat malam";
}

export function WelcomeSection({
    userName,
    workspaces,
}: {
    userName: string;
    workspaces: Workspace[];
}) {
    const totalBoards = workspaces.reduce(
        (sum, ws) => sum + (ws._count?.boards || 0),
        0
    );

    return (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                    {getGreeting()}, {userName || "there"}!
                </h1>
                <p className="text-muted-foreground mt-1">
                    {workspaces.length} workspace
                    {workspaces.length !== 1 ? "s" : ""} dan {totalBoards} board
                    {totalBoards !== 1 ? "s" : ""} menunggu Anda.
                </p>
            </div>
        </div>
    );
}
