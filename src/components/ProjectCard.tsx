"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";

export type Project = {
  title: string;
  description: string;
  href?: string;        // external link
  repo?: string;        // github link
  image?: string;       // /public/* path
  highlight?: string;   // 1-liner achievement
};

export default function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className="group relative overflow-hidden rounded-2xl border bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
      style={{ borderColor: "var(--card-border, #e5e7eb)" }}
    >
      {/* Cover */}
      <div className="relative h-44 w-full overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(135deg, var(--accent,#D95F59) 0%, rgba(0,0,0,0.08) 100%)",
            }}
          />
        )}

        {/* soft top gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-black/0 to-black/5" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold leading-tight">{project.title}</h3>
          {project.period && (
            <span className="shrink-0 rounded-full bg-[color:var(--accent,#D95F59)]/10 px-2 py-0.5 text-[11px] font-medium text-[color:var(--accent,#D95F59)]">
              {project.period}
            </span>
          )}
        </div>

        {project.highlight && (
          <p className="mt-1 text-[13px] text-emerald-700/90 dark:text-emerald-600">
            {project.highlight}
          </p>
        )}

        <p className="mt-2 text-sm opacity-80 line-clamp-3">
          {project.description}
        </p>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-3">
          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium underline"
              style={{ color: "var(--accent,#D95F59)" }}
            >
              View →
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium underline"
              style={{ color: "var(--accent,#D95F59)" }}
            >
              GitHub
            </a>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            className="ml-auto text-sm font-medium"
            style={{ color: "var(--accent,#D95F59)" }}
          >
            {open ? "Less" : "More"}
          </button>
        </div>

        {/* Expandable details */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="more"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-3 border-t pt-3 text-sm opacity-80"
              style={{ borderColor: "var(--card-border, #eee)" }}
            >
              <ul className="list-disc pl-5 leading-relaxed">
                <li>Tech stack highlights and key challenges solved.</li>
                <li>Impact/metrics if applicable.</li>
                <li>What you’d like to improve or ship next.</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* subtle glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: "inset 0 0 0 1px var(--accent,#D95F59)",
          borderRadius: 16,
        }}
      />
    </motion.article>
  );
}