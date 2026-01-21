// ==============================================
// Backend Entry Point
// ==============================================
// 
// File ini adalah "pintu masuk" aplikasi backend.
// Tugasnya:
// 1. Load environment variables
// 2. Inisialisasi Express app
// 3. Inisialisasi Socket.io
// 4. Jalankan server
//
// ==============================================

import "dotenv/config";
import { createServer } from "http";
import app from "./app.js";
import { initializeSocket } from "./socket/index.js";

const PORT = process.env.PORT || 4000;

// Security Check: Pastikan JWT_SECRET ada di Production
if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
    console.error("❌ FATAL ERROR: JWT_SECRET belum di-set di .env!");
    console.error("Server menolak berjalan tanpa kunci keamanan.");
    process.exit(1);
}

// Buat HTTP server dari Express app
const httpServer = createServer(app);

// Start server with async initialization
async function startServer() {
    // Inisialisasi Socket.io dengan Redis adapter
    await initializeSocket(httpServer);

    // Jalankan server
    httpServer.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📡 Socket.io ready for connections`);
    });
}

startServer().catch(console.error);

