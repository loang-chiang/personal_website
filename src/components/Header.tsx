"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

type HeaderProps = {
  accent: string;
  palette: string;
  setPalette: (p: string) => void;
  palettes: string[];
};

const OVERLAY_IN = { duration: 0.6, ease: [0.16, 1, 0.3, 1] };

function CircleMark({ color, size = 32 }: { color: string; size?: number }) {
  return (
    <motion.div
      className="rounded-full"
      style={{ width: size, height: size, backgroundColor: color }}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.15, boxShadow: `0 0 12px ${color}, 0 0 24px ${color}` }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    />
  );
}

export default function Header({ accent, palette, setPalette, palettes }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  // keep CSS var in sync so overlay always matches palette
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
  }, [accent]);

  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  // overlay state
  const [overlayOn, setOverlayOn] = useState(false);
  const navTargetRef = useRef<string | null>(null);
  const navLockRef = useRef(false);

  // kill any leftover overlay on route change
  useEffect(() => {
    if (overlayOn) {
      setOverlayOn(false);
      navLockRef.current = false;
      navTargetRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const pathFromHref = (href: string) => {
    try {
      return new URL(href, typeof window !== "undefined" ? window.location.origin : "http://localhost").pathname;
    } catch {
      return href;
    }
  };

  const isInternalPath = (href: string) => href.startsWith("/") && !href.includes("#");
  const isSamePath = (href: string) => pathFromHref(href) === pathname;

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    // Let external and hash links behave normally
    if (!href.startsWith("/")) return;
    const toPath = pathFromHref(href);

    // already on this page → no overlay
    if (toPath === pathname) return;

    // going home → let Home run its own intro, skip header overlay
    if (toPath === "/") {
      try { sessionStorage.setItem("homeIntro", "1"); } catch {}
      return; // do NOT preventDefault
    }

    // internal route (non-home): run cover overlay
    if (!isInternalPath(href)) return; // '/#something' → treat as hash, no overlay
    e.preventDefault();
    if (navLockRef.current) return;    // debounce during animation
    navLockRef.current = true;

    navTargetRef.current = href;
    setOverlayOn(true);                 // slide IN; push on complete
  }

  return (
    <>
      {/* Full-viewport overlay */}
      <AnimatePresence>
        {overlayOn && (
          <motion.div
            key="route-slide-overlay"
            className="fixed inset-0 z-[999] pointer-events-none"
            style={{ backgroundColor: `var(--accent, ${accent})` }}
            initial={{ y: "100%" }} // offscreen bottom
            animate={{ y: 0 }}      // cover the page
            transition={OVERLAY_IN}
            onAnimationComplete={() => {
              const href = navTargetRef.current;
              if (!href) return;
              try { sessionStorage.setItem("routeCovered", "1"); } catch {}
              navTargetRef.current = null;
              router.push(href);    // navigate; page unmounts this overlay
              // no exit animation here; new page will reveal itself if desired
            }}
          />
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className="sticky top-0 z-40 border-b"
        style={{ backgroundColor: "var(--header-bg, white)", borderColor: "var(--header-border, #ddd)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <CircleMark color={accent} size={32} />

            {/* Brand: set homeIntro so the Home page plays its intro; no overlay here */}
            <Link
              href="/"
              className="font-semibold tracking-wide hover:underline"
              onClick={() => { try { sessionStorage.setItem("homeIntro", "1"); } catch {} }}
            >
              <motion.span whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 300 } }}>
                Loang Chiang :)
              </motion.span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {[
              { name: "Projects", href: "/projects" },
              { name: "About", href: "/about" },
              { name: "Contact", href: "/contact" }, // hash = no overlay
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-3 py-2 rounded-lg overflow-hidden"
                onMouseEnter={() => {
                  setHoveredNav(item.name);
                  if (isInternalPath(item.href)) router.prefetch(item.href);
                }}
                onMouseLeave={() => setHoveredNav(null)}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {/* hover fill */}
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  style={{ backgroundColor: accent }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: hoveredNav === item.name ? 1 : 0,
                    opacity: hoveredNav === item.name ? 0.12 : 0,
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />

                {/* label */}
                <motion.span
                  className="relative z-10"
                  animate={{ color: hoveredNav === item.name ? accent : "inherit" }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.span>

                {/* underline */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: accent }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoveredNav === item.name ? 1 : 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />
              </Link>
            ))}
          </nav>

          {/* Palette selector */}
          <motion.select
            value={palette}
            onChange={(e) => setPalette(e.target.value)}
            className="rounded-xl border px-3 py-1 text-sm transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileFocus={{ scale: 1.05 }}
            style={{ borderColor: accent } as any}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = accent;
              e.currentTarget.style.boxShadow = `0 0 0 2px ${accent}20`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--header-border, #ddd)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {palettes.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </motion.select>
        </div>
      </motion.header>
    </>
  );
}




