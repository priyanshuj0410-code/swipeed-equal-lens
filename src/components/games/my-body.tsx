"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, Home, ShieldCheck, Phone, RotateCcw } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { useProfile } from "@/lib/store";
import {
  BODY_PARTS, UNDERWEAR_RULE, CORRECT_NAMES_NOTE, MINE_CHANT, MINE_SAY,
  TOUCH_CARDS, TOUCH_RULE, TOUCH_LABEL, BIG_NO_TOUCH, TRUSTED, NET_TARGET, TELL_RULE, HELPLINE, SAM,
  type TouchKind,
} from "@/content/games/my-body";

type Mode = "home" | "body" | "mine" | "touch" | "no" | "net";
const shuffle = <T,>(a: T[]) => a.map((v) => [Math.random(), v] as const).sort((x, y) => x[0] - y[0]).map(([, v]) => v);

/** A friendly, non-clinical cartoon body; the violet band marks the private (underwear) zone. */
function BodyFigure({ glow }: { glow?: boolean }) {
  return (
    <svg viewBox="0 0 100 150" width={104} height={156} className="shrink-0" aria-hidden>
      <circle cx="50" cy="22" r="16" fill="#F2C9A0" />
      <rect x="34" y="40" width="32" height="42" rx="12" fill="#7CC4F2" />
      <rect x="18" y="44" width="13" height="36" rx="6.5" fill="#F2C9A0" />
      <rect x="69" y="44" width="13" height="36" rx="6.5" fill="#F2C9A0" />
      <rect x="37" y="80" width="11" height="44" rx="5.5" fill="#F2C9A0" />
      <rect x="52" y="80" width="11" height="44" rx="5.5" fill="#F2C9A0" />
      <rect x="35" y="78" width="30" height="14" rx="5" fill="#7C5CFC" opacity={glow ? 1 : 0.85} className={glow ? "animate-pulse" : ""} />
    </svg>
  );
}

