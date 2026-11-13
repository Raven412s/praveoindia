"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useCursorElement } from "@/components/globals/cursor/advance-cursor";
import {
  ACCENT_SYNC_EVENT,
  applyConceptColors,
  concepts,
  conceptColorVar,
  type Concept,
  type ConceptKey,
} from "@/lib/concepts";
import CartArt from "./CartArt";

const pad = (n: number) => String(n).padStart(2, "0");

function ConceptTab({
  concept,
  active,
  onPick,
}: {
  concept: Concept;
  active: boolean;
  onPick: (key: ConceptKey) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onPick(concept.key)}
      className={`group flex shrink-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition-opacity duration-300 ${
        active ? "opacity-100" : "opacity-60 hover:opacity-85"
      }`}
    >
      <span
        aria-hidden="true"
        className={`size-2 rounded-full transition-transform duration-300 ${
          active ? "scale-125" : "scale-100"
        }`}
        style={{ background: conceptColorVar[concept.key] }}
      />
      <span
        className={`border-b pb-0.5 transition-colors duration-300 ${
          active ? "border-(--ink)" : "border-transparent"
        }`}
      >
        {concept.name}
      </span>
    </button>
  );
}

export default function ConceptPicker() {
  const [active, setActive] = useState<ConceptKey>("brew");
  const pointer = useCursorElement({ state: "pointer" });

  const current = concepts.find((c) => c.key === active) ?? concepts[0];
  const currentIndex = concepts.findIndex((c) => c.key === active);

  function pick(key: ConceptKey) {
    setActive(key);
    const concept = concepts.find((c) => c.key === key);
    if (concept) applyConceptColors(concept);
  }

  // Keep the page accent aligned with the active concept, and take it back
  // after scroll-driven sections hand it over via ACCENT_SYNC_EVENT.
  useEffect(() => {
    applyConceptColors(current);
    const sync = () => applyConceptColors(current);
    window.addEventListener(ACCENT_SYNC_EVENT, sync);
    return () => window.removeEventListener(ACCENT_SYNC_EVENT, sync);
  }, [current]);

  return (
    <div className="mt-12">
      <div
        className="flex flex-nowrap items-center gap-x-[18px] overflow-x-auto border-y border-(--line) py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[640px]:gap-x-8"
        role="group"
        aria-label="PRAVEO concepts"
      >
        {concepts.map((concept) => (
          <ConceptTab
            key={concept.key}
            concept={concept}
            active={active === concept.key}
            onPick={pick}
          />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 overflow-hidden border border-(--line) bg-(--card) min-[840px]:grid-cols-[0.95fr_1.05fr]">
        <div
          className="relative flex min-h-[380px] flex-col justify-between border-b border-(--line) p-7 min-[840px]:min-h-[460px] min-[840px]:border-b-0 min-[840px]:border-r min-[840px]:p-10"
          style={{
            background: `color-mix(in srgb, ${conceptColorVar[current.key]} 11%, var(--card))`,
          }}
        >
          <div className="flex items-start justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-(--muted-ink)">
              Concept {pad(currentIndex + 1)} / 05
            </p>
            <span
              aria-hidden="true"
              className="size-2.5 rounded-full"
              style={{ background: conceptColorVar[current.key] }}
            />
          </div>

          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-serif text-[clamp(52px,6vw,82px)] font-normal leading-[0.85] tracking-[-0.04em]">
              {current.name}
            </p>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-(--muted-ink)">
              {current.subtitle}
            </p>
          </motion.div>

          <motion.div
            key={`${current.key}-art`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex justify-end"
          >
            <CartArt
              concept={current}
              className="w-[min(100%,320px)]"
            />
          </motion.div>
        </div>

        <div className="p-7 min-[840px]:p-10">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-serif text-[clamp(25px,2.8vw,34px)] font-normal italic leading-[1.2] tracking-[-0.015em]">
              “{current.tagline}”
            </p>

            <dl className="mt-10 border-t border-(--line)">
              <div className="grid grid-cols-[100px_1fr] gap-5 border-b border-(--line) py-4">
                <dt className="text-[9px] font-semibold uppercase tracking-[0.18em] text-(--muted-ink)">
                  What’s on
                </dt>
                <dd className="text-[14.5px] leading-[1.6]">{current.whatsOn}</dd>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-5 border-b border-(--line) py-4">
                <dt className="text-[9px] font-semibold uppercase tracking-[0.18em] text-(--muted-ink)">
                  Best near
                </dt>
                <dd className="text-[14.5px] leading-[1.6]">{current.place}</dd>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-5 border-b border-(--line) py-4">
                <dt className="text-[9px] font-semibold uppercase tracking-[0.18em] text-(--muted-ink)">
                  Character
                </dt>
                <dd className="text-[14.5px] leading-[1.6]">{current.personality}</dd>
              </div>
            </dl>

            <Link
              {...pointer}
              href="#find"
              className="hairline-link mt-8 text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              Find {current.name} near you
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
