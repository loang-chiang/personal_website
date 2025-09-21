"use client";

import { useEffect, useRef } from "react";

type Props = {
  colors: string[];          // e.g. [p.accent, p.accentSoft, ...]
  className?: string;        // e.g. "absolute inset-0"
  backgroundFill?: string;   // e.g. "#FFF8F1" or "rgba(255,248,241,0.7)"
  fadePerFrame?: number;     // default 0.001
  shrinkOnFade?: boolean;    // default true
};

export default function PaintBackground({
  colors,
  className = "absolute inset-0",
  backgroundFill,
  fadePerFrame = 0.001,
  shrinkOnFade = true,
}: Props) {
  const lastSpawnRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dropsRef = useRef<PaintDrop[]>([]);
  const rafRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);

  // ✅ Visibility ref (client-only)
  useEffect(() => {
    isVisibleRef.current = document.visibilityState === "visible";
    const onVis = () => {
      isVisibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    let width = 0, height = 0;

    // random spawner (guarded by visibility)
    const interval = setInterval(() => {
      if (!isVisibleRef.current) return;
      if (!canvas) return;
      createPaintDrop(
        Math.random() * (canvas.clientWidth || window.innerWidth),
        Math.random() * (canvas.clientHeight || window.innerHeight),
        false
      );
    }, 800);

    function resize() {
      const parent = canvas.parentElement;
      const w = (parent?.clientWidth ?? window.innerWidth);
      const h = (parent?.clientHeight ?? window.innerHeight);
      width = w; height = h;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const paintDrops = dropsRef.current;

    function hexToRGB(hex: string) {
      const h = hex.replace("#", "");
      const hh = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
      const r = parseInt(hh.slice(0, 2), 16);
      const g = parseInt(hh.slice(2, 4), 16);
      const b = parseInt(hh.slice(4, 6), 16);
      return { r, g, b };
    }

    function createPaintDrop(x: number, y: number, isClick = false) {
      const color = colors[Math.floor(Math.random() * colors.length)] ?? "#D95F59";
      const maxSize = isClick ? Math.random() * 120 + 100 : Math.random() * 80 + 50;
      paintDrops.push({
        x, y,
        size: 0,
        maxSize,
        color,
        opacity: 0.8,
        age: 0,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        growing: true,
      });
    }

    function animate() {
      // clear frame
      ctx.clearRect(0, 0, width, height);

      if (backgroundFill) {
        ctx.fillStyle = backgroundFill;
        ctx.fillRect(0, 0, width, height);
      }

      for (let i = paintDrops.length - 1; i >= 0; i--) {
        const d = paintDrops[i];

        // grow
        if (d.growing && d.size < d.maxSize) d.size += d.maxSize * 0.01;
        else d.growing = false;

        // drift
        d.x += d.vx * 0.3;
        d.y += d.vy * 0.3;
        d.vx *= 0.99;
        d.vy *= 0.99;

        // fade
        d.age += 1;
        d.opacity = Math.max(0, 0.9 - d.age * 0.002);

        if (!d.growing && shrinkOnFade) d.size *= 0.997;

        const { r, g, b } = hexToRGB(d.color);
        const gradient = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, Math.max(1, d.size));
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${d.opacity})`);
        gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${d.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(d.x, d.y, Math.max(1, d.size), 0, Math.PI * 2);
        ctx.fill();

        if (d.opacity <= 0 || d.size < 0.5 || d.age > 3000) paintDrops.splice(i, 1);
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    // ✅ define onClick (was missing)
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createPaintDrop(x, y, true);
      // burst (guarded by visibility)
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          if (!isVisibleRef.current) return;
          createPaintDrop(
            x + (Math.random() - 0.5) * 100,
            y + (Math.random() - 0.5) * 100,
            false
          );
        }, i * 100);
      }
    };

    // throttle spawns on slow cursor with distance + time gate
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = performance.now();

      const MIN_DIST = 48;  // raise to reduce count
      const MIN_MS = 140;   // raise to reduce count

      const last = lastSpawnRef.current;
      const farEnough = !last || Math.hypot(x - last.x, y - last.y) >= MIN_DIST;
      const oldEnough = !last || (now - last.t) >= MIN_MS;

      if (farEnough && oldEnough) {
        createPaintDrop(x, y, false);
        lastSpawnRef.current = { x, y, t: now };
      }
    };

    // init
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);

    // seed a few (guarded by visibility)
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        if (!isVisibleRef.current) return;
        createPaintDrop(
          Math.random() * (canvas.clientWidth || window.innerWidth),
          Math.random() * (canvas.clientHeight || window.innerHeight),
          false
        );
      }, 400 + i * 300);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      clearInterval(interval);
    };
  }, [colors, backgroundFill, fadePerFrame, shrinkOnFade]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
      aria-hidden
    />
  );
}

type PaintDrop = {
  x: number; y: number;
  size: number; maxSize: number;
  color: string; opacity: number; age: number;
  vx: number; vy: number;
  growing: boolean;
};
