"use client";

/**
 * Custom cursor system — ported from the user's own project (originally a
 * Cuberto-style follower). A springy circle trails the pointer and stretches
 * along its direction of travel; elements can register hover states, labels,
 * icons or media previews through useCursorElement().
 *
 * Rebranded for PRAVEO: the follower draws in var(--ink) with var(--bg)
 * labels, and uses Montserrat. The demo components from the source file were
 * removed — only the provider, follower and hooks are kept.
 *
 * Cross-device consistency:
 *  - The follower renders whenever a mouse-like pointer exists. Detection is
 *    pointer-capability based (see useHasMousePointer), so touchscreen
 *    laptops and trackpads are no longer mistaken for touch-only devices.
 *  - prefers-reduced-motion never removes the follower (it is pointer UI,
 *    not decoration): motion degrades to instant, un-stretched following.
 *  - All easing is delta-time based, so 60Hz and 144Hz displays feel identical.
 *  - `cursor: none` is scoped to the same md breakpoint that shows the
 *    follower, so narrow windows never end up with no cursor at all.
 */

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  createContext,
  useContext,
  isValidElement,
  type ReactNode,
  type CSSProperties,
  type JSX,
  type MouseEvent as ReactMouseEvent,
  type MutableRefObject,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useHasMousePointer } from "@/hooks/use-has-mouse-pointer";
import { useMediaQuery } from "@/hooks/use-media-query";

export type CursorState =
  | "default"
  | "pointer"
  | "text"
  | "icon"
  | "hidden"
  | "exclusion"
  | "accent"
  | "media";

type EffectiveState = CursorState | "active";

export interface CursorConfig {
  speed: number;
  skewing: number;
  skewingText: number;
  skewingDelta: number;
  skewingDeltaMax: number;
}

export interface CursorElementOptions {
  state?: CursorState;
  text?: string;
  icon?: ReactNode;
  mediaSrc?: string;
  mediaShape?: "circle" | "window";
  textColor?: string;
  backgroundColor?: string;
  circleOpacity?: number;
  circleSize?: number;
}

export interface CursorContextValue {
  setState: (s: CursorState, opts?: Omit<CursorElementOptions, "state">) => void;
  resetState: () => void;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  isActive: boolean;
}

export interface CursorElementHandlers {
  onMouseEnter: (e: ReactMouseEvent) => void;
  onMouseLeave: (e: ReactMouseEvent) => void;
  onMouseDown: (e: ReactMouseEvent) => void;
  onMouseUp: (e: ReactMouseEvent) => void;
}

interface FrameCallback {
  (x: number, y: number, angleDeg: number, stretch: number, visible: boolean): void;
}

interface Vec2 { x: number; y: number }

type LabelPayload =
  | { kind: "text"; content: string; textColor?: string; bgColor?: string; mediaShape?: "circle" | "window" }
  | { kind: "icon"; content: ReactNode; textColor?: string; bgColor?: string; mediaShape?: "circle" | "window" }
  | { kind: "none" };

function resolveLabelPayload(
  opts: Omit<CursorElementOptions, "state">
): LabelPayload {
  // icon wins over text if provided
  if (opts.icon !== undefined && opts.icon !== null && opts.icon !== "") {
    return { kind: "icon", content: opts.icon, textColor: opts.textColor, bgColor: opts.backgroundColor, mediaShape: opts.mediaShape };
  }
  if (opts.text) {
    return { kind: "text", content: opts.text, textColor: opts.textColor, bgColor: opts.backgroundColor, mediaShape: opts.mediaShape };
  }
  return { kind: "none" };
}

function hasLabel(p: LabelPayload): p is Exclude<LabelPayload, { kind: "none" }> {
  return p.kind !== "none";
}

const DEFAULT_CONFIG: CursorConfig = {
  speed: 0.2,
  skewing: 2,
  skewingText: 2.5,
  skewingDelta: 0.004,
  skewingDeltaMax: 0.15,
};

// Stable identity for the default prop so the memoised config (and therefore
// the RAF loop) is not rebuilt on every provider render when no config passed.
const NO_CONFIG: Partial<CursorConfig> = {};

const SCALE_MAP: Record<EffectiveState, number> = {
  default: 0.5,
  pointer: 0.3,
  text: 1.7,
  icon: 1.5,
  hidden: 0,
  exclusion: 0.5,
  accent: 0.5,
  media: 0.2,
  active: 0.15,
};

const ACTIVE_OVERRIDE_STATES: CursorState[] = ["default", "pointer", "text", "icon"];

