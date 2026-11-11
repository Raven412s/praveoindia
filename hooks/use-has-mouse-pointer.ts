import { useMediaQuery } from "./use-media-query";

/**
 * True when the user has a mouse-like pointer attached (mouse or trackpad).
 *
 * The old `useIsTouchDevice` treated "screen is touch-capable" as "touch
 * only": every touchscreen laptop reports `navigator.maxTouchPoints > 0`,
 * which hid the custom cursor on them even though they are mouse-driven.
 *
 * `(any-pointer: fine)` matches when ANY attached pointer is precise:
 * true on desktops, touchscreen laptops and tablets with a mouse; false on
 * phones and touch-only tablets. The underlying media-query `change` event
 * also fires when pointers attach/detach at runtime (docking stations,
 * Bluetooth mice), so the cursor follows reality in both directions.
 *
 * Hydration-safe: false on the server, resolves right after mount.
 */
export function useHasMousePointer(): boolean {
  return useMediaQuery("(any-pointer: fine)");
}
