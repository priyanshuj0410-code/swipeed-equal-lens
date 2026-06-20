"use client";

import { useCallback, useEffect, useState } from "react";
import { X, Flag, Flame, Check, Home, Volume2, VolumeX, RotateCcw, Play, Lock } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameCard } from "@/components/game-card";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { ToolMoment } from "@/components/toolkit/tool-moment";
import { GlrlRunHost } from "@/components/glrl/run-host";
import { FlagpediaView } from "@/components/flagpedia-view";
import { useSwipeGame } from "@/lib/use-swipe-game";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { useProfile } from "@/lib/store";
import { availableDecks, resolveDeckCards, DECK_BY_ID } from "@/content/decks";
import { RUN_DECKS, todayKey } from "@/content/runs";
import { CHARACTER_BY_ID } from "@/content/characters";
import { PERKS, STARTER_PERKS, isPerkUnlocked, LOADOUT } from "@/content/perks";
import type { PerkId, RunDeckId } from "@/lib/types";

// Green Light / Red Light as a first-class engine game: same home shape as every other node — Sam header
// + a progress row + a 2-column mode grid on the shared GameShell body. Story/Powers are native
// sub-screens; the roguelike run (GlrlRunHost) and the v1 Quick Play swipe (useSwipeGame) are the
// gameplay. Exit hierarchy: run/swipe/sub-screen → home → path.
type Screen = "home" | "story" | "powers" | "pedia";

const MODES: { id: string; emoji: string; label: string }[] = [
  { id: "story", emoji: "🎬", label: "Story" },
  { id: "daily", emoji: "📅", label: "Daily" },
  { id: "quick", emoji: "🪶", label: "Quick Play" },
  { id: "boss", emoji: "🔥", label: "Boss Rush" },
  { id: "pedia", emoji: "📖", label: "Flag-pedia" },
];

const SAM = {
  home: "Ready to read the green and red flags? Pick how you'd like to play.",
  story: "Choose a story — whose relationship will you read?",
  powers: "Equip your Insight powers, then start the run.",
  pedia: "Your Flag-pedia — every sign you've mastered.",
};

