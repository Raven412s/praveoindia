"use client";

import Link from "next/link";
import { useCursorElement } from "@/components/globals/cursor/advance-cursor";
import HeroTimeline from "./HeroTimeline";
import Mascot from "./Mascot";

const ACCENT_TRANSITION = "transition-[background-color,color] duration-300";

/**
 * Crumpled-paper texture, built procedurally: a large-wrinkle diffuse-lighting
 * relief (feTurbulence + feDiffuseLighting) gives the faceted creases, and a
 * fine-grain noise layer adds the paper grain. Both multiply over the blob so
 * the background circle reads as a different material from the mascot body.
 */
const PAPER_CREASES =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Cfilter id='c' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.019 0.024' numOctaves='5' seed='23' stitchTiles='stitch' result='n'/%3E%3CfeDiffuseLighting in='n' lighting-color='white' surfaceScale='3.4' diffuseConstant='1.1'%3E%3CfeDistantLight azimuth='235' elevation='48'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23c)'/%3E%3C/svg%3E\")";

const PAPER_GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='g' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.35' numOctaves='3' seed='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.5'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")";

const PAPER_CRINKLES =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='k' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.055 0.07' numOctaves='4' seed='41' stitchTiles='stitch' result='n'/%3E%3CfeDiffuseLighting in='n' lighting-color='white' surfaceScale='1.7' diffuseConstant='1.05'%3E%3CfeDistantLight azimuth='70' elevation='55'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23k)'/%3E%3C/svg%3E\")";

export default function Hero() {
  const pointer = useCursorElement({ state: "pointer" });
  const blobCursor = useCursorElement({ state: "text", text: "VYBO" });

  return (
    <section id="top">
      <div className="mx-auto grid w-full max-w-[1160px] grid-cols-1 items-center gap-14 px-5 pb-20 pt-16 min-[820px]:grid-cols-[1.15fr_0.85fr] min-[820px]:gap-10">
        <HeroTimeline>
          <div>
            <p
              data-hero
              className="text-xs font-extrabold uppercase tracking-[0.16em]"
            >
              FOOD CARTS • FIVE FOOD MODES
            </p>
            <h1
              data-hero
              className="mt-4 text-[clamp(44px,8vw,96px)] font-black leading-[1.02] tracking-[-0.02em]"
            >
              More than food. It’s your{" "}
              <span
                className={`${ACCENT_TRANSITION} inline rounded-[0.12em] bg-(--c) px-[0.12em] text-(--on)`}
              >
                vybe.
              </span>
            </h1>
            <p data-hero className="mt-6 max-w-[520px] text-lg">
              Fresh ingredients, clean preparation and bold flavours — served
              from five specialised carts, placed right where you need them.
            </p>
            <div data-hero className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                {...pointer}
                href="#carts"
                className={`${ACCENT_TRANSITION} inline-flex h-12 items-center rounded-full border-[3px] border-(--ink) bg-(--c) px-7 text-[15px] font-extrabold text-(--on) shadow-[3px_3px_0_var(--ink)] transition-[background-color,color,box-shadow,transform] duration-300 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_var(--ink)]`}
              >
                Pick your vybe
              </Link>
              <Link
                {...pointer}
                href="#find"
                className="inline-flex h-12 items-center rounded-full border-[3px] border-(--ink) bg-(--card) px-7 text-[15px] font-extrabold shadow-[3px_3px_0_var(--ink)] transition-[box-shadow,transform] duration-300 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_var(--ink)]"
              >
                Find a cart
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[420px]">
            <div
              {...blobCursor}
              data-hero-blob
              className={`${ACCENT_TRANSITION} relative flex aspect-square w-full items-center justify-center border-[3px] border-(--ink) bg-(--c)`}
              style={{ borderRadius: "var(--blob-radius)" }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-90 mix-blend-multiply"
                style={{
                  backgroundImage: PAPER_CREASES,
                  backgroundSize: "600px 600px",
                  borderRadius: "inherit",
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
                style={{
                  backgroundImage: PAPER_CRINKLES,
                  backgroundSize: "300px 300px",
                  borderRadius: "inherit",
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply"
                style={{
                  backgroundImage: PAPER_GRAIN,
                  backgroundSize: "240px 240px",
                  borderRadius: "inherit",
                }}
              />
              <Mascot
                interactive
                title="Vybo, the PRAVEO mascot"
                className="animate-bob relative w-[72%]"
              />
            </div>
            <div data-hero-sticker className="absolute left-0 top-4">
              <p className="-rotate-6 rounded-full border-2 border-(--ink) bg-(--bg) px-4 py-2 text-xs font-bold">
                Hey, I’m Vybo!
              </p>
            </div>
            <div data-hero-sticker className="absolute bottom-3 right-0">
              <p className="rotate-5 rounded-full border-2 border-(--ink) bg-(--bg) px-4 py-2 text-xs font-bold">
                Scan. Order. Repeat.
              </p>
            </div>
          </div>
        </HeroTimeline>
      </div>
    </section>
  );
}
