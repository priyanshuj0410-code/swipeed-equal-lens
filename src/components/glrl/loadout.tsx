"use client";

import { useState } from "react";
import { X, Play, Zap } from "lucide-react";
import type { PerkId, RunDeckId } from "@/lib/types";
import { RUN_DECKS } from "@/content/runs";
import { CHARACTER_BY_ID } from "@/content/characters";
import { PERKS, LOADOUT, SYNERGIES } from "@/content/perks";

// Pre-run setup: pick a story deck + character, then equip 2–3 Insight perks (reading/learning aids,
// never auto-win). A synergy line nudges fun combinations. "Quick Play" drops to the v1 straight swipe.
export function Loadout({
  schoolComfort,
  onStart,
  onQuickPlay,
  onExit,
}: {
  schoolComfort: boolean;
  onStart: (deckId: RunDeckId, perks: PerkId[]) => void;
  onQuickPlay: () => void;
  onExit: () => void;
}) {
  const decks = RUN_DECKS.filter((d) => !schoolComfort || d.schoolComfortSafe);
  const [deck, setDeck] = useState<RunDeckId | null>(decks[0]?.id ?? null);
  const [perks, setPerks] = useState<PerkId[]>([]);

  const togglePerk = (id: PerkId) =>
    setPerks((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= LOADOUT.max ? p : [...p, id]));

  const ready = deck !== null && perks.length >= LOADOUT.min && perks.length <= LOADOUT.max;
  const synergy = SYNERGIES.find((s) => s.perks.every((p) => perks.includes(p)));

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto px-5 py-8">
      <div className="glass-card w-full max-w-sm p-5 backdrop-blur-[14px] backdrop-saturate-150" style={{ color: "#eef1f7" }}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Start a run</h2>
          <button type="button" aria-label="Back to path" onClick={onExit} className="rounded-full p-1 transition-transform active:scale-90">
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {/* deck + character pick */}
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-white/65">Whose story?</p>
        <div className="mt-2 flex flex-col gap-2">
          {decks.map((d) => {
            const ch = CHARACTER_BY_ID[d.character];
            const on = deck === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setDeck(d.id)}
                className="glass-pill flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left backdrop-blur-md transition-transform active:scale-[0.98]"
                style={on ? { borderColor: "rgba(255,255,255,0.55)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.4)" } : undefined}
                aria-pressed={on}
              >
                <span className="text-2xl" aria-hidden>{d.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{d.title} <span className="text-white/60">· {ch.name}</span></span>
                  <span className="block truncate text-xs text-white/70">{d.blurb}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* perk loadout */}
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-white/65">
          Equip perks ({perks.length}/{LOADOUT.max})
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {PERKS.map((p) => {
            const on = perks.includes(p.id);
            const full = !on && perks.length >= LOADOUT.max;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePerk(p.id)}
                disabled={full}
                title={p.effect}
                className="glass-pill flex items-start gap-2 rounded-xl px-2.5 py-2 text-left backdrop-blur-md transition-transform active:scale-[0.97] disabled:opacity-40"
                style={on ? { borderColor: "rgba(255,255,255,0.55)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.4)" } : undefined}
                aria-pressed={on}
              >
                <span className="text-lg leading-none" aria-hidden>{p.emoji}</span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold">{p.name}</span>
                  <span className="block text-[10px] leading-tight text-white/65">{p.effect}</span>
                </span>
              </button>
            );
          })}
        </div>

        {synergy && (
          <p className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--accent-amber)" }}>
            <Zap className="size-3.5" aria-hidden /> {synergy.label}
          </p>
        )}
        {!synergy && perks.length < LOADOUT.min && (
          <p className="mt-2.5 text-xs text-white/55">Pick at least {LOADOUT.min} perks to begin.</p>
        )}

        <button
          type="button"
          disabled={!ready}
          onClick={() => deck && onStart(deck, perks)}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95 disabled:opacity-50"
        >
          <Play className="size-5" aria-hidden /> Start run
        </button>
        <button
          type="button"
          onClick={onQuickPlay}
          className="mt-2 h-9 w-full rounded-2xl text-xs font-semibold text-white/70 underline-offset-2 hover:underline"
        >
          or Quick Play — a plain swipe deck (no run)
        </button>
      </div>
    </div>
  );
}
