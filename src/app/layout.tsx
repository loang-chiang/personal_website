// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { PaletteProvider } from "@/components/PaletteProvider";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

// Define basePath at the module level
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: { default: "Loang Chiang", template: "%s | Loang Chiang" },
  description: "Portfolio of Loang Chiang — projects, experience, and contact.",
  openGraph: {
    title: "Loang Chiang",
    description: "Portfolio of Loang Chiang — projects, experience, and contact.",
    url: "https://your-domain.com",
    siteName: "Loang Chiang",
    images: [`${basePath}/og.png`],
    type: "website",
  },
  icons: { 
    icon: `${basePath}/favicon.ico`,
    apple: `${basePath}/apple-touch-icon.png`, // if you have one
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

function ThemeSeed() {
  const code = `
  try {
    var root = document.documentElement;

    var paletteName =
      localStorage.getItem("palette") ||
      localStorage.getItem("paletteName") ||
      localStorage.getItem("theme:palette");

    if (paletteName) {
      root.setAttribute("data-palette", paletteName);
    }

    var storedAccent =
      localStorage.getItem("accent") ||
      localStorage.getItem("theme:accent");

    if (storedAccent) {
      root.style.setProperty("--accent", storedAccent);
    }
  } catch (e) { /* no-op */ }
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <ThemeSeed />
      </head>
      <body className="font-sans antialiased">
        <PaletteProvider>
          {children}
        </PaletteProvider>
      </body>
    </html>
  );
}
