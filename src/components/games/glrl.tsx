"use client";

import { useState } from "react";
import { X, Flag, Flame, Check } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameCard } from "@/components/game-card";
import { GameDone } from "@/components/games/game-done";
import { Loadout } from "@/components/glrl/loadout";
import { GlrlRunHost } from "@/components/glrl/run-host";
import { useSwipeGame } from "@/lib/use-swipe-game";
import { useProfile } from "@/lib/store";
import { availableDecks, resolveDeckCards, DECK_BY_ID } from "@/content/decks";
import type { PerkId, RunDeckId } from "@/lib/types";

// Green Light / Red Light as a first-class engine game: it launches at /game/glrl and in place on the
// path like every other node, wearing the shared GameShell chrome and fronted by the Loadout's 5-tile
// menu. The roguelike Loadout → run is the heart; "Easy" is the v1 Quick Play swipe, owned here via
// useSwipeGame so the whole game is self-contained. Exit hierarchy: swipe/run → menu → path.
export function GlrlGame({ onExit }: { onExit: () => void }) {
  const { profile } = useProfile();
  const game = useSwipeGame();
  const [run, setRun] = useState<{ deckId: RunDeckId; perks: PerkId[] } | null>(null);

  const hud = game.hud;
  const result = game.result;

  // 1) Quick Play (Easy) — the v1 swipe, self-contained, finishing into the shared GameDone.
  if (game.view || result) {
    return (
      <>
        {game.view && <GameCard view={game.view} onCommit={game.commit} />}
        {game.view && hud && (
          <>
            <div className="fixed left-4 top-4 z-50 flex max-w-[calc(100%-4rem)] items-center gap-2">
              <button type="button" aria-label="Back" onClick={game.quit} className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
                <X className="size-5" aria-hidden />
              </button>
              <span className="glass-pill flex h-9 min-w-0 items-center rounded-full px-3 backdrop-blur-md backdrop-saturate-150">
                <span className="min-w-0 truncate text-xs font-semibold">{hud.title} · {Math.min(hud.index + 1, hud.total)}/{hud.total}</span>
              </span>
              <span className="glass-pill flex h-9 shrink-0 items-center rounded-full px-3 text-xs font-bold backdrop-blur-md backdrop-saturate-150">{hud.score} pts</span>
              {hud.streak > 1 && (
                <span className="glass-pill flex h-9 shrink-0 items-center gap-1 rounded-full px-3 text-xs font-bold backdrop-blur-md backdrop-saturate-150">
                  <Flame className="size-3.5" style={{ color: "var(--flame)" }} aria-hidden /> {hud.streak}
                </span>
              )}
            </div>
            <div className="fixed inset-x-0 bottom-6 z-40 mx-auto flex w-full max-w-sm items-center gap-3 px-5">
              {hud.phase === "reveal" ? (
                <button type="button" onClick={game.next} className="glass-pill h-14 flex-1 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
                  {hud.isLast ? "Finish" : "Next"}
                </button>
              ) : (
                <>
                  <button type="button" disabled={hud.busy} onClick={() => game.commit("red")} className="glass-pill flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95 disabled:opacity-60" style={{ color: "#ff9085", borderColor: "rgba(255,144,133,0.45)" }}>
                    <Flag className="size-5" aria-hidden /> {hud.labels.left}
                  </button>
                  <button type="button" disabled={hud.busy} onClick={() => game.commit("green")} className="glass-pill flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95 disabled:opacity-60" style={{ color: "#62e08f", borderColor: "rgba(98,224,143,0.45)" }}>
                    <Check className="size-5" aria-hidden /> {hud.labels.right}
                  </button>
                </>
              )}
            </div>
          </>
        )}
        {result && (
          <GameShell title={result.title} onExit={game.quit}>
            <GameDone
              gameId={result.deckId}
              stars={result.stars}
              coins={result.coins}
              bestStreak={result.best}
              title="Deck complete!"
              blurb={`You read ${result.correct} of ${result.total} carefully.`}
              onReplay={game.replay}
              onExit={game.quit}
            />
          </GameShell>
        )}
      </>
    );
  }

  // 2) The roguelike run (story / daily / boss) — carries its own live Clarity HUD chrome.
  if (run) {
    return <GlrlRunHost deckId={run.deckId} perks={run.perks} onExit={() => setRun(null)} />;
  }

  // 3) The front door — the Loadout menu, in the shared GameShell chrome (like every other node).
  return (
    <GameShell title="Green Light / Red Light" onExit={onExit}>
      <Loadout
        embedded
        schoolComfort={profile.schoolComfort}
        onStart={(deckId, perks) => setRun({ deckId, perks })}
        onQuickPlay={() => {
          const first = availableDecks(profile.schoolComfort)[0];
          if (first) game.start(first.id, resolveDeckCards(first.id, profile.schoolComfort), DECK_BY_ID[first.id]?.swipe);
        }}
        onExit={onExit}
      />
    </GameShell>
  );
}
