"use client";

import { useEffect, useState } from "react";
import { X, Wind } from "lucide-react";
import { useProfile } from "@/lib/store";
import { Sam } from "@/components/games/sam";
import { BreathingSpace } from "@/components/toolkit/breathing-space";

// A gentle, optional "how are you?" on entry (the wellbeing shell). Shown at most once a day, never
// required, never judged, and — for privacy — the mood *value* is never stored, only that a check-in
// happened. A low day softly offers the breathing space and a reminder that help is in the corner.
const MOODS = [
  { e: "😄", label: "Great", low: false },
  { e: "🙂", label: "Okay", low: false },
  { e: "😐", label: "Meh", low: false },
  { e: "😟", label: "Not great", low: true },
  { e: "😢", label: "Rough", low: true },
];

function todayKey(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function MoodCheckIn() {
  const { profile, ready, recordMoodCheck } = useProfile();
  const [show, setShow] = useState(false);
  const [picked, setPicked] = useState<null | boolean>(null); // null = not yet; true = low; false = fine
  const [breathing, setBreathing] = useState(false);

  useEffect(() => {
    if (!ready || !profile.onboarded) return;
    if (profile.mood?.lastCheckDayKey === todayKey()) return;
    const t = setTimeout(() => setShow(true), 1400);
    return () => clearTimeout(t);
  }, [ready, profile.onboarded, profile.mood?.lastCheckDayKey]);

  if (!show) return null;

  const close = () => {
    recordMoodCheck();
    setShow(false);
  };
  const pick = (low: boolean) => {
    recordMoodCheck();
    setPicked(low);
    if (!low) window.setTimeout(() => setShow(false), 1500);
  };

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-[52] flex justify-center px-4 pb-4">
        <div className="glass-card w-full max-w-sm rounded-3xl p-5 backdrop-blur-[16px] backdrop-saturate-150 animate-in slide-in-from-bottom duration-300" style={{ color: "var(--color-ink)" }}>
          <button type="button" onClick={close} aria-label="Close" className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-foreground/10 transition-transform active:scale-95">
            <X className="size-4" aria-hidden />
          </button>

          {picked === null && (
            <>
              <div className="mb-3 flex items-center gap-3">
                <Sam size={48} />
                <p className="font-display text-base font-bold">How are you today? There's no wrong answer.</p>
              </div>
              <div className="flex justify-between gap-1">
                {MOODS.map((m) => (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => pick(m.low)}
                    className="flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 transition-transform active:scale-95"
                  >
                    <span className="text-3xl" aria-hidden>{m.e}</span>
                    <span className="text-[11px] font-semibold text-foreground/70">{m.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {picked === true && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Sam size={48} />
                <p className="text-sm font-semibold">Thanks for telling me. Hard days happen — and they pass. Want a moment to just breathe?</p>
              </div>
              <button type="button" onClick={() => setBreathing(true)} className="cta flex h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-sm font-bold text-slate-900 transition-transform active:scale-95">
                <Wind className="size-4" aria-hidden /> Breathing space
              </button>
              <p className="text-center text-xs text-foreground/60">You can always talk to someone — the Get Help button is in the corner.</p>
              <button type="button" onClick={() => setShow(false)} className="text-xs font-semibold text-foreground/70">I'm okay for now</button>
            </div>
          )}

          {picked === false && (
            <div className="flex items-center gap-3">
              <Sam size={48} />
              <p className="text-sm font-semibold">Love that. Have a good one! 💛</p>
            </div>
          )}
        </div>
      </div>

      {breathing && <BreathingSpace onClose={() => { setBreathing(false); setShow(false); }} />}
    </>
  );
}
