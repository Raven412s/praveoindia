"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCursorElement } from "@/components/globals/cursor/advance-cursor";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "#carts", label: "Our carts" },
  { href: "#how", label: "How it works" },
  { href: "#standard", label: "The Standard" },
];

const panel =
  "grid h-10 w-10 place-items-center rounded-full border-[3px] border-(--ink) bg-(--card) text-(--ink) shadow-[2px_2px_0_var(--ink)] transition-[box-shadow,transform] duration-300 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_var(--ink)]";

/**
 * App-style mobile navigation: a hamburger that opens a full-screen menu
 * overlay with the nav links, the theme toggle and the "Find your PRAVEO" CTA.
 */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pointer = useCursorElement({ state: "pointer" });

  // Lock page scroll while the menu is open (app-like behaviour).
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-[720px]:hidden">
      <button
        {...pointer}
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={panel}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-(--bg)"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex h-16 items-center justify-between border-b-2 border-(--ink) px-5">
              <Link href="#top" onClick={() => setOpen(false)} className="text-(--ink)" aria-label="PRAVEO">
                <Logo className="h-auto w-[110px]" />
              </Link>
              <button
                {...pointer}
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className={panel}
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-1 px-5 pt-8" aria-label="Mobile">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * index, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b-2 border-(--ink) py-5 text-3xl font-black tracking-tight text-(--ink)"
                  >
                    {link.label}
                    <span aria-hidden="true" className="text-(--c)">
                      →
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 px-5 pt-10"
            >
              <ThemeToggle />
              <Link
                href="#find"
                onClick={() => setOpen(false)}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-full border-[3px] border-(--ink) bg-(--c) px-5 text-sm font-extrabold text-(--on) shadow-[3px_3px_0_var(--ink)] transition-[background-color,color,box-shadow,transform] duration-300 active:-translate-x-[2px] active:-translate-y-[2px] active:shadow-[5px_5px_0_var(--ink)]"
              >
                Find your PRAVEO
              </Link>
            </motion.div>

            <p className="absolute bottom-8 left-0 right-0 px-5 text-center text-[11px] font-extrabold uppercase tracking-[0.16em] opacity-60">
              Scan. Order. Repeat.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
