// ==============================================
// Auth Layout - Split Screen with Illustration
// ==============================================

import { AuthIllustration } from "./auth-illustration";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Illustration (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Floating Shapes */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-40 right-20 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-cyan-400/20 rounded-full blur-2xl" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 xl:px-20">
                    <div className="max-w-xl text-center">
                        <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
                            Kelola Tugas dengan
                            <span className="block text-yellow-300">Lebih Mudah</span>
                        </h1>
                        <p className="text-lg text-white/80 mb-12 leading-relaxed">
                            TaskScale membantu Anda mengorganisir pekerjaan, 
                            berkolaborasi dengan tim, dan mencapai target lebih efisien.
                        </p>
                        
                        {/* Dynamic Illustration */}
                        <AuthIllustration />
                    </div>
                </div>

                {/* Bottom Decorative */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center relative bg-background">
                {/* Subtle Background for Mobile */}
                <div className="absolute inset-0 lg:hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/90 via-purple-500/90 to-indigo-600/90" />
                    <div className="absolute top-10 left-10 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-400/15 rounded-full blur-3xl" />
                </div>

                {/* Form Container */}
                <div className="relative z-10 w-full max-w-md px-6 py-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
