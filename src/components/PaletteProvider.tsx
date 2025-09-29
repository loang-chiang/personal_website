// src/components/PaletteProvider.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
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
const CtxObj = createContext<Ctx | null>(null);

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPalette] = useState<PaletteName>("Vintage");
  const [ready, setReady] = useState(false);

  // Read saved palette after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as PaletteName | null;
      if (saved && PALETTES[saved]) setPalette(saved);
    } finally {
      setReady(true);
    }
  }, []);

  // Keep CSS vars in sync BEFORE paint (prevents color flash)
  useLayoutEffect(() => {
    const def = PALETTES[palette];
    const root = document.documentElement;

    root.style.setProperty("--accent", def.accent);
    root.style.setProperty("--header-bg", def.headerBg ?? "white");
    root.style.setProperty("--header-border", def.headerBorder ?? "#ddd");

    const [g0, g1 = def.colors[0], g2 = def.colors[0]] = def.colors;
    root.style.setProperty("--grad-0", g0);
    root.style.setProperty("--grad-1", g1);
    root.style.setProperty("--grad-2", g2);

    root.setAttribute("data-palette", palette);

    try {
      localStorage.setItem(STORAGE_KEY, palette);
    } catch {}
  }, [palette]);

  const value = useMemo<Ctx>(
    () => ({
      palette,
      setPalette,
      p: PALETTES[palette],
      palettes: Object.keys(PALETTES) as PaletteName[],
      ready,
    }),
    [palette, ready]
  );

  return <CtxObj.Provider value={value}>{children}</CtxObj.Provider>;
}

export function usePalette() {
  const ctx = useContext(CtxObj);
  if (!ctx) throw new Error("usePalette must be used within PaletteProvider");
  return ctx;
}

