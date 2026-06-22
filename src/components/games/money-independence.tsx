"use client";

import { ModesEngine } from "@/components/games/modes-engine";
import { MONEY_INDEPENDENCE } from "@/content/games/money-independence";

export function MoneyIndependenceGame({ onExit }: { onExit: () => void }) {
  return <ModesEngine config={MONEY_INDEPENDENCE} onExit={onExit} />;
}
