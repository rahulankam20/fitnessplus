"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { BRAND } from "@/lib/constants";

// ============================================
// ContactForm - Glassmorphism inquiry form
// ============================================

interface ContactFormProps {
  prefilledMessage?: string;
}

export default function ContactForm({ prefilledMessage = "" }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (prefilledMessage) {
      setFormData((prev) => ({ ...prev, message: prefilledMessage }));
    }
  }, [prefilledMessage]);

  useEffect(() => {
    if (!isSubmitted) return;
    const timer = window.setTimeout(() => setIsSubmitted(false), 4000);
    return () => window.clearTimeout(timer);
  }, [isSubmitted]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setFormData({
      name: "",
      phone: "",
      email: "",
      message: "",
    });
  };

  const inputClasses =
    "w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3.5 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 focus:border-red-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(255,0,0,0.08)]";

  return (
    <section id="contact" className="relative py-24 md:py-36 px-6 md:px-12 lg:px-20 overflow-hidden">
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

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-[2px] bg-red-500" />
              <span className="text-xs tracking-[0.3em] uppercase text-red-400 font-medium">
                Get In Touch
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
            >
              START YOUR
              <br />
              <span className="text-red-500 text-glow-subtle">TRANSFORMATION</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-base md:text-lg mb-10 max-w-md"
            >
              Ready to take the first step? Drop us a message and our team will
              get back to you within 24 hours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-red-400 text-xs font-semibold tracking-[0.25em] uppercase">Visit</span>
                <span className="text-gray-400 text-sm">{BRAND.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-400 text-xs font-semibold tracking-[0.25em] uppercase">Call</span>
                <span className="text-gray-400 text-sm">{BRAND.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-400 text-xs font-semibold tracking-[0.25em] uppercase">Mail</span>
                <span className="text-gray-400 text-sm">{BRAND.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-400 text-xs font-semibold tracking-[0.25em] uppercase">Social</span>
                <a
                  href={BRAND.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 text-sm hover:text-red-400 transition-colors"
                >
                  {BRAND.instagram}
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 space-y-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs tracking-[0.15em] uppercase text-gray-500 mb-2 font-medium"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={inputClasses}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-xs tracking-[0.15em] uppercase text-gray-500 mb-2 font-medium"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="contact-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className={inputClasses}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs tracking-[0.15em] uppercase text-gray-500 mb-2 font-medium"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={inputClasses}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs tracking-[0.15em] uppercase text-gray-500 mb-2 font-medium"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your fitness goals..."
                  rows={4}
                  className={`${inputClasses} resize-none`}
                  required
                />
              </div>

              <div className="pt-2">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-sm px-8 py-4 text-center"
                  >
                    <span className="text-green-400 text-sm font-semibold tracking-wider uppercase">
                      Message Sent Successfully
                    </span>
                    <p className="text-gray-500 text-xs mt-1">
                      We&apos;ll get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <Button variant="primary" size="lg" className="w-full justify-center">
                    Send Message
                  </Button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
