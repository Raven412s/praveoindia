import Reveal from "./Reveal";

const PRINCIPLES = [
  {
    number: "01",
    title: "Freshly prepared",
    text: "Covered ingredients, planned prep and food made to order — not held under a lamp.",
  },
  {
    number: "02",
    title: "Clear standards",
    text: "Clean surfaces, honest menus and the same recipes, portions and service on every cart.",
  },
  {
    number: "03",
    title: "Placed with purpose",
    text: "The right concept in the right part of the city, so good food is always within reach.",
  },
];

export default function Manifesto() {
  return (
    <section className="border-y border-(--line) bg-(--surface) py-24">
      <div className="mx-auto w-full max-w-[1180px] px-5">
        <div className="grid gap-12 min-[920px]:grid-cols-[0.95fr_1.05fr] min-[920px]:gap-16">
          <Reveal>
            <p className="eyebrow">The PRAVEO idea</p>
            <h2 className="mt-6 font-serif text-[clamp(40px,4.8vw,70px)] font-normal leading-[0.98] tracking-[-0.03em]">
              Good food,
              <br />
              <span className="italic">right where life happens.</span>
            </h2>
          </Reveal>

          <Reveal className="flex flex-col justify-end" delay={0.08}>
            <p className="max-w-[540px] text-[16px] leading-[1.75] text-(--muted-ink)">
              PRAVEO is built around a simple belief: the food you want should be
              easy to find, easy to understand and good enough to come back to.
              Five carts. Five moods. One consistent standard behind every one.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-0 border-t border-(--line) min-[620px]:grid-cols-3">
              {PRINCIPLES.map((principle) => (
                <div
                  key={principle.number}
                  className="border-b border-(--line) py-6 min-[620px]:border-b-0 min-[620px]:border-r min-[620px]:pr-6 min-[620px]:last:border-r-0"
                >
                  <p className="font-serif text-[13px] italic text-(--muted-ink)">
                    {principle.number}
                  </p>
                  <h3 className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em]">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-[1.65] text-(--muted-ink)">
                    {principle.text}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
