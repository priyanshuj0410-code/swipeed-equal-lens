import confetti from "canvas-confetti";

const COLORS = ["#62b84b", "#e05c52", "#4f6ef7", "#f5c518"];

/** A small burst for a good moment; a big one for a great one. Respects reduced-motion. */
export function celebrate(power: "small" | "big" = "small") {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

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
