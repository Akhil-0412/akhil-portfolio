"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import useNavStore from "../store/useNavStore";
import Hero from "../components/Hero";
import Header from "../components/Header";
import Background from "../components/Background";
import ExperienceTimeline from "../components/ExperienceTimeline";
import Certifications from "../components/Certifications";
import ProjectsExplorer from "../components/ProjectsExplorer";
import SkillsGrid from "../components/SkillsGrid";
import AIChatWidget from "../components/AIChatWidget";
import AboutMeFlipCard from "../components/AboutMeFlipCard";
import ResumeChooser from "../components/ResumeChooser";
import PinnedSection from "../components/PinnedSection";

export default function Home() {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatIconRect, setChatIconRect] = useState<DOMRect | null>(null);
  
  const certContainerRef = useRef<HTMLElement>(null);

  const handleChatOpen = (rect: DOMRect) => {
    setChatIconRect(rect);
    setIsChatOpen(true);
    useNavStore.getState().setChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    useNavStore.getState().setChatOpen(false);
  };

  const { scrollYProgress } = useScroll({
    target: certContainerRef,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 120 && !scrolledPastHero) {
        setScrolledPastHero(true);
      }
      if (window.scrollY < 40 && scrolledPastHero) {
        setScrolledPastHero(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrolledPastHero]);

  // Certifications scroll
  scrollYProgress.on("change", (latest) => {
    let progress = 0;
    if (latest < 0.25) {
      progress = Math.pow(latest / 0.25, 2);
    } else if (latest > 0.75) {
      progress = Math.pow((1 - latest) / 0.25, 2);
    } else {
      progress = 1;
    }
    
    window.dispatchEvent(
      new CustomEvent("__cert_progress__", { detail: Math.min(1, Math.max(0, progress)) })
    );
  });

  return (
    <>
      <main className="relative text-white overflow-clip bg-black">
        <Background />
        <Header show={scrolledPastHero} isChatOpen={isChatOpen} onChatOpen={handleChatOpen} onChatClose={closeChat} />
        <AIChatWidget isOpen={isChatOpen} onClose={closeChat} iconRect={chatIconRect} />

        {/* ── HERO ─────────────────────────────────────────── */}
        <section id="hero" className="relative z-10 w-full min-h-screen">
          <Hero isChatOpen={isChatOpen} />
        </section>

        {/* ── REST OF PAGE (FADES OUT WHEN CHAT IS OPEN) ─── */}
        <motion.div
          initial={false}
          animate={{ opacity: isChatOpen ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className={isChatOpen ? "pointer-events-none select-none" : ""}
        >
          {/* ── ABOUT ────────────────────────────────────────── */}
          <PinnedSection id="about">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-20 w-full h-full flex items-center justify-end px-6 md:pl-16 md:pr-32 lg:pr-48 xl:pr-[15%] py-12"
            >
              <AboutMeFlipCard />
            </motion.div>
          </PinnedSection>

          {/* ── EXPERIENCE ───────────────────────────────────── */}
          <section id="experience" className="relative z-10">
            <ExperienceTimeline />
          </section>

          {/* ── CERTIFICATIONS ───────────────────────────────── */}
          <section 
            id="certifications" 
            ref={certContainerRef} 
            className="relative z-10 w-full h-[120vh]"
          >
            <div className="sticky top-0 h-screen w-full">
              <Certifications />
            </div>
          </section>

          {/* ── PROJECTS ─────────────────────────────────────── */}
          <PinnedSection id="projects">
            <ProjectsExplorer />
          </PinnedSection>

          {/* ── SKILLS ───────────────────────────────────────── */}
          <PinnedSection id="skills">
            <SkillsGrid />
          </PinnedSection>

          {/* ── FOOTER / CONTACT ───────────────────────────────── */}
          <footer id="contact" className="relative z-10 w-full pt-12 bg-black">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              
              {/* 3-Column Main Footer */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                
                {/* Column 1: Brand / Text */}
                <div className="flex flex-col items-start">
                  <h3 className="text-2xl font-semibold mb-4 text-white">
                    Let's Work Together
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                    Interested in AI, GenAI systems, or data-driven automation? I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                  </p>
                </div>

                {/* Column 2: Navigation */}
                <div className="flex flex-col items-start md:items-center">
                  <div className="flex flex-col items-start">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-6">
                      Explore
                    </h4>
                    <ul className="space-y-3 text-sm text-gray-400">
                      <li><a href="#about" className="hover:text-white transition-colors">About Me</a></li>
                      <li><a href="#experience" className="hover:text-white transition-colors">Experience</a></li>
                      <li><a href="#projects" className="hover:text-white transition-colors">Projects</a></li>
                      <li><a href="#skills" className="hover:text-white transition-colors">Skills</a></li>
                    </ul>
                  </div>
                </div>

                {/* Column 3: Socials */}
                <div className="flex flex-col items-start md:items-end">
                  <div className="flex flex-col items-start">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-6">
                      Connect
                    </h4>
                    <div className="flex gap-6">
                      <a
                        href="mailto:akhileshwar008@gmail.com"
                        className="w-16 h-16 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-green-400 hover:bg-white/10 hover:border-green-400/30 hover:scale-110 transition-all duration-300"
                        aria-label="Email"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                      </a>
                      <a
                        href="https://github.com/Akhil-0412"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-16 h-16 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-purple-400 hover:bg-white/10 hover:border-purple-400/30 hover:scale-110 transition-all duration-300"
                        aria-label="GitHub"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                      </a>
                      <a
                        href="https://linkedin.com/in/akhileshwar-sanathana"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-16 h-16 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-blue-400 hover:bg-white/10 hover:border-blue-400/30 hover:scale-110 transition-all duration-300"
                        aria-label="LinkedIn"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Glowing Top Divider - Full Width (Frame to Frame) */}
            <div className="relative w-full h-[1px] bg-white/10">
              <div 
                className="absolute top-0 left-0 h-full w-full opacity-40 blur-sm pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, #0066ff 25%, #af52de 50%, #ff3b30 75%, transparent 100%)",
                  animation: "shimmer-text 8s linear infinite"
                }}
              />
              <div 
                className="absolute top-0 left-1/4 w-1/2 h-[1px] opacity-60 pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, #ffffff 50%, transparent 100%)",
                  animation: "shimmer-text 6s linear infinite"
                }}
              />
            </div>

            {/* Bottom Copyright Bar - Full Width */}
            <div className="w-full px-6 md:px-12 bg-black">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-gray-600 font-medium py-4">
                <p>© {new Date().getFullYear()} Akhileshwar Sanathana. All rights reserved.</p>
                
                <div className="flex items-center gap-4">
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                  <span className="text-gray-800">•</span>
                  <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                  <span className="text-gray-800">•</span>
                  <a href="#" className="hover:text-white transition-colors">Cookies</a>
                </div>
              </div>
            </div>
          </footer>
        </motion.div>
      </main>
    </>
  );
}
