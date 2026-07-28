"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { MessageCircle } from "lucide-react";
import AIChatWidget from "./AIChatWidget";
import { GlowEffect } from "./motion-primitives/glow-effect";

export default function SkillsChatDock() {
    const [isVisible, setIsVisible] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const mouseY = useMotionValue(Infinity);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible(entry.isIntersecting);
                });
            },
            { threshold: 0.15 }
        );
        const skillsSection = document.getElementById("skills");
        if (skillsSection) observer.observe(skillsSection);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            {/* ── DOCK ── slides in from right when Skills section is visible */}
            <motion.div
                initial={{ x: 80, opacity: 0 }}
                animate={isVisible ? { x: 0, opacity: 1 } : { x: 80, opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-[80] pointer-events-none"
            >
                <div
                    onMouseMove={(e) => mouseY.set(e.clientY)}
                    onMouseLeave={() => mouseY.set(Infinity)}
                    className="pointer-events-auto flex flex-col items-center p-2 rounded-full border border-white/10 bg-black/30 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]"
                >
                    <DockItem
                        mouseY={mouseY}
                        isActive={isChatOpen}
                        onClick={() => setIsChatOpen((v) => !v)}
                    />
                </div>
            </motion.div>

            {/* ── FULL-SCREEN CHAT EXPERIENCE ── */}
            <AIChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
    );
}

function DockItem({
    mouseY,
    isActive,
    onClick,
}: {
    mouseY: any;
    isActive: boolean;
    onClick: () => void;
}) {
    const ref = useRef<HTMLButtonElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const distance = useTransform(mouseY, (val: number) => {
        const b = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
        return val - b.y - b.height / 2;
    });

    const scaleTransform = useTransform(distance, [-100, 0, 100], [1, 1.75, 1]);
    const scale = useSpring(scaleTransform, { mass: 0.1, stiffness: 150, damping: 12 });
    const zIndex = useTransform(
        useTransform(distance, [-100, 0, 100], [10, 50, 10]),
        (v) => Math.round(v)
    );

    return (
        <div className="relative group flex items-center h-10 w-10 justify-center">
            {/* Tooltip */}
            <div
                className={`
                    absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-black/80 border border-white/10
                    text-white text-xs font-medium whitespace-nowrap backdrop-blur-md
                    transition-all duration-200 pointer-events-none origin-right
                    ${isHovered || isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"}
                `}
            >
                {isActive ? "Close chat" : "AI Assistant"}
            </div>

            <motion.button
                ref={ref}
                style={{ scale, zIndex }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
                aria-label="AI Assistant"
                className={`
                    w-10 h-10 origin-center relative flex items-center justify-center rounded-full
                    border transition-colors duration-300
                    ${isActive
                        ? "bg-white/10 border-white/25"
                        : "bg-black/40 border-white/10 hover:bg-white/8 hover:border-white/20"
                    }
                `}
            >
                {/* Glow on hover OR when active */}
                {(isHovered || isActive) && (
                    <GlowEffect
                        colors={
                            isActive
                                ? ["#4285f4", "#9c27b0", "#ea4335", "#fbbc05", "#34a853"]
                                : ["#38bdf8", "#a855f7"]
                        }
                        mode="colorShift"
                        blur="soft"
                        duration={isActive ? 4 : 3}
                        scale={isActive ? 1.1 : 0.85}
                    />
                )}

                <MessageCircle
                    className={`w-5 h-5 transition-all relative z-10 ${
                        isActive
                            ? "text-white scale-110"
                            : "text-gray-400 group-hover:text-white"
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                />

                {/* Active indicator dot */}
                {isActive && (
                    <motion.div
                        layoutId="dock-active-dot"
                        className="absolute -right-0.5 -top-0.5 w-2 h-2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]"
                    />
                )}
            </motion.button>
        </div>
    );
}
