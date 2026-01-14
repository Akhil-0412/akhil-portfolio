"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";

const skills = [
    "Python", "TensorFlow", "PyTorch", "RAG", "LangChain",
    "React", "Next.js", "TypeScript", "Node.js", "Tailwind",
    "Docker", "AWS", "Azure", "Git", "Linux",
    "GenAI", "MicroPython", "Game Theory", "OpenCV", "Redis",
    "PostgreSQL", "MongoDB", "FastAPI", "Flask", "Keras"
];

export default function SkillsGlobe() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Configuration
    const radius = 300; // Radius of the globe
    const rotateSpeed = 1.0; // Base rotation speed

    // State for rotation
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    // Calculate 3D positions once
    const tags = useMemo(() => {
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

        return skills.map((skill, i) => {
            const y = 1 - (i / (skills.length - 1)) * 2; // y goes from 1 to -1
            const radiusAtY = Math.sqrt(1 - y * y); // radius at y

            const theta = phi * i; // Golden angle increment

            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;

            return { skill, x, y, z };
        });
    }, []);

    // Animation Loop
    useEffect(() => {
        let animationFrameId: number;

        const animate = () => {
            if (!isHovered) {
                setRotation((prev) => ({
                    x: prev.x + 0.002 * rotateSpeed,
                    y: prev.y + 0.003 * rotateSpeed,
                }));
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrameId);
    }, [isHovered]);

    return (
        <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
            <div className="z-10 text-center mb-12">
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500"
                >
                    Technical Skills
                </motion.h3>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-gray-400 mt-4 max-w-lg mx-auto"
                >
                    A constellation of technologies I work with.
                </motion.p>
            </div>

            <div
                ref={containerRef}
                className="relative w-full max-w-[600px] aspect-square flex items-center justify-center perspective-1000"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {tags.map((tag, i) => {
                    // Apply rotation
                    const cosX = Math.cos(rotation.x);
                    const sinX = Math.sin(rotation.x);
                    const cosY = Math.cos(rotation.y);
                    const sinY = Math.sin(rotation.y);

                    // Rotate around Y axis
                    let x = tag.x * cosY - tag.z * sinY;
                    let z = tag.z * cosY + tag.x * sinY;

                    // Rotate around X axis
                    let y = tag.y * cosX - z * sinX;
                    z = z * cosX + tag.y * sinX;

                    // Perspective scale
                    const scale = (radius + z * radius) / (radius * 2); // Simple z-buffering fake
                    const opacity = (z + 1) / 2; // Fade out back items
                    const fontSize = 12 + 14 * opacity; // Scale font size

                    // Project to 2D
                    const translateX = x * radius;
                    const translateY = y * radius;

                    return (
                        <motion.div
                            key={tag.skill}
                            className="absolute transform-gpu cursor-default will-change-transform"
                            style={{
                                transform: `translate(${translateX}px, ${translateY}px) scale(${1 + opacity * 0.5})`,
                                opacity: Math.max(0.1, opacity),
                                zIndex: Math.round(z * 100),
                            }}
                        >
                            <span
                                className={`
                  font-medium px-3 py-1 rounded-full whitespace-nowrap transition-colors duration-300
                  ${opacity > 0.8 ? 'text-white bg-white/10 border border-white/20 backdrop-blur-sm shadow-lg' : 'text-gray-500'}
                `}
                                style={{ fontSize: `${fontSize}px` }}
                            >
                                {tag.skill}
                            </span>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
