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
// Types
// ==============================================

export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
}
