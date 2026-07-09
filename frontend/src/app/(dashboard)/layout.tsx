"use client";

// ==============================================
// Dashboard App Shell - Sidebar (desktop) + Drawer (mobile)
// ==============================================

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { ActivityMenu } from "@/components/layout/activity-menu";
import { Menu } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, isLoading, logout } = useAuth();
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    async function handleLogout() {
        await logout();
        router.push("/login");
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm text-muted-foreground">Memuat...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background">
            {/* Desktop sidebar - fixed */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-card lg:block">
                <SidebarNav />
            </aside>

            {/* Content area (offset for sidebar on desktop) */}
            <div className="lg:pl-64">
                {/* Topbar */}
                <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-md">
                    <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
                        {/* Mobile: hamburger + drawer */}
                        <div className="flex items-center gap-2 lg:hidden">
                            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" aria-label="Menu">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-72 p-0 bg-card">
                                    <SheetTitle className="sr-only">Navigasi</SheetTitle>
                                    <SidebarNav onNavigate={() => setDrawerOpen(false)} />
                                </SheetContent>
                            </Sheet>
                            <span className="text-lg font-bold tracking-tight text-foreground">TaskScale</span>
                        </div>

                        {/* Desktop: spacer (brand is in sidebar) */}
                        <div className="hidden lg:block" />

                        <div className="flex items-center gap-2">
                            <ActivityMenu />
                            <ThemeToggle />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
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
                <main className="p-4 sm:p-6">{children}</main>
            </div>
        </div>
    );
}
