"use client";

import { ModesEngine } from "@/components/games/modes-engine";
import { OWN_YOUR_HEALTH } from "@/content/games/own-your-health";

export function OwnYourHealthGame({ onExit }: { onExit: () => void }) {
  return <ModesEngine config={OWN_YOUR_HEALTH} onExit={onExit} />;
}
