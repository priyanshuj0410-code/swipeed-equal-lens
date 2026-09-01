"use client";

import { useCallback, useEffect, useMemo, useRef, useState, Fragment } from "react";
import { Volume2, VolumeX, Home, RotateCcw, ShieldCheck, Phone } from "lucide-react";
import { greetWithName } from "@/lib/personalize";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { useProfile } from "@/lib/store";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { usePointerDrag, hitTestZone, ConnectorOverlay, type Cord } from "@/components/games/interactions";
import { prefersReducedMotion } from "@/lib/juice";
import { shuffle, byCat, type Scenario, type V2GameConfig } from "@/content/games/v2-schema";

// The shared v2 "mechanic-embodying" engine — renders any game's typed scenario library as the micro-loop
// (Hook → Play → Reassure → Sticker), with one bespoke interaction per mechanic so the lesson IS the verb,
// never a binary tap. No hard fail (a wrong move gets a warm nudge); audio-first; Calm Mode drives
// prefersReducedMotion; a help route on every screen; optional grown-up co-play. Used by g01, g02, …

// Bin tinting. Colour is NEVER the only signal — every bin shows its word plus a symbol cue.
//
// A bin's meaning comes from its DECLARED `valence`, never from its prose. This previously fell back to a
// ~152-alternative English regex over the label, which meant a bin's colour — and therefore the visual
// answer key — was a function of author wording, and silently wrong in any non-English locale. All 8,676
// bins in the catalog now declare a valence, so that regex is deleted rather than kept as a fallback:
// an undeclared bin gets a NEUTRAL position colour and asserts nothing, instead of being guessed at.
// See knowledge/architecture/creator-identity.md.
// Non-semantic position wheel. SIX slots, because six sorts in the catalog have 5-6 bins and the old
// 4-slot ring made bins 5-6 render identically to 1-2. None of these is the pos/neg/tell/uhoh hue, so an
// undeclared bin can never be mistaken for a declared one — the old slots 3 and 4 were byte-identical to
// VALENCE_STYLE.pos and .tell, which made "neutral asserts nothing" false as implemented.
const NEUTRAL_BINS = [
  { emoji: "🔵", tint: "var(--prx-slot-1)" }, { emoji: "🟣", tint: "var(--prx-slot-2)" },
  { emoji: "🟠", tint: "var(--prx-slot-3)" }, { emoji: "🔶", tint: "var(--prx-slot-4)" },
  { emoji: "🟤", tint: "var(--prx-slot-5)" }, { emoji: "⬛", tint: "var(--prx-slot-6)" },
];
// Explicit-valence palette — used when a bin DECLARES its meaning (new content), so the engine never guesses.
const VALENCE_STYLE: Record<string, { emoji: string; tint: string }> = {
  pos: { emoji: "💚", tint: "var(--prx-pos)" }, neg: { emoji: "🛑", tint: "var(--prx-neg)" },
  tell: { emoji: "🗣️", tint: "var(--prx-tell)" }, uhoh: { emoji: "😬", tint: "var(--prx-uhoh)" },
};
// Guarantee the bins of one sort are visually distinct: if two would share a tint, fall back to a
// position-based neutral palette so a non-reader always has a per-bin colour + emoji cue.
// exported so the shared rich-capstone engine renders its sort dropzones with the SAME valence tinting.
// A bin's explicit `valence` wins (pos/neg/tell/uhoh, or neutral→position colour); a bin WITHOUT one gets a
// neutral position colour — the engine never infers meaning from the label.
export function binStyles(bins: { label: string; valence?: string }[]): { emoji: string; tint: string }[] {
  const s = bins.map((b, i) => (b.valence && b.valence !== "neutral" ? (VALENCE_STYLE[b.valence] ?? NEUTRAL_BINS[i % NEUTRAL_BINS.length]) : NEUTRAL_BINS[i % NEUTRAL_BINS.length]));
  return new Set(s.map((x) => x.tint)).size < bins.length ? bins.map((_, i) => NEUTRAL_BINS[i % NEUTRAL_BINS.length]) : s;
}
const vibrate = (ms: number | number[]) => { try { navigator.vibrate?.(ms); } catch { /* unsupported */ } };

// ---- anti-repeat rotation memory ----
// shuffle() is memoryless, so with a shallow bank the same beats resurface session to session. We keep a small
// per-game "recently served" id ring in localStorage and draw FRESH (unseen) beats first, falling back to seen
// ones only once the unseen pool is exhausted. The ring caps at ~60% of the bank, so a beat won't recur until
// you've moved well past it — replays feel new without ever starving a category.
const SEEN_KEY = (gid: string) => `swipeed:seen:${gid}`;
const loadSeen = (gid: string): string[] => { try { return JSON.parse(localStorage.getItem(SEEN_KEY(gid)) || "[]"); } catch { return []; } };
const recordSeen = (gid: string, served: Scenario[], bank: number) => {
  try {
    const cap = Math.max(12, Math.floor(bank * 0.6));
    localStorage.setItem(SEEN_KEY(gid), JSON.stringify([...loadSeen(gid), ...served.map((s) => s.id)].slice(-cap)));
  } catch { /* storage unavailable */ }
};
// pick n from pool, unseen-first (each tier shuffled) so draws are both fresh AND varied.
const chooseFresh = (pool: Scenario[], n: number, seen: Set<string>): Scenario[] => {
  const fresh = shuffle(pool.filter((s) => !seen.has(s.id)));
  const stale = shuffle(pool.filter((s) => seen.has(s.id)));
  return [...fresh, ...stale].slice(0, n);
};

