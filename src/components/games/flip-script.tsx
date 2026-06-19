"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, Check, ArrowDown } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import {
  SPOT, SPOT_MISS, FLIP_ADS, FLIP_MISS, MEDIA_MYTH, REAL_STARS, MAKE_TOPICS,
  BADGE_TARGET, SAM,
} from "@/content/games/flip-script";

type Mode = "home" | "spot" | "flip" | "mediaMyth" | "realStars" | "makeAd";
const MODES: [Mode, string, string][] = [
  ["spot", "🔍", "Spot the Stereotype"],
  ["flip", "🔄", "Flip It!"],
  ["mediaMyth", "💥", "Bust the Media Myth"],
  ["realStars", "🌟", "Real Stars"],
  ["makeAd", "🎨", "Make a Fair Ad"],
];

export function FlipScriptGame({ onExit }: { onExit: () => void }) {
  const [mode, setMode] = useState<Mode>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(SAM.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [spotIdx, setSpotIdx] = useState(0);
  const [flipIdx, setFlipIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mythBusted, setMythBusted] = useState(false);
  const [starsGot, setStarsGot] = useState<Set<number>>(new Set());
  const [gallery, setGallery] = useState<Set<number>>(new Set());

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
    setBadges(new Set()); setSpotIdx(0); setFlipIdx(0); setFlipped(false); setMythBusted(false);
    setStarsGot(new Set()); setGallery(new Set()); setDone(false); setMode("home"); say(SAM.greet);
  };

  const go = (m: Mode) => {
    setMode(m);
    if (m === "spot") { setSpotIdx(0); say(SAM.spot); }
    else if (m === "flip") { setFlipIdx(0); setFlipped(false); say(SAM.flip); }
    else if (m === "mediaMyth") { setMythBusted(false); say(SAM.mediaMyth); }
    else if (m === "realStars") say(SAM.realStars);
    else if (m === "makeAd") say(SAM.makeAd);
    else say(SAM.home);
  };

  const chooseSpot = (ok: boolean) => {
    if (!ok) { say(SPOT_MISS); return; }
    celebrate("small");
    say(SPOT[spotIdx].spotted, () => { if (spotIdx + 1 >= SPOT.length) { earn("spot"); go("home"); } else setSpotIdx((i) => i + 1); });
  };

  const chooseFlip = (fair: boolean) => {
    if (!fair) { say(FLIP_MISS); return; }
    setFlipped(true); celebrate("small"); say(FLIP_ADS[flipIdx].cheer);
  };
  const nextFlip = () => {
    if (flipIdx + 1 >= FLIP_ADS.length) { earn("flip"); go("home"); }
    else { setFlipped(false); setFlipIdx((i) => i + 1); }
  };

  const tapStar = (i: number) => {
    if (starsGot.has(i)) return;
    const next = new Set(starsGot); next.add(i);
    setStarsGot(next); say(REAL_STARS[i].say); celebrate("small");
    if (next.size >= REAL_STARS.length) earn("realStars");
  };

  const tapTopic = (i: number) => {
    if (gallery.has(i)) return;
    const next = new Set(gallery); next.add(i);
    setGallery(next); say(`${MAKE_TOPICS[i].slogan} Added to your Flipped Gallery!`); celebrate("small");
    if (next.size >= MAKE_TOPICS.length) earn("makeAd");
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
      <Home className="size-5" aria-hidden /> Studio
    </button>
  );
  const BadgeBook = (
    <div className="glass-card flex justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${badges.size} of ${BADGE_TARGET} editor badges`}>
      {MODES.map(([id]) => (
        <span key={id} className={`text-2xl ${badges.has(id) ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{badges.has(id) ? "🏅" : "🤍"}</span>
      ))}
    </div>
  );

  if (done) {
    return (
      <GameShell title="Flip the Script" tools={tools} onExit={onExit}>
        <GameDone gameId="flip-script" stars={3} coins={25} title="Media Editor! 🎬" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Flip the Script" tools={tools} onExit={onExit}>
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

        {/* Spot the Stereotype */}
        {mode === "spot" && SPOT[spotIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-5xl" aria-hidden>{SPOT[spotIdx].emoji}</span>
              <p className="font-display text-base font-bold text-white">{SPOT[spotIdx].media}</p>
            </div>
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-white/60">What's the stereotype?</p>
            <div className="grid grid-cols-1 gap-2.5">
              {SPOT[spotIdx].options.map((o, i) => (
                <button key={i} type="button" onClick={() => chooseSpot(o.ok)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{o.text}</button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">{spotIdx + 1} / {SPOT.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Flip It! — before → after */}
        {mode === "flip" && FLIP_ADS[flipIdx] && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-5 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-xs font-bold uppercase tracking-wide text-white/55">{FLIP_ADS[flipIdx].poster}</span>
              <span className="text-4xl" aria-hidden>{FLIP_ADS[flipIdx].emoji}</span>
              <p className={`font-display text-base font-bold ${flipped ? "text-white/40 line-through" : ""}`} style={flipped ? undefined : { color: "#ff9085" }}>{FLIP_ADS[flipIdx].original}</p>
              {flipped && <><ArrowDown className="size-5 text-white/70" aria-hidden /><p className="font-display text-base font-bold text-emerald-300">{FLIP_ADS[flipIdx].options.find((o) => o.fair)?.text}</p></>}
            </div>
            {flipped ? (
              <button type="button" onClick={nextFlip} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">🔄 {flipIdx + 1 >= FLIP_ADS.length ? "Last one flipped!" : "Next ad"}</button>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {FLIP_ADS[flipIdx].options.map((o, i) => (
                  <button key={i} type="button" onClick={() => chooseFlip(o.fair)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-white backdrop-blur-[12px] transition-transform active:scale-[0.98]">{o.text}</button>
                ))}
              </div>
            )}
            <p className="text-center text-xs text-white/60">Ad {flipIdx + 1} / {FLIP_ADS.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Bust the Media Myth (UN & RE) */}
        {mode === "mediaMyth" && (
          <>
            <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-3xl" aria-hidden>📺</span>
              <p className={`font-display text-lg font-bold ${mythBusted ? "text-white/40 line-through" : "animate-pulse"}`} style={mythBusted ? undefined : { color: "#ff9085" }}>{MEDIA_MYTH.claim}</p>
            </div>
            {!mythBusted ? (
              <button type="button" onClick={() => { setMythBusted(true); celebrate("small"); say(MEDIA_MYTH.re); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">💥 Bust it with UN &amp; RE</button>
            ) : (
              <>
                <UnReBeat un={MEDIA_MYTH.un} re={MEDIA_MYTH.re} />
                <button type="button" onClick={() => { earn("mediaMyth"); go("home"); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-base font-bold text-slate-900 transition-transform active:scale-95">Got it!</button>
              </>
            )}
            {HomeBtn}
          </>
        )}

        {/* Real Stars */}
        {mode === "realStars" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {REAL_STARS.map((s, i) => (
                <button key={i} type="button" onClick={() => tapStar(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={starsGot.has(i) ? { boxShadow: "inset 0 0 0 2px #7C3AED" } : undefined}>
                  <span className="text-2xl" aria-hidden>{s.emoji}</span>
                  <span className="flex-1 text-sm font-semibold text-white">{s.say}</span>
                  {starsGot.has(i) && <Check className="size-5 text-white" aria-hidden />}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">{starsGot.size} / {REAL_STARS.length}</p>
            {HomeBtn}
          </>
        )}

        {/* Make a Fair Ad — adds to the Flipped Gallery */}
        {mode === "makeAd" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {MAKE_TOPICS.map((t, i) => (
                <button key={i} type="button" onClick={() => tapTopic(i)} className="glass-card flex flex-col gap-1.5 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={gallery.has(i) ? { boxShadow: "inset 0 0 0 2px #7C3AED" } : undefined}>
                  <span className="flex items-center gap-2 text-sm font-bold text-white"><span className="text-xl" aria-hidden>{t.emoji}</span> {t.topic}</span>
                  {gallery.has(i) && <span className="text-sm font-medium text-emerald-300">{t.slogan}</span>}
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-white/60">Flipped Gallery: {gallery.size} / {MAKE_TOPICS.length}</p>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
