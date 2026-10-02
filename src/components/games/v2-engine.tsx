"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, ShieldCheck, Phone } from "lucide-react";
import { greetWithName } from "@/lib/personalize";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { LensyQuestion, RevealGate, cleanLine, clueLine, joinQuestion, pairLine, plainLabel, revealDelayMs } from "@/components/games/lensy-question";
import { AnswerCard, CornerBadge } from "@/components/games/answer-cells";
import { MatchBoard } from "@/components/games/match-board";
import { SwipeCard, type SideStyle } from "@/components/games/swipe-card";
import { UnReBeat } from "@/components/games/un-re";
import { StoryPlay } from "@/components/games/story-play";
import { ReflectPlay, type ReflectBand } from "@/components/games/reflect-play";
import { NODES } from "@/content/path";
import { useProfile } from "@/lib/store";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { usePointerDrag, hitTestZone } from "@/components/games/interactions";
import { prefersReducedMotion } from "@/lib/juice";
import { shuffle, byCat, isStory, type Scenario, type V2GameConfig } from "@/content/games/v2-schema";

// The shared v2 "mechanic-embodying" engine: renders any game's typed scenario library as the micro-loop
// (Hook → Play → Reassure → Sticker), with one bespoke interaction per mechanic so the lesson IS the verb,
// never a binary tap. No hard fail (a wrong move gets a warm nudge); audio-first; Calm Mode drives
// prefersReducedMotion; a help route on every screen; optional grown-up co-play. Used by g01, g02, …

// Bin tinting. Colour is NEVER the only signal: every bin shows its word plus a symbol cue.
//
// A bin's meaning comes from its DECLARED `valence`, never from its prose. This previously fell back to a
// ~152-alternative English regex over the label, which meant a bin's colour: and therefore the visual
// answer key: was a function of author wording, and silently wrong in any non-English locale. All 8,676
// bins in the catalog now declare a valence, so that regex is deleted rather than kept as a fallback:
// an undeclared bin gets a NEUTRAL position colour and asserts nothing, instead of being guessed at.
// See knowledge/architecture/creator-identity.md.
// Non-semantic position wheel. SIX slots, because six sorts in the catalog have 5-6 bins and the old
// 4-slot ring made bins 5-6 render identically to 1-2. None of these is the pos/neg/tell/uhoh hue, so an
// undeclared bin can never be mistaken for a declared one: the old slots 3 and 4 were byte-identical to
// VALENCE_STYLE.pos and .tell, which made "neutral asserts nothing" false as implemented.
const NEUTRAL_BINS = [
  { emoji: "🔵", tint: "var(--prx-slot-1)" }, { emoji: "🟣", tint: "var(--prx-slot-2)" },
  { emoji: "🟠", tint: "var(--prx-slot-3)" }, { emoji: "🔶", tint: "var(--prx-slot-4)" },
  { emoji: "🟤", tint: "var(--prx-slot-5)" }, { emoji: "⬛", tint: "var(--prx-slot-6)" },
];
// Explicit-valence palette: used when a bin DECLARES its meaning (new content), so the engine never guesses.
// Names a helpline or help service (SWED-88): the numbers and names on the helpline allowlist, plus counsellors.
const HELP_ROUTE = /\b(?:1098|181|1091|112|14416|1930|15100|child\s?line|tele[-\s]?manas|help ?line|pocso e-?box|counsell?or)\b/i;

// The text of a scenario's best answers (and what follows them), where a routed ending says where help is.
function bestTexts(s: Scenario): string[] {
  if (isStory(s)) return s.steps.flatMap((st) => st.options.filter((o) => o.best).flatMap((o) => [o.text, o.then]));
  if (s.type === "branch") return (s.options ?? []).filter((o) => o.best).flatMap((o) => [o.text, o.consequence]);
  if (s.type === "role-play") return (s.yourLine ?? []).filter((l) => l.best).map((l) => l.text);
  return [];
}

const VALENCE_STYLE: Record<string, { emoji: string; tint: string }> = {
  pos: { emoji: "💚", tint: "var(--prx-pos)" }, neg: { emoji: "🛑", tint: "var(--prx-neg)" },
  tell: { emoji: "🗣️", tint: "var(--prx-tell)" }, uhoh: { emoji: "😬", tint: "var(--prx-uhoh)" },
};
// Guarantee the bins of one sort are visually distinct: if two would share a tint, fall back to a
// position-based neutral palette so a non-reader always has a per-bin colour + emoji cue.
// exported so the shared rich-capstone engine renders its sort dropzones with the SAME valence tinting.
// A bin's explicit `valence` wins (pos/neg/tell/uhoh, or neutral→position colour); a bin WITHOUT one gets a
// neutral position colour: the engine never infers meaning from the label.
export function binStyles(bins: { label: string; valence?: string }[]): { emoji: string; tint: string }[] {
  const s = bins.map((b, i) => (b.valence && b.valence !== "neutral" ? (VALENCE_STYLE[b.valence] ?? NEUTRAL_BINS[i % NEUTRAL_BINS.length]) : NEUTRAL_BINS[i % NEUTRAL_BINS.length]));
  return new Set(s.map((x) => x.tint)).size < bins.length ? bins.map((_, i) => NEUTRAL_BINS[i % NEUTRAL_BINS.length]) : s;
}
const vibrate = (ms: number | number[]) => { try { navigator.vibrate?.(ms); } catch { /* unsupported */ } };
// a or b at random, except that a third of the same kind in a row is never allowed
const alternate = <T,>(history: T[], a: T, b: T): T => {
  const [x, y] = history.slice(-2);
  if (history.length >= 2 && x === y) return x === a ? b : a;
  return Math.random() < 0.5 ? a : b;
};

