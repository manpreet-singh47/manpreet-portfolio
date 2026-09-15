"use client";

import { motion } from "motion/react";

const navItems = ["About", "Projects", "Experience", "Contact"];

export default function Navbar() {
  return (
    <nav className="fixed left-1/2 top-0 z-50 -translate-x-1/2">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-4 rounded-b-2xl bg-black/90 backdrop-blur-md px-5 py-2.5 sm:gap-7 md:gap-12 md:rounded-b-3xl md:px-8 lg:gap-14 border-b border-x border-white/10 shadow-2xl"
      >
        {navItems.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-[11px] font-mono transition-colors sm:text-xs md:text-sm font-medium"
            style={{ color: "rgba(225, 224, 204, 0.8)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#E1E0CC")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(225, 224, 204, 0.8)")
            }
          >
            {item}
          </a>
        ))}
      </motion.div>
    </nav>
  );
}
