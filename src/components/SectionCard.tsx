"use client";

import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

type Props = {
  title?: string;
  children: ReactNode;
  delay?: number;
  accent: string;
  cardClass: string;       // e.g. p.card
  cardBorderClass: string; // e.g. p.cardBorder
  className?: string;
  /** Optional inline style (use for palette-specific surface tints) */
  style?: CSSProperties;
};

// tiny classnames helper (no deps)
function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function SectionCard({
  title,
  children,
  delay = 0,
  accent,
  cardClass,
  cardBorderClass,
  className,
  style,
}: Props) {
  return (
    <motion.article
      className={cx("rounded-3xl border p-6", cardClass, cardBorderClass, className)}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      style={{
        borderColor: `${accent}22`,
        ...style,
      }}
    >
      {title && <h2 className="text-xl font-semibold">{title}</h2>}
      {children}
    </motion.article>
  );
}

