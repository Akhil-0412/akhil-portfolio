"use client";

import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { motion, useScroll, useTransform, MotionValue, useMotionTemplate, useMotionValue } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";
import { BorderTrail } from '@/components/core/border-trail';

type Entry = {
  id: string;
  company?: string;
  institution?: string;
  logo?: string;
  invertLogo?: boolean;
  role?: string;
  degree?: string;
  duration: string;
  date: string;
  location: string;
  bullets?: string[];
};

const EXPERIENCES: Entry[] = [
  {
    id: "flyrank",
    company: "FlyRank AI",
    logo: "/logos/flyrank.svg",
    invertLogo: true,
    role: "AI Engineer Intern",
    duration: "Present",
    date: "Jun 2026 – Present",
    location: "Remote",
    bullets: [
      "Implemented AI agent workflows and prompt engineering pipelines, building RAG components to support internal tools and data-driven product capabilities.",
      "Designed evaluation frameworks across 100 test cases to systematically audit AI outputs, conducting prompt testing and regression checks to improve search quality.",
      "Wrote clean Python and SQL code to prepare, clean, transform, and validate internal datasets, orchestrating automated data retrieval via n8n.",
      "Collaborated with senior engineers and product stakeholders, delivering technical documentation and structured reports on model performance and service reliability.",
    ],
  },
  {
    id: "newmark",
    company: "Newmark",
    logo: "/logos/newmark.png",
    invertLogo: true,
    role: "Software Engineer Intern",
    duration: "6 Months",
    date: "Jan 2024 – Jul 2024",
    location: "London, UK",
    bullets: [
      "Transitioned operations teams from manual reporting to automated SQL data platforms, writing maintainable Python automation code deployed on cloud infrastructure.",
      "Engineered asynchronous queue processing with REST API handling, optimizing operational workflows to cut turnaround latency by 91.67%.",
      "Applied software engineering best practices around version control, testing, and CI/CD pipelines, upholding SQL audit logging and data governance standards.",
    ],
  },
  {
    id: "peoplelink",
    company: "PeopleLink Unified Communications",
    logo: "/logos/peoplelink.png",
    invertLogo: true,
    role: "Data & Operations Analyst Intern",
    duration: "6 Months",
    date: "Jun 2022 – Dec 2022",
    location: "Hyderabad, India",
    bullets: [
      "Engineered Python and SQL ETL data pipelines to clean, transform, and consolidate operational datasets from multiple sources into a single reliable reference system.",
      "Built automated scoring services producing structured outputs, collaborating with non-technical stakeholders to translate business needs into data requirements.",
    ],
  }
];

const EDUCATIONS: Entry[] = [
  {
    id: "southampton",
    institution: "University of Southampton",
    logo: "/logos/university-of-southampton-logo.png",
    degree: "MSc Artificial Intelligence",
    duration: "1 Year",
    date: "2024 – 2025",
    location: "Southampton, United Kingdom",
  },
  {
    id: "icfai",
    institution: "ICFAI Tech University",
    logo: "/logos/icfai-uni-logo.png",
    degree: "B.Tech Computer Science & Engineering",
    duration: "4 Years",
    date: "2020 – 2024",
    location: "Hyderabad, India",
  }
];

/* ─── Layout constants (px, relative to the 700px container) ─── */
const CARDS_TOP = 120;   // card container starts here
const EXP_CARD_GAP = 220;  // vertical spacing between experience cards
const EDU_CARD_GAP = 280;  // vertical spacing between education cards
const NODE_OFFSET = 40;    // node center within each card (top-8 = 32 + 8 half-height)
const LINE_START = 40;    // line grows from this Y coordinate

// Experience node centers (from container top)
const EXP_NODE = [
  CARDS_TOP + 0 * EXP_CARD_GAP + NODE_OFFSET, // 160
  CARDS_TOP + 1 * EXP_CARD_GAP + NODE_OFFSET, // 380
  CARDS_TOP + 2 * EXP_CARD_GAP + NODE_OFFSET, // 600
];

// Education node centers
const EDU_NODE = [
  CARDS_TOP + 0 * EDU_CARD_GAP + NODE_OFFSET, // 160
  CARDS_TOP + 1 * EDU_CARD_GAP + NODE_OFFSET, // 440
];

