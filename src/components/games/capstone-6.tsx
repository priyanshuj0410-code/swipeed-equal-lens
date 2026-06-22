"use client";

import { CapstoneEngine } from "@/components/games/capstone-engine";
import { CAPSTONE_6 } from "@/content/games/capstone-6";

export function CapstoneSixGame({ onExit }: { onExit: () => void }) {
  return <CapstoneEngine config={CAPSTONE_6} onExit={onExit} />;
}
