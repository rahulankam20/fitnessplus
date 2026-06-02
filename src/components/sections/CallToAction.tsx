"use client";

import { motion } from "framer-motion";
import AnimatedText from "@/components/ui/AnimatedText";
import Button from "@/components/ui/Button";
import { BRAND } from "@/lib/constants";

// ============================================
// Call to Action - Final conversion section
// ============================================

export default function CallToAction() {
  return (
    <section className="relative py-24 md:py-36 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#1a0000] to-[#050505]" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <span className="text-xs tracking-[0.4em] uppercase text-red-400/80 font-medium">
            Ready to Transform?
          </span>
        </motion.div>

        <AnimatedText
          text="START YOUR FITNESS JOURNEY TODAY"
          as="h2"
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
          delay={0.2}
          staggerDelay={0.06}
        />

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-gray-400 text-base md:text-lg mt-6 mb-10 max-w-lg mx-auto"
        >
          Join Fitness Plus and experience the perfect blend of expert coaching,
          premium equipment, and an unstoppable community.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button variant="primary" size="lg" href="#contact" pulse>
            {BRAND.cta}
          </Button>
          <Button variant="secondary" size="lg" href={BRAND.instagramUrl}>
            Follow Us
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
          className="mt-12 flex items-center justify-center gap-2 text-gray-600 text-sm"
        >
          <span>Location</span>
          <span>{BRAND.location}</span>
        </motion.div>
      </div>
    </section>
  );
}
