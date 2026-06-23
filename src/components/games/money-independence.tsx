"use client";

// Money & Independence (node g48, ages 18–22, Chapter 6) — NEW v2 build to GDD 48 (mechanic-embodying), the
// College stand-on-your-own-feet node (Thread C, Work & Money), reworking the old ModesEngine build onto the
// shared v2 engine: its researched typed library + config (content/games/money-independence.ts) render the play
// actions (branch · sort · strike-rewrite · reflect · match · role-play · spot), led by branch + sort +
// strike-rewrite. Money = independence, safety and choices: budget it, save & avoid traps (debt/EMIs/BNPL/scams),
// earn & ask (payslips, pay gap, negotiating), money & love (fair money; financial control as abuse), money is
// freedom. Educational, NOT financial advice; no products promoted. Financial control named as abuse under India's
// DV Act -> 181/1091. India: UPI, EMIs, payslips, pay gap. Builds on g42; pairs g49/g52; continues into g58.
// gameId "money-independence".
import { V2Game } from "@/components/games/v2-engine";
import { MONEY_INDEPENDENCE } from "@/content/games/money-independence";

export function MoneyIndependenceGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={MONEY_INDEPENDENCE} onExit={onExit} />;
}
