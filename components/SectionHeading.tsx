import type { ReactNode } from "react";

/**
 * Shared editorial section opener: a quiet eyebrow, a serif display line and
 * an optional supporting paragraph. The small accent rule echoes the current
 * concept colour without letting it take over the page.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p
        className={`flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] ${
          dark ? "text-(--deep-ink)/55" : "text-(--muted-ink)"
        }`}
      >
        <span className="h-px w-7 flex-none bg-(--c)" />
        {eyebrow}
      </p>
      <h2
        className={`mt-5 font-serif text-[clamp(36px,4.6vw,60px)] font-normal leading-[1.02] tracking-[-0.025em] ${
          dark ? "text-(--deep-ink)" : "text-(--ink)"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-5 max-w-[560px] text-[15.5px] leading-[1.7] ${
            dark ? "text-(--deep-ink)/65" : "text-(--muted-ink)"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
