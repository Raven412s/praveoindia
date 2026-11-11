"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./Reveal";
import LogoPath from "./LogoPath";
import {
  ACCENT_SYNC_EVENT,
  applyConceptColors,
  concepts,
  conceptColorVar,
  type Concept,
} from "@/lib/concepts";

gsap.registerPlugin(ScrollTrigger);

/** Street edge padding — matches the max-w container's content start. */
const STREET_PAD = "max(20px, calc((100vw - 1120px) / 2))";

/** Awning stripe count. */
const STRIPES = 8;

/** Truck geometry in viewBox units — used to sync wheel spin with travel. */
const TRUCK_VIEW_W = 480;
const WHEEL_RADIUS = 27;

function FoodTruckIllustration({ concept }: { concept: Concept }) {
  const stripes = Array.from({ length: STRIPES }, (_, i) => i);

  return (
    <svg
      viewBox="0 0 480 309"
      className="h-auto w-full overflow-visible"
      role="img"
      aria-label={`${concept.name} food truck`}
      style={
        {
          "--c": conceptColorVar[concept.key],
          "--on": concept.on,
        } as CSSProperties
      }
    >
      {/* Ground shadow — drawn just past the viewBox bottom so it lands on
          the dashed street line while the wheels rest on it. */}
      <ellipse cx="240" cy="306" rx="195" ry="11" fill="#0003" />

      {/* Roof */}
      <path
        d="M48 95 L78 45 H393 L424 95Z"
        fill="var(--c)"
        stroke="var(--ink)"
        strokeWidth="5"
      />

      {/* Roof sign — carries the real PRAVEO lockup, recoloured per cart
          via var(--on) so it stays legible on every concept colour. */}
      <rect
        x="88"
        y="52"
        width="305"
        height="45"
        rx="8"
        fill="var(--c)"
        stroke="var(--ink)"
        strokeWidth="4"
      />
      <svg
        x="135"
        y="57.5"
        width="210"
        height="34"
        viewBox="0 0 1731 281"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        className=""
      >
        <LogoPath fill="var(--on)" />
      </svg>

      {/* Awning */}
      <path
        d="M40 102 H440 L425 139 H55Z"
        fill="var(--c)"
        stroke="var(--ink)"
        strokeWidth="5"
      />

      {stripes.map((i) => (
        <path
          key={i}
          d={`M${40 + i * 50} 102 L${55 + i * 46} 139 H${101 + i * 46} L${
            90 + i * 50
          } 102Z`}
          fill={i % 2 === 0 ? "#fff3" : "var(--c)"}
          stroke="var(--ink)"
          strokeWidth="1.5"
        />
      ))}

      {/* Main truck body */}
      <path
        d="M45 139 H435 V264 H45Z"
        fill="var(--c)"
        stroke="var(--ink)"
        strokeWidth="6"
      />

      {/* Serving window */}
      <rect
        x="76"
        y="153"
        width="245"
        height="83"
        rx="5"
        fill="#29251F"
        stroke="var(--ink)"
        strokeWidth="5"
      />

      {/* Window top */}
      <rect x="76" y="153" width="245" height="13" fill="#EADCC1" />

      {/* Interior shelf */}
      <path d="M85 205 H312" stroke="#EADCC1" strokeWidth="4" />

      {/* Food containers */}
      <g fill="var(--c)" stroke="#F8F2E5" strokeWidth="2">
        <rect x="100" y="179" width="31" height="22" rx="4" />
        <rect x="145" y="173" width="32" height="28" rx="4" />
        <rect x="190" y="181" width="32" height="20" rx="4" />
        <rect x="237" y="175" width="35" height="26" rx="4" />
      </g>

      {/* Serving counter */}
      <path d="M65 237 H335" stroke="var(--ink)" strokeWidth="9" />

      {/* Menu board */}
      <rect
        x="340"
        y="151"
        width="78"
        height="83"
        rx="4"
        fill="#24211D"
        stroke="var(--ink)"
        strokeWidth="3"
      />
      <text
        x="379"
        y="168"
        textAnchor="middle"
        fontSize="10"
        fontWeight="900"
        fill="#fff"
      >
        MENU
      </text>
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M352 ${180 + i * 12} H405`}
          stroke="#F8F2E5"
          strokeWidth="2"
          opacity=".8"
        />
      ))}

      {/* Lower brand panel */}
      <rect x="65" y="247" width="350" height="17" rx="3" fill="var(--on)" opacity=".12" />

      <text
        x="240"
        y="257"
        textAnchor="middle"
        fontSize="14"
        fontWeight="900"
        letterSpacing="2"
        fill="var(--on)"
      >
        {`PRAVEO / ${concept.name}`}
      </text>

      {/* Chassis */}
      <path d="M58 271 H425" stroke="var(--ink)" strokeWidth="9" />

      {/* Wheels — spun by the street's travel via [data-wheel].
          Spokes + a tyre notch make the rotation actually readable;
          concentric circles alone look identical at every angle. */}
      {[125, 355].map((cx) => (
        <g key={cx} data-wheel>
          <circle cx={cx} cy="282" r="27" fill="#202020" stroke="#111" strokeWidth="4" />
          <circle cx={cx} cy="282" r="14" fill="#D8D0C0" stroke="#111" strokeWidth="3" />
          <path
            d={`M${cx} 269 V295 M${cx - 13} 282 H${cx + 13}
                M${cx - 9} 273 L${cx + 9} 291 M${cx + 9} 273 L${cx - 9} 291`}
            stroke="#202020"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx={cx} cy="282" r="4.5" fill="#202020" />
          <circle cx={cx} cy="261" r="3" fill="#EADCC1" />
        </g>
      ))}

      {/* Side details */}
      <rect x="426" y="166" width="9" height="55" rx="3" fill="var(--ink)" />

      {/* Headlight */}
      <rect
        x="46"
        y="239"
        width="9"
        height="15"
        rx="2"
        fill="#FFF4C4"
        stroke="var(--ink)"
        strokeWidth="2"
      />
    </svg>
  );
}

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
      className={`group relative flex w-[84vw] max-w-[440px] shrink-0 flex-col items-center origin-bottom min-[820px]:w-[440px] transition-[opacity,scale] duration-500 ease-out ${
        active ? "opacity-100 scale-100" : "opacity-55 scale-[0.94]"
      }`}
      style={
        {
          "--c": conceptColorVar[concept.key],
          "--on": concept.on,
        } as CSSProperties
      }
    >
      {/* Stop marker — floats above whichever cart the user is crossing */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rotate-[-3deg] rounded-full border-2 border-(--ink) bg-(--bg) px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] whitespace-nowrap transition-[opacity,translate] duration-500 ${
          active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        Stop {String(index + 1).padStart(2, "0")} / 05
      </span>

      {/* Cart information, not a card */}
      <div className="w-full px-4 text-center">
        <h3
          className={`text-3xl font-black uppercase tracking-tight transition-[color] duration-500 ${
            active ? "text-(--c)" : ""
          }`}
        >
          {concept.name}
        </h3>

        <p
          className="mt-1 text-xs font-extrabold uppercase
            tracking-[0.16em] opacity-60"
        >
          {concept.subtitle}
        </p>

        <p className="mt-3 text-sm font-bold">{concept.tagline}</p>

        <p className="mx-auto mt-2 max-w-[300px] text-sm opacity-70">
          {concept.whatsOn}
        </p>
      </div>

      {/* Actual food truck — hover lifts it like suspension; wheels spin */}
      <div className="relative mt-1 w-full transition-transform duration-300 ease-out group-hover:-translate-y-2">
        <FoodTruckIllustration concept={concept} />
      </div>
    </article>
  );
}

/**
 * Scroll-driven "food street": the viewport pins and the whole street
 * translates horizontally as the user scrolls, walking past one cart per
 * concept. While a cart crosses the stage, the global accent (--c/--on) is
 * repainted in that cart's colour — the page paints itself as you walk —
 * the active cart pops while its neighbours dim, its stop marker drops in,
 * and every wheel spins at exactly the street's travel speed. When the
 * street ends, ConceptPicker re-applies its own choice via
 * ACCENT_SYNC_EVENT. Without JS or under reduced motion this degrades to a
 * plain horizontally swipeable row.
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
    let wheelCirc = (440 / TRUCK_VIEW_W) * 2 * Math.PI * WHEEL_RADIUS;
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
    <div ref={rootRef} className="mt-20">
      <div className="mx-auto w-full max-w-[1160px] px-5">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em]">
            ONE STREET. FIVE STOPS.
          </p>
          <h2 className="mt-3 text-[clamp(32px,5vw,56px)] font-black leading-[1.02] tracking-[-0.02em]">
            Take a walk.
          </h2>
          <p className="mt-4 max-w-[600px] text-[17px] opacity-85">
            Scroll on — the whole street rolls past, one colour-coded cart at a
            time.
          </p>
        </Reveal>
      </div>

      <div ref={viewportRef} className="relative mt-10 overflow-x-auto">
        {/* Colour wash that follows the cart currently crossing the stage */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 opacity-[0.13] transition-[background-color] duration-700"
          style={{ background: conceptColorVar[concepts[active].key] }}
        />

        <div
          ref={trackRef}
          className="relative z-10 flex w-max shrink-0 items-end gap-8 pb-10"
          style={{
            paddingLeft: STREET_PAD,
            paddingRight: STREET_PAD,
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-10 border-t-[3px]
      border-dashed border-(--ink)"
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
