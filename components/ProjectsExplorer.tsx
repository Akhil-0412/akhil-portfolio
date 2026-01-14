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
}

const projects: Project[] = [
    {
        id: "rag",
        title: "Authoritative RAG Engine",
        category: "Generative AI",
        description: "Production-grade RAG with semantic caching & strict verification.",
        longDescription:
            "Engineered a production-grade Retrieval-Augmented Generation (RAG) system using Redis for vector search and L1/L2 semantic caching, reducing query latency by 98% (from ~2500ms to ~30ms). Implemented a strict verification pipeline that validates LLM claims against curated datasets (CDC/SEC), automatically enforcing safety disclaimers for medical and financial queries.",
        tech: ["Python", "Streamlit", "Redis", "OpenRouter API"],
        github: "https://github.com/Akhil-0412/RAG-Semantic-Cacheing",
    },
    {
        id: "tumor",
        title: "Brain Tumor Classification",
        category: "Healthcare AI",
        description: "99% accuracy MRI classification with ResNet-50 & ViT.",
        longDescription:
            "Achieved 99% test accuracy in classifying MRI scans by fine-tuning a ResNet-50 architecture with transfer learning. Implemented and benchmarked a Vision Transformer (ViT) (patch size 16x16) which reached 98% accuracy, identifying that patch-based attention effectively models global context.",
        tech: ["Python", "PyTorch", "ResNet-50", "Vision Transformers"],
    },
    {
        id: "weaver",
        title: "Autonomous Robotic Weaver",
        category: "Robotics & IoT",
        description: "Spider-inspired robot with CV-based anchor detection.",
        longDescription:
            "Built a multi-axis robot capable of autonomously weaving web structures by integrating computer vision (HSV color space) to detect anchor points with 92% accuracy. Developed a distributed control architecture where a Raspberry Pi Zero 2W handles vision processing and transmits trajectory data via MQTT/TCP to a Pico 2W motion controller.",
        tech: ["Raspberry Pi", "OpenCV", "MQTT", "Python"],
    },
    {
        id: "music",
        title: "Music Genre Classification",
        category: "Audio AI",
        description: "Deep Learning on spectrograms using CNNs & GANs.",
        longDescription:
            "Architected a CNN with Batch Normalization and RMSProp optimizer that achieved 75.25% accuracy on the GTZAN dataset, outperforming standard Fully Connected baselines by over 20%. Explored data augmentation using Generative Adversarial Networks (GANs) to synthesize Mel-spectrograms, improving training stability.",
        tech: ["PyTorch", "Librosa", "CNNs", "GANs"],
    },
    {
        id: "maritime",
        title: "Maritime Bidding Agent",
        category: "Game Theory",
        description: "Intelligent agent for reverse Vickrey auctions.",
        longDescription:
            "Designed a bidding agent for a reverse Vickrey auction simulation, implementing a 'True Valuation' strategy that secured profitability against competing agents. Optimized vessel routing using an exhaustive search algorithm with heuristics, reducing computational complexity significantly by sorting fleet capabilities.",
        tech: ["Python", "Graph Theory", "Vickrey Auctions"],
    },
    {
        id: "nlp",
        title: "Theme Discovery Clustering",
        category: "Data Science",
        description: "Unsupervised clustering on text8 corpus with LSA.",
        longDescription:
            "Processed the text8 corpus using NLTK and applied Truncated SVD (LSA) to reduce dimensionality to 1000 features. Determined optimal clusters (k=4) using Elbow Method and Calinski-Harabasz scores to extract thematic insights.",
        tech: ["Python", "NLTK", "Scikit-learn", "K-Means"],
    },
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
                <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">
                        {project.category}
                    </span>
                    {project.github && <Github className="w-5 h-5 text-gray-500 hover:text-white transition-colors" />}
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

                <span className="text-sm font-semibold text-cyan-400 uppercase tracking-widest">
                    {project.category}
                </span>

                <h3 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                    {project.title}
                </h3>

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

                {project.github && (
                    <div className="mt-8 flex gap-4">
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
                        >
                            <Github className="w-5 h-5" />
                            View Code
                        </a>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
