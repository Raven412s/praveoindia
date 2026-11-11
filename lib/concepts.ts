export type ConceptKey = "pro" | "bite" | "shake" | "brew" | "fresh";

export interface Concept {
  key: ConceptKey;
  name: string;
  subtitle: string;
  tagline: string;
  whatsOn: string;
  place: string;
  personality: string;
  on: string;
}

export const concepts: Concept[] = [
  {
    key: "pro",
    name: "PRO",
    subtitle: "High protein food",
    tagline: "Protein that tastes good.",
    whatsOn: "Eggs • protein bowls • chicken • protein sandwiches",
    place: "Gyms, fitness centres, sports zones",
    personality: "Performance • Discipline • Fresh energy",
    on: "#fff",
  },
  {
    key: "bite",
    name: "BITE",
    subtitle: "Burgers • fries • wraps",
    tagline: "Follow the crave.",
    whatsOn: "Burgers • fries • loaded sandwiches • wraps",
    place: "Markets, colleges, evening hotspots",
    personality: "Bold • Craveable • Fun",
    on: "#fff",
  },
  {
    key: "shake",
    name: "SHAKE",
    subtitle: "Shakes • smoothies • fruits",
    tagline: "Blend your mood.",
    whatsOn: "Fruit shakes • smoothies • thick shakes • fruit bowls",
    place: "Colleges, parks, active streets",
    personality: "Playful • Fresh • Youthful",
    on: "#202020",
  },
  {
    key: "brew",
    name: "BREW",
    subtitle: "Coffee • tea",
    tagline: "Make it a good day.",
    whatsOn: "Coffee • cold coffee • tea • quick beverages",
    place: "Office zones, colleges, commercial districts",
    personality: "Calm • Premium • Social",
    on: "#fff",
  },
  {
    key: "fresh",
    name: "FRESH",
    subtitle: "Fresh food • salads • bowls",
    tagline: "Keep it fresh.",
    whatsOn: "Salads • fresh bowls • cut fruits • fresh snacks",
    place: "Parks, wellness areas, lifestyle zones",
    personality: "Clean • Light • Contemporary",
    on: "#202020",
  },
];

/** Accent CSS variable per concept — proposals live only in app/globals.css. */
export const conceptColorVar: Record<ConceptKey, string> = {
  pro: "var(--pro)",
  bite: "var(--bite)",
  shake: "var(--shake)",
  brew: "var(--brew)",
  fresh: "var(--fresh)",
};

/**
 * Fired by scroll-driven sections (e.g. CartStreet) when they stop owning the
 * global accent, so ConceptPicker can re-apply the user's chosen concept.
 */
export const ACCENT_SYNC_EVENT = "praveo:accent-sync";

/** Apply a concept's accent colours (--c / --on) to the document root. */
export function applyConceptColors(concept: Concept): void {
  const root = document.documentElement;
  root.style.setProperty("--c", conceptColorVar[concept.key]);
  root.style.setProperty("--on", concept.on);
}
