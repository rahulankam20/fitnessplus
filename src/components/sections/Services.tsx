"use client";

import { motion } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimatedText from "@/components/ui/AnimatedText";
import Card from "@/components/ui/Card";
import { SERVICES } from "@/lib/constants";

// ============================================
// Services Section â€“ Animated cards grid
// ============================================

export default function Services() {
  return (
    <SectionWrapper id="services" className="relative">
      {/* Radial bg glow */}
      <div className="absolute inset-0 gradient-radial-red pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-8 h-[2px] bg-red-500" />
          <span className="text-xs tracking-[0.3em] uppercase text-red-400 font-medium">
            What We Offer
          </span>
        </motion.div>

        {/* Heading */}
        <div className="mb-4">
          <AnimatedText
            text="OUR SERVICES"
            as="h2"
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            delay={0.1}
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 text-base md:text-lg max-w-xl mb-14"
        >
          Comprehensive fitness programs designed to push your limits and deliver real results.
        </motion.p>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <Card className="h-full">
                {/* Service icon + number */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-red-500/20 to-red-900/10 flex items-center justify-center text-2xl border border-red-500/10">
                    {service.icon}
                  </div>
                  <span className="text-[10px] tracking-widest text-white/15 font-mono">
                    0{index + 1}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading text-xl md:text-2xl font-semibold text-white mb-3 tracking-wide">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Learn more link */}
                <motion.div
                  className="flex items-center gap-2 text-red-400 text-xs tracking-wider uppercase font-medium group/link cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <span>Learn More</span>
                  <motion.span
                    className="inline-block"
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                  >
                    â†’
                  </motion.span>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
