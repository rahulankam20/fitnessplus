"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// ============================================
// ScrollToTop - Floating scroll-to-top button
// ============================================

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-red-600/90 border border-red-500/40 flex items-center justify-center text-white text-lg shadow-lg hover:bg-red-500 hover:scale-110 transition-all duration-300 animate-pulse-glow cursor-pointer"
          aria-label="Scroll to top"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.9 }}
        >
          ^
        </motion.button>
      )}
    </AnimatePresence>
  );
}