// ---- anti-repeat rotation memory ----
// shuffle() is memoryless, so with a shallow bank the same beats resurface session to session. We keep a small
// per-game "recently served" id ring in localStorage and draw FRESH (unseen) beats first, falling back to seen
// ones only once the unseen pool is exhausted. The ring caps at ~60% of the bank, so a beat won't recur until
// you've moved well past it: replays feel new without ever starving a category.
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
  const { scenarios, gameId, title, greet, categories, badge, helpLine, helpLabel, reassureCats = [], reassure, buildLabels, mythCards = false } = config;
  const [view, setView] = useState<"home" | "play" | "done">("home");
  const [queue, setQueue] = useState<Scenario[]>([]);
  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState<"play" | "resolve">("play");
  // a branch resolve (the picked option's consequence) shown by the engine so its Next is bottom-pinned like every
  // other mechanic: BranchPlay no longer renders its own inline Next.
  const [branchResolve, setBranchResolve] = useState<{ text: string; best: boolean } | null>(null);
  // the reflect conversation ran (SWED-97), so the affirm is already on screen and the result closes on the relearn
  const [talked, setTalked] = useState(false);
  const [stickers, setStickers] = useState<Set<string>>(new Set()); // category ids earned
  const [bubble, setBubble] = useState(() => cleanLine(greet));
  const [heard, setHeard] = useState(""); // a spoken line shown elsewhere on screen, announced but not repeated on the feedback line
  // The current beat's question stays on the card for the whole beat; nudges and results go to the feedback line.
  const [question, setQuestion] = useState("");
  // Answers are held back until the question has had a moment to be read (or the player taps to see them).
  const [revealed, setRevealed] = useState(true);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [muted, setMuted] = useState(false);
  // Calm Mode (reduce motion/confetti) is controlled in app Settings + auto-honoured from OS prefers-reduced-
  // motion via prefersReducedMotion(): no in-game toggle needed (it just cluttered the bar).
  const { profile, ready } = useProfile();
  // warm, personalised opener: "Aanya! <greet>" once the name has hydrated (empty name → unchanged)
  const greeting = useMemo(() => greetWithName(greet, profile.name), [greet, profile.name]);
  const reduceMotion = prefersReducedMotion(); // calm OR the OS prefers-reduced-motion setting: gates all motion
  const sc = queue[qi];
  // how a reflect continues after the pick (SWED-97): ages 3-6 talk to a grown-up, older players write
  const band = useMemo<ReflectBand>(() => {
    const age = NODES.find((n) => n.game === gameId)?.ageGate ?? 12;
    return age < 6 ? "talk" : age < 18 ? "kids" : "adults";
  }, [gameId]);

  // say() speaks `t`; `shown` replaces what the feedback line displays ("" when a card already shows the line).
  const say = useCallback((t: string, shown?: string) => {
    const line = cleanLine(t), visible = shown === undefined ? line : cleanLine(shown);
    setBubble(visible); setHeard(visible === line ? "" : line); speak(line, { muted });
  }, [muted]);

  // greet once: but wait for the profile (name) to hydrate so the opener can be personalised
  const greetedRef = useRef(false);
  useEffect(() => {
    if (greetedRef.current || !ready) return;
    greetedRef.current = true;
    setBubble(cleanLine(greeting));
    speak(cleanLine(greeting), { muted });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, greeting]);
  useEffect(() => () => stopSpeaking(), []);

  const hookLine = (s: Scenario): string => {
    if (isStory(s)) return joinQuestion(s.type === "role-play" ? joinQuestion(s.hook, s.setup) : s.hook, s.steps[0].prompt);
    if (s.type === "reflect" || s.type === "choose") return joinQuestion(s.hook, s.prompt);
    if (s.type === "role-play") return joinQuestion(s.hook, s.setup);
    if (s.type === "build") return joinQuestion(s.hook, s.prompt);
    // explore-label: the hook is already the instruction and `find` is a clue saved for a wrong tap; swipe: the card
    // shows the instruction only and the cue lives on the swipe card
    return cleanLine(s.hook);
  };
  const resolveLine = (s: Scenario): string =>
    s.type === "reflect" ? s.affirm : s.type === "branch" ? s.debrief : s.type === "strike-rewrite" ? `${s.myth.re} ${s.myth.why}` : s.type === "explore-label" ? s.reveal : s.type === "spot" ? s.why : s.relearn;
  // A beat is a "safety" beat (gets the "never your fault" reassurance + the help pill) if its category is
  // listed OR it's a branch with an escape-and-tell best choice (outcome:"safe"), so grooming/unsafe-touch
  // beats that live in other categories (e.g. consent-stop) still surface the reassurance.
  // A routed ending (SWED-88) counts too: its best answer names a helpline or a help service, so the player who
  // chose it is shown where help is, whatever the category or outcome label.
  const isSafetyBeat = (s: Scenario): boolean =>
    reassureCats.includes(s.cat) || (s.type === "branch" && (isStory(s) ? s.steps.flatMap((st) => st.options) : s.options ?? []).some((o) => o.outcome === "safe")) ||
    bestTexts(s).some((t) => HELP_ROUTE.test(t));

  // Myth cards (SWED-70): with `mythCards` on, a strike-rewrite beat is a scrub or a swipe card about half the time,
  // never three of a kind in a row, and a card shows the myth or its truth on the same rule. The question card then
  // gives a neutral instruction instead of a hook that may quote the myth, and the card's words are spoken after it.
  const [mythCard, setMythCard] = useState<"myth" | "truth" | null>(null);
  const questionSpeech = useRef(""); // what "Hear it again" reads: the question, plus a myth card's words
  const strikeRuns = useRef<{ shape: ("scrub" | "card")[]; side: ("myth" | "truth")[] }>({ shape: [], side: [] });
  const present = useCallback((s: Scenario) => {
    let card: "myth" | "truth" | null = null;
    if (s.type === "strike-rewrite" && mythCards) {
      const runs = strikeRuns.current;
      const shape = alternate(runs.shape, "scrub", "card");
      runs.shape.push(shape);
      if (shape === "card") { card = alternate(runs.side, "myth", "truth"); runs.side.push(card); }
    }
    const q = card ? MYTH_CARD_QUESTION : hookLine(s);
    setBranchResolve(null); setPhase("play"); setQuestion(q); setRevealed(false); setMythCard(card); setTalked(false);
    questionSpeech.current = card && s.type === "strike-rewrite" ? `${q} ${card === "myth" ? s.myth.un : s.myth.re}` : q;
    say(questionSpeech.current, q);
  }, [say, mythCards]);

  // A beat that continues after its first answer (a reflect conversation, SWED-97, or a multi-step branch or
  // role-play, SWED-96) asks its next question on the same card: the renderer holds its own
  // answers back, so this changes the card, speaks it (after `lead`, when given) and moves focus to it without
  // unmounting the renderer.
  const [asked, setAsked] = useState(0);
  const ask = useCallback((q: string, lead?: string) => {
    const line = cleanLine(q);
    setQuestion(line); setAsked((n) => n + 1);
    questionSpeech.current = line;
    say(lead ? `${cleanLine(lead)} ${line}` : line, line);
  }, [say]);

  // Hold the answers until the question has been read. A timer, not speech onEnd: muting mid-line cancels
  // onEnd (lib/speak.ts), which would leave the answers hidden. Tapping the question or the gate skips the wait.
  useEffect(() => {
    if (view !== "play" || phase !== "play" || revealed || !question) return;
    const t = window.setTimeout(() => setRevealed(true), revealDelayMs(question));
    return () => window.clearTimeout(t);
  }, [view, phase, revealed, question]);

  // Keyboard and screen-reader users continue from the result without hunting for Next.
  useEffect(() => {
    if (view === "play" && phase === "resolve") nextRef.current?.focus({ preventScroll: true });
  }, [view, phase, qi]);

  // Rotation: one beat per category, drawn UNSEEN-first (anti-repeat), not just shuffled. Picking by natural
  // frequency (not forced mechanic variety) keeps beats representative of each category's real mix; the seen-ring
  // keeps them from recurring until you've moved well past them.
  const startRotate = () => {
    const seen = new Set(loadSeen(gameId));
    const q = categories.map((cat) => chooseFresh(byCat(scenarios, cat.id), 1, seen)[0]).filter(Boolean);
    recordSeen(gameId, q, scenarios.length);
    setQueue(q); setQi(0); setView("play"); present(q[0]);
  };
  // One category, SIX beats: six distinct scenarios drawn unseen-first from the category (no forced mechanic
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
  const solve = (picked?: string, branch?: { text: string; best: boolean }, conversation = false) => {
    if (!sc) return;
    earn(sc.cat);
    celebrate("small");
    vibrate(sc.type === "role-play" ? [16, 40, 16] : 12);
    setBranchResolve(branch ?? null);
    setPhase("resolve");
    if (branch) return; // the branch consequence was already spoken on pick
    if (conversation && sc.type === "reflect") { setTalked(true); say(sc.relearn); return; }
    const line = resolveLine(sc);
    say(picked && sc.type === "reflect" ? `${picked}. ${line}` : line);
  };

  const next = () => {
    const ni = qi + 1;
    if (ni < queue.length) { setQi(ni); present(queue[ni]); return; }
    // Transition immediately: do NOT gate the only path to "done" on a speech onEnd callback (which a
    // muted/3-6-y/o tap could swallow). GameDone mounts on the done screen and the badge narrates there.
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
        <button type="button" aria-label="Hear it again" onClick={() => (view === "play" && phase === "play" && question ? speak(questionSpeech.current, { muted }) : replay())} className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
          <RotateCcw className="size-4" aria-hidden />
        </button>
      )}
      {muteBtn}
    </span>
  );
  // Lensy's question card leads every beat. While playing, the card keeps the question and the line beneath it
  // carries nudges and confirmations; on a result, the result card shows the text and the line announces it to
  // screen readers (including the branch verdict, which was otherwise only an emoji).
  const playing = view === "play" && !!sc;
  const cardText = playing ? question : bubble;
  const feedbackText = playing && phase === "play" && bubble !== question ? bubble : "";
  const announceText = !playing ? "" : phase === "resolve"
    ? branchResolve ? `${branchResolve.best ? "That's the best choice. " : ""}${branchResolve.text}` : bubble
    : heard;
  const SamSays = (
    <LensyQuestion
      text={cardText}
      feedback={feedbackText}
      announce={announceText}
      focusKey={playing ? `${qi}:${sc?.id}:${asked}` : undefined}
      onTap={playing && phase === "play" && !revealed ? () => setRevealed(true) : undefined}
    />
  );
  // Progress = a compact strip of category dots at the very top (small, not a card).
  const StickerBook = (
    <div className="flex items-center justify-center gap-2" aria-label={`${stickers.size} of ${categories.length} earned`}>
      {categories.map((c) => (
        <span key={c.id} className={`grid place-items-center rounded-full ${stickers.has(c.id) ? "size-6 text-lg" : "size-2.5"} ${stickers.has(c.id) && !reduceMotion ? "animate-in zoom-in duration-300" : ""}`} style={{ background: stickers.has(c.id) ? "transparent" : "var(--color-mist)", opacity: stickers.has(c.id) ? 1 : 0.55 }} aria-hidden>{stickers.has(c.id) ? c.emoji : ""}</span>
      ))}
    </div>
  );
  // Home is a quiet, tertiary text button: not a card.
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
          {/* HOME: pick a topic (the "Play with Lensy" CTA is pinned at the bottom) */}
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

          {/* PLAY: Lensy's question card carries the hook; the answers follow once it has been read. */}
          {view === "play" && sc && (phase === "play" || sc.type === "choose" || sc.type === "reflect" || isStory(sc)) && (revealed ? (
            <div className={`flex flex-1 flex-col gap-4 ${reduceMotion ? "" : "animate-in fade-in slide-in-from-bottom-2 duration-300"}`}>
              {sc.type === "reflect" ? (
                <ReflectPlay key={sc.id} sc={sc} band={band} safety={isSafetyBeat(sc)} ask={ask} say={say} onSolved={solve} done={phase === "resolve"} help={HelpPill} />
              ) : (
                <Play key={sc.id} sc={sc} onSolved={solve} say={say} ask={ask} done={phase === "resolve"} reduceMotion={reduceMotion} buildLabels={buildLabels} mythCard={mythCard} />
              )}
            </div>
          ) : <RevealGate onReveal={() => setRevealed(true)} />)}
          {view === "play" && sc && phase === "resolve" && (
            <>
              {sc.type === "strike-rewrite" ? (
                <UnReBeat un={sc.myth.un} re={sc.myth.re} why={sc.myth.why} fill />
              ) : branchResolve ? (
                <div className="glass-pill rounded-2xl px-4 py-3 text-center text-[15px] font-semibold leading-relaxed backdrop-blur-md" style={{ color: "var(--color-ink)" }}>{branchResolve.best ? "💚 " : "💛 "}{branchResolve.text}</div>
              ) : (
                <div className="glass-pill rounded-2xl px-4 py-3 text-center text-[15px] font-semibold leading-relaxed backdrop-blur-md" style={{ color: "var(--color-ink)" }}>💛 {talked && sc.type === "reflect" ? sc.relearn : resolveLine(sc)}</div>
              )}
              {reassure && isSafetyBeat(sc) && (
                <div className="glass-pill rounded-2xl px-4 py-2.5 text-center text-sm font-medium backdrop-blur-md" style={{ color: "var(--color-ink)" }}>{reassure}</div>
              )}
              {isSafetyBeat(sc) && HelpPill}
            </>
          )}
        </div>

        {/* ---- BOTTOM (pinned to the edge) ---- */}
        {/* Home's "Play with Lensy" CTA sits at the bottom (the topic grid is the browsing area above). The
            Get-Help pill was removed here (the top-bar icon covers it); it still surfaces on safety resolves. */}
        {view === "home" && (
          <button type="button" onClick={startRotate} className="cta flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-lg font-extrabold text-slate-900 transition-transform active:scale-[0.98]">
            <ShieldCheck className="size-6" aria-hidden /> Play with Lensy
          </button>
        )}
        {view === "play" && (
          <div className="flex flex-col items-stretch gap-1.5">
            {phase === "resolve" && (
              <button ref={nextRef} type="button" onClick={next} className="cta flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-extrabold text-slate-900 transition-transform active:scale-95">
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

// ============================ the mechanic renderers ============================
function Play({ sc, onSolved, say, ask, done, reduceMotion, buildLabels, mythCard }: { sc: Scenario; onSolved: (picked?: string, branch?: { text: string; best: boolean }) => void; say: (t: string, shown?: string) => void; ask: (q: string) => void; done: boolean; reduceMotion: boolean; buildLabels?: { assemble?: string; sequence?: string }; mythCard?: "myth" | "truth" | null }) {
  if (isStory(sc)) return <StoryPlay sc={sc} ask={ask} say={say} onSolved={onSolved} done={done} />;
  switch (sc.type) {
    case "reflect": return null; // V2Game renders ReflectPlay itself: the conversation needs ask, the band and help
    case "choose": return <ChoosePlay sc={sc} onSolved={onSolved} say={say} />;
    case "role-play": return <RolePlayPlay sc={sc} onSolved={onSolved} say={say} />;
    case "strike-rewrite": return mythCard
      ? <MythCardPlay sc={sc} side={mythCard} onSolved={onSolved} say={say} reduceMotion={reduceMotion} />
      : <StrikePlay sc={sc} onSolved={onSolved} reduceMotion={reduceMotion} />;
    case "branch": return <BranchPlay sc={sc} onSolved={onSolved} say={say} />;
    case "sort": return <SortPlay sc={sc} onSolved={onSolved} say={say} reduceMotion={reduceMotion} />;
    case "match": return <MatchPlay sc={sc} onSolved={onSolved} say={say} />;
    case "build": return <BuildPlay sc={sc} onSolved={onSolved} say={say} labels={buildLabels} reduceMotion={reduceMotion} />;
    case "explore-label": return <ExploreLabelPlay sc={sc} onSolved={onSolved} say={say} />;
    case "spot": return <SpotPlay sc={sc} onSolved={onSolved} say={say} />;
    case "swipe": return <SwipePlay sc={sc} onSolved={onSolved} say={say} reduceMotion={reduceMotion} />;
    // Exhaustiveness guard: adding an 11th V2Mechanic without a case here used to compile clean
    // (strict is on, but noImplicitReturns is not), render nothing, and never call onSolved: the beat
    // had no fail state, so the player was simply stuck. Now it is a compile error at the point of change.
    default: { const _exhaustive: never = sc; return _exhaustive; }
  }
}

// swipe: the teen flagship's verb, on the shared SwipeCard (drag, flick, ←/→, or the two side buttons).
// Side styling comes from the DECLARED valence, never from the label. (This replaced a regex that read the
// label prose and mis-classified 16 shipped scenarios; see v2-schema.ts.) Undeclared sides get
// side-distinct neutral slots; if both sides would resolve to the same tint they fall back to neutral slots
// so the two sides can never collapse into one colour.
function swipeStyles(sc: Extract<Scenario, { type: "swipe" }>): [SideStyle, SideStyle] {
  const NEUTRAL_L = { emoji: "👈", tint: "var(--prx-slot-1)" };
  const NEUTRAL_R = { emoji: "👉", tint: "var(--prx-slot-2)" };
  const one = (v: string | undefined, fallback: SideStyle) =>
    v && v !== "neutral" ? (VALENCE_STYLE[v] ?? fallback) : fallback;
  const L = one(sc.leftValence, NEUTRAL_L);
  const R = one(sc.rightValence, NEUTRAL_R);
  return L.tint === R.tint ? [NEUTRAL_L, NEUTRAL_R] : [L, R];
}
function SwipePlay({ sc, onSolved, say, reduceMotion }: { sc: Extract<Scenario, { type: "swipe" }>; onSolved: () => void; say: (t: string) => void; reduceMotion: boolean }) {
  return (
    <SwipeCard cue={sc.cue} left={sc.left} right={sc.right} answer={sc.answer} styles={swipeStyles(sc)} reduceMotion={reduceMotion}
      onCorrect={() => { vibrate(12); onSolved(); }}
      onMiss={() => say("Look again. Read the card, then swipe it the other way.")} />
  );
}

// choose: tap every option that fits, then Check (SWED-69, the right/wrong successor to reflect). Six options, two to
// four fit, and the count is not shown until a Check misses, so neither tapping everything nor tapping one works. A
// first Check that misses says how many fit and lets the player look again; the next one shows every answer, with
// the note for each wrong pick and each missed one. No-fail: the beat always resolves. The options stay on screen
// through the result (V2Game keeps this renderer mounted on resolve) and read as checkboxes to assistive tech.
function ChoosePlay({ sc, onSolved, say }: { sc: Extract<Scenario, { type: "choose" }>; onSolved: () => void; say: (t: string) => void }) {
  const [order] = useState(() => shuffle(sc.options.map((_, i) => i)));
  const [picked, setPicked] = useState<number[]>([]);
  const [missed, setMissed] = useState(false);
  const [shown, setShown] = useState(false);
  const total = sc.options.filter((o) => o.fits).length;
  const toggle = (i: number) => setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  const check = () => {
    const found = picked.filter((i) => sc.options[i].fits).length;
    const extra = picked.length - found;
    if (found === total && extra === 0) { vibrate(12); setShown(true); onSolved(); return; }
    if (!missed) {
      setMissed(true);
      say(`Not quite. You found ${found} of the ${total} that fit${extra ? `, and picked ${extra === 1 ? "one that doesn't" : `${extra} that don't`}` : ""}. Look again.`);
      return;
    }
    setShown(true);
    onSolved();
  };
  return (
    <div className="flex flex-col gap-2.5">
      <p className="min-h-4 text-center text-xs font-semibold leading-4 text-foreground/60" aria-hidden>{shown ? "" : "Tap every one that fits, then Check"}</p>
      <div className="grid grid-cols-1 gap-2">
        {order.map((i) => {
          const o = sc.options[i], on = picked.includes(i);
          const result = !shown ? null : o.fits ? (on ? "found" : "missed") : on ? "wrong" : null;
          return (
            <AnswerCard key={i} role="checkbox" aria-checked={on} disabled={shown} onClick={() => toggle(i)}
              state={result ? "done" : on && !shown ? "selected" : "idle"}
              tint={result === "wrong" ? "var(--prx-neg)" : undefined}
              badge={result === "wrong" ? "✕" : result ? "✓" : undefined}
              badgeTint={result === "found" ? "var(--prx-pos)" : result === "wrong" ? "var(--prx-neg)" : undefined}
              className="flex flex-col items-start gap-1 rounded-2xl px-4 py-3 text-left text-[15px] font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.98] disabled:opacity-100">
              <span>{o.text}</span>
              {(result === "missed" || result === "wrong") && (
                <span className="text-xs font-semibold leading-snug text-foreground/80">{result === "missed" ? "This one fits too. " : "This one doesn't fit. "}{o.note}</span>
              )}
            </AnswerCard>
          );
        })}
      </div>
      {!shown && (
        <button type="button" onClick={check} disabled={picked.length === 0}
          className="cta flex h-12 w-full items-center justify-center rounded-2xl bg-[var(--color-sun)] text-base font-extrabold text-slate-900 transition-transform active:scale-95 disabled:opacity-50">
          {missed ? "Check again" : "Check"}
        </button>
      )}
    </div>
  );
}

// role-play (voice): equal-weight, SHUFFLED speech cards: the child must read and choose the assertive line
// (no more "tap the biggest green shape" tell: that was a binary tap the schema forbids). Tap a card = say it;
// the assertive line advances, a passive line speaks and warmly re-opens (no fail). The success haptic now fires
// once (in solve()): the renderer no longer double-buzzes. Every card carries 🗣️ so the "voice" motif holds.
function RolePlayPlay({ sc, onSolved, say }: { sc: Extract<Scenario, { type: "role-play" }>; onSolved: () => void; say: (t: string) => void }) {
  const [lines] = useState(() => shuffle(sc.yourLine ?? []));
  const choose = (l: { text: string; best?: boolean }) => {
    if (l.best) onSolved();
    else say("That's one way. Now say the strong, brave line! 💪");
  };
  return (
    <div className="flex flex-col gap-2.5">
      {lines.map((l, i) => (
        <button key={i} type="button" onClick={() => choose(l)} aria-label={`Say: ${l.text}`} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-4 text-left text-[15px] font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.97]">
          <span className="text-2xl" aria-hidden>🗣️</span><span className="flex-1">{l.text}</span>
        </button>
      ))}
    </div>
  );
}

// strike-rewrite: the myth is now VISIBLE and physically erasable (it used to act on nothing). Scrub a finger
// back-and-forth across the myth card; it fades/blurs as you scrub, and past a forgiving threshold the UN→RE
// truth resolves. Back-and-forth scrub is one of the easiest gestures for tiny hands (finger-painting). Keyboard
// / screen-reader: the card is a focusable button, Enter/Space rubs it out in one go. Reduced motion → instant.
function StrikePlay({ sc, onSolved, reduceMotion }: { sc: Extract<Scenario, { type: "strike-rewrite" }>; onSolved: () => void; reduceMotion: boolean }) {
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);
  const scrubbed = useRef(0); // distance from earlier strokes: lifting a finger never un-erases the myth
  const THRESH = 240; // px of scrubbing to fully erase (forgiving)
  const finish = () => { if (doneRef.current) return; doneRef.current = true; vibrate(12); onSolved(); };
  const drag = usePointerDrag({
    tapThreshold: 4,
    onMove: (s) => { const p = Math.min(1, (scrubbed.current + s.distance) / THRESH); setProgress(p); if (p >= 1) finish(); },
    onEnd: (s) => { scrubbed.current += s.distance; },
  });
  const eraseNow = () => { setProgress(1); finish(); };
  const onKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); eraseNow(); } };
  return (
    <div className="flex flex-1 flex-col gap-2.5">
      {/* a click with detail 0 comes from a keyboard or screen reader, never from a finger scrubbing the card */}
      <div tabIndex={0} role="button" aria-label={`Rub out the myth: ${sc.myth.un}`} onKeyDown={onKeyDown} onClick={(e) => { if (e.detail === 0) eraseNow(); }} {...drag.handlers}
        className="glass-card lift relative flex min-h-48 flex-1 cursor-grab touch-none select-none items-center justify-center overflow-hidden rounded-3xl px-6 py-10 text-center focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-ink)] active:cursor-grabbing">
        <p className="text-[19px] font-bold leading-snug text-foreground" style={{ opacity: reduceMotion ? (progress >= 1 ? 0.12 : 1) : 1 - progress * 0.85, filter: reduceMotion ? undefined : `blur(${progress * 2.5}px)`, textDecoration: progress > 0.4 ? "line-through" : undefined }}>{sc.myth.un}</p>
        <span className="pointer-events-none absolute bottom-2 right-3 text-xs font-semibold text-foreground/40" aria-hidden>✏️ rub it out</span>
      </div>
      <p className="text-center text-xs font-semibold text-foreground/60">Scrub the myth away, or press Enter</p>
    </div>
  );
}

