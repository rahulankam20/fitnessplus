"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import AnimatedText from "@/components/ui/AnimatedText";
import { TESTIMONIALS } from "@/lib/constants";

// ============================================
// Star Rating - Renders filled and empty stars
// ============================================

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-sm ${star <= rating ? "text-red-500" : "text-white/10"}`}
        >
          *
        </span>
      ))}
    </div>
  );
}

// ============================================
// TestimonialCard - Individual review card
// ============================================

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof TESTIMONIALS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.15,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="min-w-[320px] md:min-w-[400px] flex-shrink-0"
    >
      <div className="glass-card rounded-xl p-6 md:p-8 h-full relative overflow-hidden group">
        <div className="absolute top-4 right-6 text-6xl font-serif text-white/[0.03] select-none leading-none">
          &ldquo;
        </div>

        <div className="mb-4">
          <StarRating rating={testimonial.rating} />
        </div>

        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 relative z-10">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        <div className="flex items-center gap-3 mt-auto">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/20 to-red-900/10 flex items-center justify-center text-sm font-semibold border border-red-500/10">
            {testimonial.avatar}
          </div>
          <div>
            <div className="text-white text-sm font-semibold tracking-wide">{testimonial.name}</div>
            <div className="text-red-400/60 text-xs tracking-wider uppercase">
              {testimonial.membership}
            </div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.5 + index * 0.15, duration: 0.8 }}
        />
      </div>
    </motion.div>
  );
}

// ============================================
// Testimonials Section - Horizontal scroll
// ============================================

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -420 : 420;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <SectionWrapper id="testimonials" className="gradient-dark overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-8 h-[2px] bg-red-500" />
          <span className="text-xs tracking-[0.3em] uppercase text-red-400 font-medium">
            Testimonials
          </span>
        </motion.div>

        <div className="flex items-end justify-between mb-12 gap-6">
          <div>
            <AnimatedText
              text="WHAT OUR MEMBERS SAY"
              as="h2"
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
              delay={0.1}
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-gray-500 text-base md:text-lg max-w-xl mt-4"
            >
              Real stories from real people. Here&apos;s what our community has to say.
            </motion.p>
          </div>

          <div className="hidden md:flex gap-3">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-300 ${
                canScrollLeft
                  ? "border-white/20 text-white hover:border-red-500 hover:text-red-400"
                  : "border-white/5 text-white/20 cursor-not-allowed"
              }`}
              aria-label="Scroll testimonials left"
            >
              <span aria-hidden="true">{"<"}</span>
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-300 ${
                canScrollRight
                  ? "border-white/20 text-white hover:border-red-500 hover:text-red-400"
                  : "border-white/5 text-white/20 cursor-not-allowed"
              }`}
              aria-label="Scroll testimonials right"
            >
              <span aria-hidden="true">{">"}</span>
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
