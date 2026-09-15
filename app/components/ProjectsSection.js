"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import StackingCards, { StackingCardItem } from "./StackingCards";

/* ─── Project data ─── */
const PROJECTS = [
  {
    title: "Conversational AI Voice Companion",
    category: "AI & Voice Computing",
    description:
      "Real-time ambient conversational AI where users interact via fluid voice streaming. Ultra-low latency audio, emotional voice synthesis, dynamic Skia audio reactivity, and adaptive memory.",
    highlights: [
      "Sub-150ms bidirectional streaming via WebSockets",
      "Audio-reactive visualizer with RN Skia GPU shaders",
      "Offline conversation state with SQLite",
      "120 FPS gesture-driven micro-haptics",
    ],
    tags: ["React Native", "Expo", "WebSockets", "OpenAI Realtime", "RN Skia", "Reanimated 3", "Zustand"],
    image: "/projects/ai-voice.jpg",
    accent: "#00F5D4",
    bg: "#050d0b",
    badge: "AI & Voice",
  },
  {
    title: "Canine Health & Vitality Ecosystem",
    category: "Pet Health & IoT Telemetry",
    description:
      "Comprehensive canine healthcare companion connecting pet parents with smart collar telemetry and vet intelligence. BLE sync, AI symptom checks, dietary tracking, vaccine timelines.",
    highlights: [
      "BLE sync with wearable pet monitors",
      "Interactive health analytics with smooth gestures",
      "Smart vaccine reminder engine with local push",
      "Offline-first with WatermelonDB persistence",
    ],
    tags: ["React Native", "Expo", "Bluetooth LE", "WatermelonDB", "Reanimated 3", "TypeScript", "Tailwind"],
    image: "/projects/paw-pulse.jpg",
    accent: "#F59E0B",
    bg: "#0d0900",
    badge: "HealthTech & IoT",
  },
  {
    title: "Interactive Kids Learning & Gamified Quests",
    category: "EdTech & Gamification",
    description:
      "Gamified educational universe for early childhood. Phonics discovery, math galaxy quests, interactive voice prompts, and rich soundscapes that turn learning into a tactile journey.",
    highlights: [
      "Island quest maps with fluid touch gestures",
      "Lottie & Reanimated micro-interactions",
      "Parental dashboard with milestone reports",
      "COPPA compliant, 100% offline gameplay",
    ],
    tags: ["React Native", "Expo", "Lottie", "Reanimated 3", "RN Sound", "TypeScript", "Zustand"],
    image: "/projects/lumina-kids.jpg",
    accent: "#A855F7",
    bg: "#08020d",
    badge: "EdTech",
  },
];

/* ─── Section heading ─── */
function SectionHeading() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className="mb-10 px-6 sm:px-10 lg:px-14 pt-10">
      <motion.div
        className="inline-flex items-center gap-2 mb-3"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-accent">
          Selected Mobile Work
        </span>
      </motion.div>
      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
        style={{ color: "#E1E0CC", fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        Engineered for <span className="text-accent">speed &amp; scale</span>
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

/* ─── Individual project card ─── */
function ProjectCard({ project }) {
  return (
    <div
      className="w-[92%] mx-auto h-full rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
      style={{ background: project.bg }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
        {/* Image */}
        <div className="relative min-h-[200px] overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60 lg:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:hidden" />

          <span
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-mono font-semibold tracking-wide backdrop-blur-md border"
            style={{
              color: project.accent,
              borderColor: project.accent + "40",
              background: project.accent + "12",
            }}
          >
            {project.badge}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between p-7 sm:p-10">
          <div>
            <span
              className="text-[10px] font-mono uppercase tracking-widest mb-3 block"
              style={{ color: project.accent }}
            >
              {project.category}
            </span>
            <h3
              className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 leading-tight"
              style={{ color: "#E1E0CC", fontFamily: "var(--font-space-grotesk), system-ui" }}
            >
              {project.title}
            </h3>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(225,224,204,0.65)" }}>
              {project.description}
            </p>
            <ul className="space-y-1.5 mb-5">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "rgba(225,224,204,0.7)" }}>
                  <span className="shrink-0 w-1 h-1 rounded-full inline-block mt-1.5" style={{ background: project.accent }} />
                  {h}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-[10px] rounded-lg font-mono border"
                  style={{
                    color: "rgba(225,224,204,0.5)",
                    borderColor: "rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div
            className="flex items-center justify-between pt-4 mt-4 border-t"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <span className="text-[10px] font-mono" style={{ color: "rgba(225,224,204,0.35)" }}>
              iOS &amp; Android · React Native
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: project.accent }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: project.accent }} />
              Production
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Section ─── */
export default function ProjectsSection() {
  return (
    <section id="projects" className="w-full p-2 sm:p-3 md:p-4">
      {/*
        overflow: clip — visually clips to the rounded border like overflow:hidden,
        but does NOT create a scroll container, so sticky cards inside work correctly
        with the main page scroll.
      */}
      <div
        className="relative w-full rounded-2xl md:rounded-[2rem] border border-white/10 shadow-2xl bg-black/85"
        style={{ overflow: "clip" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

        <SectionHeading />

        {/*
          StackingCards tracks its own scroll position on the PAGE (no nested container).
          Each card has sticky top-0, so as you scroll the page they stack on top of each other.
          The total height of StackingCards = N × cardHeight, giving N screens of scroll.
        */}
        <StackingCards
          totalCards={PROJECTS.length}
          scaleMultiplier={0.05}
        >
          {PROJECTS.map((project, index) => (
            <StackingCardItem
              key={project.title}
              index={index}
              className="h-[540px]"
              topPosition={`${4 + index * 2}%`}
            >
              <ProjectCard project={project} />
            </StackingCardItem>
          ))}
        </StackingCards>

        <div className="h-12" />
      </div>
    </section>
  );
}
