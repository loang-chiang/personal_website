"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Header from "@/components/Header";
import { usePalette } from "@/components/PaletteProvider";

import SectionCard from "@/components/SectionCard";
import Timeline, { TimelineItem } from "@/components/Timeline";
import ChipList from "@/components/ChipList";
import CoursesSection, { Course } from "@/components/CoursesSection";
import Footer from "@/components/Footer";

export default function AboutView() {
  const { palette, setPalette, p, palettes } = usePalette();
  const colors = p.colors;

  // Vintage tints
  const isVintage = palette === "Vintage";
  const cardTint = isVintage
    ? { background: `linear-gradient(180deg, ${p.accent}14 0%, ${p.accent}0D 100%)` }
    : undefined;
  const innerSurface = isVintage ? `color-mix(in srgb, ${p.accent} 7%, white)` : undefined;

  const [slideOverlay, setSlideOverlay] = useState(true);
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

  // New flat courses list (no terms)
  const courses: Course[] = [
    { code: "CSCI 0190", name: "Accelerated Intro to CS", category: "CS" },
    { code: "DATA 0150", name: "Data Science Princples", category: "CS" },
    { code: "MATH 0190", name: "Calculus II", category: "Math" },
    { code: "LING 0100", name: "Intro to Linguistics", category: "CogSci" },
    { code: "APMA1650", name: "Statistical Inference", category: "Math" },
    { code: "CSCI0410", name: "Intro to AI", category: "CS" },
    { code: "CSCI0300", name: "Fundamentals of Computer Systems", category: "CS" },
    { code: "MATH0540", name: "Linear Algebra with Theory", category: "Math" },
    { code: "CSCI1302", name: "Sociotechnical Systems and HCI", category: "CS" },
    { code: "CSCI0500", name: "Data Structures and Algorithms", category: "CS" },
    { code: "CPSY0800", name: "Language and the Mind", category: "CogSci" },
    { code: "ENGN0090", name: "Management of Industrial Organizations", category: "Other" },
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
              <div
                className="relative w-[240px] aspect-[3/4] overflow-hidden rounded-2xl border shadow justify-self-center md:justify-self-end"
                style={{ borderColor: p.accent }}
              >
                <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH}/me.jpg`} alt="Photo of Loang" fill className="object-cover" priority />
              </div>

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
                    Loang Chiang
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

          {/* Experience + Highlights */}
          <section className="mt-16 grid gap-8 lg:grid-cols-12">
            <SectionCard
              title="Experience"
              accent={p.accent}
              cardClass={p.card}
              cardBorderClass={p.cardBorder}
              className="lg:col-span-8"
              style={cardTint}
            >
              <Timeline items={exp} accent={p.accent} surface={innerSurface} />
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

          {/* Courses (no dates, color-coded by category) */}
          <div className="mt-8 mb-12">
            <CoursesSection
                title="Courses"
                courses={courses}
                accent={p.accent}
                cardClass={p.card}
                cardBorderClass={p.cardBorder}
                paletteColors={p.colors}
                style={cardTint}
                innerSurface={innerSurface}
                cols={2}
            />
          </div>

        </motion.main>

        <Footer></Footer>
      </div>
    </>
  );
}