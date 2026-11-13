import type { CSSProperties } from "react";
import type { Concept } from "@/lib/concepts";
import { conceptColorVar } from "@/lib/concepts";

const INK = "#202020";
const PAPER = "#f8f3e9";
const WINDOW = "#26231f";

const STRIPES = Array.from({ length: 8 }, (_, i) => i);

/**
 * The PRAVEO cart, redrawn for the editorial direction: fine linework, a warm
 * paper body and the concept colour used only as a quiet identifier. The wheel
 * groups carry [data-wheel] so the scroll-driven street can still spin them.
 */
export default function CartArt({
  concept,
  className,
  title,
  style,
}: {
  concept?: Concept;
  className?: string;
  title?: string;
  style?: CSSProperties;
}) {
  const accent = concept ? conceptColorVar[concept.key] : "var(--c)";
  const label = title ?? (concept ? `${concept.name} cart` : "PRAVEO cart");

  return (
    <svg
      viewBox="0 0 520 300"
      className={className}
      style={{ ...style, "--c": accent } as CSSProperties}
      role="img"
      aria-label={label}
    >
      <title>{label}</title>

      {/* Ground */}
      <ellipse cx="260" cy="294" rx="190" ry="5" fill={INK} opacity=".07" />
      <path d="M48 296H472" stroke={INK} strokeOpacity=".18" strokeWidth="1" />

      {/* Roof sign */}
      <rect
        x="136"
        y="58"
        width="196"
        height="30"
        rx="2"
        fill={PAPER}
        stroke={INK}
        strokeWidth="1.5"
      />
      <text
        x="234"
        y="78"
        textAnchor="middle"
        fontFamily="var(--font-inter), sans-serif"
        fontSize="12"
        fontWeight="600"
        letterSpacing="5"
        fill={INK}
      >
        PRAVEO
      </text>

      {/* Roof */}
      <path
        d="M54 94H430L448 124H36Z"
        fill="var(--c)"
        stroke={INK}
        strokeWidth="2"
      />

      {/* Awning */}
      <g>
        {STRIPES.map((i) => {
          const x = 44 + i * 50.25;
          return (
            <path
              key={i}
              d={`M${x} 124 L${x + 9} 158 H${x + 59.25} L${x + 50.25} 124Z`}
              fill={i % 2 === 0 ? "var(--c)" : PAPER}
              stroke={INK}
              strokeWidth="1"
            />
          );
        })}
      </g>

      {/* Main body */}
      <rect
        x="46"
        y="158"
        width="396"
        height="102"
        fill={PAPER}
        stroke={INK}
        strokeWidth="2"
      />

      {/* Serving window */}
      <rect
        x="74"
        y="174"
        width="218"
        height="62"
        rx="2"
        fill={WINDOW}
        stroke={INK}
        strokeWidth="1.5"
      />
      <rect x="74" y="174" width="218" height="7" fill={PAPER} opacity=".9" />
      <path d="M84 218H282" stroke={PAPER} strokeWidth="1" opacity=".55" />
      <g fill="var(--c)" stroke={PAPER} strokeWidth="1">
        <rect x="96" y="196" width="30" height="17" rx="2" />
        <rect x="140" y="190" width="34" height="23" rx="2" />
        <rect x="188" y="198" width="30" height="15" rx="2" />
        <rect x="232" y="192" width="34" height="21" rx="2" />
      </g>

      {/* Menu board */}
      <rect
        x="316"
        y="174"
        width="96"
        height="62"
        rx="2"
        fill={PAPER}
        stroke={INK}
        strokeWidth="1.5"
      />
      <text
        x="364"
        y="190"
        textAnchor="middle"
        fontFamily="var(--font-inter), sans-serif"
        fontSize="7.5"
        fontWeight="600"
        letterSpacing="2.4"
        fill={INK}
      >
        MENU
      </text>
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M328 ${201 + i * 8} H396`}
          stroke={INK}
          strokeWidth=".8"
          opacity=".35"
        />
      ))}

      {/* Counter + brand panel */}
      <path d="M62 238H422" stroke={INK} strokeWidth="2" />
      <text
        x="74"
        y="252"
        fontFamily="var(--font-inter), sans-serif"
        fontSize="8"
        fontWeight="600"
        letterSpacing="3.6"
        fill={INK}
      >
        PRAVEO
      </text>
      {concept ? (
        <text
          x="422"
          y="252"
          textAnchor="end"
          fontFamily="var(--font-inter), sans-serif"
          fontSize="8"
          fontWeight="600"
          letterSpacing="3.2"
          fill="var(--c)"
        >
          {concept.name}
        </text>
      ) : (
        <text
          x="422"
          y="252"
          textAnchor="end"
          fontFamily="var(--font-inter), sans-serif"
          fontSize="8"
          fontWeight="500"
          letterSpacing="2.6"
          fill={INK}
          opacity=".55"
        >
          INDIA
        </text>
      )}

      {/* Headlight + side details */}
      <rect
        x="46"
        y="218"
        width="6"
        height="11"
        rx="1"
        fill={PAPER}
        stroke={INK}
        strokeWidth="1.2"
      />
      <path d="M430 178H434V224H430" stroke={INK} strokeWidth="1.5" fill="none" />
      <path d="M204 158V168M236 158V168" stroke={INK} strokeWidth="1.2" />

      {/* Wheels */}
      {[130, 382].map((cx) => (
        <g key={cx} data-wheel>
          <circle
            cx={cx}
            cy="272"
            r="23"
            fill={INK}
            stroke={INK}
            strokeWidth="2"
          />
          <circle
            cx={cx}
            cy="272"
            r="12"
            fill={PAPER}
            stroke={INK}
            strokeWidth="1.4"
          />
          <path
            d={`M${cx} 261V283 M${cx - 11} 272H${cx + 11}
                M${cx - 7.8} 264.2 L${cx + 7.8} 279.8
                M${cx + 7.8} 264.2 L${cx - 7.8} 279.8`}
            stroke={INK}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx={cx} cy="272" r="2.6" fill={INK} />
        </g>
      ))}
    </svg>
  );
}
