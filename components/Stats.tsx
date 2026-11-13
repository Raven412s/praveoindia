import CountUp from "./CountUp";

const STATS = [
  { value: 5, suffix: "", label: "Food concepts" },
  { value: 1, suffix: "", label: "Quality standard" },
  { value: 1, suffix: "", label: "QR on every cart" },
  { value: 100, suffix: "%", label: "Freshly prepared" },
];

function cellClass(i: number): string {
  // Hairline dividers: 2x2 on mobile, one row of four from 640px up.
  const left =
    i === 0
      ? "border-l-0"
      : i % 2 === 1
        ? "border-l"
        : "border-l-0 min-[640px]:border-l";
  const top = i > 1 ? "border-t min-[640px]:border-t-0" : "";
  return `border-(--line) ${left} ${top}`;
}

export default function Stats() {
  return (
    <section aria-label="PRAVEO at a glance" className="border-y border-(--line)">
      <div className="mx-auto grid w-full max-w-[1180px] grid-cols-2 px-5 min-[640px]:grid-cols-4 min-[640px]:px-0">
        {STATS.map((stat, i) => (
          <div key={stat.label} className={`px-2 py-9 min-[640px]:px-8 min-[640px]:py-11 ${cellClass(i)}`}>
            <p className="font-serif text-[clamp(34px,4vw,52px)] font-normal leading-none tracking-[-0.03em]">
              <CountUp value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-3 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-(--muted-ink)">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
