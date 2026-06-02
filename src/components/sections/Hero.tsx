"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import AnimatedText from "@/components/ui/AnimatedText";
import Button from "@/components/ui/Button";
import { BRAND } from "@/lib/constants";

// Dynamic import â€“ Three.js needs browser APIs (no SSR)
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

// ============================================
// Hero Section â€“ Cinematic 3D Immersive Entry
// ============================================

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full h-screen overflow-hidden gradient-hero"
    >
      {/* 3D WebGL Canvas (background layer) */}
      <HeroScene />

      {/* Radial gradient overlay for text readability */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/40 via-transparent to-[#050505]/40" />
      </div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 z-[1] noise-overlay pointer-events-none" />

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6"
        >
          <span className="glass px-4 py-1.5 rounded-full text-xs tracking-[0.25em] uppercase text-red-400 font-medium">
            Kurla East, Mumbai
          </span>
        </motion.div>

        {/* Main Headline */}
        <div className="max-w-4xl mx-auto mb-4">
          <AnimatedText
            text="YOUR FITNESS GOALS."
            as="h1"
            className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-none"
            splitBy="word"
            delay={0.5}
            staggerDelay={0.1}
          />
          <AnimatedText
            text="OUR MISSION."
            as="h1"
            className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-red-500 text-glow leading-none mt-1"
            splitBy="word"
            delay={0.9}
            staggerDelay={0.1}
          />
        </div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-base sm:text-lg md:text-xl text-gray-400 font-light tracking-wide mb-10 max-w-lg"
        >
          {BRAND.subheading}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.7 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Button variant="primary" size="lg" href="#contact" pulse>
            {BRAND.cta}
          </Button>
          <Button variant="secondary" size="lg" href="#services">
            Explore Services
          </Button>
        </motion.div>

        {/* Brand name (subtle) */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="absolute bottom-28 text-[10px] tracking-[0.5em] uppercase text-white/20 font-light"
        >
          {BRAND.name}
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/30">Scroll</span>
        <motion.div
          className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5"
          animate={{ borderColor: ["rgba(255,255,255,0.2)", "rgba(255,0,0,0.4)", "rgba(255,255,255,0.2)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-1.5 bg-red-500 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent z-[2]" />
    </section>
  );
}
