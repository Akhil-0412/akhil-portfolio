"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, ExternalLink, Github, Play } from "lucide-react";
import useProjectStore from "../store/useProjectStore";

interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    longDescription: string;
    tech: string[];
    link?: string;
    github?: string;
    image?: string;
    glowColor?: string;
}

const projects: Project[] = [
    {
        id: "f1-podium-predictor",
        title: "FormulAI F1",
        category: "Machine Learning",
        description: "Multi-stage ML pipeline for predicting Formula 1 podium finishers.",
        longDescription: "Engineered an advanced prediction system leveraging XGBoost, LightGBM, and Bayesian Updating to forecast F1 race outcomes. Integrates multiple data sources and Monte Carlo simulations for realtime constraint enforcement.",
        tech: ["Python", "XGBoost", "LightGBM", "Optuna", "FastAPI", "React", "Next.js"],
        link: "https://formulai-f1.vercel.app",
        github: "https://github.com/Akhil-0412/FormulAI",
        image: "/projects/F1.png",
        glowColor: "rgba(255, 0, 60, 0.6)", // Neon Red
    },
    {
        id: "compliance-analyst",
        title: "Compliance Analyst",
        category: "Enterprise AI",
        description: "Multi-agent system for automated regulatory compliance and auditing.",
        longDescription: "Architected a sophisticated multi-agent system designed to automate complex regulatory compliance tasks. The agent evaluates documents against strict financial and legal regulations, ensuring adherence to compliance rules with full audit trails and minimizing risk.",
        tech: ["Python", "FastAPI", "React", "Next.js", "LangChain"],
        link: "https://compliance-analyst-agent.vercel.app",
        github: "https://github.com/Akhil-0412/Compliance-Analyst-Agent",
        image: "/projects/Compliance.png",
        glowColor: "rgba(0, 229, 255, 0.6)", // Neon Blue
    },
    {
        id: "ai-hotel-receptionist",
        title: "Crown & Crest Hotel AI",
        category: "Generative AI & Voice",
        description: "An AI voice receptionist for hotels that handles real bookings and invoices over WebRTC.",
        longDescription: "Engineered a real-time voice agent using LiveKit, Groq STT, Cartesia TTS, and Google Gemini via LangGraph. The agent autonomously orchestrates backend tools via FastMCP to check room availability, execute bookings, query FAQs, and generate branded HTML invoices delivered via SMTP - all through natural spoken conversation.",
        tech: ["Python", "LiveKit", "LangGraph", "Gemini", "FastMCP", "WebRTC"],
        link: "https://frontend-pi-rouge-28.vercel.app/",
        github: "https://github.com/Akhil-0412/Hotel-Receptionist",
        image: "/projects/HotelReceptionist.png",
        glowColor: "rgba(255, 215, 0, 0.6)", // Golden
    },
    {
        id: "smart-saas",
        title: "Autognosis",
        category: "Full Stack Web",
        description: "Modern, AI-driven SaaS dashboard with advanced analytics.",
        longDescription: "Developed a comprehensive Next.js-based SaaS dashboard featuring real-time analytics, user management, and AI-driven diagnostics. Integrated advanced data visualization, secure authentication, and scalable backend services to handle complex business operations seamlessly.",
        tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        link: "https://smart-saas-frontend.vercel.app",
        github: "https://github.com/Akhil-0412/Smart_Saas_Dashboard",
        image: "/projects/Autognosis.png",
        glowColor: "rgba(255, 102, 0, 0.6)", // Neon Orange
    },
    {
        id: "pulse-project",
        title: "PULSE : Dissertation",
        category: "Healthcare AI & DSP",
        description: "Advanced signal processing on Photoplethysmography data.",
        longDescription: "Developed a comprehensive digital signal processing pipeline for analyzing PPG data, focusing on noise reduction, feature extraction, and machine learning classification for physiological monitoring.",
        tech: ["Python", "DSP", "Machine Learning", "Data Visualization"],
        link: "#",
        github: "#",
        image: "/projects/pulse.png",
        glowColor: "rgba(0, 255, 51, 0.6)", // Neon Green
    }
];

type Corner = "tl" | "tr" | "bl" | "br";

