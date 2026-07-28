'use client';

import React, { useEffect, useState } from 'react';

interface TextScrambleProps {
  children: string;
  className?: string;
  duration?: number;
  characterSet?: string;
}

const DEFAULT_CHARACTER_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

export function TextScramble({
  children,
  className,
  duration = 1,
  characterSet = DEFAULT_CHARACTER_SET,
}: TextScrambleProps) {
  const [text, setText] = useState(children);
  const [isScrambling, setIsScrambling] = useState(false);

  useEffect(() => {
    if (!children) return;

    let iteration = 0;
    const maxIterations = children.length;
    const interval = (duration * 1000) / (maxIterations * 3); // smoother updates

    setIsScrambling(true);

    const timeout = setInterval(() => {
      setText(
        children
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return children[index];
            }
            if (char === ' ') return ' ';
            return characterSet[Math.floor(Math.random() * characterSet.length)];
          })
          .join('')
      );

      if (iteration >= maxIterations) {
        clearInterval(timeout);
        setIsScrambling(false);
      }
      iteration += 1 / 3;
    }, interval);

    return () => clearInterval(timeout);
  }, [children, duration, characterSet]);

  return (
    <span className={className}>
      {text}
    </span>
  );
}
