"use client";

// Your Path, Your Call (node g54, ages 22+, Chapter 7): NEW v2 build to GDD 54 (mechanic-embodying), the EQUITY
// HEART of Chapter 7 and the counterpoint to Choosing & Building (g53): marriage and children are ONE valid path,
// not the measure of a life. Runs on the shared v2 engine: its researched typed library + config
// (content/games/your-path-your-call.ts) render the play actions (strike-rewrite · branch · role-play · sort ·
// reflect · match · spot), led by strike-rewrite + branch + role-play. Five themes: the script & the choice
// (autonomy over your own life), not marrying (a full life needs no marriage; UN&RE), childfree complete
// (womanhood isn't motherhood), hold your ground (family/social pressure, kindly but firmly), worth beyond status
// (never your marital state, looks or the marriage market). No pressure in any direction; every path dignified;
// never shames those who DO marry or have children; even-handed. Coercion/distress routed to support; forced
// marriage to help (181/1091/112/1098). Builds on g50 & g26. gameId "your-path-your-call".
import { V2Game } from "@/components/games/v2-engine";
import { YOUR_PATH_YOUR_CALL } from "@/content/games/your-path-your-call";

export function YourPathYourCallGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={YOUR_PATH_YOUR_CALL} onExit={onExit} />;
}
