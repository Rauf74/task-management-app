// ==============================================
// Auth Layout - Modern Glassmorphism
// ==============================================

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-800 dark:from-violet-900 dark:via-purple-900 dark:to-indigo-950" />

            {/* Animated floating orbs */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-500" />

            {/* Content */}
            <div className="w-full max-w-md p-6 relative z-10">
                {children}
            </div>
        </div>
    );
}
