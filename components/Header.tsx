"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { User, Briefcase, Award, Code, Zap, Mail, MessageCircle } from "lucide-react";
import { GlowEffect } from "@/components/motion-primitives/glow-effect";

const navLinks = [
    { name: "About", id: "about", icon: User },
    { name: "Experience", id: "experience", icon: Briefcase },
    { name: "Certifications", id: "certifications", icon: Award },
    { name: "Projects", id: "projects", icon: Code },
    { name: "Skills", id: "skills", icon: Zap },
    { name: "Contact", id: "contact", icon: Mail },
];

export default function Header({
    show,
    isChatOpen,
    onChatOpen,
}: {
    show: boolean;
    isChatOpen: boolean;
    onChatOpen: (rect: DOMRect) => void;
}) {
    const [activeSection, setActiveSection] = useState("");
    const mouseY = useMotionValue(Infinity);

    const scrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) section.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { threshold: 0.5 }
        );
        navLinks.forEach((link) => {
            const section = document.getElementById(link.id);
            if (section) observer.observe(section);
        });
        return () => observer.disconnect();
    }, []);

    return (
        <motion.header
            initial={{ x: -100, y: "-60%", opacity: 0 }}
            animate={show ? { x: 0, y: activeSection === "skills" ? "10%" : "-50%", opacity: 1 } : { x: -100, y: "-50%", opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed left-4 md:left-6 top-1/2 z-[98] pointer-events-none"
        >
            <motion.div
                onMouseMove={(e) => mouseY.set(e.clientY)}
                onMouseLeave={() => mouseY.set(Infinity)}
                className="pointer-events-auto flex flex-col items-center gap-2 p-2 rounded-full border border-white/10 bg-black/20 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]"
            >
                {navLinks.map((item) => (
                    <DockItem
                        key={item.id}
                        item={item}
                        mouseY={mouseY}
                        isActive={activeSection === item.id}
                        onClick={() => scrollToSection(item.id)}
                    />
                ))}

                {/* Divider */}
                <div className="w-5 h-px bg-white/10 my-1" />

                {/* AI Chat Icon - at the bottom of the dock */}
                <AIChatDockItem
                    mouseY={mouseY}
                    isActive={isChatOpen}
                    isSkillsSection={activeSection === "skills"}
                    onChatOpen={onChatOpen}
                />
            </motion.div>
        </motion.header>
    );
}

function DockItem({ item, mouseY, isActive, onClick }: { item: typeof navLinks[0], mouseY: any, isActive: boolean, onClick: () => void }) {
    const ref = useRef<HTMLButtonElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const distance = useTransform(mouseY, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
        return val - bounds.y - bounds.height / 2;
    });

    const scaleTransform = useTransform(distance, [-100, 0, 100], [1, 1.75, 1]);
    const scale = useSpring(scaleTransform, { mass: 0.1, stiffness: 150, damping: 12 });
    const zIndexTransform = useTransform(distance, [-100, 0, 100], [10, 50, 10]);
    const zIndex = useTransform(zIndexTransform, v => Math.round(v));
    const Icon = item.icon;

    return (
        <div className="relative group flex items-center h-10">
            <div className={`absolute left-full ml-4 px-3 py-1.5 rounded-md bg-black/80 border border-white/10 text-white text-sm font-medium whitespace-nowrap transition-all duration-200 pointer-events-none origin-left ${isHovered ? "opacity-100 scale-100 z-50" : "opacity-0 scale-95 z-0"}`}>
                {item.name}
            </div>
            <motion.button
                ref={ref}
                style={{ scale, zIndex }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
                className={`w-10 h-10 origin-center relative flex items-center justify-center rounded-full transition-colors duration-300 ${isActive ? "bg-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/20" : "bg-transparent hover:bg-white/5 border border-transparent"}`}
                aria-label={item.name}
            >
                <Icon className={`w-1/2 h-1/2 transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && <div className="absolute -left-1 w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
            </motion.button>
        </div>
    );
}

function AIChatDockItem({ mouseY, isActive, isSkillsSection, onChatOpen }: { mouseY: any, isActive: boolean, isSkillsSection: boolean, onChatOpen: (rect: DOMRect) => void }) {
    const ref = useRef<HTMLButtonElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const distance = useTransform(mouseY, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
        return val - bounds.y - bounds.height / 2;
    });

    const scaleTransform = useTransform(distance, [-100, 0, 100], [1, 1.75, 1]);
    const scale = useSpring(scaleTransform, { mass: 0.1, stiffness: 150, damping: 12 });
    const zIndexTransform = useTransform(distance, [-100, 0, 100], [10, 50, 10]);
    const zIndex = useTransform(zIndexTransform, v => Math.round(v));

    const handleClick = () => {
        if (ref.current) onChatOpen(ref.current.getBoundingClientRect());
    };

    const shouldGlow = isHovered || isActive || isSkillsSection;
    const showTooltip = isHovered || isActive;

    return (
        <div className="relative group flex items-center h-10">
            <div className={`absolute left-full ml-4 px-3 py-1.5 rounded-md bg-black/80 border border-white/10 text-white text-sm font-medium whitespace-nowrap transition-all duration-200 pointer-events-none origin-left ${showTooltip ? "opacity-100 scale-100 z-50" : "opacity-0 scale-95 z-0"}`}>
                {isActive ? "Close AI" : "AI Assistant"}
            </div>
            <motion.button
                ref={ref}
                style={{ scale, zIndex }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
                aria-label="AI Assistant"
                className={`w-10 h-10 origin-center relative flex items-center justify-center rounded-full transition-colors duration-300 ${isActive ? "bg-white/10 border border-white/20" : "bg-transparent hover:bg-white/5 border border-transparent"}`}
            >
                {shouldGlow && (
                    <GlowEffect
                        colors={isActive
                            ? ["#4285f4", "#9c27b0", "#ea4335", "#fbbc05", "#34a853"]
                            : isSkillsSection 
                                ? ["#ff0055", "#00ffaa"] // Skills section specific glow
                                : ["#38bdf8", "#a855f7"]}
                        mode="colorShift"
                        blur="soft"
                        duration={isActive ? 4 : 2}
                        scale={isActive ? 1.1 : 0.85}
                    />
                )}
                <MessageCircle
                    className={`w-1/2 h-1/2 relative z-10 transition-colors ${isActive || isSkillsSection ? "text-white" : "text-gray-400 group-hover:text-white"}`}
                    strokeWidth={isActive || isSkillsSection ? 2.5 : 2}
                />
                {isActive && (
                    <motion.div
                        layoutId="ai-active-dot"
                        className="absolute -left-1 w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                    />
                )}
            </motion.button>
        </div>
    );
}
