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
  const liveColors = p.colors?.length ? p.colors : [p.accent, p.accentSoft ?? p.accent];

  // ---------- INTRO: run on first load, on reload, or when Header flagged "homeIntro" ----------
  const [showIntro, setShowIntro] = useState(false);
  const introColorsRef = useRef<string[] | null>(null);
  const introRanRef = useRef(false);

  useEffect(() => {
    if (!ready || introRanRef.current) return;

    // Detect hard reload (modern + Safari fallback)
    const isReload = (() => {
      try {
        const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
        if (nav && "type" in nav) return nav.type === "reload";
      } catch {}
      // @ts-ignore deprecated but useful fallback
      if (performance && performance.navigation) {
        // @ts-ignore
        return performance.navigation.type === 1; // 1 = reload
      }
      return false;
    })();

    const fromNav = (() => {
      try { return sessionStorage.getItem("homeIntro") === "1"; } catch { return false; }
    })();

    const firstLoad = (() => {
      try { return sessionStorage.getItem("openingPlayed") !== "1"; } catch { return true; }
    })();

    if (isReload || fromNav || firstLoad) {
      introRanRef.current = true;
      // Freeze colors for the entire animation so palette changes don't pop a stripe
      introColorsRef.current = [...liveColors];
      setShowIntro(true);
      try {
        sessionStorage.setItem("openingPlayed", "1");
        sessionStorage.removeItem("homeIntro");
      } catch {}
    }
    // Do NOT depend on liveColors; we want the frozen snapshot above
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const handleIntroDone = () => setShowIntro(false);

  // Keep CSS var in sync for overlays (prevents color flash)
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", p.accent);
  }, [p.accent]);

  // ---------- NAV OVERLAY (covers page, then pushes) ----------
  const [slideOverlay, setSlideOverlay] = useState(false);
  const router = useRouter();
  const pushedRef = useRef(false);

  const NAV_OVERLAY = {
    initial: { y: "100%" },
    enter:   { y: 0,       transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
    exit:    { y: "-100%", transition: { duration: 0.50, ease: [0.16, 1, 0.3, 1] } },
  } as const;

  const goProjects = () => setSlideOverlay(true);

  return (
    <div className={`${p.bg} ${p.text} min-h-screen flex flex-col antialiased overflow-x-hidden relative`}>
      {/* Intro stripes — stable, uses frozen colors; runs on first visit, reload, or when returning home */}
      <AnimatePresence initial={false}>
        {showIntro && introColorsRef.current && (
          <OpeningOverlay key="opening" colors={introColorsRef.current} onDone={handleIntroDone} />
        )}
      </AnimatePresence>

      {/* Single navigation overlay */}
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
                // Immediately trigger exit animation
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
        <PaintBackground className="absolute inset-0 z-0" colors={liveColors} fade={0.05} />

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
                  ["--grad-0" as any]: liveColors[0],
                  ["--grad-1" as any]: liveColors[1] ?? liveColors[0],
                  ["--grad-2" as any]: liveColors[2] ?? liveColors[0],
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

/* ---------------- Opening overlay ---------------- */

function OpeningOverlay({
  colors,
  onDone,
}: {
  colors: string[];
  onDone: () => void;
}) {
  const DURATION = 1.85;
  const STAGGER = 0.12;
  const HOLD = 0.18;
  const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <motion.div className="fixed inset-0 z-[60] pointer-events-none" initial={false} animate={{ opacity: 1 }}>
      <div className="absolute inset-0 grid" style={{ gridTemplateRows: `repeat(${colors.length}, 1fr)` }}>
        {colors.map((c, i) => {
          const isLast = i === colors.length - 1;
          return (
            <motion.div
              key={i}
              animate={{ y: ["0%", "-6%", "-86%", "-120%"], opacity: [1, 1, 1, 0] }}
              transition={{ duration: DURATION, ease: EASE, delay: i * STAGGER, times: [0, HOLD, 0.84, 1] }}
              style={{ background: c }}
              onAnimationComplete={isLast ? onDone : undefined}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

