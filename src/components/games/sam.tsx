// Sam — the companion the child travels with for the whole journey, now rendered as Lensy, The Equal
// Lens mascot (the curious purple alien). One shared definition so Sam/Lensy looks the same across every
// game; keeps the size ramp (the companion "grows with you") and the gentle mascot bob. No CSS shadow —
// Lensy's art carries its own ground shadow, and the mark/mascot take no effects (brand p.10).
type Pose = "wave" | "stand" | "think" | "idea";

export function Sam({ size = 72, pose = "wave" }: { size?: number; pose?: Pose }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/brand/lensy/lensy-${pose}.svg`}
      width={size}
      height={size}
      alt=""
      aria-hidden
      draggable={false}
      className="shrink-0 anim-bob object-contain"
    />
  );
}
