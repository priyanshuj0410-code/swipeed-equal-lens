"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// Each engine game is code-split and rendered client-side (they use the 3D backdrop).
const GAMES: Record<string, ComponentType> = {
  "same-same": dynamic(() => import("@/components/games/same-same").then((m) => m.SameSameGame), {
    ssr: false,
  }),
};

export default function GamePage() {
  const params = useParams<{ id: string }>();
  const id = (params?.id as string) ?? "";
  const Game = GAMES[id];

  if (!Game) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-8 text-center text-sm text-muted-foreground">
        This game is coming soon.
      </div>
    );
  }
  return <Game />;
}
