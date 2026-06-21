"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, Phone, Check } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { SCENARIOS, SAFE_MOVE, INFO, SECRETS, SECRET_UN, SECRET_RE, BADGE_TARGET, SAM } from "@/content/games/safety-squad";
import { TRUSTED, NET_TARGET, HELPLINE, TELL_RULE } from "@/content/games/my-body";

type Mode = "home" | "spot" | "move" | "private" | "secrets" | "squad";
const MISSIONS: [Mode, string, string][] = [
  ["spot", "🔍", "Spot the Unsafe"],
  ["move", "🛡️", "The Safe Move"],
  ["private", "🔒", "Keep It Private"],
  ["secrets", "🤫", "Good / Tell Secret"],
  ["squad", "💛", "My Safety Squad"],
];

export function SafetySquadGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [spotIdx, setSpotIdx] = useState(0);
  const [moveStep, setMoveStep] = useState(0);
  const [infoIdx, setInfoIdx] = useState(0);
  const [secretIdx, setSecretIdx] = useState(0);
  const [secretBeat, setSecretBeat] = useState(false);
  const [net, setNet] = useState<string[]>([]);

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
    setBadges(new Set()); setSpotIdx(0); setMoveStep(0); setInfoIdx(0); setSecretIdx(0); setSecretBeat(false); setNet([]);
    setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "spot") { setSpotIdx(0); say(SAM.spot); }
    else if (m === "move") { setMoveStep(0); say(SAM.move); }
    else if (m === "private") { setInfoIdx(0); say(SAM.private); }
    else if (m === "secrets") { setSecretIdx(0); setSecretBeat(false); say(SAM.secrets); }
    else if (m === "squad") say(SAM.squad);
    else say(SAM.home);
  };

  const spotJudge = (safe: boolean) => {
    const sc = SCENARIOS[spotIdx];
    if (!sc) return;
    const right = safe === sc.safe;
    if (right) celebrate("small");
    say(sc.safe ? SAM.safeUnsafe.safe : SAM.safeUnsafe.unsafe, () => {
      if (spotIdx + 1 >= SCENARIOS.length) { earn("spot"); go("home"); }
      else setSpotIdx((i) => i + 1);
    });
  };

  const tapMoveStep = (i: number) => {
    if (i !== moveStep) return;
    say(SAFE_MOVE[i].say);
    celebrate("small");
    if (i + 1 >= SAFE_MOVE.length) { say(SAM.moveDone, () => earn("move")); setMoveStep(SAFE_MOVE.length); }
    else setMoveStep(i + 1);
  };

  const sortInfo = (keep: boolean) => {
    const it = INFO[infoIdx];
    if (!it) return;
    if (keep === it.private) celebrate("small");
    say(it.private ? SAM.privateReveal.keep : SAM.privateReveal.share, () => {
      if (infoIdx + 1 >= INFO.length) { earn("private"); go("home"); }
      else setInfoIdx((i) => i + 1);
    });
  };

  const sortSecret = (tell: boolean) => {
    const s = SECRETS[secretIdx];
    if (!s) return;
    if (tell === s.tell) celebrate("small");
    if (s.tell) {
      setSecretBeat(true);
      say(SAM.secretReveal.tell);
    } else {
      say(SAM.secretReveal.good, () => advanceSecret());
    }
  };
  const advanceSecret = () => {
    setSecretBeat(false);
    if (secretIdx + 1 >= SECRETS.length) { earn("secrets"); go("home"); }
    else setSecretIdx((i) => i + 1);
  };

  const addTrusted = (id: string) => setNet((p) => { celebrate("small"); return [...p, id]; });
  const removeAt = (i: number) => setNet((p) => p.filter((_, k) => k !== i));

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
      <span className="glass-pill flex-1 rounded-2xl px-4 py-2.5 text-center text-base font-bold backdrop-blur-md backdrop-saturate-150" style={{ color: "var(--color-ink)" }}>{bubble}</span>
    </div>
  );
  const HomeBtn = (
    <button type="button" onClick={() => go("home")} className="glass-pill mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
      <Home className="size-5" aria-hidden /> Squad HQ
    </button>
  );
  const BadgeBook = (
    <div className="glass-card flex justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${badges.size} of ${BADGE_TARGET} badges`}>
      {MISSIONS.map(([id]) => (
        <span key={id} className={`text-2xl ${badges.has(id) ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{badges.has(id) ? "🦺" : "⚪"}</span>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Safety Squad" tools={tools} onExit={onExit}>
        <GameDone gameId="safety-squad" stars={3} coins={20} title="Safety Squad Hero! 🦺" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Safety Squad" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {BadgeBook}

        {mode === "home" && (
          <div className="grid grid-cols-2 gap-2.5">
            {MISSIONS.map(([m, emoji, label]) => (
              <button key={m} type="button" onClick={() => go(m)} className="glass-card flex flex-col items-center gap-1.5 rounded-2xl py-5 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.97]">
                <span className="text-4xl" aria-hidden>{emoji}</span>
                <span className="text-center text-sm font-bold text-foreground">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Spot the Unsafe */}
        {mode === "spot" && SCENARIOS[spotIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-4xl" aria-hidden>{SCENARIOS[spotIdx].emoji}</span>
              <p className="font-display text-lg font-bold text-foreground">{SCENARIOS[spotIdx].text}</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button type="button" onClick={() => spotJudge(true)} className="glass-card rounded-2xl py-4 text-base font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-95" style={{ boxShadow: "inset 0 0 0 2px #62e08f55" }}>✅ Safe</button>
              <button type="button" onClick={() => spotJudge(false)} className="glass-card rounded-2xl py-4 text-base font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-95" style={{ boxShadow: "inset 0 0 0 2px #ff908555" }}>🚫 Unsafe</button>
            </div>
            <p className="text-center text-xs text-foreground/60">{spotIdx + 1} / {SCENARIOS.length}</p>
            {HomeBtn}
          </>
        )}

        {/* The Safe Move — Say No · Get Away · Tell */}
        {mode === "move" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {SAFE_MOVE.map((s, i) => {
                const doneStep = i < moveStep;
                const active = i === moveStep;
                return (
                  <button key={i} type="button" disabled={!active} onClick={() => tapMoveStep(i)} className={`glass-card flex items-center gap-3 rounded-2xl px-4 py-4 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98] ${active ? "" : "opacity-50"}`} style={doneStep ? { boxShadow: "inset 0 0 0 2px #62e08f" } : undefined}>
                    <span className="text-3xl" aria-hidden>{s.emoji}</span>
                    <span className="flex-1 text-base font-bold text-foreground">{i + 1}. {s.label}</span>
                    {doneStep && <Check className="size-5 text-foreground" aria-hidden />}
                  </button>
                );
              })}
            </div>
            {HomeBtn}
          </>
        )}

        {/* Keep It Private */}
        {mode === "private" && INFO[infoIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-4xl" aria-hidden>{INFO[infoIdx].emoji}</span>
              <p className="font-display text-lg font-bold text-foreground">{INFO[infoIdx].label}</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button type="button" onClick={() => sortInfo(true)} className="glass-card flex flex-col items-center gap-1 rounded-2xl py-4 backdrop-blur-[12px] transition-transform active:scale-95">
                <span className="text-3xl" aria-hidden>🔒</span><span className="text-sm font-bold text-foreground">Private — vault</span>
              </button>
              <button type="button" onClick={() => sortInfo(false)} className="glass-card flex flex-col items-center gap-1 rounded-2xl py-4 backdrop-blur-[12px] transition-transform active:scale-95">
                <span className="text-3xl" aria-hidden>📢</span><span className="text-sm font-bold text-foreground">Okay to share</span>
              </button>
            </div>
            <p className="text-center text-xs text-foreground/60">{infoIdx + 1} / {INFO.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Good / Tell Secret (UN & RE on tell-secrets) */}
        {mode === "secrets" && SECRETS[secretIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-4xl" aria-hidden>{SECRETS[secretIdx].emoji}</span>
              <p className="font-display text-lg font-bold text-foreground">{SECRETS[secretIdx].text}</p>
            </div>
            {!secretBeat ? (
              <div className="grid grid-cols-2 gap-2.5">
                <button type="button" onClick={() => sortSecret(false)} className="glass-card rounded-2xl py-4 text-sm font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-95">🤫 Good secret (keep)</button>
                <button type="button" onClick={() => sortSecret(true)} className="glass-card rounded-2xl py-4 text-sm font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-95">🗣️ Tell-secret</button>
              </div>
            ) : (
              <>
                <UnReBeat un={SECRET_UN} re={SECRET_RE} />
                <button type="button" onClick={advanceSecret} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">Got it!</button>
              </>
            )}
            {HomeBtn}
          </>
        )}

        {/* My Safety Squad */}
        {mode === "squad" && (
          <>
            <p className="text-center text-sm font-semibold text-foreground/85">Your trusted grown-ups ({net.length}/{NET_TARGET}+)</p>
            {net.length > 0 && (
              <div className="glass-card flex flex-wrap justify-center gap-1.5 rounded-2xl p-3 backdrop-blur-[12px] backdrop-saturate-150">
                {net.map((id, i) => (
                  <button key={i} type="button" onClick={() => removeAt(i)} aria-label={`Remove ${TRUSTED.find((t) => t.id === id)?.name}`} className="text-3xl animate-in zoom-in transition-transform active:scale-90"><span aria-hidden>{TRUSTED.find((t) => t.id === id)?.emoji}</span></button>
                ))}
              </div>
            )}
            <p className="px-1 text-center text-xs text-foreground/75">Add anyone you trust — even two mums or two dads. 💛</p>
            <div className="grid grid-cols-4 gap-2">
              {TRUSTED.map((t) => (
                <button key={t.id} type="button" onClick={() => addTrusted(t.id)} className="glass-card flex flex-col items-center gap-0.5 rounded-2xl py-3 backdrop-blur-[12px] transition-transform active:scale-95">
                  <span className="text-2xl" aria-hidden>{t.emoji}</span><span className="text-[10px] font-bold leading-tight text-foreground">{t.name}</span>
                </button>
              ))}
            </div>
            <p className="px-1 text-center text-xs text-foreground/75">{TELL_RULE}</p>
            <button type="button" onClick={() => say(HELPLINE)} className="glass-pill flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-semibold backdrop-blur-md" style={{ color: "var(--color-ink)" }}>
              <Phone className="size-5 shrink-0" aria-hidden /> {HELPLINE}
            </button>
            <button type="button" disabled={net.length < NET_TARGET} onClick={() => earn("squad")} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95 disabled:opacity-50">
              That's my Safety Squad!
            </button>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
