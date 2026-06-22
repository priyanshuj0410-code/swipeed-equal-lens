"use client";

import { ModesEngine } from "@/components/games/modes-engine";
import { MIND_BELONGING } from "@/content/games/mind-belonging";

export function MindBelongingGame({ onExit }: { onExit: () => void }) {
  return <ModesEngine config={MIND_BELONGING} onExit={onExit} />;
}
