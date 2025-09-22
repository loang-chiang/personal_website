"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

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
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{
        scale: 1.15,
        boxShadow: `0 0 12px ${color}, 0 0 24px ${color}`,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    />
  );
}

export default function Header({ accent, palette, setPalette, palettes }: HeaderProps) {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.0, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b"
      style={{
        backgroundColor: "var(--header-bg, white)",
        borderColor: "var(--header-border, #ddd)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <CircleMark color={accent} size={32} />

          <Link href="/" className="font-semibold tracking-wide hover:underline">
            <motion.span
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              Loang Chiang :)
            </motion.span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {[
            { name: "Projects", href: "/projects"},
            { name: "About", href: "/about"},
            { name: "Contact", href: "/#contact"}
          ].map((item) => (
            <motion.a
              key={item.name}
              href={item.href}
              className="relative px-3 py-2 rounded-lg overflow-hidden"
              onHoverStart={() => setHoveredNav(item.name)}
              onHoverEnd={() => setHoveredNav(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Background animation */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                style={{ backgroundColor: accent }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: hoveredNav === item.name ? 1 : 0,
                  opacity: hoveredNav === item.name ? 0.1 : 0
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
              
              {/* Text content */}
              <motion.span
                className="relative z-10 flex items-center gap-1"
                animate={{
                  color: hoveredNav === item.name ? accent : "inherit"
                }}
                transition={{ duration: 0.2 }}
              >
                <motion.span
                  animate={{
                    rotate: hoveredNav === item.name ? [0, -10, 10, 0] : 0,
                    scale: hoveredNav === item.name ? 1.2 : 1
                  }}
                  transition={{ 
                    duration: 0.4,
                    ease: "easeInOut"
                  }}
                >
                  {item.emoji}
                </motion.span>
                {item.name}
              </motion.span>

              {/* Underline effect */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ backgroundColor: accent }}
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: hoveredNav === item.name ? 1 : 0
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </motion.a>
          ))}
        </nav>

        {/* Enhanced palette selector */}
        <motion.select
          value={palette}
          onChange={(e) => setPalette(e.target.value)}
          className="rounded-xl border px-3 py-1 text-sm transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileFocus={{ scale: 1.05 }}
          style={{
            borderColor: accent,
            '--accent-color': accent
          } as any}
          onFocus={(e) => {
            e.target.style.borderColor = accent;
            e.target.style.boxShadow = `0 0 0 2px ${accent}20`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--header-border, #ddd)';
            e.target.style.boxShadow = 'none';
          }}
        >
          {palettes.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </motion.select>
      </div>
    </motion.header>
  );
}