export function V2Game({ config, onExit }: { config: V2GameConfig; onExit: () => void }) {
  const { scenarios, gameId, title, greet, categories, badge, helpLine, helpLabel, reassureCats = [], reassure, buildLabels } = config;
  const [view, setView] = useState<"home" | "play" | "done">("home");
  const [queue, setQueue] = useState<Scenario[]>([]);
  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState<"play" | "resolve">("play");
  // a branch resolve (the picked option's consequence) shown by the engine so its Next is bottom-pinned like every
  // other mechanic — BranchPlay no longer renders its own inline Next.
  const [branchResolve, setBranchResolve] = useState<{ text: string; best: boolean } | null>(null);
  const [stickers, setStickers] = useState<Set<string>>(new Set()); // category ids earned
  const [bubble, setBubble] = useState(greet);
  const [muted, setMuted] = useState(false);
  // Calm Mode (reduce motion/confetti) is controlled in app Settings + auto-honoured from OS prefers-reduced-
  // motion via prefersReducedMotion() — no in-game toggle needed (it just cluttered the bar).
  const { profile, ready } = useProfile();
  // warm, personalised opener — "Aanya! <greet>" once the name has hydrated (empty name → unchanged)
  const greeting = useMemo(() => greetWithName(greet, profile.name), [greet, profile.name]);
  const reduceMotion = prefersReducedMotion(); // calm OR the OS prefers-reduced-motion setting — gates all motion
  const sc = queue[qi];

  const say = useCallback((t: string, onEnd?: () => void) => { setBubble(t); speak(t, { muted, onEnd }); }, [muted]);

  // greet once — but wait for the profile (name) to hydrate so the opener can be personalised
  const greetedRef = useRef(false);
  useEffect(() => {
    if (greetedRef.current || !ready) return;
    greetedRef.current = true;
    setBubble(greeting);
    speak(greeting, { muted });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, greeting]);
  useEffect(() => () => stopSpeaking(), []);

  const hookLine = (s: Scenario): string => {
    if (s.type === "reflect") return `${s.hook} ${s.prompt}`;
    if (s.type === "role-play") return `${s.hook} ${s.setup}`;
    if (s.type === "build") return `${s.hook} ${s.prompt}`;
    if (s.type === "explore-label") return `${s.hook} Find ${s.find}.`;
    return s.hook; // swipe: bubble shows the instruction only; the cue lives on the card (no redundancy)
  };
  const resolveLine = (s: Scenario): string =>
    s.type === "reflect" ? s.affirm : s.type === "branch" ? s.debrief : s.type === "strike-rewrite" ? `${s.myth.re} ${s.myth.why}` : s.type === "explore-label" ? s.reveal : s.type === "spot" ? s.why : s.relearn;
  // A beat is a "safety" beat (gets the "never your fault" reassurance + the help pill) if its category is
  // listed OR it's a branch with an escape-and-tell best choice (outcome:"safe") — so grooming/unsafe-touch
  // beats that live in other categories (e.g. consent-stop) still surface the reassurance.
  const isSafetyBeat = (s: Scenario): boolean =>
    reassureCats.includes(s.cat) || (s.type === "branch" && s.options.some((o) => o.outcome === "safe"));

  const present = useCallback((s: Scenario) => { setBranchResolve(null); setPhase("play"); say(hookLine(s)); }, [say]);

  // Rotation: one beat per category, drawn UNSEEN-first (anti-repeat) — not just shuffled. Picking by natural
  // frequency (not forced mechanic variety) keeps beats representative of each category's real mix; the seen-ring
  // keeps them from recurring until you've moved well past them.
  const startRotate = () => {
    const seen = new Set(loadSeen(gameId));
    const q = categories.map((cat) => chooseFresh(byCat(scenarios, cat.id), 1, seen)[0]).filter(Boolean);
    recordSeen(gameId, q, scenarios.length);
    setQueue(q); setQi(0); setView("play"); present(q[0]);
  };
  // One category, SIX beats — six distinct scenarios drawn unseen-first from the category (no forced mechanic
  // variety, so beats reflect the category's real mix). Six gives a substantial sub-topic session and, with the
  // deepened bank, a fresh set most replays.
  const startCat = (catId: string) => {
    const seen = new Set(loadSeen(gameId));
    const q = chooseFresh(byCat(scenarios, catId), 6, seen);
    recordSeen(gameId, q, scenarios.length);
    setQueue(q); setQi(0); setView("play"); present(q[0]);
  };

  const earn = (catId: string) => setStickers((p) => (p.has(catId) ? p : new Set(p).add(catId)));

  // A renderer calls this when the child completes its interaction. `picked` (reflect) lets us echo the chosen
  // option back by name first ("Happy. <affirm>") so affect-labelling is audible.
  const solve = (picked?: string, branch?: { text: string; best: boolean }) => {
    if (!sc) return;
    earn(sc.cat);
    celebrate("small");
    vibrate(sc.type === "role-play" ? [16, 40, 16] : 12);
    setBranchResolve(branch ?? null);
    setPhase("resolve");
    if (branch) return; // the branch consequence was already spoken on pick
    const line = resolveLine(sc);
    say(picked && sc.type === "reflect" ? `${picked}. ${line}` : line);
  };

  const next = () => {
    const ni = qi + 1;
    if (ni < queue.length) { setQi(ni); present(queue[ni]); return; }
    // Transition immediately — do NOT gate the only path to "done" on a speech onEnd callback (which a
    // muted/3–6-y/o tap could swallow). GameDone mounts on the done screen and the badge narrates there.
    if (stickers.size >= categories.length) { setView("done"); celebrate("big"); say(badge.blurb); }
    else { setView("home"); say("What shall we play?"); }
  };

  const reset = () => { setStickers(new Set()); setQueue([]); setQi(0); setBranchResolve(null); setPhase("play"); setView("home"); say(greet); };

  // ---- chrome ----
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
  // Lensy's voice is a CHAT BUBBLE (soft fill + a little tail toward Sam), not a card — content-width, wraps.
  // aria-live: the bubble mirrors every say() — hook, nudge, result — so screen-reader / deaf / TTS-muted users
  // get parity (fixes the prior say()-is-speech-only gap) without per-renderer plumbing.
  const SamSays = (
    <div className="flex items-end gap-2">
      <Sam size={52} />
      <div className="relative min-w-0 flex-1">
        <span className="absolute -left-1 bottom-2.5 size-3 rotate-45 rounded-[3px]" style={{ background: "var(--color-mist)" }} aria-hidden />
        <span role="status" aria-live="polite" aria-atomic="true" className="relative inline-block max-h-[34vh] max-w-full overflow-y-auto rounded-2xl rounded-bl-md px-3.5 py-2.5 text-left text-[15px] font-semibold leading-snug" style={{ background: "var(--color-mist)", color: "var(--color-ink)" }}>{bubble}</span>
      </div>
    </div>
  );
  // Progress = a compact strip of category dots at the very top (small, not a card).
  const StickerBook = (
    <div className="flex items-center justify-center gap-2" aria-label={`${stickers.size} of ${categories.length} earned`}>
      {categories.map((c) => (
        <span key={c.id} className={`grid place-items-center rounded-full ${stickers.has(c.id) ? "size-6 text-lg" : "size-2.5"} ${stickers.has(c.id) && !reduceMotion ? "animate-in zoom-in duration-300" : ""}`} style={{ background: stickers.has(c.id) ? "transparent" : "var(--color-mist)", opacity: stickers.has(c.id) ? 1 : 0.55 }} aria-hidden>{stickers.has(c.id) ? c.emoji : ""}</span>
      ))}
    </div>
  );
  // Home is a quiet, tertiary text button — not a card.
  const HomeBtn = (
    <button type="button" onClick={() => { setView("home"); say("What shall we play?"); }} className="mx-auto mt-1 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-foreground/50 transition-colors hover:text-foreground active:scale-95">
      <Home className="size-3.5" aria-hidden /> Home
    </button>
  );
  const HelpPill = helpLine ? (
    <button type="button" onClick={() => say(helpLine)} className="glass-pill flex items-center gap-2 rounded-2xl px-4 py-2.5 text-left text-sm font-semibold backdrop-blur-md backdrop-saturate-150" style={{ color: "var(--color-ink)" }}>
      <Phone className="size-4 shrink-0" aria-hidden /> {helpLabel ?? "Get help"}
    </button>
  ) : null;

  if (view === "done") {
    return (
      <GameShell title={title} tools={tools} onExit={onExit}>
        <GameDone gameId={gameId} stars={3} coins={15} title={badge.title} blurb={badge.blurb} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title={title} tools={tools} onExit={onExit} align="fill">
      {/* Three pinned zones so content stops "dancing": top (progress + Lensy), a flexible middle (the
          mechanic, vertically centred in its band), and a bottom row (counter + Home) glued to the edge. */}
      <div className="flex w-full max-w-sm flex-1 flex-col gap-3">
        {/* ---- TOP (pinned under the bar) ---- */}
        {StickerBook}
        {SamSays}

        {/* ---- MIDDLE (grows; holds the view, top-aligned right under Lensy) ---- */}
        <div className="flex flex-1 flex-col justify-start gap-4 py-1">
          {/* HOME — pick a topic (the "Play with Lensy" CTA is pinned at the bottom) */}
          {view === "home" && (
            <div className="grid grid-cols-2 gap-2.5">
              {categories.map((c) => (
                <button key={c.id} type="button" onClick={() => startCat(c.id)} className="glass-card relative flex flex-col items-center gap-1.5 rounded-2xl py-5 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.97]">
                  {stickers.has(c.id) && <span className="absolute right-2 top-2 text-sm" aria-hidden>✅</span>}
                  <span className="text-4xl" aria-hidden>{c.emoji}</span>
                  <span className="text-center text-sm font-bold text-foreground">{c.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* PLAY — no hook card; Lensy's bubble carries the hook. */}
          {view === "play" && sc && phase === "play" && <Play key={sc.id} sc={sc} onSolved={solve} say={say} reduceMotion={reduceMotion} buildLabels={buildLabels} />}
          {view === "play" && sc && phase === "resolve" && (
            <>
              {sc.type === "strike-rewrite" ? (
                <UnReBeat un={sc.myth.un} re={sc.myth.re} why={sc.myth.why} fill />
              ) : branchResolve ? (
                <div className="glass-pill rounded-2xl px-4 py-3 text-center text-[15px] font-semibold leading-relaxed backdrop-blur-md" style={{ color: "var(--color-ink)" }}>{branchResolve.best ? "💚 " : "💛 "}{branchResolve.text}</div>
              ) : (
                <div className="glass-pill rounded-2xl px-4 py-3 text-center text-[15px] font-semibold leading-relaxed backdrop-blur-md" style={{ color: "var(--color-ink)" }}>💛 {resolveLine(sc)}</div>
              )}
              {reassure && isSafetyBeat(sc) && (
                <div className="glass-pill rounded-2xl px-4 py-2.5 text-center text-sm font-medium backdrop-blur-md" style={{ color: "var(--color-ink)" }}>{reassure}</div>
              )}
              {reassure && isSafetyBeat(sc) && HelpPill}
            </>
          )}
        </div>

        {/* ---- BOTTOM (pinned to the edge) ---- */}
        {/* Home's "Play with Lensy" CTA sits at the bottom (the topic grid is the browsing area above). The
            Get-Help pill was removed here (the top-bar icon covers it); it still surfaces on safety resolves. */}
        {view === "home" && (
          <button type="button" onClick={startRotate} className="flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-lg font-extrabold text-slate-900 transition-transform active:scale-[0.98]">
            <ShieldCheck className="size-6" aria-hidden /> Play with Lensy
          </button>
        )}
        {view === "play" && (
          <div className="flex flex-col items-stretch gap-1.5">
            {phase === "resolve" && (
              <button type="button" onClick={next} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-extrabold text-slate-900 transition-transform active:scale-95">
                {qi + 1 >= queue.length ? "Finish ⭐" : "Next →"}
              </button>
            )}
            <p className="text-center text-xs text-foreground/55">{qi + 1} / {queue.length}</p>
            {HomeBtn}
          </div>
        )}
      </div>
    </GameShell>
  );
}

// ============================ the ten mechanic renderers ============================
function Play({ sc, onSolved, say, reduceMotion, buildLabels }: { sc: Scenario; onSolved: (picked?: string, branch?: { text: string; best: boolean }) => void; say: (t: string) => void; reduceMotion: boolean; buildLabels?: { assemble?: string; sequence?: string } }) {
  switch (sc.type) {
    case "reflect": return <ReflectPlay sc={sc} onSolved={onSolved} />;
    case "role-play": return <RolePlayPlay sc={sc} onSolved={onSolved} say={say} />;
    case "strike-rewrite": return <StrikePlay sc={sc} onSolved={onSolved} reduceMotion={reduceMotion} />;
    case "branch": return <BranchPlay sc={sc} onSolved={onSolved} say={say} />;
    case "sort": return <SortPlay sc={sc} onSolved={onSolved} say={say} reduceMotion={reduceMotion} />;
    case "match": return <MatchPlay sc={sc} onSolved={onSolved} say={say} reduceMotion={reduceMotion} />;
    case "build": return <BuildPlay sc={sc} onSolved={onSolved} say={say} labels={buildLabels} reduceMotion={reduceMotion} />;
    case "explore-label": return <ExploreLabelPlay sc={sc} onSolved={onSolved} say={say} />;
    case "spot": return <SpotPlay sc={sc} onSolved={onSolved} say={say} />;
    case "swipe": return <SwipePlay sc={sc} onSolved={onSolved} say={say} reduceMotion={reduceMotion} />;
    // Exhaustiveness guard — adding an 11th V2Mechanic without a case here used to compile clean
    // (strict is on, but noImplicitReturns is not), render nothing, and never call onSolved: the beat
    // had no fail state, so the player was simply stuck. Now it is a compile error at the point of change.
    default: { const _exhaustive: never = sc; return _exhaustive; }
  }
}

// swipe — the teen flagship's signature verb: physically SWIPE the breathable cue card to a side (drag it, or
// ←/→ keys). NO buttons (the gesture/keys ARE the input). The red/green signal lives IN the swipe: as you drag,
// the card tints toward that side and an edge badge (word + flag emoji, so colour is never the only signal)
// fades in — no static side columns eating the width, no redundant instruction card (Sam + the slim hint cover
// it). Drag past a forgiving threshold (or flick) commits; a short drag springs back (a no-fail "not yet"); a
// wrong side springs back + a warm nudge. Keyboard: the card is the focusable control — ArrowLeft = left,
// ArrowRight = right. Reduced motion degrades the fly-off/spring/tint to instant. Side tint comes from the
// scenario's DECLARED leftValence/rightValence — never inferred from the label.
// Side styling comes from the DECLARED valence, never from the label. (This replaced a regex that read the
// label prose and mis-classified 16 shipped scenarios — see v2-schema.ts.) Undeclared sides get
// side-distinct neutral slots; if both sides would resolve to the same tint they fall back to neutral slots
// so the two sides can never collapse into one colour.
function swipeStyles(sc: Extract<Scenario, { type: "swipe" }>): [{ emoji: string; tint: string }, { emoji: string; tint: string }] {
  const NEUTRAL_L = { emoji: "👈", tint: "var(--prx-slot-1)" };
  const NEUTRAL_R = { emoji: "👉", tint: "var(--prx-slot-2)" };
  const one = (v: string | undefined, fallback: { emoji: string; tint: string }) =>
    v && v !== "neutral" ? (VALENCE_STYLE[v] ?? fallback) : fallback;
  const L = one(sc.leftValence, NEUTRAL_L);
  const R = one(sc.rightValence, NEUTRAL_R);
  return L.tint === R.tint ? [NEUTRAL_L, NEUTRAL_R] : [L, R];
}
function SwipePlay({ sc, onSolved, say, reduceMotion }: { sc: Extract<Scenario, { type: "swipe" }>; onSolved: () => void; say: (t: string) => void; reduceMotion: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dx, setDx] = useState(0);
  const [flyTo, setFlyTo] = useState<0 | 1 | -1>(0); // committing fly-off direction
  const [wrong, setWrong] = useState(false);
  const [L, R] = swipeStyles(sc);
  const threshold = () => Math.max(72, (cardRef.current?.offsetWidth ?? 300) * 0.25);

  const commit = (side: "left" | "right") => {
    if (side === sc.answer) {
      setWrong(false);
      if (reduceMotion) { vibrate(12); onSolved(); }
      else { setFlyTo(side === "left" ? -1 : 1); setTimeout(() => { vibrate(12); onSolved(); }, 250); }
    } else { setWrong(true); setDx(0); say("Look again — read the flag, then swipe it the right way."); }
  };
  const drag = usePointerDrag({
    onMove: (s) => setDx(s.dx),
    onEnd: (s) => {
      const t = threshold();
      if (s.dx > t || s.vx > 0.5) commit("right");
      else if (s.dx < -t || s.vx < -0.5) commit("left");
      else setDx(0); // spring back
    },
    onTap: () => setDx(0),
  });
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); commit("left"); }
    else if (e.key === "ArrowRight") { e.preventDefault(); commit("right"); }
  };
  const dir = dx < -8 ? "left" : dx > 8 ? "right" : null;
  const edge = dir === "left" ? L : dir === "right" ? R : null;
  const tx = flyTo !== 0 ? flyTo * 700 : dx;
  return (
    <div className="flex flex-1 flex-col gap-3">
      <div
        ref={cardRef} tabIndex={0} role="group"
        aria-roledescription="card you swipe left or right"
        aria-label={`${sc.cue}. Press Left arrow for ${sc.left}, or Right arrow for ${sc.right}.`}
        onKeyDown={onKeyDown}
        {...drag.handlers}
        className="glass-card relative flex min-h-72 w-full flex-1 cursor-grab select-none items-center justify-center overflow-hidden rounded-3xl px-7 py-12 text-center text-[20px] font-bold leading-snug text-foreground backdrop-blur-[12px] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-ink)] active:cursor-grabbing"
        style={{ transform: `translateX(${tx}px) rotate(${tx * 0.035}deg)`, transition: drag.dragging ? "none" : reduceMotion ? "none" : "transform 0.25s ease-out", touchAction: "pan-y", boxShadow: edge ? `6px 6px 0 0 ${edge.tint}` : undefined }}
      >
        {/* while swiping, the chosen side fills the card with its colour + a big watermark flag + a clear badge */}
        {edge && (
          <>
            <div className="pointer-events-none absolute inset-0" style={{ background: edge.tint, opacity: 0.16 }} aria-hidden />
            <span className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-8xl ${dir === "left" ? "left-3" : "right-3"}`} style={{ opacity: 0.18 }} aria-hidden>{edge.emoji}</span>
            <span className={`absolute top-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-extrabold text-[var(--prx-on-fill)] shadow-md ${dir === "left" ? "left-3" : "right-3"}`} style={{ background: edge.tint }} aria-hidden>
              {dir === "left" ? <>{edge.emoji} {sc.left}</> : <>{sc.right} {edge.emoji}</>}
            </span>
          </>
        )}
        <span className="relative z-10">{sc.cue}</span>
      </div>
      {wrong ? (
        <p className="text-center text-xs font-semibold text-foreground/60">Look again — is that healthy? 💛</p>
      ) : (
        <div className="flex items-center justify-between px-1 text-xs font-bold text-foreground/55">
          <span className="flex items-center gap-1">👈 {sc.left}</span>
          <span className="text-foreground/40">← → keys</span>
          <span className="flex items-center gap-1">{sc.right} 👉</span>
        </div>
      )}
    </div>
  );
}

// reflect — every option is affirming; tap any (no wrong answer). The chosen option is echoed back by name on
// resolve (affect-labelling). Tap IS the right verb here — a drag would add ceremony and hurt the 3–6 band.
function ReflectPlay({ sc, onSolved }: { sc: Extract<Scenario, { type: "reflect" }>; onSolved: (picked?: string) => void }) {
  return (
    <div className="grid grid-cols-1 gap-2.5">
      {sc.options.map((o) => (
        <button key={o} type="button" onClick={() => onSolved(o)} className="glass-card flex items-center justify-center rounded-2xl px-3 py-4 text-center text-[15px] font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.96]">{o}</button>
      ))}
    </div>
  );
}

// role-play (voice) — equal-weight, SHUFFLED speech cards: the child must read and choose the assertive line
// (no more "tap the biggest green shape" tell — that was a binary tap the schema forbids). Tap a card = say it;
// the assertive line advances, a passive line speaks and warmly re-opens (no fail). The success haptic now fires
// once (in solve()) — the renderer no longer double-buzzes. Every card carries 🗣️ so the "voice" motif holds.
function RolePlayPlay({ sc, onSolved, say }: { sc: Extract<Scenario, { type: "role-play" }>; onSolved: () => void; say: (t: string) => void }) {
  const [lines] = useState(() => shuffle(sc.yourLine));
  const [nudge, setNudge] = useState(false);
  const choose = (l: { text: string; best?: boolean }) => {
    if (l.best) onSolved();
    else { setNudge(true); say("That's one way — now say the strong, brave line! 💪"); }
  };
  return (
    <div className="flex flex-col gap-2.5">
      {lines.map((l, i) => (
        <button key={i} type="button" onClick={() => choose(l)} aria-label={`Say: ${l.text}`} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-4 text-left text-[15px] font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.97]">
          <span className="text-2xl" aria-hidden>🗣️</span><span className="flex-1">{l.text}</span>
        </button>
      ))}
      {nudge && <p className="text-center text-xs font-semibold text-foreground/70">Say it loud and brave — pick the strong line! 💪</p>}
    </div>
  );
}

// strike-rewrite — the myth is now VISIBLE and physically erasable (it used to act on nothing). Scrub a finger
// back-and-forth across the myth card; it fades/blurs as you scrub, and past a forgiving threshold the UN→RE
// truth resolves. Back-and-forth scrub is one of the easiest gestures for tiny hands (finger-painting). Keyboard
// / screen-reader: the card is a focusable button — Enter/Space rubs it out in one go. Reduced motion → instant.
function StrikePlay({ sc, onSolved, reduceMotion }: { sc: Extract<Scenario, { type: "strike-rewrite" }>; onSolved: () => void; reduceMotion: boolean }) {
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);
  const THRESH = 240; // px of scrubbing to fully erase (forgiving)
  const finish = () => { if (doneRef.current) return; doneRef.current = true; vibrate(12); onSolved(); };
  const drag = usePointerDrag({
    tapThreshold: 4,
    onMove: (s) => { const p = Math.min(1, s.distance / THRESH); setProgress(p); if (p >= 1) finish(); },
  });
  const onKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setProgress(1); finish(); } };
  return (
    <div className="flex flex-1 flex-col gap-2.5">
      <div tabIndex={0} role="button" aria-label={`Rub out the myth: ${sc.myth.un}`} onKeyDown={onKeyDown} {...drag.handlers}
        className="glass-card relative flex min-h-48 flex-1 cursor-grab touch-none select-none items-center justify-center overflow-hidden rounded-3xl px-6 py-10 text-center focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-ink)] active:cursor-grabbing">
        <p className="text-[19px] font-bold leading-snug text-foreground" style={{ opacity: reduceMotion ? (progress >= 1 ? 0.12 : 1) : 1 - progress * 0.85, filter: reduceMotion ? undefined : `blur(${progress * 2.5}px)`, textDecoration: progress > 0.4 ? "line-through" : undefined }}>{sc.myth.un}</p>
        <span className="pointer-events-none absolute bottom-2 right-3 text-xs font-semibold text-foreground/40" aria-hidden>✏️ rub it out</span>
      </div>
      <p className="text-center text-xs font-semibold text-foreground/60">Scrub the myth away — or press Enter</p>
    </div>
  );
}

// branch — pick a choice; HEAR + see its consequence; the safe (best) choice leads on, others gently
// redirect. If a scenario has no `best` at all, any pick advances (never a soft-lock).
function BranchPlay({ sc, onSolved, say }: { sc: Extract<Scenario, { type: "branch" }>; onSolved: (picked?: string, branch?: { text: string; best: boolean }) => void; say: (t: string) => void }) {
  const [opts] = useState(() => shuffle(sc.options)); // best is authored at index 0 — shuffle so there's no "tap the top" tell
  // a non-advancing pick on a "find the best" branch shows the consequence + a re-pick (stays in play); an
  // advancing pick hands off to the engine so the consequence + Next render in the standard (bottom-pinned) resolve.
  const [repick, setRepick] = useState<number | null>(null);
  const hasBest = opts.some((o) => o.best);
  const pick = (i: number) => {
    const o = opts[i];
    say(o.consequence);
    if (o.best || !hasBest) { if (o.best) vibrate(12); onSolved(undefined, { text: o.consequence, best: !!o.best }); }
    else setRepick(i);
  };
  if (repick !== null) {
    const o = opts[repick];
    return (
      <div className="flex flex-col gap-2.5">
        <div className="glass-pill rounded-2xl px-4 py-3 text-center text-[15px] font-semibold backdrop-blur-md" style={{ color: "var(--color-ink)" }}>💛 {o.consequence}</div>
        <button type="button" onClick={() => setRepick(null)} className="glass-pill flex h-12 w-full items-center justify-center rounded-2xl text-base font-bold text-foreground backdrop-blur-md transition-transform active:scale-95">Let&apos;s find the safe way →</button>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2.5">
      {opts.map((o, i) => (
        <button key={i} type="button" onClick={() => pick(i)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-4 text-left text-[15px] font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.97]">
          <span className="text-2xl" aria-hidden>🔀</span><span className="flex-1">{o.text}</span>
        </button>
      ))}
    </div>
  );
}

// sort — DRAG a chip into its bin (the bin under the finger highlights; release snaps it in). Tap-to-arm then
// tap-a-bin is kept verbatim as the fallback — it IS the keyboard / screen-reader / ages-3–6 path (chips & bins
// are native buttons). A wrong bin springs back + a warm nudge (no fail); colour is never the only signal (each
// bin keeps its emoji + word). Reduced motion drops the lift/pulse animation, not the function.
function SortPlay({ sc, onSolved, say, reduceMotion }: { sc: Extract<Scenario, { type: "sort" }>; onSolved: () => void; say: (t: string) => void; reduceMotion: boolean }) {
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [order] = useState(() => shuffle(sc.items)); // display order — shuffle so the answer pattern (e.g. up/down/up/down) isn't memorisable across replays
  const [sel, setSel] = useState<string | null>(null);
  const [wrong, setWrong] = useState(false);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const binEls = useRef<Record<string, HTMLElement | null>>({});
  const dragId = useRef<string | null>(null);
  const styles = binStyles(sc.bins);
  const itemText = (id: string) => sc.items.find((it) => it.id === id)?.text ?? "";
  const zones = () => sc.bins.map((b) => ({ id: b.id, el: binEls.current[b.id] }));

  const place = (itemId: string, binId: string) => {
    if (sc.key[itemId] === binId) {
      const np = { ...placed, [itemId]: binId }; setPlaced(np); setSel(null); setWrong(false);
      const bin = sc.bins.find((b) => b.id === binId);
      say(`${itemText(itemId)} — ${bin?.label}. ✓`);
      if (Object.keys(np).length >= sc.items.length) onSolved();
    } else { setWrong(true); say("Not there — try another bin."); }
  };
  const arm = (id: string) => { setSel(id); setWrong(false); };
  const pointer = usePointerDrag({
    onStart: (s, e) => { const id = (e.currentTarget as HTMLElement).dataset.id ?? null; dragId.current = id; if (id) { arm(id); setDrag({ id, x: s.x, y: s.y }); } },
    onMove: (s) => { const id = dragId.current; if (!id) return; setDrag({ id, x: s.x, y: s.y }); setHover(hitTestZone(s.x, s.y, zones(), 44)); },
    onEnd: (s) => { const id = dragId.current; dragId.current = null; const bin = hitTestZone(s.x, s.y, zones(), 44); setDrag(null); setHover(null); if (id && bin) place(id, bin); },
    onTap: () => { dragId.current = null; setDrag(null); setHover(null); }, // arming already happened in onStart
  });
  // Safety net: a pointerup/cancel ANYWHERE clears the floating ghost, even if the chip's own pointerup was missed
  // (pointer-capture loss, a fast release off-element, or a mid-drag re-render) — otherwise a dragged chip could
  // "stick" to the cursor. The chip's own onEnd still runs first (so a valid drop still places), then this clears.
  useEffect(() => {
    const clear = () => { dragId.current = null; setDrag(null); setHover(null); };
    window.addEventListener("pointerup", clear);
    window.addEventListener("pointercancel", clear);
    return () => { window.removeEventListener("pointerup", clear); window.removeEventListener("pointercancel", clear); };
  }, []);

  // one dropzone: a single dashed border + translucent tint fill (no card double-border); flex-1 so two bins
  // stacked top/bottom each grow big. Tap to drop the armed chip, or release a dragged chip over it.
  const renderBin = (b: { id: string; label: string }, bi: number) => {
    const st = styles[bi];
    const inBin = sc.items.filter((it) => placed[it.id] === b.id);
    const armed = (!!sel && !drag) || hover === b.id;
    return (
      <button key={b.id} type="button" ref={(el) => { binEls.current[b.id] = el; }} onClick={() => { if (sel) place(sel, b.id); }}
        className={`flex flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${hover === b.id ? "border-solid" : "border-dashed"}`}
        style={{ borderColor: st.tint, background: `color-mix(in srgb, ${st.tint} ${hover === b.id ? "24%" : "9%"}, transparent)` }}>
        <span className="text-3xl" aria-hidden>{st.emoji}</span>
        <span className="text-sm font-extrabold text-foreground">{b.label}{armed ? " ⤵" : ""}</span>
        {inBin.length > 0 && <div className="flex flex-wrap justify-center gap-1">{inBin.map((it) => <span key={it.id} className="rounded-full bg-[var(--color-sun)] px-2 py-0.5 text-[11px] font-bold text-slate-900">{it.text} ✓</span>)}</div>}
      </button>
    );
  };
  const chips = (
    <div className="flex flex-col gap-1.5">
      {sel && !drag && <p className="text-center text-xs font-semibold text-foreground/70" aria-hidden>Carrying “{itemText(sel)}” — drop it in a zone</p>}
      <div className="flex flex-wrap justify-center gap-2">
        {order.filter((it) => !placed[it.id]).map((it) => (
          <button key={it.id} type="button" data-id={it.id} onClick={() => arm(it.id)} {...pointer.handlers}
            className={`glass-card touch-none rounded-2xl px-3 py-2.5 text-sm font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-95 ${sel === it.id && !drag && !reduceMotion ? "animate-pulse" : ""} ${drag?.id === it.id ? "opacity-30" : ""}`}
            style={sel === it.id && !drag ? { boxShadow: "inset 0 0 0 2.5px var(--color-ink)" } : undefined}>{it.text}</button>
        ))}
      </div>
      {wrong && <p className="text-center text-xs font-semibold text-foreground/70">Not there — try another zone. 💛</p>}
    </div>
  );
  const ghost = drag && !reduceMotion && (
    <div className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[var(--color-sun)] px-3 py-2.5 text-sm font-bold text-slate-900 shadow-lg" style={{ left: drag.x, top: drag.y }}>{itemText(drag.id)}</div>
  );
  // Two bins → big dropzones at top & bottom with the chips between them (Reigns-style); else a grid below.
  return sc.bins.length === 2 ? (
    <div className="flex flex-1 flex-col gap-3">
      {ghost}
      {renderBin(sc.bins[0], 0)}
      {chips}
      {renderBin(sc.bins[1], 1)}
    </div>
  ) : (
    <div className="flex flex-1 flex-col gap-3">
      {ghost}
      {chips}
      <div className="grid flex-1 grid-cols-2 gap-2.5">{sc.bins.map(renderBin)}</div>
    </div>
  );
}

// match — DRAW a cord from a left cell to its right cell (a live cord follows the finger; release on the right
// cell locks a persistent cord and stamps a shared number-token on BOTH ends, so the bond is readable without
// colour AND without the cord). Tap-a-left then tap-a-right is kept as the keyboard / screen-reader / ages-3–6
// fallback (cells are native buttons). A wrong release retracts + a warm nudge (no fail).
const MATCH_GLYPHS = ["①", "②", "③", "④", "⑤", "⑥"];
// Pair identity only — asserts nothing. Shares the neutral wheel (and is exported so capstone-rich
// imports it instead of keeping a verbatim clone that could silently diverge).
export const MATCH_TINTS = ["var(--prx-slot-1)", "var(--prx-slot-2)", "var(--prx-slot-3)", "var(--prx-slot-4)", "var(--prx-slot-5)", "var(--prx-slot-6)"];
function MatchPlay({ sc, onSolved, say, reduceMotion }: { sc: Extract<Scenario, { type: "match" }>; onSolved: () => void; say: (t: string) => void; reduceMotion: boolean }) {
  const [pairsOrder] = useState(() => shuffle(sc.pairs)); // left-column display order — shuffle so the left list isn't fixed across replays (rights are shuffled independently below)
  const [rights] = useState(() => shuffle(sc.pairs.map((p) => p.right)));
  const [matched, setMatched] = useState<string[]>([]); // left texts in connect order (→ shared glyph index)
  const [selLeft, setSelLeft] = useState<string | null>(null);
  const [wrong, setWrong] = useState(false);
  const [live, setLive] = useState<Cord | null>(null);
  const [locked, setLocked] = useState<Cord[]>([]);
  const [hover, setHover] = useState<string | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const leftEls = useRef<Record<string, HTMLElement | null>>({});
  const rightEls = useRef<Record<string, HTMLElement | null>>({});
  const dragLeft = useRef<string | null>(null);

  const rightOf = (left: string) => sc.pairs.find((p) => p.left === left)?.right;
  const tokenOf = (left: string) => MATCH_GLYPHS[matched.indexOf(left) % MATCH_GLYPHS.length];
  const anchor = (el: HTMLElement | null, side: "l" | "r") => {
    const w = wrap.current; if (!el || !w) return null;
    const r = el.getBoundingClientRect(), c = w.getBoundingClientRect();
    return { x: (side === "r" ? r.right : r.left) - c.left, y: r.top + r.height / 2 - c.top };
  };
  const recompute = useCallback(() => {
    const cords: Cord[] = [];
    matched.forEach((left, i) => {
      const r = rightOf(left); const a = anchor(leftEls.current[left], "r"); const b = r ? anchor(rightEls.current[r], "l") : null;
      if (a && b) cords.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, tint: MATCH_TINTS[i % MATCH_TINTS.length] });
    });
    setLocked(cords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);
  useEffect(() => { recompute(); const on = () => recompute(); window.addEventListener("resize", on); return () => window.removeEventListener("resize", on); }, [recompute]);

  const rightZones = () => rights.map((r) => ({ id: r, el: rightEls.current[r] }));
  const connect = (left: string, right: string) => {
    if (rightOf(left) === right) {
      const nm = [...matched, left]; setMatched(nm); setSelLeft(null); setWrong(false);
      say(`${left} — ${right}. ✓`);
      if (nm.length >= sc.pairs.length) onSolved();
    } else { setWrong(true); say("Not a match — try another."); }
  };
  const liveFrom = (left: string, x: number, y: number) => {
    const a = anchor(leftEls.current[left], "r"), w = wrap.current; if (!a || !w) return;
    const c = w.getBoundingClientRect(); setLive({ x1: a.x, y1: a.y, x2: x - c.left, y2: y - c.top, tint: "var(--color-ink)" });
  };
  const pointer = usePointerDrag({
    onStart: (s, e) => { const left = (e.currentTarget as HTMLElement).dataset.left ?? null; dragLeft.current = left; if (left) { setSelLeft(left); setWrong(false); liveFrom(left, s.x, s.y); } },
    onMove: (s) => { const left = dragLeft.current; if (!left) return; liveFrom(left, s.x, s.y); setHover(hitTestZone(s.x, s.y, rightZones(), 36)); },
    onEnd: (s) => { const left = dragLeft.current; dragLeft.current = null; const right = hitTestZone(s.x, s.y, rightZones(), 36); setLive(null); setHover(null); if (left && right) connect(left, right); },
    onTap: () => { dragLeft.current = null; setLive(null); setHover(null); }, // selLeft armed in onStart → tap a right cell
  });
  const rightDone = (r: string) => sc.pairs.some((p) => p.right === r && matched.includes(p.left));
  const rightToken = (r: string) => { const left = sc.pairs.find((p) => p.right === r && matched.includes(p.left))?.left; return left ? tokenOf(left) : ""; };

  return (
    <div className="flex flex-col gap-2.5">
      {wrong && <p className="text-center text-xs font-semibold text-foreground/70">Not a match — try another. 💛</p>}
      {/* one grid with auto-rows:1fr so every cell (left & right) is the SAME height — tidy, aligned cords */}
      <div ref={wrap} className="relative">
        <div className="grid grid-cols-2 gap-2.5" style={{ gridAutoRows: "1fr" }}>
          {pairsOrder.map((p, i) => {
            const r = rights[i];
            return (
              <Fragment key={i}>
                <button type="button" data-left={p.left} ref={(el) => { leftEls.current[p.left] = el; }} disabled={matched.includes(p.left)} onClick={() => { setSelLeft(p.left); setWrong(false); }} {...pointer.handlers}
                  className={`glass-card flex touch-none items-center justify-center rounded-2xl px-3 py-3 text-center text-sm font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-95 disabled:opacity-100 ${selLeft === p.left && !reduceMotion ? "animate-pulse" : ""}`}
                  style={matched.includes(p.left) ? { boxShadow: "inset 0 0 0 2.5px var(--prx-pos)" } : selLeft === p.left ? { boxShadow: "inset 0 0 0 2.5px var(--color-ink)" } : undefined}>
                  {matched.includes(p.left) ? `${tokenOf(p.left)} ${p.left}` : p.left}
                </button>
                <button type="button" ref={(el) => { rightEls.current[r] = el; }} disabled={rightDone(r)} onClick={() => { if (selLeft) connect(selLeft, r); }}
                  className="glass-card flex items-center justify-center rounded-2xl px-3 py-3 text-center text-sm font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-95 disabled:opacity-100"
                  style={rightDone(r) ? { boxShadow: "inset 0 0 0 2.5px var(--prx-pos)" } : hover === r ? { boxShadow: "inset 0 0 0 3.5px var(--color-ink)" } : undefined}>
                  {rightDone(r) ? `${rightToken(r)} ${r}` : r}
                </button>
              </Fragment>
            );
          })}
        </div>
        <ConnectorOverlay cords={locked} live={live} />
      </div>
    </div>
  );
}

// build — DRAG a piece onto the slate (or tap it) to add it. ASSEMBLE: order-free — a key piece seats, a
// distractor bounces back + a warm nudge (the key is ACTUALLY checked — fixes the old always-wins bug).
// SEQUENCE: add in the right order. The "done" confirm needs ALL key pieces (fixes the old min(3) truncation
// that silently accepted 3 of a 4-piece answer). Tap is the keyboard / ages-3–6 fallback. No-fail throughout.
function BuildPlay({ sc, onSolved, say, labels, reduceMotion }: { sc: Extract<Scenario, { type: "build" }>; onSolved: () => void; say: (t: string) => void; labels?: { assemble?: string; sequence?: string }; reduceMotion: boolean }) {
  const [chosen, setChosen] = useState<string[]>([]);
  const [display] = useState(() => (sc.mode === "sequence" ? shuffle(sc.pieces) : sc.pieces));
  const [drag, setDrag] = useState<{ piece: string; x: number; y: number } | null>(null);
  const [over, setOver] = useState(false);
  const slate = useRef<HTMLDivElement>(null);
  const dragP = useRef<string | null>(null);
  const target = sc.key.length; // ALL key pieces (both modes) — no truncation
  const add = (piece: string) => {
    if (chosen.includes(piece)) return;
    if (sc.mode === "sequence") {
      if (sc.key[chosen.length] === piece) setChosen((c) => [...c, piece]);
      else say("Hmm, which comes first?");
    } else if (sc.key.includes(piece)) setChosen((c) => [...c, piece]); // assemble: only real answer pieces seat
    else say("That one doesn't belong — try another.");
  };
  const zones = () => [{ id: "slate", el: slate.current }];
  const pointer = usePointerDrag({
    onStart: (s, e) => { const p = (e.currentTarget as HTMLElement).dataset.piece ?? null; dragP.current = p; if (p && !chosen.includes(p)) setDrag({ piece: p, x: s.x, y: s.y }); },
    onMove: (s) => { const p = dragP.current; if (!p) return; setDrag({ piece: p, x: s.x, y: s.y }); setOver(!!hitTestZone(s.x, s.y, zones(), 48)); },
    onEnd: (s) => { const p = dragP.current; dragP.current = null; const on = hitTestZone(s.x, s.y, zones(), 48); setDrag(null); setOver(false); if (p && on) add(p); },
    onTap: () => { dragP.current = null; setDrag(null); setOver(false); },
  });
  const remaining = sc.pieces.filter((p) => !chosen.includes(p));
  const enough = chosen.length >= target;
  return (
    <div className="flex flex-1 flex-col gap-3">
      {drag && !reduceMotion && (
        <div className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-sun)] px-3 py-1.5 text-sm font-bold text-slate-900 shadow-lg" style={{ left: drag.x, top: drag.y }}>{drag.piece}</div>
      )}
      <div ref={slate} className="glass-card flex min-h-40 flex-1 flex-wrap content-center justify-center gap-1.5 rounded-2xl p-3 backdrop-blur-[12px] transition-shadow" style={over ? { boxShadow: "inset 0 0 0 3px var(--color-ink)" } : undefined}>
        {chosen.length === 0 ? <span className="text-xs font-semibold text-foreground/50">{over ? "Drop it here ⤵" : "Drag or tap pieces here…"}</span> :
          chosen.map((p, i) => <span key={p} className="rounded-full bg-[var(--color-sun)] px-3 py-1 text-sm font-bold text-slate-900">{sc.mode === "sequence" ? `${i + 1}. ` : ""}{p}</span>)}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {(sc.mode === "sequence" ? display : remaining).map((p) => (
          <button key={p} type="button" data-piece={p} disabled={sc.mode === "sequence" && chosen.includes(p)} onClick={() => add(p)} {...pointer.handlers}
            className={`glass-card touch-none rounded-2xl px-3 py-2.5 text-sm font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-95 disabled:opacity-40 ${drag?.piece === p ? "opacity-30" : ""}`}>{p}</button>
        ))}
      </div>
      <button type="button" disabled={!enough} onClick={onSolved} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95 disabled:opacity-50">
        <ShieldCheck className="size-5" aria-hidden /> {sc.mode === "sequence" ? (labels?.sequence ?? "That's my plan!") : (labels?.assemble ?? "That's my team!")}
      </button>
    </div>
  );
}

// explore-label — split by payload. ANATOMY beats (the parts are locatable body parts) render a friendly body
// figure and you tap the part ON the body — the real "find the part" discovery verb; it lights up on the figure.
// ABSTRACT beats (the answer is a concept, not a body part) drop the explore masquerade and become honest
// "which is true?" option cards (each with a distinct neutral icon). A wrong tap warmly re-asks (no fail). The
// anatomy/abstract split is detected from content (every part maps to a body region → anatomy), so no schema
// change. The decorative SVG is aria-hidden; the tappable regions are real labelled <button>s (AT-operable).
const BODY_POS: Record<string, { x: number; y: number }> = {
  hair: { x: 50, y: 4 }, brain: { x: 50, y: 10 }, lungs: { x: 58, y: 32 }, heart: { x: 42, y: 35 },
  muscles: { x: 24, y: 36 }, skin: { x: 74, y: 47 }, tummy: { x: 50, y: 50 }, bones: { x: 50, y: 74 }, foot: { x: 45, y: 96 },
};
function bodyRegion(part: string): string | null {
  const o = part.toLowerCase();
  if (o.includes("brain")) return "brain";
  if (o.includes("hair")) return "hair";
  if (o.includes("heart")) return "heart";
  if (o.includes("lung")) return "lungs";
  if (o.includes("tummy") || o.includes("gut")) return "tummy";
  if (o.includes("bone") || o.includes("skeleton")) return "bones";
  if (o.includes("muscle")) return "muscles";
  if (o.includes("skin")) return "skin";
  if (o.includes("foot") || o.includes("feet")) return "foot";
  return null;
}
function BodyFigure() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
      <g fill="var(--color-mist)" stroke="var(--color-ink)" strokeWidth={1.2} opacity={0.85}>
        <circle cx={50} cy={11} r={9} />
        <rect x={38} y={20} width={24} height={37} rx={11} />
        <rect x={25} y={23} width={8} height={27} rx={4} />
        <rect x={67} y={23} width={8} height={27} rx={4} />
        <rect x={41} y={55} width={7.5} height={41} rx={3.5} />
        <rect x={51.5} y={55} width={7.5} height={41} rx={3.5} />
      </g>
    </svg>
  );
}
function ExploreLabelPlay({ sc, onSolved, say }: { sc: Extract<Scenario, { type: "explore-label" }>; onSolved: () => void; say: (t: string) => void }) {
  const isAnatomy = sc.parts.every((p) => bodyRegion(p));
  const [cards] = useState(() => shuffle(sc.parts)); // abstract: shuffle so the answer slot varies
  const [wrong, setWrong] = useState(false);
  const [found, setFound] = useState<string | null>(null);
  const choose = (p: string) => {
    if (p === sc.answer) { setFound(p); setWrong(false); vibrate(12); setTimeout(onSolved, 450); }
    else { setWrong(true); say(`Not quite — find ${sc.find}.`); }
  };
  if (isAnatomy) {
    return (
      <div className="flex flex-col gap-2.5">
        <div className="relative mx-auto aspect-[3/4] w-44">
          <BodyFigure />
          {sc.parts.map((p) => {
            const pos = BODY_POS[bodyRegion(p)!]; const got = found === p;
            return (
              <button key={p} type="button" disabled={!!found} onClick={() => choose(p)} aria-label={p}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-1 text-xs font-extrabold transition-transform active:scale-90"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, background: got ? "var(--prx-pos)" : "var(--color-sun)", color: "var(--prx-on-fill)", boxShadow: got ? "0 0 0 7px color-mix(in srgb, var(--prx-pos) 35%, transparent)" : "0 1px 4px rgba(0,0,0,0.25)" }}>
                {got ? "✓ " : ""}{p}
              </button>
            );
          })}
        </div>
        {wrong && <p className="text-center text-xs font-semibold text-foreground/70">Keep exploring — find {sc.find}. 💛</p>}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2.5">
      <div className="grid grid-cols-1 gap-2.5">
        {cards.map((p, i) => {
          const got = found === p;
          return (
            <button key={p} type="button" disabled={!!found} onClick={() => choose(p)} className={`glass-card flex items-center gap-3 rounded-2xl px-4 py-4 text-left text-[15px] font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.97] ${got ? "ring-2 ring-[var(--prx-pos)]" : ""}`}>
              <span className="text-2xl" aria-hidden>{["💡", "🔆", "✨", "🌟"][i % 4]}</span><span className="flex-1">{p}</span>{got && <span aria-hidden>✓</span>}
            </button>
          );
        })}
      </div>
      {wrong && <p className="text-center text-xs font-semibold text-foreground/70">Keep exploring — find {sc.find}. 💛</p>}
    </div>
  );
}

// spot — tap the "trick"/red-flag in the scene; the item with trick:true is the answer, and `why` explains it
// on resolve. A wrong tap warmly re-asks (no fail). The safety squad's signature spot-the-trick verb.
function SpotPlay({ sc, onSolved, say }: { sc: Extract<Scenario, { type: "spot" }>; onSolved: () => void; say: (t: string) => void }) {
  const [items] = useState(() => shuffle(sc.scene)); // shuffle so the trick slots vary
  const [wrong, setWrong] = useState(false);
  const [caught, setCaught] = useState<Set<string>>(new Set());
  const tricks = sc.scene.filter((s) => s.trick).map((s) => s.id); // a scene can hide MORE THAN ONE red flag
  const done = caught.size >= tricks.length;
  const plural = tricks.length > 1;
  // Cards start NEUTRAL (🔎) — the flag is the reveal, planted only on a card you catch. When a scene hides
  // several red flags (e.g. 3 truths + 2 lies) you must catch them ALL before the beat resolves (the old engine
  // resolved on the FIRST trick, so extra tricks were unreachable). Wrong tap = warm nudge (no fail).
  const choose = (it: { id: string; text: string; trick: boolean }) => {
    if (done || caught.has(it.id)) return;
    if (it.trick) {
      const nc = new Set(caught).add(it.id); setCaught(nc); setWrong(false); vibrate(12);
      const left = tricks.length - nc.size;
      if (left <= 0) setTimeout(onSolved, 450);
      else say(left === 1 ? "Caught one! One more red flag to find." : `Caught one! ${left} more red flags to find.`);
    } else { setWrong(true); say(plural ? "That one's okay. Which ones are the tricky red flags?" : "That one's okay. Which one is the tricky red flag?"); }
  };
  return (
    <div className="flex flex-col gap-2.5">
      {plural && !done && <p className="text-center text-xs font-semibold text-foreground/60" aria-live="polite">Spot all {tricks.length} red flags 🚩 — {caught.size}/{tricks.length} caught</p>}
      <div className="grid grid-cols-1 gap-2.5">
        {items.map((it) => {
          const got = caught.has(it.id);
          return (
            <button key={it.id} type="button" disabled={got || done} onClick={() => choose(it)} className={`glass-card flex items-center gap-3 rounded-2xl px-4 py-4 text-left text-[15px] font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.97] ${got ? "ring-2 ring-[var(--prx-neg)]" : ""}`}>
              <span className="text-2xl" aria-hidden>{got ? "🚩" : "🔎"}</span><span className="flex-1">{it.text}</span>{got && <span className="text-xs font-extrabold text-[var(--prx-neg)]">Caught!</span>}
            </button>
          );
        })}
      </div>
      {wrong && <p className="text-center text-xs font-semibold text-foreground/70">Keep looking — which {plural ? "ones are" : "one is"} the tricky red flag{plural ? "s" : ""}? 💛</p>}
    </div>
  );
}
