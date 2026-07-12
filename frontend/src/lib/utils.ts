import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const WS_COLORS = ["#059669", "#7C3AED", "#F97316", "#0EA5E9", "#EC4899", "#F59E0B"];

export function colorFor(id: string): string {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    return WS_COLORS[h % WS_COLORS.length];
}
