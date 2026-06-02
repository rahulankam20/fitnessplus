"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/constants";
import Button from "@/components/ui/Button";

// ============================================
// Navbar - Glassmorphism sticky navigation
// ============================================

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "py-3" : "py-5"
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          className="absolute inset-0 backdrop-blur-xl border-b border-white/5"
          style={{
            backgroundColor: `rgba(5, 5, 5, ${isScrolled ? 0.85 : 0})`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-1.5">
            <div className="w-8 h-8 bg-red-600 rounded-sm flex items-center justify-center">
              <span className="font-heading text-white text-sm font-bold">F+</span>
            </div>
            <span className="font-heading text-lg font-bold tracking-wider">
              <span className="text-white">FITNESS</span>
              <span className="text-red-500">PLUS</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-xs tracking-[0.15em] uppercase text-gray-400 hover:text-white transition-colors duration-300 relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-red-500 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          <div className="hidden md:block">
            <Button variant="primary" size="sm" href="#contact">
              Join Now
            </Button>
          </div>

          <button
            className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="w-6 h-[1.5px] bg-white block"
              animate={isMobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            />
            <motion.span
              className="w-6 h-[1.5px] bg-white block"
              animate={isMobileOpen ? { opacity: 0 } : { opacity: 1 }}
            />
            <motion.span
              className="w-6 h-[1.5px] bg-white block"
              animate={isMobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            />
          </button>
        </div>
      </motion.nav>

      <motion.div
        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
        initial={{ opacity: 0, pointerEvents: "none" as const }}
        animate={
          isMobileOpen
            ? { opacity: 1, pointerEvents: "auto" as const }
            : { opacity: 0, pointerEvents: "none" as const }
        }
        transition={{ duration: 0.3 }}
      >
        {NAV_LINKS.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            className="font-heading text-3xl font-bold text-white/80 hover:text-red-500 transition-colors tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={isMobileOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            onClick={() => setIsMobileOpen(false)}
          >
            {link.label}
          </motion.a>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isMobileOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5 }}
        >
          <Button variant="primary" size="lg" href="#contact" onClick={() => setIsMobileOpen(false)}>
            Join Now
          </Button>
        </motion.div>
      </motion.div>
    </>
  );
}
