"use client";

import { useState, type FormEvent } from "react";
import { useCursorElement } from "@/components/globals/cursor/advance-cursor";

export default function NotifyForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [sending, setSending] = useState(false);
  const pointer = useCursorElement({ state: "pointer" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const form = event.currentTarget;
    const email = (new FormData(form).get("email") as string)?.trim();
    if (!email) return;

    setSending(true);
    setStatus(null);
    setFailed(false);

    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (res.ok && data.ok) {
        setStatus("You’re on the list. We’ll be in touch when the first cart lands.");
        form.reset();
      } else {
        setFailed(true);
        setStatus(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setFailed(true);
      setStatus("Network hiccup — please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-8 flex max-w-[560px] flex-col gap-3 min-[560px]:flex-row"
      >
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          aria-label="Email"
          placeholder="you@example.com"
          className="h-12 w-full min-w-0 flex-1 rounded-full border border-(--deep-ink)/25 bg-transparent px-5 text-[14px] text-(--deep-ink) outline-none transition-colors duration-300 placeholder:text-(--deep-ink)/35 focus:border-(--deep-ink)/70"
        />
        <button
          {...pointer}
          type="submit"
          disabled={sending}
          className="h-12 w-full shrink-0 rounded-full bg-(--deep-ink) px-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-(--deep) transition-[background-color,color,opacity] duration-300 hover:bg-(--c) hover:text-(--on) disabled:cursor-not-allowed disabled:opacity-50 min-[560px]:w-auto"
        >
          {sending ? "Sending…" : "Notify me"}
        </button>
      </form>
      {status ? (
        <p
          role="status"
          className={`mt-5 max-w-[520px] text-[13px] leading-relaxed ${
            failed ? "text-[#ff9c8f]" : "text-(--deep-ink)/65"
          }`}
        >
          {status}
        </p>
      ) : null}
      <p className="mt-5 text-[10px] uppercase tracking-[0.16em] text-(--deep-ink)/35">
        No spam. Just one note when we open.
      </p>
    </div>
  );
}
