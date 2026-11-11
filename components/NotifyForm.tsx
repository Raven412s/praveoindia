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
        setStatus("You're on the list! Check your inbox for a confirmation. 🚚");
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
        className="mx-auto mt-8 flex max-w-[520px] flex-col justify-center gap-3 min-[520px]:flex-row"
      >
        <input
          required
          type="email"
          name="email"
          aria-label="Email"
          placeholder="you@example.com"
          className="h-12 w-full min-w-0 rounded-full border-[3px] border-(--ink) bg-white px-5 text-[15px] font-bold text-[#202020] placeholder:font-medium placeholder:text-[#20202059] min-[520px]:flex-1"
        />
        <button
          {...pointer}
          type="submit"
          disabled={sending}
          className="h-12 w-full shrink-0 rounded-full border-[3px] border-(--bg) bg-(--ink) px-7 text-[15px] font-extrabold text-(--bg) transition-[box-shadow,transform,opacity] duration-300 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[4px_4px_0_rgb(255_255_255_/_0.35)] disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none min-[520px]:w-auto"
        >
          {sending ? "Sending…" : "Notify me"}
        </button>
      </form>
      {status ? (
        <p
          role="status"
          className={`mt-5 text-[15px] font-extrabold ${
            failed ? "text-(--bite)" : ""
          }`}
        >
          {status}
        </p>
      ) : null}
    </div>
  );
}
