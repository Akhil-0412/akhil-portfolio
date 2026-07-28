'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

interface TextScrambleProps {
  children: string;
  className?: string;
  scrambleSpeed?: number;
  revealDuration?: number;
  revealDelay?: number;
}

const CHARS = '!<>-_\\\\/[]{}—=+*^?#________';

export function TextScramble({
  children,
  className = '',
  scrambleSpeed = 50,
  revealDuration = 1000,
  revealDelay = 0,
}: TextScrambleProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });
  const [displayText, setDisplayText] = useState(children.replace(/./g, ' '));
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;

    let timeout: NodeJS.Timeout;
    
    // Initial delay before scrambling begins
    timeout = setTimeout(() => {
      let frame = 0;
      const targetLength = children.length;
      const totalFrames = Math.max(20, revealDuration / scrambleSpeed);
      
      const interval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const revealedCount = Math.floor(progress * targetLength);
        
        let newText = '';
        for (let i = 0; i < targetLength; i++) {
          if (children[i] === ' ') {
            newText += ' ';
          } else if (i < revealedCount) {
            newText += children[i];
          } else {
            newText += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        
        setDisplayText(newText);

        if (frame >= totalFrames) {
          clearInterval(interval);
          setDisplayText(children);
        }
      }, scrambleSpeed);

      return () => clearInterval(interval);
    }, revealDelay);

    return () => clearTimeout(timeout);
  }, [isInView, children, scrambleSpeed, revealDuration, revealDelay]);

  return (
    <span ref={containerRef} className={className}>
      {displayText}
    </span>
  );
}
