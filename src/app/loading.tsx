"use client";

import { motion } from "framer-motion";

// ============================================
// Loading â€“ Heartbeat pulse animation
// ============================================

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[999] bg-[#050505] flex flex-col items-center justify-center gap-6">
      {/* Pulsing ring */}
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-red-500/30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-red-500/50"
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.2 }}
        />
        <motion.div
          className="absolute inset-2 rounded-full bg-red-600/80"
          animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Brand text */}
      <motion.p
        className="font-heading text-xs tracking-[0.5em] uppercase text-white/30"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Fitness Plus
      </motion.p>
    </div>
  );
}
