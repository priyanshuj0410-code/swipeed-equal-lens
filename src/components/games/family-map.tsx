"use client";

// The Family Map (node g57, ages 22+, Chapter 7) — NEW v2 build to GDD 57 (mechanic-embodying), the full-circle
// callback to My Family Garden (g03): in India you don't just marry a person, you join a family. Runs on the
// shared v2 engine: its researched typed library + config (content/games/family-map.ts) render the play actions
// (branch · strike-rewrite · sort · reflect · match · spot · role-play), led by branch + strike-rewrite + sort.
// Six modes: the web you join, kind boundaries (busts 'family always knows best' / 'a good bahu never says no'),
// couple as a team (decide together, face family as one; refuse triangulation), respect both ways (respect ≠
// obedience), when it turns harmful (dowry illegal under the Dowry Prohibition Act 1961; coercive in-law control →
// abuse, route to Respect at Home g56 + help), tools/help. Even-handed and warm; never 'cut them off' as a
// default. Links g55 (the load) and g56 (abuse). Builds on g03. gameId "family-map".
import { V2Game } from "@/components/games/v2-engine";
import { FAMILY_MAP } from "@/content/games/family-map";

export function FamilyMapGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={FAMILY_MAP} onExit={onExit} />;
}
