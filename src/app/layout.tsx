// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
// If your provider exports differently, adjust this import:
// e.g. `import { PaletteProvider } from "@/components/PaletteProvider";`
import { PaletteProvider } from "@/components/PaletteProvider";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Loang Chiang", template: "%s | Loang Chiang" },
  description: "Portfolio of Loang Chiang — projects, experience, and contact.",
  openGraph: {
    title: "Loang Chiang",
    description: "Portfolio of Loang Chiang — projects, experience, and contact.",
    url: "https://your-domain.com",
    siteName: "Loang Chiang",
    images: ["/og.png"], // put an OG image in /public/og.png (1200x630)
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

/**
 * Pre-hydration theme seed:
 * Reads a palette name and/or accent color from localStorage (if present) and
 * sets CSS vars/attributes to avoid a flash before React mounts.
 * This uses only localStorage (no cookies), so it's static-export friendly.
 */
function ThemeSeed() {
  const code = `
  try {
    var root = document.documentElement;

    // Try a few possible keys, harmless if missing:
    var paletteName =
      localStorage.getItem("palette") ||
      localStorage.getItem("paletteName") ||
      localStorage.getItem("theme:palette");

    if (paletteName) {
      root.setAttribute("data-palette", paletteName);
    }

    // If your app stores colors, you can seed --accent here too:
    var storedAccent =
      localStorage.getItem("accent") ||
      localStorage.getItem("theme:accent");

    if (storedAccent) {
      root.style.setProperty("--accent", storedAccent);
    }
  } catch (e) { /* no-op */ }
  `;
  // eslint-disable-next-line @next/next/no-sync-scripts
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <ThemeSeed />
      </head>
      <body className="font-sans antialiased">
        {/* Your palette context for usePalette() hooks */}
        <PaletteProvider>
          {children}
        </PaletteProvider>
      </body>
    </html>
  );
}
