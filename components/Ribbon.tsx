import {
  Marquee,
  MarqueeContent,
  MarqueeItem,
} from "@/components/ui/kibo-ui/marquee";

const RIBBON_TEXT =
  "5 FOOD CONCEPTS • ONE PRAVEO STANDARD • RIGHT FOOD, RIGHT PLACE • FIND YOUR PRAVEO •";

const ITEMS = RIBBON_TEXT.split("•").filter(Boolean).map((s) => s.trim());

export default function Ribbon() {
  return (
    <div className="bg-(--ink) py-1.5 text-(--bg)">
      <p className="sr-only">
        5 food concepts. One PRAVEO standard. Right food, right place. Find
        your PRAVEO.
      </p>
      <Marquee aria-hidden="true" className="text-xs font-extrabold uppercase tracking-[0.14em]">
        <MarqueeContent pauseOnHover={false} speed={50}>
          {ITEMS.map((item, index) => (
            <MarqueeItem key={index} className="mx-0 flex items-center">
              <span>{item}</span>
              <span className="px-5 opacity-70">•</span>
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </div>
  );
}
