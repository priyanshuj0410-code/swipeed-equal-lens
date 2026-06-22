"use client";

import { ModesEngine } from "@/components/games/modes-engine";
import { FIND_YOUR_FEET } from "@/content/games/find-your-feet";

export function FindYourFeetGame({ onExit }: { onExit: () => void }) {
  return <ModesEngine config={FIND_YOUR_FEET} onExit={onExit} />;
}
