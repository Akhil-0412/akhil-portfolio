"use client";

import { motion } from "framer-motion";

interface Certification {
    id: string;
    title: string;
    src: string;
    link: string;
}

const certifications: Certification[] = [
    {
        id: "github",
        title: "GitHub Copilot",
        src: "/certifications/GitHub.png",
        link: "https://www.credly.com/badges/f43652cf-9540-4282-9b9e-a9334d703409/linked_in_profile",
    },
    {
        id: "google",
        title: "Google AI Essentials",
        src: "/certifications/Google_AI.png",
        link: "https://www.coursera.org/account/accomplishments/verify/HJV7ITUANWYO",
    },
    {
        id: "ibm",
        title: "AI Fundamentals (IBM)",
        src: "/certifications/IBM.png",
        link: "https://www.credly.com/badges/9e6f3425-0797-41f6-ae60-baccad2fdef4/linked_in_profile",
    },
];

export default function Certifications() {
    return (
        <section className="relative py-32 px-6">
            <div className="max-w-6xl mx-auto">

                {/* TITLE */}
                <motion.h3
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-2xl md:text-3xl font-semibold text-center mb-24"
                >
                    Certifications
                </motion.h3>

                {/* CERTIFICATES */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-20">

                    {certifications.map((cert) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.06, y: -10 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="cursor-pointer select-none"
                            onClick={() => window.open(cert.link, "_blank")}
                        >
                            <img
                                src={cert.src}
                                alt={cert.title}
                                className={`
                  object-contain
                  drop-shadow-[0_30px_80px_rgba(0,0,0,0.7)]
                  transition-transform
                  ${cert.id === "ibm"
                                        ? "max-w-[260px] md:max-w-[300px]"
                                        : "max-w-[380px] md:max-w-[440px]"
                                    }
                `}
                            />

                            {/* OPTIONAL LABEL */}
                            <p className="mt-6 text-center text-sm text-white/70">
                                {cert.title}
                            </p>
                        </motion.div>
                    ))}

                </div>
            </div>
        </section>
    );
}
