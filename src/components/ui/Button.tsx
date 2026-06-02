"use client";

import { motion } from "framer-motion";
import React from "react";

// ============================================
// Button – Reusable CTA with glow + pulse
// ============================================

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  pulse?: boolean;
  onClick?: () => void;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  pulse = false,
  onClick,
}: ButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center font-semibold tracking-wider uppercase transition-all duration-300 rounded-sm overflow-hidden";

  const variants = {
    primary:
      "bg-red-600 text-white border border-red-500/50 hover:bg-red-500 hover:border-red-400",
    secondary:
      "bg-transparent text-white border border-white/20 hover:border-red-500/60 hover:text-red-400",
    ghost:
      "bg-transparent text-red-400 hover:text-red-300 border-none",
  };

  const sizes = {
    sm: "px-5 py-2 text-xs",
    md: "px-8 py-3.5 text-sm",
    lg: "px-10 py-4.5 text-base",
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      href={href}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        pulse ? "animate-pulse-glow" : ""
      } ${className}`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {/* Shimmer overlay on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>

      {/* Red glow underneath (primary only) */}
      {variant === "primary" && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-red-500/30 blur-xl rounded-full" />
      )}
    </Component>
  );
}
