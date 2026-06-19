"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// Registry of non-swipe "engine" games. Each is a pure-DOM overlay (the grassland behind
// it comes from the path or the /game route), takes an `onExit`, and is code-split.
type EngineGame = ComponentType<{ onExit: () => void }>;

const GAMES: Record<string, EngineGame> = {
  feelings: dynamic(() => import("@/components/games/feelings-friends").then((m) => m.FeelingsFriendsGame), {
    ssr: false,
  }),
  "my-body": dynamic(() => import("@/components/games/my-body").then((m) => m.MyBodyGame), {
    ssr: false,
  }),
  "family-garden": dynamic(() => import("@/components/games/family-garden").then((m) => m.FamilyGardenGame), {
    ssr: false,
  }),
  "capstone-1": dynamic(() => import("@/components/games/capstone-1").then((m) => m.CapstoneOneGame), {
    ssr: false,
  }),
  "capstone-2": dynamic(() => import("@/components/games/capstone-2").then((m) => m.CapstoneTwoGame), {
    ssr: false,
  }),
  "capstone-3": dynamic(() => import("@/components/games/capstone-3").then((m) => m.CapstoneThreeGame), {
    ssr: false,
  }),
  "capstone-4": dynamic(() => import("@/components/games/capstone-4").then((m) => m.CapstoneFourGame), {
    ssr: false,
  }),
  "body-lab": dynamic(() => import("@/components/games/body-lab").then((m) => m.BodyLabGame), {
    ssr: false,
  }),
  "what-makes-me": dynamic(() => import("@/components/games/what-makes-me").then((m) => m.WhatMakesMeGame), {
    ssr: false,
  }),
  "safety-squad": dynamic(() => import("@/components/games/safety-squad").then((m) => m.SafetySquadGame), {
    ssr: false,
  }),
  "friend-frenemy": dynamic(() => import("@/components/games/friend-frenemy").then((m) => m.FriendFrenemyGame), {
    ssr: false,
  }),
  "same-same": dynamic(() => import("@/components/games/same-same").then((m) => m.SameSameGame), {
    ssr: false,
  }),
  "can-do": dynamic(() => import("@/components/games/can-do").then((m) => m.CanDoGame), {
    ssr: false,
  }),
  "fair-play": dynamic(() => import("@/components/games/fair-play").then((m) => m.FairPlayGame), {
    ssr: false,
  }),
  "not-funny": dynamic(() => import("@/components/games/not-funny").then((m) => m.NotFunnyGame), {
    ssr: false,
  }),
  "smart-screen": dynamic(() => import("@/components/games/smart-screen").then((m) => m.SmartScreenGame), {
    ssr: false,
  }),
  "puberty-quest": dynamic(() => import("@/components/games/puberty-quest").then((m) => m.PubertyQuestGame), {
    ssr: false,
  }),
  "amazing-journey": dynamic(() => import("@/components/games/amazing-journey").then((m) => m.AmazingJourneyGame), {
    ssr: false,
  }),
  "boundary-bot": dynamic(() => import("@/components/games/boundary-bot").then((m) => m.BoundaryBotGame), {
    ssr: false,
  }),
  "crossroads": dynamic(() => import("@/components/games/crossroads").then((m) => m.CrossroadsGame), {
    ssr: false,
  }),
  "norm-storm": dynamic(() => import("@/components/games/norm-storm").then((m) => m.NormStormGame), {
    ssr: false,
  }),
  "defenders": dynamic(() => import("@/components/games/defenders").then((m) => m.DefendersGame), {
    ssr: false,
  }),
  "body-confident": dynamic(() => import("@/components/games/body-confident").then((m) => m.BodyConfidentGame), {
    ssr: false,
  }),
  "plan-it": dynamic(() => import("@/components/games/plan-it").then((m) => m.PlanItGame), {
    ssr: false,
  }),
  "outbreak": dynamic(() => import("@/components/games/outbreak").then((m) => m.OutbreakGame), {
    ssr: false,
  }),
  "equalize": dynamic(() => import("@/components/games/equalize").then((m) => m.EqualizeGame), {
    ssr: false,
  }),
  "reality-check": dynamic(() => import("@/components/games/reality-check").then((m) => m.RealityCheckGame), {
    ssr: false,
  }),
  "my-choices": dynamic(() => import("@/components/games/my-choices").then((m) => m.MyChoicesGame), {
    ssr: false,
  }),
  "flip-script": dynamic(() => import("@/components/games/flip-script").then((m) => m.FlipScriptGame), {
    ssr: false,
  }),
  "speak-up": dynamic(() => import("@/components/games/speak-up").then((m) => m.SpeakUpGame), {
    ssr: false,
  }),
  "stand-up": dynamic(() => import("@/components/games/stand-up").then((m) => m.StandUpGame), {
    ssr: false,
  }),
  "lead-the-way": dynamic(() => import("@/components/games/lead-the-way").then((m) => m.LeadTheWayGame), {
    ssr: false,
  }),
  "change-makers": dynamic(() => import("@/components/games/change-makers").then((m) => m.ChangeMakersGame), {
    ssr: false,
  }),
  "justice-league": dynamic(() => import("@/components/games/justice-league").then((m) => m.JusticeLeagueGame), {
    ssr: false,
  }),
};

export function hasEngineGame(id: string): boolean {
  return id in GAMES;
}

/** Renders the engine game for `id` in place, or nothing if there's no such game. */
export function EngineGameHost({ id, onExit }: { id: string; onExit: () => void }) {
  const Game = GAMES[id];
  if (!Game) return null;
  return <Game onExit={onExit} />;
}
