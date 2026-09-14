"use client";

import { useRef, useState } from "react";
import { usePointerDrag } from "@/components/games/interactions";

// The two-way swipe card, used by the lesson engine's swipe beats (Green Light / Red Light, Reality Check) and meant
// to carry myth cards next (SWED-70). Swipe the card to a side, flick it, press ←/→ on the focused card, or tap one
// of the two side buttons under it. The buttons are the tap and screen-reader floor: before them a player who could
// not drag, or could not see the card, had no way to answer. While dragging, the card tints toward that side and a
// word-plus-emoji badge names it, so colour is never the only signal. A short drag springs back; a wrong side
// springs back and the engine speaks a nudge. Once the right side is chosen the card ignores further input.

export type SwipeSide = "left" | "right";
export type SideStyle = { emoji: string; tint: string };

export function SwipeCard({ cue, left, right, answer, styles, reduceMotion, onCorrect, onMiss }: {
  cue: string;
  left: string;
  right: string;
  answer: SwipeSide;
  styles: [SideStyle, SideStyle];
  reduceMotion: boolean;
  onCorrect: () => void;
  onMiss: (side: SwipeSide) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);
  const [dx, setDx] = useState(0);
  const [flyTo, setFlyTo] = useState<0 | 1 | -1>(0);
  const [L, R] = styles;
  const threshold = () => Math.max(72, (cardRef.current?.offsetWidth ?? 300) * 0.25);

  const commit = (side: SwipeSide) => {
    if (doneRef.current) return;
    if (side !== answer) { setDx(0); onMiss(side); return; }
    doneRef.current = true;
    if (reduceMotion) onCorrect();
    else { setFlyTo(side === "left" ? -1 : 1); setTimeout(onCorrect, 250); }
  };
  const drag = usePointerDrag({
    disabled: flyTo !== 0,
    onMove: (s) => { if (!doneRef.current) setDx(s.dx); },
    onEnd: (s) => {
      const t = threshold();
      if (s.dx > t || s.vx > 0.5) commit("right");
      else if (s.dx < -t || s.vx < -0.5) commit("left");
      else setDx(0);
    },
    onTap: () => setDx(0),
  });
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); commit("left"); }
    else if (e.key === "ArrowRight") { e.preventDefault(); commit("right"); }
  };
  const dir = dx < -8 ? "left" : dx > 8 ? "right" : null;
  const edge = dir === "left" ? L : dir === "right" ? R : null;
  const tx = flyTo !== 0 ? flyTo * 700 : dx;
  const sideButton = (side: SwipeSide) => {
    const st = side === "left" ? L : R, label = side === "left" ? left : right;
    return (
      <button type="button" onClick={() => commit(side)} disabled={flyTo !== 0}
        className="glass-pill flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-bold text-foreground transition-transform active:scale-95 disabled:opacity-100">
        {side === "left" && <span aria-hidden>{st.emoji}</span>}
        <span className="truncate">{label}</span>
        {side === "right" && <span aria-hidden>{st.emoji}</span>}
      </button>
    );
  };
  return (
    <div className="flex flex-1 flex-col gap-3">
      <div
        ref={cardRef} tabIndex={0} role="group"
        aria-roledescription="card you swipe left or right"
        aria-label={`${cue}. Swipe left or press Left arrow for ${left}; swipe right or press Right arrow for ${right}.`}
        onKeyDown={onKeyDown}
        {...drag.handlers}
        className="glass-card relative flex min-h-64 w-full flex-1 cursor-grab select-none items-center justify-center overflow-hidden rounded-3xl px-7 py-12 text-center text-[20px] font-bold leading-snug text-foreground backdrop-blur-[12px] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-ink)] active:cursor-grabbing"
        style={{ transform: `translateX(${tx}px) rotate(${tx * 0.035}deg)`, transition: drag.dragging ? "none" : reduceMotion ? "none" : "transform 0.25s ease-out", touchAction: "pan-y", boxShadow: edge ? `6px 6px 0 0 ${edge.tint}` : undefined }}
      >
        {edge && (
          <>
            <div className="pointer-events-none absolute inset-0" style={{ background: edge.tint, opacity: 0.16 }} aria-hidden />
            <span className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-8xl ${dir === "left" ? "left-3" : "right-3"}`} style={{ opacity: 0.18 }} aria-hidden>{edge.emoji}</span>
            <span className={`absolute top-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-extrabold text-[var(--prx-on-fill)] shadow-md ${dir === "left" ? "left-3" : "right-3"}`} style={{ background: edge.tint }} aria-hidden>
              {dir === "left" ? <>{edge.emoji} {left}</> : <>{right} {edge.emoji}</>}
            </span>
          </>
        )}
        <span className="relative z-10">{cue}</span>
      </div>
      <div className="flex gap-3">
        {sideButton("left")}
        {sideButton("right")}
      </div>
    </div>
  );
}
