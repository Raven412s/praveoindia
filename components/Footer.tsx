import Link from "next/link";
import Logo from "./Logo";
import { concepts, conceptColorVar } from "@/lib/concepts";

const EXPLORE = [
  { href: "#carts", label: "Our carts" },
  { href: "#how", label: "How it works" },
  { href: "#standard", label: "The Standard" },
  { href: "#find", label: "Find us" },
];

export default function Footer() {
  return (
    <footer className="border-t border-(--deep-ink)/15 bg-(--deep) text-(--deep-ink)">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-16">
        <div className="grid gap-12 min-[760px]:grid-cols-2 min-[1040px]:grid-cols-[1.5fr_0.8fr_0.8fr_1fr]">
          <div>
            <Link href="#top" aria-label="PRAVEO" className="inline-block text-(--deep-ink)">
              <Logo className="h-auto w-[126px]" />
            </Link>
            <p className="mt-6 max-w-[280px] font-serif text-[24px] font-normal italic leading-[1.25] tracking-[-0.015em]">
              More than food. It’s your vybe.
            </p>
            <p className="mt-4 max-w-[300px] text-[12px] leading-[1.7] text-(--deep-ink)/45">
              Five specialised food carts, one quality standard. Coming soon to a
              street near you.
            </p>
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-(--deep-ink)/40">
              Explore
            </p>
            <ul className="mt-5 space-y-3">
              {EXPLORE.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-(--deep-ink)/70 transition-colors duration-300 hover:text-(--deep-ink)"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-(--deep-ink)/40">
              Concepts
            </p>
            <ul className="mt-5 space-y-3">
              {concepts.map((concept) => (
                <li key={concept.key}>
                  <Link
                    href="#carts"
                    className="flex items-center gap-2.5 text-[13px] text-(--deep-ink)/70 transition-colors duration-300 hover:text-(--deep-ink)"
                  >
                    <span
                      aria-hidden="true"
                      className="size-1.5 rounded-full"
                      style={{ background: conceptColorVar[concept.key] }}
                    />
                    {concept.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-(--deep-ink)/40">
              Stay in the loop
            </p>
            <p className="mt-5 text-[12px] leading-[1.7] text-(--deep-ink)/50">
              Be first to know where the first PRAVEO cart lands.
            </p>
            <Link
              href="#notify"
              className="mt-5 inline-flex items-center gap-2 border-b border-(--deep-ink)/25 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-(--deep-ink)/80 transition-colors duration-300 hover:border-(--deep-ink) hover:text-(--deep-ink)"
            >
              Notify me <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-(--deep-ink)/15 pt-6 text-[10px] uppercase tracking-[0.16em] text-(--deep-ink)/40 min-[700px]:flex-row min-[700px]:items-center min-[700px]:justify-between">
          <p>© 2026 PRAVEO India. All rights reserved.</p>
          <p>Fresh prep · Clear menus · Real standards</p>
        </div>
      </div>
    </footer>
  );
}
