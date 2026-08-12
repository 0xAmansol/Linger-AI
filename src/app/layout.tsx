import type { Metadata } from "next";
import { Spectral, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Linger — your reading companion",
  description:
    "Capture, understand, and revisit what you discover while reading.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spectral.variable} ${plexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/*
        THESIS: your library is a catalog you're actively building, not a feed you scroll.
        OWN-WORLD: buff/grey-ivory card stock, deep ink-stamp indigo accent, stamped
        monospace call-numbers, tab-divider motifs for shelves, Spectral serif for
        reading, system sans for UI chrome.
        STORY: the reader opens their in-progress catalog, opens a book to its drawer
        of annotation cards, captures a new passage in seconds, and it's stamped
        straight into the right drawer.
        FIRST VIEWPORT: library grid of catalog-card book tiles with a tab-divider
        shelf rail, capture action fixed bottom-right, each tile stamped with its
        annotation count.
        FORM: library card catalog — candidate 3 of the grounded list (marginalia,
        commonplace book, card catalog, book jacket, field notebook, letterpress,
        broadsheet reading room), seed key feec3629. Build path: code-led (no image
        generation / no browser available in this session).
        FINISH: unreviewed and undocumented is unfinished; this build ends with the
        finish review, the verdict, and DESIGN.md.
      */}
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
