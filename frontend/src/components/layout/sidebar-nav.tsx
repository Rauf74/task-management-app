"use client";

// ==============================================
// App Sidebar - Desktop navigation + workspace switcher
// Compact (icon-only) / Normal modes, desktop only
// ==============================================

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { workspaceApi, Workspace } from "@/lib/api";
import { cn, colorFor } from "@/lib/utils";
import {
    LayoutDashboard,
    Plus,
    Sparkles,
    PanelLeftClose,
    PanelLeftOpen,
    Settings,
} from "lucide-react";

interface SidebarNavProps {
    collapsed?: boolean;
    onToggleCollapse?: () => void;
    onNavigate?: () => void;
}

export function SidebarNav({ collapsed = false, onToggleCollapse, onNavigate }: SidebarNavProps) {
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
        <nav className={cn("flex h-full flex-col gap-4 p-3", !collapsed && "p-4 gap-6")}>
            {/* Brand + toggle */}
            <div className={cn("flex items-center", collapsed ? "flex-col gap-3" : "justify-between px-2 pt-1")}>
                <Link
                    href="/"
                    onClick={onNavigate}
                    className={cn(
                        "flex items-center gap-2 rounded-lg",
                        collapsed ? "justify-center" : ""
                    )}
                    title="TaskScale"
                >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                        <Sparkles className="h-4 w-4" />
                    </span>
                    {!collapsed && (
                        <span className="text-lg font-bold tracking-tight text-foreground">TaskScale</span>
                    )}
                </Link>
                {!collapsed && (
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        aria-label="Ciutkan sidebar"
                        className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <PanelLeftClose className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Main nav */}
            <div className="space-y-1">
                {!collapsed && (
                    <p className="px-2 mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                        Menu
                    </p>
                )}
                <Link
                    href="/"
                    onClick={onNavigate}
                    title="Dashboard"
                    className={cn(
                        "flex items-center gap-3 rounded-lg transition-colors",
                        collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2 text-sm font-medium",
                        isActive("/")
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                >
                    <LayoutDashboard className="h-4 w-4 shrink-0" />
                    {!collapsed && "Dashboard"}
                </Link>
                <Link
                    href="/settings"
                    onClick={onNavigate}
                    title="Pengaturan"
                    className={cn(
                        "flex items-center gap-3 rounded-lg transition-colors",
                        collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2 text-sm font-medium",
                        isActive("/settings")
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                >
                    <Settings className="h-4 w-4 shrink-0" />
                    {!collapsed && "Pengaturan"}
                </Link>
            </div>

            {/* Workspaces */}
            <div className={cn("flex-1 min-h-0 space-y-1 overflow-y-auto", collapsed && "flex flex-col items-center")}>
                {!collapsed && (
                    <div className="flex items-center justify-between px-2 mb-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                            Workspaces
                        </p>
                        <span className="text-[11px] text-muted-foreground/60">{workspaces.length}</span>
                    </div>
                )}

                {workspaces.length === 0 ? (
                    collapsed ? null : (
                        <p className="px-3 py-2 text-xs text-muted-foreground/60">Belum ada workspace</p>
                    )
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
                                title={ws.name}
                                className={cn(
                                    "group flex items-center gap-3 rounded-lg transition-colors",
                                    collapsed ? "justify-center px-0 py-2" : "px-3 py-2 text-sm",
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
                                {!collapsed && (
                                    <>
                                        <span className="truncate">{ws.name}</span>
                                        <span className="ml-auto shrink-0 text-[11px] text-muted-foreground/50">
                                            {ws._count?.boards ?? 0}
                                        </span>
                                    </>
                                )}
                            </Link>
                        );
                    })
                )}
            </div>

            {/* Footer: compact toggle + new workspace */}
            <div className={cn("space-y-1", collapsed && "flex flex-col items-center")}>
                {collapsed ? (
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        aria-label="Buka sidebar"
                        title="Buka sidebar"
                        className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <PanelLeftOpen className="h-4 w-4" />
                    </button>
                ) : (
                    <Link
                        href="/?new-workspace=true"
                        onClick={onNavigate}
                        className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                    >
                        <Plus className="h-4 w-4" />
                        Workspace baru
                    </Link>
                )}
            </div>
        </nav>
    );
}
