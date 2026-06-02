"use client";

import { motion } from "framer-motion";
import { BRAND, NAV_LINKS } from "@/lib/constants";

// ============================================
// Footer - Brand info, links, socials
// ============================================

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#030303] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-heading text-2xl font-bold tracking-wide mb-1">
                <span className="text-white">FITNESS</span>
                <span className="text-red-500"> PLUS</span>
              </h3>
              <p className="text-gray-600 text-sm mb-4">{BRAND.tagline}</p>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Your trusted fitness partner in Kurla East. Transforming lives through
                disciplined training and community support since 2014.
              </p>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="font-heading text-sm tracking-[0.2em] uppercase text-white/60 mb-5 font-medium">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-500 text-sm hover:text-red-400 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-3 h-[1px] bg-red-500 transition-all duration-300" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-heading text-sm tracking-[0.2em] uppercase text-white/60 mb-5 font-medium">
                Get in Touch
              </h4>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-0.5 text-[10px] font-semibold tracking-[0.2em] uppercase">Visit</span>
                  <span className="text-gray-500 text-sm">{BRAND.location}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-0.5 text-[10px] font-semibold tracking-[0.2em] uppercase">Call</span>
                  <span className="text-gray-500 text-sm">{BRAND.phone}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-0.5 text-[10px] font-semibold tracking-[0.2em] uppercase">Mail</span>
                  <span className="text-gray-500 text-sm">{BRAND.email}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-0.5 text-[10px] font-semibold tracking-[0.2em] uppercase">Social</span>
                  <a
                    href={BRAND.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 text-sm hover:text-red-400 transition-colors duration-300"
                  >
                    {BRAND.instagram}
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs tracking-wider">
            Copyright {currentYear} Fitness Plus Gym. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span className="text-gray-700 text-xs">Made with</span>
            <motion.span
              className="text-red-500 text-sm"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              +
            </motion.span>
            <span className="text-gray-700 text-xs">in Mumbai</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
    </footer>
  );
}
