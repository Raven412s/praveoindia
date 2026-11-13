"use client";

import { animate, motion, type Variants } from "motion/react";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { markIntroDone } from "@/lib/intro";

type Phase = "loading" | "exiting" | "done";

/**
 * Full-screen curtain. The wordmark holds while a hairline progress rule
 * completes, then the whole curtain lifts away. The intro-done event fires at
 * the start of the lift so the hero can settle in underneath it.
 */
export default function Preloader() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase !== "loading") return;
    // Capture before locking — reading after the assignment would store
    // "hidden" as the previous value and never unlock scrolling again.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const controls = animate(0, 100, {
      duration: reduce ? 0.1 : 1.15,
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
      className="fixed inset-0 z-50 overflow-hidden bg-(--ink) text-(--bg)"
    >
      <motion.div
        variants={content}
        className="flex h-full w-full flex-col items-center justify-center gap-7"
      >
        <Logo className="h-auto w-[190px]" />
        <p className="text-[10px] font-medium uppercase tracking-[0.26em] opacity-50">
          More than food. It’s your vybe.
        </p>
      </motion.div>

      <motion.p
        variants={content}
        className="absolute bottom-7 right-7 font-serif text-[clamp(30px,4vw,52px)] font-normal leading-none tabular-nums"
      >
        {progress}
        <span className="align-top font-sans text-[0.4em] font-medium">%</span>
      </motion.p>

      <motion.div
        style={{ transformOrigin: "0% 50%" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress / 100 }}
        transition={{ duration: 0.2, ease: "linear" }}
        className="absolute bottom-0 left-0 h-px w-full bg-(--c)"
      />
      <span className="sr-only">Loading, {progress} percent</span>
    </motion.div>
  );
}

const curtain: Variants = {
  start: { y: "0%" },
  exit: {
    y: "-102%",
    transition: {
      duration: 0.85,
      ease: [0.76, 0, 0.24, 1],
      delay: 0.15,
    },
  },
};

const content: Variants = {
  start: { opacity: 1, y: 0 },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
  },
};
