import Ribbon from "@/components/Ribbon";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ConceptPicker from "@/components/ConceptPicker";
import CartStreet from "@/components/CartStreet";
import Manifesto from "@/components/Manifesto";
import HowItWorks from "@/components/HowItWorks";
import Standard from "@/components/Standard";
import FindSection from "@/components/FindSection";
import NotifyForm from "@/components/NotifyForm";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function Home() {
  return (
    <>
      <Ribbon />
      <Header />
      <main>
        <Hero />
        <Stats />

        <section id="carts" className="py-24">
          <div className="mx-auto w-full max-w-[1180px] px-5">
            <Reveal>
              <SectionHeading
                eyebrow="One brand. Five moods."
                title={
                  <>
                    Pick your <span className="italic">vybe.</span>
                  </>
                }
                description="Every cart does one thing really well — and wears one colour, so you can spot it from across the street. Choose a concept to explore it."
              />
            </Reveal>
            <ConceptPicker />
          </div>
        </section>

        <CartStreet />

        <Manifesto />

        <HowItWorks />
        <Standard />
        <FindSection />

        <section id="notify" className="bg-(--deep) py-24 text-(--deep-ink)">
          <div className="mx-auto grid w-full max-w-[1180px] gap-12 px-5 min-[900px]:grid-cols-[1fr_0.9fr] min-[900px]:items-end">
            <Reveal>
              <SectionHeading
                eyebrow="Coming soon"
                title={
                  <>
                    PRAVEO is
                    <br />
                    <span className="italic">landing soon.</span>
                  </>
                }
                dark
              />
            </Reveal>

            <Reveal delay={0.08} y={18}>
              <p className="max-w-[440px] text-[15.5px] leading-[1.7] text-(--deep-ink)/65">
                Be first to know where the first cart shows up — and which concept
                is coming to your neighbourhood.
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
