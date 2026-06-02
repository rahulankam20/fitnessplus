"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimatedText from "@/components/ui/AnimatedText";
import { STATS } from "@/lib/constants";

// ============================================
// Counter â€“ Animated count-up number
// ============================================

function Counter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      className="glass-card rounded-xl p-6 text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="font-heading text-4xl md:text-5xl font-bold text-red-500 text-glow-subtle mb-1">
        {count}{suffix}
      </div>
      <div className="text-sm text-gray-400 tracking-wide uppercase">{label}</div>
    </motion.div>
  );
}

// ============================================
// About Section â€“ Gym philosophy + stats
// ============================================

export default function About() {
  return (
    <SectionWrapper id="about" className="gradient-dark">
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-8 h-[2px] bg-red-500" />
          <span className="text-xs tracking-[0.3em] uppercase text-red-400 font-medium">
            About Us
          </span>
        </motion.div>

        {/* Main content â€“ 2 column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          {/* Left â€“ Text content */}
          <div>
            <AnimatedText
              text="WHERE EVERY REP COUNTS"
              as="h2"
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
              delay={0.2}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                Located in the heart of <span className="text-white font-medium">Kurla East, Mumbai</span>, 
                Fitness Plus is more than just a gym â€” it&apos;s a movement. We believe in empowering 
                every individual to unlock their full potential through disciplined training, 
                expert guidance, and an unshakable community spirit.
              </p>
              <p className="text-gray-500 text-base leading-relaxed">
                Whether you&apos;re a first-timer stepping into the gym for the first time or an 
                experienced athlete pushing your limits, our certified trainers and world-class 
                equipment create the perfect environment for transformation. Your goals become 
                our mission â€” and we don&apos;t stop until you succeed.
              </p>
            </motion.div>

            {/* Red accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="w-20 h-[3px] bg-gradient-to-r from-red-500 to-red-700 mt-8 origin-left"
            />
          </div>

          {/* Right â€“ Decorative element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative flex items-center justify-center"
          >
            {/* Abstract decorative bg */}
            <div className="relative w-full aspect-square max-w-md">
              {/* Glowing orb */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-red-600/20 to-red-900/5 blur-3xl" />
              </div>

              {/* Grid pattern */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border border-white/5 rounded-lg rotate-45" />
                <div className="absolute w-36 h-36 border border-red-500/10 rounded-lg rotate-12" />
                <div className="absolute w-24 h-24 border border-red-500/20 rounded-lg -rotate-12" />
              </div>

              {/* Center text emblem */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-heading text-6xl md:text-7xl font-bold text-white/5">
                    FP
                  </div>
                  <div className="text-[10px] tracking-[0.5em] uppercase text-red-500/40 mt-2">
                    EST. 2014
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((stat) => (
            <Counter key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
