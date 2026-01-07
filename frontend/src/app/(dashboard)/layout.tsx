"use client";

// ==============================================
// Dashboard Layout with Header & Theme Toggle
// ==============================================

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, isLoading, logout } = useAuth();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    async function handleLogout() {
        await logout();
        router.push("/login");
    }

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-foreground">Loading...</div>
            </div>
        );
    }

    // Don't render if not authenticated
    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="flex h-16 items-center justify-between px-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-foreground">TaskScale</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* User Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            {user.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                                <div className="flex items-center gap-2 p-2">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                                <Separator className="bg-border" />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-destructive cursor-pointer focus:text-destructive focus:bg-accent"
                                >
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6">
                {children}
            </main>
        </div>
    );
}

