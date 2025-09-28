"use client";

import React from "react";
import SectionCard from "@/components/SectionCard";

export type Course = {
  code: string;
  name: string;
  category: string; // "CS" | "Math" | "Other" | etc.
};

type CoursesSectionProps = {
  title?: string;
  courses: Course[];
  accent: string;
  cardClass: string;
  cardBorderClass: string;
  style?: React.CSSProperties;
  innerSurface?: string;
  paletteColors?: string[];
  cols?: 1 | 2 | 3;            // 👈 new
};

export default function CoursesSection({
  title = "Courses",
  courses,
  accent,
  cardClass,
  cardBorderClass,
  style,
  innerSurface,
  paletteColors,
  cols = 3,                     // default to 3-col on large screens
}: CoursesSectionProps) {
  const base = (paletteColors && paletteColors.length) ? paletteColors : [accent];
  const CS_COLOR    = base[0];
  const MATH_COLOR  = base[1] ?? base[0];
  const OTHER_COLOR = base[2] ?? base[1] ?? base[0];

  const norm = (s: string) => s.trim().toLowerCase();
  const labelFor = (cat: string) => {
    const c = norm(cat);
    if (c === "cs" || c === "computer science") return "CS";
    if (c === "math" || c === "mathematics")    return "Math";
    return "Other";
  };
  const colorFor = (cat: string) => {
    const l = labelFor(cat);
    if (l === "CS") return CS_COLOR;
    if (l === "Math") return MATH_COLOR;
    return OTHER_COLOR;
  };

  const sorted = [...courses].sort((a, b) => {
    const la = labelFor(a.category), lb = labelFor(b.category);
    if (la !== lb) return ["CS", "Math", "Other"].indexOf(la) - ["CS", "Math", "Other"].indexOf(lb);
    return a.code.localeCompare(b.code);
  });

  const present = Array.from(new Set(sorted.map(c => labelFor(c.category))));
  const legendOrder = ["CS", "Math", "Other"].filter(x => present.includes(x));
  const legendColor: Record<string, string> = { CS: CS_COLOR, Math: MATH_COLOR, Other: OTHER_COLOR };

  const gridCols =
    cols === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
  : cols === 2 ? "grid-cols-1 md:grid-cols-2"
  :              "grid-cols-1";

  return (
    <SectionCard
      title={title}
      accent={accent}
      cardClass={cardClass}
      cardBorderClass={cardBorderClass}
      style={style}
    >
      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-2 text-xs mt-3 opacity-80">
        {legendOrder.map((k) => {
          const color = legendColor[k];
          return (
            <span
              key={k}
              className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1"
              style={{
                borderColor: color,
                backgroundColor: `${color}12`,
                color,
              }}
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
              {k}
            </span>
          );
        })}
      </div>

      {/* Courses grid */}
      <ul className={`grid gap-2.5 ${gridCols}`}>
        {sorted.map((c) => {
          const color = colorFor(c.category);
          return (
            <li key={`${c.code}-${c.name}`}>
              <div
                className="flex items-center justify-between rounded-2xl border px-3 py-2"
                style={{
                  borderColor: `${color}66`,
                  backgroundColor: innerSurface ?? "white",
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="inline-block h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="truncate">
                    <span className="font-semibold">{c.code}</span>
                    <span className="opacity-70"> — {c.name}</span>
                  </span>
                </div>
                <span
                  className="ml-3 shrink-0 rounded-full border px-2 py-0.5 text-[11px] leading-5"
                  style={{
                    borderColor: color,
                    color,
                    backgroundColor: `${color}10`,
                  }}
                >
                  {labelFor(c.category)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}
