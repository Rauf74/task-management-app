// ============================================
// Utility Functions
// ============================================
// 
// Helper functions yang sering dipakai di seluruh aplikasi:
// - cn(): menggabungkan class names (Tailwind)
// - formatDate(): format tanggal
// - generateId(): generate random ID
//
// ============================================

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Menggabungkan class names dengan dukungan conditional classes
 * Menggunakan clsx untuk conditional dan twMerge untuk deduplicate Tailwind classes
 * 
 * Contoh:
 * cn("px-4 py-2", isActive && "bg-blue-500", className)
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format tanggal ke format yang readable
 * 
 * Contoh:
 * formatDate(new Date()) // "19 Des 2024"
 */
export function formatDate(date: Date | string | null): string {
    if (!date) return "-";

    const d = typeof date === "string" ? new Date(date) : date;

    return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/**
 * Format tanggal dengan waktu
 * 
 * Contoh:
 * formatDateTime(new Date()) // "19 Des 2024, 14:30"
 */
export function formatDateTime(date: Date | string | null): string {
    if (!date) return "-";

    const d = typeof date === "string" ? new Date(date) : date;

    return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/**
 * Capitalize first letter of each word
 * 
 * Contoh:
 * capitalize("hello world") // "Hello World"
 */
export function capitalize(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Truncate text dengan ellipsis
 * 
 * Contoh:
 * truncate("Very long text here", 10) // "Very long..."
 */
export function truncate(str: string, length: number): string {
    if (str.length <= length) return str;
    return str.slice(0, length) + "...";
}
