"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, Check } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { useProfile } from "@/lib/store";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import {
  STATUS_FACTS, STATUS_UN, STATUS_RE, STACK_BASE, STACK_OPEN, TALK_SCENES, TALK_MISS, TREAT,
  DIGNITY_ASK, BADGE_TARGET, SAM, type Fact,
} from "@/content/games/status-know-it";

type Mode = "home" | "knowStatus" | "stack" | "talk" | "treat" | "dignity";
const MODES: [Mode, string, string][] = [
  ["knowStatus", "🧪", "Know Your Status"],
  ["stack", "🧰", "The Prevention Stack"],
  ["talk", "💬", "Talk About It"],
  ["treat", "💊", "Treat & Thrive"],
  ["dignity", "💚", "Dignity & Ask"],
];

export function StatusKnowItGame({ onExit }: { onExit: () => void }) {
  const { profile } = useProfile();
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [statusGot, setStatusGot] = useState<Set<number>>(new Set());
  const [statusUnRe, setStatusUnRe] = useState(false);
  const [stackGot, setStackGot] = useState<Set<number>>(new Set());
  const [talkIdx, setTalkIdx] = useState(0);
  const [treatGot, setTreatGot] = useState<Set<number>>(new Set());
  const [askGot, setAskGot] = useState<Set<number>>(new Set());

  const stackList: Fact[] = useMemo(() => (profile.schoolComfort ? STACK_BASE : [...STACK_BASE, ...STACK_OPEN]), [profile.schoolComfort]);

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
    setBadges(new Set()); setStatusGot(new Set()); setStatusUnRe(false); setStackGot(new Set()); setTalkIdx(0);
    setTreatGot(new Set()); setAskGot(new Set()); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "knowStatus") { setStatusUnRe(false); say(SAM.knowStatus); }
    else if (m === "stack") say(SAM.stack);
    else if (m === "talk") { setTalkIdx(0); say(SAM.talk); }
    else if (m === "treat") say(SAM.treat);
    else if (m === "dignity") say(SAM.dignity);
    else say(SAM.home);
  };

  const tapStatus = (i: number) => {
    if (statusGot.has(i)) return;
    const next = new Set(statusGot); next.add(i);
    setStatusGot(next); say(STATUS_FACTS[i].say); celebrate("small");
    if (next.size >= STATUS_FACTS.length) window.setTimeout(() => setStatusUnRe(true), 200);
  };
  const tapList = (arr: Fact[], got: Set<number>, setGot: (s: Set<number>) => void, id: string) => (i: number) => {
    if (got.has(i)) return;
    const next = new Set(got); next.add(i);
    setGot(next); say(arr[i].say); celebrate("small");
    if (next.size >= arr.length) earn(id);
  };
  const tapStack = tapList(stackList, stackGot, setStackGot, "stack");
  const tapTreat = tapList(TREAT, treatGot, setTreatGot, "treat");

  const tapAsk = (i: number) => {
    if (askGot.has(i)) return;
    const next = new Set(askGot); next.add(i);
    setAskGot(next); say(DIGNITY_ASK[i].a); celebrate("small");
    if (next.size >= DIGNITY_ASK.length) earn("dignity");
  };

  const chooseTalk = (ok: boolean) => {
    if (!ok) { say(TALK_MISS); return; }
    celebrate("small");
    say(TALK_SCENES[talkIdx].result, () => { if (talkIdx + 1 >= TALK_SCENES.length) { earn("talk"); go("home"); } else setTalkIdx((i) => i + 1); });
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
        <button key={i} type="button" onClick={() => onTap(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={got.has(i) ? { boxShadow: "inset 0 0 0 2px #059669" } : undefined}>
          <span className="text-2xl" aria-hidden>{it.emoji}</span>
          <span className="flex-1 text-sm font-semibold text-white">{it.say}</span>
          {got.has(i) && <Check className="size-5 text-white" aria-hidden />}
        </button>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Status: Know It" tools={tools} onExit={onExit}>
        <GameDone gameId="status-know-it" stars={3} coins={30} title="Status: known! 🩺" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Status: Know It" tools={tools} onExit={onExit}>
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

        {/* Know Your Status — collect facts, then UN & RE */}
        {mode === "knowStatus" && (
          <>
            {!statusUnRe ? (
              <>{TapList(STATUS_FACTS, statusGot, tapStatus)}<p className="text-center text-xs text-white/60">{statusGot.size} / {STATUS_FACTS.length}</p></>
            ) : (
              <>
                <UnReBeat un={STATUS_UN} re={STATUS_RE} />
                <button type="button" onClick={() => { earn("knowStatus"); go("home"); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">Knowing is power</button>
              </>
            )}
            {HomeBtn}
          </>
        )}

        {mode === "stack" && (<>{TapList(stackList, stackGot, tapStack)}<p className="text-center text-xs text-white/60">{stackGot.size} / {stackList.length} · you choose & combine</p>{HomeBtn}</>)}
        {mode === "treat" && (<>{TapList(TREAT, treatGot, tapTreat)}<p className="text-center text-xs text-white/60">{treatGot.size} / {TREAT.length}</p>{HomeBtn}</>)}

        {/* Talk About It */}
        {mode === "talk" && TALK_SCENES[talkIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-5xl" aria-hidden>{TALK_SCENES[talkIdx].emoji}</span>
              <p className="font-display text-base font-bold text-white">{TALK_SCENES[talkIdx].situation}</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {TALK_SCENES[talkIdx].options.map((o, i) => (
                <button key={i} type="button" onClick={() => chooseTalk(o.ok)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{o.text}</button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">{talkIdx + 1} / {TALK_SCENES.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Dignity & Ask Anything */}
        {mode === "dignity" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {DIGNITY_ASK.map((it, i) => (
                <button key={i} type="button" onClick={() => tapAsk(i)} className="glass-card flex flex-col gap-1.5 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={askGot.has(i) ? { boxShadow: `inset 0 0 0 2px ${it.help ? "#F59E0B" : "#059669"}` } : undefined}>
                  <span className="flex items-center gap-2 text-sm font-bold text-white"><span aria-hidden>{it.help ? "🆘" : "💬"}</span> {it.q}</span>
                  {askGot.has(i) && <span className="text-sm font-medium text-white/85">{it.a}</span>}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">Private & anonymous — dignity for all.</p>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
