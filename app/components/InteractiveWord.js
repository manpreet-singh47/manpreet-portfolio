"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function InteractiveWord({ children, tag, icon, accent = "var(--accent)" }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className="relative inline-block cursor-pointer font-medium text-foreground transition-colors hover:text-accent group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative z-10">{children}</span>

      {/* Animated underline */}
      <motion.span
        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-accent origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Floating Micro-Badge Tooltip */}
      <AnimatePresence>
        {isHovered && tag && (
          <motion.span
            className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono whitespace-nowrap bg-surface/95 border border-accent/40 text-accent shadow-xl backdrop-blur-md"
            initial={{ opacity: 0, y: 6, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.85 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {icon && <span className="text-xs">{icon}</span>}
            <span>{tag}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
