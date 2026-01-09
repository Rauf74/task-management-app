// ==============================================
// Auth Layout - Modern Glassmorphism
// ==============================================

import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Softer gradient background - dark theme: muted colors, light theme: gentle gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/80 via-purple-500/70 to-indigo-600/80 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900" />

            {/* Softer floating orbs */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-400/20 dark:bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/15 dark:bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-400/15 dark:bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-500" />

            {/* Theme Toggle - Top Right */}
            <div className="absolute top-4 right-4 z-20">
                <ThemeToggle />
            </div>

            {/* Content */}
            <div className="w-full max-w-md p-6 relative z-10">
                {children}
            </div>
        </div>
    );
}
