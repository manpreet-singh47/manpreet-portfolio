"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTextHovered, setIsTextHovered] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for cursor ring
  const ringX = useSpring(mouseX, { stiffness: 400, damping: 28 });
  const ringY = useSpring(mouseY, { stiffness: 400, damping: 28 });

  // Slower spring for ambient spotlight
  const spotX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const spotY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    // Only show on devices with a fine pointer (mouse)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    function handleMouseMove(e) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    }

    function handleMouseOver(e) {
      const target = e.target;
      if (!target) return;

      const isInteractive =
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".interactive-target") ||
        target.closest(".tech-card");

      const isText =
        target.closest("h1") ||
        target.closest("h2") ||
        target.closest(".hover-reveal-text");

      setIsHovered(!!isInteractive);
      setIsTextHovered(!!isText && !isInteractive);
    }

    function handleMouseLeave() {
      setIsVisible(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Ambient Mouse Spotlight */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 -z-0 rounded-full blur-3xl opacity-30"
        style={{
          x: spotX,
          y: spotY,
          translateX: "-50%",
          translateY: "-50%",
          width: 450,
          height: 450,
          background:
            "radial-gradient(circle, rgba(200, 243, 29, 0.12) 0%, rgba(200, 243, 29, 0.02) 40%, transparent 70%)",
        }}
      />

      {/* Outer Cursor Ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-50 rounded-full border border-accent/60 mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? 56 : isTextHovered ? 72 : 32,
          height: isHovered ? 56 : isTextHovered ? 72 : 32,
          backgroundColor: isTextHovered
            ? "rgba(200, 243, 29, 0.15)"
            : isHovered
            ? "rgba(200, 243, 29, 0.25)"
            : "rgba(200, 243, 29, 0)",
          borderColor: isHovered
            ? "rgba(200, 243, 29, 0.9)"
            : "rgba(200, 243, 29, 0.4)",
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      />

      {/* Center Pin Dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-50 w-1.5 h-1.5 rounded-full bg-accent"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered || isTextHovered ? 0 : 1,
          opacity: isHovered ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
