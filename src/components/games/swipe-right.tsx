"use client";

import { ModesEngine } from "@/components/games/modes-engine";
import { SWIPE_RIGHT } from "@/content/games/swipe-right";

export function SwipeRightGame({ onExit }: { onExit: () => void }) {
  return <ModesEngine config={SWIPE_RIGHT} onExit={onExit} />;
}
