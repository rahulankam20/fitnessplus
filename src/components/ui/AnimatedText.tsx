"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ============================================
// AnimatedText – Staggered word/char reveal
// ============================================

interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  splitBy?: "word" | "character";
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
}

export default function AnimatedText({
  text,
  className = "",
  as: Tag = "p",
  splitBy = "word",
  delay = 0,
  staggerDelay = 0.05,
  once = true,
}: AnimatedTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  const units = splitBy === "word" ? text.split(" ") : text.split("");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const unitVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      rotateX: -40,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="overflow-hidden"
    >
      <Tag className={className}>
        {units.map((unit, i) => (
          <motion.span
            key={i}
            variants={unitVariants}
            className="inline-block"
            style={{ perspective: 500 }}
          >
            {unit}
            {splitBy === "word" && i < units.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </Tag>
    </motion.div>
  );
}
