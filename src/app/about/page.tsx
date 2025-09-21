"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/Header";

// ---- palettes (same shape as home) ----
const PALETTES = {
  VintagePop: {
    bg: "bg-[#FFF8F1]",
    text: "text-[#2B1D0E]",
    accent: "#D95F59",
    accentSoft: "#F4D06F",
    card: "bg-white",
    cardBorder: "border-[#EBDDC6]",
    colors: ["#D95F59", "#F4D06F", "#3AAFA9", "#7E6B8F", "#2D728F"],
  },
  Retro: {
    bg: "bg-[#FCEFEA]",
    text: "text-[#2E1E32]",
    accent: "#7D5BA6",
    accentSoft: "#FEC3A6",
    card: "bg-[#FFF8E7]",
    cardBorder: "border-[#E8D5B7]",
    colors: ["#7D5BA6", "#FEC3A6", "#FF8C42", "#4E937A"],
  },
  PastelPop: {
    bg: "bg-[#FFF1F2]",
    text: "text-[#2B1C1C]",
    accent: "#EF476F",
    accentSoft: "#FFD166",
    card: "bg-[#E6F2FF]",
    cardBorder: "border-[#BBD6FF]",
    colors: ["#EF476F", "#FFD166", "#06D6A0", "#118AB2"],
  },
} as const;
type PaletteKey = keyof typeof PALETTES;

export default function AboutPage() {
  const [palette, setPalette] = useState<PaletteKey>("VintagePop");
  const p = PALETTES[palette];
  const colors = p.colors;

  const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <div className={`${p.bg} ${p.text} min-h-screen antialiased`}>
      {/* Header */}
      <Header
        accent={p.accent}
        palette={palette}
        setPalette={setPalette}
        palettes={Object.keys(PALETTES)}
      />

      {/* Main */}
      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="mx-auto max-w-6xl px-6 py-12"
      >
        {/* Side-by-side: Picture + Bio (centered block) */}
        <section className="px-2">
            <div className="mx-auto grid items-center gap-10 max-w-4xl md:grid-cols-[240px_1fr]">
                {/* Picture left (fixed width) */}
                <div
                className="relative w-[240px] aspect-[3/4] overflow-hidden rounded-2xl border shadow justify-self-center md:justify-self-end"
                style={{ borderColor: p.accent }}
                >
                <Image
                    src="/me.jpg"                // put your photo in /public/me.jpg
                    alt="Photo of Loang"
                    fill
                    className="object-cover"
                    priority
                />
                </div>

                {/* Bio right */}
                <div className="text-center md:text-left md:max-w-[560px] justify-self-center md:justify-self-start">
                <span
                    className="inline-block rounded-full border px-3 py-1 text-xs mb-3"
                    style={{ borderColor: p.accent, color: p.accent }}
                >
                    About me
                </span>
                <h1 className="text-4xl font-extrabold">
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
                <p className="mt-4 opacity-80">
                    Product-minded engineer who loves mixing <strong>systems</strong> thinking
                    with <strong>delightful UI</strong>. I’ve shipped React/Next.js apps, built
                    OS internals (WeensyOS), and did strategy & analytics in cybersecurity
                    governance at a bank.
                </p>
                <ul className="mt-5 grid grid-cols-2 gap-2 text-sm">
                    <li>• React / Next.js</li>
                    <li>• Tailwind CSS</li>
                    <li>• Python / FastAPI</li>
                    <li>• C / OS internals</li>
                    <li>• Figma / PM</li>
                    <li>• Power BI</li>
                </ul>
                </div>
            </div>
        </section>

        {/* Experience + Highlights */}
        <section className="mt-16 grid gap-8 md:grid-cols-2">
          <article className={`rounded-3xl border ${p.card} ${p.cardBorder} p-6`}>
            <h2 className="text-xl font-semibold">Experience</h2>
            <div className="mt-3 space-y-4">
              <div className="rounded-2xl border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Strategy & Analytics Intern — BCP</h3>
                  <span className="text-xs opacity-60">Summer 2025</span>
                </div>
                <p className="text-sm opacity-80">Cybersecurity Governance</p>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  <li>Built Power BI dashboard for framework maturity</li>
                  <li>Python tools to map evidence across standards</li>
                  <li>Automated workflows with Power Automate</li>
                </ul>
              </div>
            </div>
          </article>

          <article className={`rounded-3xl border ${p.card} ${p.cardBorder} p-6`}>
            <h2 className="text-xl font-semibold">Highlights</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="rounded-xl border px-3 py-2">Brown Space Engineering — Ops & Ivy Space Conf</li>
              <li className="rounded-xl border px-3 py-2">Women in CS — Co-Development Lead</li>
              <li className="rounded-xl border px-3 py-2">Arcademia — React + FastAPI game</li>
            </ul>
          </article>
        </section>

        {/* Contact */}
        <section id="contact" className="mt-16">
          <article className={`rounded-3xl border ${p.card} ${p.cardBorder} p-6`}>
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="mt-2">
              <a className="underline" style={{ color: p.accent }} href="mailto:you@domain.com">
                you@domain.com
              </a>
            </p>
          </article>
        </section>
      </motion.main>
    </div>
  );
}