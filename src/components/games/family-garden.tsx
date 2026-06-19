"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, Home } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { speak, stopSpeaking } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { MEMBERS, FLOWERS, GARDEN_TARGET, CARE_SCENES, FRIEND_ACTS, KIND_ACTS, LOVES, SAM, type Act } from "@/content/games/family-garden";

type Mode = "home" | "family" | "care" | "friends" | "garden" | "love";

export function FamilyGardenGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState<string>(SAM.greet);
  const [done, setDone] = useState(false);
  const [blooms, setBlooms] = useState(0);
  const [family, setFamily] = useState<Set<string>>(new Set());
  const [careIdx, setCareIdx] = useState(0);

  const say = useCallback((t: string) => { setBubble(t); if (!muted) speak(t); }, [muted]);

  useEffect(() => {
    if (!muted) speak(SAM.greet);
    return () => stopSpeaking();
    // greet once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bloom = useCallback(() => {
    setBlooms((b) => {
      const n = b + 1;
      celebrate("small");
      if (n >= GARDEN_TARGET) {
        window.setTimeout(() => { say(SAM.complete); setDone(true); }, 1000);
      }
      return Math.min(n, GARDEN_TARGET);
    });
  }, [say]);

  const reset = () => {
    setBlooms(0);
    setFamily(new Set());
    setCareIdx(0);
    setDone(false);
    setMode("home");
    say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "family") say(SAM.family);
    else if (m === "care") { setCareIdx(0); say(SAM.care); }
    else if (m === "friends") say(SAM.friends);
    else if (m === "garden") say(SAM.garden);
    else if (m === "love") say(SAM.love);
    else say(SAM.home);
  };

  const toggleMember = (id: string) => {
    setFamily((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else { next.add(id); celebrate("small"); }
      if (next.size === 3) window.setTimeout(() => say(SAM.familyDone), 200);
      return next;
    });
  };

  const tapCare = (caring: boolean) => {
    const scene = CARE_SCENES[careIdx];
    if (!scene) return;
    if (caring) {
      say(scene.sam);
      bloom();
      window.setTimeout(() => {
        if (careIdx + 1 >= CARE_SCENES.length) go("home");
        else { setCareIdx((i) => i + 1); say(SAM.care); }
      }, 1700);
    } else {
      const kind = scene.options.find((o) => o.caring);
      say(`The caring thing is to ${kind?.label.toLowerCase()}.`);
    }
  };

  const doAct = (a: Act) => { say(a.sam); bloom(); };

  const muteBtn = (
    <button type="button" aria-label={muted ? "Turn sound on" : "Turn sound off"} onClick={() => setMuted((m) => { const n = !m; if (n) stopSpeaking(); return n; })} className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
      {muted ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
    </button>
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

  const Garden = (
    <div className="glass-card grid grid-cols-4 gap-2 rounded-2xl p-3 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${blooms} of ${GARDEN_TARGET} flowers bloomed`}>
      {Array.from({ length: GARDEN_TARGET }).map((_, i) => (
        <span key={i} className={`flex items-center justify-center text-3xl ${i < blooms ? "animate-in zoom-in duration-300" : "opacity-50"}`} aria-hidden>
          {i < blooms ? FLOWERS[i % FLOWERS.length] : "🌱"}
        </span>
      ))}
    </div>
  );

  const ActButtons = (acts: Act[]) => (
    <div className="grid grid-cols-1 gap-2.5">
      {acts.map((a) => (
        <button key={a.label} type="button" onClick={() => doAct(a)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.98]">
          <span className="text-3xl" aria-hidden>{a.emoji}</span>
          <span className="flex-1 text-base font-semibold text-white">{a.label}</span>
        </button>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="My Family Garden" tools={muteBtn} onExit={onExit}>
        <GameDone gameId="family-garden" stars={3} coins={15} title="Your Kindness Garden! 🌸" blurb="Every family is special, and kindness makes the world beautiful. 💛" onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="My Family Garden" tools={muteBtn} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}

        {/* ---- Home ---- */}
        {mode === "home" && (
          <>
            {Garden}
            <div className="grid grid-cols-2 gap-2.5">
              {([
                ["family", "👨‍👩‍👧", "My Family"],
                ["care", "🏠", "Families Care"],
                ["friends", "🧑‍🤝‍🧑", "Friends"],
                ["garden", "🌷", "Kindness Garden"],
                ["love", "💛", "Kinds of Love"],
              ] as [Mode, string, string][]).map(([m, emoji, label]) => (
                <button key={m} type="button" onClick={() => go(m)} className="glass-card flex flex-col items-center gap-1.5 rounded-2xl py-5 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.97]">
                  <span className="text-4xl" aria-hidden>{emoji}</span>
                  <span className="text-sm font-bold text-white">{label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ---- Make My Family ---- */}
        {mode === "family" && (
          <>
            {family.size > 0 && (
              <div className="glass-card flex flex-wrap justify-center gap-2 rounded-2xl p-3 backdrop-blur-[12px] backdrop-saturate-150">
                {[...family].map((id) => (
                  <span key={id} className="text-3xl animate-in zoom-in" aria-hidden>{MEMBERS.find((m) => m.id === id)?.emoji}</span>
                ))}
              </div>
            )}
            <div className="grid grid-cols-4 gap-2">
              {MEMBERS.map((m) => {
                const on = family.has(m.id);
                return (
                  <button key={m.id} type="button" onClick={() => toggleMember(m.id)} aria-pressed={on} className="glass-card flex flex-col items-center gap-0.5 rounded-2xl py-3 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-95" style={on ? { boxShadow: "inset 0 0 0 2px #EC4899" } : undefined}>
                    <span className="text-2xl" aria-hidden>{m.emoji}</span>
                    <span className="text-[10px] font-bold leading-tight text-white">{m.name}</span>
                  </button>
                );
              })}
            </div>
            {HomeBtn}
          </>
        )}

        {/* ---- Families Love & Care ---- */}
        {mode === "care" && CARE_SCENES[careIdx] && (
          <>
            <div className="glass-card rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <p className="font-display text-lg font-bold text-white">{CARE_SCENES[careIdx].text}</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {CARE_SCENES[careIdx].options.map((o) => (
                <button key={o.label} type="button" onClick={() => tapCare(o.caring)} className="glass-card flex flex-col items-center gap-1 rounded-2xl py-4 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-95">
                  <span className="text-3xl" aria-hidden>{o.emoji}</span>
                  <span className="text-xs font-bold text-white">{o.label}</span>
                </button>
              ))}
            </div>
            {HomeBtn}
          </>
        )}

        {/* ---- Friends Forever ---- */}
        {mode === "friends" && (<>{ActButtons(FRIEND_ACTS)}{HomeBtn}</>)}

        {/* ---- Kindness Garden ---- */}
        {mode === "garden" && (
          <>
            {Garden}
            {ActButtons(KIND_ACTS)}
            {HomeBtn}
          </>
        )}

        {/* ---- Kinds of Love ---- */}
        {mode === "love" && (<>{ActButtons(LOVES)}{HomeBtn}</>)}
      </div>
    </GameShell>
  );
}
