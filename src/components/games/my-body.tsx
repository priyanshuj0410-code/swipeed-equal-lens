"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, Sparkles, ShieldCheck, Phone, Users, Music } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { ToolMoment } from "@/components/toolkit/tool-moment";
import { useProfile } from "@/lib/store";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import {
  SCENARIOS, byMechanic, MOVES, MOVE_BY_ID, PANTS_SONG, TRUSTED, TEAM_TARGET, HELPLINE, SAM,
  type Scenario, type Mechanic,
} from "@/content/games/my-body";

const shuffle = <T,>(a: T[]) => a.map((v) => [Math.random(), v] as const).sort((x, y) => x[0] - y[0]).map(([, v]) => v);
const BUILDER_ID = "mb-073"; // the "build your safety team" scenario — rendered as the additive builder

/** A friendly, non-clinical cartoon body; the violet band marks the private (underwear) zone. */
function BodyFigure({ glow }: { glow?: boolean }) {
  return (
    <svg viewBox="0 0 100 150" width={92} height={138} className="shrink-0" aria-hidden>
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

// Safeguarding items (fault / secret / unsafe touch) get a warm reassurance on a wrong tap, never a buzzer.
const isSafeguarding = (s: Scenario) =>
  s.cat === "tell" || s.cat === "secret-surprise" || (s.cat === "safe-unsafe" && /fault|secret|not safe|unsafe/i.test(s.relearn));

// Tint a sort option by meaning (colour is never the only signal — the bin always shows the full word + an
// emoji and is voiced). Imperfect tints are harmless decoration on a labelled, spoken button.
function binStyle(opt: string): { emoji: string; tint: string } {
  const o = opt.toLowerCase();
  if (/uh-oh|uhoh|not right|goosebump|move and tell|trust that feeling/.test(o)) return { emoji: "😬", tint: "#F0A93B" };
  if (/never the child|no, never|not your fault/.test(o)) return { emoji: "💙", tint: "#5B9BD5" };
  if (/not safe|unsafe|hurts|never okay|the child's|stay put|ignore|nothing|keep it|trouble|forever/.test(o)) return { emoji: "🛑", tint: "#E05C52" };
  if (/^safe|wanted|^yes|surprise|happy|no harm|time to tell|with a parent|with a trusted/.test(o)) return { emoji: "💚", tint: "#62B84B" };
  if (/secret/.test(o)) return { emoji: "🤫", tint: "#E05C52" };
  return { emoji: "🤔", tint: "var(--color-mist)" };
}

export function MyBodyGame({ onExit }: { onExit: () => void }) {
  const [view, setView] = useState<"home" | "play" | "pants" | "done">("home");
  const [queue, setQueue] = useState<Scenario[]>([]);
  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState<"ask" | "right" | "wrong">("ask");
  const [opts, setOpts] = useState<string[]>([]); // shuffled per scenario (the library lists the answer first)
  const [stickers, setStickers] = useState<Set<Mechanic>>(new Set());
  const [team, setTeam] = useState<string[]>([]); // the safety team (a list; repeats allowed — two mums, two dads)
  const [bubble, setBubble] = useState(SAM.greet);
  const [muted, setMuted] = useState(false);
  const [coplay, setCoplay] = useState(false);
  // Calm Mode is the app-wide setting: the store syncs profile.calmMode → juice.setCalm(), so toggling it
  // here actually drives prefersReducedMotion() (suppressing confetti + motion), per the GDD's accessibility.
  const { profile, setCalmMode } = useProfile();
  const calmMode = profile.calmMode ?? false;
  const singing = useRef(false);

  const sc = queue[qi];

  const say = useCallback((t: string, onEnd?: () => void) => { setBubble(t); speak(t, { muted, onEnd }); }, [muted]);

  useEffect(() => {
    speak(SAM.greet, { muted });
    return () => { singing.current = false; stopSpeaking(); };
    // greet once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const present = useCallback((s: Scenario) => {
    setPhase("ask"); setOpts(shuffle(s.options));
    say(`${s.situation} ${s.prompt}`);
  }, [say]);

  // one fresh scenario per mechanic, in MOVES order → consecutive beats are always a different verb. For the
  // "Tell who?" slot, lead with the safety-team builder so the build-your-team moment is in the main flow.
  const startRotate = () => {
    const q = MOVES.map((m) => (m.id === "tell-who"
      ? SCENARIOS.find((s) => s.id === BUILDER_ID)!
      : shuffle(byMechanic(m.id))[0])).filter(Boolean) as Scenario[];
    setQueue(q); setQi(0); setView("play"); present(q[0]);
  };
  const startMove = (m: Mechanic) => {
    let pool = shuffle(byMechanic(m));
    if (m === "tell-who") { // open with the builder, then two tell beats
      const builder = SCENARIOS.find((s) => s.id === BUILDER_ID)!;
      pool = [builder, ...pool.filter((s) => s.id !== BUILDER_ID)];
    }
    const q = pool.slice(0, 3);
    setQueue(q); setQi(0); setView("play"); present(q[0]);
  };

  const earn = (m: Mechanic) => setStickers((prev) => (prev.has(m) ? prev : new Set(prev).add(m)));

  const land = (s: Scenario) => {
    earn(s.mechanic);
    setPhase("right");
    say(s.relearn);
    if (!muted) try { navigator.vibrate?.(s.mechanic === "big-no" ? [16, 40, 16] : 12); } catch { /* unsupported */ }
  };

  const choose = (s: Scenario, opt: string) => {
    if (phase !== "ask") return;
    if (opt !== s.answer) { setPhase("wrong"); say(isSafeguarding(s) ? SAM.reassure : SAM.nudge); return; }
    celebrate("small");
    land(s);
  };

  const next = () => {
    const ni = qi + 1;
    if (ni < queue.length) { setQi(ni); present(queue[ni]); return; }
    if (stickers.size >= MOVES.length) { celebrate("big"); say(SAM.complete, () => setView("done")); }
    else { setView("home"); say(SAM.home); }
  };

  const reset = () => {
    singing.current = false;
    setStickers(new Set()); setQueue([]); setQi(0); setPhase("ask"); setTeam([]); setView("home"); say(SAM.greet);
  };

  // PANTS song — play the five letters in order (the anchor). A pre-reader carries the whole rule home.
  const singPants = (i = 0) => {
    if (i >= PANTS_SONG.length) { singing.current = false; say("That's PANTS! Now you know the whole rule. 🎉"); return; }
    singing.current = true;
    say(PANTS_SONG[i].say, () => { if (singing.current) singPants(i + 1); });
  };

  // ---- chrome ----
  const muteBtn = (
    <button type="button" aria-label={muted ? "Turn sound on" : "Turn sound off"} onClick={() => setMuted((m) => { const n = !m; if (n) { stopSpeaking(); singing.current = false; } return n; })} className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
      {muted ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
    </button>
  );
  const tools = (
    <span className="flex items-center gap-2">
      <button type="button" aria-label={calmMode ? "Calm mode on" : "Calm mode off"} aria-pressed={calmMode} onClick={() => setCalmMode(!calmMode)} className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95" style={calmMode ? { boxShadow: "inset 0 0 0 2px var(--color-insight)" } : undefined}>
        <Sparkles className="size-4" aria-hidden />
      </button>
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
  const StickerBook = (
    <div className="glass-card flex justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${stickers.size} of ${MOVES.length} stickers`}>
      {MOVES.map((m) => (
        <span key={m.id} className={`grid size-9 place-items-center rounded-full text-xl ${stickers.has(m.id) && !calmMode ? "animate-in zoom-in duration-300" : ""}`} style={{ background: stickers.has(m.id) ? "var(--color-sun)" : "transparent", boxShadow: stickers.has(m.id) ? "inset 0 0 0 2px var(--color-ink)" : "inset 0 0 0 2px var(--color-mist)", opacity: stickers.has(m.id) ? 1 : 0.4 }} aria-hidden>{stickers.has(m.id) ? m.emoji : "·"}</span>
      ))}
    </div>
  );
  const HomeBtn = (
    <button type="button" onClick={() => { singing.current = false; setView("home"); say(SAM.home); }} className="glass-pill mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
      <Home className="size-5" aria-hidden /> Home
    </button>
  );
  const HelpPill = (
    <button type="button" onClick={() => say(HELPLINE)} className="glass-pill flex items-center gap-2 rounded-2xl px-4 py-2.5 text-left text-sm font-semibold backdrop-blur-md backdrop-saturate-150" style={{ color: "var(--color-ink)" }}>
      <Phone className="size-4 shrink-0" aria-hidden /> Get help — Childline 1098
    </button>
  );

  if (view === "done") {
    return (
      <GameShell title="My Body, My Rules" tools={tools} onExit={onExit}>
        <GameDone gameId="my-body" stars={3} coins={15} title="My Body, My Rules! 🛡️" blurb={SAM.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  // ---- interaction renderers (one bespoke verb per mechanic) ----
  const renderAsk = () => {
    if (!sc) return null;
    const m = sc.mechanic;

    if (m === "big-no") {
      const distractors = opts.filter((o) => o !== sc.answer && o.trim() !== "...");
      return (
        <div className="flex flex-col gap-2.5">
          <button type="button" onClick={() => choose(sc, sc.answer)} className="flex flex-col items-center justify-center gap-1.5 rounded-3xl bg-[var(--color-grow)] py-8 text-white ring-4 ring-[var(--color-ink)]/25 transition-transform active:scale-90">
            <span className="text-5xl" aria-hidden>✋</span>
            <span className="px-3 text-center text-lg font-extrabold leading-tight">{sc.answer}</span>
            <span className="text-xs font-semibold opacity-80">Tap to say it, loud and brave</span>
          </button>
          {distractors.map((o) => (
            <button key={o} type="button" onClick={() => choose(sc, o)} className="glass-pill rounded-2xl px-4 py-2.5 text-center text-sm font-semibold text-foreground/70 backdrop-blur-md transition-transform active:scale-95">{o}</button>
          ))}
        </div>
      );
    }

    if (m === "safe-sort") {
      return (
        <div className="grid grid-cols-1 gap-2.5">
          {opts.map((o) => {
            const b = binStyle(o);
            return (
              <button key={o} type="button" onClick={() => choose(sc, o)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-4 text-left font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.97]" style={{ boxShadow: `inset 0 0 0 2.5px ${b.tint}` }}>
                <span className="text-3xl" aria-hidden>{b.emoji}</span>
                <span className="flex-1 text-[15px]">{o}</span>
              </button>
            );
          })}
        </div>
      );
    }

    if (m === "secret-surprise") {
      return (
        <div className="grid grid-cols-1 gap-2.5">
          {opts.map((o) => {
            const surprise = /surprise|no harm|time to tell|^okay$/i.test(o.toLowerCase());
            const tint = surprise ? "#62B84B" : "#E05C52";
            const emoji = surprise ? "🎁" : "🤫";
            return (
              <button key={o} type="button" onClick={() => choose(sc, o)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-4 text-left font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.97]" style={{ boxShadow: `inset 0 0 0 2.5px ${tint}` }}>
                <span className="text-3xl" aria-hidden>{emoji}</span>
                <span className="flex-1 text-[15px]">{o}</span>
              </button>
            );
          })}
        </div>
      );
    }

    if (m === "tell-who" && sc.id === BUILDER_ID) {
      const enough = team.length >= TEAM_TARGET;
      return (
        <div className="flex flex-col gap-3">
          <p className="text-center text-sm font-semibold text-foreground/85">Your safety team ({team.length}/{TEAM_TARGET}+)</p>
          {team.length > 0 && (
            <div className="glass-card flex flex-wrap justify-center gap-1.5 rounded-2xl p-3 backdrop-blur-[12px] backdrop-saturate-150">
              {team.map((id, i) => (
                <button key={i} type="button" onClick={() => setTeam((p) => p.filter((_, k) => k !== i))} aria-label={`Remove ${TRUSTED.find((t) => t.id === id)?.name}`} className={`text-3xl transition-transform active:scale-90 ${calmMode ? "" : "animate-in zoom-in"}`}>
                  <span aria-hidden>{TRUSTED.find((t) => t.id === id)?.emoji}</span>
                </button>
              ))}
            </div>
          )}
          <div className="grid grid-cols-4 gap-2">
            {TRUSTED.map((t) => (
              <button key={t.id} type="button" onClick={() => { setTeam((p) => [...p, t.id]); celebrate("small"); }} className="glass-card flex flex-col items-center gap-0.5 rounded-2xl py-3 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-95">
                <span className="text-2xl" aria-hidden>{t.emoji}</span>
                <span className="text-[10px] font-bold leading-tight text-foreground">{t.name}</span>
              </button>
            ))}
          </div>
          <p className="px-1 text-center text-xs text-foreground/70">Add anyone you trust — even two mums or two dads. 💛 (Tap above to remove.)</p>
          {HelpPill}
          <button type="button" disabled={!enough} onClick={() => choose(sc, sc.answer)} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95 disabled:opacity-50">
            <ShieldCheck className="size-5" aria-hidden /> That’s my safety team!
          </button>
        </div>
      );
    }

    if (m === "tell-who") {
      return (
        <div className="flex flex-col gap-2.5">
          {opts.map((o) => (
            <button key={o} type="button" onClick={() => choose(sc, o)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-[15px] font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.97]">
              <span className="text-2xl" aria-hidden>💛</span><span className="flex-1">{o}</span>
            </button>
          ))}
          {HelpPill}
        </div>
      );
    }

    if (m === "name-it") {
      return (
        <>
          <div className="flex justify-center"><BodyFigure /></div>
          <div className="grid grid-cols-1 gap-2.5">
            {opts.map((o) => (
              <button key={o} type="button" onClick={() => choose(sc, o)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-[15px] font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.97]">
                <span className="text-2xl" aria-hidden>🏷️</span><span className="flex-1">{o}</span>
              </button>
            ))}
          </div>
        </>
      );
    }

    // yes-no — a proud, body-affirming choice. Tiles are neutral (the answer slot is shuffled, so no
    // per-tile valence cue that would leak the answer); the empowering choice is celebrated on tap.
    return (
      <div className="grid grid-cols-1 gap-2.5">
        {opts.map((o) => (
          <button key={o} type="button" onClick={() => choose(sc, o)} className="glass-card flex items-center justify-center rounded-2xl px-4 py-5 text-center text-base font-extrabold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.97]">
            {o}
          </button>
        ))}
      </div>
    );
  };

  return (
    <GameShell title="My Body, My Rules" tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {view !== "pants" && StickerBook}
        {coplay && view === "play" && sc && (
          <div className="glass-pill flex items-start gap-2 rounded-2xl px-3 py-2 text-sm font-medium backdrop-blur-md" style={{ color: "var(--color-ink)" }}>
            <Users className="mt-0.5 size-4 shrink-0" aria-hidden /> <span>{MOVE_BY_ID[sc.mechanic].coplay}</span>
          </div>
        )}

        {/* ---------- HOME ---------- */}
        {view === "home" && (
          <>
            <button type="button" onClick={startRotate} className="flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-lg font-extrabold text-slate-900 transition-transform active:scale-[0.98]">
              <ShieldCheck className="size-6" aria-hidden /> Play with Lensy
            </button>
            <div className="grid grid-cols-2 gap-2.5">
              {MOVES.map((m) => (
                <button key={m.id} type="button" onClick={() => startMove(m.id)} className="glass-card flex flex-col items-center gap-1.5 rounded-2xl py-5 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.97]" style={stickers.has(m.id) ? { boxShadow: "inset 0 0 0 2px var(--color-sun)" } : undefined}>
                  <span className="text-4xl" aria-hidden>{m.emoji}</span>
                  <span className="text-center text-sm font-bold text-foreground">{m.label}</span>
                </button>
              ))}
            </div>
            <button type="button" onClick={() => { setView("pants"); say(SAM.pants); }} className="glass-card flex h-12 items-center justify-center gap-2 rounded-2xl text-base font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-95" style={{ boxShadow: "inset 0 0 0 2px var(--color-insight)" }}>
              <Music className="size-5" aria-hidden /> Sing the PANTS song
            </button>
            <button type="button" onClick={() => setCoplay((c) => !c)} className="glass-pill flex h-10 items-center justify-center gap-2 rounded-2xl text-sm font-bold backdrop-blur-md transition-transform active:scale-95" style={coplay ? { boxShadow: "inset 0 0 0 2px var(--color-ink)" } : undefined}>
              <Users className="size-4" aria-hidden /> Grown-up co-play {coplay ? "on" : "off"}
            </button>
            {HelpPill}
          </>
        )}

        {/* ---------- PANTS SONG ---------- */}
        {view === "pants" && (
          <>
            <div className="flex flex-col gap-2">
              {PANTS_SONG.map((p) => (
                <button key={p.letter} type="button" onClick={() => { singing.current = false; say(p.say); }} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl text-2xl font-extrabold text-slate-900" style={{ background: "var(--color-sun)" }} aria-hidden>{p.letter}</span>
                  <span className="text-2xl" aria-hidden>{p.emoji}</span>
                  <span className="flex-1 text-sm font-bold text-foreground">{p.word}</span>
                </button>
              ))}
            </div>
            <button type="button" onClick={() => singPants(0)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] py-3.5 text-base font-extrabold text-slate-900 transition-transform active:scale-95">
              <Music className="size-5" aria-hidden /> Sing it all with Lensy
            </button>
            {HomeBtn}
          </>
        )}

        {/* ---------- PLAY ---------- */}
        {view === "play" && sc && (
          <>
            {/* the situation (Hook) */}
            <div className="glass-card flex flex-col items-center gap-1.5 rounded-2xl px-5 py-5 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-3xl" aria-hidden>{MOVE_BY_ID[sc.mechanic].emoji}</span>
              <p className="font-display text-base font-bold text-foreground">{sc.situation}</p>
              <p className="text-sm font-semibold text-foreground/70">{sc.prompt}</p>
            </div>

            {/* the interaction (Play) */}
            {phase === "ask" && renderAsk()}

            {/* gentle, never a fail — extra-warm on safeguarding items */}
            {phase === "wrong" && (
              <button type="button" onClick={() => setPhase("ask")} className="glass-pill flex h-12 w-full items-center justify-center rounded-2xl text-base font-bold text-foreground backdrop-blur-md transition-transform active:scale-95">Let’s look again →</button>
            )}

            {/* the truth (UN→RE on a myth, else the relearn) + the Help-Map reference + Next */}
            {phase === "right" && (
              <>
                {sc.myth ? (
                  <UnReBeat un={`Some people say “${sc.myth}” — but that isn't true. Let's rub it out.`} re={sc.relearn} />
                ) : (
                  <div className="glass-pill rounded-2xl px-4 py-3 text-center text-[15px] font-semibold leading-relaxed backdrop-blur-md" style={{ color: "var(--color-ink)" }}>💛 {sc.relearn}</div>
                )}
                {sc.mechanic === "tell-who" && <ToolMoment tool="help-map" line="This is your Help Map — the trusted grown-ups you can always turn to." />}
                <button type="button" onClick={next} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-extrabold text-slate-900 transition-transform active:scale-95">
                  {qi + 1 >= queue.length ? "Finish ⭐" : "Next →"}
                </button>
              </>
            )}
            <p className="text-center text-xs text-foreground/55">{qi + 1} / {queue.length}</p>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
