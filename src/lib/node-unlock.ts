// Node-level dependency gating for the path (master-node-table driven). A user picks an age band in
// onboarding (entryAgeGate); we drop them at that chapter with its first node OPEN: no need to clear the
// earlier chapters: and EARLIER chapters all stay open for revision. From the entry node onward, the
// linear `prereq` chain gates the path forward: a node unlocks once its prerequisite is completed.
//
// Legacy/no-age users (entryAgeGate undefined) are UNGATED: every built node stays playable, exactly as
// before: so adding this never locks anyone who onboarded before age bands existed.

import { NODES, CHAPTERS, type GameNode } from "@/content/path";
import { DECK_BY_ID } from "@/content/decks";

const NODE_BY_ID = new Map(NODES.map((n) => [n.id, n] as const));

// The path `order` of the FIRST node of the chapter a given age band enters. Falls back to the latest
// chapter at/below the age (so an out-of-range value still resolves), else the very start.
export function entryStartOrder(entryAge: number | undefined): number {
  if (entryAge == null) return 1;
  const exact = CHAPTERS.find((c) => c.ageGate === entryAge);
  if (exact) return exact.startOrder;
  const below = [...CHAPTERS].reverse().find((c) => c.ageGate <= entryAge);
  return below?.startOrder ?? 1;
}

// The array index (into NODES / a parallel SceneNode[]) of the entry chapter's first node: used to focus
// the path camera + the "play me next" glow on the user's age band rather than node #1.
export function entryFocusIndex(entryAge: number | undefined): number {
  const start = entryStartOrder(entryAge);
  const i = NODES.findIndex((n) => n.order === start);
  return i < 0 ? 0 : i;
}

// Is `node` unlocked, given a way to test prerequisite completion and the user's entry age band?
//  • no age band  → ungated (legacy: always true)
//  • order ≤ entry chapter's first node → open (earlier chapters = revision; entry node = the fresh start)
//  • otherwise → open once its `prereq` is completed (the linear chain). A prereq that isn't built yet
//    can't gate (avoids dead-ends at an unbuilt capstone), so it's treated as satisfied.
export function isNodeUnlocked(node: GameNode, isCompleted: (nodeId: string) => boolean, entryAge: number | undefined): boolean {
  if (entryAge == null) return true;
  const start = entryStartOrder(entryAge);
  if (node.order <= start) return true;
  if (!node.prereq) return true;
  return isCompleted(node.prereq);
}

// Resolve a prerequisite NODE id to whether it's done. A prereq node maps to its runtime game id; an
// unbuilt prereq (no game) is treated as satisfied so it never permanently blocks the chain.
export function makeNodeCompleted(isGameDone: (gameId: string) => boolean): (nodeId: string) => boolean {
  return (nodeId: string) => {
    const n = NODE_BY_ID.get(nodeId);
    if (!n) return true;
    if (!n.game) return true; // unbuilt prereq can't be required
    return isGameDone(n.game);
  };
}

// Is a runtime game done, from the saved profile? GameDone saves stars under the game id, so stars mean done.
export function makeGameDone(
  deckStars: Record<string, number> | undefined,
  runDeckCleared: Record<string, boolean> | undefined
): (game?: string) => boolean {
  const stars = deckStars ?? {};
  const runCleared = runDeckCleared ?? {};
  return (game?: string) => {
    if (!game) return false;
    if (game === "mythbuster") return stars["mythbuster"] != null;
    // GLRL is "done" once the v2 game is finished (its own stars, like any game), or on a legacy v1 finish:
    // any story run cleared, or any Quick Play swipe deck.
    if (game === "glrl")
      return (
        stars["glrl"] != null ||
        Object.keys(runCleared).length > 0 ||
        Object.keys(stars).some((k) => k !== "mythbuster" && DECK_BY_ID[k as keyof typeof DECK_BY_ID] != null)
      );
    return stars[game] != null;
  };
}
