"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import PaintBackground from "@/components/PaintBackground";

const PALETTES = {
  Vintage: {
    bg: "bg-[#FFF8F1]",
    text: "text-[#2B1D0E]",
    accent: "#D95F59",       // coral
    accentSoft: "#F4D06F",   // mustard
    card: "bg-white",
    cardBorder: "border-[#EBDDC6]",
    colors: ["#D95F59", "#F4D06F", "#3AAFA9", "#7E6B8F", "#2D728F"],
  },
  Retro: {
    bg: "bg-[#FCEFEA]",
    text: "text-[#2E1E32]",
    accent: "#7D5BA6",
    accentSoft: "#FEC3A6",
    card: "bg-[#FFF8E7]",
    cardBorder: "border-[#E8D5B7]",
    colors: ["#7D5BA6", "#FEC3A6", "#FF8C42", "#4E937A"],
  },
  Pastel: {
    bg: "bg-[#FFF1F2]",
    text: "text-[#2B1C1C]",
    accent: "#EF476F",
    accentSoft: "#FFD166",
    card: "bg-[#E6F2FF]",
    cardBorder: "border-[#BBD6FF]",
    colors: ["#EF476F", "#FFD166", "#06D6A0", "#118AB2"],
  },
};

export default function VisualLayoutStarter() {
  const [palette, setPalette] = useState("Vintage");
  const p = PALETTES[palette];
  const colors = p.colors || [p.accent, p.accentSoft];
  const [showIntro, setShowIntro] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`${p.bg} ${p.text} min-h-screen flex flex-col antialiased overflow-x-hidden relative`}>
      <AnimatePresence>
        {showIntro && <OpeningOverlay colors={colors} />}
      </AnimatePresence>
      {mounted && <FloatingShapes colors={colors} />}

      <Header
        accent={p.accent}
        palette={palette}
        setPalette={setPalette}
        palettes={Object.keys(PALETTES)}
      />

      {/* Main content grows to push footer down */}
      <main className="flex-grow relative">
        {/* Background canvas */}
        <PaintBackground
          className="absolute inset-0 z-0"
          colors={(Array.isArray(colors) && colors.length > 0)
            ? colors
            : [p.accent, p.accentSoft].filter(Boolean) as string[]}
          fade={0.05} // tweak: 0.03 = longer trails, 0.08 = shorter
        />

        {/* Foreground content */}
        <div className="relative z-10">
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-24 text-center mt-32"
          >
            <h1 className="mt-6 text-5xl/tight font-extrabold md:text-7xl/tight">
              Hi, I’m{" "}
              <span
                className="
                  bg-clip-text text-transparent
                  bg-gradient-to-r
                  from-[var(--grad-0)]
                  via-[var(--grad-1)]
                  to-[var(--grad-2)]
                "
                style={{
                  ["--grad-0" as any]: (colors && colors[0]) || p.accent,
                  ["--grad-1" as any]: (colors && colors[1]) || p.accentSoft || p.accent,
                  ["--grad-2" as any]: (colors && colors[2]) || p.accent,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Loang
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg opacity-80">
              I build web apps, play with systems, and love adding joyful little details.
            </p>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6, type: "spring" }}
              className="mt-8 flex gap-4"
            >
              <a
                className="rounded-xl px-5 py-2 text-sm font-medium text-white shadow-md"
                style={{ background: p.accent }}
                href="#projects"
              >
                Projects
              </a>
              <a
                className="rounded-xl border px-5 py-2 text-sm"
                style={{ borderColor: p.accent, color: p.accent }}
                href="#contact"
              >
                Contact
              </a>
            </motion.div>
          </motion.section>
        </div>
      </main>

      {/* Footer sticks to bottom */}
      <footer 
        className="border-t border-white/20"
        style={{
        backgroundColor: "var(--header-bg, white)", // fallback
        borderColor: "var(--header-border, #ddd)",
      }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm opacity-70">
          <p>© {new Date().getFullYear()} Loang Chiang. Built with React + Tailwind.</p>
          <div className="flex items-center gap-2">
            <a href="#" className="underline" style={{ color: p.accent }}>
              GitHub
            </a>
            <a href="#" className="underline" style={{ color: p.accent }}>
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function OpeningOverlay({ colors }: { colors: string[] }) {
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="fixed inset-0 z-[60]"
    >
      <div className="absolute inset-0 grid" style={{ gridTemplateRows: `repeat(${colors.length}, 1fr)` }}>
        {colors.map((c, i) => (
          <motion.div
            key={i}
            initial={{ y: 0 }}
            animate={{ y: "-120%" }}
            transition={{ duration: 1.4, ease: "easeInOut", delay: i * 0.12 }}
            style={{ background: c }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function FloatingShapes({ colors }: { colors: string[] }) {
  const [shapes, setShapes] = useState<
    { w: number; h: number; left: number; color: string; dur: number; delay: number; endY: number }[]
  >([]);

  useEffect(() => {
    const arr = Array.from({ length: 7 }).map((_, i) => ({
      w: 70 + Math.random() * 90,
      h: 70 + Math.random() * 90,
      left: Math.random() * 100,
      color: colors[i % colors.length],
      dur: 8 + Math.random() * 5,
      delay: i * 0.35,
      endY: -200 - Math.random() * 200,
    }));
    setShapes(arr);
  }, [colors]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: [200, s.endY], opacity: [0.25, 0.6, 0] }}
          transition={{ repeat: Infinity, duration: s.dur, delay: s.delay }}
          className="absolute rounded-full blur-2xl"
          style={{
            width: s.w,
            height: s.h,
            left: `${s.left}%`,
            background: s.color,
            opacity: 0.25,
          }}
        />
      ))}
    </div>
  );
}

