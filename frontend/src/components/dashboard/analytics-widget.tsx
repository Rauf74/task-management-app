"use client";

// ==============================================
// Analytics Widget - Task Priority + Task Status
// Compact, proportional bars (no oversized charts)
// ==============================================

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_URL } from "@/lib/api";

const PRIORITY_META = [
    { key: "URGENT", label: "Urgent", color: "#DC2626" },
    { key: "HIGH", label: "High", color: "#F97316" },
    { key: "MEDIUM", label: "Medium", color: "#F59E0B" },
    { key: "LOW", label: "Low", color: "#10B981" },
] as const;

function statusColor(name: string): string {
    const n = name.toLowerCase();
    if (/(done|selesai|complete)/.test(n)) return "#10B981";
    if (/(progress|doing|active)/.test(n)) return "#7C3AED";
    if (/(todo|backlog|queue)/.test(n)) return "#64748B";
    return "#0EA5E9";
}

interface AnalyticsData {
    priorityData: { name: string; value: number }[];
    statusData: { name: string; value: number }[];
}

export function AnalyticsWidget({ workspaceId }: { workspaceId: string }) {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const res = await fetch(`${API_URL}/api/workspaces/${workspaceId}/analytics`, {
                    credentials: "include",
                });
                if (!res.ok) throw new Error(`API Error: ${res.status}`);
                const json = await res.json();
                if (json.success) setData(json.data);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchAnalytics();
    }, [workspaceId]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="h-[210px] rounded-2xl bg-muted/30 animate-pulse" />
                <div className="h-[210px] rounded-2xl bg-muted/30 animate-pulse" />
            </div>
        );
    }

    const prio = PRIORITY_META.map((m) => ({
        ...m,
        value: data?.priorityData.find((d) => d.name === m.key)?.value || 0,
    }));
    const prioTotal = prio.reduce((s, p) => s + p.value, 0);

    const status = data?.statusData || [];
    const statusTotal = status.reduce((s, x) => s + x.value, 0);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Task Priority */}
            <Card className="rounded-2xl border-border bg-card">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
                        Task Priority
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {prioTotal === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">Belum ada task</p>
                    ) : (
                        <div className="space-y-3.5">
                            {prio.map((p) => {
                                const pct = Math.round((p.value / prioTotal) * 100);
                                return (
                                    <div key={p.key} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="flex items-center gap-2 font-medium text-foreground">
                                                <span
                                                    className="h-2.5 w-2.5 rounded-full"
                                                    style={{ backgroundColor: p.color }}
                                                />
                                                {p.label}
                                            </span>
                                            <span className="tabular-nums text-muted-foreground">
                                                {p.value} · {pct}%
                                            </span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{ width: `${pct}%`, backgroundColor: p.color }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Task Status */}
            <Card className="rounded-2xl border-border bg-card">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
                        Task Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {statusTotal === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">Belum ada task</p>
                    ) : (
                        <div className="space-y-3.5">
                            {status.map((s) => {
                                const c = statusColor(s.name);
                                const pct = Math.round((s.value / statusTotal) * 100);
                                return (
                                    <div key={s.name} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="truncate font-medium text-foreground">{s.name}</span>
                                            <span className="shrink-0 tabular-nums text-muted-foreground">
                                                {s.value} · {pct}%
                                            </span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{ width: `${pct}%`, backgroundColor: c }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