interface CornerConfig {
    wrapper: React.CSSProperties;
    hBar: React.CSSProperties;
    vBar: React.CSSProperties;
    textPos: { justify: string; align: string; pad: string };
}

const cornerConfigs: Record<Corner, CornerConfig> = {
    tl: {
        wrapper: { top: 0, left: 0, width: "50%", height: "50%", transformOrigin: "top left" },
        hBar: { top: 0, left: 0, width: "100%", height: "var(--arm)", borderTopLeftRadius: 16 },
        vBar: { top: "var(--arm)", left: 0, width: "var(--arm)", bottom: 0 },
        textPos: { justify: "justify-end", align: "items-start", pad: "pl-5 pb-4 pr-4" },
    },
    tr: {
        wrapper: { top: 0, right: 0, width: "50%", height: "50%", transformOrigin: "top right" },
        hBar: { top: 0, left: 0, width: "100%", height: "var(--arm)", borderTopRightRadius: 16 },
        vBar: { top: "var(--arm)", right: 0, width: "var(--arm)", bottom: 0 },
        textPos: { justify: "justify-end", align: "items-end", pad: "pr-5 pb-4 pl-4" },
    },
    bl: {
        wrapper: { bottom: 0, left: 0, width: "50%", height: "50%", transformOrigin: "bottom left" },
        hBar: { bottom: 0, left: 0, width: "100%", height: "var(--arm)", borderBottomLeftRadius: 16 },
        vBar: { top: 0, left: 0, width: "var(--arm)", bottom: "var(--arm)" },
        textPos: { justify: "justify-start", align: "items-start", pad: "pl-5 pt-4 pr-4" },
    },
    br: {
        wrapper: { bottom: 0, right: 0, width: "50%", height: "50%", transformOrigin: "bottom right" },
        hBar: { bottom: 0, left: 0, width: "100%", height: "var(--arm)", borderBottomRightRadius: 16 },
        vBar: { top: 0, right: 0, width: "var(--arm)", bottom: "var(--arm)" },
        textPos: { justify: "justify-start", align: "items-end", pad: "pr-5 pt-4 pl-4" },
    },
};

const itemVariant = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as any } }
};

