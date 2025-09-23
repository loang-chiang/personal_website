// app/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import PaintBackground from "@/components/PaintBackground";
import FancyButton from "@/components/FancyButton";
import { usePalette } from "@/components/PaletteProvider";

export default function HomePage() {
  const { palette, setPalette, p, palettes, ready } = usePalette();
  const colors = p.colors?.length ? p.colors : [p.accent, p.accentSoft ?? p.accent];

  // INTRO (runs once after palette is hydrated)
  const [showIntro, setShowIntro] = useState(false);
  const introStartedRef = useRef(false);
  useEffect(() => {
    if (!ready || introStartedRef.current) return;
    introStartedRef.current = true;
    setShowIntro(true);
    const t = setTimeout(() => setShowIntro(false), 1600);
    return () => clearTimeout(t);
  }, [ready]);

  // Keep CSS var for overlays in sync with palette (prevents color flash)
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", p.accent);
  }, [p.accent]);

  // NAV OVERLAY (single, global)
  const [slideOverlay, setSlideOverlay] = useState(false);
  const router = useRouter();

  const NAV_OVERLAY = {
    initial: { y: "100%" },
    enter:   { y: 0,       transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
    exit:    { y: "-100%", transition: { duration: 0.50, ease: [0.16, 1, 0.3, 1] } },
  } as const;

  const pushedRef = useRef(false);
  const goProjects = () => setSlideOverlay(true);

  return (
    <div className={`${p.bg} ${p.text} min-h-screen flex flex-col antialiased overflow-x-hidden relative`}>
      {/* Intro stripes — only after palette is ready; do NOT key by accent */}
      <AnimatePresence>
        {ready && showIntro && <OpeningOverlay colors={colors} />}
      </AnimatePresence>

      {/* One navigation slide overlay (top-level) */}
      <AnimatePresence initial={false}>
        {slideOverlay && (
          <motion.div
            key="nav-slide-overlay"
            className="fixed inset-0 z-50"
            style={{ backgroundColor: "var(--accent)" }}
            variants={NAV_OVERLAY}
            initial="initial"
            animate="enter"
            exit="exit"
            onAnimationComplete={(phase) => {
              if (phase === "enter" && !pushedRef.current) {
                pushedRef.current = true;
                router.push("/projects");
                // immediately start exit
                setTimeout(() => setSlideOverlay(false), 0);
              }
            }}
          />
        )}
      </AnimatePresence>

      <Header
        accent={p.accent}
        palette={palette}
        setPalette={(name) => setPalette(name as any)}
        palettes={palettes}
      />

      {/* Main */}
      <main className="flex-grow relative">
        {/* Background canvas */}
        <PaintBackground
          className="absolute inset-0 z-0"
          colors={colors}
          fade={0.05}
        />

        {/* Foreground */}
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
                className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--grad-0)] via-[var(--grad-1)] to-[var(--grad-2)]"
                style={{
                  ["--grad-0" as any]: colors[0],
                  ["--grad-1" as any]: colors[1] ?? colors[0],
                  ["--grad-2" as any]: colors[2] ?? colors[0],
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Loang
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-lg opacity-80">
              Computer Science and Cognitive Science student at Brown University
            </p>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6, type: "spring" }}
              className="mt-8 flex gap-4"
            >
              {/* Use onClick so we can run overlay first */}
              <FancyButton variant="solid" accent={p.accent} onClick={goProjects}>
                Projects
              </FancyButton>

              <FancyButton href="#contact" variant="outline" accent={p.accent}>
                Contact
              </FancyButton>
            </motion.div>
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t border-white/20"
        style={{ backgroundColor: "var(--header-bg, white)", borderColor: "var(--header-border, #ddd)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm opacity-70">
          <p>© {new Date().getFullYear()} Loang Chiang. Built with React + Tailwind.</p>
          <div className="flex items-center gap-2">
            <a href="#" className="underline transition-colors duration-200 hover:text-blue-600" style={{ color: p.accent }}>
              GitHub
            </a>
            <a href="#" className="underline transition-colors duration-200 hover:text-blue-600" style={{ color: p.accent }}>
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Intro stripes overlay */
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
