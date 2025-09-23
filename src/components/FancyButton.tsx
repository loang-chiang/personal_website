"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

type FancyButtonProps = {
    href?: string;
    children: React.ReactNode;
    variant?: "solid" | "outline";
    accent: string;
    onClick?: () => void;
};

function ButtonInner({
  children,
  variant,
  accent,
}: {
  children: React.ReactNode;
  variant: "solid" | "outline";
  accent: string;
}) {
  const base =
    "relative inline-flex items-center justify-center rounded-xl px-5 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 overflow-hidden";
  const solid = "text-white";
  const outline = "border";

  return (
    <motion.span
      className={`${base} ${variant === "solid" ? solid : outline}`}
      style={{
        backgroundColor: variant === "solid" ? accent : "transparent",
        borderColor: variant === "outline" ? accent : "transparent",
        color: variant === "outline" ? accent : "#ffffff",
        display: "inline-flex",
      }}
      initial={false}
      whileHover={{
        y: -2,
        scale: 1.03,
        boxShadow:
          variant === "solid"
            ? `0 10px 22px -10px ${accent}66`
            : `0 10px 18px -12px ${accent}4d`,
        backgroundColor: accent,
        color: "#ffffff",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      {/* sheen */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        style={{
          background:
            "linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.14) 48%, transparent 62%)",
        }}
      />
      {/* sliding highlight */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-y-3 -left-1/3 w-1/2 rounded-full"
        initial={{ x: "-80%", opacity: 0 }}
        whileHover={{ x: "160%", opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
          filter: "blur(6px)",
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.span>
  );
}

export default function FancyButton({
  href,
  children,
  variant = "solid",
  accent,
  onClick,
}: FancyButtonProps) {
  const isInternal = typeof href === "string" && href.startsWith("/");

  if (isInternal) {
    return (
      <Link href={href}>
        <ButtonInner variant={variant} accent={accent}>
          {children}
        </ButtonInner>
      </Link>
    );
  }

  if (href) {
    // External links
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        <ButtonInner variant={variant} accent={accent}>
          {children}
        </ButtonInner>
      </a>
    );
  }

  // If no href is provided, render a button
  return (
    <button type="button" onClick={onClick}>
      <ButtonInner variant={variant} accent={accent}>
        {children}
      </ButtonInner>
    </button>
  );
}
