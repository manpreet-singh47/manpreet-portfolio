"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Code2, Flame } from "lucide-react";

/* ─── Animated counter ─── */
function CounterBlock({ target, suffix, label }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1400, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [target]);
  return (
    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] flex flex-col justify-center">
      <span className="text-2xl font-bold text-white leading-none tracking-tight">
        {value}{suffix}
      </span>
      <span className="text-[10px] text-zinc-500 font-mono mt-1.5">{label}</span>
    </div>
  );
}

/* ─── Open to Work ─── */
function OpenToWork() {
  const roles = ["React Native Dev", "Mobile Engineer", "Frontend Engineer"];
  const [roleIdx, setRoleIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRoleIdx((p) => (p + 1) % roles.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Availability</span>
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          Open to Work
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-5">
        {/* Glowing icon */}
        <motion.div
          className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center"
          animate={{ boxShadow: ["0 0 0px rgba(52,211,153,0)", "0 0 24px rgba(52,211,153,0.2)", "0 0 0px rgba(52,211,153,0)"] }}
          transition={{ duration: 2.8, repeat: Infinity }}
        >
          <Flame className="w-6 h-6 text-emerald-400" />
        </motion.div>

        {/* Rotating role */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Looking for</span>
          <div className="h-7 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={roleIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg font-semibold text-white leading-7"
              >
                {roles[roleIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {["Remote", "Contract", "Full-time"].map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-mono px-2.5 py-1 rounded-full border border-zinc-700 text-zinc-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-800 text-[10px] font-mono text-zinc-600">
        India · IST (UTC +5:30)
      </div>
    </div>
  );
}

/* ─── Main export ─── */
export const MagicBento = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-3 md:auto-rows-[200px]">

      {/* 1 — Experience: 2×2 tall left */}
      <motion.div
        className="md:col-span-2 md:row-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 flex flex-col hover:border-zinc-700 transition-colors overflow-hidden"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Experience</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-zinc-700 text-zinc-400">Stats</span>
        </div>

        <div className="grid grid-cols-1 gap-2 flex-1">
          <CounterBlock target={2} suffix="+ Yrs" label="Engineering Experience" />
          <CounterBlock target={8} suffix=" Apps" label="Shipped to Production" />
          <CounterBlock target={100} suffix="%" label="Mobile First" />
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center gap-2 text-[10px] font-mono text-zinc-600">
          <span className="w-1.5 h-1.5 rounded-full bg-white/20 inline-block" />
          React Native · 2023 – Present
        </div>
      </motion.div>

      {/* 2 — Core Stack: 2×1 top-middle */}
      <motion.div
        className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 flex flex-col hover:border-zinc-700 transition-colors overflow-hidden"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.4 }} whileHover={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Core Stack</span>
          <Cpu className="w-3.5 h-3.5 text-zinc-600" />
        </div>
        <div className="flex-1 flex items-center">
          <div className="grid grid-cols-3 gap-1.5 w-full">
            {["React Native", "TypeScript", "RN Skia", "Reanimated 3", "iOS / Android", "Hermes"].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="text-[9px] font-mono text-zinc-400 border border-zinc-800 px-1.5 py-1.5 rounded-lg text-center hover:border-zinc-600 hover:text-zinc-300 transition-colors truncate"
              >
                {t}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 3 — Open to Work: 2×2 tall right */}
      <motion.div
        className="md:col-span-2 md:row-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 flex flex-col hover:border-zinc-700 transition-colors overflow-hidden"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.4 }} whileHover={{ scale: 1.02 }}
      >
        <OpenToWork />
      </motion.div>

      {/* 4 — Tooling: 2×1 bottom-middle */}
      <motion.div
        className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 flex flex-col hover:border-zinc-700 transition-colors overflow-hidden"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.4 }} whileHover={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Tooling</span>
          <Code2 className="w-3.5 h-3.5 text-zinc-600" />
        </div>
        <div className="flex-1 flex items-center">
          <div className="flex flex-wrap gap-1.5">
            {["Expo", "Zustand", "GSAP", "WatermelonDB", "SQLite", "Git", "WebSockets", "Tailwind"].map((tool, i) => (
              <motion.span
                key={tool}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.04, duration: 0.25 }}
                whileHover={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}
                className="px-2.5 py-1 text-[10px] rounded-full border border-zinc-800 text-zinc-500 font-mono cursor-default"
                style={{ transition: "border-color 0.2s, color 0.2s" }}
              >
                {tool}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default MagicBento;
