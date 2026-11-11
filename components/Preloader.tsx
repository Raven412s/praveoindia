"use client";

import { animate, motion, type Variants } from "motion/react";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import Mascot from "./Mascot";
import { markIntroDone } from "@/lib/intro";

type Phase = "loading" | "exiting" | "done";

/**
 * Full-screen curtain. On finish it slides up while its bottom edge morphs
 * into a circle that rises out of view. Fires the intro-done event at the
 * moment the lift starts so the hero timeline plays underneath it.
 */
export default function Preloader() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase !== "loading") return;
    // Capture BEFORE locking — reading after the assignment would store
    // "hidden" as the previous value and never unlock scrolling again,
    // which breaks native touch scrolling on phones/tablets.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const controls = animate(0, 100, {
      duration: reduce ? 0.1 : 1.3,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (value) => setProgress(Math.round(value)),
      onComplete: () => {
        document.body.style.overflow = previous;
        markIntroDone();
        setPhase("exiting");
      },
    });

    return () => {
      controls.stop();
      document.body.style.overflow = previous;
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <motion.div
      initial="start"
      animate={phase === "exiting" ? "exit" : "start"}
      variants={curtain}
      onAnimationComplete={(definition) => {
        if (definition === "exit") setPhase("done");
      }}
      role="status"
      aria-label="Loading PRAVEO"
      className="fixed inset-0 z-50 bg-(--ink) text-(--bg)"
    >
      <motion.div variants={content} className="flex h-full w-full flex-col items-center justify-center gap-6">
        <Mascot className="animate-bob w-28" />
        <Logo className="h-auto w-[180px]" />
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] opacity-70">
          More than food. It’s your vybe.
        </p>
      </motion.div>

      <motion.p
        variants={content}
        className="absolute bottom-6 right-6 text-[clamp(40px,6vw,72px)] font-black leading-none tabular-nums"
      >
        {progress}
        <span className="align-top text-[0.45em] font-extrabold">%</span>
      </motion.p>

      <motion.div
        style={{ transformOrigin: "0% 50%" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress / 100 }}
        transition={{ duration: 0.2, ease: "linear" }}
        className="absolute bottom-0 left-0 h-2 w-full bg-(--c)"
      />
      <span className="sr-only">Loading, {progress} percent</span>
    </motion.div>
  );
}

const curtain: Variants = {
  start: {
    y: "0%",
    borderRadius: "0 0 50% 50% / 0 0 0% 0%",
  },
  exit: {
    y: "-115%",
    borderRadius: [
      "0 0 50% 50% / 0 0 0% 0%",
      "0 0 50% 50% / 0 0 22% 22%",
      "0 0 50% 50% / 0 0 100% 100%",
    ],
    transition: {
      duration: 0.9,
      ease: [0.76, 0, 0.24, 1],
      delay: 0.25,
    },
  },
};

const content: Variants = {
  start: { opacity: 1, y: 0 },
  exit: {
    opacity: 0,
    y: -18,
    transition: { duration: 0.35, ease: [0.33, 1, 0.68, 1] },
  },
};
