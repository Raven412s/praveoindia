"use client";

import { useCursorElement } from "@/components/globals/cursor/advance-cursor";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const PILLARS = [
  { title: "Clean", text: "Visible prep surfaces, daily cleaning routines and disciplined storage." },
  { title: "Fresh", text: "Covered ingredients, planned prep and food made in small, frequent batches." },
  { title: "Consistent", text: "The same recipes, portions and service on every PRAVEO cart." },
  { title: "Fast", text: "A focused menu and a clear workflow, so good food never means a long wait." },
  { title: "Honest", text: "Clear menu information and real claims only — no fine print." },
];

export default function Standard() {
  // The custom follower draws in var(--ink); keep it legible on the dark band
  // even though the editorial build presents the native cursor.
  const cursor = useCursorElement({
    state: "default",
    backgroundColor: "#ffffff",
  });

  return (
    <section
      id="standard"
      {...cursor}
      className="bg-(--deep) py-24 text-(--deep-ink)"
    >
      <div className="mx-auto w-full max-w-[1180px] px-5">
        <Reveal>
          <SectionHeading
            eyebrow="The PRAVEO standard"
            title={
              <>
                Good food.
                <br />
                <span className="italic">Done right.</span>
              </>
            }
            description="Hygiene isn’t a claim here — it’s visible behaviour on every cart. These are the five things that never change, whatever the concept."
            dark
          />
        </Reveal>

        <Reveal className="mt-14" y={26}>
          <ul className="grid list-none grid-cols-1 border-t border-(--deep-ink)/15 min-[640px]:grid-cols-2 min-[980px]:grid-cols-5">
            {PILLARS.map((pillar, index) => (
              <li
                key={pillar.title}
                className="border-b border-(--deep-ink)/15 py-6 min-[640px]:pr-6 min-[980px]:border-b-0 min-[980px]:border-r min-[980px]:pl-6 min-[980px]:first:pl-0 min-[980px]:last:border-r-0"
              >
                <p className="font-serif text-[12px] italic text-(--deep-ink)/40">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em]">
                  {pillar.title}
                </h3>
                <p className="mt-3 max-w-[190px] text-[12.5px] leading-[1.7] text-(--deep-ink)/60">
                  {pillar.text}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
