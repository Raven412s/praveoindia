/** Fired when the preloader curtain starts lifting; the hero timeline listens for it. */
export const INTRO_DONE_EVENT = "praveo:intro-done";

declare global {
  interface Window {
    __praveoIntroDone?: boolean;
  }
}

export function markIntroDone(): void {
  if (typeof window === "undefined") return;
  window.__praveoIntroDone = true;
  window.dispatchEvent(new CustomEvent(INTRO_DONE_EVENT));
}

export function introDone(): boolean {
  return typeof window !== "undefined" && window.__praveoIntroDone === true;
}
