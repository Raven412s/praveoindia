import type { Metadata, Viewport } from "next";
import { Montserrat, Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "motion/react";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import { CursorProvider } from "@/components/globals/cursor/advance-cursor";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "PRAVEO — More than food. It’s your vybe.",
  description:
    "Five food concepts. One PRAVEO standard. Fresh prep, bold flavours, right where you need them.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased", montserrat.variable, "font-sans", geist.variable)}>
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
