"use client";

import { useCursorElement } from "@/components/globals/cursor/advance-cursor";
import Reveal from "./Reveal";
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
    <tr {...cursor} className="border-t-2 border-(--ink)">
      <td className="px-4 py-3 text-[15px] font-bold">{row.where}</td>
      <td className="px-4 py-3 text-[15px]">
        <span
          className="mr-2 inline-block size-3 rounded-full border-2 border-(--ink) align-[-1px]"
          style={{ background: conceptColorVar[main.key] }}
        />
        <span className="font-extrabold">{main.name}</span>
      </td>
      <td className="px-4 py-3 text-[15px] font-bold">{also.name}</td>
    </tr>
  );
}

export default function FindSection() {
  return (
    <section id="find" className="py-20">
      <div className="mx-auto w-full max-w-[1160px] px-5">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em]">
            FIND YOUR PRAVEO
          </p>
          <h2 className="mt-3 text-[clamp(32px,5vw,56px)] font-black leading-[1.02] tracking-[-0.02em]">
            The place decides the cart.
          </h2>
          <p className="mt-4 max-w-[600px] text-[17px] opacity-85">
            We put the right concept where it fits your day. Live map and
            opening status are coming soon.
          </p>
        </Reveal>

        <Reveal className="mt-10" y={32}>
        <div className="overflow-x-auto rounded-[20px] border-2 border-(--ink) bg-(--card)">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-(--ink) text-(--bg)">
                <th
                  scope="col"
                  className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em]"
                >
                  Where
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em]"
                >
                  Main cart
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em]"
                >
                  Also
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
        <p className="mt-3 text-xs opacity-65">
          Placeholder: real cart locations, hours and map will plug in here.
        </p>
      </div>
    </section>
  );
}
