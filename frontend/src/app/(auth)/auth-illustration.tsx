"use client";

import { usePathname } from "next/navigation";

export function AuthIllustration() {
    const pathname = usePathname();
    const isRegister = pathname === "/register";

    return (
        <div className="relative w-full max-w-lg mx-auto">
            {isRegister ? <RegisterIllustration /> : <LoginIllustration />}
        </div>
    );
}

// Login Illustration - Productivity & Task Management
function LoginIllustration() {
    return (
        <svg viewBox="0 0 500 400" className="w-full h-auto drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Circle */}
            <circle cx="250" cy="200" r="170" fill="white" fillOpacity="0.1"/>
            
            {/* Desk */}
            <rect x="120" y="290" width="260" height="12" rx="6" fill="#818cf8"/>
            <rect x="140" y="302" width="12" height="50" rx="3" fill="#6366f1"/>
            <rect x="348" y="302" width="12" height="50" rx="3" fill="#6366f1"/>
            
            {/* Laptop */}
            <rect x="190" y="200" width="120" height="90" rx="8" fill="#1e1b4b"/>
            <rect x="196" y="206" width="108" height="78" rx="4" fill="#312e81"/>
            
            {/* Screen Content - Task List */}
            <rect x="208" y="218" width="40" height="6" rx="2" fill="#60a5fa"/>
            <rect x="208" y="230" width="84" height="4" rx="1" fill="#818cf8" fillOpacity="0.6"/>
            <rect x="208" y="240" width="70" height="4" rx="1" fill="#818cf8" fillOpacity="0.6"/>
            <rect x="208" y="250" width="80" height="4" rx="1" fill="#818cf8" fillOpacity="0.6"/>
            
            {/* Checkbox Icons */}
            <rect x="208" y="265" width="12" height="12" rx="2" fill="#22c55e"/>
            <path d="M211 271 L214 274 L218 268" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            
            <rect x="208" y="282" width="12" height="12" rx="2" fill="#3b82f6"/>
            <path d="M211 288 L214 291 L218 285" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            
            {/* Laptop Base */}
            <rect x="180" y="290" width="140" height="8" rx="4" fill="#4f46e5"/>
            
            {/* Person */}
            <ellipse cx="380" cy="360" rx="55" ry="15" fill="#0f172a" fillOpacity="0.3"/>
            
            {/* Chair */}
            <path d="M350 360 L350 260 Q350 240 370 240 L410 240 Q430 240 430 260 L430 360" stroke="#6366f1" strokeWidth="10" fill="none"/>
            <rect x="340" y="350" width="100" height="15" rx="5" fill="#818cf8"/>
            
            {/* Person Body */}
            <circle cx="390" cy="180" r="28" fill="#fcd34d"/>
            <path d="M370 210 L360 280" stroke="#f59e0b" strokeWidth="14" strokeLinecap="round"/>
            <path d="M410 210 L420 280" stroke="#f59e0b" strokeWidth="14" strokeLinecap="round"/>
            <rect x="365" y="210" width="50" height="70" rx="10" fill="#f59e0b"/>
            
            {/* Arm using laptop */}
            <path d="M365 230 L340 260 L280 265" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" fill="none"/>
            
            {/* Coffee Cup */}
            <rect x="340" y="268" width="20" height="24" rx="2" fill="#f97316"/>
            <path d="M360 276 Q368 276 368 282 Q368 288 360 288" stroke="#f97316" strokeWidth="3" fill="none"/>
            <ellipse cx="350" cy="268" rx="10" ry="3" fill="#fb923c"/>
            
            {/* Plant */}
            <rect x="145" y="250" width="18" height="40" rx="2" fill="#ea580c"/>
            <ellipse cx="140" cy="235" rx="14" ry="22" fill="#22c55e" transform="rotate(-15 140 235)"/>
            <ellipse cx="168" cy="238" rx="12" ry="20" fill="#4ade80" transform="rotate(20 168 238)"/>
            <ellipse cx="154" cy="215" rx="10" ry="18" fill="#86efac"/>
            
            {/* Window */}
            <rect x="70" y="90" width="70" height="90" rx="6" fill="#dbeafe" stroke="#1e40af" strokeWidth="2"/>
            <line x1="105" y1="90" x2="105" y2="180" stroke="#1e40af" strokeWidth="2"/>
            <line x1="70" y1="135" x2="140" y2="135" stroke="#1e40af" strokeWidth="2"/>
            
            {/* Sun */}
            <circle cx="95" cy="115" r="12" fill="#fbbf24"/>
            <circle cx="125" cy="155" r="8" fill="white" fillOpacity="0.8"/>
            <circle cx="85" cy="160" r="6" fill="white" fillOpacity="0.6"/>
            
            {/* Floating Task Cards */}
            <g transform="translate(60, 220)">
                <rect x="0" y="0" width="50" height="35" rx="6" fill="white" fillOpacity="0.95"/>
                <rect x="8" y="8" width="20" height="4" rx="1" fill="#3b82f6"/>
                <rect x="8" y="16" width="34" height="3" rx="1" fill="#d1d5db"/>
                <rect x="8" y="22" width="28" height="3" rx="1" fill="#d1d5db"/>
                <circle cx="40" cy="25" r="6" fill="#22c55e"/>
                <path d="M37 25 L39 27 L43 23" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </g>
            
            <g transform="translate(380, 120)">
                <rect x="0" y="0" width="45" height="40" rx="6" fill="white" fillOpacity="0.95"/>
                <rect x="6" y="6" width="18" height="4" rx="1" fill="#8b5cf6"/>
                <rect x="6" y="14" width="30" height="3" rx="1" fill="#d1d5db"/>
                <rect x="6" y="20" width="25" height="3" rx="1" fill="#d1d5db"/>
                <rect x="6" y="28" width="20" height="6" rx="3" fill="#f472b6"/>
            </g>
            
            {/* Floating Elements */}
            <circle cx="50" cy="320" r="6" fill="#f472b6" fillOpacity="0.5"/>
            <circle cx="440" cy="80" r="5" fill="#60a5fa" fillOpacity="0.5"/>
            <circle cx="460" cy="280" r="8" fill="#a78bfa" fillOpacity="0.5"/>
            
            {/* Notification Bell */}
            <circle cx="330" cy="130" r="18" fill="#fbbf24"/>
            <path d="M330 118 L330 120 M320 128 Q320 140 330 140 Q340 140 340 128" stroke="#92400e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <circle cx="330" cy="143" r="2.5" fill="#92400e"/>
            <circle cx="338" cy="122" r="5" fill="#ef4444" stroke="white" strokeWidth="1.5"/>
        </svg>
    );
}

