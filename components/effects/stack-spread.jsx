"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Project mockups
const IMG = {
  voiceMain: "/projects/ai-voice.jpg",
  voiceViz: "/projects/voice-visualizer.jpg",
  dogMain: "/projects/paw-pulse.jpg",
  dogTelemetry: "/projects/dog-telemetry.jpg",
  kidsMain: "/projects/lumina-kids.jpg",
  kidsQuest: "/projects/kids-quest.jpg",
  pulsepay: "/projects/pulsepay.jpg",
  aura: "/projects/aura-haptics.jpg",
};

// Detailed Project Info for Modal & Inspector
export const MOBILE_PROJECTS_INFO = {
  "ai-voice": {
    title: "Conversational AI Voice Companion",
    category: "AI & Voice Computing • Mobile App",
    badge: "AI & Voice Mobile",
    metric: "< 150ms Latency",
    description:
      "A real-time ambient conversational AI mobile application where users interact naturally via fluid voice streaming. Built with ultra-low latency audio processing, emotional voice synthesis, dynamic Skia audio reactivity, and adaptive memory architecture.",
    highlights: [
      "Sub-150ms bidirectional streaming voice pipeline via WebSockets",
      "Dynamic audio-reactive visualizer powered by React Native Skia GPU shaders",
      "Offline cache & localized conversation state with SQLite",
      "120 FPS gesture-driven interface & smooth micro-haptics",
    ],
    specs: {
      latency: "< 150ms",
      rendering: "React Native Skia",
      state: "Zustand + SQLite",
      fps: "120 FPS Locked",
    },
    tags: [
      "React Native",
      "Expo",
      "WebSockets",
      "OpenAI Realtime",
      "RN Skia",
      "Reanimated 3",
      "Zustand",
    ],
    image: IMG.voiceMain,
  },
  "canine-health": {
    title: "Canine Health & Vitality Ecosystem",
    category: "Pet Health & IoT Telemetry • Mobile App",
    badge: "HealthTech & IoT",
    metric: "BLE Real-Time Sync",
    description:
      "A comprehensive canine healthcare companion app connecting pet parents with smart collar telemetry and veterinary intelligence. Features AI symptom checks, automated dietary tracking, vaccine schedule timelines, and real-time activity metrics.",
    highlights: [
      "Bluetooth Low Energy (BLE) sync with wearable pet monitors",
      "Interactive health analytics & activity charts with smooth gestures",
      "Smart vaccine reminder engine with local background push notifications",
      "Offline-first architecture with instantaneous local data persistence",
    ],
    specs: {
      connectivity: "BLE Smart Sync",
      database: "WatermelonDB (Offline)",
      telemetry: "Real-Time Telemetry",
      notifications: "Local OS Triggers",
    },
    tags: [
      "React Native",
      "Expo",
      "Bluetooth LE",
      "WatermelonDB",
      "Reanimated 3",
      "TypeScript",
      "Tailwind",
    ],
    image: IMG.dogMain,
  },
  "kids-learning": {
    title: "Interactive Kids Learning & Gamified Quests",
    category: "EdTech & Gamified Mobile App",
    badge: "EdTech & Gamification",
    metric: "120 FPS Fluid Gestures",
    description:
      "A gamified educational universe designed for early childhood learning. Combines phonics discovery, math galaxy quests, interactive voice prompts, and rich soundscapes that turn foundational learning into an engaging tactile journey.",
    highlights: [
      "Rich interactive island quest maps with fluid touch gestures",
      "Engaging animations and tactile micro-interactions with Lottie & Reanimated",
      "Parental dashboard with detailed developmental milestone reports",
      "Kid-safe privacy standards, COPPA compliant, 100% offline gameplay",
    ],
    specs: {
      animations: "Lottie + Reanimated 3",
      audio: "Native Sound Engine",
      offline: "100% Offline Capable",
      safety: "COPPA Compliant",
    },
    tags: [
      "React Native",
      "Expo",
      "Lottie",
      "Reanimated 3",
      "React Native Sound",
      "TypeScript",
      "Zustand",
    ],
    image: IMG.kidsMain,
  },
  "voice-viz": {
    title: "Echo Assist • Skia Frequency Shaders",
    category: "GPU Shader Subsystem",
    badge: "Skia Shaders",
    metric: "120 FPS Audio Reactivity",
    description:
      "Custom Skia circular FFT waveform shader reacting dynamically to human speech frequencies with zero frame drops.",
    highlights: [
      "Real-time PCM buffer calculation directly in JSI worklets",
      "Multi-layered neon glow with GPU alpha blending",
    ],
    specs: {
      pipeline: "JSI Audio Worklet",
      rendering: "Skia Canvas GPU",
      refresh: "120 Hz Target",
    },
    tags: ["React Native Skia", "JSI", "C++ TurboModule"],
    image: IMG.voiceViz,
  },
  "dog-radar": {
    title: "PawConnect • IoT Collar Telemetry Radar",
    category: "Hardware Integration Subsystem",
    badge: "Collar Telemetry",
    metric: "Zero Packet Loss",
    description:
      "Live biometric heart rate and temperature monitoring via background BLE polling and local offline data store.",
    highlights: [
      "Automated BLE reconnection protocol for iOS & Android",
      "Local ring buffer data cache preventing telemetry gaps",
    ],
    specs: {
      protocol: "BLE GATT",
      cache: "WatermelonDB",
      frequency: "100ms Ping",
    },
    tags: ["BLE GATT", "WatermelonDB", "Background Sync"],
    image: IMG.dogTelemetry,
  },
  "kids-quest": {
    title: "Cosmic Academy • Galaxy Quest Engine",
    category: "Gamification Architecture",
    badge: "Galaxy Quests",
    metric: "Tactile Navigation",
    description:
      "Interactive 2.5D constellation world map with gesture-driven zoom, floating island physics, and milestone rewards.",
    highlights: [
      "Reanimated 3 gesture handler with spring momentum",
      "Modular level unlock state engine with zero latency",
    ],
    specs: {
      physics: "Reanimated Spring",
      compliance: "COPPA Kid-Safe",
    },
    tags: ["Reanimated 3", "Lottie", "Tactile UI"],
    image: IMG.kidsQuest,
  },
  "fintech-pulse": {
    title: "PulsePay • High-Frequency Mobile Wallet",
    category: "FinTech & Haptics Subsystem",
    badge: "FinTech Gesture",
    metric: "Instant Micro-Haptics",
    description:
      "High-security financial transfer interface with tactile biometric feedback, fluid card gestures, and instant settlement UI.",
    highlights: [
      "Custom CoreHaptics iOS & Android Vibration pattern triggers",
      "Strict biometric authentication with face recognition fallback",
    ],
    specs: {
      security: "Biometric KeyStore",
      haptics: "CoreHaptics + Android HAL",
    },
    tags: ["React Native", "Haptics", "Zustand"],
    image: IMG.pulsepay,
  },
  "aura-haptics": {
    title: "Aura • Biometric Gesture Performance",
    category: "Performance Architecture",
    badge: "Performance Benchmark",
    metric: "120 FPS Locked",
    description:
      "Telemetry test suite tracking Hermes bytecode optimization, memory heap stability, and GPU draw times across mobile devices.",
    highlights: [
      "Automated frame-drop detection reporting directly in dev builds",
      "Optimized native layout hierarchy minimizing overdraw",
    ],
    specs: {
      engine: "Hermes Bytecode",
      metrics: "Sub-16ms Draw",
    },
    tags: ["Hermes", "JSI", "Performance Profiling"],
    image: IMG.aura,
  },
};

