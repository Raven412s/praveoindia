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

const pill =
  "inline-flex h-10 items-center rounded-full border-[3px] border-(--ink) bg-(--c) px-5 text-sm font-extrabold text-(--on) shadow-[3px_3px_0_var(--ink)] transition-[background-color,color,box-shadow,transform] duration-300 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_var(--ink)]";

export default function Header() {
  const pointer = useCursorElement({ state: "pointer" });

  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-11 border-b-2 border-(--ink) bg-(--bg)">
      <div className="mx-auto flex h-16 w-full max-w-[1160px] items-center justify-between px-5">
        <Link {...pointer} href="#top" className="text-(--ink)" aria-label="PRAVEO">
          <Logo className="h-auto w-[132px]" />
        </Link>
        <nav className="flex items-center gap-6" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              {...pointer}
              key={link.href}
              href={link.href}
              className="hidden text-[15px] font-bold underline-offset-4 hover:underline min-[720px]:inline-block"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link {...pointer} href="#find" className={`${pill} max-[719px]:hidden min-[720px]:inline-flex`}>
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
