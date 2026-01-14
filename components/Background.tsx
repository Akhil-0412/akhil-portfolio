"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function Background() {
    const { scrollY } = useScroll();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Transform gradient opacity/position based on scroll
    const opacity = useTransform(scrollY, [0, 500], [1, 0.4]);
    const scale = useTransform(scrollY, [0, 500], [1, 1.5]);
    const rotate = useTransform(scrollY, [0, 800], [0, 45]);

    const indigoOpacity = useTransform(scrollY, [0, 300], [0, 0.2]);
    const indigoScale = useTransform(scrollY, [0, 500], [0.8, 1.2]);

    if (!isMounted) return null;

    return (
        <div className="fixed inset-0 -z-10 bg-black overflow-hidden pointer-events-none">
            {/* NOISE TEXTURE */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* CYAN ORB - Top Left */}
            <motion.div
                style={{ opacity, scale, rotate }}
                className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full blur-[120px] bg-gradient-to-br from-cyan-900/40 to-transparent"
                animate={{
                    x: [0, 30, 0],
                    y: [0, 40, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
            />

            {/* PURPLE ORB - Bottom Right */}
            <motion.div
                style={{ opacity }}
                className="absolute bottom-0 right-0 w-[60vw] h-[60vw] rounded-full blur-[100px] bg-gradient-to-tl from-purple-900/30 to-transparent"
                animate={{
                    x: [0, -40, 0],
                    y: [0, -30, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: 1
                }}
            />

            {/* INDIGO ACCENT - Center/Floating */}
            <motion.div
                style={{
                    opacity: indigoOpacity,
                    scale: indigoScale
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full blur-[120px] bg-indigo-900/20"
            />
        </div>
    );
}
