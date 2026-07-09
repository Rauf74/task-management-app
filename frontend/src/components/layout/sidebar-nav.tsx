"use client";

// ==============================================
// App Sidebar - Desktop navigation + workspace switcher
// ==============================================

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { workspaceApi, Workspace } from "@/lib/api";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderKanban, Plus, Sparkles } from "lucide-react";

interface SidebarNavProps {
    onNavigate?: () => void;
}

const WS_COLORS = [
    "#059669", "#7C3AED", "#F97316", "#0EA5E9", "#EC4899", "#F59E0B",
];

function colorFor(id: string) {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    return WS_COLORS[h % WS_COLORS.length];
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
    const pathname = usePathname();
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

    useEffect(() => {
        workspaceApi
            .list()
            .then((res) => {
                if (res?.data?.workspaces) setWorkspaces(res.data.workspaces);
            })
            .catch(() => {});
    }, []);

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <nav className="flex h-full flex-col gap-6 p-4">
            {/* Brand */}
            <Link
                href="/"
                onClick={onNavigate}
                className="flex items-center gap-2 px-2 pt-1"
            >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                </span>
                <span className="text-lg font-bold tracking-tight text-foreground">TaskScale</span>
            </Link>

            {/* Main nav */}
            <div className="space-y-1">
                <p className="px-2 mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Menu
                </p>
                <Link
                    href="/"
                    onClick={onNavigate}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive("/")
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                </Link>
            </div>

            {/* Workspaces */}
            <div className="flex-1 min-h-0 space-y-1 overflow-y-auto">
                <div className="flex items-center justify-between px-2 mb-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                        Workspaces
                    </p>
                    <span className="text-[11px] text-muted-foreground/60">{workspaces.length}</span>
                </div>

                {workspaces.length === 0 ? (
                    <p className="px-3 py-2 text-xs text-muted-foreground/60">Belum ada workspace</p>
                ) : (
                    workspaces.map((ws) => {
                        const href = `/workspaces/${ws.id}`;
                        const active = isActive(href);
                        const color = colorFor(ws.id);
                        return (
                            <Link
                                key={ws.id}
                                href={href}
                                onClick={onNavigate}
                                className={cn(
                                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                                    active
                                        ? "bg-muted text-foreground font-medium"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <span
                                    className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-[11px] font-bold text-white"
                                    style={{ backgroundColor: color }}
                                >
                                    {ws.name.charAt(0).toUpperCase()}
                                </span>
                                <span className="truncate">{ws.name}</span>
                                <span className="ml-auto shrink-0 text-[11px] text-muted-foreground/50">
                                    {ws._count?.boards ?? 0}
                                </span>
                            </Link>
                        );
                    })
                )}
            </div>

            {/* Footer hint */}
            <Link
                href="/"
                onClick={onNavigate}
                className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
                <Plus className="h-4 w-4" />
                Workspace baru
            </Link>
        </nav>
    );
}
