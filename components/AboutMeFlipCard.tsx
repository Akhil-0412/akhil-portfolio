"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AboutMeFlipCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasFlippedOnce, setHasFlippedOnce] = useState(false);

  return (
    <div 
      className="relative w-full max-w-lg h-[650px] sm:h-[550px] max-h-full [perspective:1000px] z-20 cursor-pointer"
      onClick={() => {
        setIsFlipped(!isFlipped);
        if (!hasFlippedOnce) setHasFlippedOnce(true);
      }}
    >
      <motion.div
        className="w-full h-full relative [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        whileHover={{ 
          rotateY: isFlipped ? [180, 165, 180] : [0, 15, 0],
          transition: { duration: 0.5, ease: "easeInOut" }
        }} 
        transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* FRONT SIDE (Biography) */}
        <div 
          className="absolute inset-0 [backface-visibility:hidden] w-full h-full bg-black/60 border border-green-500/30 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-[0_0_20px_rgba(34,197,94,0.2)] flex flex-col transition-all duration-300 hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
          style={{
            opacity: isFlipped ? 0 : 1,
            pointerEvents: isFlipped ? 'none' : 'auto'
          }}
        >
          <div>
            <span className="text-xs uppercase tracking-widest text-green-400 font-mono font-semibold block mb-3">
              01 // Biography
            </span>

            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">
              About Me
            </h3>

            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
              I’m an AI Engineer with an MSc in Artificial Intelligence from the University of Southampton, a fancy way of saying I teach silicon how to think without hallucinating. I specialize in building production-grade RAG pipelines, agentic workflows, and wrestling complex Python/SQL data processing systems into submission.
            </p>

            <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed">
              When I'm not systematically auditing AI outputs to keep models from confidently making things up, I'm deploying containerized intelligence across GCP, AWS, and Azure. I thrive on translating operational headaches into reliable, high-performance AI capabilities because cross-functional collaboration is really just multi-agent orchestration with humans.
            </p>
          </div>
          
          {!hasFlippedOnce && (
            <div className="mt-auto pt-6 text-green-400/50 text-xs text-center font-mono animate-pulse">
              [ Click anywhere to flip ]
            </div>
          )}
        </div>

        {/* BACK SIDE (University Highlights) */}
        <div 
          className="absolute inset-0 [backface-visibility:hidden] w-full h-full bg-black/60 border border-green-500/30 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-[0_0_20px_rgba(34,197,94,0.2)] flex flex-col transition-all duration-300 hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] [transform:rotateY(180deg)]"
          style={{
            opacity: isFlipped ? 1 : 0,
            pointerEvents: isFlipped ? 'auto' : 'none'
          }}
        >
          <div>
            <span className="text-xs uppercase tracking-widest text-green-400 font-mono font-semibold block mb-3">
              01.5 // Fun Facts
            </span>

            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              University Highlights
            </h3>

            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.8)] shrink-0" />
                <div>
                  <h4 className="text-green-300 font-semibold text-lg">Hackathon Runner Up</h4>
                  <p className="text-gray-400 text-sm mt-1">Built an award-winning prototype under intense time constraints, demonstrating rapid problem-solving and full-stack execution.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.8)] shrink-0" />
                <div>
                  <h4 className="text-green-300 font-semibold text-lg">GDSC Core Team Leader</h4>
                  <p className="text-gray-400 text-sm mt-1">Led the Google Developer Student Club, organizing technical workshops and fostering a massive community of student developers.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.8)] shrink-0" />
                <div>
                  <h4 className="text-green-300 font-semibold text-lg">AI Research Author</h4>
                  <p className="text-gray-400 text-sm mt-1">Co-authored a peer-reviewed paper on blockchain infrastructure and digital ownership systems published by CRC Press.</p>
                </div>
              </li>
            </ul>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
}
