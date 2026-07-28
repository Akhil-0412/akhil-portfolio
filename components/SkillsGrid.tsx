"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    SiAnthropic, SiClaude, SiLangchain, SiFastapi,
    SiPython, SiPostgresql, SiDocker, SiGithub, SiGooglecloud,
    SiHuggingface, SiVercel, SiRailway, SiRender, SiN8n,
    SiSupabase, SiRedis, SiMongodb, SiGitlab, SiJira, SiNotion,
    SiFigma, SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
    SiNodedotjs, SiTerraform, SiLinux, SiKubernetes, SiJavascript
} from '@icons-pack/react-simple-icons';
import { Database, Bot, Cloud, Terminal, Workflow, Cpu, Network } from 'lucide-react';
import { TextScramble } from '@/components/core/text-scramble';

type Skill = {
    name: string;
    Icon?: React.ComponentType<{ className?: string; color?: string; size?: number | string }>;
    initials?: string;
    color?: string;
};

const allSkills: Skill[] = [
    // Agentic AI and LLMs
    { name: 'OpenAI', Icon: Bot, color: '#ffffff' },
    { name: 'Anthropic', Icon: SiAnthropic, color: '#d97757' },
    { name: 'Claude', Icon: SiClaude, color: '#d97757' },
    { name: 'LangGraph', Icon: Workflow, color: '#ffffff' },
    { name: 'LangChain', Icon: SiLangchain, color: '#1c3c3c' },
    { name: 'FastMCP', Icon: Cpu, color: '#ffffff' },
    { name: 'Hugging Face', Icon: SiHuggingface, color: '#ffd21e' },

    // Retrieval and Search
    { name: 'FAISS', Icon: Network, color: '#ffffff' },
    { name: 'Pinecone', Icon: Database, color: '#ffffff' },
    { name: 'Weaviate', Icon: Database, color: '#ffffff' },
    { name: 'Qdrant', Icon: Database, color: '#f90059' },

    // Data, Backend, and Cloud
    { name: 'Python', Icon: SiPython, color: '#3776ab' },
    { name: 'FastAPI', Icon: SiFastapi, color: '#009688' },
    { name: 'SQL', Icon: Database, color: '#ffffff' },
    { name: 'PostgreSQL', Icon: SiPostgresql, color: '#4169e1' },
    { name: 'Redis', Icon: SiRedis, color: '#dc382d' },
    { name: 'MongoDB', Icon: SiMongodb, color: '#47a248' },
    { name: 'AWS', Icon: Cloud, color: '#ff9900' },
    { name: 'Azure', Icon: Cloud, color: '#0089d6' },
    { name: 'GCP', Icon: SiGooglecloud, color: '#4285f4' },

    // Deployment and Collaboration
    { name: 'Docker', Icon: SiDocker, color: '#2496ed' },
    { name: 'Kubernetes', Icon: SiKubernetes, color: '#326ce5' },
    { name: 'GitHub', Icon: SiGithub, color: '#ffffff' },
    { name: 'GitLab', Icon: SiGitlab, color: '#fc6d26' },
    { name: 'CI/CD', Icon: Terminal, color: '#ffffff' },
    { name: 'Vercel', Icon: SiVercel, color: '#ffffff' },
    { name: 'Railway', Icon: SiRailway, color: '#5b0bb5' },
    { name: 'Render', Icon: SiRender, color: '#46e3b7' },
    { name: 'n8n', Icon: SiN8n, color: '#ff6d5a' },
    { name: 'Supabase', Icon: SiSupabase, color: '#3ecf8e' },
    { name: 'Jira', Icon: SiJira, color: '#0052cc' },
    { name: 'Notion', Icon: SiNotion, color: '#ffffff' },

    // Frontend & Languages
    { name: 'TypeScript', Icon: SiTypescript, color: '#3178c6' },
    { name: 'JavaScript', Icon: SiJavascript, color: '#f7df1e' },
    { name: 'React', Icon: SiReact, color: '#61dafb' },
    { name: 'Next.js', Icon: SiNextdotjs, color: '#ffffff' },
    { name: 'Tailwind', Icon: SiTailwindcss, color: '#06b6d4' },
    { name: 'Node.js', Icon: SiNodedotjs, color: '#339933' },
    { name: 'Linux', Icon: SiLinux, color: '#fcc624' },
    { name: 'Terraform', Icon: SiTerraform, color: '#7b42bc' },
    { name: 'Figma', Icon: SiFigma, color: '#f24e1e' }
];

