"use client";

import { useEffect, useRef } from "react";
import { X, Flag, Check, Flame, Eraser, Pencil, Sparkles, Search } from "lucide-react";
import { music } from "@/lib/juice";
import type { Flag as FlagType, PerkId, RunDeckId } from "@/lib/types";
import { useRunGame } from "@/lib/use-run-game";
import { GameCard } from "@/components/game-card";
import { ClarityMeter } from "@/components/glrl/clarity-meter";
import { ForkScreen } from "@/components/glrl/fork";
import { RunDebrief } from "@/components/glrl/debrief";
import { PERK_BY_ID } from "@/content/perks";
import { RUN_DECK_BY_ID } from "@/content/runs";
import { CHARACTER_BY_ID } from "@/content/characters";
import { SIGNS } from "@/content/signs";
import { sfx, haptic, shake } from "@/lib/juice";

const signDef = (signId?: string) => SIGNS.find((s) => s.id === signId)?.definition;

/** Hosts one GLRL 2.0 run end-to-end: card swipe + Clarity/combo chrome, the fork screen, and the
 *  debrief. Adds the juice (SFX / haptics / shake-pulse) and the UN & RE "unlearn–relearn" beat on a
 *  missed disguised card. Deck + perks come from the Loadout; `onExit` returns to the path. */
