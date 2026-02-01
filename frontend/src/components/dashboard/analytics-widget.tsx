"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { API_URL } from "@/lib/api";

// Color Palette matching our theme
const COLORS = [
    "#2563EB", // Blue (Primary)
    "#10B981", // Emerald (Success)
    "#F59E0B", // Amber (Warning)
    "#EF4444", // Red (Danger)
];

const PRIORITY_COLORS: Record<string, string> = {
    LOW: "#2563EB",
    MEDIUM: "#F59E0B",
    HIGH: "#F97316",
    URGENT: "#EF4444",
};

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
                // Use credentials: 'include' to send httpOnly cookies automatically
                const res = await fetch(`${API_URL}/api/workspaces/${workspaceId}/analytics`, {
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error(`API Error: ${res.status}`);
                }

                const json = await res.json();

                if (json.success) {
                    setData(json.data);
                }
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="h-[300px] rounded-xl bg-muted/20 animate-pulse" />
                <div className="h-[300px] rounded-xl bg-muted/20 animate-pulse" />
            </div>
        );
    }

    // If no data, return nothing (clean UI)
    if (!data || (data.priorityData.length === 0 && data.statusData.length === 0)) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority Distribution */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Task Priority</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.priorityData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.priorityData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={PRIORITY_COLORS[entry.name] || COLORS[index % COLORS.length]}
                                        stroke="none"
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "var(--background)",
                                    borderColor: "var(--border)",
                                    borderRadius: "8px"
                                }}
                                itemStyle={{ color: "var(--foreground)" }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Status Progress */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Task Status</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.statusData}>
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                hide
                            />
                            <Tooltip
                                cursor={false}
                                contentStyle={{
                                    backgroundColor: "hsl(var(--popover))",
                                    borderColor: "hsl(var(--border))",
                                    borderRadius: "var(--radius)",
                                    color: "hsl(var(--popover-foreground))",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                }}
                                itemStyle={{ color: "hsl(var(--foreground))" }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {data.statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
