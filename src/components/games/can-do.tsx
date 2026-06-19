"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, Sparkles } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { MakeAKid } from "@/components/games/make-a-kid";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { ROLES, BADGE_TARGET, MYTHS, FEELINGS_ALL, PLAY_ALL, SAM, type Role, type Line } from "@/content/games/can-do";

type Mode = "home" | "be" | "myth" | "feelings" | "play" | "make";
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

export function CanDoGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [badges, setBadges] = useState<string[]>([]); // role ids tried → the Can-Do Badge Book
  const [done, setDone] = useState(false);
  // be (role wheel)
  const [spin, setSpin] = useState<"ready" | "spinning" | "landed">("ready");
  const [role, setRole] = useState<Role | null>(null);
  const [display, setDisplay] = useState<Role>(ROLES[0]);
  const spinTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  // myth
  const [myth, setMyth] = useState<string>(MYTHS[0]);
  const [popped, setPopped] = useState(false);

  const say = useCallback((t: string, onEnd?: () => void) => { setBubble(t); speak(t, { muted, onEnd }); }, [muted]);

  useEffect(() => {
    speak(SAM.greet, { muted });
    return () => { if (spinTimer.current) clearInterval(spinTimer.current); stopSpeaking(); };
    // greet once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const earnBadge = (id: string) => {
    setBadges((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      if (next.length >= BADGE_TARGET) window.setTimeout(() => { say(SAM.complete, () => setDone(true)); }, 1200);
      return next;
    });
  };

  const reset = () => {
    if (spinTimer.current) clearInterval(spinTimer.current);
    setBadges([]); setSpin("ready"); setRole(null); setPopped(false); setDone(false); setMode("home");
    say(SAM.greet);
  };

  const go = (m: Mode) => {
    if (spinTimer.current) clearInterval(spinTimer.current);
    setMode(m);
    if (m === "be") { setSpin("ready"); setRole(null); say(SAM.be); }
    else if (m === "myth") { setMyth(pick(MYTHS)); setPopped(false); say(SAM.myth); }
    else if (m === "feelings") say(SAM.feelings);
    else if (m === "play") say(SAM.play);
    else if (m === "make") say(SAM.make);
    else say(SAM.home);
  };

  const doSpin = () => {
    if (spin === "spinning") return;
    setSpin("spinning");
    let i = 0;
    spinTimer.current = setInterval(() => { i += 1; setDisplay(ROLES[i % ROLES.length]); }, 80);
    window.setTimeout(() => {
      if (spinTimer.current) clearInterval(spinTimer.current);
      const r = pick(ROLES);
      setRole(r); setDisplay(r); setSpin("landed");
      celebrate("small");
      say(`Anyone can be a ${r.name}! ${r.job}`);
      earnBadge(r.id);
    }, 1100);
  };

  const popMyth = () => {
    if (popped) return;
    setPopped(true);
    celebrate("small");
    say(SAM.mythPop, () => { setMyth(pick(MYTHS)); setPopped(false); });
  };

  const tapLine = (l: Line) => { say(l.say); celebrate("small"); };

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
    <div className="glass-card flex justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${badges.length} of ${BADGE_TARGET} badges`}>
      {Array.from({ length: BADGE_TARGET }).map((_, i) => {
        const r = badges[i] ? ROLES.find((x) => x.id === badges[i]) : null;
        return <span key={i} className={`text-2xl ${r ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{r ? r.emoji : "🏅"}</span>;
      })}
    </div>
  );

  const Lines = (lines: Line[]) => (
    <div className="grid grid-cols-1 gap-2.5">
      {lines.map((l, i) => (
        <button key={i} type="button" onClick={() => tapLine(l)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.98]">
          <span className="text-3xl" aria-hidden>{l.emoji}</span>
          <span className="flex-1 text-base font-semibold text-white">{l.say}</span>
        </button>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Can-Do Kids" tools={tools} onExit={onExit}>
        <GameDone gameId="can-do" stars={3} coins={15} title="Anyone can — and so can YOU! 🌟" blurb="Any job, any feeling, any kind of play — for everyone." onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  if (mode === "make") {
    return (
      <GameShell title="Can-Do Kids" tools={tools} onExit={onExit}>
        <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
          {SamSays}
          <MakeAKid ctaLabel="Add to my Badge Book" onAdd={(cando) => { earnBadge(`make-${badges.length}`); say(`So can YOU! They can ${cando}`, () => setMode("home")); }} />
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell title="Can-Do Kids" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {BadgeBook}

        {mode === "home" && (
          <div className="grid grid-cols-2 gap-2.5">
            {([
              ["be", "🎡", "Be Anything"],
              ["myth", "👹", "Bust the Myth"],
              ["feelings", "💛", "Feelings for All"],
              ["play", "🧸", "Toys & Chores"],
              ["make", "✨", "Make-a-Kid"],
            ] as [Mode, string, string][]).map(([m, emoji, label]) => (
              <button key={m} type="button" onClick={() => go(m)} className="glass-card flex flex-col items-center gap-1.5 rounded-2xl py-5 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.97]">
                <span className="text-4xl" aria-hidden>{emoji}</span>
                <span className="text-sm font-bold text-white">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* ---- Today I Want to Be… (role wheel) ---- */}
        {mode === "be" && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-7 backdrop-blur-[12px] backdrop-saturate-150">
              <span className={`text-7xl ${spin === "spinning" ? "animate-pulse" : spin === "landed" ? "animate-in zoom-in" : ""}`} aria-hidden>{display.emoji}</span>
              <p className="font-display text-xl font-bold text-white">
                {spin === "ready" && "What will you be?"}
                {spin === "spinning" && "Spinning…"}
                {spin === "landed" && role && `Anyone can be a ${role.name}!`}
              </p>
              {spin === "landed" && role && <p className="text-sm text-white/85">{role.job}</p>}
            </div>
            <button type="button" onClick={doSpin} disabled={spin === "spinning"} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white text-lg font-extrabold text-slate-900 transition-transform active:scale-95 disabled:opacity-60">
              <Sparkles className="size-5" aria-hidden /> {spin === "landed" ? "Spin again!" : "Spin the wheel!"}
            </button>
            {HomeBtn}
          </>
        )}

        {/* ---- Bust the Myth Monster ---- */}
        {mode === "myth" && (
          <>
            <div className="glass-card flex flex-col items-center gap-3 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              {!popped ? (
                <>
                  <button type="button" onClick={popMyth} aria-label="Pop the myth" className="text-7xl transition-transform hover:scale-105 active:scale-90" >
                    <span aria-hidden>👹</span>
                  </button>
                  <p className="font-display text-lg font-bold" style={{ color: "#ff9085" }}>“{myth}”</p>
                  <p className="text-xs font-semibold text-white/90">Tap the monster to pop it! 💥</p>
                </>
              ) : (
                <>
                  <span className="text-7xl animate-in zoom-in" aria-hidden>🎉</span>
                  <p className="font-display text-xl font-bold" style={{ color: "#62e08f" }}>Anyone can!</p>
                </>
              )}
            </div>
            {HomeBtn}
          </>
        )}

        {/* ---- Big Feelings for Everyone ---- */}
        {mode === "feelings" && (<>{Lines(FEELINGS_ALL)}{HomeBtn}</>)}

        {/* ---- Toys, Colours & Chores for All ---- */}
        {mode === "play" && (<>{Lines(PLAY_ALL)}{HomeBtn}</>)}
      </div>
    </GameShell>
  );
}
