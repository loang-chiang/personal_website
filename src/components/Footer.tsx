"use client";

export default function Footer() {
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-30 border-t supports-[backdrop-filter]:backdrop-blur-sm"
      style={{
        // falls back to header vars so your palettes still work
        backgroundColor: "var(--footer-bg, var(--header-bg, white))",
        borderColor: "var(--header-border, #ddd)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:py-5 text-sm opacity-80">
        <p>© {new Date().getFullYear()} Loang Chiang. Built with React + Tailwind.</p>
        <div className="flex items-center gap-3">
          <a href="#" className="underline" style={{ color: "var(--accent)" }}>
            GitHub
          </a>
          <a href="#" className="underline" style={{ color: "var(--accent)" }}>
            LinkedIn
          </a>
        </div>
      </div>
      {/* iOS safe-area shim (no height on most desktops) */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </footer>
  );
}