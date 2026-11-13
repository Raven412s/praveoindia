"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * Hairline page-progress rule under the header. The accent fill tracks the
 * real scroll position (pinned sections and late-loading media change document
 * height after mount, so the range is re-measured on resize/layout changes).
 */
export default function ScrollProgressTruck() {
  const fillRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    let maxScroll = 1;
    let raf = 0;

    const measure = () => {
      maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
    };

    const apply = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      fill.style.transform = `scaleX(${p})`;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        apply();
      });
    };

    const remeasure = () => {
      measure();
      apply();
    };

    const ro = new ResizeObserver(remeasure);
    measure();
    apply();

    ro.observe(document.documentElement);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-px overflow-hidden"
    >
      <div
        ref={fillRef}
        className="h-full origin-left bg-(--c) transition-[background-color] duration-300"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
