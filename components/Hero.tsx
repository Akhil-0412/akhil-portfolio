"use client";

import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">

            <div className="relative text-center">

                {/* NAME WITH BREATHING GLOW */}
                <motion.h1
                    initial={{ scale: 2.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 4, opacity: 0 }}
                    transition={{
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-white"
                >
                    <motion.span
                        animate={{
                            textShadow: [
                                "0 0 6px rgba(56,189,248,0.25)",
                                "0 0 18px rgba(56,189,248,0.55)",
                                "0 0 6px rgba(56,189,248,0.25)",
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
                        Akhileshwar Sanathana
                    </motion.span>
                </motion.h1>


                {/* ROLE */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-6 text-gray-300 text-lg md:text-xl"
                >
                    AI Graduate
                </motion.p>

            </div>

        </section>
    );
}
