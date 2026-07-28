"use client";

import React, { useRef, useEffect, useState, createContext, useContext } from "react";
import { useScroll, animate, MotionValue } from "framer-motion";

interface RubberBandContextType {
  progress: MotionValue<number>;
}

const RubberBandContext = createContext<RubberBandContextType | null>(null);

export function useRubberBandProgress() {
  const context = useContext(RubberBandContext);
  if (!context) {
    throw new Error("useRubberBandProgress must be used within a RubberBandSection");
  }
  return context.progress;
}

interface RubberBandSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  depth?: string; // e.g., "300vh"
  threshold?: number; // e.g., 0.8
}

export default function RubberBandSection({
  children,
  id,
  className = "",
  depth = "250vh",
  threshold = 0.85,
}: RubberBandSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let animationControls: any = null;

    const handleScroll = () => {
      // If we are currently animating programmatically, don't trigger the snap logic again
      if (isAnimating) return;

      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        if (!containerRef.current) return;

        const currentProgress = scrollYProgress.get();
        // If the user stopped scrolling while inside the interactive zone
        if (currentProgress > 0 && currentProgress < 1) {
          const rect = containerRef.current.getBoundingClientRect();
          const scrollTop = window.scrollY;
          const sectionTop = scrollTop + rect.top;
          const sectionBottom = sectionTop + rect.height - window.innerHeight;

          let targetScroll = -1;

          if (currentProgress >= threshold) {
            // Snap to end
            targetScroll = sectionBottom;
          } else {
            // Snap back to start
            targetScroll = sectionTop;
          }

          if (targetScroll !== -1 && Math.abs(scrollTop - targetScroll) > 5) {
            setIsAnimating(true);
            animationControls = animate(scrollTop, targetScroll, {
              type: "spring",
              stiffness: 70,
              damping: 25,
              restDelta: 1,
              onUpdate: (v) => {
                window.scrollTo({ top: v, behavior: "auto" });
              },
              onComplete: () => setIsAnimating(false),
            });
          }
        }
      }, 150); // 150ms debounce
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Also cancel animation if user interacts again
    const cancelAnimation = () => {
      if (isAnimating) {
        if (animationControls) animationControls.stop();
        setIsAnimating(false);
      }
    };
    
    window.addEventListener("wheel", cancelAnimation, { passive: true });
    window.addEventListener("touchstart", cancelAnimation, { passive: true });

    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", cancelAnimation);
      window.removeEventListener("touchstart", cancelAnimation);
    };
  }, [scrollYProgress, threshold, isAnimating]);

  return (
    <RubberBandContext.Provider value={{ progress: scrollYProgress }}>
      <section
        id={id}
        ref={containerRef}
        style={{ height: depth }}
        className="relative w-full z-10"
      >
        <div className={`sticky top-0 h-screen w-full overflow-hidden ${className}`}>
          {children}
        </div>
      </section>
    </RubberBandContext.Provider>
  );
}
