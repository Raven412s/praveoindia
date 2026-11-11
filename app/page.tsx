import Ribbon from "@/components/Ribbon";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ConceptPicker from "@/components/ConceptPicker";
import CartStreet from "@/components/CartStreet";
import HowItWorks from "@/components/HowItWorks";
import Standard from "@/components/Standard";
import FindSection from "@/components/FindSection";
import NotifyForm from "@/components/NotifyForm";
import Footer from "@/components/Footer";
import MascotCrew from "@/components/MascotCrew";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <Ribbon />
      <Header />
      <main>
        <Hero />
        <Stats />

        <section id="carts" className="pt-[72px]">
          <div className="mx-auto w-full max-w-[1160px] px-5">
            <Reveal>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em]">
                ONE BRAND. FIVE MOODS.
              </p>
              <h2 className="mt-3 text-[clamp(32px,5vw,56px)] font-black leading-[1.02] tracking-[-0.02em]">
                Pick your vybe.
              </h2>
              <p className="mt-4 max-w-[600px] text-[17px] opacity-85">
                Every cart does one thing really well — and wears one colour, so
                you can spot it from across the street.
              </p>
            </Reveal>
            <ConceptPicker />
          </div>
        </section>

        <CartStreet />

        <MascotCrew />

        <HowItWorks />
        <Standard />
        <FindSection />

        <section className="border-y-[3px] border-(--ink) bg-(--c) py-16 text-(--on) transition-[background-color,color] duration-300">
          <div className="mx-auto w-full max-w-[1160px] px-5 text-center">
            <Reveal>
              <h2 className="text-[clamp(32px,5vw,56px)] font-black leading-[1.02] tracking-[-0.02em]">
                PRAVEO is landing soon.
              </h2>
              <p className="mx-auto mt-3 max-w-[520px] text-[17px]">
                Be first to know where the first cart shows up.
              </p>
              <NotifyForm />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
