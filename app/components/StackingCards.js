"use client";

import { createContext, useContext, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const StackingCardsContext = createContext(null);

export function useStackingCardsContext() {
  const ctx = useContext(StackingCardsContext);
  if (!ctx) throw new Error("StackingCardItem must be used within StackingCards");
  return ctx;
}

/**
 * Tracks its own scroll position on the main page — no nested scroll container needed.
 * @param {{ children, scaleMultiplier, totalCards, className, style }} props
 */
export default function StackingCards({
  children,
  className = "",
  scaleMultiplier,
  totalCards,
  style,
  ...props
}) {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  return (
    <StackingCardsContext.Provider value={{ progress: scrollYProgress, scaleMultiplier, totalCards }}>
      <div ref={targetRef} className={className} style={style} {...props}>
        {children}
      </div>
    </StackingCardsContext.Provider>
  );
}

/**
 * @param {{ index, topPosition, children, className }} props
 */
export function StackingCardItem({ index, topPosition, className = "", children, ...props }) {
  const { progress, scaleMultiplier, totalCards = 0 } = useStackingCardsContext();
  const scaleTo = 1 - (totalCards - index) * (scaleMultiplier ?? 0.04);
  const scale = useTransform(progress, [index * (1 / totalCards), 1], [1, scaleTo]);
  const top = topPosition ?? `${4 + index * 2}%`;

  return (
    <div className={`sticky top-0 h-full ${className}`} {...props}>
      <motion.div className="relative h-full origin-top" style={{ top, scale }}>
        {children}
      </motion.div>
    </div>
  );
}
