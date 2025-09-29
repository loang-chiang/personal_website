"use client";

import Link from "next/link";

export default function FourOhFour() {
  return (
    <main className="min-h-screen grid place-items-center px-6 py-16">
      <div className="max-w-md w-full text-center rounded-3xl border p-8"
           style={{ borderColor: "var(--header-border, #ddd)" }}>
        <h1 className="text-3xl font-extrabold">Page not found</h1>
        <p className="mt-2 opacity-80">
          The page you’re looking for doesn’t exist (404).
        </p>
        <Link
          href="/"
          className="inline-block mt-6 rounded-xl px-4 py-2 text-sm font-medium text-white"
          style={{ background: "var(--accent, #444)" }}
        >
          ← Back home
        </Link>
      </div>
    </main>
  );
}
