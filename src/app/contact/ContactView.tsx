"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { usePalette } from "@/components/PaletteProvider";
import Footer from "@/components/Footer";

/* ─────────────────────── Icons ─────────────────────── */
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden className="-mt-px">
      <path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 4-8 5L4 8V6l8 5 8-5z" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M7 2h2v2h6V2h2v2h3a1 1 0 0 1 1 1v3H3V5a1 1 0 0 1 1-1h3zm14 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9h18zM7 12h4v4H7z" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M12 16l4-5h-3V4h-2v7H8l4 5zm-7 2h14v2H5z" />
    </svg>
  );
}
function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.9.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85 0 1.7.12 2.5.35 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86l-.01 2.76c0 .26.18.58.69.48A10 10 0 0 0 12 2z" />
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M6.94 6.5A1.94 1.94 0 1 1 5 4.56 1.94 1.94 0 0 1 6.94 6.5zM5.5 8.5h2.9V20H5.5zM10.7 8.5h2.78v1.57h.04a3.05 3.05 0 0 1 2.75-1.51c2.94 0 3.48 1.94 3.48 4.46V20h-2.9v-4.18c0-1 0-2.28-1.39-2.28s-1.6 1.09-1.6 2.21V20H10.7z" />
    </svg>
  );
}

/* ───────────── Compact ActionButton ───────────── */
type ActionButtonProps =
  | ({ as?: "a"; href: string; target?: string; rel?: string } & BaseBtnProps)
  | ({ as: "button"; type?: "button" | "submit"; onClick?: () => void } & BaseBtnProps);