export function GlrlGame({ onExit }: { onExit: () => void }) {
  const { profile, markDailyRun } = useProfile();
  const game = useSwipeGame();
  const [screen, setScreen] = useState<Screen>("home");
  const [deck, setDeck] = useState<RunDeckId | null>(null);
  const [perks, setPerks] = useState<PerkId[]>([]);
  const [run, setRun] = useState<{ deckId: RunDeckId; perks: PerkId[] } | null>(null);
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.home);

  const storyDecks = RUN_DECKS.filter((d) => d.id !== "boss-rush" && (!profile.schoolComfort || d.schoolComfortSafe));
  const defaultPerks = STARTER_PERKS.slice(0, LOADOUT.min);
  const seed = (() => { const n = new Date(); return Number(`${n.getFullYear()}${n.getMonth() + 1}${n.getDate()}`); })();
  const dailyDeck = storyDecks[seed % Math.max(1, storyDecks.length)];
  const dailyDone = profile.dailyRunOn === todayKey();

  const say = useCallback((t: string) => { setBubble(t); speak(t, { muted }); }, [muted]);

  useEffect(() => {
    speak(SAM.home, { muted });
    return () => stopSpeaking();
    // greet once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goHome = () => { setScreen("home"); say(SAM.home); };
  const togglePerk = (id: PerkId) =>
    setPerks((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= LOADOUT.max ? p : [...p, id]));
  const ready = deck !== null && perks.length >= LOADOUT.min && perks.length <= LOADOUT.max;

  const pickMode = (id: string) => {
    if (id === "story") { setScreen("story"); say(SAM.story); }
    else if (id === "pedia") { setScreen("pedia"); say(SAM.pedia); }
    else if (id === "daily") { if (dailyDeck) { markDailyRun(todayKey()); setRun({ deckId: dailyDeck.id, perks: defaultPerks }); } }
    else if (id === "boss") { setRun({ deckId: "boss-rush" as RunDeckId, perks: defaultPerks }); }
    else if (id === "quick") {
      const first = availableDecks(profile.schoolComfort)[0];
      if (first) game.start(first.id, resolveDeckCards(first.id, profile.schoolComfort), DECK_BY_ID[first.id]?.swipe);
    }
  };

  const muteBtn = (
    <button type="button" aria-label={muted ? "Turn sound on" : "Turn sound off"} onClick={() => setMuted((m) => { const n = !m; if (n) stopSpeaking(); return n; })} className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
      {muted ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
    </button>
  );
  const tools = (
    <span className="flex items-center gap-2">
      {!muted && (
        <button type="button" aria-label="Hear it again" onClick={() => replay()} className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
          <RotateCcw className="size-4" aria-hidden />
        </button>
      )}
      {muteBtn}
    </span>
  );
  const SamSays = (
    <div className="flex items-center gap-3">
      <Sam size={64} />
      <span className="glass-pill flex-1 rounded-2xl px-4 py-2.5 text-center text-base font-bold backdrop-blur-md backdrop-saturate-150" style={{ color: "#eef1f7" }}>{bubble}</span>
    </div>
  );
  const HomeBtn = (
    <button type="button" onClick={goHome} className="glass-pill mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
      <Home className="size-5" aria-hidden /> Back
    </button>
  );
  // Progress row (the badge-book equivalent) — a pip per story deck, lit once that story is cleared.
  const Progress = (
    <div className="glass-card flex items-center justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label="stories cleared">
      <span className="text-xl" aria-hidden>🗂️</span>
      <span className="mx-1 h-5 w-px bg-white/25" aria-hidden />
      {storyDecks.map((d) => (
        <span key={d.id} className={`text-2xl ${profile.runDeckCleared?.[d.id] ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{profile.runDeckCleared?.[d.id] ? d.emoji : "🤍"}</span>
      ))}
    </div>
  );

  // ---- Quick Play (Easy) — the v1 swipe, self-contained, into the shared GameDone ----
  if (game.view || game.result) {
    const hud = game.hud;
    return (
      <>
        {game.view && <GameCard view={game.view} onCommit={game.commit} />}
        {game.view && hud && (
          <>
            <div className="fixed left-4 top-4 z-50 flex max-w-[calc(100%-4rem)] items-center gap-2">
              <button type="button" aria-label="Back" onClick={game.quit} className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95"><X className="size-5" aria-hidden /></button>
              <span className="glass-pill flex h-9 min-w-0 items-center rounded-full px-3 backdrop-blur-md backdrop-saturate-150"><span className="min-w-0 truncate text-xs font-semibold">{hud.title} · {Math.min(hud.index + 1, hud.total)}/{hud.total}</span></span>
              <span className="glass-pill flex h-9 shrink-0 items-center rounded-full px-3 text-xs font-bold backdrop-blur-md backdrop-saturate-150">{hud.score} pts</span>
              {hud.streak > 1 && (<span className="glass-pill flex h-9 shrink-0 items-center gap-1 rounded-full px-3 text-xs font-bold backdrop-blur-md backdrop-saturate-150"><Flame className="size-3.5" style={{ color: "var(--flame)" }} aria-hidden /> {hud.streak}</span>)}
            </div>
            <div className="fixed inset-x-0 bottom-6 z-40 mx-auto flex w-full max-w-sm items-center gap-3 px-5">
              {hud.phase === "reveal" ? (
                <button type="button" onClick={game.next} className="glass-pill h-14 flex-1 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">{hud.isLast ? "Finish" : "Next"}</button>
              ) : (
                <>
                  <button type="button" disabled={hud.busy} onClick={() => game.commit("red")} className="glass-pill flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95 disabled:opacity-60" style={{ color: "#ff9085", borderColor: "rgba(255,144,133,0.45)" }}><Flag className="size-5" aria-hidden /> {hud.labels.left}</button>
                  <button type="button" disabled={hud.busy} onClick={() => game.commit("green")} className="glass-pill flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95 disabled:opacity-60" style={{ color: "#62e08f", borderColor: "rgba(98,224,143,0.45)" }}><Check className="size-5" aria-hidden /> {hud.labels.right}</button>
                </>
              )}
            </div>
          </>
        )}
        {game.result && (
          <GameShell title={game.result.title} onExit={game.quit}>
            <GameDone gameId={game.result.deckId} stars={game.result.stars} coins={game.result.coins} bestStreak={game.result.best} title="Deck complete!" blurb={`You read ${game.result.correct} of ${game.result.total} carefully.`} onReplay={game.replay} onExit={game.quit} />
          </GameShell>
        )}
      </>
    );
  }

  // ---- The roguelike run (story / daily / boss) — its own live Clarity HUD ----
  if (run) {
    return <GlrlRunHost deckId={run.deckId} perks={run.perks} onExit={() => setRun(null)} />;
  }

  // ---- Home / sub-screens — the shared GameShell body, like every other node ----
  return (
    <GameShell title="Green Light / Red Light" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {Progress}
        {screen === "home" && <ToolMoment tool="cool-down" line="Reading relationships gets intense — your Cool-Down is right here." />}

        {screen === "home" && (
          <div className="grid grid-cols-2 gap-2.5">
            {MODES.map((m) => (
              <button key={m.id} type="button" onClick={() => pickMode(m.id)} disabled={m.id === "daily" && !dailyDeck} className="glass-card flex flex-col items-center gap-1.5 rounded-2xl py-5 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.97]">
                <span className="text-4xl" aria-hidden>{m.emoji}</span>
                <span className="text-center text-sm font-bold text-white">{m.label}{m.id === "daily" && dailyDone ? " ✓" : ""}</span>
              </button>
            ))}
          </div>
        )}

        {/* Story — pick a story deck */}
        {screen === "story" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {storyDecks.map((d) => {
                const ch = CHARACTER_BY_ID[d.character];
                const cleared = profile.runDeckCleared?.[d.id];
                return (
                  <button key={d.id} type="button" onClick={() => { setDeck(d.id); setPerks([]); setScreen("powers"); say(SAM.powers); }} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]">
                    <span className="text-2xl" aria-hidden>{d.emoji}</span>
                    <span className="flex-1 text-sm font-bold text-white">{d.title} <span className="font-normal text-white/55">· {ch.name}</span></span>
                    {cleared && <Check className="size-5 shrink-0 text-white" aria-hidden />}
                  </button>
                );
              })}
            </div>
            {HomeBtn}
          </>
        )}

        {/* Powers — equip Insight perks, then start the run */}
        {screen === "powers" && (
          <>
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-white/60">Equip {LOADOUT.min}–{LOADOUT.max} powers · {perks.length}/{LOADOUT.max}</p>
            <div className="grid grid-cols-2 gap-2.5">
              {PERKS.map((p) => {
                const on = perks.includes(p.id);
                const unlocked = isPerkUnlocked(p.id, profile);
                const full = !on && perks.length >= LOADOUT.max;
                return (
                  <button key={p.id} type="button" onClick={() => unlocked && togglePerk(p.id)} disabled={full || !unlocked} title={unlocked ? p.effect : `Locked — ${p.unlock}`} aria-pressed={on}
                    className="glass-card flex items-center gap-2 rounded-2xl px-3 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.97] disabled:opacity-40"
                    style={on ? { boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.6)" } : undefined}>
                    <span className="text-xl leading-none" aria-hidden>{unlocked ? p.emoji : "🔒"}</span>
                    <span className="min-w-0">
                      <span className="block text-xs font-bold text-white">{p.name}</span>
                      {!unlocked && (<span className="flex items-center gap-1 text-[10px] leading-tight text-white/55"><Lock className="size-2.5 shrink-0" aria-hidden /> {p.unlock}</span>)}
                    </span>
                  </button>
                );
              })}
            </div>
            <button type="button" disabled={!ready} onClick={() => deck && setRun({ deckId: deck, perks })} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95 disabled:opacity-50">
              <Play className="size-5" aria-hidden /> Start the run
            </button>
            {HomeBtn}
          </>
        )}

        {/* Flag-pedia — the collection of signs mastered */}
        {screen === "pedia" && <FlagpediaView onBack={goHome} />}
      </div>
    </GameShell>
  );
}
