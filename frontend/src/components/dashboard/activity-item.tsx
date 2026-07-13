"use client";

// ==============================================
// Shared Activity Item - timeline row (used by Terkini + Global)
// ==============================================

import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
    FilePlus,
    Trash2,
    ArrowRight,
    Layout,
    Columns,
    Activity as ActivityIcon,
} from "lucide-react";

export interface ActivityLog {
    id: string;
    action: string;
    entityType: string;
    entityTitle: string;
    details: string | null;
    createdAt: string;
    user: { name: string; image: string | null };
    workspaceName?: string;
}

export function getIcon(action: string) {
    if (action.includes("CREATE")) return <FilePlus className="h-3.5 w-3.5" />;
    if (action.includes("DELETE")) return <Trash2 className="h-3.5 w-3.5" />;
    if (action.includes("MOVE")) return <ArrowRight className="h-3.5 w-3.5" />;
    if (action.includes("BOARD")) return <Layout className="h-3.5 w-3.5" />;
    if (action.includes("COLUMN")) return <Columns className="h-3.5 w-3.5" />;
    return <ActivityIcon className="h-3.5 w-3.5" />;
}

export function getIconColor(action: string): string {
    if (action.includes("CREATE")) return "text-emerald-500 bg-emerald-500/10";
    if (action.includes("DELETE")) return "text-destructive bg-destructive/10";
    if (action.includes("MOVE")) return "text-blue-500 bg-blue-500/10";
    if (action.includes("BOARD")) return "text-violet-500 bg-violet-500/10";
    if (action.includes("COLUMN")) return "text-orange-500 bg-orange-500/10";
    return "text-muted-foreground bg-muted";
}

export function getMessage(log: ActivityLog): string {
    if (log.action === "CREATE_TASK") return `membuat task "${log.entityTitle}" ${log.details || ""}`;
    if (log.action === "MOVE_TASK") return `memindahkan task "${log.entityTitle}" ${log.details || ""}`;
    if (log.action === "DELETE_TASK") return `menghapus task "${log.entityTitle}" ${log.details || ""}`;
    if (log.action === "CREATE_COLUMN") return `menambahkan kolom "${log.entityTitle}"`;
    if (log.action === "DELETE_COLUMN") return `menghapus kolom "${log.entityTitle}"`;
    if (log.action === "CREATE_BOARD") return `membuat board "${log.entityTitle}"`;
    if (log.action === "DELETE_BOARD") return `menghapus board "${log.entityTitle}"`;
    return log.details || `melakukan aktivitas pada ${log.entityTitle}`;
}

export function ActivityItem({
    log,
    isLast = false,
}: {
    log: ActivityLog;
    isLast?: boolean;
}) {
    return (
        <div className="relative flex gap-3 pb-4 last:pb-0">
            {/* timeline connector */}
            {!isLast && (
                <span className="absolute left-[17px] top-9 bottom-1 w-px bg-border" aria-hidden />
            )}

            {/* icon node */}
            <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border ${getIconColor(
                    log.action
                )}`}
            >
                {getIcon(log.action)}
            </span>

            <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-xs font-semibold text-foreground">
                        {log.user.name}
                    </p>
                    <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                        {formatDistanceToNow(new Date(log.createdAt), {
                            addSuffix: true,
                            locale: idLocale,
                        })}
                    </span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {getMessage(log)}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-2 py-0.5 text-[10px] capitalize text-muted-foreground">
                        {log.entityType.toLowerCase()}
                    </span>
                    {log.workspaceName && (
                        <span className="inline-flex items-center text-[10px] text-muted-foreground/70">
                            · {log.workspaceName}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