const CursorContext = createContext<CursorContextValue | null>(null);

export interface CursorProviderProps {
  children: ReactNode;
  config?: Partial<CursorConfig>;
}

export function CursorProvider({
  children,
  config = NO_CONFIG,
}: CursorProviderProps): JSX.Element {
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [label, setLabel] = useState<LabelPayload>({ kind: "none" });
  const [mediaSrc, setMediaSrc] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [customTextColor, setCustomTextColor] = useState<string>("");
  const [customBgColor, setCustomBgColor] = useState<string>("");
  const [customCircleOpacity, setCustomCircleOpacity] = useState<number | undefined>(undefined);
  const [customCircleSize, setCustomCircleSize] = useState<number | undefined>(undefined);
  const [mediaShape, setMediaShape] = useState<"circle" | "window">("circle");
  const hasMouse = useHasMousePointer();

  const cfg: CursorConfig = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    [config]
  );

  const setState = useCallback<CursorContextValue["setState"]>(
    (state, opts = {}) => {
      setCursorState(state ?? "default");
      setLabel(resolveLabelPayload(opts));
      setMediaSrc(opts.mediaSrc ?? "");
      setCustomTextColor(opts.textColor ?? "");
      setCustomBgColor(opts.backgroundColor ?? "");
      setCustomCircleOpacity(opts.circleOpacity);
      setCustomCircleSize(opts.circleSize);
      setMediaShape(opts.mediaShape ?? "circle");
    },
    []
  );

  const resetState = useCallback<CursorContextValue["resetState"]>(() => {
    setCursorState("default");
    setLabel({ kind: "none" });
    setMediaSrc("");
    setCustomTextColor("");
    setCustomBgColor("");
    setCustomCircleOpacity(undefined);
    setCustomCircleSize(undefined);
    setMediaShape("circle");
  }, []);

  return (
    <CursorContext.Provider value={{ setState, resetState, setIsActive, isActive }}>
      {children}
      {hasMouse && (
        <MouseFollower
          cursorState={cursorState}
          label={label}
          mediaSrc={mediaSrc}
          isActive={isActive}
          config={cfg}
          customTextColor={customTextColor}
          customBgColor={customBgColor}
          circleOpacity={customCircleOpacity}
          circleSize={customCircleSize}
          mediaShape={mediaShape}
        />
      )}
    </CursorContext.Provider>
  );
}

export function useCursor(): CursorContextValue {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error("useCursor must be used inside <CursorProvider>");
  return ctx;
}

export function useCursorElement(
  options: CursorElementOptions = {}
): CursorElementHandlers {
  const { setState, resetState, setIsActive } = useCursor();
  return {
    onMouseEnter: () => setState(options.state ?? "pointer", options),
    onMouseLeave: () => resetState(),
    onMouseDown: () => setIsActive(true),
    onMouseUp: () => setIsActive(false),
  };
}

interface UseMouseFollowerReturn {
  onFrameRef: MutableRefObject<FrameCallback | null>;
  stateRef: MutableRefObject<CursorState>;
}

/**
 * Turn a per-frame smoothing factor (tuned at 60fps) into the equivalent
 * factor for a frame lasting `dtFrames` 60fps-frames. Without this the
 * follower moves ~2.4x faster on a 144Hz screen than on a 60Hz one.
 */
function dampen(perFrame: number, dtFrames: number): number {
  return 1 - Math.pow(1 - perFrame, dtFrames);
}

