// Day / evening / night, by the device clock. This is a lighting *modifier* that composes
// ON TOP of the active season (final look = season × time of day): a calmer, warmer, dimmer
// evening and a cool dark night with a moon + stars. Honest framing: a soothing evening +
// bedtime wind-down, not a blue-light health claim.
import * as THREE from "three";

export type Phase = "day" | "evening" | "night";

export type PhaseDef = {
  skyMul: number; // sky/bg brightness
  fogMul: number; // fog range
  lightMul: number; // sun intensity
  warmth: number; // lerp sky/fog/sun toward `tint`
  lamps: number; // 0..1 lamp-glow amount
  night: number; // 0..1 — stars/moon visibility
  tint: THREE.Color;
};

export const PHASES: Record<Phase, PhaseDef> = {
  day: { skyMul: 1.0, fogMul: 1.0, lightMul: 1.0, warmth: 0.0, lamps: 0, night: 0, tint: new THREE.Color("#ffffff") },
  evening: { skyMul: 0.82, fogMul: 0.92, lightMul: 0.74, warmth: 0.5, lamps: 1, night: 0.3, tint: new THREE.Color("#ffb066") },
  night: { skyMul: 0.26, fogMul: 0.82, lightMul: 0.32, warmth: 0.3, lamps: 1, night: 1, tint: new THREE.Color("#2c3a66") },
};

export function phaseForHour(h: number): Phase {
  if (h >= 19 || h < 6) return "night"; // 7pm–6am
  if (h >= 17) return "evening"; // 5–7pm golden hour
  return "day";
}

// Device clock by default; `?tod=day|evening|night` forces a phase (preview / parent control hook).
export function currentPhase(): Phase {
  if (typeof window !== "undefined") {
    const o = new URLSearchParams(window.location.search).get("tod");
    if (o === "day" || o === "evening" || o === "night") return o;
  }
  return phaseForHour(new Date().getHours());
}

export const WARM = new THREE.Color("#ffe2b0"); // warm-white the sun shifts toward in the evening
export const MOON_TINT = new THREE.Color("#a8b8e6"); // cool moonlight at night
