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

// Buat HTTP server dari Express app
const httpServer = createServer(app);

// Inisialisasi Socket.io
initializeSocket(httpServer);

// Jalankan server
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Socket.io ready for connections`);
});
