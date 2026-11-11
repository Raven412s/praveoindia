"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll progress, on-brand: a tiny food truck driving along a road under the
 * header. The road fills with the current accent colour as the page scrolls;
 * the truck rides the leading edge and its wheels turn with progress.
 * Under prefers-reduced-motion only the progress fill remains (instant).
 *
 * Progress is measured directly from the live scroll position instead of a
 * ScrollTrigger-tweened range: pinned sections (CartStreet, HowItWorks) and
 * late-loading media change the document height after mount, and a trigger
 * whose end was captured from a stale layout made the truck reach the end
 * of the road far too early. Measuring scrollY / maxScroll on every frame
 * (rAF-throttled) keeps the truck linear with the real page at all times;
 * geometry is re-measured on resize, ScrollTrigger refreshes and document
 * height changes via ResizeObserver.
 */
export default function ScrollProgressTruck() {
  const trackRef = useRef<HTMLDivElement>(null);
  const truckRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const truck = truckRef.current;
    const fill = fillRef.current;
    if (!track || !truck || !fill) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Cached geometry — never read inside the scroll loop.
    let maxX = 0; // truck travel distance
    let maxScroll = 1; // page scroll range
    const measure = () => {
      maxX = Math.max(0, track.clientWidth - truck.offsetWidth - 8);
      maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
    };
    measure();

    gsap.set(fill, { scaleX: 0, transformOrigin: "left center" });
    const setFill = gsap.quickSetter(fill, "scaleX");

    let setX: ((v: number) => void) | null = null;
    let setWheel: ((v: number) => void) | null = null;
    if (reduced) {
      // Progress fill only — no driving truck under reduced motion.
      gsap.set(truck, { autoAlpha: 0 });
    } else {
      const wheels = truck.querySelectorAll("[data-wheel]");
      // Cache the SVG bbox centre before per-frame writes.
      gsap.set(wheels, { rotation: 0, transformOrigin: "50% 50%" });
      setX = gsap.quickSetter(truck, "x", "px") as (v: number) => void;
      setWheel = gsap.quickSetter(wheels, "rotation") as (v: number) => void;
    }

    const apply = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      setFill(p);
      if (!setX || !setWheel) return;
      setX(8 + p * maxX);
      setWheel(p * 1080);
    };

    // Lenis drives the native scroll position, so plain scroll events fire
    // for smooth scrolling too. rAF-throttled: at most one write per frame.
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        apply();
      });
    };

    // Re-measure whenever layout could have changed: resize, ScrollTrigger
    // refreshes (pins mounting, fonts) and document height changes (images).
    const remeasure = () => {
      measure();
      apply();
    };
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.documentElement);
    ScrollTrigger.addEventListener("refresh", remeasure);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);

    apply();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      ScrollTrigger.removeEventListener("refresh", remeasure);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={trackRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[26px]"
    >
      {/* Road */}
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-(--ink)" />
      <div
        ref={fillRef}
        className="absolute inset-x-0 bottom-0 h-[3px] bg-(--c) transition-[background-color] duration-300"
      />
      {/* Truck rides the leading edge of the fill */}
      <div ref={truckRef} className="absolute bottom-0 left-0 z-10 w-[30px]">
        <svg viewBox="0 0 56 48" className="h-auto w-full" fill="none">
          <rect
            x="7"
            y="5"
            width="42"
            height="9"
            rx="3"
            fill="var(--c)"
            stroke="var(--ink)"
            strokeWidth="3"
          />
          <rect
            x="4"
            y="13"
            width="48"
            height="21"
            rx="4"
            fill="var(--card)"
            stroke="var(--ink)"
            strokeWidth="3"
          />
          <rect
            x="34"
            y="18"
            width="13"
            height="9"
            rx="2"
            fill="var(--bg)"
            stroke="var(--ink)"
            strokeWidth="2"
          />
          <g data-wheel>
            <circle cx="17" cy="36" r="6.5" fill="var(--ink)" />
            <circle cx="17" cy="36" r="2.2" fill="var(--card)" />
            {/* Off-centre notch so the spin reads at this tiny size */}
            <circle cx="17" cy="31.5" r="1.4" fill="var(--card)" opacity=".9" />
          </g>
          <g data-wheel>
            <circle cx="43" cy="36" r="6.5" fill="var(--ink)" />
            <circle cx="43" cy="36" r="2.2" fill="var(--card)" />
            <circle cx="43" cy="31.5" r="1.4" fill="var(--card)" opacity=".9" />
          </g>
        </svg>
      </div>
    </div>
  );
}
