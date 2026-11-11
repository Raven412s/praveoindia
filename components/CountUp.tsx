"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Numbers in the stats strip count from 0 the first time they scroll into
 * view (GSAP + ScrollTrigger). Server-renders the final value, so it degrades
 * gracefully without JS or with reduced motion.
 */
export default function CountUp({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const render = (v: number) => {
      el.textContent = `${Math.round(v)}${suffix}`;
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      render(value);
      return;
    }

    const state = { current: 0 };
    const tween = gsap.to(state, {
      current: value,
      duration: 1.4,
      ease: "power2.out",
      paused: true,
      onUpdate: () => render(state.current),
    });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        render(0);
        tween.play();
      },
    });

    return () => {
      tween.kill();
      trigger.kill();
    };
  }, [value, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}
