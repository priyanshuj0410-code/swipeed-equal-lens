"use client";

import { useState } from "react";
import { Check } from "lucide-react";

// Shared inclusive avatar builder — "Make-a-Friend" (Same Same, Different) and "Make-a-Can-Do-Kid"
// (Can-Do Kids). One definition so creation looks the same across games, and disability inclusion is
// baked in for every game that builds a character (pattern #17). Calls onAdd(candoLine) so the host can
// narrate + reward.
export const KID_SKINS = ["🧒🏻", "🧒🏽", "🧒🏿"];
export const KID_ACCESSORIES = [
  { id: "none", label: "Just me", emoji: "" },
  { id: "glasses", label: "Glasses", emoji: "👓" },
  { id: "wheelchair", label: "Wheelchair", emoji: "🦽" },
  { id: "hearing", label: "Hearing aid", emoji: "🦻" },
];
export const KID_CANDO = [
  "fly a plane! ✈️", "cook dinner! 🍳", "lead the team! 🧭", "score a goal! ⚽",
  "be a doctor! 🩺", "be a scientist! 🔬", "dance! 💃", "build a bridge! 🌉",
];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

export function MakeAKid({ ctaLabel = "Add to my garden", onAdd }: { ctaLabel?: string; onAdd: (cando: string) => void }) {
  const [skin, setSkin] = useState(1);
  const [acc, setAcc] = useState(0);
  const [cando] = useState(() => pick(KID_CANDO));
  const [added, setAdded] = useState(false);

  return (
    <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
      <div className="glass-card flex flex-col items-center gap-2 rounded-2xl py-6 backdrop-blur-[12px] backdrop-saturate-150">
        <span className="text-6xl" aria-hidden>{`${KID_SKINS[skin]}${KID_ACCESSORIES[acc].emoji}`}</span>
        <span className="text-sm font-semibold text-foreground">They can {cando}</span>
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground/65">Skin</p>
      <div className="grid grid-cols-3 gap-2">
        {KID_SKINS.map((s, i) => (
          <button key={i} type="button" onClick={() => setSkin(i)} className="glass-card rounded-2xl py-3 text-3xl backdrop-blur-[12px] transition-transform active:scale-95" style={skin === i ? { boxShadow: "inset 0 0 0 2px #7C5CFC" } : undefined}>
            {s}
          </button>
        ))}
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground/65">Add</p>
      <div className="grid grid-cols-4 gap-2">
        {KID_ACCESSORIES.map((a, i) => (
          <button key={a.id} type="button" onClick={() => setAcc(i)} className="glass-card flex flex-col items-center gap-0.5 rounded-2xl py-2.5 backdrop-blur-[12px] transition-transform active:scale-95" style={acc === i ? { boxShadow: "inset 0 0 0 2px #7C5CFC" } : undefined}>
            <span className="text-xl" aria-hidden>{a.emoji || "🙂"}</span>
            <span className="text-[10px] font-bold text-foreground">{a.label}</span>
          </button>
        ))}
      </div>
      <button type="button" disabled={added} onClick={() => { setAdded(true); onAdd(cando); }} className="cta flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95 disabled:opacity-50">
        <Check className="size-5" aria-hidden /> {ctaLabel}
      </button>
    </div>
  );
}
