"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export type TimelineItem = {
  title: string;
  sub?: string;
  period?: string;
  bullets?: string[];
  logoSrc?: string;
  logoAlt?: string;
};

export default function Timeline({
  items,
  accent,
  /** optional tinted background for the inner cards */
  surface,
}: {
  items: TimelineItem[];
  accent: string;
  surface?: string;
}) {
  return (
    <div className="relative overflow-hidden">
      <span
        aria-hidden
        className="absolute left-10 top-4 bottom-2"
        style={{
          width: 2,
          background: `linear-gradient(180deg, ${accent}00 0%, ${accent}55 40%, ${accent}00 100%)`,
        }}
      />
      <ul className="mt-4 space-y-5">
        {items.map((it) => (
          <li key={it.title} className="relative pl-20">
            {it.logoSrc ? (
              <span
                className="absolute left-6 top-1.5 h-10 w-10 rounded-full overflow-hidden border bg-white"
                style={{ borderColor: `${accent}22`, boxShadow: `0 0 0 2px ${accent}10` }}
              >
                <Image src={it.logoSrc} alt={it.logoAlt ?? ""} width={40} height={40} className="object-contain" />
              </span>
            ) : (
              <span
                className="absolute left-8 top-2 h-3.5 w-3.5 rounded-full"
                style={{ background: accent, boxShadow: `0 0 0 3px ${accent}22, 0 0 18px ${accent}66` }}
              />
            )}

            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-2xl border p-4 backdrop-blur-sm"
              style={{
                borderColor: `${accent}33`,
                background: surface ?? "rgba(255,255,255,0.6)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{it.title}</h3>
                  {it.sub && <p className="text-sm opacity-80">{it.sub}</p>}
                </div>
                {it.period && <span className="text-xs opacity-60 whitespace-nowrap">{it.period}</span>}
              </div>

              {!!it.bullets?.length && (
                <ul className="mt-3 grid gap-1.5 text-sm">
                  {it.bullets.map((b) => (
                    <motion.li
                      key={b}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -6 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden style={{ color: accent }} className="mt-[2px] shrink-0">
                        <path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      <span>{b}</span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          </li>
        ))}
      </ul>
    </div>
  );
}
