"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CartArt from "./CartArt";
import SectionHeading from "./SectionHeading";
import {
  ACCENT_SYNC_EVENT,
  applyConceptColors,
  concepts,
  conceptColorVar,
  type Concept,
} from "@/lib/concepts";

gsap.registerPlugin(ScrollTrigger);

/** Street edge padding — matches the max-w container's content start. */
const STREET_PAD = "max(20px, calc((100vw - 1140px) / 2))";

/** Truck geometry in viewBox units — used to sync wheel spin with travel. */
const TRUCK_VIEW_W = 520;
const WHEEL_RADIUS = 23;

export function StreetCart({
  concept,
  index,
  active,
}: {
  concept: Concept;
  index: number;
  active: boolean;
}) {
  return (
    <article
      className={`group relative flex w-[82vw] max-w-[430px] shrink-0 origin-bottom flex-col items-center transition-[opacity,scale] duration-500 ease-out min-[820px]:w-[430px] ${
        active ? "scale-100 opacity-100" : "scale-[0.97] opacity-40"
      }`}
      style={
        {
          "--c": conceptColorVar[concept.key],
          "--on": concept.on,
        } as CSSProperties
      }
    >
      {/* Stop marker — floats above whichever cart is crossing the stage */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] font-semibold uppercase tracking-[0.2em] text-(--muted-ink) transition-[opacity,translate] duration-500 ${
          active ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        Stop {String(index + 1).padStart(2, "0")} / 05
      </span>

      <div className="w-full px-4 text-center">
        <h3
          className={`font-serif text-[38px] font-normal leading-none tracking-[-0.03em] transition-colors duration-500 ${
            active ? "text-(--c)" : "text-(--ink)"
          }`}
        >
          {concept.name}
        </h3>

        <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-(--muted-ink)">
          {concept.subtitle}
        </p>

        <p className="mt-4 font-serif text-[19px] italic leading-snug">
          “{concept.tagline}”
        </p>

        <p className="mx-auto mt-2 max-w-[320px] text-[12.5px] leading-relaxed text-(--muted-ink)">
          {concept.whatsOn}
        </p>
      </div>

      <div className="relative mt-4 w-full transition-transform duration-500 ease-out group-hover:-translate-y-1">
        <CartArt concept={concept} />
      </div>
    </article>
  );
}

/**
 * Scroll-driven "food street": the viewport pins and the street translates
 * horizontally as the user scrolls, walking past one cart per concept. While a
 * cart crosses the stage, the global accent is repainted in its colour. Without
 * JS or under reduced motion this degrades to a horizontally swipeable row.
 */
export default function CartStreet() {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!root || !viewport || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Measured once per ScrollTrigger refresh — never inside onUpdate, so
    // the scroll loop stays free of layout reads.
    let distance = 0;
    let wheelCirc = (430 / TRUCK_VIEW_W) * 2 * Math.PI * WHEEL_RADIUS;
    const measure = () => {
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      const card = track.querySelector<HTMLElement>("article");
      if (card) {
        wheelCirc = (card.offsetWidth / TRUCK_VIEW_W) * 2 * Math.PI * WHEEL_RADIUS;
      }
    };
    measure();
    ScrollTrigger.addEventListener("refresh", measure);

    const ctx = gsap.context(() => {
      // Live mode: the swipe row becomes a full-height pinned stage.
      gsap.set(viewport, {
        overflow: "hidden",
        height: "100svh",
        display: "flex",
        alignItems: "center",
      });

      const wheels = gsap.utils.toArray<SVGGElement>("[data-wheel]", track);
      // Explicit origin + one write so GSAP caches the SVG bbox centre
      // before quickSetter starts writing rotation each frame.
      gsap.set(wheels, { rotation: 0, transformOrigin: "50% 50%" });
      const setWheelRotation = gsap.quickSetter(wheels, "rotation");

      gsap.to(track, {
        x: () => -distance,
        ease: "none",
        scrollTrigger: {
          trigger: viewport,
          start: "top top",
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              concepts.length - 1,
              Math.round(self.progress * (concepts.length - 1))
            );
            if (idx !== activeRef.current) {
              activeRef.current = idx;
              setActive(idx);
              applyConceptColors(concepts[idx]);
            }
            // Trucks roll leftwards as the street travels — angle equals
            // travelled distance divided by the wheel's circumference.
            setWheelRotation(-self.progress * ((distance / wheelCirc) * 360));
          },
          // Hand the accent back to ConceptPicker once the street is done.
          onLeave: () => window.dispatchEvent(new Event(ACCENT_SYNC_EVENT)),
          onLeaveBack: () => window.dispatchEvent(new Event(ACCENT_SYNC_EVENT)),
        },
      });
    }, root);

    return () => {
      ScrollTrigger.removeEventListener("refresh", measure);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="pt-24">
      <div className="mx-auto w-full max-w-[1180px] px-5">
        <SectionHeading
          eyebrow="One street. Five stops."
          title="Take a walk."
          description="Scroll on — the street rolls past one colour-coded cart at a time. Each has its own speciality, its own personality and the same PRAVEO standard behind it."
        />
      </div>

      <div ref={viewportRef} className="relative mt-8 overflow-x-auto">
        {/* Colour wash that follows the cart currently crossing the stage */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 opacity-[0.055] transition-[background-color] duration-700"
          style={{ background: conceptColorVar[concepts[active].key] }}
        />

        <div
          ref={trackRef}
          className="relative z-10 flex w-max shrink-0 items-end gap-10 pb-12"
          style={{
            paddingLeft: STREET_PAD,
            paddingRight: STREET_PAD,
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-12 border-t border-dashed border-(--ink)/20"
          />

          {concepts.map((concept, i) => (
            <StreetCart
              key={concept.key}
              concept={concept}
              index={i}
              active={i === active}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
