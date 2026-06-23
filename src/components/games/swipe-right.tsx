"use client";

// Swipe Right? — Dating & Apps (node g45, ages 18–22, Chapter 6) — NEW v2 build to GDD 45 (mechanic-embodying),
// the College dating node (Thread D), reworking the old ModesEngine build onto the shared v2 engine: its
// researched typed library + config (content/games/swipe-right.ts) render the play actions (branch ·
// strike-rewrite · sort · reflect · role-play · spot · match), led by branch + strike-rewrite + role-play.
// Meet safely, spot fakes & ghosts, handle rejection both ways, treat profiles as people. Practical safety not
// fear-mongering (meet in public, tell a friend, own way home, video-verify); skeptical of fast love/money asks;
// even-handed across genders/orientations. India: dating hidden from family -> tell a friend; image-based abuse
// -> cybercrime 1930/1098/181. Builds on g24, g40, g44; precedes g46. gameId "swipe-right".
import { V2Game } from "@/components/games/v2-engine";
import { SWIPE_RIGHT } from "@/content/games/swipe-right";

export function SwipeRightGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={SWIPE_RIGHT} onExit={onExit} />;
}
