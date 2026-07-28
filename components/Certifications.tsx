"use client";

import { motion, PanInfo } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GlowEffect } from "@/components/motion-primitives/glow-effect";
import { TextScramble } from "@/components/core/text-scramble";
import useCertStore from "../store/useCertStore";

interface Certification {
    id: string;
    title: string;
    src: string;
    link: string;
}

const certifications: Certification[] = [
    {
        id: "aws",
        title: "AWS Certified Cloud Practitioner",
        src: "/certifications/AWS_CLoud.jpg",
        link: "#",
    },
    {
        id: "claude-bedrock",
        title: "Claude Amazon Bedrock",
        src: "/certifications/Claude_Amazon_Bedrock.jpg",
        link: "https://verify.skilljar.com/c/2ohsom2bwap8",
    },
    {
        id: "claude-vertex",
        title: "Claude Google Vertex AI",
        src: "/certifications/Claude_Google_Vertex_AI.jpg",
        link: "https://verify.skilljar.com/c/ztpewafmcmy5",
    },
    {
        id: "github",
        title: "GitHub Copilot",
        src: "/certifications/GitHubCopilot_Badge.jpg",
        link: "https://www.credly.com/go/1DY4MYKK",
    },
    {
        id: "google-ai",
        title: "Google AI Essentials",
        src: "/certifications/Google_AI.jpg",
        link: "https://coursera.org/verify/HJV7ITUANWYO",
    },
    {
        id: "ibm",
        title: "AI Fundamentals (IBM)",
        src: "/certifications/IBM.png",
        link: "#",
    },
    {
        id: "mcp",
        title: "Model Context Protocol",
        src: "/certifications/Model_Context_Protocol.jpg",
        link: "https://verify.skilljar.com/c/y95artudj3wh",
    },
    {
        id: "tavily",
        title: "Tavily Search",
        src: "/certifications/Tavily.png",
        link: "#",
    },
];

// Safe modulo — prevents negative remainders
const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function Certifications() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const hasDragged = useRef(false);
    
    const triggerSwipe = useCertStore((state) => state.triggerSwipe);
    
    const handleNext = () => {
        triggerSwipe('right');
        setCurrentIndex((prev) => prev + 1);
    };
    const handlePrev = () => {
        triggerSwipe('left');
        setCurrentIndex((prev) => prev - 1);
    };

    const handleDragStart = () => {
        hasDragged.current = false;
        setIsDragging(true);
    };

    const handleDragEnd = (_e: unknown, info: PanInfo) => {
        setIsDragging(false);
        if (Math.abs(info.offset.x) > 5) hasDragged.current = true;
        if (Math.abs(info.offset.x) > 50) {
            if (info.offset.x < -50) handleNext();
            else handlePrev();
        }
    };

    const handleCardClick = (link: string, isCardActive: boolean) => {
        if (hasDragged.current) { hasDragged.current = false; return; }
        if (isCardActive) window.open(link, "_blank");
    };

    return (
        <section className="relative w-full h-full">
            {/* Full-height flex column — title near top, carousel at hand level */}
            <div className="w-full h-full flex flex-col items-center px-6" style={{ paddingTop: "12vh" }}>

                {/* TITLE */}
                <h3 className="w-full flex justify-start mb-8 md:mb-12 text-5xl md:text-6xl lg:text-7xl font-bold text-white/90 tracking-tighter drop-shadow-2xl px-8 md:px-24 lg:px-40">
                    <TextScramble revealDuration={1200} revealDelay={150}>
                        Certifications
                    </TextScramble>
                </h3>

                {/* CAROUSEL — sits lower, aligned precisely with robot hands */}
                <div
                    className="relative h-[380px] md:h-[480px] flex items-center justify-center w-full max-w-5xl mx-auto overflow-visible"
                    style={{ marginTop: "12vh" }}
                >
                    {/* LEFT ARROW */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 md:-left-8 z-30 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all backdrop-blur-md border border-white/10 hidden md:flex items-center justify-center"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* CARD TRACK */}
                    <div
                        className="relative w-full h-full flex items-center justify-center overflow-visible"
                        style={{
                            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 22%, black 78%, transparent 100%)",
                            maskImage: "linear-gradient(to right, transparent 0%, black 22%, black 78%, transparent 100%)",
                        }}
                    >
                        {certifications.map((cert, index) => {
                            const N = certifications.length;
                            const half = Math.floor(N / 2);
                            const rel = mod(index - currentIndex + half, N) - half;

                            const xOffset = `${rel * 105}%`;
                            const scale = rel === 0 ? 1 : 0.85;
                            const opacity = rel === 0 ? 1 : 0.3;
                            const zIndex = rel === 0 ? 20 : 10;
                            const isCardActive = rel === 0;

                            return (
                                <motion.div
                                    key={cert.id}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={1.0}
                                    onPointerDown={() => { hasDragged.current = false; }}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                    onClick={() => handleCardClick(cert.link, isCardActive)}
                                    animate={{ x: xOffset, scale, opacity, zIndex }}
                                    variants={{ hover: { y: -5 } }}
                                    whileHover={isCardActive && !isDragging ? "hover" : undefined}
                                    transition={{ type: "spring", stiffness: 100, damping: 25, mass: 0.8 }}
                                    className={`
                                        absolute flex flex-col items-center
                                        w-[280px] md:w-[400px]
                                        ${isCardActive ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"}
                                    `}
                                >
                                    <div className="w-full aspect-[4/3] flex items-center justify-center relative">
                                        <motion.div
                                            className='pointer-events-none absolute inset-[-5%] -z-10'
                                            variants={{
                                                hover: { opacity: 0.4 }
                                            }}
                                            initial={{ opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeOut' }}
                                        >
                                            <GlowEffect
                                                colors={['#0894FF', '#C959DD', '#FF2E54', '#FF9004']}
                                                mode='colorShift'
                                                blur='medium'
                                                duration={4}
                                            />
                                        </motion.div>
                                        <motion.img
                                            src={cert.src}
                                            alt={cert.title}
                                            draggable={false}
                                            animate={{ filter: "drop-shadow(0px 10px 30px rgba(0,0,0,0.6))" }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    <motion.p
                                        animate={{ opacity: isCardActive ? 1 : 0 }}
                                        className="mt-4 text-center text-sm md:text-base font-medium text-white/80 tracking-wide"
                                    >
                                        {cert.title}
                                    </motion.p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* RIGHT ARROW */}
                    <button
                        onClick={handleNext}
                        className="absolute right-0 md:-right-8 z-30 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all backdrop-blur-md border border-white/10 hidden md:flex items-center justify-center"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </section>
    );
}
