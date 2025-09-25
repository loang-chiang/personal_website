"use client";

import { motion } from "framer-motion";

// tiny class combiner
const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");

type Size = "sm" | "md" | "lg";

export default function ChipList({
  items,
  accent,
  size = "lg", // ← default bigger
  columns = 2, // 1–3 recommended
}: {
  items: string[];
  accent: string;
  size?: Size;
  columns?: 1 | 2 | 3;
}) {
  const border = `${accent}33`;
  const glow = `${accent}35`;

  // size scales
  const wrap = {
    sm: {
      li: "rounded-2xl px-3 py-2",
      text: "text-sm leading-snug",
      dot: "h-2.5 w-2.5",
      gap: "gap-3",
      minH: "min-h-[40px]",
    },
    md: {
      li: "rounded-2xl px-4 py-3",
      text: "text-[15px] leading-snug",
      dot: "h-3 w-3",
      gap: "gap-3.5",
      minH: "min-h-[48px]",
    },
    lg: {
      li: "rounded-3xl px-5 py-4",
      text: "text-base leading-tight", // bigger text
      dot: "h-3.5 w-3.5",
      gap: "gap-4",
      minH: "min-h-[56px]", // taller pill
    },
  }[size];

  // responsive columns
  const gridCols =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : "sm:grid-cols-2";

  return (
    <ul className={cx("mt-4 grid gap-4", gridCols)}>
      {items.map((label) => (
        <motion.li key={label} whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.995 }}>
          <div
            className={cx("flex w-full items-center", wrap.gap, wrap.li, wrap.minH)}
            style={{
              border: `1px solid ${border}`,
              background: `linear-gradient(180deg, ${accent}12 0%, ${accent}08 100%)`,
              boxShadow: `0 8px 20px -10px ${glow}`,
            }}
          >
            {/* leading glow dot */}
            <span
              className={cx("rounded-full shrink-0", wrap.dot)}
              style={{ background: accent, boxShadow: `0 0 12px ${accent}66` }}
              aria-hidden
            />
            {/* text (no clamp so it can breathe) */}
            <span className={cx("flex-1", wrap.text)}>{label}</span>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}


