import CountUp from "./CountUp";

const STATS = [
  { value: 5, suffix: "", label: "Food concepts" },
  { value: 1, suffix: "", label: "Quality standard" },
  { value: 1, suffix: "", label: "QR on every cart" },
  { value: 100, suffix: "%", label: "Your vybe" },
];

function cellClass(i: number): string {
  // Vertical dividers: 2x2 on mobile, one row of 4 from 620px up.
  const left =
    i === 0
      ? "border-l-0"
      : i % 2 === 1
        ? "border-l-2"
        : "border-l-0 min-[620px]:border-l-2";
  const top = i > 1 ? "border-t-2 min-[620px]:border-t-0" : "";
  return `border-(--ink) ${left} ${top}`;
}

export default function Stats() {
  return (
    <section aria-label="PRAVEO at a glance" className="border-y-2 border-(--ink)">
      <div className="mx-auto grid w-full max-w-[1160px] grid-cols-2 min-[620px]:grid-cols-4">
        {STATS.map((stat, i) => (
          <div key={stat.label} className={`px-5 py-8 min-[620px]:py-10 ${cellClass(i)}`}>
            <p className="text-[clamp(26px,4vw,44px)] font-black leading-none">
              <CountUp value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
