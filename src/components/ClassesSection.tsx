"use client";

import { motion } from "framer-motion";

export type Course = { code: string; name: string; tag?: string };
export type TermGroup = { term: string; courses: Course[] };

export default function ClassesSection({
  groups,
  accent,
  cardClass,
  cardBorderClass,
}: {
  groups: TermGroup[];
  accent: string;
  cardClass: string;       // p.card
  cardBorderClass: string; // p.cardBorder
}) {
  return (
    <section className="mt-16">
      <div className="grid gap-8 md:grid-cols-2">
        {groups.map((g, i) => (
          <motion.article
            key={g.term}
            className={`rounded-3xl border p-6 ${cardClass} ${cardBorderClass}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.06 }}
            style={{ borderColor: `${accent}22` }}
          >
            <h3 className="text-lg font-semibold">{g.term}</h3>
            <ul className="mt-4 grid gap-2">
              {g.courses.map((c) => (
                <motion.li
                  key={`${g.term}-${c.code}`}
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-3 rounded-xl border px-3 py-2 bg-white/60 backdrop-blur-sm"
                  style={{ borderColor: `${accent}26` }}
                >
                  <span
                    className="mt-0.5 inline-flex shrink-0 select-none rounded-md px-2 py-0.5 text-xs font-semibold"
                    style={{ color: accent, border: `1px solid ${accent}44` }}
                  >
                    {c.code}
                  </span>
                  <div className="leading-snug">
                    <div className="font-medium">{c.name}</div>
                    {c.tag && <div className="text-xs opacity-70">{c.tag}</div>}
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
