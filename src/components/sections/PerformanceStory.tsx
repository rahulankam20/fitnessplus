"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Button from "@/components/ui/Button";

// Dynamic import — Three.js requires browser APIs
const PerformanceStoryScene = dynamic(
  () => import("@/components/three/PerformanceStoryScene"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[#030303] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 font-mono">
            Initializing scene
          </p>
        </div>
      </div>
    ),
  }
);

// ============================================
// Story Acts — text + metadata for each phase
// ============================================

const STORY_ACTS = [
  {
    id: "discipline",
    scrollStart: 0.0,
    scrollEnd: 0.22,
    line1: "DISCIPLINE",
    line2: "STARTS HERE",
    sub: "Every legend began with a single rep.",
    position: "bottom-left" as const,
    accent: false,
  },
  {
    id: "build",
    scrollStart: 0.2,
    scrollEnd: 0.42,
    line1: "BUILD",
    line2: "STRENGTH",
    sub: "Load the bar. Own the platform.",
    position: "top-right" as const,
    accent: true,
  },
  {
    id: "purpose",
    scrollStart: 0.4,
    scrollEnd: 0.62,
    line1: "TRAIN WITH",
    line2: "PURPOSE",
    sub: "Every session is a step toward the best version.",
    position: "bottom-left" as const,
    accent: false,
  },
  {
    id: "recover",
    scrollStart: 0.6,
    scrollEnd: 0.82,
    line1: "RECOVER.",
    line2: "REBUILD. REPEAT.",
    sub: "The cycle never stops. Neither do you.",
    position: "top-right" as const,
    accent: true,
  },
  {
    id: "cta",
    scrollStart: 0.8,
    scrollEnd: 1.0,
    line1: "YOUR FIRST",
    line2: "SESSION AWAITS",
    sub: null,
    position: "center" as const,
    accent: false,
    isCTA: true,
  },
] as const;

// ============================================
// Main Section Export
// ============================================