export function MyBodyGame({ onExit }: { onExit: () => void }) {
  const { profile } = useProfile();
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState<string>(SAM.greet);
  const [done, setDone] = useState(false);
  const [touchIdx, setTouchIdx] = useState(0);
  const [touchCards, setTouchCards] = useState(() => shuffle(TOUCH_CARDS).slice(0, 6));
  const [net, setNet] = useState<string[]>([]); // a list (repeats allowed) so any family fits — incl. two mums / two dads

  const say = useCallback((t: string, onEnd?: () => void) => { setBubble(t); speak(t, { muted, onEnd }); }, [muted]);

  useEffect(() => {
    speak(SAM.greet, { muted });
    return () => stopSpeaking();
    // greet once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => {
    setNet([]);
    setTouchCards(shuffle(TOUCH_CARDS).slice(0, 6));
    setTouchIdx(0);
    setDone(false);
    setMode("home");
    say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "body") say(SAM.body);
    else if (m === "mine") say(SAM.mine);
    else if (m === "touch") { setTouchCards(shuffle(TOUCH_CARDS).slice(0, 6)); setTouchIdx(0); say(SAM.touch); }
    else if (m === "no") say(SAM.bigNo);
    else if (m === "net") say(SAM.net);
    else say(SAM.home);
  };

  const tapTouch = (kind: TouchKind) => {
    const card = touchCards[touchIdx];
    if (!card) return;
    // advance only once the explanation has finished speaking
    const onDone = () => {
      if (touchIdx + 1 >= touchCards.length) say("You're learning your body-safety rules so well! 🌟", () => go("home"));
      else {
        setTouchIdx((i) => i + 1);
        say(SAM.touch);
      }
    };
    if (kind === card.kind) {
      if (card.kind === "safe") celebrate("small");
      say(`${TOUCH_LABEL[card.kind]}. ${TOUCH_RULE[card.kind]}`, onDone);
    } else {
      // never "wrong" — gently name the right kind and the rule
      say(`This one is ${TOUCH_LABEL[card.kind].toLowerCase()}. ${TOUCH_RULE[card.kind]}`, onDone);
    }
  };

  // additive: tap a grown-up to add them (again, if you like — two mums, two dads, two grandmas…)
  const addTrusted = (id: string) => setNet((prev) => { celebrate("small"); return [...prev, id]; });
  const removeAt = (i: number) => setNet((prev) => prev.filter((_, k) => k !== i));

  const finishNet = () => {
    say(SAM.netDone);
    setDone(true);
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
      <span className="glass-pill flex-1 rounded-2xl px-4 py-2.5 text-center text-base font-bold backdrop-blur-md backdrop-saturate-150" style={{ color: "var(--color-ink)" }}>
        {bubble}
      </span>
    </div>
  );

  const HomeBtn = (
    <button type="button" onClick={() => go("home")} className="glass-pill mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
      <Home className="size-5" aria-hidden /> Home
    </button>
  );

  if (done) {
    return (
      <GameShell title="My Body, My Rules" tools={tools} onExit={onExit}>
        <GameDone
          gameId="my-body"
          stars={3}
          coins={15}
          title="My Body Boss! 🌟"
          blurb="Your body is yours. You can say no, and you can always tell a trusted grown-up. 💛"
          onReplay={reset}
          onExit={onExit}
        />
      </GameShell>
    );
  }

  return (
    <GameShell title="My Body, My Rules" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}

        {/* ---- Home: the five modes ---- */}
        {mode === "home" && (
          <div className="grid grid-cols-2 gap-2.5">
            {([
              ["body", "🧍", "My Body"],
              ["mine", "🛡️", "My Rules"],
              ["touch", "🤔", "Safe or Not"],
              ["no", "✋", "The Big No"],
              ["net", "💛", "Safety Net"],
            ] as [Mode, string, string][]).map(([m, emoji, label]) => (
              <button key={m} type="button" onClick={() => go(m)} className="glass-card flex flex-col items-center gap-1.5 rounded-2xl py-5 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.97]">
                <span className="text-4xl" aria-hidden>{emoji}</span>
                <span className="text-sm font-bold text-foreground">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* ---- My Amazing Body ---- */}
        {mode === "body" && (
          <>
            <div className="flex justify-center"><BodyFigure /></div>
            <div className="grid grid-cols-3 gap-2">
              {BODY_PARTS.map((p) => (
                <button key={p.id} type="button" onClick={() => say(`${p.name}. ${p.say}`)} className="glass-card flex flex-col items-center gap-0.5 rounded-2xl py-3 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-95">
                  <span className="text-3xl" aria-hidden>{p.emoji}</span>
                  <span className="text-xs font-bold text-foreground">{p.name}</span>
                </button>
              ))}
            </div>
            <button type="button" onClick={() => say(UNDERWEAR_RULE)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.98]" style={{ boxShadow: "inset 0 0 0 2px #7C5CFC" }}>
              <span className="text-3xl" aria-hidden>🩲</span>
              <span className="flex-1 text-sm font-semibold text-foreground">Private parts — {UNDERWEAR_RULE}</span>
            </button>
            {!profile.schoolComfort && <p className="px-1 text-center text-xs text-foreground/70">{CORRECT_NAMES_NOTE}</p>}
            {HomeBtn}
          </>
        )}

        {/* ---- My Body Belongs to Me ---- */}
        {mode === "mine" && (
          <>
            <div className="glass-card flex flex-col items-center gap-3 rounded-2xl px-5 py-6 backdrop-blur-[12px] backdrop-saturate-150">
              <BodyFigure glow />
              <p className="text-center text-sm text-foreground/85">The glowing part is private — it's yours.</p>
            </div>
            <button type="button" onClick={() => { say(`${MINE_CHANT} ${MINE_SAY}`); celebrate("small"); }} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-lg font-extrabold text-slate-900 transition-transform active:scale-95">
              <ShieldCheck className="size-5" aria-hidden /> {MINE_CHANT}
            </button>
            {HomeBtn}
          </>
        )}

        {/* ---- Safe / Unsafe / Not-Sure ---- */}
        {mode === "touch" && touchCards[touchIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-4xl" aria-hidden>{touchCards[touchIdx].emoji}</span>
              <p className="font-display text-lg font-bold text-foreground">{touchCards[touchIdx].text}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["safe", "unsafe", "notsure"] as TouchKind[]).map((k) => (
                <button key={k} type="button" onClick={() => tapTouch(k)} className="glass-card rounded-2xl py-3 text-sm font-bold text-foreground backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-95">
                  {TOUCH_LABEL[k]}
                </button>
              ))}
            </div>
            {HomeBtn}
          </>
        )}

        {/* ---- The Big No ---- */}
        {mode === "no" && (
          <>
            <div className="grid grid-cols-2 gap-2.5">
              {BIG_NO_TOUCH.map((b) => (
                <button key={b.label} type="button" onClick={() => { say(b.sam); celebrate("small"); try { navigator.vibrate?.(14); } catch { /* unsupported */ } }} className="flex flex-col items-center justify-center gap-1 rounded-3xl py-6 text-center text-foreground ring-4 ring-foreground/40 transition-transform active:scale-90" style={{ background: b.accent }}>
                  <span className="text-3xl" aria-hidden>{b.emoji}</span>
                  <span className="text-base font-extrabold leading-tight">{b.label}</span>
                </button>
              ))}
            </div>
            {HomeBtn}
          </>
        )}

        {/* ---- My Safety Net (additive: add anyone you trust — two mums, two dads, anyone) ---- */}
        {mode === "net" && (
          <>
            <p className="text-center text-sm font-semibold text-foreground/85">Your trusted grown-ups ({net.length}/{NET_TARGET}+)</p>
            {net.length > 0 && (
              <div className="glass-card flex flex-wrap justify-center gap-1.5 rounded-2xl p-3 backdrop-blur-[12px] backdrop-saturate-150">
                {net.map((id, i) => (
                  <button key={i} type="button" onClick={() => removeAt(i)} aria-label={`Remove ${TRUSTED.find((t) => t.id === id)?.name}`} className="text-3xl animate-in zoom-in transition-transform active:scale-90">
                    <span aria-hidden>{TRUSTED.find((t) => t.id === id)?.emoji}</span>
                  </button>
                ))}
              </div>
            )}
            <p className="px-1 text-center text-xs text-foreground/75">Add anyone you trust — even two mums or two dads. 💛 (Tap someone above to remove.)</p>
            <div className="grid grid-cols-4 gap-2">
              {TRUSTED.map((t) => (
                <button key={t.id} type="button" onClick={() => addTrusted(t.id)} className="glass-card flex flex-col items-center gap-0.5 rounded-2xl py-3 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-95">
                  <span className="text-2xl" aria-hidden>{t.emoji}</span>
                  <span className="text-[10px] font-bold leading-tight text-foreground">{t.name}</span>
                </button>
              ))}
            </div>
            <p className="px-1 text-center text-xs text-foreground/75">{TELL_RULE}</p>
            <button type="button" onClick={() => say(HELPLINE)} className="glass-pill flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-semibold backdrop-blur-md backdrop-saturate-150" style={{ color: "var(--color-ink)" }}>
              <Phone className="size-5 shrink-0" aria-hidden /> {HELPLINE}
            </button>
            <button type="button" disabled={net.length < NET_TARGET} onClick={finishNet} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95 disabled:opacity-50">
              That's my Safety Net!
            </button>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
