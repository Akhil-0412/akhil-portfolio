"use client";

import { motion } from "framer-motion";

interface BorderTrailProps {
  className?: string;
  size?: number;
}

export function BorderTrail({ className, size = 120 }: BorderTrailProps) {
  return (
    <div 
      className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
      style={{
        padding: "1px", // Border thickness
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    >
      <motion.div
        className={`absolute aspect-square bg-[conic-gradient(from_0deg,transparent_0_300deg,currentColor_360deg)] ${className || ""}`}
        style={{
          width: "200%",
          left: "-50%",
          top: "-50%",
          transformOrigin: "center",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