type BaseBtnProps = {
  variant?: "solid" | "outline";
  accent: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

function ActionButton(props: ActionButtonProps) {
  const { variant = "outline", accent, children, className, disabled } = props;

  const base =
    "group relative inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] transition-colors " +
    "overflow-hidden will-change-transform";

  const solidStyles = {
    background: accent,
    color: "#fff",
    boxShadow: `0 8px 24px -12px ${accent}66`,
    border: `1px solid ${accent}55`,
  } as React.CSSProperties;

  const outlineStyles = {
    background: "transparent",
    color: accent,
    border: `1px solid ${accent}`,
  } as React.CSSProperties;

  const Comp: any = (props as any).as === "button" ? motion.button : motion.a;
  const extra =
    (props as any).as === "button"
      ? { type: (props as any).type ?? "button", onClick: (props as any).onClick }
      : { href: (props as any).href, target: (props as any).target, rel: (props as any).rel };

  return (
    <Comp
      {...extra}
      className={`${base} ${className ?? ""}`}
      style={variant === "solid" ? solidStyles : outlineStyles}
      whileHover={{ y: -1 }}
      whileTap={{ y: 0 }}
      aria-disabled={disabled}
    >
      <motion.span
        className="pointer-events-none absolute -inset-y-3 -left-10 w-8 rotate-12 bg-white/30"
        initial={{ x: "-120%" }}
        whileHover={{ x: "220%" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </Comp>
  );
}

/* ───────────────────── Page ───────────────────── */
export default function ContactView() {
  const { palette, setPalette, p, palettes } = usePalette();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  // keep overlay color synced
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", p.accent);
  }, [p.accent]);

  // slide-up overlay on mount
  const [slideOverlay, setSlideOverlay] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setSlideOverlay(false), 600);
    return () => clearTimeout(t);
  }, []);

  // form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "General",
    message: "",
    website: "", // honeypot
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.website) return; // honeypot
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill out name, email, and your message.");
      return;
    }
    setSending(true);
    try {
      const to = "loang_chiang@brown.edu";
      const subject = encodeURIComponent(`[Portfolio] ${form.topic} — ${form.name}`);
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nTopic: ${form.topic}\n\n${form.message}`
      );
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      setSent(true);
    } catch {
      setError("Something went wrong opening your email client.");
    } finally {
      setSending(false);
    }
  }

  // header/footer heights to compute viewport-fit content
  const headerH = "64px";
  const footerH = "64px";

  return (
    <div
      className={`${p.bg} ${p.text} min-h-screen flex flex-col antialiased relative`}
      style={{ ["--header-h" as any]: headerH, ["--footer-h" as any]: footerH }}
    >
      {/* Slide overlay on mount */}
      <AnimatePresence>
        {slideOverlay && (
          <motion.div
            key="slide-overlay-contact"
            className="fixed inset-0 z-50 pointer-events-none"
            style={{ backgroundColor: "var(--accent)" }}
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            onAnimationComplete={() => setSlideOverlay(false)}
          />
        )}
      </AnimatePresence>

      <Header
        accent={p.accent}
        palette={palette}
        setPalette={(name) => setPalette(name as any)}
        palettes={palettes}
      />

      {/* One-screen content (single-column card) */}
      <main
        className="flex-grow"
        style={{
            minHeight: "calc(100vh - var(--header-h) - var(--footer-h))",
            display: "grid",
            alignContent: "start",
        }}
      >
        <section className="mx-auto w-full max-w-xl px-6 sm:px-8 pt-8 md:pt-8 pb-16 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`rounded-3xl border ${p.card} ${p.cardBorder} p-5 md:p-6`}
          >
            {/* Header copy */}
            <div className="text-center">
              <span
                className="inline-block rounded-full border px-3 py-1 text-xs mb-2"
                style={{ borderColor: p.accent, color: p.accent }}
              >
                Contact
              </span>
              <h1 className="text-xl md:text-2xl font-extrabold">Let’s connect!</h1>
              <p className="mt-2 text-sm opacity-80">I'll do my best to reply within 24 hours (based on EST!)</p>
            </div>

            {/* Quick actions (stacked, compact) */}
            <div className="mt-4 grid gap-2">
              <ActionButton as="a" href="mailto:loang_chiang@brown.edu" variant="solid" accent={p.accent}>
                <MailIcon />
                <span>Email me directly</span>
              </ActionButton>
              <ActionButton
                as="a"
                href="https://calendly.com/loang_chiang_ruiz-brown/30min"
                target="_blank"
                rel="noreferrer"
                variant="outline"
                accent={p.accent}
              >
                <CalendarIcon />
                <span>Book a 30-min boba chat</span>
              </ActionButton>
              <div className="grid grid-cols-2 gap-2">
                <ActionButton as="a" href={`${basePath}/Loang_Chiang_Resume.pdf`} variant="outline" accent={p.accent}>
                  <DownloadIcon />
                  <span>Resume</span>
                </ActionButton>
                <ActionButton
                  as="a"
                  href="https://github.com/loang-chiang"
                  target="_blank"
                  rel="noreferrer"
                  variant="outline"
                  accent={p.accent}
                >
                  <GithubIcon />
                  <span>GitHub</span>
                </ActionButton>
              </div>
              <ActionButton
                as="a"
                href="https://www.linkedin.com/in/loang-chiang-0346622ab/"
                target="_blank"
                rel="noreferrer"
                variant="outline"
                accent={p.accent}
              >
                <LinkedinIcon />
                <span>LinkedIn</span>
              </ActionButton>
            </div>

            {/* Form (compact) */}
            <form onSubmit={onSubmit} className="mt-5 grid gap-3">
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={onChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs opacity-80">Name *</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    required
                    className="mt-1 w-full rounded-lg border px-3 py-2 bg-white/70 outline-none text-sm"
                    style={{ borderColor: "var(--header-border, #ddd)" }}
                  />
                </label>
                <label className="block">
                  <span className="text-xs opacity-80">Email *</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    className="mt-1 w-full rounded-lg border px-3 py-2 bg-white/70 outline-none text-sm"
                    style={{ borderColor: "var(--header-border, #ddd)" }}
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs opacity-80">Topic</span>
                <select
                  name="topic"
                  value={form.topic}
                  onChange={onChange}
                  className="mt-1 w-full rounded-lg border px-3 py-2 bg-white/70 outline-none text-sm"
                  style={{ borderColor: "var(--header-border, #ddd)" }}
                >
                  <option>General</option>
                  <option>Internship / Roles</option>
                  <option>Collaboration</option>
                  <option>Freelance / Project</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs opacity-80">Message *</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  required
                  rows={4}
                  className="mt-1 w-full rounded-xl border px-3 py-2 bg-white/70 outline-none text-sm"
                  style={{ borderColor: "var(--header-border, #ddd)" }}
                  placeholder="Write your message here."
                />
              </label>

              {error && <p className="text-red-600 text-xs text-center">{error}</p>}

              {!sent ? (
                <div className="mt-1 text-center">
                  <ActionButton as="button" type="submit" variant="solid" accent={p.accent} disabled={sending}>
                    <MailIcon />
                    <span>{sending ? "Opening…" : "Send message"}</span>
                  </ActionButton>
                </div>
              ) : (
                <div className="mt-1 text-center">
                  <span
                    className="inline-block rounded-full px-3 py-1 text-sm text-white"
                    style={{ background: p.accent }}
                  >
                    Thanks! Your email app should be open.
                  </span>
                </div>
              )}
            </form>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}