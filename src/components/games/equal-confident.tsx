"use client";

import { ModesEngine } from "@/components/games/modes-engine";
import { EQUAL_CONFIDENT } from "@/content/games/equal-confident";

export function EqualConfidentGame({ onExit }: { onExit: () => void }) {
  return <ModesEngine config={EQUAL_CONFIDENT} onExit={onExit} />;
}
