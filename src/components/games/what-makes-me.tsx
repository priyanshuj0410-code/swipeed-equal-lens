"use client";

// What Makes Me, Me (node g07, ages 6-9, Chapter 2): reworked to GDD 07 v2 (mechanic-embodying). The base
// of the gender thread (sex vs gender, kid-level; many ways to be; respect as the floor) runs on the shared
// v2 engine: its researched typed library + config (content/games/what-makes-me.ts) render the seven play
// actions (reflect · role-play · strike-rewrite · branch · sort · match · build), led by the me-collage build
// + the gentle sex-vs-gender explainer. India-grounded (hijra heritage · NALSA 2014). gameId "what-makes-me".
import { V2Game } from "@/components/games/v2-engine";
import { WHAT_MAKES_ME } from "@/content/games/what-makes-me";

export function WhatMakesMeGame({ onExit }: { onExit: () => void }) {
  return <V2Game config={WHAT_MAKES_ME} onExit={onExit} />;
}
