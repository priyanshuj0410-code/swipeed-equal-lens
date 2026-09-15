"use client";

// Be the Safe Adult (node g69, Parent Layer, Chapter 8): NEW v2 build to GDD 69 (mechanic-embodying), the
// SAFEGUARDING KEYSTONE that closes the Parent Layer and underwrites the ENTIRE kids' journey: from My Body, My
// Rules (g02) onward the curriculum tells children to "tell a trusted adult": this node makes sure that adult
// exists, notices, and responds right. MAXIMUM-CARE and trauma-informed; direct but never fear-mongering and never
// graphic. Runs on the shared v2 engine: its researched typed library + config (content/games/be-the-safe-adult.ts)
// render the play actions (strike-rewrite · role-play · branch · sort · match · spot · reflect), led by
// strike-rewrite + role-play + branch. Six modes: be tellable (the open, no-blame door; read silence as fear not
// betrayal), spot the signs (calmly; MOST abuse is by a known, trusted adult), if they tell you (BELIEVE, stay
// calm, not their fault, don't interrogate, act & protect, never hush up), the law and the call (POCSO basics;
// child always the victim; Childline 1098, police, POCSO e-Box, cybercrime 1930), safe online and off (grooming/
// sextortion never the child's fault; stay involved, keep evidence, report), tools and respond. Educational, NOT
// legal advice; routes real concerns to authorities; never any detail that could enable harm; centres the child as
// always the protected victim. Builds on g08, g02 & g40. gameId "be-the-safe-adult".
import { V2Game } from "@/components/games/v2-engine";
import { BE_THE_SAFE_ADULT } from "@/content/games/be-the-safe-adult";

export function BeTheSafeAdultGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={BE_THE_SAFE_ADULT} onExit={onExit} />;
}
