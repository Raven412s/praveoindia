"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { INTRO_DONE_EVENT, introDone } from "@/lib/intro";

/**
 * GSAP master timeline for the hero entrance — a big sequenced reveal that
 * starts while the preloader curtain is still lifting. Everything else on the
 * page uses Motion (see Reveal.tsx); GSAP is reserved for orchestrations like this.
 */
export default function HeroTimeline({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      gsap.set("[data-hero]", { opacity: 0, y: 28 });
      gsap.set("[data-hero-blob]", { opacity: 0, scale: 0.55, rotate: -10 });
      gsap.set("[data-hero-sticker]", { opacity: 0, scale: 0.5 });

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      tl.to("[data-hero]", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.09,
      })
        .to(
          "[data-hero-blob]",
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.9,
            ease: "back.out(1.4)",
          },
          "-=0.45"
        )
        .to(
          "[data-hero-sticker]",
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.12,
            ease: "back.out(2.2)",
          },
          "-=0.25"
        );

      const play = () => {
        tl.play();
      };

      if (introDone()) {
        window.setTimeout(play, 0);
      } else {
        window.addEventListener(INTRO_DONE_EVENT, play, { once: true });
        cleanups.push(() => window.removeEventListener(INTRO_DONE_EVENT, play));
      }
      // Safety net: never leave the hero hidden if the intro event is missed.
      const fallback = window.setTimeout(play, 3200);
      cleanups.push(() => window.clearTimeout(fallback));
    }, root);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  );
}
