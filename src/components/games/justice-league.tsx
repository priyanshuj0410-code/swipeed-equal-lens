"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, Check } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import {
  RIGHTS, RIGHTS_UN, RIGHTS_RE, LAWS, JUSTICE, ACTION_SCENES, ACTION_MISS, TOOLKIT_ASK,
  BADGE_TARGET, SAM, type Scene, type Fact,
} from "@/content/games/justice-league";

type Mode = "home" | "rights" | "laws" | "justice" | "action" | "toolkit";
const MODES: [Mode, string, string][] = [
  ["rights", "⚖️", "Know Your Rights"],
  ["laws", "📜", "Know the Law"],
  ["justice", "🏛️", "Get Justice"],
  ["action", "🎯", "Rights in Action"],
  ["toolkit", "🧰", "Your Rights Toolkit"],
];

export function JusticeLeagueGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [rightsGot, setRightsGot] = useState<Set<number>>(new Set());
  const [rightsUnRe, setRightsUnRe] = useState(false);
  const [lawsGot, setLawsGot] = useState<Set<number>>(new Set());
  const [justGot, setJustGot] = useState<Set<number>>(new Set());
  const [actIdx, setActIdx] = useState(0);
  const [askGot, setAskGot] = useState<Set<number>>(new Set());

  const say = useCallback((t: string, onEnd?: () => void) => { setBubble(t); speak(t, { muted, onEnd }); }, [muted]);

  useEffect(() => {
    speak(SAM.greet, { muted });
    return () => stopSpeaking();
    // greet once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const earn = useCallback((id: string) => {
    setBadges((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev); next.add(id);
      celebrate("small");
      if (next.size >= BADGE_TARGET) window.setTimeout(() => say(SAM.complete, () => setDone(true)), 1200);
      else say(SAM.badge);
      return next;
    });
  }, [say]);

  const reset = () => {
    setBadges(new Set()); setRightsGot(new Set()); setRightsUnRe(false); setLawsGot(new Set()); setJustGot(new Set());
    setActIdx(0); setAskGot(new Set()); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "rights") { setRightsUnRe(false); say(SAM.rights); }
    else if (m === "laws") say(SAM.laws);
    else if (m === "justice") say(SAM.justice);
    else if (m === "action") { setActIdx(0); say(SAM.action); }
    else if (m === "toolkit") say(SAM.toolkit);
    else say(SAM.home);
  };

  const tapRights = (i: number) => {
    if (rightsGot.has(i)) return;
    const next = new Set(rightsGot); next.add(i);
    setRightsGot(next); say(RIGHTS[i].say); celebrate("small");
    if (next.size >= RIGHTS.length) window.setTimeout(() => setRightsUnRe(true), 200);
  };
  const tapList = (arr: Fact[], got: Set<number>, setGot: (s: Set<number>) => void, id: string) => (i: number) => {
    if (got.has(i)) return;
    const next = new Set(got); next.add(i);
    setGot(next); say(arr[i].say); celebrate("small");
    if (next.size >= arr.length) earn(id);
  };
  const tapLaws = tapList(LAWS, lawsGot, setLawsGot, "laws");
  const tapJust = tapList(JUSTICE, justGot, setJustGot, "justice");

  const tapAsk = (i: number) => {
    if (askGot.has(i)) return;
    const next = new Set(askGot); next.add(i);
    setAskGot(next); say(TOOLKIT_ASK[i].a); celebrate("small");
    if (next.size >= TOOLKIT_ASK.length) earn("toolkit");
  };

  const chooseAction = (ok: boolean) => {
    if (!ok) { say(ACTION_MISS); return; }
    celebrate("small");
    say(ACTION_SCENES[actIdx].result, () => { if (actIdx + 1 >= ACTION_SCENES.length) { earn("action"); go("home"); } else setActIdx((i) => i + 1); });
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
    <button type="button" onClick={() => go("home")} className="glass-pill mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
      <Home className="size-5" aria-hidden /> Home
    </button>
  );
  const BadgeBook = (
    <div className="glass-card flex justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${badges.size} of ${BADGE_TARGET} badges`}>
      {MODES.map(([id]) => (
        <span key={id} className={`text-2xl ${badges.has(id) ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{badges.has(id) ? "🏅" : "🤍"}</span>
      ))}
    </div>
  );
  const TapList = (items: Fact[], got: Set<number>, onTap: (i: number) => void) => (
    <div className="grid grid-cols-1 gap-2.5">
      {items.map((it, i) => (
        <button key={i} type="button" onClick={() => onTap(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={got.has(i) ? { boxShadow: "inset 0 0 0 2px #7C3AED" } : undefined}>
          <span className="text-2xl" aria-hidden>{it.emoji}</span>
          <span className="flex-1 text-sm font-semibold text-white">{it.say}</span>
          {got.has(i) && <Check className="size-5 text-white" aria-hidden />}
        </button>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Justice League: Rights" tools={tools} onExit={onExit}>
        <GameDone gameId="justice-league" stars={3} coins={30} title="Justice! 🏛️" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Justice League: Rights" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {BadgeBook}

        {mode === "home" && (
          <div className="grid grid-cols-2 gap-2.5">
            {MODES.map(([m, emoji, label]) => (
              <button key={m} type="button" onClick={() => go(m)} className="glass-card flex flex-col items-center gap-1.5 rounded-2xl py-5 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.97]">
                <span className="text-4xl" aria-hidden>{emoji}</span>
                <span className="text-center text-sm font-bold text-white">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Know Your Rights — collect, then UN & RE */}
        {mode === "rights" && (
          <>
            {!rightsUnRe ? (
              <>{TapList(RIGHTS, rightsGot, tapRights)}<p className="text-center text-xs text-white/60">{rightsGot.size} / {RIGHTS.length}</p></>
            ) : (
              <>
                <UnReBeat un={RIGHTS_UN} re={RIGHTS_RE} />
                <button type="button" onClick={() => { earn("rights"); go("home"); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">These rights are mine</button>
              </>
            )}
            {HomeBtn}
          </>
        )}

        {mode === "laws" && (<>{TapList(LAWS, lawsGot, tapLaws)}<p className="text-center text-xs text-white/60">{lawsGot.size} / {LAWS.length}</p>{HomeBtn}</>)}
        {mode === "justice" && (<>{TapList(JUSTICE, justGot, tapJust)}<p className="text-center text-xs text-white/60">{justGot.size} / {JUSTICE.length}</p>{HomeBtn}</>)}

        {/* Rights in Action */}
        {mode === "action" && ACTION_SCENES[actIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-5xl" aria-hidden>{ACTION_SCENES[actIdx].emoji}</span>
              <p className="font-display text-base font-bold text-white">{ACTION_SCENES[actIdx].situation}</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {ACTION_SCENES[actIdx].options.map((o, i) => (
                <button key={i} type="button" onClick={() => chooseAction(o.ok)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{o.text}</button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">{actIdx + 1} / {ACTION_SCENES.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Your Rights Toolkit + Ask Anything */}
        {mode === "toolkit" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {TOOLKIT_ASK.map((it, i) => (
                <button key={i} type="button" onClick={() => tapAsk(i)} className="glass-card flex flex-col gap-1.5 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={askGot.has(i) ? { boxShadow: `inset 0 0 0 2px ${it.help ? "#F59E0B" : "#7C3AED"}` } : undefined}>
                  <span className="flex items-center gap-2 text-sm font-bold text-white"><span aria-hidden>{it.help ? "🆘" : "💬"}</span> {it.q}</span>
                  {askGot.has(i) && <span className="text-sm font-medium text-white/85">{it.a}</span>}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">Educational, not legal advice — but always your right to ask.</p>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