function useMouseFollower(
  config: CursorConfig,
  reducedMotion: boolean
): UseMouseFollowerReturn {
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const mouseRef = useRef<Vec2>({ x: -400, y: -400 });
  const posRef = useRef<Vec2>({ x: -400, y: -400 });
  const dirRef = useRef<Vec2>({ x: 1, y: 0 });
  const stretchRef = useRef<number>(0);
  const visRef = useRef<boolean>(false);
  const stateRef = useRef<CursorState>("default");
  const onFrameRef = useRef<FrameCallback | null>(null);

  const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
  const clamp = (v: number, mn: number, mx: number): number => Math.min(Math.max(v, mn), mx);

  const getSkewing = useCallback(
    (s: CursorState): number => {
      if (s === "text" || s === "icon") return config.skewingText;
      if (s === "hidden") return 0;
      return config.skewing;
    },
    [config]
  );

  useEffect(() => {
    // Mutate in place — allocating a fresh {x, y} on every mousemove meant a
    // small GC churn for every pixel of travel.
    const onMove = (e: MouseEvent): void => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      if (!visRef.current) {
        posRef.current.x = e.clientX;
        posRef.current.y = e.clientY;
        visRef.current = true;
      }
    };
    const onLeave = (): void => { visRef.current = false; };
    const onEnter = (): void => { visRef.current = true; };
    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  useEffect(() => {
    const loop = (now: number): void => {
      // Clamp after tab switches/backgrounding so the follower doesn't jump.
      const dtSeconds = lastTimeRef.current > 0
        ? Math.min((now - lastTimeRef.current) / 1000, 0.1)
        : 1 / 60;
      lastTimeRef.current = now;
      const dtFrames = dtSeconds * 60;

      const { x: mx, y: my } = mouseRef.current;

      if (reducedMotion) {
        // Reduced motion: follow instantly, no stretch/skew. The follower
        // stays fully functional but adds no animation of its own.
        posRef.current.x = mx;
        posRef.current.y = my;
        stretchRef.current = 0;
        onFrameRef.current?.(mx, my, 0, 0, visRef.current);
      } else {
        const pos = posRef.current;

        pos.x = lerp(pos.x, mx, dampen(config.speed, dtFrames));
        pos.y = lerp(pos.y, my, dampen(config.speed, dtFrames));

        const velX = mx - pos.x;
        const velY = my - pos.y;
        const speed = Math.hypot(velX, velY);
        const sf = getSkewing(stateRef.current);

        // Only update the stretch direction once movement is meaningful —
        // stops the axis from jittering/flipping when the cursor is nearly still.
        if (speed > 0.6) {
          const nx = velX / speed;
          const ny = velY / speed;
          const dirT = dampen(0.25, dtFrames);
          dirRef.current.x = lerp(dirRef.current.x, nx, dirT);
          dirRef.current.y = lerp(dirRef.current.y, ny, dirT);
        }
        const dLen = Math.hypot(dirRef.current.x, dirRef.current.y) || 1;
        const angleDeg = Math.atan2(dirRef.current.y / dLen, dirRef.current.x / dLen) * (180 / Math.PI);

        const targetStretch = clamp(speed * config.skewingDelta * sf, 0, config.skewingDeltaMax);
        // Snap into the stretch quickly, relax out of it slowly — reads as
        // elastic, not jittery.
        const ease = dampen(targetStretch > stretchRef.current ? 0.35 : 0.1, dtFrames);
        stretchRef.current = lerp(stretchRef.current, targetStretch, ease);

        onFrameRef.current?.(pos.x, pos.y, angleDeg, stretchRef.current, visRef.current);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [config, getSkewing, reducedMotion]);

  return { onFrameRef, stateRef };
}

interface MouseFollowerProps extends CursorElementOptions {
  cursorState: CursorState;
  label: LabelPayload;
  mediaSrc: string;
  isActive: boolean;
  config: CursorConfig;
  customTextColor: string;
  customBgColor: string;
  mediaShape: "circle" | "window";
}

function MouseFollower({
  cursorState, label, mediaSrc, isActive, config, customTextColor, customBgColor, circleOpacity, circleSize, mediaShape
}: MouseFollowerProps): JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { onFrameRef, stateRef } = useMouseFollower(config, reducedMotion);
  // Last frame written to the DOM — used to skip redundant style writes while
  // the follower is idle (saves ~60 style writes/sec per tab).
  const lastFrameRef = useRef({ x: NaN, y: NaN, angle: 0, stretch: 0, visible: false });

  useEffect(() => { stateRef.current = cursorState; }, [cursorState, stateRef]);

  useEffect(() => {
    onFrameRef.current = (x, y, angleDeg, stretch, visible): void => {
      const el = rootRef.current;
      if (!el) return;
      const p = lastFrameRef.current;
      if (
        visible === p.visible &&
        Math.abs(x - p.x) < 0.01 &&
        Math.abs(y - p.y) < 0.01 &&
        Math.abs(angleDeg - p.angle) < 0.01 &&
        Math.abs(stretch - p.stretch) < 0.0005
      ) {
        return; // nothing perceptibly changed — skip the style write
      }
      p.x = x; p.y = y; p.angle = angleDeg; p.stretch = stretch; p.visible = visible;
      el.style.opacity = visible ? "1" : "0";
      // Stretch the cursor along its direction of travel — like a droplet
      // being pulled — instead of shearing X and Y independently. Reads as
      // a single natural elastic motion regardless of which way you move.
      const stretchX = 1 + stretch * 1.6;
      const stretchY = 1 - stretch * 0.6;
      el.style.transform =
        `translate3d(${x}px,${y}px,0) rotate(${angleDeg}deg) scale(${stretchX},${stretchY}) rotate(${-angleDeg}deg)`;
    };
    return () => { onFrameRef.current = null; };
  }, [onFrameRef]);

  const effectiveState: EffectiveState =
    isActive && ACTIVE_OVERRIDE_STATES.includes(cursorState) ? "active" : cursorState;

  const scale: number = SCALE_MAP[effectiveState] ?? 0.2;
  const isMedia: boolean = cursorState === "media";
  const labelVisible: boolean =
    (cursorState === "text" || cursorState === "icon") && hasLabel(label);

  const labelFontSize: number = (() => {
    if (!hasLabel(label)) return 9;
    if (label.kind === "icon") {
      if (isValidElement(label.content)) return 18;
      return typeof label.content === "string" && label.content.length > 2 ? 9 : 16;
    }
    return label.content.length > 2 ? 9 : 16;
  })();

  const labelNode: ReactNode = (() => {
    if (!hasLabel(label)) return null;

    if (label.kind === "icon") {
      return isValidElement(label.content) ? (
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {label.content}
        </span>
      ) : (
        label.content  // plain string glyph
      );
    }

    return label.content;  // text string
  })();

  const rootStyle: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 9999999,
    opacity: 0,
    contain: "layout style size",
    direction: "ltr",
    pointerEvents: "none",
    userSelect: "none",
    willChange: "transform",
    mixBlendMode: "normal",
    color: "var(--bg)",
    transition: "opacity .3s, color .4s",
  };

  const size = circleSize !== undefined ? circleSize : 24;
  const circleStyle: CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    top: -(size / 2),
    left: -(size / 2),
    borderRadius: "50%",
    background: customBgColor || "var(--ink)",
    transform: `scale(${scale})`,
    opacity: circleOpacity !== undefined ? circleOpacity : 1,
    // Reduced motion: transforms snap instead of animating.
    transition: reducedMotion
      ? "opacity .1s, background .4s"
      : `transform ${isActive ? ".1s" : ".25s"} ease-in-out, opacity .1s, background .4s`,
  };

  const resolvedTextColor = customTextColor ||
    (label.kind !== "none" && label.textColor ? label.textColor : undefined) ||
    "var(--bg)";

  const labelStyle: CSSProperties = {
    position: "absolute",
    width: 36,
    height: 36,
    top: -18,
    left: -18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: labelFontSize,
    color: resolvedTextColor,
    fontFamily: "var(--font-montserrat), sans-serif",
    fontWeight: 800,
    letterSpacing: ".08em",
    textTransform: "uppercase",
    lineHeight: 1.2,
    opacity: labelVisible ? 1 : 0,
    transform: labelVisible ? "scale(1) rotate(0deg)" : "scale(0) rotate(10deg)",
    transition: reducedMotion ? "opacity .4s" : "opacity .4s, transform .3s",
    pointerEvents: "none",
    whiteSpace: "nowrap",
  };

  const mediaBoxStyle: CSSProperties = {
    position: "relative",
    width: "150%",
    height: "150%",
    overflow: "hidden",
    borderRadius: mediaShape === "window" ? "20px" : "50%",
    padding: 1,
    opacity: isMedia ? 1 : 0,
    transform: isMedia ? "scale(0.696) translateZ(0)" : "scale(0) translateZ(0)",
    transition: reducedMotion
      ? "opacity .4s"
      : "transform .4s, opacity .4s, border-radius .4s",
  };

  return (
    <>
      {/* Hide the native cursor on exactly the viewports where the follower
          shows (md+), so narrow windows keep a usable native cursor. */}
      <style>{`@media (min-width: 768px) { html, *, *:hover { cursor: none !important; } }`}</style>

      <div ref={rootRef} style={rootStyle} className="hidden md:block">
        {/* Circle */}
        <div style={circleStyle} />

        {/* Label: text string, glyph, or ReactNode icon */}
        <div style={labelStyle}>{labelNode}</div>

        {/* Media preview — circle (400×400) or window (320×180 with 16:9 aspect-ratio) */}
        {mediaShape === "circle" ? (
          <div style={{ position: "absolute", width: 400, height: 400, top: -200, left: -200, pointerEvents: "none" }}>
            <div style={mediaBoxStyle}>
              {mediaSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaSrc} alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              )}
            </div>
          </div>
        ) : (
          <div style={{ position: "absolute", width: 320, height: 180, top: -90, left: -160, pointerEvents: "none" }}>
            <div style={mediaBoxStyle}>
              {mediaSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaSrc} alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
