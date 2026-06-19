"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, RotateCcw } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { useProfile } from "@/lib/store";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { WEEK, CRUSH_UN, CRUSH_RE, STOP_THINK_CHOOSE, START_TRUST, START_WELL, SAM, type Choice } from "@/content/games/crossroads";

type Phase = "intro" | "week" | "crush" | "debrief";
const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function CrossroadsGame({ onExit }: { onExit: () => void }) {
  const { profile } = useProfile();
  const [phase, setPhase] = useState<Phase>("intro");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [dayIdx, setDayIdx] = useState(0);
  const [trust, setTrust] = useState(START_TRUST);
  const [well, setWell] = useState(START_WELL);
  const [skills, setSkills] = useState<string[]>([]);

  const say = useCallback((t: string, onEnd?: () => void) => { setBubble(t); speak(t, { muted, onEnd }); }, [muted]);

  useEffect(() => {
    speak(SAM.greet, { muted });
    return () => stopSpeaking();
    // greet once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => {
    setPhase("intro"); setDayIdx(0); setTrust(START_TRUST); setWell(START_WELL); setSkills([]); setDone(false); say(SAM.greet);
  };

  const startWeek = () => { setPhase("week"); const c = WEEK[0]; say((profile.schoolComfort && c.situationSoft) ? c.situationSoft : c.situation); };

  const cross = WEEK[dayIdx];

  const advance = () => {
    if (dayIdx + 1 >= WEEK.length) {
      setPhase("debrief");
      say(SAM.debrief);
    } else {
      const next = WEEK[dayIdx + 1];
      setDayIdx((i) => i + 1);
      setPhase("week");
      say((profile.schoolComfort && next.situationSoft) ? next.situationSoft : next.situation);
    }
  };

  const choose = (c: Choice) => {
    setTrust((t) => clamp(t + c.trust));
    setWell((w) => clamp(w + c.well));
    if (c.wise) celebrate("small");
    if (c.skill) setSkills((s) => (s.includes(c.skill!) ? s : [...s, c.skill!]));
    if (cross.crushBeat) {
      // Crush Corner always plays the UN & RE beat after a choice.
      say(c.result, () => { setPhase("crush"); say(CRUSH_RE); });
    } else {
      say(c.result, () => advance());
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
  const Meter = (label: string, emoji: string, value: number, color: string) => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs font-bold text-white/80"><span>{emoji} {label}</span><span>{value}</span></div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
  const Meters = (
    <div className="glass-card flex flex-col gap-2.5 rounded-2xl p-3 backdrop-blur-[12px] backdrop-saturate-150">
      {Meter("Trust", "💙", trust, "linear-gradient(90deg,#38bdf8,#6366f1)")}
      {Meter("Wellbeing", "💛", well, "linear-gradient(90deg,#fbbf24,#34d399)")}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Crossroads" tools={tools} onExit={onExit}>
        <GameDone gameId="crossroads" stars={3} coins={25} title="A week well lived! 🔀" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Crossroads" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {phase !== "intro" && Meters}

        {phase === "intro" && (
          <button type="button" onClick={startWeek} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white text-lg font-bold text-slate-900 transition-transform active:scale-95">▶️ Start my week</button>
        )}

        {phase === "week" && cross && (
          <>
            <p className="text-center text-[11px] font-semibold uppercase tracking-wide text-white/55">{STOP_THINK_CHOOSE}</p>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-xs font-bold uppercase tracking-wide text-white/60">{cross.day}</span>
              <span className="text-5xl" aria-hidden>{cross.emoji}</span>
              <p className="font-display text-lg font-bold text-white">{(profile.schoolComfort && cross.situationSoft) ? cross.situationSoft : cross.situation}</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {cross.choices.map((c, i) => (
                <button key={i} type="button" onClick={() => choose(c)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{c.label}</button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">Day {dayIdx + 1} / {WEEK.length}</p>
          </>
        )}

        {/* Crush Corner — the UN & RE beat */}
        {phase === "crush" && (
          <>
            <UnReBeat un={CRUSH_UN} re={CRUSH_RE} />
            <button type="button" onClick={advance} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">Got it — feelings are okay</button>
          </>
        )}

        {/* End-of-week debrief */}
        {phase === "debrief" && (
          <>
            <div className="glass-card flex flex-col gap-2 rounded-2xl px-5 py-5 backdrop-blur-[12px] backdrop-saturate-150">
              <p className="font-display text-base font-bold text-white">🌟 Skills you used this week</p>
              {skills.length ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (<span key={s} className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white">{s}</span>))}
                </div>
              ) : (
                <p className="text-sm font-medium text-white/75">Try replaying for the wiser, kinder paths — your meters will thank you!</p>
              )}
              <p className="mt-1 text-sm font-medium text-white/80">Trust {trust} · Wellbeing {well}. There's no single right answer — replaying to try other paths is the point.</p>
            </div>
            <button type="button" onClick={() => { celebrate("big"); say(SAM.complete, () => setDone(true)); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">Finish the week</button>
            <button type="button" onClick={reset} className="glass-pill flex h-11 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold backdrop-blur-md transition-transform active:scale-95"><RotateCcw className="size-4" aria-hidden /> Replay the week</button>
          </>
        )}
      </div>
    </GameShell>
  );
}
