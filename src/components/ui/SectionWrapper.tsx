"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ============================================
// SectionWrapper – Scroll-triggered reveal
// ============================================

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export default function SectionWrapper({
  children,
  id,
  className = "",
  delay = 0,
  direction = "up",
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const directionOffset = {
    up: { y: 60 },
    down: { y: -60 },
    left: { x: 60 },
    right: { x: -60 },
  };

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`relative py-20 md:py-32 px-6 md:px-12 lg:px-20 ${className}`}
      initial={{ opacity: 0, ...directionOffset[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.section>
  );
}
