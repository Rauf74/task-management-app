"use client";

// ==============================================
// Global Activity - aggregates activity across all user workspaces
// ==============================================

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { API_URL } from "@/lib/api";
import { ActivityItem, ActivityLog } from "./activity-item";

const MAX_ITEMS = 10;

export function GlobalActivity({ workspaceIds }: { workspaceIds: string[] }) {
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (workspaceIds.length === 0) {
            setIsLoading(false);
            return;
        }

        async function fetchAll() {
            try {
                const results = await Promise.all(
                    workspaceIds.map(async (id) => {
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
                // silent - activity feed is non-critical
            } finally {
                setIsLoading(false);
            }
        }

        fetchAll();
    }, [workspaceIds]);

    if (isLoading) {
        return (
            <Card className="rounded-2xl border-border bg-card">
                <CardHeader className="flex flex-row items-center gap-2 space-y-0 border-b border-border/40 pb-3">
                    <Activity className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
                        Aktivitas Global
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="space-y-4">
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
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="rounded-2xl border-border bg-card">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 border-b border-border/40 pb-3">
                <Activity className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
                    Aktivitas Global
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="p-4">
                    {activities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                            <Activity className="h-7 w-7 mb-2 opacity-60" />
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
            </CardContent>
        </Card>
    );
}
