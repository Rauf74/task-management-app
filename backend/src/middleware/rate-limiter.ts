// ==============================================
// Rate Limiter Middleware
// ==============================================

import rateLimit from "express-rate-limit";

// Strict rate limiter khusus endpoint Quick Login Demo
// Limit: 10 request per 1 menit per IP
export const demoLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 menit
    limit: 10, // Maksimal 10 demo account per IP per menit
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        success: false,
        error: "Terlalu banyak pembuatan akun demo dari IP ini. Silakan coba lagi dalam 1 menit.",
    },
});
