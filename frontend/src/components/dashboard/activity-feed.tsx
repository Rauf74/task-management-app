"use client";

// ==============================================
// Activity Feed - Aktivitas Terkini (per workspace)
// ==============================================

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
    Activity,
    FilePlus,
    Trash2,
    ArrowRight,
    Layout,
    Columns,
    MoreHorizontal,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { API_URL } from "@/lib/api";
import { ActivityItem } from "./activity-item";

interface ActivityLog {
    id: string;
    action: string;
    entityType: string;
    entityTitle: string;
    details: string | null;
    createdAt: string;
    user: { name: string; image: string | null };
}

const ITEMS_PER_PAGE = 5;

export function ActivityFeed({ workspaceId }: { workspaceId: string }) {
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    useEffect(() => {
        async function fetchActivities() {
            try {
                const res = await fetch(`${API_URL}/api/workspaces/${workspaceId}/activities`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const json = await res.json();
                    if (json.success) setActivities(json.data.activities || []);
                }
            } catch (error) {
                console.error("Failed to fetch activities", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchActivities();
        const interval = setInterval(fetchActivities, 30000);
        return () => clearInterval(interval);
    }, [workspaceId]);

    const visibleActivities = activities.slice(0, visibleCount);
    const hasMore = visibleCount < activities.length;
    const canShowLess = visibleCount > ITEMS_PER_PAGE;

    if (isLoading) {
        return (
            <Card className="rounded-2xl border-border bg-card">
                <CardHeader className="flex flex-row items-center gap-2 space-y-0 border-b border-border/40 pb-3">
                    <Activity className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
                        Aktivitas Terkini
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
                    Aktivitas Terkini
                </CardTitle>
                {activities.length > 0 && (
                    <span className="ml-auto text-xs font-normal text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-full tabular-nums">
                        {Math.min(visibleCount, activities.length)} / {activities.length}
                    </span>
                )}
            </CardHeader>
            <CardContent className="p-0">
                <div className="p-4">
                    {activities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                            <MoreHorizontal className="h-7 w-7 mb-2 opacity-60" />
                            <p className="text-sm">Belum ada aktivitas tercatat</p>
                        </div>
                    ) : (
                        <div className="relative space-y-1">
                            {visibleActivities.map((log, i) => (
                                <ActivityItem
                                    key={log.id}
                                    log={log}
                                    isLast={i === visibleActivities.length - 1}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {activities.length > 0 && (hasMore || canShowLess) && (
                    <div className="flex gap-2 border-t border-border/40 px-4 pb-4 pt-2">
                        {hasMore && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setVisibleCount((p) => Math.min(p + ITEMS_PER_PAGE, activities.length))}
                                className="h-8 flex-1 text-xs text-muted-foreground hover:text-foreground"
                            >
                                <ChevronDown className="mr-1 h-3.5 w-3.5" /> Load More
                            </Button>
                        )}
                        {canShowLess && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setVisibleCount(ITEMS_PER_PAGE)}
                                className="h-8 flex-1 text-xs text-muted-foreground hover:text-foreground"
                            >
                                <ChevronUp className="mr-1 h-3.5 w-3.5" /> Show Less
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
