"use client";

import { ModesEngine } from "@/components/games/modes-engine";
import { KNOW_YOUR_RIGHTS } from "@/content/games/know-your-rights";

export function KnowYourRightsGame({ onExit }: { onExit: () => void }) {
  return <ModesEngine config={KNOW_YOUR_RIGHTS} onExit={onExit} />;
}
