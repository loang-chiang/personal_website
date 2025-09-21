"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type HeaderProps = {
  accent: string;
  palette: string;
  setPalette: (p: string) => void;
  palettes: string[];
};

export default function Header({ accent, palette, setPalette, palettes }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.0, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b"
      style={{
        backgroundColor: "var(--header-bg, white)", // fallback
        borderColor: "var(--header-border, #ddd)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="h-8 w-8 rounded-full"
            style={{ background: accent }}
          />
          <Link href="/" className="font-semibold tracking-wide hover:underline">
            Loang Chiang :)
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="/projects" className="hover:underline">Projects</a>
          <a href="/about" className="hover:underline">About</a>
          <a href="/#contact" className="hover:underline">Contact</a>
        </nav>

        <select
          value={palette}
          onChange={(e) => setPalette(e.target.value)}
          className="rounded-xl border px-3 py-1 text-sm"
        >
          {palettes.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </div>
    </motion.header>
  );
}