// per-image rest scale
const SCALE = {
  1: 0.9,
  2: 0.8,
  3: 0.9,
  4: 0.8,
  5: 0.8,
  6: 0.9,
  7: 0.9,
  8: 0.7,
};
const s = (i) => SCALE[i] ?? 1;

// 8 scattering cards mapped to mobile projects & architectures
const CARDS = [
  // 1. top-left (img08) — Skia Visualizer
  {
    item: {
      src: IMG.voiceViz,
      alt: "Audio Visualizer Shaders",
      title: "Skia Audio Visualizer",
      badge: "Skia • 120 FPS",
      projectKey: "voice-viz",
    },
    stackOffset: { x: -8, y: -10 },
    stackRotate: -18,
    target: { x: -20, y: -34, rotate: 0, scale: s(8), w: 17, h: 22 },
    targetSm: { x: -22, y: -40 },
    z: 2,
  },
  // 2. top-right (img07) — PawConnect Telemetry
  {
    item: {
      src: IMG.dogTelemetry,
      alt: "PawConnect IoT Collar",
      title: "Collar Telemetry Radar",
      badge: "BLE Smart Sync",
      projectKey: "dog-radar",
    },
    stackOffset: { x: 14, y: -10 },
    stackRotate: 20,
    target: { x: 32, y: -30, rotate: 0, scale: s(7), w: 18, h: 32 },
    targetSm: { x: 22, y: -40 },
    z: 3,
  },
  // 3. mid-left (img06) — Flagship AI Voice Companion
  {
    item: {
      src: IMG.voiceMain,
      alt: "Conversational AI Voice Companion",
      title: "Conversational AI Voice",
      badge: "<150ms Streaming",
      projectKey: "ai-voice",
    },
    stackOffset: { x: -16, y: 0 },
    stackRotate: -4,
    target: { x: -36, y: -2, rotate: 0, scale: s(6), w: 16, h: 32 },
    targetSm: { x: -22, y: -19 },
    z: 4,
  },
  // 4. top-centre (img05) — Cosmic Galaxy Quest
  {
    item: {
      src: IMG.kidsQuest,
      alt: "Cosmic Galaxy Quests",
      title: "Galaxy Quest Engine",
      badge: "Gamified Quests",
      projectKey: "kids-quest",
    },
    stackOffset: { x: 1, y: -10 },
    stackRotate: -2,
    target: { x: 6, y: -32, rotate: 0, scale: s(5), w: 25, h: 30 },
    targetSm: { x: 22, y: -19 },
    z: 5,
  },
  // 5. mid-right (img04) — Flagship Canine Health Ecosystem
  {
    item: {
      src: IMG.dogMain,
      alt: "Canine Health & Vitality Ecosystem",
      title: "Canine Health & IoT",
      badge: "WatermelonDB Offline",
      projectKey: "canine-health",
    },
    stackOffset: { x: 18, y: 1 },
    stackRotate: 6,
    target: { x: 37, y: 6, rotate: 0, scale: s(4), w: 18, h: 32 },
    targetSm: { x: -22, y: 20 },
    z: 6,
  },
  // 6. bottom-left (img03) — Flagship Kids Learning
  {
    item: {
      src: IMG.kidsMain,
      alt: "Interactive Kids Learning",
      title: "Kids Learning Quests",
      badge: "120 FPS Reanimated",
      projectKey: "kids-learning",
    },
    stackOffset: { x: -6, y: 10 },
    stackRotate: 6,
    target: { x: -24, y: 34, rotate: 0, scale: s(3), w: 22, h: 25 },
    targetSm: { x: 22, y: 20 },
    z: 7,
  },
  // 7. bottom-centre (img02) — Aura Haptics Engine
  {
    item: {
      src: IMG.aura,
      alt: "Biometric Gesture Performance",
      title: "Performance & Haptics",
      badge: "Hermes Bytecode",
      projectKey: "aura-haptics",
    },
    stackOffset: { x: 8, y: 7 },
    stackRotate: 3,
    target: { x: 2, y: 36, rotate: 0, scale: s(2), w: 20, h: 26 },
    targetSm: { x: -22, y: 40 },
    z: 8,
  },
  // 8. bottom-right (img01) — PulsePay FinTech
  {
    item: {
      src: IMG.pulsepay,
      alt: "PulsePay Mobile Wallet",
      title: "FinTech Gesture Engine",
      badge: "Zero Latency",
      projectKey: "fintech-pulse",
    },
    stackOffset: { x: 20, y: 12 },
    stackRotate: -7,
    target: { x: 30, y: 34, rotate: 0, scale: s(1), w: 16, h: 20 },
    targetSm: { x: 22, y: 40 },
    z: 9,
  },
];

