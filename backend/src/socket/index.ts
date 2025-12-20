// ==============================================
// Socket.io Setup
// ==============================================
// 
// File ini mengatur Socket.io untuk fitur real-time:
// - Connection handling
// - Event handlers (task moved, board updated, dll)
// - Authentication via socket
//
// ==============================================

import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";

let io: SocketServer;

export function initializeSocket(httpServer: HttpServer) {
    io = new SocketServer(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            credentials: true,
        },
    });

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
