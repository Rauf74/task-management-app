"use client";

// ==============================================
// Activity Menu - global activity dropdown in topbar
// ==============================================

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { History } from "lucide-react";
import { workspaceApi, API_URL } from "@/lib/api";
import { ActivityItem, ActivityLog } from "@/components/dashboard/activity-item";

const MAX_ITEMS = 12;

export function ActivityMenu() {
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const wsRes = await workspaceApi.list();
                const ids = (wsRes?.data?.workspaces || []).map((w: { id: string }) => w.id);
                if (ids.length === 0) {
                    setIsLoading(false);
                    return;
                }
                const results = await Promise.all(
                    ids.map(async (id: string) => {
                        const res = await fetch(`${API_URL}/api/workspaces/${id}/activities`, {
                            credentials: "include",
                        });
                        if (!res.ok) return [];
                        const json = await res.json();
                        const wsName = json.data?.[0]?.workspaceName;
                        return (json.data || []).map((a: ActivityLog) => ({
                            ...a,
                            workspaceName: wsName,
                        }));
                    })
                );
                const merged = results
                    .flat()
                    .sort(
                        (a, b) =>
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                    .slice(0, MAX_ITEMS);
                setActivities(merged);
            } catch {
                // silent
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, []);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Aktivitas"
                    className="relative h-10 w-10 rounded-full"
                >
                    <History className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-[360px] max-w-[calc(100vw-2rem)] bg-card border-border p-0"
            >
                <div className="flex items-center gap-2 border-b border-border/40 px-4 py-3">
                    <History className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold tracking-tight text-foreground">
                        Aktivitas
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                        Semua workspace
                    </span>
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-3">
                    {isLoading ? (
                        <div className="space-y-4 py-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3 animate-pulse">
                                    <div className="h-9 w-9 rounded-full bg-muted/40" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3.5 w-2/3 rounded bg-muted/40" />
                                        <div className="h-3 w-1/2 rounded bg-muted/40" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                            <History className="h-7 w-7 mb-2 opacity-60" />
                            <p className="text-sm">Belum ada aktivitas tercatat</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {activities.map((log, i) => (
                                <ActivityItem
                                    key={log.id}
                                    log={log}
                                    isLast={i === activities.length - 1}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
