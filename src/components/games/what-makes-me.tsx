"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, ArrowRight, Check } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { SORT_CARDS, RULES, BADGE_TARGET, IT_CAN_CHANGE, SAME_BODY, ME_TAGS, SAM, type Line } from "@/content/games/what-makes-me";

type Mode = "home" | "sort" | "rules" | "change" | "same" | "me";
const STATIONS: [Mode, string, string][] = [
  ["sort", "🗂️", "Body or Learned?"],
  ["rules", "💥", "Bust the Rule"],
  ["change", "🔄", "It Can Change"],
  ["same", "🪞", "Same Body, Many Ways"],
  ["me", "💛", "What Makes Me, Me"],
];

export function WhatMakesMeGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState(0); // It-Can-Change badges (rules busted)
  const [sortIdx, setSortIdx] = useState(0);
  const [rulesIdx, setRulesIdx] = useState(0);
  const [busted, setBusted] = useState(false);
  const [meTags, setMeTags] = useState<Set<number>>(new Set());

  const say = useCallback((t: string, onEnd?: () => void) => { setBubble(t); speak(t, { muted, onEnd }); }, [muted]);

  useEffect(() => {
    speak(SAM.greet, { muted });
    return () => stopSpeaking();
    // greet once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => {
    setBadges(0); setSortIdx(0); setRulesIdx(0); setBusted(false); setMeTags(new Set()); setDone(false); setMode("home");
    say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "sort") { setSortIdx(0); say(SAM.sort); }
    else if (m === "rules") { setBusted(false); say(SAM.rules); }
    else if (m === "change") say(SAM.change);
    else if (m === "same") say(SAM.sameBody);
    else if (m === "me") say(SAM.me);
    else say(SAM.home);
  };

  const sortInto = (kind: "body" | "learned") => {
    const card = SORT_CARDS[sortIdx];
    if (!card) return;
    const right = kind === card.kind;
    if (right) celebrate("small");
    say(`${right ? "Yes! " : ""}${card.reveal}`, () => {
      if (sortIdx + 1 >= SORT_CARDS.length) go("home");
      else setSortIdx((i) => i + 1);
    });
  };

  const bustRule = () => {
    if (busted) return;
    setBusted(true);
    celebrate("small");
    say(RULES[rulesIdx].re);
    setBadges((b) => {
      const n = b + 1;
      if (n >= BADGE_TARGET) window.setTimeout(() => say(SAM.complete, () => setDone(true)), 1400);
      return n;
    });
  };
  const nextRule = () => { setRulesIdx((i) => (i + 1) % RULES.length); setBusted(false); say(SAM.rules); };

  const tapLine = (l: Line) => { say(l.say); celebrate("small"); };
  const toggleTag = (i: number) => setMeTags((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : (n.add(i), celebrate("small")); return n; });

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
    <button type="button" onClick={() => go("home")} className="glass-pill mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
      <Home className="size-5" aria-hidden /> Home
    </button>
  );
  const BadgeBook = (
    <div className="glass-card flex justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${badges} of ${BADGE_TARGET} It-Can-Change badges`}>
      {Array.from({ length: BADGE_TARGET }).map((_, i) => (
        <span key={i} className={`text-2xl ${i < badges ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{i < badges ? "🏅" : "⭕"}</span>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="What Makes Me, Me" tools={tools} onExit={onExit}>
        <GameDone gameId="what-makes-me" stars={3} coins={20} title="Rules are made — so they can change! 🌟" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="What Makes Me, Me" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {BadgeBook}

        {mode === "home" && (
          <div className="grid grid-cols-2 gap-2.5">
            {STATIONS.map(([m, emoji, label]) => (
              <button key={m} type="button" onClick={() => go(m)} className="glass-card flex flex-col items-center gap-1.5 rounded-2xl py-5 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.97]">
                <span className="text-4xl" aria-hidden>{emoji}</span>
                <span className="text-center text-sm font-bold text-white">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Body or Learned? — sort into the two bins */}
        {mode === "sort" && SORT_CARDS[sortIdx] && (
          <>
            <div className="glass-card rounded-2xl px-5 py-7 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <p className="font-display text-lg font-bold text-white">{SORT_CARDS[sortIdx].text}</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button type="button" onClick={() => sortInto("body")} className="glass-card flex flex-col items-center gap-1 rounded-2xl py-4 backdrop-blur-[12px] transition-transform active:scale-95">
                <span className="text-3xl" aria-hidden>🧬</span><span className="text-sm font-bold text-white">Body — born with it</span>
              </button>
              <button type="button" onClick={() => sortInto("learned")} className="glass-card flex flex-col items-center gap-1 rounded-2xl py-4 backdrop-blur-[12px] transition-transform active:scale-95">
                <span className="text-3xl" aria-hidden>📒</span><span className="text-sm font-bold text-white">Learned — taught</span>
              </button>
            </div>
            <p className="text-center text-xs text-white/60">{sortIdx + 1} / {SORT_CARDS.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Bust the 'Rule' — UN & RE */}
        {mode === "rules" && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-3xl" aria-hidden>📒</span>
              <p className={`font-display text-lg font-bold ${busted ? "text-white/40 line-through" : "animate-pulse"}`} style={busted ? undefined : { color: "#ff9085" }}>{RULES[rulesIdx].rule}</p>
            </div>
            {!busted ? (
              <button type="button" onClick={bustRule} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">
                💥 Bust this rule with UN &amp; RE
              </button>
            ) : (
              <>
                <UnReBeat un={RULES[rulesIdx].un} re={RULES[rulesIdx].re} />
                <button type="button" onClick={nextRule} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">
                  Next rule <ArrowRight className="size-4" aria-hidden />
                </button>
              </>
            )}
            {HomeBtn}
          </>
        )}

        {/* It Can Change */}
        {mode === "change" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {IT_CAN_CHANGE.map((l, i) => (
                <button key={i} type="button" onClick={() => tapLine(l)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]">
                  <span className="text-3xl" aria-hidden>{l.emoji}</span><span className="flex-1 text-base font-semibold text-white">{l.say}</span>
                </button>
              ))}
            </div>
            {HomeBtn}
          </>
        )}

        {/* Same Body, Many Ways */}
        {mode === "same" && (
          <>
            <div className="flex items-stretch gap-2">
              {[SAME_BODY.kidA, SAME_BODY.kidB].map((k, i) => (
                <button key={i} type="button" onClick={() => say(`${k.name} ${k.likes}.`)} className="glass-card flex flex-1 flex-col items-center gap-1 rounded-2xl py-5 backdrop-blur-[12px] transition-transform active:scale-95">
                  <span className="text-5xl" aria-hidden>{k.emoji}</span>
                  <span className="text-sm font-bold text-white">{k.name}</span>
                  <span className="text-center text-xs text-white/75">{k.likes}</span>
                </button>
              ))}
            </div>
            <button type="button" onClick={() => say(SAME_BODY.say)} className="glass-pill rounded-2xl px-4 py-3 text-center text-sm font-semibold backdrop-blur-md" style={{ color: "#eef1f7" }}>{SAME_BODY.say}</button>
            {HomeBtn}
          </>
        )}

        {/* What Makes Me, Me — the identity self-portrait */}
        {mode === "me" && (
          <>
            {meTags.size > 0 && (
              <div className="glass-card flex flex-wrap justify-center gap-1.5 rounded-2xl p-3 backdrop-blur-[12px] backdrop-saturate-150">
                {[...meTags].map((i) => (<span key={i} className="text-3xl animate-in zoom-in" aria-hidden>{ME_TAGS[i].emoji}</span>))}
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              {ME_TAGS.map((t, i) => (
                <button key={i} type="button" onClick={() => toggleTag(i)} aria-pressed={meTags.has(i)} className="glass-card flex flex-col items-center gap-0.5 rounded-2xl py-3 backdrop-blur-[12px] transition-transform active:scale-95" style={meTags.has(i) ? { boxShadow: "inset 0 0 0 2px #7C3AED" } : undefined}>
                  <span className="text-2xl" aria-hidden>{t.emoji}</span><span className="text-[10px] font-bold text-white">{t.label}</span>
                </button>
              ))}
            </div>
            <button type="button" disabled={meTags.size < 3} onClick={() => say(SAM.meDone)} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95 disabled:opacity-50">
              <Check className="size-5" aria-hidden /> That's me!
            </button>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