function useMeasuredX(ref: React.RefObject<HTMLElement | null>, edge: 'left' | 'right') {
  const [x, setX] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const measure = () => {
      const rect = ref.current!.getBoundingClientRect();
      const parentRect = ref.current!.offsetParent?.getBoundingClientRect();
      const offsetLeft = parentRect ? rect.left - parentRect.left : rect.left;
      setX(edge === 'left' ? offsetLeft : offsetLeft + rect.width);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, edge]);

  return x;
}

function TimelineNode({
  isActive,
  color,
  top,
  right,
  left,
  scale = 1
}: {
  isActive: boolean;
  color: string;
  top: number | MotionValue<number>;
  right?: number | string;
  left?: number | string;
  scale?: number | MotionValue<number>;
}) {
  return (
    <motion.div
      className="absolute z-20 flex items-center justify-center -translate-x-1/2"
      style={{ top, right, left, opacity: scale }}
    >
      <motion.div
        className="absolute rounded-full"
        animate={{
          boxShadow: isActive
            ? `0 0 0 4px ${color}22, 0 0 16px 4px ${color}66`
            : `0 0 0 2px ${color}11, 0 0 4px 0px ${color}00`,
        }}
        transition={{ duration: 0.4 }}
        style={{ width: 16, height: 16 }}
      />
      <motion.div
        className="rounded-full"
        animate={{
          backgroundColor: isActive ? color : '#1a1d22',
          scale: isActive ? 1 : 0.7,
        }}
        transition={{ duration: 0.3 }}
        style={{ width: 8, height: 8, border: `1.5px solid ${color}` }}
      />
    </motion.div>
  );
}

function TimelineSegment({
  progress,
  color,
  top,
  height,
  right,
  left
}: {
  progress: MotionValue<number>;
  color: string;
  top: number | MotionValue<number>;
  height: number | MotionValue<number>;
  right?: number | string;
  left?: number | string;
}) {
  return (
    <motion.div
      className="absolute w-[2px] z-10 -translate-x-1/2 origin-top"
      style={{
        background: `${color}22`,
        top,
        height,
        right,
        left,
      }}
    >
      <motion.div
        className="absolute inset-0 origin-top"
        style={{ scaleY: progress, background: color }}
      />
    </motion.div>
  );
}

// Line heights needed to reach each node from LINE_START
const EXP_H = EXP_NODE.map(n => n - LINE_START); // [120, 340, 560]
const EDU_H = EDU_NODE.map(n => n - LINE_START);  // [120, 340]

