import "./globals.css";
import { cookies } from "next/headers";
import { PaletteProvider } from "@/components/PaletteProvider";
import { PALETTES, type PaletteName } from "@/lib/palettes";

export const metadata = {
  title: { default: "Loang Chiang", template: "%s | Loang Chiang" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies(); // ⬅️ await the async API
  const saved = cookieStore.get("palette-choice")?.value as PaletteName | undefined;
  const initialPalette: PaletteName =
    saved && saved in PALETTES ? saved : "Vintage";
  const accent = PALETTES[initialPalette].accent;

  return (
    <html lang="en" data-palette={initialPalette}>
      <head>
        {/* seed the CSS var before hydration to avoid any color flash */}
        <style dangerouslySetInnerHTML={{ __html: `:root{--accent:${accent}}` }} />
      </head>
      <body>
        <PaletteProvider initialPalette={initialPalette}>
          {children}
        </PaletteProvider>
      </body>
    </html>
  );
}