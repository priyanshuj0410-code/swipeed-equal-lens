"use client";

import { useState } from "react";
import { X, ChevronLeft, Play, Check, Star, Sparkles, CalendarDays, Feather, Flame, Lock } from "lucide-react";
import type { PerkId, RunDeckId } from "@/lib/types";
import { useProfile } from "@/lib/store";
import { RUN_DECKS, todayKey } from "@/content/runs";
import { CHARACTER_BY_ID } from "@/content/characters";
import { PERKS, LOADOUT, STARTER_PERKS, isPerkUnlocked } from "@/content/perks";

// GLRL 2.0 entry, kept deliberately text-light: Step 1 pick a Mode (Daily / Story / Easy / Hard);
// Story then asks Step 2 (which story) and Step 3 (which powers). Daily, Easy and Hard start in one
// tap with a default power pair. (Powers = Insight perks; Easy = Quick Play swipe; Hard = Boss Rush.)
export function Loadout({
  schoolComfort,
  onStart,
  onQuickPlay,
  onExit,
  embedded = false,
}: {
  schoolComfort: boolean;
  onStart: (deckId: RunDeckId, perks: PerkId[]) => void;
  onQuickPlay: () => void;
  onExit: () => void;
  // When embedded inside a shared GameShell, drop the standalone overlay + path-exit X
  // (the shell supplies the top bar); keep only the inter-step Back chevron.
  embedded?: boolean;
}) {
  const { profile, markDailyRun } = useProfile();
  const decks = RUN_DECKS.filter((d) => !schoolComfort || d.schoolComfortSafe);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [deck, setDeck] = useState<RunDeckId | null>(null);
  const [perks, setPerks] = useState<PerkId[]>([]);

  const togglePerk = (id: PerkId) =>
    setPerks((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= LOADOUT.max ? p : [...p, id]));
  const ready = deck !== null && perks.length >= LOADOUT.min && perks.length <= LOADOUT.max;
  const defaultPerks = STARTER_PERKS.slice(0, LOADOUT.min);

  const today = todayKey();
  const now = new Date();
  const seed = Number(`${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`);
  const dailyDeck = decks[seed % decks.length];
  const dailyDone = profile.dailyRunOn === today;

  const startDaily = () => {
    if (!dailyDeck) return;
    markDailyRun(today);
    onStart(dailyDeck.id, defaultPerks);
  };

  const head = (title: string, onBack?: () => void) => (
    <div className="flex items-center justify-between">
      {onBack ? (
        <button type="button" aria-label="Back" onClick={onBack} className="-ml-1 rounded-full p-1 transition-transform active:scale-90">
          <ChevronLeft className="size-5" aria-hidden />
        </button>
      ) : (
        <span className="size-7" />
      )}
      <h2 className="font-display text-lg font-bold">{title}</h2>
      {embedded ? (
        <span className="size-7" />
      ) : (
        <button type="button" aria-label="Back to path" onClick={onExit} className="rounded-full p-1 transition-transform active:scale-90">
          <X className="size-5" aria-hidden />
        </button>
      )}
    </div>
  );

  const tile = "glass-pill flex flex-col items-center justify-center gap-1.5 rounded-2xl py-5 backdrop-blur-md transition-transform active:scale-[0.97]";

  const card = (
    <div className="glass-card w-full max-w-sm p-5 backdrop-blur-[14px] backdrop-saturate-150" style={{ color: "var(--color-ink)" }}>
        {/* Step 1 — Mode */}
        {step === 1 && (
          <>
            {head("Play")}
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <button type="button" className={tile} onClick={() => { setStep(2); }}>
                <Sparkles className="size-7" aria-hidden />
                <span className="text-sm font-bold">Story</span>
              </button>
              <button type="button" className={tile} onClick={startDaily} disabled={!dailyDeck}>
                <CalendarDays className="size-7" aria-hidden />
                <span className="text-sm font-bold">Daily{dailyDone ? " ✓" : ""}</span>
              </button>
              <button type="button" className={tile} onClick={onQuickPlay}>
                <Feather className="size-7" aria-hidden />
                <span className="text-sm font-bold">Easy</span>
              </button>
              <button type="button" className={tile} onClick={() => onStart("boss-rush", defaultPerks)}>
                <Flame className="size-7" aria-hidden />
                <span className="text-sm font-bold">Hard</span>
              </button>
            </div>
          </>
        )}

        {/* Step 2 — pick a story */}
        {step === 2 && (
          <>
            {head("Story", () => setStep(1))}
            <div className="mt-4 flex flex-col gap-2">
              {decks.map((d) => {
                const ch = CHARACTER_BY_ID[d.character];
                const cleared = profile.runDeckCleared?.[d.id];
                const stars = profile.deckStars?.[d.id] ?? 0;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => { setDeck(d.id); setStep(3); }}
                    className="glass-pill flex items-center gap-3 rounded-2xl px-3 py-3 text-left backdrop-blur-md transition-transform active:scale-[0.98]"
                  >
                    <span className="text-2xl" aria-hidden>{d.emoji}</span>
                    <span className="flex-1 text-sm font-bold">
                      {d.title} <span className="font-normal text-foreground/55">· {ch.name}</span>
                    </span>
                    {cleared && <Check className="size-4 shrink-0" style={{ color: "#62e08f" }} aria-hidden />}
                    {stars > 0 && (
                      <span className="flex shrink-0 items-center gap-0.5 text-[10px] font-bold" style={{ color: "var(--accent-amber)" }} aria-label={`${stars} stars`}>
                        <Star className="size-3" fill="currentColor" aria-hidden /> {stars}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Step 3 — pick powers */}
        {step === 3 && (
          <>
            {head(`Powers ${perks.length}/${LOADOUT.max}`, () => setStep(2))}
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {PERKS.map((p) => {
                const on = perks.includes(p.id);
                const unlocked = isPerkUnlocked(p.id, profile);
                const full = !on && perks.length >= LOADOUT.max;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => unlocked && togglePerk(p.id)}
                    disabled={full || !unlocked}
                    title={unlocked ? p.effect : `Locked — ${p.unlock}`}
                    className="glass-pill flex items-center gap-2 rounded-2xl px-3 py-3 text-left backdrop-blur-md transition-transform active:scale-[0.97] disabled:opacity-40"
                    style={on ? { borderColor: "var(--color-brand)", boxShadow: "inset 0 0 0 1px var(--color-brand)" } : undefined}
                    aria-pressed={on}
                  >
                    <span className="text-xl leading-none" aria-hidden>{unlocked ? p.emoji : "🔒"}</span>
                    <span className="min-w-0">
                      <span className="block text-xs font-bold">{p.name}</span>
                      {!unlocked && (
                        <span className="flex items-center gap-1 text-[10px] leading-tight text-foreground/55">
                          <Lock className="size-2.5 shrink-0" aria-hidden /> {p.unlock}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              disabled={!ready}
              onClick={() => deck && onStart(deck, perks)}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95 disabled:opacity-50"
            >
              <Play className="size-5" aria-hidden /> Start
            </button>
          </>
        )}
      </div>
  );

  return embedded ? card : (
    <div className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto px-5 py-8">{card}</div>
  );
}
