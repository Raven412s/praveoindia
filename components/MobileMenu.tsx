"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCursorElement } from "@/components/globals/cursor/advance-cursor";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const emptySubscribe = () => () => {};

const NAV_LINKS = [
  { href: "#carts", label: "Our carts" },
  { href: "#how", label: "How it works" },
  { href: "#standard", label: "The Standard" },
  { href: "#find", label: "Find us" },
];

const panel =
  "grid size-9 place-items-center rounded-full border border-(--line) text-(--ink) transition-colors duration-300 hover:border-(--ink)";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pointer = useCursorElement({ state: "pointer" });
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Lock page scroll while the menu is open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-[820px]:hidden">
      <button
        {...pointer}
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={panel}
      >
        <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <path d="M3.5 8h17M3.5 16h17" />
        </svg>
      </button>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-(--bg)"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex h-[72px] items-center justify-between border-b border-(--line) px-5">
              <Link href="#top" onClick={() => setOpen(false)} className="text-(--ink)" aria-label="PRAVEO">
                <Logo className="h-auto w-[112px]" />
              </Link>
              <button
                {...pointer}
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className={panel}
              >
                <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col px-5 pt-6" aria-label="Mobile">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-(--line) py-5 font-serif text-4xl font-normal tracking-[-0.02em] text-(--ink)"
                  >
                    {link.label}
                    <span aria-hidden="true" className="font-sans text-sm text-(--muted-ink)">
                      0{index + 1}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 px-5 pt-8"
            >
              <ThemeToggle />
              <Link
                href="#find"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-(--ink) px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-(--bg)"
              >
                Find your PRAVEO
              </Link>
            </motion.div>

            <p className="px-5 pb-10 pt-8 text-[9px] font-semibold uppercase tracking-[0.22em] text-(--muted-ink)">
              More than food. It’s your vybe.
            </p>
          </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </div>
  );
}