export default function ProjectsExplorer() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Debounced hover reset: prevents robot twitching when moving between cards
    const hoverResetTimer = useRef<NodeJS.Timeout | null>(null);

    const setHoveredWithDebounce = useCallback((id: string | null) => {
        if (hoverResetTimer.current) {
            clearTimeout(hoverResetTimer.current);
            hoverResetTimer.current = null;
        }
        if (id !== null) {
            // Immediate set when hovering a card
            useProjectStore.getState().setHoveredProject(id);
        } else {
            // Debounce the null (leaving a card) by 80ms
            hoverResetTimer.current = setTimeout(() => {
                useProjectStore.getState().setHoveredProject(null);
            }, 80);
        }
    }, []);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (hoverResetTimer.current) clearTimeout(hoverResetTimer.current);
            useProjectStore.getState().setHoveredProject(null);
        };
    }, []);

    const corners: { project: Project; corner: Corner }[] = [
        { project: projects[0], corner: "tl" },
        { project: projects[1], corner: "tr" },
        { project: projects[3], corner: "bl" },
        { project: projects[4], corner: "br" },
    ];

    return (
        <section className="relative px-4 md:px-8 py-24 overflow-hidden">
            <div className="max-w-5xl mx-auto">


                <div className="relative mx-auto w-full max-w-[1056px]">
                    <div
                        className="hidden md:block w-full relative"
                        onMouseLeave={() => setHoveredWithDebounce(null)}
                        style={{
                            "--arm": "clamp(110px, 16vw, 170px)",
                            aspectRatio: "4 / 3",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 16,
                        } as React.CSSProperties}
                    >
                        {corners.map(({ project, corner }) => (
                            <LCornerCard
                                key={project.id}
                                project={project}
                                corner={corner}
                                expandedId={expandedId}
                                setExpandedId={setExpandedId}
                                setHoveredWithDebounce={setHoveredWithDebounce}
                            />
                        ))}

                        <CenterCard
                            project={projects[2]}
                            expandedId={expandedId}
                            setExpandedId={setExpandedId}
                            setHoveredWithDebounce={setHoveredWithDebounce}
                        />
                    </div>

                    <div className="md:hidden flex flex-col gap-3">
                        {[projects[2], ...projects.filter((_, i) => i !== 2)].map(p => (
                            <motion.button
                                layoutId={`card-${p.id}`}
                                key={p.id}
                                onClick={() => setExpandedId(p.id === expandedId ? null : p.id)}
                                className="text-left w-full rounded-xl bg-white/[0.03] border border-white/10 p-5 transition-colors relative overflow-hidden"
                            >
                                {p.image && (
                                    <motion.div 
                                        className="absolute inset-0" 
                                        style={{ 
                                            backgroundImage: `url(${p.image})`, 
                                            backgroundSize: "cover", 
                                            backgroundPosition: "center"
                                        }} 
                                        animate={{ opacity: expandedId === p.id ? 1 : 0.6 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                                <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.7)" }} />
                                <div className="relative z-10">
                                    <p className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold mb-1">{p.category}</p>
                                    <h4 className="text-base font-bold text-white">{p.title}</h4>
                                    <AnimatePresence>
                                        {expandedId === p.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-4"
                                            >
                                                <p className="text-sm text-gray-300 mb-4">{p.description}</p>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {p.tech.map(t => (
                                                        <span key={t} className="px-2 py-1 rounded bg-white/10 text-[10px] text-white">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

const springTransition = {
    type: "spring" as const,
    stiffness: 120,
    damping: 20,
};

const getInverseOffset = (barCfg: React.CSSProperties) => {
    const offset: React.CSSProperties = {};
    if (barCfg.top !== undefined) offset.top = barCfg.top === 0 ? 0 : `calc(-1 * ${barCfg.top})`;
    if (barCfg.bottom !== undefined) offset.bottom = barCfg.bottom === 0 ? 0 : `calc(-1 * ${barCfg.bottom})`;
    if (barCfg.left !== undefined) offset.left = barCfg.left === 0 ? 0 : `calc(-1 * ${barCfg.left})`;
    if (barCfg.right !== undefined) offset.right = barCfg.right === 0 ? 0 : `calc(-1 * ${barCfg.right})`;
    return offset;
};

function LCornerCard({
    project,
    corner,
    expandedId,
    setExpandedId,
    setHoveredWithDebounce,
}: {
    project: Project;
    corner: Corner;
    expandedId: string | null;
    setExpandedId: (id: string | null) => void;
    setHoveredWithDebounce: (id: string | null) => void;
}) {
    const [hoverState, setHoverState] = useState<"idle" | "stage1">("idle");
    const [phase, setPhase] = useState<"idle" | "expanded" | "collapsing">("idle");
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const cfg = cornerConfigs[corner];

    const isExpanded = expandedId === project.id;

    useEffect(() => {
        if (isExpanded) {
            setPhase("expanded");
        } else if (!isExpanded && phase === "expanded") {
            setPhase("collapsing");
        } else if (!isExpanded && phase === "collapsing") {
            const t = setTimeout(() => {
                setPhase("idle");
            }, 150);
            return () => clearTimeout(t);
        }
    }, [isExpanded, phase]);

    const showContent = phase === "expanded";
    const expandArms = phase === "expanded" || phase === "collapsing";

    const imageStyle: React.CSSProperties = project.image ? {
        backgroundImage: `url(${project.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
    } : {};

    const barBase: React.CSSProperties = {
        position: "absolute",
        cursor: "pointer",
        overflow: "hidden",
    };

    const handleMouseEnter = () => {
        if (isExpanded) return;
        setHoverState("stage1");
        setHoveredWithDebounce(project.id);
        timerRef.current = setTimeout(() => {
            setExpandedId(project.id);
        }, 1000);
    };

    const handleMouseLeave = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setHoverState("idle");
        setHoveredWithDebounce(null);
        if (isExpanded) {
            setExpandedId(null);
        }
    };

    const { justify, align, pad } = cfg.textPos;

    return (
        <motion.div
            style={{ 
                position: "absolute", 
                zIndex: expandArms ? 50 : (hoverState !== "idle" ? 30 : 10), 
                containerType: "size",
                filter: (hoverState !== "idle" || expandArms) && project.glowColor ? `drop-shadow(0 0 20px ${project.glowColor})` : "none",
                ...cfg.wrapper 
            }}
            animate={{
                scale: hoverState === "stage1" && !expandArms ? 1.03 : 1,
                y: hoverState === "stage1" && !expandArms ? -4 : 0,
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => setExpandedId(isExpanded ? null : project.id)}
        >
            {/* Horizontal bar */}
            <motion.div 
                layout
                transition={springTransition}
                id={`hbar-${project.id}`}
                style={{ 
                    ...barBase, 
                    ...cfg.hBar, 
                    height: expandArms ? "100%" : cfg.hBar.height,
                    borderTopLeftRadius: expandArms ? 16 : (cfg.hBar.borderTopLeftRadius || 0),
                    borderTopRightRadius: expandArms ? 16 : (cfg.hBar.borderTopRightRadius || 0),
                    borderBottomLeftRadius: expandArms ? 16 : (cfg.hBar.borderBottomLeftRadius || 0),
                    borderBottomRightRadius: expandArms ? 16 : (cfg.hBar.borderBottomRightRadius || 0),
                    zIndex: 20 
                }}
            >
                {/* Fixed background decoupled from animated container size */}
                <motion.div
                    layout
                    transition={springTransition}
                    style={{
                        position: "absolute",
                        ...getInverseOffset(cfg.hBar),
                        width: "100cqw",
                        height: "100cqh",
                        ...imageStyle
                    }}
                    animate={{ opacity: hoverState !== "idle" || expandArms ? 1 : 0.6 }}
                >
                    {/* Persistent overlay nested inside the fixed-size container */}
                    <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} />
                </motion.div>
                
                {/* Secondary Content - Mounts via AnimatePresence */}
                <AnimatePresence>
                    {showContent && (
                        <motion.div 
                            className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        />
                    )}
                </AnimatePresence>

                <div className={`absolute inset-0 z-10 flex flex-col ${justify} ${align} ${expandArms ? "p-8" : pad} transition-all duration-300`}>
                    <p className="text-[9px] uppercase tracking-widest text-gray-400 font-medium leading-none mb-1">
                        {project.category}
                    </p>
                    <h4 className={`font-bold text-white leading-tight ${expandArms ? "text-2xl mb-4" : "text-sm"}`}>
                        {project.title}
                    </h4>

                    <AnimatePresence>
                        {showContent && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                                className="flex flex-col gap-4 max-w-sm"
                            >
                                <p className="text-sm text-gray-200">{project.longDescription || project.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {project.tech.map(t => (
                                        <span key={t} className="px-2 py-1 rounded bg-white/10 text-white text-[10px] border border-white/10">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-3 mt-2 pointer-events-auto">
                                    {project.link && (
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-gray-200 transition-colors">
                                            <Play className="w-3 h-3" /> Demo
                                        </a>
                                    )}
                                    {project.github && (
                                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white font-semibold text-xs hover:bg-white/20 transition-colors border border-white/10">
                                            <Github className="w-3 h-3" /> Source
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Vertical bar */}
            <motion.div 
                layout
                transition={springTransition}
                id={`vbar-${project.id}`}
                style={{ 
                    ...barBase, 
                    ...cfg.vBar, 
                    width: expandArms ? "100%" : cfg.vBar.width,
                    borderTopLeftRadius: expandArms ? 16 : (cfg.vBar.borderTopLeftRadius || 0),
                    borderTopRightRadius: expandArms ? 16 : (cfg.vBar.borderTopRightRadius || 0),
                    borderBottomLeftRadius: expandArms ? 16 : (cfg.vBar.borderBottomLeftRadius || 0),
                    borderBottomRightRadius: expandArms ? 16 : (cfg.vBar.borderBottomRightRadius || 0),
                    zIndex: 10 
                }}
            >
                <motion.div
                    layout
                    transition={springTransition}
                    style={{
                        position: "absolute",
                        ...getInverseOffset(cfg.vBar),
                        width: "100cqw",
                        height: "100cqh",
                        ...imageStyle
                    }}
                    animate={{ opacity: hoverState !== "idle" || expandArms ? 1 : 0.6 }}
                >
                    <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} />
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────
//  CENTER FEATURED CARD
//  Sits in the exact negative-space hole carved by the 4 L arms.
//  No grid involvement — purely top/left/right/bottom: var(--arm)
// ─────────────────────────────────────────────────────────
function CenterCard({
    project,
    expandedId,
    setExpandedId,
    setHoveredWithDebounce,
}: {
    project: Project;
    expandedId: string | null;
    setExpandedId: (id: string | null) => void;
    setHoveredWithDebounce: (id: string | null) => void;
}) {
    const [hoverState, setHoverState] = useState<"idle" | "stage1">("idle");
    const [phase, setPhase] = useState<"idle" | "expanded" | "collapsing">("idle");
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const isExpanded = expandedId === project.id;

    useEffect(() => {
        if (isExpanded) {
            setPhase("expanded");
        } else if (!isExpanded && phase === "expanded") {
            setPhase("collapsing");
        } else if (!isExpanded && phase === "collapsing") {
            const t = setTimeout(() => {
                setPhase("idle");
            }, 150);
            return () => clearTimeout(t);
        }
    }, [isExpanded, phase]);

    const showContent = phase === "expanded";
    const expandArms = phase === "expanded" || phase === "collapsing";

    const handleMouseEnter = () => {
        if (isExpanded) return;
        setHoverState("stage1");
        setHoveredWithDebounce(project.id);
        timerRef.current = setTimeout(() => {
            setExpandedId(project.id);
        }, 1000);
    };

    const handleMouseLeave = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setHoverState("idle");
        setHoveredWithDebounce(null);
        if (isExpanded) {
            setExpandedId(null);
        }
    };

    return (
        <motion.div
            className="absolute overflow-hidden cursor-pointer"
            style={{
                borderRadius: expandArms ? 16 : 12,
                zIndex: expandArms ? 50 : (hoverState !== "idle" ? 30 : 10),
                filter: (hoverState !== "idle" || expandArms) && project.glowColor ? `drop-shadow(0 0 20px ${project.glowColor})` : "none"
            }}
            animate={{
                top: expandArms ? 0 : "var(--arm)",
                left: expandArms ? 0 : "var(--arm)",
                right: expandArms ? 0 : "var(--arm)",
                bottom: expandArms ? 0 : "var(--arm)",
                scale: hoverState === "stage1" && !expandArms ? 1.03 : 1,
                y: hoverState === "stage1" && !expandArms ? -4 : 0,
            }}
            transition={springTransition}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => setExpandedId(isExpanded ? null : project.id)}
        >
            {project.image && (
                <motion.div 
                    className="absolute inset-0 z-0" 
                    style={{
                        backgroundImage: `url(${project.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }} 
                    animate={{ opacity: hoverState !== "idle" || expandArms ? 1 : 0.6 }}
                    transition={{ duration: 0.3 }}
                />
            )}
            {/* Persistent background overlays */}
            <div className="absolute inset-0 z-0" style={{ background: "rgba(0,0,0,0.52)" }} />
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Secondary Content - Mounts via AnimatePresence */}
            <AnimatePresence>
                {showContent && (
                    <motion.div 
                        className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                )}
            </AnimatePresence>

            {/* Content */}
            <div className={`relative z-10 flex flex-col h-full ${expandArms ? "p-12 justify-center items-center text-center" : "p-6 justify-end"} transition-all duration-300`}>
                <motion.span
                    animate={{ opacity: hoverState !== "idle" || expandArms ? 1 : 0.8 }}
                    className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold mb-2"
                >
                    Featured
                </motion.span>
                <h4 className={`font-bold text-white leading-tight ${expandArms ? "text-4xl md:text-5xl mb-4" : "text-xl md:text-2xl mb-1"}`}>
                    {project.title}
                </h4>

                <AnimatePresence>
                    {showContent && (
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="flex flex-col items-center gap-6 max-w-2xl"
                        >
                            <p className="text-gray-200 text-sm md:text-lg">{project.longDescription}</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {project.tech.map(t => (
                                    <span key={t} className="px-3 py-1.5 rounded-full bg-white/10 text-white text-xs border border-white/10">
                                        {t}
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-4 mt-2 pointer-events-auto">
                                {project.link && (
                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors">
                                        <Play className="w-4 h-4" /> Live Demo
                                    </a>
                                )}
                                {project.github && (
                                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors border border-white/10">
                                        <Github className="w-4 h-4" /> Source Code
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
