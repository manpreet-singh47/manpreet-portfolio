"use client";

import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { Smartphone, Code2, Sparkles, Terminal } from "lucide-react";

/* ─── Experience data ─── */
const EXPERIENCES = [
  {
    role: "Mobile Application Developer",
    badge: "Current Focus",
    period: "2024 — Present",
    status: "Active Engineering",
    icon: Smartphone,
    glowColor: "rgba(200, 243, 29, 0.18)",
    borderColor: "rgba(200, 243, 29, 0.35)",
    badgeStyle: "bg-accent/10 border-accent/40 text-accent",
    accentHex: "#C8F31D",
    description:
      "Engineering and shipping high-performance production mobile applications across Android and iOS. Specializing in gesture-driven UIs, real-time data sync, and native module bridges with React Native.",
    deliverables: [
      "Architected sub-100ms UI gesture response with Reanimated 3 worklets",
      "Integrated BLE telemetry, background tasks, and offline SQLite caching",
      "Collaborated on design system components with native haptics",
    ],
    skills: ["React Native", "Android", "iOS", "REST APIs", "Native Bridges", "Git"],
  },
  {
    role: "Frontend Developer",
    badge: "Foundations",
    period: "2022 — 2024",
    status: "Milestone",
    icon: Code2,
    glowColor: "rgba(56, 189, 248, 0.18)",
    borderColor: "rgba(56, 189, 248, 0.35)",
    badgeStyle: "bg-sky-400/10 border-sky-400/40 text-sky-400",
    accentHex: "#38bdf8",
    description:
      "Initiated deep-dive into software engineering by developing interactive web apps, modular component libraries, and algorithm visualizers with pure JavaScript and React.",
    deliverables: [
      "Mastered JavaScript ES6+, asynchronous event loops, and DOM optimization",
      "Constructed 15+ responsive web apps with pixel-perfect layouts",
      "Studied mobile-first responsive design paradigms and state management",
    ],
    skills: ["JavaScript", "React", "HTML5/CSS3", "Responsive UI", "REST APIs"],
  },
];

/* ─── Unified Section Heading matching Hero Typography ─── */
function SectionHeading({ subtitle, children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="mb-14 text-center">
      <motion.div
        className="inline-flex items-center gap-2 mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
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
        className="h-[2px] w-16 bg-accent mt-5 mx-auto"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "center" }}
      />
    </div>
  );
}

