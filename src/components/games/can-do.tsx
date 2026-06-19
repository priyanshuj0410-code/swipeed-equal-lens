"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Check, Sparkles } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { AVATARS, ROLES, MYTHS, FEELINGS, ROLE_ROUNDS, type Avatar, type Role } from "@/content/games/can-do";
import { speak, stopSpeaking } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";

const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

export function CanDoGame({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<"pick" | "roles" | "feelings">("pick");
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [round, setRound] = useState(0);
  const [spin, setSpin] = useState<"ready" | "spinning" | "monster" | "busted">("ready");
  const [role, setRole] = useState<Role | null>(null);
  const [display, setDisplay] = useState<Role>(ROLES[0]);
  const [myth, setMyth] = useState("");
  const [bubble, setBubble] = useState<string | null>(null);
  const [feelTapped, setFeelTapped] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(false);
  const spinTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const say = useCallback((t: string) => { if (!muted) speak(t); }, [muted]);

  useEffect(
    () => () => {
      if (spinTimer.current) clearInterval(spinTimer.current);
      stopSpeaking();
    },
    []
  );

  const reset = () => {
    if (spinTimer.current) clearInterval(spinTimer.current);
    setPhase("pick");
    setAvatar(null);
    setRound(0);
    setSpin("ready");
    setRole(null);
    setMyth("");
    setBubble(null);
    setFeelTapped(new Set());
    setDone(false);
  };

  const pickAvatar = (a: Avatar) => {
    setAvatar(a);
    setPhase("roles");
    say(`I am ${a.name}! Spin the wheel.`);
  };

  const doSpin = () => {
    if (spin !== "ready") return;
    setSpin("spinning");
    say("Spinning!");
    let i = 0;
    spinTimer.current = setInterval(() => {
      i += 1;
      setDisplay(ROLES[i % ROLES.length]);
    }, 80);
    window.setTimeout(() => {
      if (spinTimer.current) clearInterval(spinTimer.current);
      const r = pick(ROLES);
      setRole(r);
      setDisplay(r);
      setSpin("monster");
      setMyth(pick(MYTHS));
      say(`${avatar?.name} is a ${r.name}!`);
      try {
        navigator.vibrate?.(12);
      } catch {
        /* unsupported */
      }
    }, 1150);
  };

  const bustMonster = () => {
    if (spin !== "monster" || !role) return;
    setSpin("busted");
    setBubble(role.bust);
    say(role.bust);
    celebrate("small");
    try {
      navigator.vibrate?.(10);
    } catch {
      /* unsupported */
    }
    window.setTimeout(() => {
      setBubble(null);
      const nextRound = round + 1;
      if (nextRound >= ROLE_ROUNDS) {
        setPhase("feelings");
        say("Everyone feels lots of feelings.");
      } else {
        setRound(nextRound);
        setRole(null);
        setSpin("ready");
      }
    }, 1600);
  };

  const tapFeel = (i: number) => {
    if (feelTapped.has(i)) return;
    const f = FEELINGS[i];
    const next = new Set(feelTapped);
    next.add(i);
    setFeelTapped(next);
    setBubble(f.line);
    say(f.line);
    celebrate("small");
    window.setTimeout(() => setBubble((b) => (b === f.line ? null : b)), 1600);
    if (next.size >= FEELINGS.length) {
      window.setTimeout(() => {
        setBubble(null);
        setDone(true);
      }, 900);
    }
  };

  const muteBtn = (
    <button
      type="button"
      aria-label={muted ? "Turn sound on" : "Turn sound off"}
      onClick={() =>
        setMuted((m) => {
          const n = !m;
          if (n) stopSpeaking();
          return n;
        })
      }
      className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95"
    >
      {muted ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
    </button>
  );

  if (done) {
    return (
      <GameShell title="Can-Do Kids" tools={muteBtn} onExit={onExit}>
        <GameDone
          gameId="can-do"
          stars={3}
          coins={15}
          title="Anyone can do anything!"
          blurb="No job or feeling is only for one kind of kid. ✨"
          onReplay={reset}
          onExit={onExit}
        />
      </GameShell>
    );
  }

  // ---- speech bubble (shared across phases) ----
  const Bubble = (
    <div className="flex min-h-12 items-end">
      {bubble && (
        <span className="glass-pill animate-in fade-in zoom-in rounded-2xl px-4 py-2 text-center text-sm font-bold backdrop-blur-md backdrop-saturate-150 duration-200">
          {bubble}
        </span>
      )}
    </div>
  );

  if (phase === "pick") {
    return (
      <GameShell title="Can-Do Kids" tools={muteBtn} onExit={onExit}>
        <div className="flex w-full max-w-sm flex-col items-center gap-5">
          <span className="glass-pill rounded-full px-4 py-2 text-base font-bold backdrop-blur-md backdrop-saturate-150">
            Pick a friend to play! 🫶
          </span>
          <div className="grid w-full grid-cols-3 gap-3">
            {AVATARS.map((a) => (
              <button
                key={a.name}
                type="button"
                onClick={() => pickAvatar(a)}
                className="glass-card flex flex-col items-center gap-1 px-2 py-4 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-95"
              >
                <span className="text-5xl" aria-hidden>
                  {a.emoji}
                </span>
                <span className="text-xs font-bold text-white">{a.name}</span>
              </button>
            ))}
          </div>
        </div>
      </GameShell>
    );
  }

  if (phase === "feelings") {
    return (
      <GameShell title="Can-Do Kids" tools={muteBtn} onExit={onExit}>
        <div className="flex w-full max-w-sm flex-col items-center gap-4">
          {Bubble}
          <button
            type="button"
            onClick={() => say("Everyone feels lots of feelings.")}
            className="glass-pill rounded-full px-4 py-2 text-base font-bold backdrop-blur-md backdrop-saturate-150"
          >
            Everyone has feelings 💛
          </button>
          <div className="grid w-full grid-cols-1 gap-2.5">
            {FEELINGS.map((f, i) => {
              const isTapped = feelTapped.has(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => tapFeel(i)}
                  disabled={isTapped}
                  className={`glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.98] ${
                    isTapped ? "opacity-80 ring-2 ring-white/60" : ""
                  }`}
                >
                  <span className="text-3xl" aria-hidden>
                    {f.emoji}
                  </span>
                  <span className="flex-1 text-base font-semibold text-white">{f.line}</span>
                  {isTapped && <Check className="size-5 text-white" aria-hidden />}
                </button>
              );
            })}
          </div>
        </div>
      </GameShell>
    );
  }

  // ---- phase: roles (spin the wheel + bust the myth-monster) ----
  return (
    <GameShell title="Can-Do Kids" progress={{ current: round + 1, total: ROLE_ROUNDS }} tools={muteBtn} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        {Bubble}

        {/* avatar becoming the role */}
        <div className="glass-card flex w-full flex-col items-center gap-2 px-5 py-6 backdrop-blur-[12px] backdrop-saturate-150">
          <div className="flex items-center gap-2 text-6xl" aria-hidden>
            <span>{avatar?.emoji}</span>
            {(spin === "spinning" || role) && <span className="text-3xl text-white/70">→</span>}
            {(spin === "spinning" || role) && (
              <span className={spin === "spinning" ? "animate-pulse" : ""}>{display.emoji}</span>
            )}
          </div>
          <p className="text-center font-display text-xl font-bold text-white">
            {spin === "ready" && `${avatar?.name}, what will you be?`}
            {spin === "spinning" && "Spinning…"}
            {(spin === "monster" || spin === "busted") && role && `${avatar?.name} is a ${role.name}!`}
          </p>
        </div>

        {/* the control: spin button, or the myth-monster to bust */}
        {spin === "ready" && (
          <button
            type="button"
            onClick={doSpin}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white text-lg font-extrabold text-slate-900 transition-transform active:scale-95"
          >
            <Sparkles className="size-5" aria-hidden /> Spin the wheel!
          </button>
        )}

        {spin === "spinning" && (
          <div className="grid w-full grid-cols-5 gap-2 opacity-80">
            {ROLES.slice(0, 5).map((r) => (
              <span key={r.name} className="glass-pill flex items-center justify-center rounded-xl py-2 text-2xl" aria-hidden>
                {r.emoji}
              </span>
            ))}
          </div>
        )}

        {spin === "monster" && (
          <div className="flex w-full flex-col items-center gap-3">
            <span className="glass-pill rounded-full px-4 py-2 text-center text-sm font-bold text-white backdrop-blur-md backdrop-saturate-150">
              A myth-monster says: “{myth}”
            </span>
            <button
              type="button"
              onClick={bustMonster}
              aria-label="Bust the myth"
              className="flex size-28 items-center justify-center rounded-full bg-white/15 text-7xl ring-4 ring-white/50 transition-transform hover:scale-105 active:scale-90"
            >
              <span aria-hidden>👹</span>
            </button>
            <span className="text-xs font-semibold text-white/90">Tap to bust the myth! 💥</span>
          </div>
        )}
      </div>
    </GameShell>
  );
}
