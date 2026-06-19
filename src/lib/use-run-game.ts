"use client";

import { useCallback, useRef, useState } from "react";
import type { Card, Fork, Flag, PerkId, RunDeckId } from "@/lib/types";
import type { GameView } from "@/components/path-scene";
import { CHARACTER_BY_ID } from "@/content/characters";
import { RUN_DECK_BY_ID, assembleRun, runCardPool, BOSS_RUSH_CARDS } from "@/content/runs";
import { CLARITY, RUN_XP, cardXp, clampClarity, clarityDelta, runOutcome } from "@/lib/run-scoring";
import { POINTS, starsFor } from "@/lib/scoring";
import { celebrate } from "@/lib/confetti";
import { useProfile } from "@/lib/store";

const EXIT_MS = 380;
const THOUGHTFUL_MS = 1200;
const LABELS = { left: "Red flag", right: "Green flag" };

type Phase = "play" | "reveal" | "fork" | "resolution";

type RState = {
  deckId: RunDeckId;
  perks: PerkId[];
  seq: Card[]; // cards assembled so far (main line + chosen branch lanes), ordered by escalation_step
  chosen: string[]; // fork branches chosen
  forksDone: number[]; // afterStep values resolved
  index: number;
  phase: Phase;
  flag: Flag | null;
  exiting: Flag | null;
  clarity: number;
  combo: number;
  bestCombo: number;
  correct: number;
  scored: number;
  disgSeen: number;
  disgCorrect: number;
  bossCorrect: boolean;
  missed: Card[];
  xp: number;
  lastXp: number;
  revealAt: number;
  pendingFork: Fork | null;
  totalPlanned: number;
  wrongThisCard: boolean;
};

function fresh(deckId: RunDeckId, perks: PerkId[], cards?: Card[]): RState {
  const deck = RUN_DECK_BY_ID[deckId];
  const isRush = deckId === "boss-rush";
  const seq = cards ?? (isRush ? BOSS_RUSH_CARDS.slice() : assembleRun(deckId, [])); // main line only until forks resolve
  const mainLine = isRush ? BOSS_RUSH_CARDS.length : runCardPool(deckId).filter((c) => !c.branch_id).length;
  return {
    deckId,
    perks,
    seq,
    chosen: [],
    forksDone: [],
    index: 0,
    phase: "play",
    flag: null,
    exiting: null,
    clarity: CLARITY.start,
    combo: 0,
    bestCombo: 0,
    correct: 0,
    scored: 0,
    disgSeen: 0,
    disgCorrect: 0,
    bossCorrect: false,
    missed: [],
    xp: 0,
    lastXp: 0,
    revealAt: 0,
    pendingFork: null,
    totalPlanned: cards ? cards.length : mainLine + deck.forks.length,
    wrongThisCard: false,
  };
}

/** The Run engine: wraps the per-card swipe with a Clarity meter, combos, perks, forks, boss and a
 *  no-hard-fail resolution. Deck-agnostic so the UI (loadout → run → fork → resolution) can drive it. */
