// ==============================================
// Express Application Setup
// ==============================================
// 
// File ini mengatur Express app:
// - Middleware (CORS, JSON parser, Cookie parser)
// - Routes (API endpoints)
// - Error handling
//
// Dipisahkan dari index.ts agar bisa di-test
// tanpa menjalankan server.
//
// ==============================================

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import workspaceRoutes from "./routes/workspace.routes.js";
import boardRoutes from "./routes/board.routes.js";
import columnRoutes from "./routes/column.routes.js";
import taskRoutes from "./routes/task.routes.js";
import labelRoutes from "./routes/label.routes.js";

// Import Swagger
import { setupSwagger } from "./lib/swagger.js";

const app = express();

// ==============================================
// Middleware
// ==============================================

// Security Headers (Helmet)
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    limit: 300, // Limit tiap IP ke 300 request per windowMs
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: "Terlalu banyak request dari IP ini, coba lagi nanti."
});
app.use(limiter);

// CORS: Izinkan request dari frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // Izinkan cookies
}));

// Parse JSON body
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// ==============================================
// Routes
// ==============================================

// Health check endpoint
app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        message: "Backend is running!"
    });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/workspaces", labelRoutes);

// Swagger documentation
setupSwagger(app);

// ==============================================
// Error Handling
// ==============================================

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: "Endpoint tidak ditemukan" });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Terjadi kesalahan server" });
});

export default app;
