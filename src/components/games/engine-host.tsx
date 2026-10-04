"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { V2GameConfig } from "@/content/games/v2-schema";
import type { CapstoneConfig } from "@/content/games/capstone-schema";

// Registry of the engine games. Every lesson game runs on the shared v2 engine and every capstone on the rich
// capstone engine, each fed by its JSON data file in src/content/games (SWED-134: content is data, the engine is
// code). Each entry is code-split: the engine and the game's data load together when the game opens. Each is a
// pure-DOM overlay (the grassland behind it comes from the path or the /game route) and takes an `onExit`.
type EngineGame = ComponentType<{ onExit: () => void }>;
type Data = () => Promise<{ default: unknown }>;

const lesson = (data: Data): EngineGame =>
  dynamic(
    async () => {
      const [{ V2Game }, m] = await Promise.all([import("@/components/games/v2-engine"), data()]);
      const config = m.default as V2GameConfig;
      return function LessonGame({ onExit }: { onExit: () => void }) {
        return <V2Game config={config} onExit={onExit} />;
      };
    },
    { ssr: false },
  );

const capstone = (data: Data): EngineGame =>
  dynamic(
    async () => {
      const [{ RichCapstone }, m] = await Promise.all([import("@/components/games/capstone-rich"), data()]);
      const config = m.default as CapstoneConfig;
      return function CapstoneGame({ onExit }: { onExit: () => void }) {
        return <RichCapstone config={config} onExit={onExit} />;
      };
    },
    { ssr: false },
  );

