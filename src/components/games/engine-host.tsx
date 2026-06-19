"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// Registry of non-swipe "engine" games. Each is a pure-DOM overlay (the grassland behind
// it comes from the path or the /game route), takes an `onExit`, and is code-split.
type EngineGame = ComponentType<{ onExit: () => void }>;

const GAMES: Record<string, EngineGame> = {
  "same-same": dynamic(() => import("@/components/games/same-same").then((m) => m.SameSameGame), {
    ssr: false,
  }),
  "can-do": dynamic(() => import("@/components/games/can-do").then((m) => m.CanDoGame), {
    ssr: false,
  }),
  "fair-play": dynamic(() => import("@/components/games/fair-play").then((m) => m.FairPlayGame), {
    ssr: false,
  }),
  "not-funny": dynamic(() => import("@/components/games/not-funny").then((m) => m.NotFunnyGame), {
    ssr: false,
  }),
};

export function hasEngineGame(id: string): boolean {
  return id in GAMES;
}

/** Renders the engine game for `id` in place, or nothing if there's no such game. */
export function EngineGameHost({ id, onExit }: { id: string; onExit: () => void }) {
  const Game = GAMES[id];
  if (!Game) return null;
  return <Game onExit={onExit} />;
}
