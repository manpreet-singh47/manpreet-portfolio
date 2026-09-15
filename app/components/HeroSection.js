"use client";

import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

/* ---------------- WordsPullUp ---------------- */
export const WordsPullUp = ({
  text,
  className = "",
  showAsterisk = false,
  style,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div
      ref={ref}
      className={`inline-flex flex-wrap ${className}`}
      style={style}
    >
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.8,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] select-none text-accent">
                *
              </span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------- Prisma-style Hero (21st.dev Video) ---------------- */
export default function HeroSection() {
  return (
    <section className="h-screen w-full p-2 sm:p-3 md:p-4" id="hero">
      <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem] border border-white/10 shadow-2xl bg-black">
        {/* Background video (21st.dev video loop) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src="/hero-video.mp4"
        />

        {/* Film grain noise overlay */}
        <div className="grain-overlay pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay" />

        {/* Gradient overlay for contrast */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />

        {/* Hero content positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 sm:px-8 md:px-12 md:pb-8 z-10">
          <div className="grid grid-cols-12 items-end gap-6">
            {/* Massive Display Title */}
            <div className="col-span-12 lg:col-span-8">
              <h1
                className="font-bold leading-[0.82] tracking-[-0.07em] text-[22vw] sm:text-[20vw] md:text-[18vw] lg:text-[16vw] xl:text-[15vw]"
                style={{
                  color: "#E1E0CC",
                  fontFamily:
                    "var(--font-space-grotesk), var(--font-geist-sans), system-ui, sans-serif",
                }}
              >
                <WordsPullUp text="Manpreet" showAsterisk />
              </h1>
            </div>

            {/* Description & Call-To-Action */}
            <div className="col-span-12 flex flex-col gap-5 pb-6 sm:pb-8 lg:col-span-4 lg:pb-12 xl:pb-16">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-xs sm:text-sm md:text-base leading-relaxed"
                style={{
                  color: "rgba(225, 224, 204, 0.8)",
                  lineHeight: 1.35,
                }}
              >
                Mobile Application Developer crafting high-performance iOS &
                Android experiences with React Native, fluid native
                architectures, and tactile micro-interactions.
              </motion.p>

              <motion.a
                href="#projects"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group inline-flex items-center gap-2.5 self-start rounded-full py-1.5 pl-5 pr-1.5 text-sm font-semibold text-black transition-all hover:gap-3.5 sm:text-base cursor-pointer shadow-2xl"
                style={{ backgroundColor: "#E1E0CC" }}
              >
                Explore mobile work
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                  <ArrowRight className="h-4 w-4" style={{ color: "#E1E0CC" }} />
                </span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