export default function PerformanceStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number>(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Refs for direct DOM manipulation to bypass React's render loop on scroll
  const hudRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const actRefs = useRef<Array<HTMLDivElement | null>>([]);
  // Cached references for animated inner text elements per act
  const textRefs = useRef<Array<Array<HTMLElement | null>>>([]);

  useEffect(() => {
    // Check for reduced motion preference
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = setTimeout(() => {
      setReducedMotion(mq.matches);
    }, 0);

    let ticking = false;
    let rafId: number | null = null;

    const updateScroll = () => {
      ticking = false;
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight - window.innerHeight;

      // Normalize: 0 when section top hits viewport top, 1 when section bottom hits viewport bottom
      const rawProgress = -rect.top / sectionHeight;
      const clamped = Math.max(0, Math.min(1, rawProgress));

      // 1. Update scroll ref directly (R3F Canvas reads from this ref inside its useFrame loop)
      scrollRef.current = clamped;

      // 2. Update HUD opacity
      if (hudRef.current) {
        const hudVis = Math.min(1, clamped * 5);
        hudRef.current.style.opacity = hudVis.toString();
      }

      // 3. Update HUD progress text
      if (progressTextRef.current) {
        progressTextRef.current.innerText = `${Math.round(clamped * 100)}% — Transformation Story`;
      }

      // 4. Update HUD progress indicator dots
      STORY_ACTS.forEach((act, idx) => {
        const dot = dotRefs.current[idx];
        if (!dot) return;

        const isActive = clamped >= act.scrollStart && clamped < act.scrollEnd;
        const isPast = clamped >= act.scrollEnd;

        dot.style.width = isActive ? "24px" : "6px";
        dot.style.background = isActive
          ? "#dc2626"
          : isPast
          ? "rgba(220,38,38,0.35)"
          : "rgba(255,255,255,0.1)";
      });

      // 5. Update Act Overlays (opacity + scale + pointerEvents + display)
      STORY_ACTS.forEach((act, idx) => {
        const el = actRefs.current[idx];
        if (!el) return;

        const { scrollStart, scrollEnd } = act;
        const span = scrollEnd - scrollStart;
        const fadeInEnd = scrollStart + span * 0.18;
        const fadeOutStart = scrollEnd - span * 0.18;

        let opacity = 0;
        if (clamped >= scrollStart && clamped <= scrollEnd) {
          if (clamped < fadeInEnd) {
            opacity = (clamped - scrollStart) / (fadeInEnd - scrollStart);
          } else if (clamped < fadeOutStart) {
            opacity = 1;
          } else {
            opacity = 1 - (clamped - fadeOutStart) / (scrollEnd - fadeOutStart);
          }
        }

        el.style.opacity = opacity.toString();
        const scale = 0.94 + opacity * 0.06;
        el.style.transform = `scale(${scale})`;
        el.style.pointerEvents = (opacity > 0.01 && "isCTA" in act && act.isCTA) ? "auto" : "none";
        el.style.display = opacity > 0.001 ? "flex" : "none";

        // Animate overlay text slide up effect using cached text element references
        const cachedTextElements = textRefs.current[idx];
        if (cachedTextElements) {
          cachedTextElements.forEach((txt) => {
            if (txt) {
              txt.style.transform = `translateY(${(1 - opacity) * 30}px)`;
            }
          });
        }
      });
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateScroll();

    return () => {
      clearTimeout(timer);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Reduced motion fallback — just a dark static section
  if (reducedMotion) {
    return (
      <section
        id="performance-story"
        className="relative py-40 gradient-dark flex flex-col items-center justify-center text-center"
      >
        <p className="cinematic-text text-6xl text-white mb-4">FROM RAW POTENTIAL</p>
        <p className="cinematic-text-red text-6xl mb-8">TO PEAK PERFORMANCE</p>
        <Button variant="primary" size="lg" href="#contact" pulse>
          Book Your Free Trial
        </Button>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="performance-story"
      className="performance-story-section"
      aria-label="Cinematic fitness transformation story"
    >
      {/* Sticky viewport */}
      <div className="performance-story-sticky grain-overlay">
        {/* 3D Canvas */}
        <div className="performance-story-canvas">
          <PerformanceStoryScene scrollProgress={scrollRef} />
        </div>

        {/* HUD decorations */}
        <div
          ref={hudRef}
          className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
          style={{ opacity: 0 }}
        >
          {/* Top-left corner bracket */}
          <div className="absolute top-5 left-5 w-8 h-8 border-t border-l border-red-600/40" />
          {/* Top-right */}
          <div className="absolute top-5 right-5 w-8 h-8 border-t border-r border-red-600/40" />
          {/* Bottom-left */}
          <div className="absolute bottom-5 left-5 w-8 h-8 border-b border-l border-red-600/40" />
          {/* Bottom-right */}
          <div className="absolute bottom-5 right-5 w-8 h-8 border-b border-r border-red-600/40" />

          {/* Act indicator line — bottom center */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {STORY_ACTS.map((act, idx) => (
              <div
                key={act.id}
                ref={(el) => {
                  dotRefs.current[idx] = el;
                }}
                className="transition-all duration-300"
                style={{
                  width: "6px",
                  height: "2px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "2px",
                }}
              />
            ))}
          </div>

          {/* Scroll progress text */}
          <div
            ref={progressTextRef}
            className="absolute top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-[0.4em] uppercase text-white/15"
          >
            0% — Transformation Story
          </div>
        </div>

        {/* Gradient overlays — keep text readable */}
        <div className="absolute inset-0 pointer-events-none z-[5]">
          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-[#050505]/70 to-transparent" />
          {/* Top gradient */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#050505]/50 to-transparent" />
          {/* Left vignette */}
          <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-gradient-to-r from-[#030303]/40 to-transparent" />
          {/* Right vignette */}
          <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-[#030303]/40 to-transparent" />
        </div>

        {/* Cinematic text overlays — one per act */}
        {STORY_ACTS.map((act, idx) => {
          const { line1, line2, sub, position, accent } = act;
          const isCTA = "isCTA" in act && act.isCTA;

          const posClass =
            position === "bottom-left"
              ? "bottom-10 left-8 md:bottom-16 md:left-14 items-start text-left"
              : position === "top-right"
              ? "top-10 right-8 md:top-16 md:right-14 items-end text-right"
              : "inset-0 items-center justify-center text-center";

          const containerClass = `absolute flex flex-col ${posClass}`;

          return (
            <div
              key={act.id}
              ref={(el) => {
                actRefs.current[idx] = el;
              }}
              className={containerClass}
              style={{
                opacity: 0,
                transform: "scale(0.94)",
                transition: "opacity 0.05s ease, transform 0.1s ease",
                pointerEvents: "none",
                zIndex: 20,
                display: "none",
              }}
            >
              {/* Main text */}
              <div className="overflow-hidden">
                <p
                  ref={(el) => {
                    if (!textRefs.current[idx]) textRefs.current[idx] = [];
                    textRefs.current[idx][0] = el;
                  }}
                  className="cinematic-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none cinematic-text-inner transition-transform duration-75"
                >
                  {line1}
                </p>
              </div>
              <div className="overflow-hidden">
                <p
                  ref={(el) => {
                    if (!textRefs.current[idx]) textRefs.current[idx] = [];
                    textRefs.current[idx][1] = el;
                  }}
                  className={`cinematic-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none cinematic-text-inner transition-transform duration-75 ${
                    accent ? "cinematic-text-red" : "text-white/90"
                  }`}
                >
                  {line2}
                </p>
              </div>

              {/* Sub-line */}
              {sub && (
                <p className="mt-3 text-xs md:text-sm tracking-[0.25em] uppercase text-white/30 font-mono font-light max-w-xs">
                  {sub}
                </p>
              )}

              {/* CTA button */}
              {isCTA && (
                <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
                  <Button variant="primary" size="lg" href="#contact" pulse>
                    Book Your Free Trial
                  </Button>
                  <Button variant="secondary" size="lg" href="#pricing">
                    View Memberships
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
