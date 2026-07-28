"use client";

import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroRobot = dynamic(() => import("./HeroRobot"), { ssr: false });

const ROLES = [
    "AI & Systems Architect",
    "SWE",
    "AIE",
    "Automations Eng",
    "Data & Ops Eng"
];

export default function Hero({ isChatOpen = false }: { isChatOpen?: boolean }) {
    const [roleIndex, setRoleIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center select-none">
            
            {/* LAYER 1 (BEHIND): Fixed 3D Robot Canvas (On screen all the time) */}
            <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="w-full h-full pointer-events-auto">
                    <HeroRobot />
                </div>
            </div>

            {/* LAYER 2 (FRONT): Viewport-spanning Giant Headline Text */}
            <motion.div 
                initial={false}
                animate={{ opacity: isChatOpen ? 0 : 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-12 md:p-16 pointer-events-none"
            >
                
                {/* Eyebrow Label Top-Left */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex items-center gap-2"
                >
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                    <div className="relative h-6 overflow-hidden flex items-center min-w-[200px]">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={roleIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="text-xs sm:text-sm uppercase tracking-widest text-green-400/90 font-mono font-semibold block absolute left-0"
                            >
                                {ROLES[roleIndex]}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Giant Full-Width Headline Text (positioned IN FRONT of robot) */}
                <div className="w-full text-center flex flex-col items-center justify-center my-auto py-2">
                    <motion.h1
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            duration: 0.9,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] font-extrabold tracking-tighter leading-none uppercase font-sans drop-shadow-2xl"
                        style={{
                            WebkitTextStroke: "2px rgba(34, 197, 94, 0.9)",
                            color: "rgba(34, 197, 94, 0.15)",
                        }}
                    >
                        <motion.span
                            animate={{
                                textShadow: [
                                    "0 0 15px rgba(34,197,94,0.6)",
                                    "0 0 40px rgba(34,197,94,1)",
                                    "0 0 15px rgba(34,197,94,0.6)",
                                ],
                            }}
                            transition={{
                                duration: 4,
                                ease: "easeInOut",
                                repeat: Infinity,
                                repeatType: "mirror",
                            }}
                            className="inline-block"
                        >
                            AKHILESHWAR
                        </motion.span>
                    </motion.h1>
                </div>

                {/* Scroll Down Indicator */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="flex justify-center w-full pb-8 pointer-events-none"
                >
                    <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="flex flex-col items-center"
                    >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-400 drop-shadow-[0_0_12px_rgba(34,197,94,1)]">
                            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-400 drop-shadow-[0_0_12px_rgba(34,197,94,1)] -mt-6">
                            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </motion.div>
                </motion.div>
            </motion.div>

        </section>
    );
}