// myth card (SWED-70): the strike-rewrite beat as a swipe. The card shows the myth or its truth; Myth goes left, True
// goes right, with the same drag, keys and side buttons as every swipe card. The resolve is the usual UN/RE beat.
const MYTH_CARD_QUESTION = "Myth or true? Swipe the card.";
const MYTH_CARD_SIDES: [SideStyle, SideStyle] = [VALENCE_STYLE.neg, VALENCE_STYLE.pos];
function MythCardPlay({ sc, side, onSolved, say, reduceMotion }: { sc: Extract<Scenario, { type: "strike-rewrite" }>; side: "myth" | "truth"; onSolved: () => void; say: (t: string) => void; reduceMotion: boolean }) {
  return (
    <SwipeCard cue={side === "myth" ? sc.myth.un : sc.myth.re} left="Myth" right="True" answer={side === "myth" ? "left" : "right"}
      styles={MYTH_CARD_SIDES} reduceMotion={reduceMotion}
      onCorrect={() => { vibrate(12); onSolved(); }}
      onMiss={() => say(side === "myth" ? "Look again. Is that really true?" : "Look again. That one is true.")} />
  );
}

// branch: pick a choice; HEAR + see its consequence; the safe (best) choice leads on, others gently
// redirect. If a scenario has no `best` at all, any pick advances (never a soft-lock).
function BranchPlay({ sc, onSolved, say }: { sc: Extract<Scenario, { type: "branch" }>; onSolved: (picked?: string, branch?: { text: string; best: boolean }) => void; say: (t: string, shown?: string) => void }) {
  const [opts] = useState(() => shuffle(sc.options ?? [])); // best is authored at index 0: shuffle so there's no "tap the top" tell
  // a non-advancing pick on a "find the best" branch shows the consequence + a re-pick (stays in play); an
  // advancing pick hands off to the engine so the consequence + Next render in the standard (bottom-pinned) resolve.
  const [repick, setRepick] = useState<number | null>(null);
  const hasBest = opts.some((o) => o.best);
  const pick = (i: number) => {
    const o = opts[i];
    if (o.best || !hasBest) { say(o.consequence); if (o.best) vibrate(12); onSolved(undefined, { text: o.consequence, best: !!o.best }); }
    else { say(o.consequence, ""); setRepick(i); }
  };
  if (repick !== null) {
    return (
      <div className="flex flex-col gap-2.5">
        <div className="glass-pill rounded-2xl px-4 py-3 text-center text-[15px] font-semibold backdrop-blur-md" style={{ color: "var(--color-ink)" }}>💛 {opts[repick].consequence}</div>
        <button type="button" onClick={() => setRepick(null)} className="glass-pill flex h-12 w-full items-center justify-center rounded-2xl text-base font-bold text-foreground backdrop-blur-md transition-transform active:scale-95">Let&apos;s find a better way →</button>
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

// sort: DRAG a chip into its bin (the bin under the finger highlights; release snaps it in). Tap-to-arm then
// tap-a-bin is kept verbatim as the fallback: it IS the keyboard / screen-reader / ages-3-6 path (chips & bins
// are native buttons). A wrong bin springs back + a warm nudge (no fail); colour is never the only signal (each
// bin keeps its emoji + word). Reduced motion drops the lift/pulse animation, not the function.
function SortPlay({ sc, onSolved, say, reduceMotion }: { sc: Extract<Scenario, { type: "sort" }>; onSolved: () => void; say: (t: string) => void; reduceMotion: boolean }) {
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [order] = useState(() => shuffle(sc.items)); // display order: shuffle so the answer pattern (e.g. up/down/up/down) isn't memorisable across replays
  const [binOrder] = useState(() => shuffle(sc.bins)); // zones too, so a zone's place (good on top) is never the answer
  const [sel, setSel] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const binEls = useRef<Record<string, HTMLElement | null>>({});
  const dragId = useRef<string | null>(null);
  const styles = binStyles(sc.bins);
  const itemText = (id: string) => sc.items.find((it) => it.id === id)?.text ?? "";
  const zones = () => sc.bins.map((b) => ({ id: b.id, el: binEls.current[b.id] }));

  const place = (itemId: string, binId: string) => {
    if (sc.key[itemId] === binId) {
      const np = { ...placed, [itemId]: binId }; setPlaced(np); setSel(null);
      const bin = sc.bins.find((b) => b.id === binId);
      say(pairLine(itemText(itemId), bin?.label ?? ""));
      if (Object.keys(np).length >= sc.items.length) onSolved();
    } else say("Not there. Try another zone.");
  };
  const arm = (id: string) => setSel(id);
  const pointer = usePointerDrag({
    onStart: (s, e) => { const id = (e.currentTarget as HTMLElement).dataset.id ?? null; dragId.current = id; if (id) { arm(id); setDrag({ id, x: s.x, y: s.y }); } },
    onMove: (s) => { const id = dragId.current; if (!id) return; setDrag({ id, x: s.x, y: s.y }); setHover(hitTestZone(s.x, s.y, zones(), 44)); },
    onEnd: (s) => { const id = dragId.current; dragId.current = null; const bin = hitTestZone(s.x, s.y, zones(), 44); setDrag(null); setHover(null); if (id && bin) place(id, bin); },
    onTap: () => { dragId.current = null; setDrag(null); setHover(null); }, // arming already happened in onStart
  });
  // Safety net: a pointerup/cancel ANYWHERE clears the floating ghost, even if the chip's own pointerup was missed
  // (pointer-capture loss, a fast release off-element, or a mid-drag re-render): otherwise a dragged chip could
  // "stick" to the cursor. The chip's own onEnd still runs first (so a valid drop still places), then this clears.
  useEffect(() => {
    const clear = () => { dragId.current = null; setDrag(null); setHover(null); };
    window.addEventListener("pointerup", clear);
    window.addEventListener("pointercancel", clear);
    return () => { window.removeEventListener("pointerup", clear); window.removeEventListener("pointercancel", clear); };
  }, []);

  // one dropzone: a single dashed border + translucent tint fill (no card double-border); flex-1 so two bins
  // stacked top/bottom each grow big. Tap to drop the armed chip, or release a dragged chip over it.
  // A zone never grows: placed chips stay in their slot (marked with the zone's emoji) instead of moving in here.
  const renderBin = (b: { id: string; label: string }) => {
    const st = styles[sc.bins.indexOf(b)];
    const armed = (!!sel && !drag) || hover === b.id;
    return (
      <button key={b.id} type="button" ref={(el) => { binEls.current[b.id] = el; }} onClick={() => { if (sel) place(sel, b.id); }}
        className={`relative flex flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 px-3 py-4 text-center transition-colors ${armed ? "border-solid" : "border-dashed"}`}
        style={{ borderColor: st.tint, background: `color-mix(in srgb, ${st.tint} ${hover === b.id ? "24%" : "9%"}, transparent)` }}>
        <span className="text-3xl" aria-hidden>{st.emoji}</span>
        <span className="text-sm font-extrabold text-foreground">{plainLabel(b.label)}</span>
        {armed && <CornerBadge>⤵</CornerBadge>}
      </button>
    );
  };
  const chips = (
    <div className="flex flex-col gap-1.5">
      <p className="line-clamp-2 min-h-8 text-center text-xs font-semibold leading-4 text-foreground/70" aria-hidden>{sel ? `Carrying “${itemText(sel)}”: drop it in a zone` : "Tap a card, then its zone"}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {order.map((it) => {
          const bi = placed[it.id] ? sc.bins.findIndex((b) => b.id === placed[it.id]) : -1;
          return bi >= 0 ? (
            <AnswerCard key={it.id} disabled state="done" tint={styles[bi].tint} badge={styles[bi].emoji} aria-label={`${it.text}: ${plainLabel(sc.bins[bi].label)}`}
              className="rounded-2xl px-3 py-2.5 text-sm font-bold text-foreground backdrop-blur-[12px] disabled:opacity-100">{it.text}</AnswerCard>
          ) : (
            <AnswerCard key={it.id} data-id={it.id} onClick={() => arm(it.id)} {...pointer.handlers} state={sel === it.id && !drag ? "selected" : "idle"} aria-pressed={sel === it.id}
              className={`touch-none rounded-2xl px-3 py-2.5 text-sm font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-95 ${drag?.id === it.id ? "opacity-30" : ""}`}>{it.text}</AnswerCard>
          );
        })}
      </div>
    </div>
  );
  const ghost = drag && !reduceMotion && (
    <div className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[var(--color-sun)] px-3 py-2.5 text-sm font-bold text-slate-900 shadow-lg" style={{ left: drag.x, top: drag.y }}>{itemText(drag.id)}</div>
  );
  // Two bins → big dropzones at top & bottom with the chips between them (Reigns-style); else a grid below.
  return binOrder.length === 2 ? (
    <div className="flex flex-1 flex-col gap-3">
      {ghost}
      {renderBin(binOrder[0])}
      {chips}
      {renderBin(binOrder[1])}
    </div>
  ) : (
    <div className="flex flex-1 flex-col gap-3">
      {ghost}
      {chips}
      <div className="grid flex-1 grid-cols-2 gap-2.5">{binOrder.map((b) => renderBin(b))}</div>
    </div>
  );
}

// match: draw a cord from each left card to its right card (MatchBoard, shared with the capstone engine).
function MatchPlay({ sc, onSolved, say }: { sc: Extract<Scenario, { type: "match" }>; onSolved: () => void; say: (t: string) => void }) {
  return (
    <MatchBoard
      pairs={sc.pairs}
      onMatch={(left, right, done) => { say(pairLine(left, right)); if (done) onSolved(); }}
      onMiss={() => say("Not a match. Try another.")}
    />
  );
}

// build (DRAG a piece onto the slate (or tap it) to add it. ASSEMBLE: order-free) a key piece seats, a
// distractor bounces back + a warm nudge (the key is ACTUALLY checked: fixes the old always-wins bug).
// SEQUENCE: add in the right order. The "done" confirm needs ALL key pieces (fixes the old min(3) truncation
// that silently accepted 3 of a 4-piece answer). Tap is the keyboard / ages-3-6 fallback. No-fail throughout.
function BuildPlay({ sc, onSolved, say, labels, reduceMotion }: { sc: Extract<Scenario, { type: "build" }>; onSolved: () => void; say: (t: string) => void; labels?: { assemble?: string; sequence?: string }; reduceMotion: boolean }) {
  const [chosen, setChosen] = useState<string[]>([]);
  const [display] = useState(() => (sc.mode === "sequence" ? shuffle(sc.pieces) : sc.pieces));
  const [drag, setDrag] = useState<{ piece: string; x: number; y: number } | null>(null);
  const [over, setOver] = useState(false);
  const slate = useRef<HTMLDivElement>(null);
  const dragP = useRef<string | null>(null);
  const target = sc.key.length; // ALL key pieces (both modes): no truncation
  const add = (piece: string) => {
    if (chosen.includes(piece)) return;
    if (sc.mode === "sequence") {
      if (sc.key[chosen.length] === piece) setChosen((c) => [...c, piece]);
      else say("Hmm, which comes first?");
    } else if (sc.key.includes(piece)) setChosen((c) => [...c, piece]); // assemble: only real answer pieces seat
    else say("That one doesn't belong. Try another.");
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
      <button type="button" disabled={!enough} onClick={onSolved} className="cta flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95 disabled:opacity-50">
        <ShieldCheck className="size-5" aria-hidden /> {sc.mode === "sequence" ? (labels?.sequence ?? "That's my plan!") : (labels?.assemble ?? "That's my team!")}
      </button>
    </div>
  );
}

// explore-label: split by payload. ANATOMY beats (the parts are locatable body parts) render a friendly body
// figure and you tap the part ON the body: the real "find the part" discovery verb; it lights up on the figure.
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
  const [found, setFound] = useState<string | null>(null);
  const choose = (p: string) => {
    if (p === sc.answer) { setFound(p); vibrate(12); setTimeout(onSolved, 450); }
    else say(`Not quite. ${clueLine(sc.find)}`);
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
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2.5">
      <div className="grid grid-cols-1 gap-2.5">
        {cards.map((p, i) => {
          const got = found === p;
          return (
            <AnswerCard key={p} disabled={!!found} onClick={() => choose(p)} state={got ? "done" : "idle"} badge={got ? "✓" : undefined}
              className="flex items-center gap-3 rounded-2xl px-4 py-4 text-left text-[15px] font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.97] disabled:opacity-100">
              <span className="text-2xl" aria-hidden>{["💡", "🔆", "✨", "🌟"][i % 4]}</span><span className="flex-1">{p}</span>
            </AnswerCard>
          );
        })}
      </div>
    </div>
  );
}

// spot: tap the "trick"/red-flag in the scene; the item with trick:true is the answer, and `why` explains it
// on resolve. A wrong tap warmly re-asks (no fail). The safety squad's signature spot-the-trick verb.
function SpotPlay({ sc, onSolved, say }: { sc: Extract<Scenario, { type: "spot" }>; onSolved: () => void; say: (t: string) => void }) {
  const [items] = useState(() => shuffle(sc.scene)); // shuffle so the trick slots vary
  const [caught, setCaught] = useState<Set<string>>(new Set());
  const tricks = sc.scene.filter((s) => s.trick).map((s) => s.id); // a scene can hide MORE THAN ONE red flag
  const done = caught.size >= tricks.length;
  const plural = tricks.length > 1;
  // Cards start NEUTRAL (🔎): the flag is the reveal, planted only on a card you catch. When a scene hides
  // several red flags (e.g. 3 truths + 2 lies) you must catch them ALL before the beat resolves (the old engine
  // resolved on the FIRST trick, so extra tricks were unreachable). Wrong tap = warm nudge (no fail).
  const choose = (it: { id: string; text: string; trick: boolean }) => {
    if (done || caught.has(it.id)) return;
    if (it.trick) {
      const nc = new Set(caught).add(it.id); setCaught(nc); vibrate(12);
      const left = tricks.length - nc.size;
      if (left <= 0) setTimeout(onSolved, 450);
      else say(left === 1 ? "Caught one! One more to find." : `Caught one! ${left} more to find.`);
    } else say("That one's okay. Keep looking.");
  };
  return (
    <div className="flex flex-col gap-2.5">
      {plural && !done && <p className="text-center text-xs font-semibold text-foreground/60">Found {caught.size} of {tricks.length}</p>}
      <div className="grid grid-cols-1 gap-2.5">
        {items.map((it) => {
          const got = caught.has(it.id);
          return (
            <AnswerCard key={it.id} disabled={got || done} onClick={() => choose(it)} state={got ? "done" : "idle"} tint="var(--prx-neg)"
              className="flex items-center gap-3 rounded-2xl px-4 py-4 text-left text-[15px] font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.97] disabled:opacity-100">
              <span className="text-2xl" aria-hidden>{got ? "🚩" : "🔎"}</span><span className="flex-1">{it.text}</span>
              {/* reserved even before it's caught, so the label appearing never re-wraps the line */}
              <span className={`text-xs font-extrabold text-[var(--prx-neg)] ${got ? "" : "invisible"}`}>Caught!</span>
            </AnswerCard>
          );
        })}
      </div>
    </div>
  );
}