/* ─── 3D Interactive Card ─── */
function ExperienceCard3D({ exp, index }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Glare position
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  // Spring physics for buttery smooth 3D tilt
  const springConfig = { damping: 22, stiffness: 220, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);
  const cardScale = useSpring(isHovered ? 1.02 : 1, springConfig);

  const IconComponent = exp.icon;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // Normalized coordinates from -0.5 to 0.5
    mouseX.set(currentX / width - 0.5);
    mouseY.set(currentY / height - 0.5);

    // Percentage coordinates for glare overlay (0% to 100%)
    glareX.set((currentX / width) * 100);
    glareY.set((currentY / height) * 100);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full flex flex-col"
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="relative flex-1 flex flex-col justify-between rounded-3xl p-7 sm:p-9 border border-white/10 bg-[#09090b]/80 backdrop-blur-xl transition-colors duration-500 overflow-hidden"
        style={{
          rotateX,
          rotateY,
          scale: cardScale,
          transformStyle: "preserve-3d",
          boxShadow: isHovered
            ? `0 25px 60px -15px ${exp.glowColor}, 0 0 30px 1px ${exp.borderColor}`
            : "0 10px 30px -10px rgba(0, 0, 0, 0.8)",
          borderColor: isHovered ? exp.borderColor : "rgba(255, 255, 255, 0.1)",
        }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: index * 0.18, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* 3D Dynamic Glare Sheen */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-3xl z-30 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 35%, transparent 70%)`,
          }}
        />

        {/* Ambient background glow inside card */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 -z-10"
          style={{
            backgroundColor: exp.accentHex,
            opacity: isHovered ? 0.15 : 0.06,
          }}
        />

        {/* 3D Hardware Corner Brackets */}
        <div className="absolute top-4 left-4 text-white/20 font-mono text-[10px] select-none pointer-events-none">
          +
        </div>
        <div className="absolute top-4 right-4 text-white/20 font-mono text-[10px] select-none pointer-events-none">
          +
        </div>
        <div className="absolute bottom-4 left-4 text-white/20 font-mono text-[10px] select-none pointer-events-none">
          +
        </div>
        <div className="absolute bottom-4 right-4 text-white/20 font-mono text-[10px] select-none pointer-events-none">
          +
        </div>

        {/* --- Top Header (elevated in 3D: translateZ 35px) --- */}
        <div style={{ transform: "translateZ(35px)" }} className="relative z-10 mb-6">
          <div className="flex items-center justify-between gap-3 mb-5">
            {/* Glowing Icon Emblem */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-inner"
              style={{
                backgroundColor: isHovered ? `${exp.accentHex}18` : "rgba(255, 255, 255, 0.04)",
                borderColor: isHovered ? exp.borderColor : "rgba(255, 255, 255, 0.12)",
                boxShadow: isHovered ? `0 0 20px ${exp.glowColor}` : "none",
              }}
            >
              <IconComponent
                className="w-5 h-5 transition-colors duration-300"
                style={{ color: isHovered ? exp.accentHex : "#E1E0CC" }}
              />
            </div>

            {/* Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide border shadow-sm ${exp.badgeStyle}`}
            >
              {exp.badge}
            </span>
          </div>

          <h3
            className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 transition-colors duration-300"
            style={{
              color: "#E1E0CC",
              fontFamily:
                "var(--font-space-grotesk), var(--font-geist-sans), system-ui, sans-serif",
            }}
          >
            {exp.role}
          </h3>

          <div className="flex items-center gap-3 text-xs font-mono text-muted">
            <span className="text-white/80">{exp.period}</span>
            <span className="text-white/30">•</span>
            <span className="font-medium" style={{ color: exp.accentHex }}>
              {exp.status}
            </span>
          </div>
        </div>

        {/* --- Middle: Description & Deliverables (elevated in 3D: translateZ 25px) --- */}
        <div style={{ transform: "translateZ(25px)" }} className="relative z-10 mb-6 flex-1">
          <p
            className="text-sm sm:text-base leading-relaxed mb-6 font-sans"
            style={{ color: "rgba(225, 224, 204, 0.75)" }}
          >
            {exp.description}
          </p>

          <div className="space-y-2.5 text-xs sm:text-sm text-foreground/85 font-mono">
            {exp.deliverables.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 group/item transition-transform duration-200 hover:translate-x-1"
              >
                <span
                  className="font-bold text-base leading-none transition-colors duration-300"
                  style={{ color: exp.accentHex }}
                >
                  ↳
                </span>
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- Bottom: Skills Pills (elevated in 3D: translateZ 35px) --- */}
        <div
          style={{ transform: "translateZ(35px)" }}
          className="relative z-10 pt-5 border-t border-white/10 flex flex-wrap gap-2"
        >
          {exp.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 text-xs font-mono rounded-xl border border-white/10 bg-white/[0.03] text-muted transition-all duration-200 cursor-default hover:border-accent/40 hover:text-accent hover:bg-accent/5 hover:scale-105"
            >
              {skill}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function ExperienceSection() {
  return (
    <section id="experience" className="w-full p-2 sm:p-3 md:p-4">
      <div className="relative w-full overflow-hidden rounded-2xl md:rounded-[2rem] border border-white/10 shadow-2xl bg-black/85 p-6 sm:p-10 lg:p-14">
        {/* Background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <SectionHeading subtitle="Experience">
          Track record & <span className="text-accent">milestones</span>
        </SectionHeading>

        {/* Horizontal 3D Grid Layout */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {EXPERIENCES.map((exp, i) => (
            <ExperienceCard3D key={exp.role} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
