"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Mascot from "./Mascot";
import { conceptColorVar, concepts } from "@/lib/concepts";

gsap.registerPlugin(ScrollTrigger);

/**
 * "Meet the crew" — the five concept mascots as their own experiential
 * section. Scroll behaviour, in two independent layers so transforms never
 * fight each other:
 *
 * 1. Entrance (once): each mascot pops up from behind its name with a
 *    back-out settle and alternating tilt, staggered left to right.
 * 2. Scrubbed parallax bob: while the section crosses the viewport, even
 *    and odd mascots drift in opposite directions — the row feels alive
 *    for the whole time it is on screen, not just on entry.
 *
 * Mascots also get pointer-tracking eyes scoped to this section. Without
 * JS or under prefers-reduced-motion everything degrades to the plain
 * static row (initial hidden states are only ever applied from JS).
 */
export default function MascotCrew() {
  const rowRef = useRef<HTMLDivElement>(null);

  // Passive effect (not useLayoutEffect): CartStreet's pin — which sits
  // before this section — is created in ITS passive effect, so creating our
  // triggers here guarantees they are registered after that pin spacer
  // exists, in DOM order. Trigger positions computed before the spacer was
  // in the layout came out stale and never recovered on refresh.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bobbers = gsap.utils.toArray<HTMLElement>("[data-crew-bob]", row);
    const mascots = gsap.utils.toArray<HTMLElement>("[data-crew-mascot]", row);
    if (!bobbers.length || !mascots.length) return;

    const ctx = gsap.context(() => {
      // 1 — Entrance: pop + tilt settle, staggered like a wave.
      gsap.from(mascots, {
        y: 72,
        scale: 0.55,
        rotation: (i: number) => (i % 2 ? 7 : -7),
        autoAlpha: 0,
        transformOrigin: "50% 100%",
        duration: 0.7,
        ease: "back.out(1.7)",
        stagger: 0.09,
        scrollTrigger: {
          trigger: row,
          start: "top 88%",
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
        },
      });

      // 2 — Parallax bob: scrubbed across the section's full crossing of
      // the viewport; neighbours move opposite ways.
      const bob = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: row,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      bobbers.forEach((el, i) => {
        const dir = i % 2 ? -1 : 1;
        bob.fromTo(el, { y: 26 * dir }, { y: -26 * dir }, 0);
      });
    }, row);

    return () => ctx.revert();
  }, []);

  return (
    <section id="crew" className="relative  pt-2">
      <div className="mx-auto w-full max-w-[1160px] px-5">
       

        <div
          ref={rowRef}
          className="mt-14 flex flex-wrap items-end justify-center gap-x-8 gap-y-6"
        >
          {concepts.map((concept) => (
            <div key={concept.key} data-crew-bob className="will-change-transform">
              <div
                data-crew-mascot
                className="flex flex-col items-center gap-3"
                style={
                  {
                    "--c": conceptColorVar[concept.key],
                  } as CSSProperties
                }
              >
                <Mascot
                  interactive
                  title={concept.name}
                  className="w-[clamp(70px,15vw,140px)]"
                />
                <span className="text-[10px] font-black uppercase tracking-[0.18em] opacity-55">
                  {concept.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
