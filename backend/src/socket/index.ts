// ==============================================
// Socket.io Setup with Redis Adapter
// ==============================================
// 
// File ini mengatur Socket.io untuk fitur real-time:
// - Connection handling
// - Event handlers (task moved, board updated, dll)
// - Redis adapter untuk horizontal scaling
//
// ==============================================

import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

let io: SocketServer;

export async function initializeSocket(httpServer: HttpServer) {
    io = new SocketServer(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            credentials: true,
        },
    });

    // Setup Redis adapter for horizontal scaling
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

    try {
        const pubClient = createClient({ url: redisUrl });
        const subClient = pubClient.duplicate();

        await Promise.all([pubClient.connect(), subClient.connect()]);

        io.adapter(createAdapter(pubClient, subClient));
        console.log("✅ Socket.io Redis adapter connected");
    } catch (error) {
        console.warn("⚠️ Redis not available, using memory adapter:", error);
        // Falls back to default memory adapter if Redis fails
    }

    io.on("connection", (socket) => {
        console.log(`📡 Client connected: ${socket.id}`);

        // Join board room (untuk real-time updates per board)
        socket.on("join-board", (boardId: string) => {
            socket.join(`board:${boardId}`);
            console.log(`👤 ${socket.id} joined board:${boardId}`);
        });

        // Leave board room
        socket.on("leave-board", (boardId: string) => {
            socket.leave(`board:${boardId}`);
            console.log(`👤 ${socket.id} left board:${boardId}`);
        });

        // Disconnect
        socket.on("disconnect", () => {
            console.log(`📡 Client disconnected: ${socket.id}`);
        });
    });

    return io;
}

// Export untuk digunakan di controller/service
export function getIO() {
    if (!io) {
        throw new Error("Socket.io belum diinisialisasi!");
    }
    return io;
}

// Helper untuk emit event ke board tertentu
export function emitToBoardRoom(boardId: string, event: string, data: unknown) {
    if (io) {
        io.to(`board:${boardId}`).emit(event, data);
    }
}

