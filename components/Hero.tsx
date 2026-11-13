"use client";

import Link from "next/link";
import { useCursorElement } from "@/components/globals/cursor/advance-cursor";
import { concepts, conceptColorVar } from "@/lib/concepts";
import CartArt from "./CartArt";
import HeroTimeline from "./HeroTimeline";

const FEATURED = concepts[3]; // BREW — a calm, warm first impression.

const PROOF = [
  "Freshly prepared",
  "Five specialised carts",
  "One quality standard",
];

export default function Hero() {
  const pointer = useCursorElement({ state: "pointer" });

  return (
    <section id="top">
      <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 items-center gap-14 px-5 pb-20 pt-16 min-[880px]:grid-cols-[1.08fr_0.92fr] min-[880px]:gap-12 min-[880px]:pb-24 min-[880px]:pt-20">
        <HeroTimeline>
          <div>
            <p data-hero className="eyebrow">
              PRAVEO India — food carts, done properly
            </p>

            <h1
              data-hero
              className="mt-7 font-serif text-[clamp(48px,6.6vw,92px)] font-normal leading-[0.96] tracking-[-0.03em]"
            >
              More than food.
              <br />
              It’s your{" "}
              <span className="italic">
                vybe<span className="text-(--c)">.</span>
              </span>
            </h1>

            <p
              data-hero
              className="mt-7 max-w-[500px] text-[16.5px] leading-[1.7] text-(--muted-ink)"
            >
              Five specialised food carts, each built around one thing it does
              really well. Fresh ingredients, clean preparation and a standard
              you can trust — right where your day takes you.
            </p>

            <div
              data-hero
              className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4"
            >
              <Link
                {...pointer}
                href="#carts"
                className="inline-flex h-12 items-center rounded-full bg-(--ink) px-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-(--bg) transition-[background-color,color,transform] duration-300 hover:-translate-y-0.5 hover:bg-(--brew)"
              >
                Explore the carts
              </Link>
              <Link
                {...pointer}
                href="#find"
                className="hairline-link text-[11px] font-semibold uppercase tracking-[0.16em]"
              >
                Find a cart
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <ul
              data-hero
              className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-(--line) pt-5 text-[10px] font-medium uppercase tracking-[0.16em] text-(--muted-ink)"
            >
              {PROOF.map((item, index) => (
                <li key={item} className="flex items-center gap-5">
                  {index > 0 ? (
                    <span
                      aria-hidden="true"
                      className="size-1 rounded-full bg-(--ink)/25"
                    />
                  ) : null}
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto mt-4 w-full max-w-[430px] min-[880px]:mt-0">
            <div
              data-hero-caption
              className="mb-3 hidden items-center justify-between text-[9px] font-semibold uppercase tracking-[0.2em] text-(--muted-ink) min-[880px]:flex"
            >
              <span>PRAVEO / The fleet</span>
              <span>Est. 2026</span>
            </div>

            <div
              data-hero-media
              className="relative aspect-[4/5] overflow-hidden rounded-t-[220px] rounded-b-[10px] border border-(--line) bg-(--surface)"
            >
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-[17%] aspect-square w-[82%] -translate-x-1/2 rounded-full border border-(--ink)/10"
              />
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-[23%] aspect-square w-[66%] -translate-x-1/2 rounded-full bg-(--c) opacity-[0.07]"
              />

              <CartArt
                concept={FEATURED}
                title="The PRAVEO cart"
                className="absolute bottom-[11%] left-1/2 w-[94%] max-w-none -translate-x-1/2"
              />

              <div className="absolute inset-x-7 bottom-6 flex items-center justify-between border-t border-(--ink)/10 pt-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-(--muted-ink)">
                <span>Good food. Done right.</span>
                <span aria-hidden="true">01 — 05</span>
              </div>
            </div>

            <div
              data-hero-caption
              className="mt-4 flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2" aria-hidden="true">
                {concepts.map((concept) => (
                  <span
                    key={concept.key}
                    className="size-2 rounded-full"
                    style={{ background: conceptColorVar[concept.key] }}
                  />
                ))}
              </div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-(--muted-ink)">
                Five concepts · One standard
              </p>
            </div>
          </div>
        </HeroTimeline>
      </div>
    </section>
  );
}