// Register Illustration - Team Collaboration & Welcome
function RegisterIllustration() {
    return (
        <svg viewBox="0 0 500 400" className="w-full h-auto drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Circle */}
            <circle cx="250" cy="200" r="170" fill="white" fillOpacity="0.1"/>
            
            {/* Central Hub - Team Collaboration */}
            <circle cx="250" cy="200" r="50" fill="#818cf8" fillOpacity="0.3"/>
            <circle cx="250" cy="200" r="35" fill="#6366f1"/>
            
            {/* Hub Icon */}
            <path d="M250 185 L250 190 M235 200 L240 200 M260 200 L265 200 M250 210 L250 215" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="250" cy="200" r="8" fill="white"/>
            
            {/* Connected Nodes - Team Members */}
            {/* Top Node */}
            <line x1="250" y1="165" x2="250" y2="100" stroke="#818cf8" strokeWidth="3" strokeDasharray="4 4"/>
            <circle cx="250" cy="85" r="22" fill="#22c55e"/>
            <circle cx="250" cy="78" r="10" fill="#86efac"/>
            <rect x="242" y="90" width="16" height="12" rx="3" fill="#15803d"/>
            
            {/* Right Node */}
            <line x1="285" y1="200" x2="380" y2="200" stroke="#818cf8" strokeWidth="3" strokeDasharray="4 4"/>
            <circle cx="400" cy="200" r="22" fill="#3b82f6"/>
            <circle cx="400" cy="193" r="10" fill="#93c5fd"/>
            <path d="M390 208 Q400 215 410 208" stroke="#1e40af" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            
            {/* Bottom Right Node */}
            <line x1="278" y1="228" x2="350" y2="300" stroke="#818cf8" strokeWidth="3" strokeDasharray="4 4"/>
            <circle cx="370" cy="320" r="22" fill="#f59e0b"/>
            <circle cx="370" cy="313" r="10" fill="#fcd34d"/>
            <rect x="362" y="325" width="16" height="10" rx="2" fill="#b45309"/>
            
            {/* Left Node */}
            <line x1="215" y1="200" x2="120" y2="200" stroke="#818cf8" strokeWidth="3" strokeDasharray="4 4"/>
            <circle cx="100" cy="200" r="22" fill="#ec4899"/>
            <circle cx="100" cy="193" r="10" fill="#fbcfe8"/>
            <path d="M92 205 L100 212 L108 202" stroke="#be185d" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            
            {/* Bottom Left Node */}
            <line x1="222" y1="228" x2="150" y2="300" stroke="#818cf8" strokeWidth="3" strokeDasharray="4 4"/>
            <circle cx="130" cy="320" r="22" fill="#8b5cf6"/>
            <circle cx="130" cy="313" r="10" fill="#ddd6fe"/>
            <rect x="122" y="322" width="6" height="12" rx="1" fill="#6d28d9"/>
            <rect x="132" y="318" width="6" height="16" rx="1" fill="#6d28d9"/>
            
            {/* Floating Task Cards */}
            <g transform="translate(60, 80)">
                <rect x="0" y="0" width="55" height="40" rx="8" fill="white" fillOpacity="0.95"/>
                <rect x="8" y="8" width="24" height="5" rx="2" fill="#22c55e"/>
                <rect x="8" y="18" width="39" height="3" rx="1" fill="#d1d5db"/>
                <rect x="8" y="25" width="30" height="3" rx="1" fill="#d1d5db"/>
                <circle cx="42" cy="28" r="7" fill="#22c55e"/>
                <path d="M39 28 L41 30 L45 26" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </g>
            
            <g transform="translate(380, 280)">
                <rect x="0" y="0" width="50" height="45" rx="8" fill="white" fillOpacity="0.95"/>
                <rect x="8" y="8" width="20" height="5" rx="2" fill="#f59e0b"/>
                <rect x="8" y="18" width="34" height="3" rx="1" fill="#d1d5db"/>
                <rect x="8" y="24" width="28" height="3" rx="1" fill="#d1d5db"/>
                <rect x="8" y="32" width="22" height="6" rx="3" fill="#fbbf24"/>
            </g>
            
            <g transform="translate(30, 280)">
                <rect x="0" y="0" width="48" height="42" rx="8" fill="white" fillOpacity="0.95"/>
                <rect x="8" y="8" width="18" height="5" rx="2" fill="#3b82f6"/>
                <rect x="8" y="18" width="32" height="3" rx="1" fill="#d1d5db"/>
                <rect x="8" y="24" width="25" height="3" rx="1" fill="#d1d5db"/>
                <rect x="8" y="32" width="20" height="5" rx="2" fill="#60a5fa"/>
            </g>
            
            {/* Decorative Elements */}
            <circle cx="50" cy="180" r="8" fill="#f472b6" fillOpacity="0.6"/>
            <circle cx="450" cy="100" r="6" fill="#60a5fa" fillOpacity="0.6"/>
            <circle cx="470" cy="220" r="10" fill="#a78bfa" fillOpacity="0.6"/>
            <circle cx="70" cy="350" r="7" fill="#22c55e" fillOpacity="0.5"/>
            <circle cx="430" cy="350" r="5" fill="#fbbf24" fillOpacity="0.6"/>
            
            {/* Stars */}
            <path d="M450 150 L452 155 L457 155 L453 159 L455 164 L450 161 L445 164 L447 159 L443 155 L448 155 Z" fill="#fbbf24"/>
            <path d="M70 120 L71.5 124 L75 124 L72 127 L73 131 L70 129 L67 131 L68 127 L65 124 L68.5 124 Z" fill="#fbbf24"/>
            
            {/* Progress Rings */}
            <circle cx="250" cy="200" r="65" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.3" strokeDasharray="8 8"/>
            <circle cx="250" cy="200" r="80" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.2" strokeDasharray="4 4"/>
        </svg>
    );
}
