"use client";

import { motion } from "motion/react";
import {
  useThemeToggle,
  type AnimationStart,
  type AnimationVariant,
} from "@/components/ui/skiper-ui/skiper26";
import { useCursorElement } from "@/components/globals/cursor/advance-cursor";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * PRAVEO theme toggle — the neo-brutalist sun/moon button stays, but the
 * theme swap plays a View Transitions reveal (Skiper engine).
 *
 * The reveal animation is configurable here:
 * - variant: "circle" | "rectangle" | "polygon" | "circle-blur" | "gif"
 * - start:   "center" | "top-left" | "top-right" | "bottom-left" |
 *            "bottom-right" | "top-center" | "bottom-center" |
 *            "bottom-up" | "top-down" | "left-right" | "right-left"
 * - blur:    adds a blur trail to the reveal
 * - gifUrl:  mask image, only used when variant="gif"
 *
 * Set them on <ThemeToggle … /> in Header.tsx, e.g.
 * <ThemeToggle variant="circle-blur" start="bottom-right" />
 */
export default function ThemeToggle({
  className,
  variant = "circle",
  start = "top-center",
  blur = false,
  gifUrl = "",
}: {
  className?: string;
  variant?: AnimationVariant;
  start?: AnimationStart;
  blur?: boolean;
  gifUrl?: string;
}) {
  const { isDark, toggleTheme } = useThemeToggle({ variant, start, blur, gifUrl });
  const pointer = useCursorElement({ state: "pointer" });
  // Hydration-safe "is mounted" (SSR: false, client: true)
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  return (
    <button
      {...pointer}
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={`grid h-10 w-10 place-items-center rounded-full border-[3px] border-(--ink) bg-(--card) text-(--ink) shadow-[2px_2px_0_var(--ink)] transition-[box-shadow,transform] duration-300 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_var(--ink)] ${className ?? ""}`}
    >
      {mounted ? (
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="grid place-items-center"
        >
          {isDark ? (
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
              <path d="M20.6 14.6A8.5 8.5 0 0 1 9.4 3.4a8.5 8.5 0 1 0 11.2 11.2Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
              <path d="M12 2.5A1.5 1.5 0 0 1 13.5 4v1a1.5 1.5 0 0 1-3 0V4A1.5 1.5 0 0 1 12 2.5Zm0 13a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Zm0 1.5a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-3 0v-1A1.5 1.5 0 0 1 12 17.5ZM4 10.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 0 0-3H4Zm15 0a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 0 0-3h-1ZM5.4 4a1.5 1.5 0 0 1 2.1 0l.7.7a1.5 1.5 0 0 1-2.1 2.1l-.7-.7A1.5 1.5 0 0 1 5.4 4Zm11.1 11.1a1.5 1.5 0 0 1 2.1 0l.7.7a1.5 1.5 0 1 1-2.1 2.1l-.7-.7a1.5 1.5 0 0 1 0-2.1ZM18.6 4a1.5 1.5 0 0 1 0 2.1l-.7.7a1.5 1.5 0 0 1-2.1-2.1l.7-.7A1.5 1.5 0 0 1 18.6 4ZM7.5 15.1a1.5 1.5 0 0 1 0 2.1l-.7.7a1.5 1.5 0 1 1-2.1-2.1l.7-.7a1.5 1.5 0 0 1 2.1 0Z" />
            </svg>
          )}
        </motion.span>
      ) : (
        <span className="block size-5" aria-hidden="true" />
      )}
    </button>
  );
}
