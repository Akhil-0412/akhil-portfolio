'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface TextRollProps {
  children: string;
  className?: string;
  variants?: {
    enter: { initial: any; animate: any };
    exit: { initial: any; animate: any };
  };
  duration?: number;
  getEnterDelay?: (index: number) => number;
  getExitDelay?: (index: number) => number;
  transition?: any;
}

export function TextRoll({
  children,
  className = '',
  variants = {
    enter: {
      initial: { y: 0 },
      animate: { y: 40 },
    },
    exit: {
      initial: { y: -40 },
      animate: { y: 0 },
    },
  },
  duration = 0.3,
  getEnterDelay = (i) => i * 0.05,
  getExitDelay = (i) => i * 0.05 + 0.05,
  transition = { ease: [0.175, 0.885, 0.32, 1.1] },
}: TextRollProps) {
  const letters = children.split('');

  return (
    <motion.div
      className={`relative inline-block overflow-hidden ${className}`}
      initial="initial"
      whileHover="animate"
    >
      <div>
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            className="inline-block whitespace-pre"
            variants={{
              initial: variants.enter.initial,
              animate: variants.enter.animate,
            }}
            transition={{
              ...transition,
              duration,
              delay: getEnterDelay(i),
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
      <div className="absolute top-0 left-0">
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            className="inline-block whitespace-pre"
            variants={{
              initial: variants.exit.initial,
              animate: variants.exit.animate,
            }}
            transition={{
              ...transition,
              duration,
              delay: getExitDelay(i),
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
