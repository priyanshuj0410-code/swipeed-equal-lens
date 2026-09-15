"use client";

// UN & RE: the unlearn, relearn duo behind the core principle (Unlearn → Relearn → Grow), now the
// official Equal Lens characters: UN (the eraser, Insight teal) gently rubs out an old idea without
// shame; RE (the pencil, Grow coral) redraws the truer one, with a reason. Shared so the duo looks the
// same everywhere. (Art: /brand/un.svg, /brand/re.svg.)
export function UnReBeat({ un, re, why, fill = false }: { un: string; re: string; why?: string; fill?: boolean }) {
  return (
    <div className={`glass-pill animate-in fade-in leading-relaxed ${fill ? "flex flex-1 flex-col justify-center gap-3 rounded-3xl px-6 py-8 text-base" : "rounded-2xl px-4 py-3 text-sm"}`} style={{ color: "var(--color-ink)" }}>
      <p className="flex items-start gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/un.svg" alt="" aria-hidden draggable={false} className="-mt-0.5 size-9 shrink-0 object-contain" />
        <span><b style={{ color: "var(--color-insight)" }}>UN:</b> {un}</span>
      </p>
      <p className="mt-1.5 flex items-start gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/re.svg" alt="" aria-hidden draggable={false} className="-mt-0.5 size-9 shrink-0 object-contain" />
        <span><b style={{ color: "var(--color-grow)" }}>RE:</b> {re}</span>
      </p>
      {/* the reason, as its own quieter line so every text block stays short (the un/re text carries the beat) */}
      {why ? <p className={`${fill ? "pl-[2.875rem] text-sm" : "pl-7 text-xs"} opacity-75`}>{why}</p> : null}
    </div>
  );
}
