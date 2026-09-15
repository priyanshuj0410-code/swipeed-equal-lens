"use client";

import { Heart } from "lucide-react";

// The character's Clarity meter: the run's stake (not player "lives"). Tints calm-teal when high,
// warm-amber as it dips, alarmed-red when low, so it reads as the story's mood-ring.
function clarityColor(v: number): string {
  if (v >= 60) return "#62e08f"; // grounded
  if (v >= 35) return "#ffce6a"; // tense
  return "#ff9085"; // alarmed
}

export function ClarityMeter({ value, name }: { value: number; name: string }) {
  const v = Math.max(0, Math.min(100, value));
  const color = clarityColor(v);
  return (
    <div className="glass-pill flex items-center gap-2 rounded-full px-3 py-1.5 backdrop-blur-md backdrop-saturate-150">
      <Heart className="size-3.5 shrink-0" style={{ color }} fill="currentColor" aria-hidden />
      <span className="sr-only">{name}&apos;s clarity</span>
      <span className="relative h-2 w-24 overflow-hidden rounded-full bg-foreground/15" role="meter" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100} aria-label={`${name}'s clarity`}>
        <span
          className="absolute inset-y-0 left-0 rounded-full transition-[width,background-color] duration-500"
          style={{ width: `${v}%`, background: color }}
        />
      </span>
    </div>
  );
}