// gameId -> data file. The key is the runtime gameId (node.game === GameDone key); it differs from the file name
// only for Feelings Friends.
const GAMES: Record<string, EngineGame> = {
  feelings: lesson(() => import("@/content/games/feelings-friends.json")),
  "clean-crew": lesson(() => import("@/content/games/clean-crew.json")),
  "my-body": lesson(() => import("@/content/games/my-body.json")),
  "family-garden": lesson(() => import("@/content/games/family-garden.json")),
  "capstone-1": capstone(() => import("@/content/games/capstone-1.json")),
  "capstone-2": capstone(() => import("@/content/games/capstone-2.json")),
  "capstone-3": capstone(() => import("@/content/games/capstone-3.json")),
  "capstone-4": capstone(() => import("@/content/games/capstone-4.json")),
  "capstone-5": capstone(() => import("@/content/games/capstone-5.json")),
  "body-lab": lesson(() => import("@/content/games/body-lab.json")),
  "what-makes-me": lesson(() => import("@/content/games/what-makes-me.json")),
  "safety-squad": lesson(() => import("@/content/games/safety-squad.json")),
  "friend-frenemy": lesson(() => import("@/content/games/friend-frenemy.json")),
  "same-same": lesson(() => import("@/content/games/same-same.json")),
  "can-do": lesson(() => import("@/content/games/can-do.json")),
  "fair-play": lesson(() => import("@/content/games/fair-play.json")),
  "not-funny": lesson(() => import("@/content/games/not-funny.json")),
  "smart-screen": lesson(() => import("@/content/games/smart-screen.json")),
  "puberty-quest": lesson(() => import("@/content/games/puberty-quest.json")),
  "amazing-journey": lesson(() => import("@/content/games/amazing-journey.json")),
  "boundary-bot": lesson(() => import("@/content/games/boundary-bot.json")),
  crossroads: lesson(() => import("@/content/games/crossroads.json")),
  "norm-storm": lesson(() => import("@/content/games/norm-storm.json")),
  defenders: lesson(() => import("@/content/games/defenders.json")),
  "body-confident": lesson(() => import("@/content/games/body-confident.json")),
  "plan-it": lesson(() => import("@/content/games/plan-it.json")),
  outbreak: lesson(() => import("@/content/games/outbreak.json")),
  equalize: lesson(() => import("@/content/games/equalize.json")),
  "reality-check": lesson(() => import("@/content/games/reality-check.json")),
  "my-choices": lesson(() => import("@/content/games/my-choices.json")),
  "status-know-it": lesson(() => import("@/content/games/status-know-it.json")),
  mutual: lesson(() => import("@/content/games/mutual.json")),
  spectrum: lesson(() => import("@/content/games/spectrum.json")),
  decoded: lesson(() => import("@/content/games/decoded.json")),
  "mythbuster-lab": lesson(() => import("@/content/games/mythbuster-lab.json")),
  glrl: lesson(() => import("@/content/games/glrl.json")),
  "flip-script": lesson(() => import("@/content/games/flip-script.json")),
  "speak-up": lesson(() => import("@/content/games/speak-up.json")),
  "stand-up": lesson(() => import("@/content/games/stand-up.json")),
  "lead-the-way": lesson(() => import("@/content/games/lead-the-way.json")),
  "change-makers": lesson(() => import("@/content/games/change-makers.json")),
  "justice-league": lesson(() => import("@/content/games/justice-league.json")),
  "mind-matters": lesson(() => import("@/content/games/mind-matters.json")),
  bounce: lesson(() => import("@/content/games/bounce.json")),
  firewall: lesson(() => import("@/content/games/firewall.json")),
  "heart-smart": lesson(() => import("@/content/games/heart-smart.json")),
  "life-ready": lesson(() => import("@/content/games/life-ready.json")),
  "rabbit-hole": lesson(() => import("@/content/games/rabbit-hole.json")),
  "consent-real": lesson(() => import("@/content/games/consent-real.json")),
  "swipe-right": lesson(() => import("@/content/games/swipe-right.json")),
  "real-relationships": lesson(() => import("@/content/games/real-relationships.json")),
  "own-your-health": lesson(() => import("@/content/games/own-your-health.json")),
  "money-independence": lesson(() => import("@/content/games/money-independence.json")),
  "mind-belonging": lesson(() => import("@/content/games/mind-belonging.json")),
  "find-your-feet": lesson(() => import("@/content/games/find-your-feet.json")),
  "equal-confident": lesson(() => import("@/content/games/equal-confident.json")),
  "know-your-rights": lesson(() => import("@/content/games/know-your-rights.json")),
  "capstone-6": capstone(() => import("@/content/games/capstone-6.json")),
  "choosing-building": lesson(() => import("@/content/games/choosing-building.json")),
  "your-path-your-call": lesson(() => import("@/content/games/your-path-your-call.json")),
  "equal-partners": lesson(() => import("@/content/games/equal-partners.json")),
  "respect-at-home": lesson(() => import("@/content/games/respect-at-home.json")),
  "family-map": lesson(() => import("@/content/games/family-map.json")),
  "money-together": lesson(() => import("@/content/games/money-together.json")),
  "if-when-whether": lesson(() => import("@/content/games/if-when-whether.json")),
  "many-ways-to-family": lesson(() => import("@/content/games/many-ways-to-family.json")),
  "capstone-7": capstone(() => import("@/content/games/capstone-7.json")),
  "us-after-kids": lesson(() => import("@/content/games/us-after-kids.json")),
  "equal-parents": lesson(() => import("@/content/games/equal-parents.json")),
  "looking-after-you": lesson(() => import("@/content/games/looking-after-you.json")),
  "the-talks": lesson(() => import("@/content/games/the-talks.json")),
  "break-the-cycle": lesson(() => import("@/content/games/break-the-cycle.json")),
  "raising-gender-diverse-kids": lesson(() => import("@/content/games/raising-gender-diverse-kids.json")),
  "raising-neurodiverse-kids": lesson(() => import("@/content/games/raising-neurodiverse-kids.json")),
  "navigating-addictions": lesson(() => import("@/content/games/navigating-addictions.json")),
  "be-the-safe-adult": lesson(() => import("@/content/games/be-the-safe-adult.json")),
  "capstone-8": capstone(() => import("@/content/games/capstone-8.json")),
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
