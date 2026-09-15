"use client";

import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

/* ─── Unified Section Heading matching Hero Typography ─── */
function SectionHeading({ subtitle, children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="mb-12 text-center">
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

/* ─── Magnetic CTA button ─── */
function MagneticCTA({ children, href, className = "", style }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  function handleMouseMove(e) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.12);
    y.set((e.clientY - cy) * 0.12);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY, ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.a>
  );
}

export default function ContactSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const [time, setTime] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function updateTime() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    }
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  function handleCopyEmail() {
    navigator.clipboard.writeText("manpreetsing611@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <section id="contact" className="w-full p-2 sm:p-3 md:p-4">
      <div className="relative w-full overflow-hidden rounded-2xl md:rounded-[2rem] border border-white/10 shadow-2xl bg-black/85 p-6 sm:p-10 lg:p-16">
        {/* Subtle ambient lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading subtitle="Contact">
            Let&apos;s build <span className="text-accent">the next big app</span>
          </SectionHeading>

          <div ref={containerRef} className="max-w-2xl mx-auto text-center">
            {/* Live Status & Time Pill */}
            <motion.div
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-xs font-mono mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
            >
              <span className="flex items-center gap-1.5 text-accent">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Available for Mobile Roles
              </span>
              <span className="text-muted">•</span>
              <span className="text-muted">
                IST: <span style={{ color: "#E1E0CC" }}>{time || "11:30 PM"}</span>
              </span>
            </motion.div>

            <motion.p
              className="text-base sm:text-lg leading-relaxed mb-10"
              style={{ color: "rgba(225, 224, 204, 0.75)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              Have a high-performance mobile application to engineer, a key engineering opportunity, or want to discuss architecture?
              My inbox is always open.
            </motion.p>

            {/* Action Buttons matching Hero design system */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Signature Hero-Style Pill Button */}
              <MagneticCTA
                href="mailto:manpreetsing611@gmail.com"
                className="group inline-flex items-center gap-3 rounded-full py-1.5 pl-6 pr-1.5 text-sm sm:text-base font-semibold text-black transition-all hover:gap-4 cursor-pointer shadow-2xl"
                style={{ backgroundColor: "#E1E0CC" }}
              >
                <span>Say Hello</span>
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110">
                  <ArrowRight className="h-4 w-4" style={{ color: "#E1E0CC" }} />
                </span>
              </MagneticCTA>

              {/* Quick Copy Email Button */}
              <button
                onClick={handleCopyEmail}
                className={`inline-flex items-center gap-2.5 rounded-full border px-5 py-3 text-xs sm:text-sm font-mono transition-all duration-300 backdrop-blur-md cursor-pointer ${
                  copied
                    ? "border-emerald-400 bg-emerald-500/10 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.2)]"
                    : "border-white/10 bg-white/[0.03] text-muted hover:text-accent hover:border-accent/40"
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Email Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                    </svg>
                    <span>Copy Address</span>
                  </>
                )}
              </button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="mt-14 flex items-center justify-center gap-6"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <a
                href="https://github.com/manpreet-singh47"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted hover:text-accent transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="text-xs font-mono">GitHub</span>
              </a>

              <span className="h-3 w-px bg-white/15" />

              <a
                href="https://linkedin.com/in/manpreet-singh-322678236"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted hover:text-accent transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span className="text-xs font-mono">LinkedIn</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
