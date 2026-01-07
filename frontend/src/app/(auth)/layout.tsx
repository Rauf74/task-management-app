// ==============================================
// Auth Layout
// ==============================================

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background">
            <div className="w-full max-w-md p-8">
                {children}
            </div>
        </div>
    );
}
