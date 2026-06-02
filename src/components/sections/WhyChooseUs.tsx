"use client";

import { motion } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimatedText from "@/components/ui/AnimatedText";
import { BENEFITS } from "@/lib/constants";

// ============================================
// Why Choose Us â€“ Benefits grid
// ============================================

export default function WhyChooseUs() {
  return (
    <SectionWrapper id="why-us" className="gradient-dark">
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-8 h-[2px] bg-red-500" />
          <span className="text-xs tracking-[0.3em] uppercase text-red-400 font-medium">
            Why Fitness Plus
          </span>
        </motion.div>

        {/* Heading */}
        <div className="mb-4">
          <AnimatedText
            text="WHY CHOOSE US"
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
          What sets us apart from the rest. Here&apos;s why thousands trust Fitness Plus.
        </motion.p>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {BENEFITS.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="group"
            >
              <div className="glass-card rounded-xl p-6 md:p-8 h-full transition-all duration-500">
                {/* Icon */}
                <motion.div
                  className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/15 to-transparent flex items-center justify-center text-2xl mb-5 border border-red-500/10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {benefit.icon}
                </motion.div>

                {/* Title */}
                <h3 className="font-heading text-lg font-semibold text-white mb-2 tracking-wide group-hover:text-red-400 transition-colors duration-300">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed">
                  {benefit.description}
                </p>

                {/* Bottom accent line */}
                <motion.div
                  className="h-[2px] bg-gradient-to-r from-red-500 to-transparent mt-5 origin-left"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
