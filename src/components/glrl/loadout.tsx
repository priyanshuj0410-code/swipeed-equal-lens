"use client";

import { useState } from "react";
import { X, Play, Zap, Calendar, Trophy, Check, Star } from "lucide-react";
import type { PerkId, RunDeckId } from "@/lib/types";
import { useProfile } from "@/lib/store";
import { RUN_DECKS, todayKey } from "@/content/runs";
import { CHARACTER_BY_ID } from "@/content/characters";
import { PERKS, LOADOUT, SYNERGIES, STARTER_PERKS } from "@/content/perks";

// GLRL 2.0 hub: lifetime progress, the modes (Story Run · Daily Run · Boss Rush · Quick Play), and the
// pre-run setup (pick a story + character, equip 2–3 Insight perks — reading/learning aids, never
// auto-win). Daily Run = today's seeded story; Boss Rush = the disguised/boss gauntlet.
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
  const { profile, markDailyRun } = useProfile();
  const decks = RUN_DECKS.filter((d) => !schoolComfort || d.schoolComfortSafe);
  const [deck, setDeck] = useState<RunDeckId | null>(decks[0]?.id ?? null);
  const [perks, setPerks] = useState<PerkId[]>([]);

  const togglePerk = (id: PerkId) =>
    setPerks((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= LOADOUT.max ? p : [...p, id]));

  const ready = deck !== null && perks.length >= LOADOUT.min && perks.length <= LOADOUT.max;
  const synergy = SYNERGIES.find((s) => s.perks.every((p) => perks.includes(p)));
  // perks to use for the one-tap modes (your picks, or a sensible default pair)
  const effectivePerks = perks.length >= LOADOUT.min ? perks : STARTER_PERKS.slice(0, LOADOUT.min);

  // Daily Run — today's seeded story (within the school-comfort-allowed set)
  const today = todayKey();
  const now = new Date();
  const seed = Number(`${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`);
  const dailyDeck = decks[seed % decks.length];
  const dailyDone = profile.dailyRunOn === today;

  const disgPct = (profile.disgSeen ?? 0) > 0 ? Math.round(((profile.disgCorrect ?? 0) / (profile.disgSeen ?? 1)) * 100) : null;

  const startDaily = () => {
    if (!dailyDeck) return;
    markDailyRun(today);
    onStart(dailyDeck.id, effectivePerks);
  };

  return (
    <div className="fixed inset-0 z-30 flex items-start justify-center overflow-y-auto px-5 py-8">
      <div className="glass-card w-full max-w-sm p-5 backdrop-blur-[14px] backdrop-saturate-150" style={{ color: "#eef1f7" }}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Green Light / Red Light</h2>
          <button type="button" aria-label="Back to path" onClick={onExit} className="rounded-full p-1 transition-transform active:scale-90">
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {/* lifetime stats */}
        <div className="mt-3 flex items-center gap-2 text-[11px] text-white/75">
          <span className="glass-pill rounded-full px-2.5 py-1 backdrop-blur-md">⭐ {profile.coins} coins</span>
          <span className="glass-pill rounded-full px-2.5 py-1 backdrop-blur-md">🏁 {profile.runsCompleted ?? 0} runs</span>
          <span className="glass-pill rounded-full px-2.5 py-1 backdrop-blur-md">🕵️ {disgPct === null ? "—" : `${disgPct}%`} disguised</span>
        </div>

        {/* modes */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={startDaily}
            disabled={!dailyDeck}
            className="glass-pill flex flex-col items-center gap-0.5 rounded-2xl px-2 py-2.5 backdrop-blur-md transition-transform active:scale-[0.97] disabled:opacity-40"
          >
            <Calendar className="size-4" aria-hidden />
            <span className="text-[11px] font-bold">Daily</span>
            <span className="text-[9px] text-white/60">{dailyDone ? "✓ done" : dailyDeck?.title.split(" ")[0] ?? "—"}</span>
          </button>
          <button
            type="button"
            onClick={() => onStart("boss-rush", effectivePerks)}
            className="glass-pill flex flex-col items-center gap-0.5 rounded-2xl px-2 py-2.5 backdrop-blur-md transition-transform active:scale-[0.97]"
          >
            <Trophy className="size-4" aria-hidden />
            <span className="text-[11px] font-bold">Boss Rush</span>
            <span className="text-[9px] text-white/60">hardest cards</span>
          </button>
          <button
            type="button"
            onClick={onQuickPlay}
            className="glass-pill flex flex-col items-center gap-0.5 rounded-2xl px-2 py-2.5 backdrop-blur-md transition-transform active:scale-[0.97]"
          >
            <Play className="size-4" aria-hidden />
            <span className="text-[11px] font-bold">Quick Play</span>
            <span className="text-[9px] text-white/60">plain swipe</span>
          </button>
        </div>

        {/* story deck + character pick */}
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-white/65">Story run — whose story?</p>
        <div className="mt-2 flex flex-col gap-2">
          {decks.map((d) => {
            const ch = CHARACTER_BY_ID[d.character];
            const on = deck === d.id;
            const cleared = profile.runDeckCleared?.[d.id];
            const stars = profile.deckStars?.[d.id] ?? 0;
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
                  <span className="flex items-center gap-1.5 text-sm font-bold">
                    {d.title} <span className="text-white/60">· {ch.name}</span>
                    {cleared && <Check className="size-3.5 shrink-0" style={{ color: "#62e08f" }} aria-hidden />}
                  </span>
                  <span className="block truncate text-xs text-white/70">{d.blurb}</span>
                </span>
                {stars > 0 && (
                  <span className="flex shrink-0 items-center gap-0.5 text-[10px] font-bold" style={{ color: "var(--accent-amber)" }} aria-label={`${stars} stars`}>
                    <Star className="size-3" fill="currentColor" aria-hidden /> {stars}
                  </span>
                )}
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
          <p className="mt-2.5 text-xs text-white/55">Pick at least {LOADOUT.min} perks for a story run.</p>
        )}

        <button
          type="button"
          disabled={!ready}
          onClick={() => deck && onStart(deck, perks)}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95 disabled:opacity-50"
        >
          <Play className="size-5" aria-hidden /> Start story run
        </button>
      </div>
    </div>
  );
}
