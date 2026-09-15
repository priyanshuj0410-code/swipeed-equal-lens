"use client";

// Looking After You (node g63, Parenthood, Chapter 8): NEW v2 build to GDD 63 (mechanic-embodying), the parent's-
// OWN-wellbeing node and a HIGH-CARE one: you can't pour from an empty cup. Runs on the shared v2 engine: its
// researched typed library + config (content/games/looking-after-you.ts) render the play actions (strike-rewrite ·
// branch · reflect · sort · match · role-play · spot), led by strike-rewrite + branch + reflect. Six modes: the
// empty cup (busts 'good parents sacrifice everything'; self-care is part of childcare; struggling isn't failing),
// your needs count (protect needs/identity/time without guilt), baby blues and beyond (passing blues vs PPD/anxiety
// in mums AND dads; intrusive thoughts = symptom + cue to get help, never a verdict), reach out (help-seeking is
// strength), healthy coping (rest/breathe/move/connect/accept help; never a pain technique), tools/help (breathing
// space, help-finder, crisis routing). HIGH-CARE & non-shaming; healthy coping only and explicitly NOT therapy
// signposts professional care; includes fathers; addresses joint-family stigma. India: PPD ~1 in 5 mothers
// (fathers ~1 in 10); routes Tele-MANAS 14416, a doctor, emergency 112. Builds on g49 & g39;
// protects the parent for the rest of Chapter 8. gameId "looking-after-you".
import { V2Game } from "@/components/games/v2-engine";
import { LOOKING_AFTER_YOU } from "@/content/games/looking-after-you";

export function LookingAfterYouGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={LOOKING_AFTER_YOU} onExit={onExit} />;
}
