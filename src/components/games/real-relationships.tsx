"use client";

import { ModesEngine } from "@/components/games/modes-engine";
import { REAL_RELATIONSHIPS } from "@/content/games/real-relationships";

export function RealRelationshipsGame({ onExit }: { onExit: () => void }) {
  return <ModesEngine config={REAL_RELATIONSHIPS} onExit={onExit} />;
}
