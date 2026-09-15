"use client";

import type { RunFork } from "@/lib/use-run-game";
import type { Character } from "@/lib/types";
import { MessageCircle, ShieldCheck, DoorOpen, ArrowRight } from "lucide-react";

// The story fork: twice per run the player decides (not just judges), changing later cards and the
// ending. Choices teach communication / boundary-setting / safe exit. Full-screen glass overlay over
// the grassland.
const ICONS = [MessageCircle, ShieldCheck, DoorOpen];

export function ForkScreen({ fork, character, onChoose }: { fork: RunFork; character: Character; onChoose: (branch: string) => void }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center px-6">
      <div className="glass-card w-full max-w-sm p-6 backdrop-blur-[14px] backdrop-saturate-150 animate-in fade-in zoom-in-95 duration-300" style={{ color: "var(--color-ink)" }}>
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-foreground/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
          {character.avatar} {character.name}&apos;s choice
        </span>
        <p className="mt-3 text-balance font-display text-xl font-bold leading-snug">{fork.prompt}</p>
        <div className="mt-5 flex flex-col gap-2.5">
          {fork.choices.map((c, i) => {
            const Icon = ICONS[i] ?? ArrowRight;
            return (
              <button
                key={c.branch}
                type="button"
                onClick={() => onChoose(c.branch)}
                className="glass-pill group flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-[0.98]"
              >
                <Icon className="size-5 shrink-0 opacity-90" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{c.label}</span>
                  <span className="block text-xs text-foreground/70">{c.hint}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-70" aria-hidden />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
