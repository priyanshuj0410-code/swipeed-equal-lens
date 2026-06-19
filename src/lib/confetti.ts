import confetti from "canvas-confetti";
import { sfx } from "@/lib/juice";

const COLORS = ["#62b84b", "#e05c52", "#4f6ef7", "#f5c518"];

/**
 * A small burst for a good moment; a big one for a great one. This is the **shared positive-feedback
 * cue across every game**: confetti (respecting reduced-motion) AND a chime (small → "green", big →
 * "win"), so all games sound consistent without each wiring its own audio. Pass `{ sound: false }`
 * where the caller already owns the sound (the swipe atom, the run host/debrief) to avoid double-play.
 * The chime is mute-aware (see `lib/juice.ts`) and still plays under reduced-motion — audio isn't motion.
 */
export function celebrate(power: "small" | "big" = "small", opts?: { sound?: boolean }) {
  if (typeof window === "undefined") return;
  if (opts?.sound !== false) sfx(power === "big" ? "win" : "green");
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return; // confetti only below

  if (power === "big") {
    confetti({ particleCount: 130, spread: 85, startVelocity: 45, origin: { y: 0.55 }, colors: COLORS, scalar: 1 });
    setTimeout(
      () => confetti({ particleCount: 70, spread: 110, startVelocity: 30, origin: { y: 0.6 }, colors: COLORS }),
      180
    );
  } else {
    confetti({ particleCount: 55, spread: 60, startVelocity: 35, origin: { y: 0.6 }, colors: COLORS, scalar: 0.9 });
  }
}
