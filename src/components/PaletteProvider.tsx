"use client";

import React, {
  createContext, useContext, useEffect, useLayoutEffect, useMemo, useState,
} from "react";
import { PALETTES, PaletteName } from "@/lib/palettes";

type Ctx = {
  palette: PaletteName;
  setPalette: (p: PaletteName) => void;
  p: (typeof PALETTES)[PaletteName];
  palettes: PaletteName[];
  ready: boolean;
};

const STORAGE_KEY = "palette-choice";
const Ctx = createContext<Ctx | null>(null);

export function PaletteProvider({
  children,
  initialPalette = "Vintage",
}: {
  children: React.ReactNode;
  initialPalette?: PaletteName;
}) {
  // Seed from the server-provided value so SSR and first client render match
  const [palette, setPalette] = useState<PaletteName>(initialPalette);
  const [ready, setReady] = useState(false);

  // After mount, prefer localStorage if it exists (keeps old users’ choice)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as PaletteName | null;
      if (saved && PALETTES[saved] && saved !== palette) setPalette(saved);
    } finally {
      setReady(true);
    }
  }, []);

  // Keep CSS var in sync BEFORE paint (prevents overlay/intro color flash)
  useLayoutEffect(() => {
    const accent = PALETTES[palette].accent;
    document.documentElement.style.setProperty("--accent", accent);
  }, [palette]);

  // Persist to both localStorage and cookie so SSR can pick it up next time
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, palette); } catch {}
    // 1 year, Lax
    document.cookie = `palette-choice=${palette}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }, [palette]);

  const value = useMemo(
    () => ({
      palette,
      setPalette,
      p: PALETTES[palette],
      palettes: Object.keys(PALETTES) as PaletteName[],
      ready,
    }),
    [palette, ready]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePalette() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePalette must be used within <PaletteProvider>");
  return ctx;
}