function SkillCard({ skill }: { skill: Skill }) {
    const { Icon, initials, color } = skill;

    return (
        <div 
            className="blob-card group flex min-h-[100px] flex-row items-center justify-start border-b border-r border-white/10 px-6 py-4 transition-all duration-700 relative overflow-hidden"
        >
            <div className="blob-card__inner">
                <div className="blob-card__blobs">
                    <div className="blob-card__blob"></div>
                    <div className="blob-card__blob"></div>
                    <div className="blob-card__blob"></div>
                    <div className="blob-card__blob"></div>
                </div>
            </div>
            
            <div className="flex items-center gap-4 relative z-10 w-full">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden relative">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={skill.name}
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -40, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="absolute flex items-center justify-center"
                        >
                            {Icon ? (
                                <Icon 
                                    className={`h-8 w-8 transition-colors duration-500 transition-transform group-hover:scale-110 ${color === '#ffffff' || color === '#000000' ? 'text-white group-hover:text-black' : ''}`} 
                                    color={color === '#ffffff' || color === '#000000' ? undefined : color} 
                                />
                            ) : (
                                <span className="text-xl font-bold uppercase text-white group-hover:text-black transition-colors duration-500">
                                    {initials || skill.name.slice(0, 2)}
                                </span>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <TextScramble key={skill.name} className="font-mono text-sm font-bold uppercase tracking-[0.1em] text-white group-hover:text-black transition-colors duration-500 truncate">
                    {skill.name}
                </TextScramble>
            </div>
        </div>
    );
}

export default function SkillsGrid() {
    const [visibleSkills, setVisibleSkills] = useState<Skill[]>([]);

    useEffect(() => {
        // Initialize with first 15 skills (3x5 grid)
        setVisibleSkills(allSkills.slice(0, 15));

        const interval = setInterval(() => {
            setVisibleSkills(currentVisible => {
                const newVisible = [...currentVisible];
                // Randomly replace 1 to 3 cards
                const numToReplace = Math.floor(Math.random() * 3) + 1;
                
                const positionsToReplace: number[] = [];
                while (positionsToReplace.length < numToReplace) {
                    const r = Math.floor(Math.random() * 15);
                    if (!positionsToReplace.includes(r)) positionsToReplace.push(r);
                }

                // Available pool is any skill NOT currently visible
                const availableSkills = allSkills.filter(s => !newVisible.some(vs => vs.name === s.name));
                
                positionsToReplace.forEach(pos => {
                    const r = Math.floor(Math.random() * availableSkills.length);
                    newVisible[pos] = availableSkills[r];
                    availableSkills.splice(r, 1); // Ensure we don't pick the same one twice
                });

                return newVisible;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Prevent hydration mismatch by rendering a placeholder grid initially if empty
    if (visibleSkills.length === 0) {
        return (
            <section className="relative w-full overflow-hidden py-24 pl-16 md:pl-24">
                <div className="mb-16 text-center">
                    <h2 className="bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                        Skills
                    </h2>
                    <p className="mt-4 text-white/60 max-w-lg mx-auto">
                        A collection of technologies I work with.
                    </p>
                </div>
                <div className="w-full border-t border-l border-white/10 min-h-[420px]" />
            </section>
        );
    }

    return (
        <section className="relative w-full overflow-hidden py-24 pl-16 md:pl-24">
            <style dangerouslySetInnerHTML={{
                __html: `
                .blob-card {
                  z-index: 1;
                  position: relative;
                  background-color: transparent;
                  transition: color 0.5s;
                }
                .blob-card__inner {
                  z-index: -1;
                  overflow: hidden;
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                  background: #050505;
                }
                .blob-card__blobs {
                  position: relative;
                  display: block;
                  height: 100%;
                  filter: url('#goo');
                }
                .blob-card__blob {
                  position: absolute;
                  top: 0;
                  width: 33%;
                  height: 100%;
                  background: #ffffff;
                  border-radius: 100%;
                  transform: translate3d(0, 250%, 0) scale(2.5);
                  transition: transform 0.45s;
                }
                @supports(filter: url('#goo')) {
                  .blob-card__blob {
                    transform: translate3d(0, 250%, 0) scale(2.5);
                  }
                }
                .blob-card:hover .blob-card__blob {
                  transform: translateZ(0) scale(2.5);
                }
                @supports(filter: url('#goo')) {
                  .blob-card:hover .blob-card__blob {
                    transform: translateZ(0) scale(2.5);
                  }
                }
                .blob-card__blob:nth-child(1) { left: -10%; transition-delay: 0s; }
                .blob-card__blob:nth-child(2) { left: 20%; transition-delay: 0.08s; }
                .blob-card__blob:nth-child(3) { left: 50%; transition-delay: 0.16s; }
                .blob-card__blob:nth-child(4) { left: 80%; transition-delay: 0.24s; }
                `
            }} />
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: 'none' }}>
              <defs>
                <filter id="goo">
                  <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
                  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7" result="goo"></feColorMatrix>
                  <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
                </filter>
              </defs>
            </svg>

            <div className="mb-16 text-center">
                <h2 className="bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl pr-16 md:pr-24">
                    Skills
                </h2>
            </div>

            <div className="w-full border-t border-l border-white/10">
                <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(200px,1fr))] md:grid-cols-5">
                    {visibleSkills.map((skill, index) => (
                        <SkillCard key={index} skill={skill} />
                    ))}
                </div>
            </div>
        </section>
    );
}
