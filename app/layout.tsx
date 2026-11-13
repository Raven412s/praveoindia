import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "motion/react";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import { CursorProvider } from "@/components/globals/cursor/advance-cursor";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PRAVEO India — More than food. It’s your vybe.",
  description:
    "Five food concepts. One PRAVEO standard. Freshly prepared, cleanly served and placed right where you need it.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        inter.variable,
        bodoni.variable,
        "font-sans"
      )}
    >
      <body className="min-h-dvh bg-(--bg) font-sans text-(--ink)">
        <ThemeProvider attribute={["data-theme", "class"]} defaultTheme="system">
          <MotionConfig reducedMotion="user">
            <CursorProvider>
              <SmoothScroll />
              <Preloader />
              {children}
            </CursorProvider>
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
