// Sam — the soft, shape-shifting companion the child meets in Feelings Friends and travels with for
// the whole journey. One shared definition so Sam looks the same across every game (a friendly DOM
// avatar; the 3D path companion can't render inside a DOM overlay). Gentle bob, brand violet.
export function Sam({ size = 72 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className="shrink-0 anim-bob drop-shadow"
      aria-hidden
    >
      <rect x="8" y="8" width="48" height="48" rx="20" fill="#7C5CFC" />
      <circle cx="25" cy="30" r="4.5" fill="#fff" />
      <circle cx="39" cy="30" r="4.5" fill="#fff" />
      <circle cx="25" cy="31" r="2" fill="#1f1147" />
      <circle cx="39" cy="31" r="2" fill="#1f1147" />
      <path d="M24 40 Q32 47 40 40" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
