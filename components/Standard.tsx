import Reveal from "./Reveal";

const PILLARS = [
  { title: "Clean", text: "Visible prep surfaces, daily cleaning routines." },
  { title: "Fresh", text: "Covered ingredients, planned prep." },
  { title: "Consistent", text: "Same recipes, portions and service." },
  { title: "Fast", text: "Focused menu, clear workflow." },
  { title: "Honest", text: "Clear menu info, real claims only." },
];

export default function Standard() {
  return (
    <section id="standard" className="bg-(--ink) py-20 text-(--bg)">
      <div className="mx-auto w-full max-w-[1160px] px-5">
        <Reveal>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em]">
            THE PRAVEO STANDARD
          </p>
          <h2 className="mt-3 text-[clamp(32px,5vw,56px)] font-black leading-[1.02] tracking-[-0.02em]">
            Good food. Done right.
          </h2>
          <p className="mt-4 max-w-[600px] text-[17px] opacity-85">
            Hygiene isn’t a claim here — it’s visible behaviour on every cart.
          </p>
        </Reveal>
        <Reveal className="mt-10" y={32}>
          <ul className="grid list-none grid-cols-1 gap-4 min-[480px]:grid-cols-2 min-[900px]:grid-cols-5">
            {PILLARS.map((pillar) => (
              <li key={pillar.title} className="rounded-[18px] border-2 border-(--bg) p-5">
                <h3 className="text-[18px] font-black uppercase tracking-[0.06em]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-[14px] opacity-80">{pillar.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
