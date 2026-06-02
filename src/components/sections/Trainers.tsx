"use client";

import { motion } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimatedText from "@/components/ui/AnimatedText";
import Card from "@/components/ui/Card";
import { TRAINERS } from "@/lib/constants";

// ============================================
// Trainers Section â€“ Expert trainers showcase
// ============================================

export default function Trainers() {
  return (
    <SectionWrapper id="trainers" className="gradient-dark">
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
            Our Team
          </span>
        </motion.div>

        {/* Heading */}
        <div className="mb-4">
          <AnimatedText
            text="MEET YOUR TRAINERS"
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
          Certified professionals who live and breathe fitness. Your goals are their mission.
        </motion.p>

        {/* Trainers grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {TRAINERS.map((trainer, index) => (
            <motion.div
              key={trainer.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <Card className="h-full text-center">
                {/* Avatar */}
                <motion.div
                  className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-red-500/20 to-red-900/10 flex items-center justify-center text-4xl border border-red-500/10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {trainer.avatar}
                </motion.div>

                {/* Name */}
                <h3 className="font-heading text-xl font-semibold text-white tracking-wide mb-1">
                  {trainer.name}
                </h3>

                {/* Specialty */}
                <div className="text-red-400 text-xs tracking-[0.15em] uppercase font-medium mb-3">
                  {trainer.specialty}
                </div>

                {/* Experience badge */}
                <div className="inline-block glass px-3 py-1 rounded-full text-[10px] tracking-wider uppercase text-gray-400 mb-4">
                  {trainer.experience} Experience
                </div>

                {/* Bio */}
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {trainer.bio}
                </p>

                {/* Certifications */}
                <div className="flex flex-wrap justify-center gap-2">
                  {trainer.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="text-[10px] tracking-wider uppercase text-red-400/50 border border-red-500/10 rounded px-2 py-0.5"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
