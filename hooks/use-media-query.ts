import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribe to a CSS media query. Returns whether it currently matches.
 *
 * Uses useSyncExternalStore: no state-in-effect cascades, and the server
 * snapshot is always `false`, so SSR markup and the first client render
 * match (the real value resolves right after hydration).
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void): (() => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(
    (): boolean => window.matchMedia(query).matches,
    [query]
  );

  const getServerSnapshot = useCallback((): boolean => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