export function useRunGame() {
  const { recordCard } = useProfile();
  const [r, setR] = useState<RState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback((deckId: RunDeckId, perks: PerkId[]) => {
    if (timer.current) clearTimeout(timer.current);
    setR(fresh(deckId, perks));
  }, []);

  const quit = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setR(null);
  }, []);

  const replay = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setR((p) => (p ? fresh(p.deckId, p.perks) : p));
  }, []);

  /** Replay only the cards missed this run (the end-of-run review). */
  const replayMissed = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setR((p) => (p && p.missed.length ? fresh(p.deckId, p.perks, p.missed.slice()) : p));
  }, []);

  const commit = useCallback(
    (flag: Flag) => {
      setR((prev) => {
        if (!prev || prev.phase !== "play" || prev.exiting) return prev;
        const card = prev.seq[prev.index];
        const deck = RUN_DECK_BY_ID[prev.deckId];
        const isBoss = card.id === deck.bossCardId;
        const isCorrect = flag === card.correct_flag;
        try {
          navigator.vibrate?.(card.is_safeguarding ? [12, 40, 12] : 12);
        } catch {
          /* unsupported */
        }
        let { combo, bestCombo, correct, scored, disgSeen, disgCorrect, clarity, xp, bossCorrect, missed } = prev;
        let lastXp = 0;
        let wrongThisCard = false;
        if (!card.is_safeguarding) {
          combo = isCorrect ? prev.combo + 1 : 0;
          bestCombo = Math.max(prev.bestCombo, combo);
          lastXp = cardXp(card, isCorrect, combo);
          xp = prev.xp + lastXp;
          clarity = clampClarity(prev.clarity + clarityDelta(card, isCorrect, isBoss));
          scored = prev.scored + 1;
          if (isCorrect) correct = prev.correct + 1;
          else {
            missed = [...prev.missed, card];
            wrongThisCard = true;
          }
          if (card.is_disguised) {
            disgSeen = prev.disgSeen + 1;
            if (isCorrect) disgCorrect = prev.disgCorrect + 1;
          }
          if (isBoss) bossCorrect = isCorrect;
          recordCard(card.signId, isCorrect);
          if (isCorrect && (card.is_disguised || isBoss || combo === 5 || combo === 10)) celebrate("small");
        }
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(
          () => setR((p) => (p && p.exiting ? { ...p, exiting: null, phase: "reveal", revealAt: Date.now() } : p)),
          EXIT_MS
        );
        return { ...prev, flag, exiting: flag, combo, bestCombo, correct, scored, disgSeen, disgCorrect, clarity, xp, lastXp, bossCorrect, missed, wrongThisCard };
      });
    },
    [recordCard]
  );

  /** Advance after a reveal — may open a fork, or resolve the run. */
  const next = useCallback(() => {
    setR((prev) => {
      if (!prev || prev.phase !== "reveal") return prev;
      const card = prev.seq[prev.index];
      const deck = RUN_DECK_BY_ID[prev.deckId];
      const step = card.escalation_step ?? 0;
      let xp = prev.xp;
      if (!card.is_safeguarding && Date.now() - prev.revealAt > THOUGHTFUL_MS) xp += POINTS.thoughtful;
      // a fork interrupts right after the card at its afterStep
      const fork = deck.forks.find((f) => f.afterStep === step && !prev.forksDone.includes(f.afterStep));
      if (fork) return { ...prev, xp, phase: "fork", pendingFork: fork, flag: null };
      if (prev.index + 1 >= prev.seq.length) return { ...prev, xp, phase: "resolution", flag: null };
      return { ...prev, xp, index: prev.index + 1, phase: "play", flag: null };
    });
  }, []);

  /** Resolve the current fork: splice in the chosen branch lane and continue. */
  const chooseFork = useCallback((branch: string) => {
    setR((prev) => {
      if (!prev || prev.phase !== "fork" || !prev.pendingFork) return prev;
      const afterStep = prev.pendingFork.afterStep;
      const chosen = [...prev.chosen, branch];
      const seq = assembleRun(prev.deckId, chosen);
      // land on the first card past the fork's step (the chosen branch card)
      const index = seq.filter((c) => (c.escalation_step ?? 0) <= afterStep).length;
      return { ...prev, chosen, forksDone: [...prev.forksDone, afterStep], seq, index, phase: "play", pendingFork: null, flag: null };
    });
  }, []);

  const view: GameView | null =
    r && (r.phase === "play" || r.phase === "reveal")
      ? {
          card: r.seq[r.index],
          phase: r.phase,
          correct: r.flag !== null && r.flag === r.seq[r.index].correct_flag,
          points: r.lastXp,
          exiting: r.exiting,
          labels: LABELS,
        }
      : null;

  const hud =
    r && (r.phase === "play" || r.phase === "reveal")
      ? {
          deckId: r.deckId,
          title: RUN_DECK_BY_ID[r.deckId].title,
          character: CHARACTER_BY_ID[RUN_DECK_BY_ID[r.deckId].character],
          step: Math.min(r.index + 1, r.totalPlanned),
          total: r.totalPlanned,
          clarity: r.clarity,
          combo: r.combo,
          bestCombo: r.bestCombo,
          perks: r.perks,
          phase: r.phase,
          busy: r.phase !== "play" || r.exiting !== null,
          isBoss: r.seq[r.index].id === RUN_DECK_BY_ID[r.deckId].bossCardId,
          // perk surfaces for the UI: timer off with Calm Mind; Gut Check pulses a hint on hesitation;
          // Truth Serum shows an extra-clear explanation after a wrong read; Slow-Mo widens disguised time.
          timed: !r.perks.includes("calm-mind"),
          hintAfterMs: r.perks.includes("gut-check") ? 4000 : null,
          slowMo: r.perks.includes("slow-mo"),
          truthSerum: r.phase === "reveal" && r.wrongThisCard && r.perks.includes("truth-serum"),
        }
      : null;

  const fork = r && r.phase === "fork" && r.pendingFork ? { ...r.pendingFork, clarity: r.clarity } : null;

  const result =
    r && r.phase === "resolution"
      ? (() => {
          const deck = RUN_DECK_BY_ID[r.deckId];
          const outcome = runOutcome(r.clarity);
          return {
            deckId: r.deckId,
            title: deck.title,
            character: CHARACTER_BY_ID[deck.character],
            outcome,
            resolutionText: deck.resolution[outcome],
            clarity: r.clarity,
            stars: starsFor(r.correct, r.scored),
            correct: r.correct,
            total: r.scored,
            bestCombo: r.bestCombo,
            disgSeen: r.disgSeen,
            disgCorrect: r.disgCorrect,
            missed: r.missed,
            xp: r.xp + RUN_XP.complete + (r.bossCorrect ? RUN_XP.bossBonus : 0),
          };
        })()
      : null;

  return { active: !!r, view, hud, fork, result, start, quit, commit, next, chooseFork, replay, replayMissed };
}

export type RunResult = NonNullable<ReturnType<typeof useRunGame>["result"]>;
export type RunHud = NonNullable<ReturnType<typeof useRunGame>["hud"]>;
export type RunFork = NonNullable<ReturnType<typeof useRunGame>["fork"]>;