export function GlrlRunHost({ deckId, perks, onExit }: { deckId: RunDeckId; perks: PerkId[]; onExit: () => void }) {
  const run = useRunGame();
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    run.start(deckId, perks);
    // start once for this loadout
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { view, hud, fork, result } = run;
  const cardStart = useRef(0);

  // ambient music bed for the run; stops when you leave
  useEffect(() => {
    music.start();
    return () => music.stop();
  }, []);
  // tension rises as Clarity falls; ducks out on serious cards
  useEffect(() => {
    if (!hud) return;
    music.setActive(!view?.card.is_safeguarding);
    music.setTension(1 - hud.clarity / 100);
  }, [hud, view?.card.is_safeguarding, view?.card.id]);
  // reset the gentle reading timer when a new card comes up
  useEffect(() => {
    if (view?.phase === "play") cardStart.current = Date.now();
  }, [view?.card.id, view?.phase]);

  const onCommit = (flag: FlagType) => {
    if (!view || !hud || hud.busy) return;
    const card = view.card;
    const correct = flag === card.correct_flag;
    if (card.is_safeguarding || hud.isBoss) {
      sfx("toxic");
      haptic("serious");
      shake(shellRef.current, "shake");
    } else if (correct) {
      sfx(card.is_disguised ? "shatter" : hud.combo >= 2 ? "combo" : "green", hud.combo);
      haptic("tap");
      shake(shellRef.current, "pulse");
    } else {
      sfx("red");
      haptic("tap");
      shake(shellRef.current, "shake");
    }
    // a confident, in-time read (only counts toward the bonus once accuracy is high — engine-gated)
    const fast = hud.timed && Date.now() - cardStart.current < hud.timeBudgetMs * 0.5;
    run.commit(flag, fast);
  };

  const wrongDisguised = !!view && view.phase === "reveal" && !view.correct && view.card.is_disguised && !view.card.is_safeguarding;

  return (
    <div ref={shellRef} className="fixed inset-0 z-30">
      {/* resolution + debrief */}
      {result && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-6">
          <RunDebrief result={result} onReplay={run.replay} onReplayMissed={run.replayMissed} onExit={onExit} />
        </div>
      )}

      {/* the fork choice (hud/view are null during a fork — character comes from the deck) */}
      {fork && <ForkScreen fork={fork} character={CHARACTER_BY_ID[RUN_DECK_BY_ID[deckId].character]} onChoose={run.chooseFork} />}

      {/* the card */}
      {view && <GameCard view={view} onCommit={onCommit} />}

      {/* run chrome */}
      {view && hud && (
        <>
          <div className="fixed left-4 top-4 z-50 flex max-w-[calc(100%-4rem)] flex-wrap items-center gap-2">
            <button
              type="button"
              aria-label="Leave run"
              onClick={onExit}
              className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95"
            >
              <X className="size-5" aria-hidden />
            </button>
            <span className="glass-pill flex h-9 min-w-0 items-center gap-1.5 rounded-full px-3 text-xs font-semibold backdrop-blur-md backdrop-saturate-150">
              <span className={hud.phase === "reveal" ? "inline-block animate-in zoom-in-50 duration-200" : ""} aria-hidden>{hud.character.avatar}</span>
              <span className="truncate">{hud.character.name} · {hud.step}/{hud.total}</span>
              {hud.phase === "reveal" && (
                <span className="ml-0.5 animate-in zoom-in-50 duration-200" aria-hidden>
                  {view.card.is_safeguarding ? "🫂" : view.correct ? "😊" : "😟"}
                </span>
              )}
            </span>
            <ClarityMeter value={hud.clarity} name={hud.character.name} />
            {hud.combo > 1 && (
              <span className="glass-pill flex h-9 shrink-0 items-center gap-1 rounded-full px-3 text-xs font-bold backdrop-blur-md backdrop-saturate-150">
                <Flame className="size-3.5" style={{ color: "var(--flame)" }} aria-hidden /> {hud.combo}
              </span>
            )}
            {hud.isBoss && (
              <span className="glass-pill flex h-9 shrink-0 items-center rounded-full px-3 text-xs font-extrabold uppercase tracking-wide backdrop-blur-md" style={{ color: "#ff9085" }}>
                Boss
              </span>
            )}
          </div>

          {/* perks (presence) */}
          <div className="fixed right-4 top-16 z-50 flex flex-col items-end gap-1">
            {hud.perks.map((p) => (
              <span key={p} title={PERK_BY_ID[p].effect} className="flex size-9 items-center justify-center rounded-full border-2 border-[color:var(--color-ink)] bg-[color:var(--color-surface)] text-base" aria-hidden>
                {PERK_BY_ID[p].emoji}
              </span>
            ))}
          </div>

          {/* bottom action area */}
          <div className="fixed inset-x-0 bottom-6 z-40 mx-auto flex w-full max-w-sm flex-col gap-2.5 px-5">
            {/* UN & RE unlearn–relearn beat on a missed disguised card (the core principle, in play) */}
            {wrongDisguised && (
              <div className="glass-pill rounded-2xl px-4 py-3 text-xs leading-relaxed backdrop-blur-md backdrop-saturate-150" style={{ color: "var(--color-ink)" }}>
                <p className="flex items-start gap-1.5">
                  <Eraser className="mt-0.5 size-3.5 shrink-0" style={{ color: "#b3c8ff" }} aria-hidden />
                  <span><b>Unlearn.</b> Lots of people read that as okay — let&apos;s gently rub it out. You&apos;re not wrong, you&apos;re growing.</span>
                </p>
                <p className="mt-1.5 flex items-start gap-1.5">
                  <Pencil className="mt-0.5 size-3.5 shrink-0" style={{ color: "#62e08f" }} aria-hidden />
                  <span><b>Relearn.</b> {signDef(view.card.signId) ?? view.card.feedback_short}</span>
                </p>
              </div>
            )}
            {/* Truth Serum: an extra-clear explanation after a wrong (non-disguised) read */}
            {!wrongDisguised && hud.truthSerum && signDef(view.card.signId) && (
              <div className="glass-pill rounded-2xl px-4 py-3 text-xs leading-relaxed backdrop-blur-md backdrop-saturate-150" style={{ color: "var(--color-ink)" }}>
                <p className="flex items-start gap-1.5">
                  <Sparkles className="mt-0.5 size-3.5 shrink-0" style={{ color: "var(--accent-amber)" }} aria-hidden />
                  <span><b>{view.card.sign}:</b> {signDef(view.card.signId)}</span>
                </p>
              </div>
            )}

            {hud.phase === "reveal" ? (
              <button
                type="button"
                onClick={run.next}
                className="glass-pill h-14 w-full rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95"
              >
                {hud.isBoss ? "See how it ends" : "Next"}
              </button>
            ) : (
              <>
                {hud.timed && (
                  <div className="h-1 w-full overflow-hidden rounded-full bg-foreground/10" aria-hidden>
                    <div
                      key={view.card.id}
                      className="h-full rounded-full"
                      style={{ background: "var(--color-brand)", animation: `glrl-timer ${hud.timeBudgetMs}ms linear forwards` }}
                    />
                  </div>
                )}
                {hud.xrayHint && (
                  <div className="glass-pill flex items-center gap-1.5 self-center rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md backdrop-saturate-150" style={{ color: "#b3c8ff" }}>
                    <Search className="size-3.5" aria-hidden /> X-Ray — this one&apos;s: {hud.xrayHint}
                  </div>
                )}
                <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={hud.busy}
                  onClick={() => onCommit("red")}
                  className="glass-pill flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95 disabled:opacity-60"
                  style={{ color: "#ff9085", borderColor: "rgba(255,144,133,0.45)" }}
                >
                  <Flag className="size-5" aria-hidden /> {view.labels.left}
                </button>
                <button
                  type="button"
                  disabled={hud.busy}
                  onClick={() => onCommit("green")}
                  className="glass-pill flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95 disabled:opacity-60"
                  style={{ color: "#62e08f", borderColor: "rgba(98,224,143,0.45)" }}
                >
                  <Check className="size-5" aria-hidden /> {view.labels.right}
                </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
