"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const navLinks = [
    { name: "About", id: "about" },
    { name: "Experience", id: "experience" },
    { name: "Certifications", id: "certifications" },
    { name: "Projects", id: "projects" },
    { name: "Skills", id: "skills" },
    { name: "Contact", id: "contact" },
];

export default function Header({ show }: { show: boolean }) {
    const [activeSection, setActiveSection] = useState("");

    const scrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        navLinks.forEach((link) => {
            const section = document.getElementById(link.id);
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={show ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed top-8 left-0 right-0 z-50 flex justify-center pointer-events-none"
        >
            <div className="pointer-events-auto">
                <div
                    className="
            relative 
            flex items-center justify-between 
            px-8 py-4
            min-w-[340px] md:min-w-[600px] lg:min-w-[700px]
            rounded-full 
            border border-white/15
            bg-white/5 
            backdrop-blur-2xl 
            shadow-[0_8px_32px_rgba(0,0,0,0.12)]
            transition-all duration-300
            hover:bg-white/10 hover:border-white/25 hover:shadow-[0_12px_48px_rgba(0,0,0,0.2)]
          "
                >
                    {/* Internal Shine/Reflection Effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                    {/* Left: Name */}
                    <div
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-2 z-10 cursor-pointer mr-6 sm:mr-10"
                    >
                        <span className="text-white font-semibold text-base sm:text-lg tracking-wide drop-shadow-sm">
                            Akhileshwar
                        </span>
                    </div>

                    {/* Right: Navigation */}
                    <nav className="flex items-center gap-1 sm:gap-2 z-10">
                        {navLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => scrollToSection(link.id)}
                                className={`
                  relative
                  px-3 py-1.5 sm:px-4 sm:py-2 
                  rounded-full 
                  text-xs sm:text-sm font-medium 
                  transition-all duration-300
                  ${activeSection === link.id
                                        ? "text-white bg-white/15 shadow-inner"
                                        : "text-white/70 hover:text-white hover:bg-white/10"
                                    }
                `}
                            >
                                {link.name}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </motion.header>
    );
}
