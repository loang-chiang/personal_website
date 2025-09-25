"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Header from "@/components/Header";
import { usePalette } from "@/components/PaletteProvider";

import SectionCard from "@/components/SectionCard";
import Timeline, { TimelineItem } from "@/components/Timeline";
import ChipList from "@/components/ChipList";
import ClassesSection, { TermGroup } from "@/components/ClassesSection";

export default function AboutPage() {
  const { palette, setPalette, p, palettes } = usePalette();
  const colors = p.colors;

  // 👇 ADD THESE (they depend on palette and p.accent)
  const isVintage = palette === "Vintage";
  // soft tint for the outer card surface
  const cardTint = isVintage
    ? { background: `linear-gradient(180deg, ${p.accent}14 0%, ${p.accent}0D 100%)` } // ~8–5% accent
    : undefined;
  // inner item surface (timeline item cards, etc.)
  const innerSurface = isVintage
    ? `color-mix(in srgb, ${p.accent} 7%, white)` // gentle, warm surface
    : undefined;

  const [slideOverlay, setSlideOverlay] = useState(true);

  // slide-up reveal on mount
  useEffect(() => {
    const t = setTimeout(() => setSlideOverlay(false), 600);
    return () => clearTimeout(t);
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.3, ease: "easeIn" } },
  };

  // ----- data -----
  const exp: TimelineItem[] = [
    {
      title: "Strategy & Analytics Intern — BCP",
      sub: "Cybersecurity Governance",
      period: "Summer 2025",
      bullets: [
        "Joined the Summer Trainees program at Peru’s largest bank on the Cybersecurity Governance team.",
        "Designed and shipped a Power BI maturity dashboard used by 40+ executives and specialists.",
        "Built Python jobs to map evidence across NIST/CIS/ISO controls and unify reporting.",
        "Automated Excel-to-cloud workflows with Power Automate, cutting turnaround time.",
      ],
    },
    {
      title: "Sin-cere Consulting & Multiservices",
      sub: "Product Design & Development Intern",
      period: "Fall 2025",
      bullets: [
        "Built a mobile-first intake/onboarding prototype to digitize client intake across RI.",
        "Partnered with program staff to add sign-ups, scheduling, and notifications.",
        "Ran usability tests with entrepreneurs; iterated flows to improve accessibility and completion.",
      ],
    },
    {
      title: "Providence Public Library",
      sub: "Data Analytics Intern",
      period: "Spring 2025",
      bullets: [
        "Collaborated with PPL and Brown’s CEDEC on fundraising analytics and planning.",
        "Analyzed donor and membership trends to surface high-potential segments.",
        "Delivered Python visualizations and briefed leadership; insights informed strategy.",
      ],
    },
    {
      title: "Brown Human-Computer Interaction Lab",
      sub: "Undergraduate Research Assistant",
      period: "Fall 2025",
      bullets: [
        "Built Python pipelines for Sochiatrist, an app to process social-messaging datasets.",
        "Created Plotly dashboards to reveal behavioral patterns for researchers.",
        "Translated findings into recommendations for studies and mental-health tech.",
      ],
    },
    {
      title: "Brown University Department of Computer Science",
      sub: "Undergraduate Teaching Assistant — CS300: Intro to Computer Systems",
      period: "Fall 2025",
      bullets: [
        "TA for the first Fall offering of Brown’s largest systems course!",
        "Led weekly sections of 30+; clarified pointers, memory, and processes with examples.",
        "Provided targeted debugging support during office hours to build confidence.",
      ],
    },
  ];

  const highlights = [
    "Carpool UP — Product Strategy & Frontend Design Lead",
    "Brown Space Engineering — Software Dev & PM Associate",
    "Brown Women in Computer Science — Co-Development Lead",
    "Anime Video Game Ensemble — Logistics Lead",
    "FullStack @ Brown — Software Engineer",
    "IgniteCS Artemis Project — Programming Tutor",
    "Meiklejohn Peer Advisor",
    "Bonner Community Fellow Class of '28",
  ];

  const classes: TermGroup[] = [
    {
      term: "Fall 2024",
      courses: [
        { code: "CSCI 0320", name: "Software Engineering", tag: "Projects, team" },
        { code: "COGS 0110", name: "Cognitive Neuroscience", tag: "Cortex & systems" },
      ],
    },
    {
      term: "Spring 2025",
      courses: [
        { code: "CSCI 0330", name: "Intro to Computer Systems", tag: "C, memory, OS" },
        { code: "DATA 0200", name: "Data Fluency", tag: "Stats, viz" },
      ],
    },
  ];

  return (
    <>
      {/* Slide overlay on mount */}
      <AnimatePresence>
        {slideOverlay && (
          <motion.div
            key="slide-overlay-about"
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-50 pointer-events-none"
            style={{ backgroundColor: "var(--accent)" }}
            onAnimationComplete={() => setSlideOverlay(false)}
          />
        )}
      </AnimatePresence>

      <div className={`${p.bg} ${p.text} min-h-screen antialiased`}>
        <Header
          accent={p.accent}
          palette={palette}
          setPalette={(name) => setPalette(name as any)}
          palettes={palettes}
        />

        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="mx-auto max-w-6xl px-6 py-12"
        >
          {/* Hero */}
          <section className="px-2">
            <div className="mx-auto grid items-center gap-10 max-w-4xl md:grid-cols-[240px_1fr]">
              {/* Left: Photo */}
              <div
                className="relative w-[240px] aspect-[3/4] overflow-hidden rounded-2xl border shadow justify-self-center md:justify-self-end"
                style={{ borderColor: p.accent }}
              >
                <Image src="/me.jpg" alt="Photo of Loang" fill className="object-cover" priority />
              </div>

              {/* Right: Bio */}
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
                  I'm a second-year student at Brown University studying Computer Science and Cognitive Science with a passion for creating
                  technology that connects people and helps solve real problems!
                </p>
                <p className="mt-4 opacity-80">
                  My interests span product, engineering, and human-computer interaction—where I get to blend technical skills with creativity and design.
                  I’m excited to collaborate, learn from others, and build products that make an impact!
                </p>
                <ul className="mt-5 grid gap-2 text-sm">
                  <li>• <b>Programming:</b> Python, JavaScript (React), SQL, C/C++</li>
                  <li>• <b>Tools:</b> Power BI, Tableau, Power Automate, Excel, Git, Figma, Trello/Jira</li>
                  <li>• <b>Languages:</b> English & Spanish (Bilingual)</li>
                  <li>• <b>Interests:</b> Literature, choir, theater, productivity tools</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Experience + Highlights (rebalanced) */}
          <section className="mt-16 grid gap-8 lg:grid-cols-12">
            <SectionCard
              title="Experience"
              accent={p.accent}
              cardClass={p.card}
              cardBorderClass={p.cardBorder}
              className="lg:col-span-8"
              style={cardTint} // ← soft tinted surface for Vintage
            >
              <Timeline items={exp} accent={p.accent} surface={innerSurface} /> {/* ← tinted item cards */}
            </SectionCard>

            <SectionCard
                title="Highlights"
                accent={p.accent}
                cardClass={p.card}
                cardBorderClass={p.cardBorder}
                className="lg:col-span-4 lg:sticky lg:top-24"
                style={cardTint}
            >
                <ChipList items={highlights} accent={p.accent} size="md" columns={1} />
            </SectionCard>
          </section>

          {/* Classes */}
          <ClassesSection
            groups={classes}
            accent={p.accent}
            cardClass={p.card}
            cardBorderClass={p.cardBorder}
          />

          {/* Contact */}
          <section id="contact" className="mt-16">
            <SectionCard
              title="Contact"
              accent={p.accent}
              cardClass={p.card}
              cardBorderClass={p.cardBorder}
              delay={0.1}
            >
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a
                  className="rounded-xl px-4 py-2 text-sm font-medium text-white shadow-md"
                  style={{ background: p.accent }}
                  href="mailto:you@domain.com"
                >
                  Email me
                </a>
                <button
                  onClick={() => {
                    const email = "you@domain.com";
                    if (navigator?.clipboard) navigator.clipboard.writeText(email);
                    const el = document.getElementById("copy-email-chip");
                    el?.animate(
                      [{ boxShadow: `0 0 0 0 ${p.accent}44` }, { boxShadow: `0 0 0 8px ${p.accent}00` }],
                      { duration: 520, easing: "ease-out" }
                    );
                  }}
                  id="copy-email-chip"
                  className="rounded-xl border px-4 py-2 text-sm"
                  style={{ borderColor: p.accent, color: p.accent }}
                >
                  Copy email
                </button>
                <a
                  href="#"
                  className="rounded-xl border px-4 py-2 text-sm transition-transform hover:-translate-y-0.5"
                  style={{ borderColor: `${p.accent}33` }}
                >
                  GitHub
                </a>
                <a
                  href="#"
                  className="rounded-xl border px-4 py-2 text-sm transition-transform hover:-translate-y-0.5"
                  style={{ borderColor: `${p.accent}33` }}
                >
                  LinkedIn
                </a>
              </div>
            </SectionCard>
          </section>
        </motion.main>
      </div>
    </>
  );
}