const SCATTER_START = 0.12;
const SCATTER_END = 0.9;
const SUB =
  "High-performance iOS & Android applications built with React Native, real-time voice streaming, BLE telemetry, and fluid 120 FPS gesture physics.";

const RESPONSIVE = {
  desktop: {
    scale: null,
    small: false,
    colX: null,
    card: null,
  },
  small: {
    scale: 0.72,
    small: true,
    colX: 22,
    card: { w: 40, h: 20 },
  },
};

function useResponsive() {
  const [r, setR] = useState(RESPONSIVE.desktop);
  useEffect(() => {
    const read = () => {
      setR(window.innerWidth <= 1025 ? RESPONSIVE.small : RESPONSIVE.desktop);
    };
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  return r;
}

function Card({
  card,
  progress,
  reduce,
  clusterRotation,
  scaleMul,
  isSmall,
  colX,
  fixedCard,
  stackScale,
  cardRadius,
  onSelect,
}) {
  const { item, target } = card;
  const flat = reduce === true;
  const stackRotate = flat ? 0 : clusterRotation ? card.stackRotate ?? 0 : 0;
  const stackOffset = card.stackOffset ?? { x: 0, y: 0 };
  const restScale = scaleMul ?? target.scale ?? 1;

  const sm = isSmall && card.targetSm ? card.targetSm : null;
  const endX = sm
    ? colX != null
      ? Math.sign(sm.x) * colX
      : sm.x
    : target.x;
  const endY = sm ? sm.y : target.y;
  const endRotate = flat || isSmall ? 0 : target.rotate;

  const translate = useTransform(progress, (p) => {
    const tx = stackOffset.x + (endX - stackOffset.x) * p;
    const ty = stackOffset.y + (endY - stackOffset.y) * p;
    return `calc(-50% + ${tx}vw) calc(-50% + ${ty}vh)`;
  });
  const rotate = useTransform(progress, [0, 1], [stackRotate, endRotate]);
  const scale = useTransform(progress, [0, 1], [stackScale, restScale]);

  return (
    <motion.div
      onClick={() => onSelect?.(item.projectKey)}
      className="absolute left-1/2 top-1/2 will-change-transform cursor-pointer group"
      style={{
        width: `${fixedCard ? fixedCard.w : target.w}vw`,
        height: `${fixedCard ? fixedCard.h : target.h}vh`,
        zIndex: card.z ?? 1,
        translate,
        rotate,
        scale,
      }}
    >
      <CardFace item={item} cardRadius={cardRadius} />
    </motion.div>
  );
}

function CardFace({ item, cardRadius }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden border border-white/15 bg-black/60 shadow-2xl transition-all duration-300 group-hover:border-accent group-hover:shadow-[0_0_30px_rgba(200,243,29,0.25)] group-hover:scale-[1.02]"
      style={{ borderRadius: `${cardRadius}px` }}
    >
      <Image
        src={item.src}
        alt={item.alt ?? ""}
        fill
        sizes="(max-width: 1025px) 40vw, 25vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        draggable={false}
      />
      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

      {/* Floating Micro Badge */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wide bg-black/80 backdrop-blur-md border border-white/15 text-white/90 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          {item.badge}
        </span>
      </div>

      {/* Title label at bottom */}
      <div className="absolute bottom-2.5 left-3 right-3 pointer-events-none">
        <p className="text-xs sm:text-sm font-bold text-white tracking-tight truncate drop-shadow-md">
          {item.title}
        </p>
        <span className="text-[10px] font-mono text-accent/90 opacity-0 group-hover:opacity-100 transition-opacity">
          Tap to view architecture →
        </span>
      </div>
    </div>
  );
}

// Modal Detail Inspector for Selected Project
function ProjectDetailModal({ projectKey, onClose }) {
  const project = MOBILE_PROJECTS_INFO[projectKey];
  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-accent/40 bg-surface/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-accent hover:text-black flex items-center justify-center text-muted hover:text-black transition-colors cursor-pointer text-sm"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-6">
          <span className="inline-block text-xs font-mono uppercase tracking-wider text-accent font-semibold mb-2">
            {project.category}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {project.title}
          </h3>
        </div>

        {/* Media Preview */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/15 mb-6 bg-black">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-black/80 border border-accent/40 text-accent">
              {project.metric}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-muted leading-relaxed mb-6">
          {project.description}
        </p>

        {/* Highlights */}
        {project.highlights && (
          <div className="mb-6 space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-foreground/70">
              Architectural Highlights
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-foreground/90">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Specs Grid */}
        {project.specs && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 rounded-xl bg-black/40 border border-border/80 font-mono text-xs mb-6">
            {Object.entries(project.specs).map(([key, val]) => (
              <div key={key} className="flex flex-col">
                <span className="text-[10px] text-muted uppercase">{key}</span>
                <span className="text-foreground font-semibold truncate">{val}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/50">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-xs rounded-lg border border-border bg-surface/50 text-muted font-mono"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function StackSpreadStage({
  cards = CARDS,
  scrollLength = 320,
  bgColor = "transparent",
  clusterRotation = true,
  stackScale = 0.82,
  cardRadius = 14,
  textColor = "var(--foreground)",
  textFadeStart = 0.25,
}) {
  const wrapRef = useRef(null);
  const reduce = useReducedMotion();
  const { scale: scaleMul, small: isSmall, colX, card: fixedCard } = useResponsive();
  const [selectedProject, setSelectedProject] = useState(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  const progress = useTransform(
    scrollYProgress,
    [0, SCATTER_START, SCATTER_END, 1],
    [0, 0, 1, 1]
  );
  const noScale = reduce === true;
  const copyOpacity = useTransform(progress, [textFadeStart, textFadeStart + 0.35], [0, 1]);
  const copyScale = useTransform(progress, [textFadeStart, 0.9], [0.88, 1]);

  return (
    <section
      ref={wrapRef}
      className="relative w-full"
      style={{ height: `${scrollLength}vh`, backgroundColor: bgColor }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Subtle ambient lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-accent/5 rounded-full blur-[140px] pointer-events-none -z-10" />

        {/* Section Index Marker */}
        <div className="pointer-events-none absolute top-8 left-8 z-20 flex items-center gap-2 text-[0.65rem] font-mono tracking-widest text-muted uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span>02 — Selected Mobile Work</span>
        </div>

        {/* Centre text */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-5 flex flex-col items-center justify-center px-6 text-center max-md:px-8"
          style={{
            opacity: copyOpacity,
            scale: noScale ? 1 : copyScale,
          }}
        >
          <span className="mb-3 text-xs font-mono uppercase tracking-[0.25em] text-accent">
            Interactive Showcase
          </span>
          <h2
            className="w-full whitespace-pre-line text-[4.2vw] font-bold leading-none tracking-tight max-md:text-[9.5vw]"
            style={{
              color: textColor,
              fontFamily:
                "var(--font-space-grotesk), var(--font-geist-sans), system-ui, sans-serif",
            }}
          >
            Mobile Work
            <span className="text-accent"> That </span>
            Responds.
          </h2>
          <p
            className="mt-[1.4vw] w-full max-w-[46ch] text-[1.1vw] leading-relaxed tracking-tight max-md:mt-3 max-md:text-[3.6vw] text-muted"
          >
            {SUB}
          </p>
          <div className="mt-5 flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-surface/50 text-[11px] font-mono text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>Click any card to inspect architecture & specs</span>
          </div>
        </motion.div>

        {/* Scattering cards */}
        <div className="absolute inset-0 z-10">
          {cards.map((card, i) => (
            <Card
              key={i}
              card={card}
              progress={progress}
              reduce={reduce}
              clusterRotation={clusterRotation}
              scaleMul={scaleMul}
              isSmall={isSmall}
              colX={colX}
              fixedCard={fixedCard}
              stackScale={stackScale}
              cardRadius={cardRadius}
              onSelect={(key) => setSelectedProject(key)}
            />
          ))}
        </div>
      </div>

      {/* Selected Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            projectKey={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export default function StackSpread({
  scrollLength = 320,
  bgColor = "transparent",
  clusterRotation = true,
  stackScale = 0.82,
  cardRadius = 14,
  textColor = "var(--foreground)",
  textFadeStart = 0.25,
}) {
  return (
    <StackSpreadStage
      cards={CARDS}
      scrollLength={scrollLength}
      bgColor={bgColor}
      clusterRotation={clusterRotation}
      stackScale={stackScale}
      cardRadius={cardRadius}
      textColor={textColor}
      textFadeStart={textFadeStart}
    />
  );
}
