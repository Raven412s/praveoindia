"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { motion, useMotionValue, useAnimationFrame } from "motion/react";
import type { MarqueeProps as FastMarqueeProps } from "react-fast-marquee";
import FastMarquee from "react-fast-marquee";
import { cn } from "@/lib/utils";

// Ported from Kibo UI (kibo-ui/marquee) with framer-motion mapped to
// motion/react, which this project already uses.

export type MarqueeProps = HTMLAttributes<HTMLDivElement>;

export const Marquee = ({ className, ...props }: MarqueeProps) => (
  <div
    className={cn("relative w-full overflow-hidden", className)}
    {...props}
  />
);

export type MarqueeContentProps = FastMarqueeProps & {
  draggable?: boolean;
};

export const MarqueeContent = ({
  loop = 0,
  autoFill = true,
  pauseOnHover = true,
  draggable = false,
  speed = 35,
  direction = "left",
  children,
  className,
  ...props
}: MarqueeContentProps) => {
  if (!draggable) {
    return (
      <FastMarquee
        autoFill={autoFill}
        loop={loop}
        pauseOnHover={pauseOnHover}
        speed={speed}
        direction={direction}
        className={className}
        {...props}
      >
        {children}
      </FastMarquee>
    );
  }

  return (
    <DraggableMarqueeTrack
      speed={typeof speed === "number" ? speed : 35}
      direction={direction}
      pauseOnHover={pauseOnHover}
      className={className}
    >
      {children}
    </DraggableMarqueeTrack>
  );
};

function DraggableMarqueeTrack({
  children,
  speed = 35,
  direction = "left",
  pauseOnHover = true,
  className,
}: {
  children: ReactNode;
  speed?: number;
  direction?: "left" | "right" | "up" | "down";
  pauseOnHover?: boolean;
  className?: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      if (el) {
        setContentWidth(el.scrollWidth);
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children]);

  const wrapX = useCallback(
    (val: number) => {
      if (contentWidth <= 0) return 0;
      let wrapped = val % contentWidth;
      if (wrapped > 0) wrapped -= contentWidth;
      return wrapped;
    },
    [contentWidth]
  );

  useAnimationFrame((_, delta) => {
    if (isDragging || (pauseOnHover && isHovered) || contentWidth <= 0) return;

    const dirMultiplier = direction === "left" || direction === "up" ? -1 : 1;
    const moveBy = dirMultiplier * speed * (delta / 1000);
    const currentX = x.get();
    const nextX = wrapX(currentX + moveBy);
    x.set(nextX);
  });

  const handleDrag = () => {
    const currentX = x.get();
    const wrapped = wrapX(currentX);
    if (Math.abs(wrapped - currentX) > 0.5) {
      x.set(wrapped);
    }
  };

  return (
    <div
      className={cn(
        "w-full overflow-hidden select-none touch-pan-y cursor-grab active:cursor-grabbing",
        className
      )}
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
    >
      <motion.div
        className="flex w-max"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -100000, right: 100000 }}
        dragElastic={0.05}
        dragMomentum={true}
        onDragStart={() => setIsDragging(true)}
        onDrag={handleDrag}
        onDragEnd={() => {
          setIsDragging(false);
          handleDrag();
        }}
      >
        <div ref={contentRef} className="flex shrink-0">
          {children}
        </div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export type MarqueeFadeProps = HTMLAttributes<HTMLDivElement> & {
  side: "left" | "right";
};

export const MarqueeFade = ({
  className,
  side,
  ...props
}: MarqueeFadeProps) => (
  <div
    className={cn(
      "absolute top-0 bottom-0 z-10 h-full w-16 sm:w-24 from-background to-transparent pointer-events-none",
      side === "left" ? "left-0 bg-linear-to-r" : "right-0 bg-linear-to-l",
      className
    )}
    {...props}
  />
);

export type MarqueeItemProps = HTMLAttributes<HTMLDivElement>;

export const MarqueeItem = ({ className, ...props }: MarqueeItemProps) => (
  <div
    className={cn("mx-2 shrink-0 object-contain", className)}
    {...props}
  />
);
