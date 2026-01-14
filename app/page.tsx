"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Hero from "../components/Hero";
import Header from "../components/Header";
import Background from "../components/Background";
import ResumeChooser from "../components/ResumeChooser";
import Certifications from "../components/Certifications";
import ExperienceTimeline from "../components/ExperienceTimeline";
import ProjectsExplorer from "../components/ProjectsExplorer";
import SkillsGlobe from "../components/SkillsGlobe";

export default function Home() {
  const [heroExited, setHeroExited] = useState(false);

  // 🔑 NETFLIX / iOS-STYLE THRESHOLD SCROLL
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 120 && !heroExited) {
        setHeroExited(true);
      }
      if (window.scrollY < 40 && heroExited) {
        setHeroExited(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [heroExited]);

  return (
    <main className="relative text-white overflow-x-hidden">
      <Background />
      <Header show={heroExited} />

      {/* ================= HERO (FIXED TAKEOVER) ================= */}
      <AnimatePresence>
        {!heroExited && (
          <motion.div
            key="hero"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50"
          >
            <Hero />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to allow scroll threshold */}
      <div className="h-[120vh]" />

      {/* ================= ABOUT (STARTS WHERE EXPERIENCE WAS) ================= */}
      <motion.section
        id="about"
        initial={{ opacity: 0, y: 60 }}
        animate={heroExited ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 flex items-center justify-center px-6 py-32"
      >
        <div className="max-w-3xl text-center">
          <h3 className="text-3xl md:text-4xl font-semibold mb-6">
            About Me
          </h3>

          <p className="text-gray-400 text-lg leading-relaxed">
            I’m a performance-driven AI Engineer with a Master’s in Artificial Intelligence,
            experienced in building production-grade GenAI systems, RAG pipelines,
            and scalable cloud-based automation solutions.
          </p>
        </div>
      </motion.section>

      <section id="experience">
        <ExperienceTimeline />
      </section>


      {/* ================= CERTIFICATIONS ================= */}
      <section id="certifications">
        <Certifications />
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <ProjectsExplorer />
      </section>

      {/* SKILLS */}
      <section id="skills">
        <SkillsGlobe />
      </section>


      {/* ================= CONTACT ================= */}
      <section id="contact" className="relative z-10 px-6 py-32 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="text-3xl font-semibold mb-6">
            Let’s Work Together
          </h3>

          <p className="text-gray-400 max-w-xl mx-auto mb-10">
            Interested in AI, GenAI systems, or data-driven automation?
            Let’s connect.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <a
              href="mailto:akhileshwar008@gmail.com"
              className="
                group relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 
                rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md
                hover:bg-white/10 hover:border-cyan-400/50 hover:scale-110 
                transition-all duration-300
              "
              aria-label="Email"
            >
              <span className="sr-only">Email</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 md:w-8 md:h-8 text-gray-300 group-hover:text-cyan-400 transition-colors"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>

            <a
              href="https://github.com/Akhil-0412"
              target="_blank"
              rel="noopener noreferrer"
              className="
                group relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 
                rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md
                hover:bg-white/10 hover:border-purple-400/50 hover:scale-110 
                transition-all duration-300
              "
              aria-label="GitHub"
            >
              <span className="sr-only">GitHub</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 md:w-8 md:h-8 text-gray-300 group-hover:text-purple-400 transition-colors"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>

            <a
              href="https://www.linkedin.com/in/akhileshwar-sanathana-21a44723b"
              target="_blank"
              rel="noopener noreferrer"
              className="
                group relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 
                rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md
                hover:bg-white/10 hover:border-blue-400/50 hover:scale-110 
                transition-all duration-300
              "
              aria-label="LinkedIn"
            >
              <span className="sr-only">LinkedIn</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 md:w-8 md:h-8 text-gray-300 group-hover:text-blue-400 transition-colors"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>

          <div className="mt-16">
            <ResumeChooser />
          </div>
        </motion.div>
      </section>
    </main>
  );
}
