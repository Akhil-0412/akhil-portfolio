'use client';

import { useRef, useState, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

/**
 * PROBLEM THIS SOLVES:
 *
 * 1. The track's horizontal (x) position was previously driven by a guessed
 *    value (hardcoded px/vw/%), so when the title text width changed during
 *    the morph animation, the track visually drifted across the card content
 *    instead of staying locked to the card column's real edge.
 *
 *    FIX: measure the actual card column's bounding box with a ref, and use
 *    THAT measured pixel value as the animation's start/end target — never
 *    a guessed constant. If the layout changes (responsive breakpoint, font
 *    load, content change), the anchor recalculates instead of going stale.
 *
 * 2. The node looked like "a line passing through a hollow circle" because
 *    it structurally was: one continuous stroke, one outline circle on top.
 *
 *    FIX: build the line as SEGMENTS between nodes, not one continuous bar.
 *    Each segment fills solid once its card has been scrolled past (reads as
 *    progress), and stays dim ahead of it. Nodes are filled dots with a soft
 *    outer glow (box-shadow blur), rendered ABOVE the line in z-index, so the
 *    line visually terminates at the node's center rather than "through" it.
 */

interface TimelineItem {
  id: string;
  label: string;
}

function useMeasuredX(ref: React.RefObject<HTMLElement>, edge: 'left' | 'right') {
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

    // re-measure on resize AND on font/content load — a title morph changing
    // width is exactly the kind of thing ResizeObserver catches that a
    // one-time measurement on mount would miss.
    const observer = new ResizeObserver(measure);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, edge]);

  return x;
}

function TimelineNode({
  isActive,
  color,
}: {
  isActive: boolean;
  color: string;
}) {
  return (
    <div className="relative z-10 flex items-center justify-center" style={{ width: 20, height: 20 }}>
      {/* outer glow ring — this is most of what reads as "premium" vs "flat" */}
      <motion.div
        className="absolute rounded-full"
        animate={{
          boxShadow: isActive
            ? `0 0 0 4px ${color}22, 0 0 16px 4px ${color}66`
            : `0 0 0 2px ${color}11, 0 0 4px 0px ${color}00`,
        }}
        transition={{ duration: 0.4 }}
        style={{ width: 20, height: 20 }}
      />
      {/* inner filled dot */}
      <motion.div
        className="rounded-full"
        animate={{
          backgroundColor: isActive ? color : '#1a1d22',
          scale: isActive ? 1 : 0.7,
        }}
        transition={{ duration: 0.3 }}
        style={{ width: 10, height: 10, border: `1.5px solid ${color}` }}
      />
    </div>
  );
}

function TimelineSegment({ progress, color }: { progress: MotionValue<number>; color: string }) {
  // scaleY grows 0->1 as this specific segment is scrolled past — this is
  // what makes the line read as "filling in" rather than sitting static
  return (
    <div className="relative w-px flex-1" style={{ background: `${color}22` }}>
      <motion.div
        className="absolute inset-0 origin-top"
        style={{ scaleY: progress, background: color }}
      />
    </div>
  );
}

export default function PremiumTimeline({
  items,
  cardColumnRef,
  anchorEdge,
  accentColor = '#38bdf8',
}: {
  items: TimelineItem[];
  cardColumnRef: React.RefObject<HTMLElement>;
  anchorEdge: 'left' | 'right';
  accentColor?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const anchorX = useMeasuredX(cardColumnRef, anchorEdge);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  // per-segment progress: each segment fills between item i and item i+1
  const segmentProgresses = items.slice(0, -1).map((_, i) =>
    useTransform(
      scrollYProgress,
      [i / (items.length - 1), (i + 1) / (items.length - 1)],
      [0, 1]
    )
  );

  const GAP = 24; // px, distance between the card edge and the track

  return (
    <div
      ref={containerRef}
      className="absolute top-0 flex flex-col items-center"
      style={{
        // THE ACTUAL FIX: positioned off the MEASURED card edge, not a guess.
        // Recalculates automatically if the card column's width changes.
        left: anchorX !== null ? anchorX + (anchorEdge === 'right' ? GAP : -GAP) : undefined,
        opacity: anchorX !== null ? 1 : 0, // avoid a flash-of-wrong-position on first paint
        height: '100%',
      }}
    >
      {items.map((item, i) => (
        <div key={item.id} className="flex flex-col items-center flex-1 w-full">
          <TimelineNode isActive={true} color={accentColor} />
          {i < items.length - 1 && (
            <TimelineSegment progress={segmentProgresses[i]} color={accentColor} />
          )}
        </div>
      ))}
    </div>
  );
}
