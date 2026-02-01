"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
    Activity,
    FilePlus,
    Trash2,
    ArrowRight,
    Layout,
    Columns,
    MoreHorizontal
} from "lucide-react";

interface ActivityLog {
    id: string;
    action: string;
    entityType: string;
    entityTitle: string;
    details: string | null;
    createdAt: string;
    user: {
        name: string;
        image: string | null;
    };
}

export function ActivityFeed({ workspaceId }: { workspaceId: string }) {
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchActivities() {
            try {
                const res = await fetch(`http://localhost:4000/api/workspaces/${workspaceId}/activities`, {
                    credentials: "include",
                });

                if (res.ok) {
                    const json = await res.json();
                    if (json.success) {
                        setActivities(json.data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch activities", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchActivities();

        // Optional: Poll every 30 seconds for live updates
        const interval = setInterval(fetchActivities, 30000);
        return () => clearInterval(interval);
    }, [workspaceId]);

    const getIcon = (action: string) => {
        if (action.includes("CREATE")) return <FilePlus className="h-4 w-4 text-emerald-500" />;
        if (action.includes("DELETE")) return <Trash2 className="h-4 w-4 text-destructive" />;
        if (action.includes("MOVE")) return <ArrowRight className="h-4 w-4 text-blue-500" />;
        if (action.includes("BOARD")) return <Layout className="h-4 w-4 text-purple-500" />;
        if (action.includes("COLUMN")) return <Columns className="h-4 w-4 text-orange-500" />;
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    };

    const getMessage = (log: ActivityLog) => {
        // Construct natural language sentences
        if (log.action === "CREATE_TASK") {
            return `membuat task "${log.entityTitle}" ${log.details || ""}`;
        }
        if (log.action === "MOVE_TASK") {
            return `memindahkan task "${log.entityTitle}" ${log.details || ""}`;
        }
        if (log.action === "DELETE_TASK") {
            return `menghapus task "${log.entityTitle}" ${log.details || ""}`;
        }
        if (log.action === "CREATE_COLUMN") {
            return `menambahkan kolom "${log.entityTitle}"`;
        }
        if (log.action === "DELETE_COLUMN") {
            return `menghapus kolom "${log.entityTitle}"`;
        }
        if (log.action === "CREATE_BOARD") {
            return `membuat board "${log.entityTitle}"`;
        }
        if (log.action === "DELETE_BOARD") {
            return `menghapus board "${log.entityTitle}"`;
        }

        return log.details || `melakukan aktivitas pada ${log.entityTitle}`;
    };

    if (isLoading) {
        return (
            <Card className="glass-card h-full">
                <CardHeader>
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Aktivitas Terkini
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 animate-pulse">
                                <div className="h-9 w-9 rounded-full bg-muted/40" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 w-3/4 bg-muted/40 rounded" />
                                    <div className="h-3 w-1/2 bg-muted/40 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="glass-card flex flex-col h-full border-primary/10 shadow-lg">
            <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Aktivitas Terkini
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative min-h-0">
                <ScrollArea className="h-full w-full">
                    <div className="p-4 pr-6">
                        {activities.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-60">
                                <MoreHorizontal className="h-8 w-8 mb-2" />
                                <p className="text-sm italic">Belum ada aktivitas tercatat</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {activities.map((log) => (
                                    <div key={log.id} className="flex gap-3 relative group">
                                        {/* Timeline line */}
                                        <div className="absolute left-[18px] top-10 bottom-[-24px] w-[1px] bg-gradient-to-b from-border to-transparent group-last:hidden" />

                                        <Avatar className="h-9 w-9 border border-border shadow-sm ring-2 ring-background">
                                            <AvatarImage src={log.user.image || ""} />
                                            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                                {log.user.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0 space-y-1.5 pt-0.5">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-xs font-semibold leading-none text-foreground truncate">
                                                    {log.user.name}
                                                </p>
                                                <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
                                                    {formatDistanceToNow(new Date(log.createdAt), {
                                                        addSuffix: true,
                                                        locale: idLocale
                                                    })}
                                                </span>
                                            </div>

                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                {getMessage(log)}
                                            </p>

                                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary/80 border border-border/50 text-[10px] text-muted-foreground w-fit mt-1">
                                                {getIcon(log.action)}
                                                <span className="capitalize">{log.entityType.toLowerCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
