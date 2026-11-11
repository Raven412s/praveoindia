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

const pillBase =
  "rounded-full border-[3px] border-(--ink) px-6 py-3 text-sm font-extrabold uppercase tracking-[0.06em] transition-[background-color,color,box-shadow,transform] duration-300";

const pillActive =
  "bg-(--c) text-(--on) shadow-[3px_3px_0_var(--ink)] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_var(--ink)]";

// Hovering a chip fills it with that concept's own colour.
const pillInactive =
  "bg-(--card) hover:bg-(--chip) hover:text-(--chip-on) hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[3px_3px_0_var(--ink)]";

const fieldLabel =
  "text-[11px] font-extrabold uppercase tracking-[0.14em] opacity-60";

const accent =
  "transition-[background-color,color] duration-300";

function ConceptChip({
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
      style={
        {
          "--chip": conceptColorVar[concept.key],
          "--chip-on": concept.on,
        } as React.CSSProperties
      }
      className={`${pillBase} ${active ? pillActive : pillInactive}`}
    >
      {concept.name}
    </button>
  );
}

export default function ConceptPicker() {
  const [active, setActive] = useState<ConceptKey>("pro");
  const pointer = useCursorElement({ state: "pointer" });

  const current = concepts.find((c) => c.key === active) ?? concepts[0];

  function pick(key: ConceptKey) {
    setActive(key);
    const concept = concepts.find((c) => c.key === key);
    if (concept) applyConceptColors(concept);
  }

  // Scroll-driven sections repaint the global accent while they own it;
  // when they finish, they fire ACCENT_SYNC_EVENT and we re-apply the
  // user's chosen concept so picker and page agree again.
  useEffect(() => {
    const sync = () => applyConceptColors(current);
    window.addEventListener(ACCENT_SYNC_EVENT, sync);
    return () => window.removeEventListener(ACCENT_SYNC_EVENT, sync);
  }, [current]);

  return (
    <div className="mt-10">
      <div className="flex flex-wrap gap-3" role="group" aria-label="PRAVEO concepts">
        {concepts.map((concept) => (
          <ConceptChip
            key={concept.key}
            concept={concept}
            active={active === concept.key}
            onPick={pick}
          />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 overflow-hidden rounded-[28px] border-[3px] border-(--ink) bg-(--card) min-[760px]:grid-cols-2">
        <div className={`${accent} bg-(--c) p-9 text-(--on)`}>
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[clamp(36px,5vw,56px)] font-black leading-none">
              PRAVEO
            </p>
            <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.14em] opacity-90">
              / {current.name} — {current.subtitle}
            </p>
            <p className="mt-10 text-[22px] font-extrabold leading-snug">
              “{current.tagline}”
            </p>
          </motion.div>
        </div>
        <div className="p-9">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            <dl className="space-y-5">
              <div>
                <dt className={fieldLabel}>What’s on</dt>
                <dd className="mt-1 text-[18px] font-bold">{current.whatsOn}</dd>
              </div>
              <div>
                <dt className={fieldLabel}>Best found near</dt>
                <dd className="mt-1 text-[18px] font-bold">{current.place}</dd>
              </div>
              <div>
                <dt className={fieldLabel}>Personality</dt>
                <dd className="mt-1 text-[18px] font-bold">
                  {current.personality}
                </dd>
              </div>
            </dl>
            <Link
              {...pointer}
              href="#find"
              className={`${accent} mt-9 inline-flex h-12 items-center rounded-full border-[3px] border-(--ink) bg-(--c) px-7 text-[15px] font-extrabold text-(--on) shadow-[3px_3px_0_var(--ink)] transition-[background-color,color,box-shadow,transform] duration-300 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_var(--ink)]`}
            >
              Find {current.name} near you
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
