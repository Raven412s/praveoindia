"use client";

import Link from "next/link";
import { useCursorElement } from "@/components/globals/cursor/advance-cursor";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import ScrollProgressTruck from "./ScrollProgressTruck";

const NAV_LINKS = [
  { href: "#carts", label: "Our carts" },
  { href: "#how", label: "How it works" },
  { href: "#standard", label: "The Standard" },
];

export default function Header() {
  const pointer = useCursorElement({ state: "pointer" });

  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-(--line) bg-(--bg)/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-[1180px] items-center justify-between px-5">
        <Link {...pointer} href="#top" className="text-(--ink)" aria-label="PRAVEO">
          <Logo className="h-auto w-[124px]" />
        </Link>

        <nav className="flex items-center gap-8" aria-label="Main">
          <div className="hidden items-center gap-7 min-[820px]:flex">
            {NAV_LINKS.map((link) => (
              <Link
                {...pointer}
                key={link.href}
                href={link.href}
                className="text-[10px] font-semibold uppercase tracking-[0.18em] text-(--ink)/65 transition-colors duration-300 hover:text-(--ink)"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              {...pointer}
              href="#find"
              className="hidden h-10 items-center rounded-full border border-(--ink) px-5 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 hover:bg-(--ink) hover:text-(--bg) min-[820px]:inline-flex"
            >
              Find your PRAVEO
            </Link>
          </div>

          <MobileMenu />
        </nav>
      </div>
      <ScrollProgressTruck />
    </header>
  );
}
