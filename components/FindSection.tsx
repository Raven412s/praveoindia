"use client";

import { useCursorElement } from "@/components/globals/cursor/advance-cursor";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { Concept, conceptColorVar, concepts, type ConceptKey } from "@/lib/concepts";

interface PlaceRow {
  where: string;
  main: ConceptKey;
  also: ConceptKey;
}

const ROWS: PlaceRow[] = [
  { where: "Gyms & sports zones", main: "pro", also: "shake" },
  { where: "Colleges & student areas", main: "bite", also: "shake" },
  { where: "Offices & commercial zones", main: "brew", also: "fresh" },
  { where: "Parks & morning walks", main: "fresh", also: "shake" },
  { where: "Busy markets", main: "bite", also: "brew" },
];

const conceptMap = Object.fromEntries(
  concepts.map((concept) => [concept.key, concept])
) as Record<ConceptKey, Concept>;

function Row({ row }: { row: PlaceRow }) {
  const main = conceptMap[row.main];
  const also = conceptMap[row.also];

  // Hovering a row labels the cursor with the main cart's name in its colour.
  const cursor = useCursorElement({
    state: "text",
    text: main.name,
    backgroundColor: conceptColorVar[main.key],
  });

  return (
    <tr
      {...cursor}
      className="border-b border-(--line) transition-colors duration-300 hover:bg-(--surface)/60"
    >
      <td className="px-1 py-5 font-serif text-[20px] leading-none tracking-[-0.015em] min-[640px]:px-4">
        {row.where}
      </td>
      <td className="px-1 py-5 text-[13px] min-[640px]:px-4">
        <span
          className="mr-2.5 inline-block size-2 rounded-full align-[1px]"
          style={{ background: conceptColorVar[main.key] }}
        />
        <span className="font-medium">{main.name}</span>
      </td>
      <td className="px-1 py-5 text-[13px] text-(--muted-ink) min-[640px]:px-4">
        {also.name}
      </td>
    </tr>
  );
}

export default function FindSection() {
  return (
    <section id="find" className="py-24">
      <div className="mx-auto w-full max-w-[1180px] px-5">
        <Reveal>
          <SectionHeading
            eyebrow="Find your PRAVEO"
            title="The place decides the cart."
            description="We put the right concept where it fits your day. Live cart locations, opening status and directions are coming soon."
          />
        </Reveal>

        <Reveal className="mt-12" y={24}>
          <div className="overflow-x-auto border-t border-(--line)">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-1 py-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-(--muted-ink) min-[640px]:px-4"
                  >
                    Where
                  </th>
                  <th
                    scope="col"
                    className="px-1 py-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-(--muted-ink) min-[640px]:px-4"
                  >
                    Main cart
                  </th>
                  <th
                    scope="col"
                    className="px-1 py-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-(--muted-ink) min-[640px]:px-4"
                  >
                    Also nearby
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <Row key={row.where} row={row} />
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <p className="mt-4 text-[11px] leading-relaxed text-(--muted-ink)">
          Placeholder: real cart locations, hours and map will plug in here.
        </p>
      </div>
    </section>
  );
}
