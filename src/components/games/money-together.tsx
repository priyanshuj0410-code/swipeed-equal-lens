"use client";

// Money, Together (node g58, ages 22+, Chapter 7) — NEW v2 build to GDD 58 (mechanic-embodying), carrying the Work
// & Money domain from Money & Independence (g48) into shared adult life: two incomes, one life. Runs on the shared
// v2 engine: its researched typed library + config (content/games/money-together.ts) render the play actions
// (branch · strike-rewrite · sort · reflect · match · spot · role-play), led by branch + strike-rewrite + sort.
// Six modes: the money talk (care not coldness), plan together (joint AND personal accounts), stay independent
// (busts 'he handles the money because he earns it'; homemaker's unpaid work is real value), fair not gendered
// (managing money isn't a man's job; a homemaker is an equal, not a dependent), control is abuse (allowances,
// cut-offs, seizing salary/stridhan, barring work = economic abuse under PWDVA 2005 -> Respect at Home g56 +
// help), tools/help. Even-handed; centres each partner's financial independence; educational, not financial/legal
// advice. India: stridhan is a woman's property by law; NALSA 15100. Builds on g48; pairs with g55; guards the
// control covered in g56. gameId "money-together".
import { V2Game } from "@/components/games/v2-engine";
import { MONEY_TOGETHER } from "@/content/games/money-together";

export function MoneyTogetherGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={MONEY_TOGETHER} onExit={onExit} />;
}
