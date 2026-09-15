"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import ScrollBurnText from "./ScrollBurnText";
import MagicBento from "./MagicBento";

/* ─── Manifesto / Vision sections for ScrollBurnText ─── */
const MANIFESTO_SECTIONS = [
  "I build software that lives in the palm of your hand. For me, mobile engineering isn't just about rendering pixels — it's about eliminating every millisecond of input latency until the glass disappears.",
  "Clean architecture over hacky fixes. From gesture physics in Reanimated to custom GPU shaders in Skia, great mobile applications feel weighted, tactile, and natural beneath your thumbs.",
  "When I step away from the keyboard, you'll find me on empty highways, out on a road trip, or enjoying a fresh cup of coffee. The best code comes from a clear mind and a genuine love for the craft.",
];

/* ─── Unified Section Heading matching Hero Typography ─── */
function SectionHeading({ subtitle, children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="mb-10">
      <motion.div
        className="inline-flex items-center gap-2 mb-3"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-accent">
          {subtitle}
        </span>
      </motion.div>

      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
        style={{
          color: "#E1E0CC",
          fontFamily:
            "var(--font-space-grotesk), var(--font-geist-sans), system-ui, sans-serif",
        }}
        initial={{ opacity: 0, y: 25 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.h2>

      <motion.div
        className="h-[2px] w-16 bg-accent mt-5"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "left" }}
      />
    </div>
  );
}

export default function AboutSection() {
  const contentRef = useRef(null);
  const isInView = useInView(contentRef, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative w-full">
      {/* ─── Part 1: Optical Scroll Burn Text Runway ─── */}
      <ScrollBurnText
        sections={MANIFESTO_SECTIONS}
        hint="scroll to explore"
        runway="135vh"
      />

      {/* ─── Part 2: Detailed Profile & Ecosystem Deep Dive (MagicBento Grid Frame) ─── */}
      <div className="w-full p-2 sm:p-3 md:p-4">
        <div className="relative w-full overflow-hidden rounded-2xl md:rounded-[2rem] border border-white/10 shadow-2xl bg-black/85 p-6 sm:p-10 lg:p-12">
          {/* Subtle ambient lighting */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

          <SectionHeading subtitle="Deep Dive">
            Behind the <span className="text-accent">engineering</span>
          </SectionHeading>

          <div ref={contentRef} className="mb-10 max-w-3xl">
            <motion.p
              className="text-xl sm:text-2xl font-medium leading-snug tracking-tight mb-2"
              style={{ color: "#E1E0CC" }}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              Architecting mobile systems with{" "}
              <span className="text-accent font-semibold">React Native</span>
              , deterministic state synchronization, and zero-compromise
              frame-pacing.
            </motion.p>
            <motion.p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(225, 224, 204, 0.7)" }}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              Live telemetry from my development environment, core engineering
              benchmarks, and production mobile stack:
            </motion.p>
          </div>

          {/* ─── Interactive MagicBento Grid with all section content ─── */}
          <MagicBento />
        </div>
      </div>
    </section>
  );
}
