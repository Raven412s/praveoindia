"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { INTRO_DONE_EVENT, introDone } from "@/lib/intro";

/**
 * GSAP master timeline for the hero entrance. It starts while the preloader
 * curtain is still lifting; the rest of the page uses Motion (Reveal.tsx).
 */
export default function HeroTimeline({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      gsap.set("[data-hero]", { opacity: 0, y: 22 });
      gsap.set("[data-hero-media]", { opacity: 0, y: 30, scale: 0.985 });
      gsap.set("[data-hero-caption]", { opacity: 0, y: 10 });

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      tl.to("[data-hero]", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
      })
        .to(
          "[data-hero-media]",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.05,
            ease: "power2.out",
          },
          "-=0.55"
        )
        .to(
          "[data-hero-caption]",
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          "-=0.5"
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
