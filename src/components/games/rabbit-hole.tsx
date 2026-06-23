"use client";

// The Rabbit Hole (node g43, ages 12–15, Chapter 4) — NEW v2 build to GDD 43 (mechanic-embodying). The
// online-misogyny / manosphere node (Thread E/G · Gender & Media), run on the shared v2 engine: its researched
// typed library + config (content/games/rabbit-hole.ts) render the play actions (branch · reflect ·
// strike-rewrite · spot · sort · role-play · match), led by strike-rewrite (bust the claim), spot (catch the
// hook) and branch. THE ONE RULE: never shame the boy — the funnel and the grift are the target, never the kid;
// boys pulled in are usually lonely/anxious/seeking identity, and grifters + algorithms exploit that.
// Media-literacy-led, evenhanded (the manosphere harms boys too), centred on positive masculinity (real
// strength lifts people, never needs anyone small; strong AND kind; confidence is built not bought). Never
// platforms real influencers. Routes the loneliness underneath to help (trusted adult, Tele-MANAS 14416;
// harassment → cybercrime.gov.in / 1930, Childline 1098). Builds on g25/g26. gameId "rabbit-hole" (the
// engine-host registry id; the GDD/library aspirational id is "the-rabbit-hole").
import { V2Game } from "@/components/games/v2-engine";
import { RABBIT_HOLE } from "@/content/games/rabbit-hole";

export function RabbitHoleGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={RABBIT_HOLE} onExit={onExit} />;
}
