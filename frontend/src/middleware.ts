// ============================================
// Next.js Middleware untuk Authentication
// ============================================
// 
// Middleware berjalan SEBELUM request sampai ke halaman.
// Digunakan untuk:
// - Redirect user yang belum login ke /login
// - Redirect user yang sudah login dari /login ke /dashboard
//
// File ini HARUS bernama middleware.ts dan di root /src
//
// ============================================

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Routes yang butuh authentication
const protectedRoutes = [
    "/dashboard",
    "/workspaces",
    "/workspace",
    "/board",
];

// Routes untuk guest only (redirect ke dashboard jika sudah login)
const guestRoutes = ["/login", "/register"];

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    // Cek apakah route adalah protected
    const isProtectedRoute = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
    );

    // Cek apakah route adalah guest only
    const isGuestRoute = guestRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
    );

    // Jika protected route dan belum login -> redirect ke login
    if (isProtectedRoute && !isLoggedIn) {
        const loginUrl = new URL("/login", nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Jika guest route dan sudah login -> redirect ke dashboard
    if (isGuestRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
    }

    // Lanjutkan request seperti biasa
    return NextResponse.next();
});

// Config: routes mana yang akan diproses middleware
export const config = {
    matcher: [
        // Match semua routes kecuali static files dan api
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
    ],
};
