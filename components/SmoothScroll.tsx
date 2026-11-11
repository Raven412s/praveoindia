"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { INTRO_DONE_EVENT } from "@/lib/intro";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger stays
 * in sync. Also takes over anchor-link navigation with a proper header offset.
 * Skipped entirely when the user prefers reduced motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    function headerOffset(): number {
      const header = document.querySelector("header");
      const headerHeight = header?.offsetHeight ?? 64;
      const safeTop =
        parseFloat(getComputedStyle(document.documentElement).paddingTop) || 0;
      return -(headerHeight + safeTop);
    }

    function onClick(event: MouseEvent) {
      const anchor = (event.target as HTMLElement | null)?.closest<
        HTMLAnchorElement
      >('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      if (!document.querySelector(hash)) return; // no such target — let native handling do its thing
      event.preventDefault();
      if (hash === "#top") {
        lenis.scrollTo(0, { duration: 1.1 });
        return;
      }
      const target = document.querySelector(hash) as HTMLElement | null;
      if (!target) return;
      lenis.scrollTo(target, { offset: headerOffset(), duration: 1.1 });
    }

    function onIntroDone() {
      ScrollTrigger.refresh();
    }

    document.addEventListener("click", onClick);
    window.addEventListener(INTRO_DONE_EVENT, onIntroDone);

    return () => {
      gsap.ticker.remove(tick);
      document.removeEventListener("click", onClick);
      window.removeEventListener(INTRO_DONE_EVENT, onIntroDone);
      lenis.destroy();
    };
  }, []);

  return null;
}
