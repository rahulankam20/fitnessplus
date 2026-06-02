"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";

// ============================================
// Card – Glassmorphism tilt card with glow
// ============================================

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  tiltIntensity?: number;
}

export default function Card({
  children,
  className = "",
  glowColor = "rgba(255, 0, 0, 0.15)",
  tiltIntensity = 15,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Smooth motion values for tilt
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 150, damping: 20 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Transform mouse position to rotation
  const rotateX = useTransform(smoothY, [0, 1], [tiltIntensity, -tiltIntensity]);
  const rotateY = useTransform(smoothX, [0, 1], [-tiltIntensity, tiltIntensity]);

  // Glare position
  const glareX = useTransform(smoothX, [0, 1], [0, 100]);
  const glareY = useTransform(smoothY, [0, 1], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card relative rounded-xl p-6 md:p-8 cursor-pointer group ${className}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      {/* Glare effect – follows mouse */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: useTransform(
            [glareX, glareY],
            ([x, y]) =>
              `radial-gradient(circle at ${x}% ${y}%, ${glowColor}, transparent 60%)`
          ),
        }}
      />

      {/* Edge glow on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 30px ${glowColor}, 0 0 30px ${glowColor}`,
        }}
      />

      {/* Content */}
      <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
