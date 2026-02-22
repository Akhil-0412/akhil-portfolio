"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, MouseEvent } from "react";
import { X, ExternalLink, Github } from "lucide-react";

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
}

const projects: Project[] = [
    {
        id: "agentic-compliance",
        title: "Agentic Compliance Agent",
        category: "Enterprise AI",
        description: "Multi-agent system for automated regulatory compliance and auditing.",
        longDescription:
            "Architected a sophisticated multi-agent system designed to automate complex regulatory compliance tasks. The agent evaluates documents against strict financial and legal regulations, ensuring adherence to compliance rules with full audit trails and minimizing risk.",
        tech: ["Python", "FastAPI", "React", "Next.js", "LangChain"],
        link: "https://agentic-compliance.vercel.app",
        github: "https://github.com/Akhil-0412/Agentic_Compliance_Agent_v2",
        image: "/projects/agentic.png",
    },
    {
        id: "smart-saas",
        title: "Smart SaaS Dashboard",
        category: "Full Stack Web",
        description: "Modern, AI-driven SaaS dashboard with advanced analytics.",
        longDescription:
            "Developed a comprehensive Next.js-based SaaS dashboard featuring real-time analytics, user management, and AI-driven diagnostics. Integrated advanced data visualization, secure authentication, and scalable backend services to handle complex business operations seamlessly.",
        tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        link: "https://smart-saas-frontend.vercel.app",
        github: "https://github.com/Akhil-0412/Smart_Saas_Dashboard",
        image: "/projects/saas.png",
    },
    {
        id: "pulse-project",
        title: "PULSE (PPG Signal AI)",
        category: "Healthcare AI & DSP",
        description: "Advanced signal processing on Photoplethysmography data.",
        longDescription:
            "Implemented an advanced deep learning pipeline to analyze Photoplethysmography (PPG) signals. Processed raw physiological data, applied noise reduction algorithms, and developed predictive models for continuous and accurate health monitoring indicators.",
        tech: ["Python", "PyTorch", "Signal Processing"],
        link: "https://pulse-8suw3ls0b-akhil-0412s-projects.vercel.app/",
        github: "https://github.com/Akhil-0412/PULSE",
        image: "/projects/pulse.png",
    }
];

export default function ProjectsExplorer() {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    return (
        <section className="relative min-h-screen px-6 py-32">
            <div className="max-w-7xl mx-auto">
                <div className="mb-20 text-center">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/40 mb-6"
                    >
                        Selected Works
                    </motion.h3>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        A showcase of advanced engineering in AI, Robotics, and Systems.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <SpotlightCard
                            key={project.id}
                            project={project}
                            onClick={() => setSelectedId(project.id)}
                        />
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedId && (
                    <Modal
                        project={projects.find((p) => p.id === selectedId)!}
                        onClose={() => setSelectedId(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}

function SpotlightCard({ project, onClick }: { project: Project; onClick: () => void }) {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <motion.div
            ref={divRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className="
        relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 
        p-8 cursor-pointer group transition-transform duration-300 hover:scale-[1.02]
      "
        >
            {/* Spotlight Gradient */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)`,
                }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
                {project.image && (
                    <div className="mb-4 overflow-hidden rounded-xl border border-white/5 group-hover:border-white/20 transition-colors">
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-40 object-cover transform transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                )}
                <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">
                        {project.category}
                    </span>
                    <div className="flex gap-2">
                        {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-gray-500 hover:text-cyan-400 transition-colors">
                                <ExternalLink className="w-5 h-5" />
                            </a>
                        )}
                        {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-gray-500 hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>

                <h4 className="text-xl font-bold mb-3 group-hover:text-cyan-200 transition-colors">
                    {project.title}
                </h4>

                <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-grow">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tech.map((t) => (
                        <span key={t} className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5">
                            {t}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function Modal({ project, onClose }: { project: Project; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="
          relative w-full max-w-2xl bg-[#0F0F0F] border border-white/10 rounded-3xl 
          p-8 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh]
        "
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                <span className="text-sm font-semibold text-cyan-400 uppercase tracking-widest block mb-2 mt-4">
                    {project.category}
                </span>

                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                    {project.title}
                </h3>

                {project.image && (
                    <div className="mb-8 overflow-hidden rounded-2xl border border-white/10">
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full max-h-80 object-cover"
                        />
                    </div>
                )}

                <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                    <p>{project.longDescription}</p>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                    <h5 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Technologies</h5>
                    <div className="flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                            <span key={t} className="px-3 py-1.5 rounded-lg bg-white/10 text-cyan-200 text-sm border border-white/5">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                    {project.link && (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-colors"
                        >
                            <ExternalLink className="w-5 h-5" />
                            View Live App
                        </a>
                    )}
                    {project.github && (
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
                        >
                            <Github className="w-5 h-5" />
                            View Code
                        </a>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
