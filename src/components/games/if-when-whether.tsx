"use client";

// If, When & Whether (node g59, ages 22+, Chapter 7) — NEW v2 build to GDD 59 (mechanic-embodying), the
// reproductive-decision heart of Chapter 7 and the adult version of My Choices (g29): whether to have children,
// when, and how many — made with real knowledge, together, and free of pressure in ANY direction. Runs on the
// shared v2 engine: its researched typed library + config (content/games/if-when-whether.ts) render the play
// actions (strike-rewrite · branch · sort · reflect · match · role-play · spot), led by strike-rewrite + branch +
// sort. Six modes: whether & why (childfree is complete & valid), fertility for real (calm facts — women AND men,
// busts 'there's always time' / 'it just happens'; no scare tactics), when & spacing (your own timeline), if it's
// hard (infertility with compassion — ~1 in 6, no shame; routes to Many Ways to Family g60), free of pressure
// (autonomy; son-preference/sex-selection illegal under the PCPNDT Act), tools/help. Even-handed, non-coercive,
// medically accurate but panic-free; NOT medical advice — points to clinicians/RKSK. Builds on g29; pairs with
// g60. gameId "if-when-whether".
import { V2Game } from "@/components/games/v2-engine";
import { IF_WHEN_WHETHER } from "@/content/games/if-when-whether";

export function IfWhenWhetherGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={IF_WHEN_WHETHER} onExit={onExit} />;
}
