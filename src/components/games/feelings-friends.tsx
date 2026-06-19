"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Home, Wind } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { speak, stopSpeaking } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { Sam } from "@/components/games/sam";
import { FEELINGS, FEELING_BY_ID, SCENES, BIG_NO, CALM_STEPS, CALM_CYCLES, SAM, type Scene } from "@/content/games/feelings-friends";

type Mode = "checkin" | "home" | "meet" | "match" | "mirror" | "no" | "calm" | "family";
const shuffle = <T,>(a: T[]) => a.map((v) => [Math.random(), v] as const).sort((x, y) => x[0] - y[0]).map(([, v]) => v);

export function FeelingsFriendsGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("checkin");
  const [muted, setMuted] = useState(false);
  const [collected, setCollected] = useState<Set<string>>(new Set());
  const [bubble, setBubble] = useState<string>(SAM.greet);
  const [done, setDone] = useState(false);
  // match
  const [matchScenes, setMatchScenes] = useState<Scene[]>([]);
  const [matchIdx, setMatchIdx] = useState(0);
  // calm
  const [calmPhase, setCalmPhase] = useState<"idle" | "in" | "out">("idle");
  const calmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const say = useCallback(
    (t: string) => {
      setBubble(t);
      if (!muted) speak(t);
    },
    [muted]
  );

  useEffect(() => {
    if (!muted) speak(SAM.greet);
    return () => {
      if (calmTimer.current) clearTimeout(calmTimer.current);
      stopSpeaking();
    };
    // greet once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const collect = useCallback((id: string) => {
    setCollected((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      celebrate("small");
      if (next.size >= FEELINGS.length) {
        window.setTimeout(() => {
          say(SAM.familyComplete);
          setDone(true);
        }, 900);
      }
      return next;
    });
  }, [say]);

  const reset = () => {
    if (calmTimer.current) clearTimeout(calmTimer.current);
    setCollected(new Set());
    setMatchScenes([]);
    setMatchIdx(0);
    setCalmPhase("idle");
    setDone(false);
    setMode("checkin");
    say(SAM.greet);
  };

  const go = (m: Mode) => {
    if (calmTimer.current) clearTimeout(calmTimer.current);
    setCalmPhase("idle");
    setMode(m);
    if (m === "meet") say(SAM.meet);
    else if (m === "mirror") say(SAM.mirror);
    else if (m === "no") say(SAM.bigNo);
    else if (m === "match") {
      setMatchScenes(shuffle(SCENES).slice(0, 5));
      setMatchIdx(0);
      say(SAM.match);
    } else if (m === "calm") startCalm();
    else if (m === "home") say("What shall we play?");
  };

  // ---- Calm Corner: smell the flower (in) / blow the candle (out), CALM_CYCLES times ----
  const startCalm = () => {
    say(SAM.calm);
    let cycle = 0;
    const stepIn = () => {
      setCalmPhase("in");
      say(CALM_STEPS[0].say);
      calmTimer.current = setTimeout(stepOut, CALM_STEPS[0].ms);
    };
    const stepOut = () => {
      setCalmPhase("out");
      say(CALM_STEPS[1].say);
      calmTimer.current = setTimeout(() => {
        cycle += 1;
        if (cycle >= CALM_CYCLES) {
          setCalmPhase("idle");
          say("Ahh… all calm. Well done. 🌿");
          collect("calm");
        } else stepIn();
      }, CALM_STEPS[1].ms);
    };
    calmTimer.current = setTimeout(stepIn, 700);
  };

  // ---- Match: warm response for any tap; the fitting feeling advances ----
  const tapMatch = (feelingId: string) => {
    const scene = matchScenes[matchIdx];
    if (!scene) return;
    const f = FEELING_BY_ID[feelingId];
    if (feelingId === scene.answer) {
      say(`${f.name}. ${f.sam}`);
      collect(feelingId);
      window.setTimeout(() => {
        if (matchIdx + 1 >= matchScenes.length) {
          say("You matched so many feelings! 💛");
          window.setTimeout(() => go("home"), 1400);
        } else {
          setMatchIdx((i) => i + 1);
          say(SAM.match);
        }
      }, 1500);
    } else {
      // gentle nudge — never "wrong"
      say(`Maybe. When this happens, you might feel ${FEELING_BY_ID[scene.answer].name.toLowerCase()}.`);
    }
  };

  const muteBtn = (
    <button
      type="button"
      aria-label={muted ? "Turn sound on" : "Turn sound off"}
      onClick={() => setMuted((m) => { const n = !m; if (n) stopSpeaking(); return n; })}
      className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95"
    >
      {muted ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
    </button>
  );

  // Sam header with his spoken line shown as text (audio-first, but readable for the grown-up)
  const SamSays = (
    <div className="flex items-center gap-3">
      <Sam size={64} />
      <span className="glass-pill flex-1 rounded-2xl px-4 py-2.5 text-center text-base font-bold backdrop-blur-md backdrop-saturate-150" style={{ color: "#eef1f7" }}>
        {bubble}
      </span>
    </div>
  );

  const HomeBtn = (
    <button
      type="button"
      onClick={() => go("home")}
      className="glass-pill mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95"
    >
      <Home className="size-5" aria-hidden /> Home
    </button>
  );

  if (done) {
    return (
      <GameShell title="Feelings Friends" tools={muteBtn} onExit={onExit}>
        <GameDone
          gameId="feelings"
          stars={3}
          coins={15}
          title="Your Feelings Family! 🎉"
          blurb="You met every feeling — and every feeling is okay. 💛"
          onReplay={reset}
          onExit={onExit}
        />
      </GameShell>
    );
  }

  const FEEL_GRID = (onTap: (id: string) => void, dim = false) => (
    <div className="grid w-full grid-cols-3 gap-2.5">
      {FEELINGS.map((f) => {
        const has = collected.has(f.id);
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onTap(f.id)}
            className="glass-card flex flex-col items-center gap-1 rounded-2xl px-2 py-3 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-95"
            style={{ boxShadow: `inset 0 0 0 2px ${f.color}66`, opacity: dim && !has ? 0.55 : 1 }}
          >
            <span className="text-4xl" aria-hidden>{f.emoji}</span>
            <span className="text-xs font-bold text-white">{f.name}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <GameShell title="Feelings Friends" tools={muteBtn} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}

        {/* ---- Check-in: "How do you feel today?" ---- */}
        {mode === "checkin" &&
          FEEL_GRID((id) => {
            collect(id);
            const f = FEELING_BY_ID[id];
            say(`${f.sam} ${SAM.checkInThanks}`);
            window.setTimeout(() => go("home"), 1500);
          })}

        {/* ---- Home: the five modes ---- */}
        {mode === "home" && (
          <div className="grid grid-cols-2 gap-2.5">
            {([
              ["meet", "🤝", "Meet"],
              ["match", "🎯", "Match"],
              ["mirror", "🪞", "Mirror Me"],
              ["no", "✋", "The Big No"],
              ["calm", "🌸", "Calm Corner"],
              ["family", "💛", "My Family"],
            ] as [Mode, string, string][]).map(([m, emoji, label]) => (
              <button
                key={m}
                type="button"
                onClick={() => go(m)}
                className="glass-card flex flex-col items-center gap-1.5 rounded-2xl py-5 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.97]"
              >
                <span className="text-4xl" aria-hidden>{emoji}</span>
                <span className="text-sm font-bold text-white">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* ---- Meet the Feelings Friends ---- */}
        {mode === "meet" && (
          <>
            {FEEL_GRID((id) => { collect(id); say(`${FEELING_BY_ID[id].name}. ${FEELING_BY_ID[id].sam}`); })}
            {HomeBtn}
          </>
        )}

        {/* ---- Match the Feeling ---- */}
        {mode === "match" && matchScenes[matchIdx] && (
          <>
            <div className="glass-card rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <p className="font-display text-xl font-bold text-white">{matchScenes[matchIdx].text}</p>
            </div>
            {FEEL_GRID(tapMatch)}
            {HomeBtn}
          </>
        )}

        {/* ---- Mirror Me (pick-a-face) ---- */}
        {mode === "mirror" && (
          <>
            {FEEL_GRID((id) => { collect(id); say(`${FEELING_BY_ID[id].sam} Thank you for telling me. 💛`); })}
            {HomeBtn}
          </>
        )}

        {/* ---- The Big No ---- */}
        {mode === "no" && (
          <>
            <div className="grid grid-cols-2 gap-2.5">
              {BIG_NO.map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => { say(b.sam); celebrate("small"); try { navigator.vibrate?.(14); } catch { /* unsupported */ } }}
                  className="flex flex-col items-center justify-center gap-1 rounded-3xl py-7 text-white ring-4 ring-white/40 transition-transform active:scale-90"
                  style={{ background: b.accent }}
                >
                  <span className="text-4xl" aria-hidden>{b.emoji}</span>
                  <span className="text-lg font-extrabold">{b.label}</span>
                </button>
              ))}
            </div>
            {HomeBtn}
          </>
        )}

        {/* ---- Calm Corner ---- */}
        {mode === "calm" && (
          <>
            <div className="glass-card flex flex-col items-center gap-4 rounded-2xl px-5 py-8 backdrop-blur-[12px] backdrop-saturate-150">
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 120,
                  height: 120,
                  background: "radial-gradient(circle, rgba(98,184,75,0.45), rgba(98,184,75,0.12))",
                  transform: `scale(${calmPhase === "in" ? 1.35 : calmPhase === "out" ? 0.7 : 1})`,
                  transition: `transform ${CALM_STEPS[0].ms}ms ease-in-out`,
                }}
                aria-hidden
              >
                <span className="text-5xl">{calmPhase === "out" ? "🕯️" : "🌸"}</span>
              </div>
              <p className="flex items-center gap-2 font-display text-lg font-bold text-white">
                <Wind className="size-5" aria-hidden />
                {calmPhase === "in" ? "Smell the flower…" : calmPhase === "out" ? "Blow the candle…" : "Breathe with Sam"}
              </p>
            </div>
            <button
              type="button"
              onClick={startCalm}
              className="glass-pill flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95"
            >
              Breathe again
            </button>
            {HomeBtn}
          </>
        )}

        {/* ---- My Feelings Family (album) ---- */}
        {mode === "family" && (
          <>
            <p className="text-center text-sm font-semibold text-white/85">
              {collected.size}/{FEELINGS.length} friends met
            </p>
            {FEEL_GRID((id) => { collect(id); say(`${FEELING_BY_ID[id].name}. ${FEELING_BY_ID[id].sam}`); }, true)}
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
