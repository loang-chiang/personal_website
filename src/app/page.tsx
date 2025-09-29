"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import PaintBackground from "@/components/PaintBackground";
import FancyButton from "@/components/FancyButton";
import { usePalette } from "@/components/PaletteProvider";
import Footer from "@/components/Footer";

export default function HomePage() {
  const { palette, setPalette, p, palettes, ready } = usePalette();
  const liveColors = p.colors?.length ? p.colors : [p.accent, p.accentSoft ?? p.accent];

  // ---------------- INTRO: first visit, reload, or when returning home ----------------
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
      if (performance && performance.navigation) {
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
      // Freeze colors for this entire run so palette changes don't spawn a stray stripe
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

  // ---------------- NAV OVERLAY (cover only, then push) ----------------
  const router = useRouter();
  const [slideOverlay, setSlideOverlay] = useState(false);
  const navTargetRef = useRef<string | null>(null);

  const OVERLAY_IN = { duration: 0.6, ease: [0.16, 1, 0.3, 1] } as const;

  const goProjects = () => {
    navTargetRef.current = "/projects";
    setSlideOverlay(true);
  };
  
  const goContact = () => {
    navTargetRef.current = "/contact";
    setSlideOverlay(true);
  };


  return (
    <div className={`${p.bg} ${p.text} min-h-screen flex flex-col antialiased overflow-x-hidden relative`}>
      {/* Intro stripes — stable, frozen colors; runs on first visit/reload or when flagged from Header */}
      <AnimatePresence initial={false}>
        {showIntro && introColorsRef.current && (
          <OpeningOverlay key="opening" colors={introColorsRef.current} onDone={handleIntroDone} />
        )}
      </AnimatePresence>

      {/* Route cover used by the "Projects" button (mirrors Header behavior) */}
      <AnimatePresence>
        {slideOverlay && (
          <motion.div
            key="home-route-cover"
            className="fixed inset-0 z-50 pointer-events-none"
            style={{ backgroundColor: "var(--accent)" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={OVERLAY_IN}
            onAnimationComplete={() => {
              const target = navTargetRef.current;
              if (target) {
                try { sessionStorage.setItem("routeCovered", "1"); } catch {}
                router.push(target);
                navTargetRef.current = null;
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
          className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-24 text-center"
          style={{ minHeight: 'calc(100vh - 120px)' }}
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
              {/* Match Header behavior: prefetch + cover-only overlay */}
              <FancyButton
                variant="solid"
                accent={p.accent}
                onMouseEnter={() => router.prefetch("/projects")}
                onClick={goProjects}
              >
                Projects
              </FancyButton>

              <FancyButton 
                variant="outline" 
                accent={p.accent}
                onMouseEnter={() => router.prefetch("/contact")}
                onClick={goContact}
              >
                Contact
              </FancyButton>
            </motion.div>
          </motion.section>
        </div>
      </main>

      <Footer></Footer>
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

