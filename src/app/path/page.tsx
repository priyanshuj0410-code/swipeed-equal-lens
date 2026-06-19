"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Flame, Star, Flag, Check, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useProfile } from "@/lib/store";
import { useSwipeGame } from "@/lib/use-swipe-game";
import { GameCard } from "@/components/game-card";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { EngineGameHost, hasEngineGame } from "@/components/games/engine-host";
import { NODES, CHAPTERS } from "@/content/path";
import { DECK_BY_ID, resolveDeckCards, availableDecks } from "@/content/decks";
import type { SceneNode } from "@/components/path-scene";

const PathScene = dynamic(() => import("@/components/path-scene").then((m) => m.PathScene), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
      <span className="size-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" aria-hidden />
      <span className="ml-2">Loading the path…</span>
    </div>
  ),
});

export default function PathPage() {
  const router = useRouter();
  const { profile } = useProfile();
  const game = useSwipeGame();
  const [engineGame, setEngineGame] = useState<string | null>(null);
  const [webgl, setWebgl] = useState<boolean | null>(null);

  const playing = game.active || engineGame !== null;

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setWebgl(!!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"))));
    } catch {
      setWebgl(false);
    }
  }, []);

  // signals the global Get Help button to collapse to an icon during play
  useEffect(() => {
    const el = document.documentElement;
    if (playing) el.setAttribute("data-playing", "true");
    else el.removeAttribute("data-playing");
    return () => el.removeAttribute("data-playing");
  }, [playing]);

  const nodes = useMemo<SceneNode[]>(() => {
    const stars = profile.deckStars ?? {};
    const isDone = (game?: string) => {
      if (!game) return false;
      if (game === "mythbuster") return stars["mythbuster"] != null;
      // GLRL is "done" once any of its own swipe decks is cleared.
      if (game === "glrl")
        return Object.keys(stars).some((k) => k !== "mythbuster" && DECK_BY_ID[k as keyof typeof DECK_BY_ID] != null);
      return stars[game] != null;
    };
    // All 41 nodes, in order. Built games are playable; everything else is "soon" (no gates).
    return NODES.map((n): SceneNode => ({
      id: n.id,
      label: n.label,
      state: n.game ? (isDone(n.game) ? "completed" : "playable") : "soon",
      href: n.href,
      emoji: n.emoji,
      hex: n.hex,
      capstone: n.type === "capstone",
      game: n.game,
      chapter: n.chapter,
    }));
  }, [profile.deckStars]);

  // Every built game plays in place over the grassland — swipe decks via useSwipeGame, the
  // tap/sort/choose/sim engines via EngineGameHost. "soon" nodes have no game and don't act.
  const handleSelect = (node: SceneNode) => {
    const gid = node.game;
    if (!gid) return; // not built yet
    if (gid === "mythbuster") {
      game.start("mythbuster", resolveDeckCards("mythbuster", profile.schoolComfort), DECK_BY_ID["mythbuster"]?.swipe);
      return;
    }
    if (gid === "glrl") {
      const first = availableDecks(profile.schoolComfort)[0];
      if (first) {
        game.start(first.id, resolveDeckCards(first.id, profile.schoolComfort), DECK_BY_ID[first.id]?.swipe);
        return;
      }
    }
    if (hasEngineGame(gid)) {
      setEngineGame(gid);
      return;
    }
    if (node.href) router.push(node.href);
  };

  const hud = game.hud;
  const result = game.result;

  return (
    <>
      <div className="fixed inset-0 z-0 touch-none overscroll-none bg-[#bfe2fb]">
        {webgl === false ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="max-w-xs text-sm text-muted-foreground">The 3D path isn&apos;t supported on this device, but you can use the classic view.</p>
            <Link href="/classic" className={buttonVariants({})}>
              Open the classic path
            </Link>
          </div>
        ) : (
          <PathScene nodes={nodes} chapters={CHAPTERS} onSelectNode={handleSelect} playing={playing} />
        )}
      </div>

      {/* ---- path mode chrome ---- */}
      {webgl !== false && !playing && (
        <>
          <div className="fixed left-4 top-4 z-50 flex items-center gap-2">
            <span className="glass-pill pointer-events-none flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold backdrop-blur-md backdrop-saturate-150">
              <Flame className="size-4" style={{ color: "var(--flame)" }} aria-hidden /> {profile.bestStreak}
            </span>
            <span className="glass-pill pointer-events-none flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold backdrop-blur-md backdrop-saturate-150">
              <Star className="size-4" style={{ color: "var(--accent-amber)" }} fill="currentColor" aria-hidden /> {profile.coins}
            </span>
          </div>
          <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
            <span className="glass-pill rounded-full px-3.5 py-1.5 text-xs font-medium backdrop-blur-md backdrop-saturate-150">
              Tap a node to start · scroll or drag to travel
            </span>
          </div>
        </>
      )}

      {/* ---- in-place swipe game: DOM liquid-glass card over the grassland ---- */}
      {game.view && <GameCard view={game.view} onCommit={game.commit} />}
      {game.view && hud && (
        <>
          {/* single equal-height row: close · deck · score (Get Help sits at the same height, far right) */}
          <div className="fixed left-4 top-4 z-50 flex max-w-[calc(100%-4rem)] items-center gap-2">
            <button
              type="button"
              aria-label="Back to path"
              onClick={game.quit}
              className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95"
            >
              <X className="size-5" aria-hidden />
            </button>
            <span className="glass-pill flex h-9 min-w-0 items-center rounded-full px-3 backdrop-blur-md backdrop-saturate-150">
              <span className="min-w-0 truncate text-xs font-semibold">
                {hud.title} · {Math.min(hud.index + 1, hud.total)}/{hud.total}
              </span>
            </span>
            <span className="glass-pill flex h-9 shrink-0 items-center rounded-full px-3 text-xs font-bold backdrop-blur-md backdrop-saturate-150">
              {hud.score} pts
            </span>
            {hud.streak > 1 && (
              <span className="glass-pill flex h-9 shrink-0 items-center gap-1 rounded-full px-3 text-xs font-bold backdrop-blur-md backdrop-saturate-150">
                <Flame className="size-3.5" style={{ color: "var(--flame)" }} aria-hidden /> {hud.streak}
              </span>
            )}
          </div>

          <div className="fixed inset-x-0 bottom-6 z-40 mx-auto flex w-full max-w-sm items-center gap-3 px-5">
            {hud.phase === "reveal" ? (
              <button
                type="button"
                onClick={game.next}
                className="glass-pill h-14 flex-1 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95"
              >
                {hud.isLast ? "Finish" : "Next"}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  disabled={hud.busy}
                  onClick={() => game.commit("red")}
                  className="glass-pill flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95 disabled:opacity-60"
                  style={{ color: "#ff9085", borderColor: "rgba(255,144,133,0.45)" }}
                >
                  <Flag className="size-5" aria-hidden /> {hud.labels.left}
                </button>
                <button
                  type="button"
                  disabled={hud.busy}
                  onClick={() => game.commit("green")}
                  className="glass-pill flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95 disabled:opacity-60"
                  style={{ color: "#62e08f", borderColor: "rgba(98,224,143,0.45)" }}
                >
                  <Check className="size-5" aria-hidden /> {hud.labels.right}
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* ---- shared completion card for a finished swipe deck ---- */}
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

      {/* ---- in-place engine games (tap / sort / choose / sim…) over the grassland ---- */}
      {engineGame && <EngineGameHost id={engineGame} onExit={() => setEngineGame(null)} />}
    </>
  );
}
