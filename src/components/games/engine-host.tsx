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
  "clean-crew": dynamic(() => import("@/components/games/clean-crew").then((m) => m.CleanCrewGame), {
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
  "capstone-5": dynamic(() => import("@/components/games/capstone-5").then((m) => m.CapstoneFiveGame), {
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
  "status-know-it": dynamic(() => import("@/components/games/status-know-it").then((m) => m.StatusKnowItGame), {
    ssr: false,
  }),
  "mutual": dynamic(() => import("@/components/games/mutual").then((m) => m.MutualGame), {
    ssr: false,
  }),
  "spectrum": dynamic(() => import("@/components/games/spectrum").then((m) => m.SpectrumGame), {
    ssr: false,
  }),
  "decoded": dynamic(() => import("@/components/games/decoded").then((m) => m.DecodedGame), {
    ssr: false,
  }),
  "mythbuster-lab": dynamic(() => import("@/components/games/mythbuster-lab").then((m) => m.MythBusterGame), {
    ssr: false,
  }),
  glrl: dynamic(() => import("@/components/games/glrl").then((m) => m.GlrlGame), {
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
  "mind-matters": dynamic(() => import("@/components/games/mind-matters").then((m) => m.MindMattersGame), {
    ssr: false,
  }),
  "bounce": dynamic(() => import("@/components/games/bounce").then((m) => m.BounceGame), {
    ssr: false,
  }),
  "firewall": dynamic(() => import("@/components/games/firewall").then((m) => m.FirewallGame), {
    ssr: false,
  }),
  "heart-smart": dynamic(() => import("@/components/games/heart-smart").then((m) => m.HeartSmartGame), {
    ssr: false,
  }),
  "life-ready": dynamic(() => import("@/components/games/life-ready").then((m) => m.LifeReadyGame), {
    ssr: false,
  }),
  "rabbit-hole": dynamic(() => import("@/components/games/rabbit-hole").then((m) => m.RabbitHoleGame), {
    ssr: false,
  }),
  // Chapter 6 — adult journey (18–22)
  "consent-real": dynamic(() => import("@/components/games/consent-real").then((m) => m.ConsentRealGame), {
    ssr: false,
  }),
  "swipe-right": dynamic(() => import("@/components/games/swipe-right").then((m) => m.SwipeRightGame), {
    ssr: false,
  }),
  "real-relationships": dynamic(() => import("@/components/games/real-relationships").then((m) => m.RealRelationshipsGame), {
    ssr: false,
  }),
  "own-your-health": dynamic(() => import("@/components/games/own-your-health").then((m) => m.OwnYourHealthGame), {
    ssr: false,
  }),
  "money-independence": dynamic(() => import("@/components/games/money-independence").then((m) => m.MoneyIndependenceGame), {
    ssr: false,
  }),
  "mind-belonging": dynamic(() => import("@/components/games/mind-belonging").then((m) => m.MindBelongingGame), {
    ssr: false,
  }),
  "find-your-feet": dynamic(() => import("@/components/games/find-your-feet").then((m) => m.FindYourFeetGame), {
    ssr: false,
  }),
  "equal-confident": dynamic(() => import("@/components/games/equal-confident").then((m) => m.EqualConfidentGame), {
    ssr: false,
  }),
  "know-your-rights": dynamic(() => import("@/components/games/know-your-rights").then((m) => m.KnowYourRightsGame), {
    ssr: false,
  }),
  "capstone-6": dynamic(() => import("@/components/games/capstone-6").then((m) => m.CapstoneSixGame), {
    ssr: false,
  }),
  // Chapter 7 — Building a Life (22 → first child)
  "choosing-building": dynamic(() => import("@/components/games/choosing-building").then((m) => m.ChoosingBuildingGame), {
    ssr: false,
  }),
  "your-path-your-call": dynamic(() => import("@/components/games/your-path-your-call").then((m) => m.YourPathYourCallGame), {
    ssr: false,
  }),
  "equal-partners": dynamic(() => import("@/components/games/equal-partners").then((m) => m.EqualPartnersGame), {
    ssr: false,
  }),
  "respect-at-home": dynamic(() => import("@/components/games/respect-at-home").then((m) => m.RespectAtHomeGame), {
    ssr: false,
  }),
  "family-map": dynamic(() => import("@/components/games/family-map").then((m) => m.FamilyMapGame), {
    ssr: false,
  }),
  "money-together": dynamic(() => import("@/components/games/money-together").then((m) => m.MoneyTogetherGame), {
    ssr: false,
  }),
  "if-when-whether": dynamic(() => import("@/components/games/if-when-whether").then((m) => m.IfWhenWhetherGame), {
    ssr: false,
  }),
  "many-ways-to-family": dynamic(() => import("@/components/games/many-ways-to-family").then((m) => m.ManyWaysToFamilyGame), {
    ssr: false,
  }),
  "capstone-7": dynamic(() => import("@/components/games/capstone-7").then((m) => m.CapstoneSevenGame), {
    ssr: false,
  }),
  // Chapter 8 — Parenthood (first child on)
  "us-after-kids": dynamic(() => import("@/components/games/us-after-kids").then((m) => m.UsAfterKidsGame), {
    ssr: false,
  }),
  "equal-parents": dynamic(() => import("@/components/games/equal-parents").then((m) => m.EqualParentsGame), {
    ssr: false,
  }),
  "looking-after-you": dynamic(() => import("@/components/games/looking-after-you").then((m) => m.LookingAfterYouGame), {
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
