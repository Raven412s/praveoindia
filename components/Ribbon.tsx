import {
  Marquee,
  MarqueeContent,
  MarqueeItem,
} from "@/components/ui/kibo-ui/marquee";

const RIBBON_TEXT =
  "PRAVEO IS COMING SOON • FIVE FOOD CONCEPTS • ONE QUALITY STANDARD • FIND YOUR PRAVEO •";

const ITEMS = RIBBON_TEXT.split("•").filter(Boolean).map((s) => s.trim());

export default function Ribbon() {
  return (
    <div className="bg-(--ink) py-2.5 text-(--bg)">
      <p className="sr-only">
        PRAVEO is coming soon. Five food concepts. One quality standard. Find
        your PRAVEO.
      </p>
      <Marquee aria-hidden="true" className="text-[9px] font-semibold uppercase tracking-[0.24em]">
        <MarqueeContent pauseOnHover={false} speed={35}>
          {ITEMS.map((item, index) => (
            <MarqueeItem key={index} className="mx-0 flex items-center">
              <span>{item}</span>
              <span className="px-6 opacity-40">•</span>
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </div>
  );
}
