import {
  forwardRef,
  type ButtonHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Minimal button primitive styled to match the PRAVEO neo-brutalist system
 * (ink borders + hard offset shadow). Used by PRAVEO app components; the
 * stock shadcn Button lives in `@/components/ui/button`.
 */

const VARIANTS = {
  outline:
    "border-[3px] border-(--ink) bg-(--card) text-(--ink) shadow-[2px_2px_0_var(--ink)]",
  ghost: "bg-transparent",
  solid:
    "border-[3px] border-(--ink) bg-(--c) text-(--on) shadow-[2px_2px_0_var(--ink)]",
} as const;

const SIZES = {
  default: "h-12 px-7 text-[15px] font-extrabold",
  sm: "h-10 px-5 text-sm font-extrabold",
  icon: "h-11 w-11",
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "outline", size = "default", type = "button", ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-[background-color,color,border-color,box-shadow,transform] duration-300 disabled:pointer-events-none disabled:opacity-50",
          VARIANTS[variant],
          SIZES[size],
          className
        )}
        {...props}
      />
    );
  }
);
