type PropType = "tree" | "bush" | "rock" | "flower" | "tuft";

/** A small roadside prop, drawn from its base (y = 0) upward. SVG <g>. */
export function EnvProp({
  x,
  y,
  type,
  scale = 1,
  flip = false,
}: {
  x: number;
  y: number;
  type: PropType;
  scale?: number;
  flip?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      {type === "tree" && (
        <>
          <rect x={-4} y={-24} width={8} height={26} rx={3} fill="#7a5a3a" />
          <circle cx={0} cy={-40} r={17} fill="var(--grass-edge)" />
          <circle cx={-11} cy={-30} r={12} fill="var(--grass)" />
          <circle cx={11} cy={-30} r={12} fill="var(--grass)" />
          <circle cx={0} cy={-35} r={14} fill="var(--grass)" />
        </>
      )}
      {type === "bush" && (
        <>
          <circle cx={-9} cy={-9} r={10} fill="var(--grass-edge)" />
          <circle cx={9} cy={-9} r={10} fill="var(--grass)" />
          <circle cx={0} cy={-14} r={12} fill="var(--grass)" />
        </>
      )}
      {type === "rock" && (
        <>
          <ellipse cx={0} cy={-6} rx={15} ry={10} fill="#b7b0a4" />
          <ellipse cx={-3} cy={-9} rx={8} ry={5} fill="#cfc9bd" />
        </>
      )}
      {type === "flower" && (
        <>
          <rect x={-1.5} y={-16} width={3} height={16} rx={1.5} fill="var(--grass-edge)" />
          <circle cx={-5} cy={-20} r={4} fill="#f0a6c0" />
          <circle cx={5} cy={-20} r={4} fill="#f0a6c0" />
          <circle cx={0} cy={-25} r={4} fill="#f0a6c0" />
          <circle cx={0} cy={-15} r={4} fill="#f0a6c0" />
          <circle cx={0} cy={-20} r={3.5} fill="var(--accent-amber)" />
        </>
      )}
      {type === "tuft" && (
        <>
          <path d="M0 0 Q -4 -13 -8 -16" stroke="var(--grass-edge)" strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M0 0 Q 0 -15 2 -18" stroke="var(--grass)" strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M0 0 Q 5 -12 9 -15" stroke="var(--grass)" strokeWidth={3} fill="none" strokeLinecap="round" />
        </>
      )}
    </g>
  );
}

/** A decorative grassy ground band: a normal-flow footer that grounds a screen in the path's world. */
export function GroundScenery({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none w-full ${className}`} aria-hidden>
      <svg viewBox="0 0 400 120" width="100%" preserveAspectRatio="xMidYMax meet" className="block">
        <path d="M0 72 Q 110 50 210 66 T 400 62 L400 120 L0 120 Z" fill="var(--grass)" />
        <path d="M0 72 Q 110 50 210 66 T 400 62" fill="none" stroke="var(--grass-edge)" strokeWidth={5} strokeLinecap="round" />
        <EnvProp x={56} y={70} type="tree" scale={1.1} />
        <EnvProp x={120} y={80} type="tuft" scale={1} />
        <EnvProp x={170} y={78} type="bush" scale={1} />
        <EnvProp x={230} y={74} type="flower" scale={1} />
        <EnvProp x={290} y={82} type="rock" scale={0.9} />
        <EnvProp x={344} y={72} type="tree" scale={0.9} flip />
      </svg>
    </div>
  );
}
