"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import FancyButton from "@/components/FancyButton";
import ProjectCard, { Project } from "@/components/ProjectCard";
import { usePalette } from "@/components/PaletteProvider";

export default function ProjectsView() {
  const { palette, setPalette, p, palettes } = usePalette();
  const [slideOverlay, setSlideOverlay] = useState(true);
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    // After overlay slides up initially, mark animation done.
    const timer = setTimeout(() => {
      setSlideOverlay(false);
      setIsInitial(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // expose CSS var so cards can read --accent if they want
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", p.accent);
  }, [p.accent]);

  // your projects (sample)
  const projects: Project[] = [
    {
      title: "Arcademia",
      highlight: "Real-time quiz play from uploaded notes",
      description:
        "A note-driven quiz platform for friends/classes. React/Next.js frontend with websockets, FastAPI backend.",
      repo: "https://github.com/yourname/arcademia",
      image: "/projects/arcademia.jpg",
    },
    {
      title: "Cybersecurity Maturity Dashboard",
      highlight: "Exec dashboard for CSF/CIS control tracking",
      description:
        "Power BI + Python automations to visualize maturity and map evidence across standards.",
      image: "/projects/cyber-dashboard.jpg",
    },
    {
      title: "WeensyOS Enhancements",
      highlight: "Ref-counted pages & safer fork/exit flow",
      description:
        "Memory mgmt and kernel bug fixes: kalloc/kfree, fork/exit, shared page refcounts.",
      image: "/projects/weensyos.jpg",
    },
  ];

  return (
    <>
        <AnimatePresence>
            {slideOverlay && (
                <motion.div
                key={`slide-overlay-${/* optional: */ Date.now()}`} // or key={palette} if you want
                initial={{ y: 0 }}
                animate={{ y: "-100%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="fixed inset-0 z-50"
                style={{ backgroundColor: "var(--accent)" }}  // ← use CSS var, no more flash
                />
            )}
        </AnimatePresence>

      <div className={`${p.bg} ${p.text} min-h-screen flex flex-col antialiased`}>
            <Header
                accent={p.accent}
                palette={palette}
                setPalette={(name) => setPalette(name as any)}
                palettes={palettes}
            />

            <main className="flex-grow">
                <section className="mx-auto max-w-6xl px-6 py-16">
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-4xl font-bold"
                >
                    Projects
                </motion.h1>

                {/* Grid only */}
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((proj) => (
                    <ProjectCard key={proj.title} project={proj} />
                    ))}
                </div>

                <div className="mt-12">
                    <FancyButton href="/" variant="outline" accent={p.accent}>
                    ← Back Home
                    </FancyButton>
                </div>
                </section>
            </main>

            {/* Footer */}
            <footer
                className="border-t border-white/20"
                style={{
                backgroundColor: "var(--header-bg, white)",
                borderColor: "var(--header-border, #ddd)",
                }}
            >
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm opacity-70">
                <p>© {new Date().getFullYear()} Loang Chiang. Built with React + Tailwind.</p>
                <div className="flex items-center gap-4">
                    <a
                        href="#"
                        className="relative transition-all duration-200 hover:opacity-100 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current hover:after:w-full after:transition-all after:duration-300"
                        style={{ color: p.accent }}
                    >
                        GitHub
                    </a>
                    <a
                        href="#"
                        className="relative transition-all duration-200 hover:opacity-100 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current hover:after:w-full after:transition-all after:duration-300"
                        style={{ color: p.accent }}
                    >
                        LinkedIn
                    </a>
                </div>
                </div>
            </footer>
        </div>
    </>
  );
}
