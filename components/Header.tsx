"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { User, Briefcase, Award, Code, Zap, Mail, MessageCircle } from "lucide-react";
import { GlowEffect } from "@/components/motion-primitives/glow-effect";
import GlassSurface from "@/components/GlassSurface";
import useNavStore, { SectionId } from "@/store/useNavStore";

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
    onChatClose,
}: {
    show: boolean;
    isChatOpen: boolean;
    onChatOpen: (rect: DOMRect) => void;
    onChatClose: () => void;
}) {
    // Shared with HeroRobot via useNavStore — the robot lives in an unrelated
    // branch of the tree and needs to know which section is active to hold its
    // per-section pose (see SECTION_POSES in HeroRobot.tsx).
    const activeSection = useNavStore((s) => s.activeSection);
    const mouseX = useMotionValue(Infinity);

    const scrollToSection = (id: string) => {
        // Any other dock item takes over immediately: drop AI mode and head
        // straight for the section instead of leaving the chat stranded open.
        if (isChatOpen) onChatClose();
        const section = document.getElementById(id);
        if (section) section.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        useNavStore.getState().setActiveSection(entry.target.id as SectionId);
                    }
                });
            },
            { threshold: 0.5 }
        );
        // "hero" has no dock icon so it isn't in navLinks, but it still has to
        // be observed. Without it nothing ever sets activeSection back to
        // 'hero' when you scroll to the top, so the robot stays stuck in
        // whatever side pose it last had instead of returning to centre.
        ["hero", ...navLinks.map((link) => link.id)].forEach((id) => {
            const section = document.getElementById(id);
            if (section) observer.observe(section);
        });
        return () => observer.disconnect();
    }, []);

    return (
        <motion.header
            initial={{ y: 110, opacity: 0 }}
            animate={show ? { y: 0, opacity: 1 } : { y: 110, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            /* Full-width flex row centres the dock without a transform, so
               framer-motion's y animation has the transform property to itself. */
            className="fixed bottom-5 md:bottom-7 left-0 right-0 z-[98] flex justify-center pointer-events-none"
        >
            <motion.div
                onMouseMove={(e) => mouseX.set(e.clientX)}
                onMouseLeave={() => mouseX.set(Infinity)}
                className="relative pointer-events-auto flex flex-row items-center gap-2 p-2 rounded-full border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.55)]"
            >
                <GlassSurface />
                <div className="relative z-10 flex flex-row items-center gap-2">
                    {navLinks.map((item) => (
                        <DockItem
                            key={item.id}
                            item={item}
                            mouseX={mouseX}
                            isActive={activeSection === item.id}
                            onClick={() => scrollToSection(item.id)}
                        />
                    ))}

                    {/* Divider */}
                    <div className="h-5 w-px bg-white/10 mx-1" />

                    {/* AI Chat Icon - at the trailing end of the dock */}
                    <AIChatDockItem
                        mouseX={mouseX}
                        isActive={isChatOpen}
                        isSkillsSection={activeSection === "skills"}
                        onChatOpen={onChatOpen}
                    />
                </div>
            </motion.div>
        </motion.header>
    );
}

function DockItem({ item, mouseX, isActive, onClick }: { item: typeof navLinks[0], mouseX: any, isActive: boolean, onClick: () => void }) {
    const ref = useRef<HTMLButtonElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const scaleTransform = useTransform(distance, [-100, 0, 100], [1, 1.75, 1]);
    const scale = useSpring(scaleTransform, { mass: 0.1, stiffness: 150, damping: 12 });
    const zIndexTransform = useTransform(distance, [-100, 0, 100], [10, 50, 10]);
    const zIndex = useTransform(zIndexTransform, v => Math.round(v));
    const Icon = item.icon;

    return (
        <div className="relative group flex items-end justify-center w-10 h-10">
            <div className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-md bg-black/80 border border-white/10 text-white text-sm font-medium whitespace-nowrap transition-all duration-200 pointer-events-none origin-bottom ${isHovered ? "opacity-100 scale-100 z-50" : "opacity-0 scale-95 z-0"}`}>
                {item.name}
            </div>
            <motion.button
                ref={ref}
                style={{ scale, zIndex }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
                className={`w-10 h-10 origin-bottom relative flex items-center justify-center rounded-full transition-colors duration-300 ${isActive ? "bg-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/20" : "bg-transparent hover:bg-white/5 border border-transparent"}`}
                aria-label={item.name}
            >
                <Icon className={`w-1/2 h-1/2 transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
            </motion.button>
        </div>
    );
}

function AIChatDockItem({ mouseX, isActive, isSkillsSection, onChatOpen }: { mouseX: any, isActive: boolean, isSkillsSection: boolean, onChatOpen: (rect: DOMRect) => void }) {
    const ref = useRef<HTMLButtonElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const scaleTransform = useTransform(distance, [-100, 0, 100], [1, 1.75, 1]);
    const scale = useSpring(scaleTransform, { mass: 0.1, stiffness: 150, damping: 12 });
    const zIndexTransform = useTransform(distance, [-100, 0, 100], [10, 50, 10]);
    const zIndex = useTransform(zIndexTransform, v => Math.round(v));

    const handleClick = () => {
        if (ref.current) onChatOpen(ref.current.getBoundingClientRect());
    };

    const shouldGlow = isHovered || isActive || isSkillsSection;

    return (
        <div className="relative group flex items-end justify-center w-10 h-10">
            <div className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-md bg-black/80 border border-white/10 text-white text-sm font-medium whitespace-nowrap transition-all duration-200 pointer-events-none origin-bottom ${isHovered ? "opacity-100 scale-100 z-50" : "opacity-0 scale-95 z-0"}`}>
                AI Assistant
            </div>
            <motion.button
                ref={ref}
                style={{ scale, zIndex }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
                aria-label="AI Assistant"
                className={`w-10 h-10 origin-bottom relative flex items-center justify-center rounded-full transition-colors duration-300 ${isActive ? "bg-white/10 border border-white/20" : "bg-transparent hover:bg-white/5 border border-transparent"}`}
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
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                    />
                )}
            </motion.button>
        </div>
    );
}
