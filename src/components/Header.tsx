"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type HeaderProps = {
  accent: string;
  palette: string;
  setPalette: (p: string) => void;
  palettes: string[];
};

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

const OVERLAY_IN = { duration: 0.6, ease: [0.16, 1, 0.3, 1] };

export default function Header({ accent, palette, setPalette, palettes }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  // keep overlay color var in sync
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
  }, [accent]);

  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  // overlay state
  const [overlayOn, setOverlayOn] = useState(false);
  const navTargetRef = useRef<string | null>(null);
  const navLockRef = useRef(false);

  // Reset overlay on route change (safety)
  useEffect(() => {
    if (overlayOn) {
      setOverlayOn(false);
      navLockRef.current = false;
      navTargetRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const normalizePath = (p: string) => {
    try {
      // Strip query/hash and trailing slashes
      const u = new URL(p, typeof window !== "undefined" ? window.location.origin : "http://localhost");
      const clean = u.pathname.replace(/\/+$/g, "") || "/";
      return clean;
    } catch {
      return (p.split("?")[0].split("#")[0] || "/").replace(/\/+$/g, "") || "/";
    }
  };

  const pathFromHref = (href: string) => {
    try {
      const u = new URL(href, typeof window !== "undefined" ? window.location.origin : "http://localhost");
      return u.pathname + u.search + u.hash;
    } catch {
      return href;
    }
  };

  const isInternalPath = (href: string) => href.startsWith("/");
  const isHashLink = (href: string) => href.startsWith("/#") || href.startsWith("#");

  const isSamePath = (href: string) => {
    const to = normalizePath(pathFromHref(href));
    const here = normalizePath(pathname || "/");
    return to === here;
  };

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    // External links: allow default
    if (!isInternalPath(href)) return;

    // Hash links: allow default
    if (isHashLink(href)) return;

    // Same route: do nothing (no overlay, no navigation)
    if (isSamePath(href)) {
      e.preventDefault();
      return;
    }

    // Going home: let Home run its own intro; no overlay here
    if (normalizePath(href) === "/") {
      try { sessionStorage.setItem("homeIntro", "1"); } catch {}
      return; // allow Link to navigate normally
    }

    // Internal, different route → run overlay then push
    e.preventDefault();
    if (navLockRef.current) return;
    navLockRef.current = true;
    navTargetRef.current = href;
    setOverlayOn(true);
  }

  return (
    <>
      {/* Route-cover overlay */}
      <AnimatePresence>
        {overlayOn && (
          <motion.div
            key="route-slide-overlay"
            className="fixed inset-0 z-[999] pointer-events-none"
            style={{ backgroundColor: `var(--accent, ${accent})` }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={OVERLAY_IN}
            onAnimationComplete={() => {
              const href = navTargetRef.current;
              if (!href) return;
              try { sessionStorage.setItem("routeCovered", "1"); } catch {}
              navTargetRef.current = null;
              router.push(href);
              // no need to setOverlayOn(false); next page will mount
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

            {/* Brand → home: let Home play intro. If already on '/', prevent. */}
            <Link
              href="/"
              className="font-semibold tracking-wide hover:underline"
              onClick={(e) => {
                if (isSamePath("/")) {
                  e.preventDefault();
                  return;
                }
                try { sessionStorage.setItem("homeIntro", "1"); } catch {}
              }}
              aria-current={isSamePath("/") ? "page" : undefined}
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
              { name: "Contact", href: "/contact" }, // use full page for consistency
            ].map((item) => {
              const current = isSamePath(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3 py-2 rounded-lg overflow-hidden ${current ? "pointer-events-none opacity-60" : ""}`}
                  onMouseEnter={() => setHoveredNav(item.name)}
                  onMouseLeave={() => setHoveredNav(null)}
                  onClick={(e) => handleNavClick(e, item.href)}
                  aria-current={current ? "page" : undefined}
                >
                  {/* hover fill */}
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    style={{ backgroundColor: accent }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: hoveredNav === item.name && !current ? 1 : 0,
                      opacity: hoveredNav === item.name && !current ? 0.12 : 0,
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                  {/* label */}
                  <motion.span
                    className="relative z-10"
                    animate={{ color: hoveredNav === item.name && !current ? accent : "inherit" }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.name}
                  </motion.span>
                  {/* underline */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: accent }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredNav === item.name && !current ? 1 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                </Link>
              );
            })}
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