function TimelineCard({
  entry,
  index,
  total,
  progress,
  expandedId,
  setExpandedId,
  isEducation = false,
  scaleFactor,
  measureRef
}: {
  entry: Entry;
  index: number;
  total: number;
  progress: MotionValue<number>;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  isEducation?: boolean;
  scaleFactor: number;
  measureRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const isSelected = expandedId === entry.id;
  const [isLocalExpanded, setIsLocalExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isSelected) {
      setIsLocalExpanded(true);
      setIsClosing(false);
    } else if (isLocalExpanded) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsLocalExpanded(false);
        setIsClosing(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isSelected, isLocalExpanded]);

  const handleToggle = () => {
    if (isClosing) return;
    if (isSelected) {
      setExpandedId(null);
    } else {
      setExpandedId(entry.id);
    }
  };

  const isExpanded = isLocalExpanded;

  /* ── Per-card scroll-driven values ── */
  let y = 0, x: MotionValue<number> | number, opacity: MotionValue<number> | number, nodeScale: MotionValue<number> | number;

  if (total === 3) {
    if (index === 0) {
      y = 0;
      nodeScale = useTransform(progress, [0, 0.05], [0, 1]);
      x = useTransform(progress, [0, 0.1], [isEducation ? -30 : 30, 0]);
      opacity = useTransform(progress, [0.05, 0.2], [0, 1]);
    } else if (index === 1) {
      y = EXP_CARD_GAP;
      nodeScale = useTransform(progress, [0.33, 0.38], [0, 1]);
      x = useTransform(progress, [0.33, 0.43], [isEducation ? -30 : 30, 0]);
      opacity = useTransform(progress, [0.38, 0.53], [0, 1]);
    } else {
      y = EXP_CARD_GAP * 2;
      nodeScale = useTransform(progress, [0.66, 0.71], [0, 1]);
      x = useTransform(progress, [0.66, 0.76], [isEducation ? -30 : 30, 0]);
      opacity = useTransform(progress, [0.71, 0.86], [0, 1]);
    }
  } else if (total === 2) {
    if (index === 0) {
      y = 0;
      nodeScale = useTransform(progress, [0, 0.05], [0, 1]);
      x = useTransform(progress, [0, 0.1], [isEducation ? -30 : 30, 0]);
      opacity = useTransform(progress, [0.05, 0.2], [0, 1]);
    } else {
      y = EDU_CARD_GAP;
      nodeScale = useTransform(progress, [0.5, 0.55], [0, 1]);
      x = useTransform(progress, [0.5, 0.6], [isEducation ? -30 : 30, 0]);
      opacity = useTransform(progress, [0.55, 0.7], [0, 1]);
    }
  } else {
    y = 0; opacity = 1; x = 0; nodeScale = 1;
  }

  const title = isEducation ? entry.institution : entry.company;
  const subtitle = isEducation ? entry.degree : entry.role;
  const hasBullets = entry.bullets && entry.bullets.length > 0;

  const [windowHeight, setWindowHeight] = useState(0);
  const [actualCardHeight, setActualCardHeight] = useState(400);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!cardRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setActualCardHeight((entry.target as HTMLElement).offsetHeight);
      }
    });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Adaptive positioning: Ensure the card never overflows the 700px container boundary.
  // Since the 700px container is guaranteed to fit on the screen, keeping the card inside it guarantees it is visible.
  let adaptiveYOffset = 0;
  if (isExpanded) {
    const cardBottom = y + actualCardHeight;
    const overflowContainer = cardBottom - 680; // 680 gives a 20px padding from the absolute bottom of the container

    if (overflowContainer > 0) {
      adaptiveYOffset = -overflowContainer;
    }
  }

  const styles = {
    ring: isEducation ? 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]',
    boxShadowExpanded: isEducation ? '0_0_40px_rgba(59,130,246,0.2)' : '0_0_40px_rgba(34,197,94,0.2)',
    boxShadowHover: isEducation ? '0px 0px 30px rgba(59,130,246,0.4)' : '0px 0px 30px rgba(34,197,94,0.4)',
    boxShadowNormal: isEducation ? '0_0_15px_rgba(59,130,246,0.1)' : '0_0_15px_rgba(34,197,94,0.1)',
    borderExpanded: isEducation ? 'border-blue-500/60' : 'border-green-500/60',
    borderNormal: isEducation ? 'border-blue-500/30' : 'border-green-500/30',
    borderHover: isEducation ? 'group-hover:border-blue-500/60' : 'group-hover:border-green-500/60',
    bgOverlay: isEducation ? 'bg-blue-500/15' : 'bg-green-500/15',
    textMain: isEducation ? 'text-blue-500' : 'text-green-500',
    textMuted: isEducation ? 'text-blue-400' : 'text-green-400',
    borderTop: isEducation ? 'border-blue-500/20' : 'border-green-500/20',
    bgDot: isEducation ? 'bg-blue-500' : 'bg-green-500'
  };

  return (
    <div
      style={{ top: y, zIndex: isExpanded ? 50 : 30 - index }}
      className="absolute w-full flex right-0 pr-12 md:pr-16 justify-end"
    >
      {/* Card content wrapper – applies translation independently of layout animation */}
      <motion.div
        ref={measureRef}
        animate={{ y: isExpanded && !isClosing ? adaptiveYOffset : 0 }}
        transition={{ y: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
        className="relative z-50"
      >
        {/* Card content – slides in after node pops and expands/collapses layout */}
        <motion.div
          layout
          ref={cardRef}
          style={{ opacity, x }}
          onClick={handleToggle}
          whileHover={!isExpanded && !isClosing && hasBullets ? { scale: 1.02, y: -4, boxShadow: styles.boxShadowHover, transition: { duration: 0.2, ease: "easeOut" } } : undefined}
          className={`group relative ${hasBullets ? 'cursor-pointer' : 'cursor-default'} bg-black/50 border backdrop-blur-2xl ${isExpanded
            ? `w-[calc(100vw-64px)] md:w-[500px] lg:w-[560px] max-w-2xl p-4 md:p-5 rounded-[24px] z-50 shadow-[${styles.boxShadowExpanded}] ${styles.borderExpanded} origin-top-right transition-colors`
            : `overflow-hidden origin-center ${styles.borderNormal} w-[300px] sm:w-[400px] md:w-[460px] lg:w-[500px] h-auto min-h-[120px] p-6 rounded-[16px] shadow-[${styles.boxShadowNormal}] ${hasBullets ? styles.borderHover : ''} transition-colors duration-300`
            }`}
          transition={{ layout: { duration: isExpanded ? 0.4 : 0.25, ease: isExpanded ? [0.22, 1, 0.36, 1] : "easeOut" } }}
        >
          {!isExpanded && hasBullets && (
            <div className={`absolute top-0 left-0 w-full h-full ${styles.bgOverlay} pointer-events-none z-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out`} />
          )}
          {!isExpanded && <BorderTrail className={`${styles.textMain} z-0`} />}

          <motion.div layout="position" className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  {entry.logo && (
                    <div className="h-8 md:h-10 relative flex items-center shrink-0">
                      <img
                        src={`${entry.logo}?v=2`}
                        alt={title}
                        className={`h-full object-contain max-w-[200px] opacity-90 ${entry.invertLogo ? 'filter brightness-0 invert' : ''}`}
                      />
                    </div>
                  )}
                  {(!entry.logo || isEducation) && (
                    <h4 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                      {title}
                    </h4>
                  )}
                </div>
                <div className="text-gray-300 font-medium mb-1">
                  {subtitle?.replace(" Intern", "")} {!isEducation && <span className="text-gray-500 text-sm ml-1">| Internship</span>}
                </div>
                <div className={`${styles.textMuted} flex items-center gap-2 text-sm md:text-base font-mono`}>
                  <Clock className="w-3.5 h-3.5" />
                  {entry.duration}
                </div>

                {isEducation && (
                  <div className={`mt-4 pt-4 border-t ${styles.borderTop} ${styles.textMuted} font-mono text-xs flex flex-col gap-2`}>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" /> {entry.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" /> {entry.location}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {isExpanded && hasBullets && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: isClosing ? 0 : 1, scale: isClosing ? 0.98 : 1 }}
              transition={{ duration: isClosing ? 0.15 : 0.3, delay: isClosing ? 0 : 0.1, ease: "easeOut" }}
              className="mt-4 space-y-2 origin-top"
            >
              <div className={`mt-3 pt-3 border-t ${styles.borderTop}`}>
                <h4 className="text-sm md:text-base font-semibold text-gray-200 mb-2">
                  {subtitle}
                </h4>

                <div className={`${styles.textMuted} font-mono text-xs mb-3 flex flex-wrap gap-2`}>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {entry.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {entry.location}
                  </span>
                </div>

                <ul className="space-y-1.5">
                  {entry.bullets?.map((bullet, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: isClosing ? 0 : 1, x: isClosing ? 10 : 0 }}
                      transition={{ delay: isClosing ? 0 : 0.15 + i * 0.05 }}
                      className="flex gap-2.5 text-xs md:text-sm text-gray-300 leading-snug"
                    >
                      <span className={`${styles.textMain} mt-1.5 flex-shrink-0`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${styles.bgDot}`} />
                      </span>
                      <span>{bullet}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function ExperienceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [scaleFactor, setScaleFactor] = useState(1);
  useEffect(() => {
    const handleResize = () => setScaleFactor(Math.min(1, window.innerHeight / 750));
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  /* ─── Phase sub-progresses ─── */
  const expProgress = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const sweepProgress = useTransform(scrollYProgress, [0.35, 0.45], [0, 1]);
  const eduProgress = useTransform(scrollYProgress, [0.55, 0.85], [0, 1]);

  /* ─── Color: green → blue ─── */
  const lineColor = useTransform(sweepProgress, [0, 1], ["#22c55e", "#3b82f6"]);
  const shadowColor = useTransform(sweepProgress, [0, 1], ["rgba(34,197,94,1)", "rgba(59,130,246,1)"]);
  const boxShadow = useMotionTemplate`0 0 15px ${shadowColor}`;

  const cardColumnRightRef = useRef<HTMLDivElement>(null);
  const anchorXRight = useMeasuredX(cardColumnRightRef, 'right');
  const trackRightX = anchorXRight !== null ? anchorXRight + 32 : undefined;

  const cardColumnLeftRef = useRef<HTMLDivElement>(null);
  const anchorXLeft = useMeasuredX(cardColumnLeftRef, 'left');
  const trackLeftX = anchorXLeft !== null ? anchorXLeft - 28 : undefined;

  const trackRightXMV = useMotionValue(0);
  const trackLeftXMV = useMotionValue(0);

  useEffect(() => {
    if (trackRightX !== undefined) trackRightXMV.set(trackRightX);
  }, [trackRightX, trackRightXMV]);

  useEffect(() => {
    if (trackLeftX !== undefined) trackLeftXMV.set(trackLeftX);
  }, [trackLeftX, trackLeftXMV]);

  const sweepingLineLeft = useTransform(
    [sweepProgress, trackRightXMV, trackLeftXMV],
    ([v, r, l]: any[]) => (r as number) + ((l as number) - (r as number)) * (v as number)
  );

  /* ─── Clip paths for wipe (Horizontal only, perfectly synced to morph line!) ─── */
  const clipExp = useMotionTemplate`inset(-2000px calc(100% - ${sweepingLineLeft}px) -2000px 0)`;
  const clipEdu = useMotionTemplate`inset(-2000px 0 -2000px ${sweepingLineLeft}px)`;

  /* ─── THE ONE LINE (Continuous Morph): acts as stem for the active track ─── */
  const lineTopPx = useTransform(scrollYProgress,
    [0.0, 0.30, 0.35, 0.45, 0.50, 1.0],
    [LINE_START, LINE_START, 20, 20, LINE_START, LINE_START]
  );

  const lineHeightPx = useTransform(scrollYProgress,
    [0.0, 0.03, 0.30, 0.35, 0.45, 0.50, 0.52, 0.55, 1.0],
    [0, EXP_H[0], EXP_H[0], 700, 700, 0, 0, EDU_H[0], EDU_H[0]]
  );

  const sweepingLineOpacity = useTransform(scrollYProgress,
    [0, 0.01],
    [0, 1]
  );

  const expTrackOpacity = useTransform(scrollYProgress,
    [0, 0.30, 0.35, 1],
    [1, 1, 0, 0]
  );

  // Segment progresses for Experience
  const expSeg1 = useTransform(expProgress, [0.05, 0.33], [0, 1]);
  const expSeg2 = useTransform(expProgress, [0.38, 0.66], [0, 1]);
  
  // Segment progresses for Education
  const eduSeg1 = useTransform(eduProgress, [0.05, 0.33], [0, 1]);

  // Node scale progresses
  const expNode0Scale = useTransform(expProgress, [0, 0.05], [0, 1]);
  const expNode1Scale = useTransform(expProgress, [0.33, 0.38], [0, 1]);
  const expNode2Scale = useTransform(expProgress, [0.66, 0.71], [0, 1]);
  
  const eduNode0Scale = useTransform(eduProgress, [0, 0.05], [0, 1]);
  const eduNode1Scale = useTransform(eduProgress, [0.33, 0.38], [0, 1]);

  return (
    <section ref={containerRef} className="relative w-full h-[800vh]">
      <div className="sticky top-0 h-screen w-full pr-2 md:pr-12 lg:pr-24 xl:pr-32 flex items-center justify-end pointer-events-none">

        {/* Main container – all coordinates are relative to this 700px box */}
        <div
          className="w-full md:w-3/4 lg:w-1/2 relative h-[700px] pointer-events-auto"
          style={{ transform: `scale(${scaleFactor})`, transformOrigin: 'center center' }}
        >

          {/* THE SWEEPING MORPH LINE */}
          <motion.div
            className="absolute w-[3px] rounded-full z-50 transition-colors duration-300 -translate-x-1/2 pointer-events-none"
            style={{
              left: sweepingLineLeft,
              top: lineTopPx,
              height: lineHeightPx,
              backgroundColor: lineColor,
              boxShadow: boxShadow,
              opacity: sweepingLineOpacity
            }}
          />

          {/* ═══ SEGMENTED TRACKS (Dynamically measured anchors) ═══ */}
          <div className="absolute top-0 bottom-0 w-full z-10 pointer-events-none">
            {/* Experience Nodes & Segments (Right Track, fades out during sweep) */}
            <motion.div style={{ opacity: expTrackOpacity }}>
              <TimelineNode isActive={true} color="#22c55e" top={EXP_NODE[0]} left={trackRightX} scale={expNode0Scale} />
              <TimelineSegment progress={expSeg1} color="#22c55e" top={EXP_NODE[0]} height={EXP_CARD_GAP} left={trackRightX} />
              
              <TimelineNode isActive={true} color="#22c55e" top={EXP_NODE[1]} left={trackRightX} scale={expNode1Scale} />
              <TimelineSegment progress={expSeg2} color="#22c55e" top={EXP_NODE[1]} height={EXP_CARD_GAP} left={trackRightX} />
              
              <TimelineNode isActive={true} color="#22c55e" top={EXP_NODE[2]} left={trackRightX} scale={expNode2Scale} />
            </motion.div>

            {/* Education Nodes & Segments (Left Track, fades in after sweep) */}
            <motion.div style={{ opacity: eduProgress }}>
              <TimelineNode isActive={true} color="#3b82f6" top={EDU_NODE[0]} left={trackLeftX} scale={eduNode0Scale} />
              <TimelineSegment progress={eduSeg1} color="#3b82f6" top={EDU_NODE[0]} height={EDU_CARD_GAP} left={trackLeftX} />
              <TimelineNode isActive={true} color="#3b82f6" top={EDU_NODE[1]} left={trackLeftX} scale={eduNode1Scale} />
            </motion.div>
          </div>

          {/* ═══ EXPERIENCE LAYER (clipped from right during sweep) ═══ */}
          <motion.div
            style={{ clipPath: clipExp }}
            className="absolute inset-0 pointer-events-auto"
          >
            <h3 className="absolute top-[24px] right-0 w-full text-right pr-20 md:pr-24 text-5xl md:text-6xl lg:text-7xl font-bold text-white/90 tracking-tighter drop-shadow-2xl">
              Experience
            </h3>

            <div className="absolute w-full" style={{ top: CARDS_TOP }}>
              {EXPERIENCES.map((exp, index) => (
                <TimelineCard
                  key={exp.id}
                  entry={exp}
                  index={index}
                  total={EXPERIENCES.length}
                  progress={expProgress}
                  expandedId={expandedId}
                  setExpandedId={setExpandedId}
                  scaleFactor={scaleFactor}
                  measureRef={index === 0 ? cardColumnRightRef : undefined}
                />
              ))}
            </div>
          </motion.div>

          {/* ═══ EDUCATION LAYER (revealed from right during sweep) ═══ */}
          <motion.div
            style={{ clipPath: clipEdu }}
            className="absolute inset-0 pointer-events-auto"
          >
            <h3 className="absolute top-[24px] right-0 w-full text-right pr-20 md:pr-24 text-5xl md:text-6xl lg:text-7xl font-bold text-white/90 tracking-tighter drop-shadow-2xl">
              Education
            </h3>

            <div className="absolute w-full" style={{ top: CARDS_TOP }}>
              {EDUCATIONS.map((edu, index) => (
                <TimelineCard
                  key={edu.id}
                  entry={edu}
                  index={index}
                  total={EDUCATIONS.length}
                  progress={eduProgress}
                  expandedId={expandedId}
                  setExpandedId={setExpandedId}
                  isEducation={true}
                  scaleFactor={scaleFactor}
                  measureRef={index === 0 ? cardColumnLeftRef : undefined}
                />
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
