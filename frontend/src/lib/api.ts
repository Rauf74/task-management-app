// ==============================================
// API Client
// ==============================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type FetchOptions = RequestInit & {
    body?: unknown;
};

async function fetcher<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { body, headers, ...rest } = options;

    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
        ...rest,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
    }

    return data;
}

// ==============================================
// Auth API
// ==============================================

export const authApi = {
    register: (data: { name: string; email: string; password: string }) =>
        fetcher("/api/auth/register", { method: "POST", body: data }),

    login: (data: { email: string; password: string }) =>
        fetcher("/api/auth/login", { method: "POST", body: data }),

    logout: () => fetcher("/api/auth/logout", { method: "POST" }),

    me: () => fetcher<{ success: boolean; data: { user: User } }>("/api/auth/me"),
};

// ==============================================
// Workspace API
// ==============================================

export const workspaceApi = {
    list: () =>
        fetcher<{ success: boolean; data: { workspaces: Workspace[] } }>("/api/workspaces"),

    get: (id: string) =>
        fetcher<{ success: boolean; data: { workspace: WorkspaceWithBoards } }>(
            `/api/workspaces/${id}`
        ),

    create: (data: { name: string; description?: string }) =>
        fetcher<{ success: boolean; data: { workspace: Workspace } }>(
            "/api/workspaces",
            { method: "POST", body: data }
        ),

    update: (id: string, data: { name?: string; description?: string }) =>
        fetcher(`/api/workspaces/${id}`, { method: "PUT", body: data }),

    delete: (id: string) =>
        fetcher(`/api/workspaces/${id}`, { method: "DELETE" }),
};

// ==============================================
// Board API
// ==============================================

export const boardApi = {
    get: (id: string) =>
        fetcher<{ success: boolean; data: { board: BoardWithDetails } }>(
            `/api/boards/${id}`
        ),

    create: (workspaceId: string, data: { name: string; description?: string }) =>
        fetcher<{ success: boolean; data: { board: Board } }>(
            `/api/workspaces/${workspaceId}/boards`,
            { method: "POST", body: data }
        ),

    update: (id: string, data: { name?: string; description?: string }) =>
        fetcher(`/api/boards/${id}`, { method: "PUT", body: data }),

    delete: (id: string) =>
        fetcher(`/api/boards/${id}`, { method: "DELETE" }),
};

// ==============================================
// Column API
// ==============================================

export const columnApi = {
    create: (boardId: string, data: { title: string }) =>
        fetcher<{ success: boolean; data: { column: Column } }>(
            `/api/boards/${boardId}/columns`,
            { method: "POST", body: data }
        ),

    update: (id: string, data: { title?: string }) =>
        fetcher(`/api/columns/${id}`, { method: "PUT", body: data }),

    delete: (id: string) =>
        fetcher(`/api/columns/${id}`, { method: "DELETE" }),

    reorder: (columnIds: string[]) =>
        fetcher("/api/columns/reorder", { method: "PATCH", body: { columnIds } }),
};

// ==============================================
// Task API
// ==============================================

export const taskApi = {
    create: (columnId: string, data: { title: string; description?: string; priority?: string }) =>
        fetcher<{ success: boolean; data: { task: Task } }>(
            `/api/columns/${columnId}/tasks`,
            { method: "POST", body: data }
        ),

    update: (id: string, data: { title?: string; description?: string; priority?: string }) =>
        fetcher(`/api/tasks/${id}`, { method: "PUT", body: data }),

    delete: (id: string) =>
        fetcher(`/api/tasks/${id}`, { method: "DELETE" }),

    move: (id: string, data: { columnId: string; order: number }) =>
        fetcher(`/api/tasks/${id}/move`, { method: "PATCH", body: data }),
};

// ==============================================
// Types
// ==============================================

export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
}

export interface Workspace {
    id: string;
    name: string;
    description?: string;
    _count?: { boards: number };
}

export interface WorkspaceWithBoards extends Workspace {
    boards: Board[];
}

export interface Board {
    id: string;
    name: string;
    description?: string;
    workspaceId: string;
}

export interface Column {
    id: string;
    title: string;
    order: number;
    boardId: string;
    tasks: Task[];
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    order: number;
    columnId: string;
}

export interface BoardWithDetails extends Board {
    columns: Column[];
}
