"use client";

// ==============================================
// Socket.io Context Provider
// ==============================================

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./auth-context";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export function SocketProvider({ children }: { children: ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        // Only connect when user is authenticated
        if (!user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        // Create socket connection
        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ["websocket", "polling"],
        });

        newSocket.on("connect", () => {
            console.log("Socket connected:", newSocket.id);
            setIsConnected(true);
        });

        newSocket.on("disconnect", () => {
            console.log("Socket disconnected");
            setIsConnected(false);
        });

        newSocket.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}

// ==============================================
// Socket Event Types
// ==============================================

export interface TaskCreatedEvent {
    task: {
        id: string;
        title: string;
        description?: string;
        priority: string;
        order: number;
        columnId: string;
    };
    columnId: string;
    boardId: string;
}

export interface TaskUpdatedEvent {
    task: {
        id: string;
        title?: string;
        description?: string;
        priority?: string;
    };
    boardId: string;
}

export interface TaskDeletedEvent {
    taskId: string;
    columnId: string;
    boardId: string;
}

export interface TaskMovedEvent {
    taskId: string;
    fromColumnId: string;
    toColumnId: string;
    order: number;
    boardId: string;
}

export interface ColumnCreatedEvent {
    column: {
        id: string;
        title: string;
        order: number;
        boardId: string;
    };
    boardId: string;
}

export interface ColumnDeletedEvent {
    columnId: string;
    boardId: string;
}
