"use client";

import { useEffect, useRef, type CSSProperties } from "react";

interface MascotProps {
  className?: string;
  /** When set, the mascot is exposed as role="img" with this label; otherwise aria-hidden. */
  title?: string;
  /** Allows per-instance colour override, e.g. style={{ "--c": "var(--bite)" }}. */
  style?: CSSProperties;
  /**
   * Makes the pupils track the pointer inside their corneas. Tracking runs
   * only while the pointer is inside the mascot's nearest <section> (the
   * hero), and is skipped entirely on touch devices and under
   * prefers-reduced-motion.
   */
  interactive?: boolean;
}

/** Cornea centres in viewBox units (viewBox is 200×220). */
const EYES = [
  { cx: 74, cy: 102 },
  { cx: 126, cy: 102 },
] as const;

/** How far a pupil may drift from its cornea centre, in viewBox units. */
const PUPIL_TRAVEL = 7;

export default function Mascot({
  className,
  title,
  style,
  interactive = false,
}: MascotProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pupilRefs = useRef<Array<SVGCircleElement | null>>([]);
  const glintRefs = useRef<Array<SVGCircleElement | null>>([]);

  useEffect(() => {
    if (!interactive) return;
    const svg = svgRef.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // Track only while the pointer is inside the mascot's section (the hero).
    const scope: HTMLElement = svg.closest("section") ?? document.documentElement;

    const target = EYES.map(() => ({ x: 0, y: 0 }));
    const current = EYES.map(() => ({ x: 0, y: 0 }));
    let inside = false;
    let raf = 0;

    const toViewBox = (clientX: number, clientY: number) => {
      const rect = svg.getBoundingClientRect();
      return {
        x: ((clientX - rect.left) / rect.width) * 200,
        y: ((clientY - rect.top) / rect.height) * 220,
      };
    };

    const onMove = (event: MouseEvent) => {
      const p = toViewBox(event.clientX, event.clientY);
      EYES.forEach((eye, i) => {
        const dx = p.x - eye.cx;
        const dy = p.y - eye.cy;
        const len = Math.hypot(dx, dy) || 1;
        // Per-eye gaze vector, clamped so the pupil stays inside its cornea.
        const clamped = Math.min(len, PUPIL_TRAVEL) / len;
        target[i].x = dx * clamped;
        target[i].y = dy * clamped;
      });
      ensureLoop();
    };

    const onEnter = () => {
      inside = true;
      ensureLoop();
    };

    const onLeave = () => {
      inside = false;
      for (const t of target) {
        t.x = 0;
        t.y = 0;
      }
    };

    const apply = () => {
      EYES.forEach((_, i) => {
        pupilRefs.current[i]?.setAttribute(
          "transform",
          `translate(${current[i].x} ${current[i].y})`
        );
        glintRefs.current[i]?.setAttribute(
          "transform",
          `translate(${current[i].x} ${current[i].y})`
        );
      });
    };

    const loop = () => {
      // Keep easing while the pointer is inside; after it leaves, run until
      // the pupils settle back to centre, then stop the loop entirely.
      let settled = !inside;
      EYES.forEach((_, i) => {
        current[i].x += (target[i].x - current[i].x) * 0.2;
        current[i].y += (target[i].y - current[i].y) * 0.2;
        if (
          Math.abs(target[i].x - current[i].x) > 0.05 ||
          Math.abs(target[i].y - current[i].y) > 0.05
        ) {
          settled = false;
        }
      });
      apply();
      if (settled) {
        raf = 0;
        return;
      }
      raf = window.requestAnimationFrame(loop);
    };

    const ensureLoop = () => {
      if (raf === 0) raf = window.requestAnimationFrame(loop);
    };

    scope.addEventListener("pointerenter", onEnter);
    scope.addEventListener("pointermove", onMove, { passive: true });
    scope.addEventListener("pointerleave", onLeave);

    return () => {
      scope.removeEventListener("pointerenter", onEnter);
      scope.removeEventListener("pointermove", onMove);
      scope.removeEventListener("pointerleave", onLeave);
      if (raf !== 0) window.cancelAnimationFrame(raf);
    };
  }, [interactive]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 220"
      className={className}
      style={style}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <ellipse cx="100" cy="209" rx="54" ry="7" fill="#0003" />
      <path
        d="M24 132q-20 4-18 24M176 126q22-8 18-36"
        stroke="#202020"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="74" cy="204" rx="17" ry="8" fill="#202020" />
      <ellipse cx="126" cy="204" rx="17" ry="8" fill="#202020" />
      <path
        d="M100 38c52 0 78 34 78 84 0 50-30 78-78 78S22 172 22 122c0-50 26-84 78-84z"
        fill="var(--c)"
        stroke="#202020"
        strokeWidth="6"
      />
      {/* Leaf — the exact artwork from the PRAVEO logo, scaled into place. */}
      <g transform="translate(92 2) scale(0.3)">
        <path
          d="M138.5 1.69354C120.739 5.47854 91.684 13.1835 77.5 17.8705C35.339 31.8015 11.94 51.0765 2.316 79.8035C0.35 85.6715 0 88.7605 0 100.218C0 115.465 1.792 123.191 8.143 135.33C11.306 141.375 16.913 148.181 17.876 147.145C18.094 146.91 21.198 140.868 24.773 133.718C35.893 111.479 47.512 94.2385 62.029 78.4365C72.123 67.4505 93.829 51.4285 101.086 49.6065L103.854 48.9115L101.475 52.3145C100.167 54.1865 95.685 59.9925 91.515 65.2175C63.571 100.233 49.631 121.531 38.903 145.597C36.482 151.03 34.5 155.626 34.5 155.808C34.5 157.171 45.024 158.572 55 158.539C75.918 158.468 91.837 152.264 106.584 138.434C118.812 126.966 127.054 112.525 133.37 91.5005C135.666 83.8545 142.248 51.4715 144.911 34.7175C145.785 29.2175 147.363 19.3175 148.418 12.7175C149.473 6.11754 150.036 0.43354 149.668 0.0865398C149.301 -0.25946 144.275 0.463542 138.5 1.69354Z"
          fill="#8FD400"
          fillRule="evenodd"
          clipRule="evenodd"
          stroke="#202020"
          strokeWidth="7"
          strokeLinejoin="round"
        />
      </g>
      <circle
        cx="74"
        cy="102"
        r="17"
        fill="#fff"
        stroke="#202020"
        strokeWidth="5"
      />
      <circle
        cx="126"
        cy="102"
        r="17"
        fill="#fff"
        stroke="#202020"
        strokeWidth="5"
      />
      <circle
        ref={(el) => {
          pupilRefs.current[0] = el;
        }}
        cx="79"
        cy="104"
        r="8"
        fill="#202020"
      />
      <circle
        ref={(el) => {
          pupilRefs.current[1] = el;
        }}
        cx="131"
        cy="104"
        r="8"
        fill="#202020"
      />
      <circle
        ref={(el) => {
          glintRefs.current[0] = el;
        }}
        cx="82"
        cy="100"
        r="3"
        fill="#fff"
      />
      <circle
        ref={(el) => {
          glintRefs.current[1] = el;
        }}
        cx="134"
        cy="100"
        r="3"
        fill="#fff"
      />
      <path
        d="M76 142q24 26 48 0z"
        fill="#fff"
        stroke="#202020"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <circle cx="52" cy="128" r="8" fill="#fff" opacity=".4" />
      <circle cx="148" cy="128" r="8" fill="#fff" opacity=".4" />
    </svg>
  );
}
