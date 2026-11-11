
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ClipboardList,
  Eye,
  QrCode,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import Reveal from "./Reveal";

gsap.registerPlugin(ScrollTrigger);

const STEPS: Array<{
  title: string;
  text: string;
  eyebrow: string;
  Icon: LucideIcon;
}> = [
  {
    eyebrow: "01 — DISCOVER",
    title: "Spot it.",
    text: "Same cart silhouette. One unmistakable signature colour. You'll know a PRAVEO cart when you see one.",
    Icon: Eye,
  },
  {
    eyebrow: "02 — EXPLORE",
    title: "Choose.",
    text: "Every cart has its own speciality. Find your craving, explore the menu and discover your next favourite.",
    Icon: ClipboardList,
  },
  {
    eyebrow: "03 — ENJOY",
    title: "Order.",
    text: "Freshly prepared, right in front of you. Scan the QR, place your order and get straight to the good stuff.",
    Icon: QrCode,
  },
  {
    eyebrow: "04 — REPEAT",
    title: "Come back.",
    text: "Good food deserves another round. One PRAVEO Club balance, shared across all five concepts.",
    Icon: RotateCcw,
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

function StepVisual({ Icon }: { Icon: LucideIcon }) {
  return (
    <div
      data-hiw-visual
      className="relative grid aspect-square w-full max-w-[200px]
        place-items-center overflow-hidden rounded-full
        border border-(--ink)/15 bg-(--card)
        min-[820px]:max-w-[280px]"
    >
      {/* Single quiet ring */}
      <div className="absolute inset-[10%] rounded-full border border-(--ink)/10" />

      {/* Ambient colour */}
      <div
        data-hiw-glow
        className="absolute inset-[24%] rounded-full
          bg-(--c) opacity-15 blur-2xl"
      />

      {/* Dashed orbit with a single travelling dot */}
      <div
        data-hiw-orbit
        className="absolute inset-[17%] rounded-full
          border border-dashed border-(--ink)/25"
      >
        <span className="absolute left-1/2 top-0 size-2
          -translate-x-1/2 -translate-y-1/2 rounded-full
          bg-(--c) ring-4 ring-(--card)" />
      </div>

      {/* Main icon */}
      <div
        data-hiw-icon
        className="relative z-10 grid size-[40%] place-items-center
          rounded-[30%] bg-(--c) text-(--on)
          shadow-[0_15px_45px_-15px_var(--ink)]"
      >
        <Icon className="size-[46%]" strokeWidth={1.7} />
      </div>

      {/* QR scanning line (step 03 only) */}
      <div
        data-hiw-scan
        className="absolute left-[26%] right-[26%] top-[30%]
          z-20 h-[2px] bg-(--c)
          shadow-[0_0_15px_var(--c)]"
      />
    </div>
  );
}

export default function HowItWorks() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const slides = slidesRef.current;
    const bar = barRef.current;

    if (!root || !pin || !slides || !bar) return;

    const mm = gsap.matchMedia();

    // Cinematic experience only on desktop / tablet landscape.
    mm.add(
      "(min-width: 820px) and (prefers-reduced-motion: no-preference)",
      () => {
        const panels = gsap.utils.toArray<HTMLElement>(
          "[data-hiw-panel]",
          slides
        );

        const visuals = gsap.utils.toArray<HTMLElement>(
          "[data-hiw-visual]",
          slides
        );

        const icons = gsap.utils.toArray<HTMLElement>(
          "[data-hiw-icon]",
          slides
        );

        const orbits = gsap.utils.toArray<HTMLElement>(
          "[data-hiw-orbit]",
          slides
        );

        const glows = gsap.utils.toArray<HTMLElement>(
          "[data-hiw-glow]",
          slides
        );

        const scans = gsap.utils.toArray<HTMLElement>(
          "[data-hiw-scan]",
          slides
        );

        // Per-panel copy, revealed with its own stagger.
        const titles = panels.map((p) => p.querySelector("h3"));
        const texts = panels.map((p) => p.querySelector("p"));

        const total = panels.length;

        // Initial composition — panels fade and rise, they no longer slide
        // across the stage, so the story reads as one calm crossfade.
        gsap.set(panels, {
          autoAlpha: 0,
          y: 36,
          scale: 0.99,
        });

        gsap.set(panels[0], {
          autoAlpha: 1,
          y: 0,
          scale: 1,
        });

        gsap.set(visuals, {
          scale: 0.85,
          rotation: -8,
          autoAlpha: 0,
        });

        gsap.set(visuals[0], {
          scale: 1,
          rotation: 0,
          autoAlpha: 1,
        });

        gsap.set(icons, {
          scale: 0.6,
          rotation: -18,
        });

        gsap.set(icons[0], {
          scale: 1,
          rotation: 0,
        });

        gsap.set(orbits, {
          rotation: -25,
        });

        gsap.set(glows, {
          scale: 0.5,
          opacity: 0,
        });

        gsap.set(glows[0], {
          scale: 1,
          opacity: 0.15,
        });

        gsap.set(scans, {
          autoAlpha: 0,
          y: 0,
        });

        const tl = gsap.timeline({
          defaults: {
            ease: "power2.inOut",
          },
          scrollTrigger: {
            trigger: pin,
            start: "top 120px",
            end: "+=140%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(
                total - 1,
                Math.floor(self.progress * total)
              );

              if (counterRef.current) {
                counterRef.current.textContent =
                  `${pad(idx + 1)} / ${pad(total)}`;
              }
            },
            onLeave: () => {
              if (counterRef.current) {
                counterRef.current.textContent = "04 / 04";
              }
            },
          },
        });

        // First scene settles in: icon pop, colour bloom, orbit drift.
        tl.to(icons[0], {
          scale: 1,
          rotation: 0,
          duration: 0.65,
          ease: "back.out(1.5)",
        }, 0);

        tl.to(glows[0], {
          scale: 1.12,
          opacity: 0.2,
          duration: 0.9,
        }, 0);

        tl.to(orbits[0], {
          rotation: 30,
          duration: 1.4,
          ease: "none",
        }, 0);

        // Give the first scene room to breathe.
        tl.to({}, { duration: 0.6 });

        // Scene transitions — a calm crossfade: the old story lifts away
        // while the new one rises into place, title first, body after.
        for (let i = 1; i < total; i++) {
          const previous = i - 1;
          const next = i;

          // Previous content exits — soft lift, no sideways slide.
          tl.to(panels[previous], {
            autoAlpha: 0,
            y: -26,
            scale: 0.99,
            duration: 0.5,
            ease: "power2.in",
          });

          tl.to(
            visuals[previous],
            {
              autoAlpha: 0,
              scale: 0.88,
              rotation: 6,
              duration: 0.5,
              ease: "power2.in",
            },
            "<"
          );

          tl.to(
            glows[previous],
            {
              opacity: 0,
              scale: 0.7,
              duration: 0.45,
            },
            "<"
          );

          // New content enters, overlapping the exit's tail.
          tl.fromTo(
            panels[next],
            {
              autoAlpha: 0,
              y: 36,
              scale: 0.99,
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: "power2.out",
            },
            "<0.22"
          );

          // Internal reveal: headline rises first, body follows.
          if (titles[next]) {
            tl.fromTo(
              titles[next],
              { autoAlpha: 0, y: 30 },
              { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
              "<0.12"
            );
          }

          if (texts[next]) {
            tl.fromTo(
              texts[next],
              { autoAlpha: 0, y: 22 },
              { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
              "<0.1"
            );
          }

          tl.fromTo(
            visuals[next],
            {
              autoAlpha: 0,
              scale: 0.85,
              rotation: -8,
            },
            {
              autoAlpha: 1,
              scale: 1,
              rotation: 0,
              duration: 0.7,
              ease: "power2.out",
            },
            "<0.05"
          );

          // Icon pop.
          tl.fromTo(
            icons[next],
            {
              scale: 0.6,
              rotation: -18,
            },
            {
              scale: 1,
              rotation: 0,
              duration: 0.6,
              ease: "back.out(1.6)",
            },
            "<0.15"
          );

          // Colour bloom.
          tl.fromTo(
            glows[next],
            {
              scale: 0.6,
              opacity: 0,
            },
            {
              scale: 1.12,
              opacity: 0.2,
              duration: 0.7,
            },
            "<"
          );

          // Orbit drift.
          tl.to(
            orbits[next],
            {
              rotation: 40,
              duration: 1.1,
              ease: "none",
            },
            "<"
          );

          // Special QR scan sequence.
          if (next === 2 && scans[next]) {
            tl.fromTo(
              scans[next],
              {
                autoAlpha: 0,
                y: 0,
              },
              {
                autoAlpha: 1,
                y: 105,
                duration: 0.55,
                ease: "power1.inOut",
              },
              "<0.2"
            );

            tl.to(
              icons[next],
              {
                scale: 1.06,
                duration: 0.15,
                yoyo: true,
                repeat: 1,
              },
              "<0.25"
            );

            tl.to(
              scans[next],
              {
                autoAlpha: 0,
                duration: 0.2,
              },
              "<0.35"
            );
          }

          // Loyalty loop: circular movement.
          if (next === 3) {
            tl.to(
              icons[next],
              {
                rotation: 360,
                duration: 0.9,
                ease: "power2.inOut",
              },
              "<0.1"
            );

            tl.to(
              orbits[next],
              {
                rotation: 360,
                duration: 1.2,
                ease: "power1.inOut",
              },
              "<"
            );
          }

          // Pause before next story.
          tl.to({}, { duration: 0.55 });
        }

        // Progress rail.
        tl.eventCallback("onUpdate", () => {
          const progress = tl.progress();
          gsap.set(bar, {
            scaleX: progress,
          });
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      }
    );

    // Mobile / tablet portrait: the user keeps scrolling down normally,
    // but the steps travel right-to-left — one pinned story per screen.
    mm.add(
      "(max-width: 819.98px) and (prefers-reduced-motion: no-preference)",
      () => {
        const stage = root.querySelector<HTMLDivElement>("[data-hiw-stage]");
        if (!stage) return;

        // Horizontal layout is opt-in via CSS ([data-hiw-h]) so users with
        // reduced motion — where no JS driver runs — still get the plain
        // stacked list instead of an undrivable track.
        root.setAttribute("data-hiw-h", "");

        const total = STEPS.length;

        const getDistance = () =>
          Math.max(0, slides.scrollWidth - stage.clientWidth);

        const tween = gsap.to(slides, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top 120px",
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(
                total - 1,
                Math.floor(self.progress * total)
              );
              if (counterRef.current) {
                counterRef.current.textContent =
                  `${pad(idx + 1)} / ${pad(total)}`;
              }
              gsap.set(bar, { scaleX: self.progress });
            },
            onLeave: () => {
              if (counterRef.current) {
                counterRef.current.textContent =
                  `${pad(total)} / ${pad(total)}`;
              }
            },
          },
        });

        return () => {
          root.removeAttribute("data-hiw-h");
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="how"
      className="relative overflow-clip pb-24 pt-4"
    >
      {/* Story stage — heading, progress and panels all live in the pin.
          Block on mobile (ScrollTrigger pin-spacing breaks inside flex
          containers); flex column on desktop drives the slide order. */}
      <div
        ref={pinRef}
        className="relative mx-auto w-full max-w-[1160px] px-5
          min-[820px]:flex min-[820px]:flex-col"
      >
        {/* Section heading — reads first on mobile; sits under the stage on desktop */}
        <Reveal className="pb-10 min-[820px]:order-2 min-[820px]:pb-0">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-(--c)" />
            <p className="text-xs font-black uppercase tracking-[0.2em]">
              THE PRAVEO EXPERIENCE
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <h2 className="text-[clamp(34px,5vw,58px)] font-black
              leading-[0.96] tracking-[-0.045em]">
              Good food.
              <br />
              No complicated steps.
            </h2>

            <p className="max-w-[280px] pb-1 text-sm leading-relaxed opacity-65">
              Four simple moments between spotting your cart
              and finding your next favourite.
            </p>
          </div>
        </Reveal>

        {/* Pinned stage. Mobile: one story per screen — the panels travel
            right-to-left while the user scrolls down. Desktop: display
            contents, so the panels/heading/progress stay direct flex
            children of the pin exactly as before. */}
        <div
          data-hiw-stage
          className="flex min-h-[calc(100svh-180px)] flex-col
            justify-center overflow-clip
            min-[820px]:order-3 min-[820px]:contents"
        >
          {/* Progress header — one counter, one rail, nothing else */}
          <div className="mb-4 flex items-center gap-5
            min-[820px]:order-3 min-[820px]:mb-6 min-[820px]:mt-6">
            <p
              ref={counterRef}
              className="min-w-[70px] text-[11px] font-black
                tabular-nums tracking-[0.16em]"
            >
              01 / 04
            </p>

            <div className="h-[2px] flex-1 overflow-hidden bg-(--ink)/10">
              <div
                ref={barRef}
                className="h-full origin-left bg-(--c)"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>

          {/* Panels */}
          <div
            ref={slidesRef}
            data-hiw-track
            className="grid gap-10
              min-[820px]:relative min-[820px]:order-1 min-[820px]:min-h-[470px]"
          >
            {STEPS.map((step) => (
              <article
                key={step.title}
                data-hiw-panel
                className="relative flex flex-col justify-between gap-7
                  min-[820px]:absolute min-[820px]:inset-0
                  min-[820px]:grid min-[820px]:grid-cols-[1.15fr_0.85fr]
                  min-[820px]:items-center min-[820px]:gap-12"
              >
                {/* Copy */}
                <div className="relative z-10">
                  <p className="mb-6 flex items-center gap-3
                    text-[11px] font-black uppercase tracking-[0.2em] opacity-55">
                    <span className="h-px w-8 bg-(--c)" />
                    {step.eyebrow}
                  </p>

                  <h3 className="text-[clamp(54px,8vw,100px)]
                    font-black leading-[0.88] tracking-[-0.065em]">
                    {step.title}
                  </h3>

                  <p className="mt-6 max-w-[440px] text-[17px]
                    leading-[1.7] opacity-70 min-[820px]:text-[19px]">
                    {step.text}
                  </p>
                </div>

                {/* Visual */}
                <div className="flex justify-center min-[820px]:justify-end">
                  <StepVisual Icon={step.Icon} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
