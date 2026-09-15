import type { Sign, SignId } from "@/lib/types";

// The 20 signs: adapted from the One Love Foundation's ten signs of a healthy /
// unhealthy relationship. This published taxonomy keeps classifications defensible
// and gives players a real, transferable vocabulary.
export const SIGNS: Sign[] = [
  // Green-flag signs (swipe right)
  { id: "comfortable-pace", name: "Comfortable Pace", flag: "green", definition: "The relationship moves at a speed that feels right for both." },
  { id: "trust", name: "Trust", flag: "green", definition: "Confidence that the other person won't hurt or betray you." },
  { id: "honesty", name: "Honesty", flag: "green", definition: "Being truthful, even when it's hard." },
  { id: "independence", name: "Independence", flag: "green", definition: "Space to be your own person and have your own life." },
  { id: "respect", name: "Respect", flag: "green", definition: "Valuing each other's opinions, feelings and boundaries." },
  { id: "equality", name: "Equality", flag: "green", definition: "Equal say and equal worth; no one 'above' the other." },
  { id: "kindness", name: "Kindness", flag: "green", definition: "Caring for each other, including small everyday gestures." },
  { id: "taking-responsibility", name: "Taking Responsibility", flag: "green", definition: "Owning your actions and apologising sincerely." },
  { id: "healthy-conflict", name: "Healthy Conflict", flag: "green", definition: "Disagreeing openly and respectfully, then resolving it." },
  { id: "fun", name: "Fun", flag: "green", definition: "Enjoying each other; feeling relaxed and yourself." },
  // Red-flag signs (swipe left)
  { id: "intensity", name: "Intensity", flag: "red", definition: "Too much, too fast: overwhelming feelings or demands." },
  { id: "possessiveness", name: "Possessiveness", flag: "red", definition: "Jealousy and control over what you do and whom you see." },
  { id: "manipulation", name: "Manipulation", flag: "red", definition: "Influencing you unfairly to get their way." },
  { id: "isolation", name: "Isolation", flag: "red", definition: "Cutting you off from friends, family or activities." },
  { id: "sabotage", name: "Sabotage", flag: "red", definition: "Deliberately undermining your reputation, plans or success." },
  { id: "belittling", name: "Belittling", flag: "red", definition: "Put-downs, criticism and 'jokes' that make you feel small." },
  { id: "guilting", name: "Guilting", flag: "red", definition: "Using guilt to control your choices." },
  { id: "volatility", name: "Volatility", flag: "red", definition: "Strong, unpredictable swings; walking on eggshells." },
  { id: "deflecting-responsibility", name: "Deflecting Responsibility", flag: "red", definition: "Blaming you (or others) for their behaviour." },
  { id: "betrayal", name: "Betrayal", flag: "red", definition: "Disloyalty, broken trust, two-facedness." },
];

export const SIGN_BY_ID: Record<SignId, Sign> = Object.fromEntries(
  SIGNS.map((s) => [s.id, s])
) as Record<SignId, Sign>;

export const GREEN_SIGNS = SIGNS.filter((s) => s.flag === "green");
export const RED_SIGNS = SIGNS.filter((s) => s.flag === "red");
