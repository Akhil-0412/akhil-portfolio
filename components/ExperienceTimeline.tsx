"use client";

import { motion } from "framer-motion";

export default function ExperienceTimeline() {
    return (
        <section className="relative px-6 py-28">
            <div className="max-w-6xl mx-auto">

                {/* SECTION TITLE */}
                <motion.h3
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl font-semibold text-center mb-24"
                >
                    Experience
                </motion.h3>

                <div className="relative space-y-32">

                    {/* =======================
              CANTOR FITZGERALD
          ======================= */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative"
                    >
                        {/* TIMELINE DOT */}
                        <span className="hidden lg:block absolute -left-6 top-6 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)]" />

                        {/* LEFT — TEXT */}
                        <div className="relative">
                            <h4 className="text-2xl font-semibold">
                                Automation & IT Intern
                            </h4>

                            <p className="text-gray-400 mt-1">
                                Cantor Fitzgerald · London · Jan 2024 – Jul 2024
                            </p>

                            <ul className="mt-6 space-y-3 text-gray-300 leading-relaxed list-disc list-inside">
                                <li>
                                    Designed and automated internal IT workflows using PowerShell and SQL,
                                    significantly reducing manual operational overhead.
                                </li>
                                <li>
                                    Built and optimized Azure-based reporting pipelines to improve data
                                    accessibility, performance, and system reliability.
                                </li>
                                <li>
                                    Served as a bridge between business and IT teams, translating operational
                                    requirements into scalable automation solutions.
                                </li>
                            </ul>
                        </div>

                        {/* RIGHT — TRIANGLE LOGO COMPOSITION */}
                        <div className="relative w-full h-[360px] hidden lg:block">
                            {/* CENTER (Cantor) */}
                            <img
                                src="/logo/Cantor.png"
                                alt="Cantor Fitzgerald"
                                className="absolute top-0 left-1/2 -translate-x-1/2 h-60 object-contain drop-shadow-2xl"
                            />

                            {/* BOTTOM LEFT (BGC) */}
                            <img
                                src="/logo/bgc.jpg"
                                alt="BGC"
                                className="absolute bottom-4 left-6 h-28 object-contain opacity-95 drop-shadow-xl"
                            />

                            {/* BOTTOM RIGHT (Newmark) */}
                            <img
                                src="/logo/newmark.jpg"
                                alt="Newmark"
                                className="absolute -bottom-5 -right-5 h-40 object-contain opacity-95 drop-shadow-x1"
                            />

                            {/* SOFT GLOW */}
                            <div className="absolute inset-0 bg-cyan-500/5 blur-[160px] rounded-full" />
                        </div>
                    </motion.div>

                    {/* =======================
              PEOPLELINK
          ======================= */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative"
                    >
                        {/* TIMELINE DOT */}
                        <span className="hidden lg:block absolute -left-6 top-6 w-4 h-4 rounded-full bg-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.6)]" />

                        {/* LEFT — TEXT */}
                        <div className="relative">
                            <h4 className="text-2xl font-semibold">
                                Digital Marketing & Analytics Intern
                            </h4>

                            <p className="text-gray-400 mt-1">
                                PeopleLink · Hyderabad · Jun 2022 – Jul 2022
                            </p>

                            <ul className="mt-6 space-y-3 text-gray-300 leading-relaxed list-disc list-inside">
                                <li>
                                    Analyzed digital campaign performance data to identify trends and optimize
                                    marketing spend.
                                </li>
                                <li>
                                    Conducted data mining and audience segmentation to improve conversion
                                    strategies.
                                </li>
                                <li>
                                    Delivered data-driven insights to stakeholders, supporting strategic
                                    marketing decisions.
                                </li>
                            </ul>
                        </div>

                        {/* RIGHT — SINGLE LOGO FOCUS */}
                        <div className="relative w-full h-[300px] hidden lg:flex items-center justify-center">
                            <img
                                src="/logo/peoplelink.jpg"
                                alt="peoplelink"
                                className="h-40 object-contain drop-shadow-2xl"
                            />

                            {/* GLOW */}
                            <div className="absolute inset-0 bg-purple-500/10 blur-[120px] rounded-full" />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
