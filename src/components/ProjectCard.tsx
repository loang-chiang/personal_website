// src/components/ProjectCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import * as React from "react";

export type Project = {
  title: string;
  highlight?: string;
  description?: string;
  image: string;
  repo?: string;
  demo?: string;
  status?: "in-progress"; // only status supported
};

export default function ProjectCard({
  project,
  accent,
  className,
}: {
  project: Project;
  accent?: string;
  className?: string;
}) {
  const ACCENT = accent ?? "var(--accent, #888)";
  const primaryLink = project.demo || project.repo;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`group relative ${className ?? ""}`}
    >
      {/* soft glow on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-2 rounded-3xl opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-60"
        style={{
          background: `radial-gradient(220px 220px at 50% 0%, ${ACCENT} 0%, transparent 65%)`,
        } as React.CSSProperties}
      />

      {/* gradient border frame */}
      <div
        className="relative rounded-2xl p-[1px] overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${ACCENT}, transparent 60%)` } as React.CSSProperties}
      >
        <div className="rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-white/40 dark:border-white/10 overflow-hidden">
          {/* image (no shadows/overlays) */}
          <div className="relative w-full aspect-[6/5] overflow-hidden">
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image src={project.image} alt={project.title} fill className="object-cover" />
            </motion.div>

            {/* single status */}
            {project.status === "in-progress" && (
              <span
                className="absolute top-3 left-3 z-10 rounded-md px-2 py-1 text-[11px] font-medium"
                style={{
                  background: "rgba(245,158,11,.95)", // amber
                  color: "#111",
                  border: "1px solid rgba(245,158,11,.6)",
                  backdropFilter: "blur(4px)",
                }}
              >
                In progress
              </span>
            )}

            {/* quick links */}
            {(project.demo || project.repo) && (
              <div className="absolute top-3 right-3 z-10 flex gap-2">
                {project.demo && <Chip href={project.demo} label="Demo" accent={ACCENT} />}
              </div>
            )}
          </div>

          {/* body */}
          <div className="p-4">
            <h3 className="text-base/5 font-semibold">
              {primaryLink ? (
                <Link href={primaryLink} className="relative inline-block">
                  {project.title}
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full"
                    style={{ background: ACCENT as any}}
                  />
                </Link>
              ) : (
                project.title
              )}
            </h3>

            {project.highlight && <i className="mt-1 text-sm opacity-80" style={{ color: ACCENT as any }}>{project.highlight}</i>}
            {project.description && <p className="mt-3 text-[13px] opacity-75">{project.description}</p>}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function Chip({ href, label, accent }: { href: string; label: string; accent: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-lg px-2.5 py-1 text-xs font-medium"
      style={{
        background: accent as any,
        color: "#fff",
        border: `1px solid color-mix(in srgb, ${accent} 40%, transparent)`,
      } as React.CSSProperties}
      initial={{ opacity: 0, y: -4 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onClick={(e) => e.stopPropagation()}
    >
      {label}
    </motion.a>
  );
}

