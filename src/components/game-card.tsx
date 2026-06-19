"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Flag, LifeBuoy, Sparkles } from "lucide-react";
import type { GameView } from "@/components/path-scene";
import type { Flag as FlagType } from "@/lib/types";

const COMMIT = 0.32;
// light accents that read on the dark frosted glass
const LGREEN = "#62e08f";
const LRED = "#ff9085";
const LBLUE = "#b3c8ff";

function PlayFace({ view, greenHint, redHint }: { view: GameView; greenHint: number; redHint: number }) {
  const c = view.card;
  return (
    <>
      <span className="flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/95">
        {c.context_tag}
      </span>
      <p className="flex flex-1 items-center text-balance text-center font-display text-[1.65rem] font-semibold leading-snug text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]">
        {c.scenario_text}
      </p>
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="flex items-center gap-1" style={{ color: LRED }}>
          <Flag className="size-3.5" aria-hidden /> {view.labels.left}
        </span>
        <span className="flex items-center gap-1" style={{ color: LGREEN }}>
          {view.labels.right} <Check className="size-3.5" aria-hidden />
        </span>
      </div>
      {/* swipe stamps */}
      <span
        className="pointer-events-none absolute right-5 top-14 flex items-center gap-1 rounded-lg border-2 px-2 py-0.5 text-sm font-extrabold uppercase"
        style={{ opacity: greenHint, color: LGREEN, borderColor: LGREEN, transform: "rotate(12deg)" }}
      >
        <Check className="size-4" aria-hidden /> {view.labels.right}
      </span>
      <span
        className="pointer-events-none absolute left-5 top-14 flex items-center gap-1 rounded-lg border-2 px-2 py-0.5 text-sm font-extrabold uppercase"
        style={{ opacity: redHint, color: LRED, borderColor: LRED, transform: "rotate(-12deg)" }}
      >
        <Flag className="size-4" aria-hidden /> {view.labels.left}
      </span>
    </>
  );
}

function RevealFace({ view }: { view: GameView }) {
  const c = view.card;
  if (c.is_safeguarding) {
    return (
      <div className="flex h-full flex-col gap-3">
        <span className="flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide" style={{ color: LBLUE }}>
          <LifeBuoy className="size-5" aria-hidden /> You matter
        </span>
        <p className="font-display text-2xl font-bold leading-tight text-white">This one&apos;s serious — and it&apos;s not your fault.</p>
        <p className="flex-1 text-sm leading-relaxed text-white/80">{c.feedback_short}</p>
        <p className="text-xs text-white/70">Talk to an adult you trust · tap Get Help anytime.</p>
      </div>
    );
  }
  const color = view.correct ? LGREEN : LRED;
  return (
    <div className="relative flex h-full flex-col gap-2.5 animate-in fade-in zoom-in-95 duration-300">
      <span className="absolute inset-x-0 -top-1 h-1.5 rounded-full" style={{ background: color }} aria-hidden />
      <div className="flex items-center justify-between pt-2">
        <span className="flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide" style={{ color }}>
          {view.correct ? <Check className="size-5" aria-hidden /> : <Flag className="size-5" aria-hidden />}
          {view.correct ? "Spot on" : "Look again"}
        </span>
        {view.correct && view.points > 0 && (
          <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold text-black/80" style={{ background: color }}>
            <Sparkles className="size-3" aria-hidden /> +{view.points}
          </span>
        )}
      </div>
      <p className="font-display text-[1.8rem] font-bold leading-tight" style={{ color }}>
        {c.sign}
      </p>
      <p className="flex-1 text-sm leading-relaxed text-white/85">{c.feedback_short}</p>
      {c.is_disguised && (
        <span className="w-fit rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase text-white/90">Disguised — nice catch</span>
      )}
    </div>
  );
}

/** DOM "liquid glass" card floating over the 3D path grassland; drag to swipe. */
export function GameCard({ view, onCommit }: { view: GameView; onCommit: (f: FlagType) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const [dx, setDx] = useState(0);
  const playable = view.phase === "play" && !view.exiting;

  useEffect(() => {
    setDx(0);
  }, [view.card, view.phase]);

  function onDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!playable) return;
    startX.current = e.clientX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }
  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (startX.current == null) return;
    setDx(e.clientX - startX.current);
  }
  function onUp() {
    if (startX.current == null) return;
    startX.current = null;
    const w = ref.current?.offsetWidth ?? 320;
    const th = w * COMMIT;
    if (dx > th) onCommit("green");
    else if (dx < -th) onCommit("red");
    else setDx(0);
  }

  const dir = view.exiting === "green" ? 1 : view.exiting === "red" ? -1 : 0;
  const transform = view.exiting ? `translateX(${dir * 120}vw) rotate(${dir * 22}deg)` : `translateX(${dx}px) rotate(${dx / 24}deg)`;
  const transition = view.exiting ? "transform 0.38s ease-in" : startX.current === null ? "transform 0.25s ease" : "none";
  const greenHint = Math.max(0, Math.min(1, dx / 120));
  const redHint = Math.max(0, Math.min(1, -dx / 120));

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center px-6">
      <div
        ref={ref}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="glass-card pointer-events-auto relative flex aspect-[3/4] w-full max-w-sm touch-none select-none flex-col p-6 backdrop-blur-xl backdrop-saturate-150"
        style={{ transform, transition, cursor: playable ? "grab" : "default" }}
      >
        {view.phase === "reveal" ? <RevealFace view={view} /> : <PlayFace view={view} greenHint={greenHint} redHint={redHint} />}
      </div>
    </div>
  );
}
