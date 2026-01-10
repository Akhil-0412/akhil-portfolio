"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Step = "start" | "roles" | "done";

export default function ResumeChooser() {
    const [step, setStep] = useState<Step>("start");

    const handleDownload = () => {
        setStep("done");
        setTimeout(() => {
            setStep("start");
        }, 2000);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    return (
        <div className="relative">
            <AnimatePresence mode="wait">
                {step === "start" && (
                    <motion.div
                        key="start"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.4 }}
                        className="text-center"
                    >
                        <h3 className="text-2xl font-semibold">Resume</h3>

                        <p className="mt-4 text-gray-400">
                            You can download a general resume or choose a role-specific version.
                        </p>

                        <div className="mt-6 flex justify-center gap-4">
                            <button
                                onClick={() => setStep("roles")}
                                className="px-6 py-3 rounded-full border border-white/20 hover:border-cyan-400 transition"
                            >
                                Role-specific versions
                            </button>

                            <a
                                href="/resumes/resume-ai.pdf"
                                download
                                onClick={handleDownload}
                                className="px-6 py-3 rounded-full border border-white/20 hover:border-purple-400 transition"
                            >
                                General resume
                            </a>
                        </div>
                    </motion.div>
                )}

                {step === "roles" && (
                    <motion.div
                        key="roles"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.4 }}
                        className="text-center"
                    >
                        <h3 className="text-2xl font-semibold">
                            Choose the role most relevant to you
                        </h3>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
                            <a
                                href="/resumes/resume-ai.pdf"
                                download
                                onClick={handleDownload}
                                className="p-4 rounded-xl border border-white/20 hover:border-cyan-400 transition"
                            >
                                AI / GenAI Engineer
                            </a>

                            <a
                                href="/resumes/resume-swe.pdf"
                                download
                                onClick={handleDownload}
                                className="p-4 rounded-xl border border-white/20 hover:border-purple-400 transition"
                            >
                                Software Engineer
                            </a>

                            <a
                                href="/resumes/resume-graduate.pdf"
                                download
                                onClick={handleDownload}
                                className="p-4 rounded-xl border border-white/20 hover:border-emerald-400 transition"
                            >
                                Graduate Role
                            </a>
                        </div>

                        <button
                            onClick={() => setStep("start")}
                            className="mt-6 text-sm text-gray-400 hover:text-white transition"
                        >
                            ← Back
                        </button>
                    </motion.div>
                )}

                {step === "done" && (
                    <motion.div
                        key="done"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.4 }}
                        className="text-center"
                    >
                        <h3 className="text-2xl font-semibold">Resume downloaded</h3>
                        <p className="mt-4 text-gray-400">
                            Thank you for your interest.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
