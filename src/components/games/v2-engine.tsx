"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, Sparkles, ShieldCheck, Phone, Users } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { useProfile } from "@/lib/store";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";
import { prefersReducedMotion } from "@/lib/juice";
import { shuffle, byCat, type Scenario, type V2GameConfig, type V2Mechanic } from "@/content/games/v2-schema";

// The shared v2 "mechanic-embodying" engine — renders any game's typed scenario library as the micro-loop
// (Hook → Play → Reassure → Sticker), with one bespoke interaction per mechanic so the lesson IS the verb,
// never a binary tap. No hard fail (a wrong move gets a warm nudge); audio-first; Calm Mode drives
// prefersReducedMotion; a help route on every screen; optional grown-up co-play. Used by g01, g02, …

const MECH: Record<V2Mechanic, { emoji: string; verb: string }> = {
  reflect: { emoji: "💭", verb: "What do you think?" },
  "role-play": { emoji: "🗣️", verb: "Say it out loud" },
  "strike-rewrite": { emoji: "✏️", verb: "Let's rub out the myth" },
  branch: { emoji: "🔀", verb: "What do you do?" },
  sort: { emoji: "🗂️", verb: "Sort them" },
  match: { emoji: "🔗", verb: "Match them up" },
  build: { emoji: "🧩", verb: "Build it" },
};
const COPLAY: Record<V2Mechanic, string> = {
  reflect: "Wonder it over together — there's no wrong answer here.",
  "role-play": "Say the brave words together, loud and proud.",
  "strike-rewrite": "Talk about why the old idea isn't true.",
  branch: "Ask them: what would you do? Talk it through.",
  sort: "Sort them together and chat about each one.",
  match: "Match them up together.",
  build: "Help them name the grown-ups they trust.",
};

// Tint a sort/bin label by meaning (colour is NEVER the only signal — every bin shows its word + an emoji).
// Valence labels (safe/unsafe, kind/unkind, helps/makes-it-bigger) get green/red; neutral two-category
// labels (e.g. "a feeling" vs "a thing you do") get two distinct non-valence tints by position, so we never
// imply one category is "bad".
function binStyle(label: string, idx = 0): { emoji: string; tint: string } {
  const o = label.toLowerCase();
  if (/uh-oh|uhoh/.test(o)) return { emoji: "😬", tint: "#F0A93B" };
  // genuinely unsafe / false / not-okay (checked before "tell" so "unsafe secret, tell!" reads unsafe)
  if (/unsafe|not safe|not okay|not the right|doesn|unkind|not kind|not a good|makes it bigger|not allowed|not-so-happy|uncomfy|hurts|\bmyth\b|shame|bad secret|not a family|not love|leaves someone out|not helping|not my circle|not healthy|not clean|spreads germs|gets stinky|silly rule|not so good|not needed/.test(o)) return { emoji: "🛑", tint: "#E05C52" };
  // a telling / speak-up action bin — distinct from good/bad, not a "danger" colour
  if (/tell a grown|tell someone|speak up|tell right|tell!|^tell\b/.test(o)) return { emoji: "🗣️", tint: "#F0A93B" };
  // affirming / true / okay / safe / belonging / clean-healthy
  if (/^safe|safe touch|mine|my choice|happy|keep|respects|trusted|surprise|\bokay\b|consent|calms|\bhelps\b|kind|good way|comfy|happy-ish|\btrue\b|fact|real family|real, loving|family love|everyone belongs|\bbelong|my circle|makes them family|holds family|helping|healthy|clean habit|good for teeth|stops germs|stays fresh|good washing|wash now/.test(o)) return { emoji: "💚", tint: "#62B84B" };
  // neutral categorisation (feeling vs action, private vs not-private) — distinct tints, no valence
  return idx === 0 ? { emoji: "🔵", tint: "#5B9BD5" } : { emoji: "🟣", tint: "#7C5CFC" };
}
const NEUTRAL_BINS = [{ emoji: "🔵", tint: "#5B9BD5" }, { emoji: "🟣", tint: "#7C5CFC" }, { emoji: "🟢", tint: "#62B84B" }, { emoji: "🟠", tint: "#F0A93B" }];
// Guarantee the bins of one sort are visually distinct: if two would share a tint, fall back to a
// position-based neutral palette so a non-reader always has a per-bin colour + emoji cue.
function binStyles(bins: { label: string }[]): { emoji: string; tint: string }[] {
  const s = bins.map((b, i) => binStyle(b.label, i));
  return new Set(s.map((x) => x.tint)).size < bins.length ? bins.map((_, i) => NEUTRAL_BINS[i % NEUTRAL_BINS.length]) : s;
}
const vibrate = (ms: number | number[]) => { try { navigator.vibrate?.(ms); } catch { /* unsupported */ } };

export function V2Game({ config, onExit }: { config: V2GameConfig; onExit: () => void }) {
  const { scenarios, gameId, title, greet, categories, badge, helpLine, helpLabel, reassureCats = [], reassure, buildLabels } = config;
  const [view, setView] = useState<"home" | "play" | "done">("home");
  const [queue, setQueue] = useState<Scenario[]>([]);
  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState<"play" | "resolve">("play");
  const [stickers, setStickers] = useState<Set<string>>(new Set()); // category ids earned
  const [bubble, setBubble] = useState(greet);
  const [muted, setMuted] = useState(false);
  const [coplay, setCoplay] = useState(false);
  // Calm Mode is the app-wide setting; the store syncs profile.calmMode → juice.setCalm(), so the toggle
  // actually drives prefersReducedMotion() (suppressing confetti + motion).
  const { profile, setCalmMode } = useProfile();
  const calmMode = profile.calmMode ?? false; // the in-app toggle state (drives the Sparkles button)
  const reduceMotion = prefersReducedMotion(); // calm OR the OS prefers-reduced-motion setting — gates all motion
  const sc = queue[qi];

  const say = useCallback((t: string, onEnd?: () => void) => { setBubble(t); speak(t, { muted, onEnd }); }, [muted]);

  useEffect(() => {
    speak(greet, { muted });
    return () => stopSpeaking();
    // greet once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hookLine = (s: Scenario): string => {
    if (s.type === "reflect") return `${s.hook} ${s.prompt}`;
    if (s.type === "role-play") return `${s.hook} ${s.setup}`;
    if (s.type === "build") return `${s.hook} ${s.prompt}`;
    return s.hook;
  };
  const resolveLine = (s: Scenario): string =>
    s.type === "reflect" ? s.affirm : s.type === "branch" ? s.debrief : s.type === "strike-rewrite" ? `${s.myth.re} ${s.myth.why}` : s.relearn;
  // A beat is a "safety" beat (gets the "never your fault" reassurance + the help pill) if its category is
  // listed OR it's a branch with an escape-and-tell best choice (outcome:"safe") — so grooming/unsafe-touch
  // beats that live in other categories (e.g. consent-stop) still surface the reassurance.
  const isSafetyBeat = (s: Scenario): boolean =>
    reassureCats.includes(s.cat) || (s.type === "branch" && s.options.some((o) => o.outcome === "safe"));

  const present = useCallback((s: Scenario) => { setPhase("play"); say(hookLine(s)); }, [say]);

  // Rotation: one scenario per category, never the same mechanic twice in a row (the palette rule).
  const startRotate = () => {
    const q: Scenario[] = [];
    for (const cat of categories) {
      const pool = shuffle(byCat(scenarios, cat.id));
      const prev = q[q.length - 1]?.type;
      q.push(pool.find((s) => s.type !== prev) ?? pool[0]);
    }
    const fresh = q.filter(Boolean);
    setQueue(fresh); setQi(0); setView("play"); present(fresh[0]);
  };
  // One category, three beats, varied mechanics.
  const startCat = (catId: string) => {
    const pool = shuffle(byCat(scenarios, catId));
    const q: Scenario[] = [];
    for (const s of pool) { if (q.length >= 3) break; if (s.type !== q[q.length - 1]?.type) q.push(s); }
    for (const s of pool) { if (q.length >= 3) break; if (!q.includes(s)) q.push(s); }
    setQueue(q); setQi(0); setView("play"); present(q[0]);
  };

  const earn = (catId: string) => setStickers((p) => (p.has(catId) ? p : new Set(p).add(catId)));

  // A renderer calls this when the child completes its interaction.
  const solve = () => {
    if (!sc) return;
    earn(sc.cat);
    celebrate("small");
    vibrate(sc.type === "role-play" ? [16, 40, 16] : 12);
    setPhase("resolve");
    say(resolveLine(sc));
  };

  const next = () => {
    const ni = qi + 1;
    if (ni < queue.length) { setQi(ni); present(queue[ni]); return; }
    // Transition immediately — do NOT gate the only path to "done" on a speech onEnd callback (which a
    // muted/3–6-y/o tap could swallow). GameDone mounts on the done screen and the badge narrates there.
    if (stickers.size >= categories.length) { setView("done"); celebrate("big"); say(badge.blurb); }
    else { setView("home"); say("What shall we play?"); }
  };

  const reset = () => { setStickers(new Set()); setQueue([]); setQi(0); setPhase("play"); setView("home"); say(greet); };

  // ---- chrome ----
  const muteBtn = (
    <button type="button" aria-label={muted ? "Turn sound on" : "Turn sound off"} onClick={() => setMuted((m) => { const n = !m; if (n) stopSpeaking(); return n; })} className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
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
    <div className="glass-card flex justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${stickers.size} of ${categories.length} stickers`}>
      {categories.map((c) => (
        <span key={c.id} className={`grid size-9 place-items-center rounded-full text-xl ${stickers.has(c.id) && !reduceMotion ? "animate-in zoom-in duration-300" : ""}`} style={{ background: stickers.has(c.id) ? "var(--color-sun)" : "transparent", boxShadow: stickers.has(c.id) ? "inset 0 0 0 2px var(--color-ink)" : "inset 0 0 0 2px var(--color-mist)", opacity: stickers.has(c.id) ? 1 : 0.4 }} aria-hidden>{stickers.has(c.id) ? c.emoji : "·"}</span>
      ))}
    </div>
  );
  const HomeBtn = (
    <button type="button" onClick={() => { setView("home"); say("What shall we play?"); }} className="glass-pill mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
      <Home className="size-5" aria-hidden /> Home
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
    <GameShell title={title} tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {StickerBook}
        {coplay && view === "play" && sc && (
          <div className="glass-pill flex items-start gap-2 rounded-2xl px-3 py-2 text-sm font-medium backdrop-blur-md" style={{ color: "var(--color-ink)" }}>
            <Users className="mt-0.5 size-4 shrink-0" aria-hidden /> <span>{COPLAY[sc.type]}</span>
          </div>
        )}

        {/* ---------- HOME ---------- */}
        {view === "home" && (
          <>
            <button type="button" onClick={startRotate} className="flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-lg font-extrabold text-slate-900 transition-transform active:scale-[0.98]">
              <ShieldCheck className="size-6" aria-hidden /> Play with Lensy
            </button>
            <div className="grid grid-cols-2 gap-2.5">
              {categories.map((c) => (
                <button key={c.id} type="button" onClick={() => startCat(c.id)} className="glass-card flex flex-col items-center gap-1.5 rounded-2xl py-5 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.97]" style={stickers.has(c.id) ? { boxShadow: "inset 0 0 0 2px var(--color-sun)" } : undefined}>
                  <span className="text-4xl" aria-hidden>{c.emoji}</span>
                  <span className="text-center text-sm font-bold text-foreground">{c.label}</span>
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setCoplay((v) => !v)} className="glass-pill flex h-10 items-center justify-center gap-2 rounded-2xl text-sm font-bold backdrop-blur-md transition-transform active:scale-95" style={coplay ? { boxShadow: "inset 0 0 0 2px var(--color-ink)" } : undefined}>
              <Users className="size-4" aria-hidden /> Grown-up co-play {coplay ? "on" : "off"}
            </button>
            {HelpPill}
          </>
        )}

        {/* ---------- PLAY ---------- */}
        {view === "play" && sc && (
          <>
            {/* Hook */}
            <div className="glass-card flex flex-col items-center gap-1.5 rounded-2xl px-5 py-5 text-center backdrop-blur-[12px] backdrop-saturate-150">
              <span className="text-3xl" aria-hidden>{MECH[sc.type].emoji}</span>
              <p className="font-display text-base font-bold text-foreground">{sc.hook}</p>
              {sc.type === "reflect" && <p className="text-sm font-semibold text-foreground/70">{sc.prompt}</p>}
              {sc.type === "role-play" && <p className="text-sm font-semibold text-foreground/70">{sc.setup}</p>}
              {sc.type === "build" && <p className="text-sm font-semibold text-foreground/70">{sc.prompt}</p>}
              {(sc.type === "branch" || sc.type === "sort" || sc.type === "match" || sc.type === "strike-rewrite") && (
                <p className="text-sm font-semibold text-foreground/70">{MECH[sc.type].verb}</p>
              )}
            </div>

            {phase === "play" && <Play key={sc.id} sc={sc} onSolved={solve} say={say} reduceMotion={reduceMotion} buildLabels={buildLabels} />}

            {/* Resolve — the truth + reassurance + Next */}
            {phase === "resolve" && (
              <>
                {sc.type === "strike-rewrite" ? (
                  <UnReBeat un={sc.myth.un} re={`${sc.myth.re} ${sc.myth.why}`} />
                ) : (
                  <div className="glass-pill rounded-2xl px-4 py-3 text-center text-[15px] font-semibold leading-relaxed backdrop-blur-md" style={{ color: "var(--color-ink)" }}>💛 {resolveLine(sc)}</div>
                )}
                {reassure && isSafetyBeat(sc) && (
                  <div className="glass-pill rounded-2xl px-4 py-2.5 text-center text-sm font-medium backdrop-blur-md" style={{ color: "var(--color-ink)" }}>{reassure}</div>
                )}
                {reassure && isSafetyBeat(sc) && HelpPill}
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

// ============================ the seven mechanic renderers ============================
function Play({ sc, onSolved, say, reduceMotion, buildLabels }: { sc: Scenario; onSolved: () => void; say: (t: string) => void; reduceMotion: boolean; buildLabels?: { assemble?: string; sequence?: string } }) {
  switch (sc.type) {
    case "reflect": return <ReflectPlay sc={sc} onSolved={onSolved} />;
    case "role-play": return <RolePlayPlay sc={sc} onSolved={onSolved} />;
    case "strike-rewrite": return <StrikePlay onSolved={onSolved} />;
    case "branch": return <BranchPlay sc={sc} onSolved={onSolved} say={say} />;
    case "sort": return <SortPlay sc={sc} onSolved={onSolved} say={say} reduceMotion={reduceMotion} />;
    case "match": return <MatchPlay sc={sc} onSolved={onSolved} say={say} reduceMotion={reduceMotion} />;
    case "build": return <BuildPlay sc={sc} onSolved={onSolved} say={say} labels={buildLabels} />;
  }
}

// reflect — every option is affirming; tap any (no wrong answer).
function ReflectPlay({ sc, onSolved }: { sc: Extract<Scenario, { type: "reflect" }>; onSolved: () => void }) {
  return (
    <div className={`grid gap-2.5 ${sc.options.length >= 3 ? "grid-cols-2" : "grid-cols-1"}`}>
      {sc.options.map((o) => (
        <button key={o} type="button" onClick={onSolved} className="glass-card flex items-center justify-center rounded-2xl px-3 py-4 text-center text-[15px] font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.96]">{o}</button>
      ))}
    </div>
  );
}

// role-play (voice) — the BEST line is a big tactile "say it loud" button; the passive line stays small.
function RolePlayPlay({ sc, onSolved }: { sc: Extract<Scenario, { type: "role-play" }>; onSolved: () => void }) {
  const [nudge, setNudge] = useState(false);
  const best = sc.yourLine.find((l) => l.best) ?? sc.yourLine[0];
  const others = sc.yourLine.filter((l) => l !== best);
  return (
    <div className="flex flex-col gap-2.5">
      <button type="button" onClick={() => { vibrate([16, 40, 16]); onSolved(); }} className="flex flex-col items-center justify-center gap-1.5 rounded-3xl bg-[var(--color-grow)] py-7 text-white ring-4 ring-[var(--color-ink)]/25 transition-transform active:scale-90">
        <span className="text-4xl" aria-hidden>🗣️</span>
        <span className="px-3 text-center text-lg font-extrabold leading-tight">{best.text}</span>
        <span className="text-xs font-semibold opacity-80">Tap to say it, loud and brave</span>
      </button>
      {others.map((o) => (
        <button key={o.text} type="button" onClick={() => setNudge(true)} className="glass-pill rounded-2xl px-4 py-2.5 text-center text-sm font-semibold text-foreground/70 backdrop-blur-md transition-transform active:scale-95">{o.text}</button>
      ))}
      {nudge && <p className="text-center text-xs font-semibold text-foreground/70">You can be even braver — say the strong words! 💪</p>}
    </div>
  );
}

// strike-rewrite — tap to rub the myth out (the UN→RE truth shows on resolve).
function StrikePlay({ onSolved }: { onSolved: () => void }) {
  return (
    <button type="button" onClick={onSolved} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-insight)] text-base font-extrabold text-white transition-transform active:scale-95">
      <span className="text-2xl" aria-hidden>✏️</span> Rub it out
    </button>
  );
}

// branch — pick a choice; HEAR + see its consequence; the safe (best) choice leads on, others gently
// redirect. If a scenario has no `best` at all, any pick advances (never a soft-lock).
function BranchPlay({ sc, onSolved, say }: { sc: Extract<Scenario, { type: "branch" }>; onSolved: () => void; say: (t: string) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const hasBest = sc.options.some((o) => o.best);
  if (picked !== null) {
    const opt = sc.options[picked];
    const advance = opt.best || !hasBest; // safe choice, or there is no "best" to find → move on
    return (
      <div className="flex flex-col gap-2.5">
        <div className="glass-pill rounded-2xl px-4 py-3 text-center text-[15px] font-semibold backdrop-blur-md" style={{ color: "var(--color-ink)" }}>{opt.best ? "💚 " : "💛 "}{opt.consequence}</div>
        {advance ? (
          <button type="button" onClick={onSolved} className="flex h-12 w-full items-center justify-center rounded-2xl bg-[var(--color-sun)] text-base font-extrabold text-slate-900 transition-transform active:scale-95">Next →</button>
        ) : (
          <button type="button" onClick={() => setPicked(null)} className="glass-pill flex h-12 w-full items-center justify-center rounded-2xl text-base font-bold text-foreground backdrop-blur-md transition-transform active:scale-95">Let&apos;s find the safe way →</button>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2.5">
      {sc.options.map((o, i) => (
        <button key={i} type="button" onClick={() => { setPicked(i); say(o.consequence); if (o.best) { vibrate(12); } }} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-4 text-left text-[15px] font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.97]">
          <span className="text-2xl" aria-hidden>🔀</span><span className="flex-1">{o.text}</span>
        </button>
      ))}
    </div>
  );
}

// sort — tap an item to pick it up, tap the bin it belongs in. Wrong bin gives a warm nudge (no fail).
function SortPlay({ sc, onSolved, say, reduceMotion }: { sc: Extract<Scenario, { type: "sort" }>; onSolved: () => void; say: (t: string) => void; reduceMotion: boolean }) {
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [sel, setSel] = useState<string | null>(null);
  const [wrong, setWrong] = useState(false);
  const done = Object.keys(placed).length;
  const drop = (binId: string) => {
    if (!sel) return;
    if (sc.key[sel] === binId) {
      const np = { ...placed, [sel]: binId };
      setPlaced(np); setSel(null); setWrong(false);
      if (Object.keys(np).length >= sc.items.length) onSolved();
    } else { setWrong(true); say("Hmm, try the other one."); }
  };
  return (
    <div className="flex flex-col gap-3">
      {/* unplaced item chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {sc.items.filter((it) => !placed[it.id]).map((it) => (
          <button key={it.id} type="button" onClick={() => { setSel(it.id); setWrong(false); }} className={`glass-card rounded-2xl px-3 py-2.5 text-sm font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-95 ${sel === it.id && !reduceMotion ? "animate-pulse" : ""}`} style={sel === it.id ? { boxShadow: "inset 0 0 0 2.5px var(--color-ink)" } : undefined}>{it.text}</button>
        ))}
      </div>
      {wrong && <p className="text-center text-xs font-semibold text-foreground/70">Not quite — try the other one. 💛</p>}
      {/* bins */}
      <div className="grid grid-cols-2 gap-2.5">
        {(() => { const styles = binStyles(sc.bins); return sc.bins.map((b, bi) => {
          const st = styles[bi];
          const inBin = sc.items.filter((it) => placed[it.id] === b.id);
          return (
            <button key={b.id} type="button" onClick={() => drop(b.id)} className="glass-card flex min-h-[5.5rem] flex-col items-center gap-1 rounded-2xl px-2 py-3 text-center backdrop-blur-[12px] transition-transform active:scale-[0.97]" style={{ boxShadow: `inset 0 0 0 2.5px ${st.tint}` }}>
              <span className="text-2xl" aria-hidden>{st.emoji}</span>
              <span className="text-xs font-extrabold text-foreground">{b.label}</span>
              {inBin.map((it) => <span key={it.id} className="rounded-full bg-[var(--color-sun)] px-2 py-0.5 text-[11px] font-bold text-slate-900">{it.text} ✓</span>)}
            </button>
          );
        }); })()}
      </div>
      <p className="text-center text-xs text-foreground/55">{done} / {sc.items.length} sorted</p>
    </div>
  );
}

// match — tap a left, tap its right. A wrong pair gives a warm nudge (no fail).
function MatchPlay({ sc, onSolved, say, reduceMotion }: { sc: Extract<Scenario, { type: "match" }>; onSolved: () => void; say: (t: string) => void; reduceMotion: boolean }) {
  const [rights] = useState(() => shuffle(sc.pairs.map((p) => p.right)));
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [selLeft, setSelLeft] = useState<string | null>(null);
  const [wrong, setWrong] = useState(false);
  const pick = (right: string) => {
    if (!selLeft) return;
    const correct = sc.pairs.find((p) => p.left === selLeft)?.right === right;
    if (correct) {
      const nm = new Set(matched).add(selLeft);
      setMatched(nm); setSelLeft(null); setWrong(false);
      if (nm.size >= sc.pairs.length) onSolved();
    } else { setWrong(true); say("Hmm, try another."); }
  };
  const rightDone = (r: string) => sc.pairs.some((p) => p.right === r && matched.has(p.left));
  return (
    <div className="flex flex-col gap-2.5">
      {wrong && <p className="text-center text-xs font-semibold text-foreground/70">Not a match — try another. 💛</p>}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex flex-col gap-2">
          {sc.pairs.map((p) => (
            <button key={p.left} type="button" disabled={matched.has(p.left)} onClick={() => { setSelLeft(p.left); setWrong(false); }} className={`glass-card rounded-2xl px-3 py-3 text-sm font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-95 disabled:opacity-100 ${selLeft === p.left && !reduceMotion ? "animate-pulse" : ""}`} style={matched.has(p.left) ? { boxShadow: "inset 0 0 0 2.5px var(--color-grow)" } : selLeft === p.left ? { boxShadow: "inset 0 0 0 2.5px var(--color-ink)" } : undefined}>{matched.has(p.left) ? `${p.left} ✓` : p.left}</button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {rights.map((r) => (
            <button key={r} type="button" disabled={rightDone(r)} onClick={() => pick(r)} className="glass-card rounded-2xl px-3 py-3 text-sm font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-95 disabled:opacity-40" style={rightDone(r) ? { boxShadow: "inset 0 0 0 2.5px var(--color-grow)" } : undefined}>{r}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// build — assemble a trusted-adults team (order-free) or a telling plan (in sequence).
function BuildPlay({ sc, onSolved, say, labels }: { sc: Extract<Scenario, { type: "build" }>; onSolved: () => void; say: (t: string) => void; labels?: { assemble?: string; sequence?: string } }) {
  const [chosen, setChosen] = useState<string[]>([]);
  // For a sequence (ordering) puzzle, shuffle the buttons so the answer isn't "tap top-to-bottom".
  const [display] = useState(() => (sc.mode === "sequence" ? shuffle(sc.pieces) : sc.pieces));
  const target = sc.mode === "sequence" ? sc.key.length : Math.min(3, sc.key.length);
  const add = (piece: string) => {
    if (sc.mode === "sequence") {
      if (sc.key[chosen.length] === piece) setChosen((c) => [...c, piece]);
      else say("Hmm, which comes first?");
    } else if (!chosen.includes(piece)) setChosen((c) => [...c, piece]);
  };
  const remaining = sc.pieces.filter((p) => !chosen.includes(p));
  const enough = chosen.length >= target;
  return (
    <div className="flex flex-col gap-3">
      {chosen.length > 0 && (
        <div className="glass-card flex flex-wrap justify-center gap-1.5 rounded-2xl p-3 backdrop-blur-[12px]">
          {chosen.map((p, i) => (
            <span key={p} className="rounded-full bg-[var(--color-sun)] px-3 py-1 text-sm font-bold text-slate-900">{sc.mode === "sequence" ? `${i + 1}. ` : ""}{p}</span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-2">
        {(sc.mode === "sequence" ? display : remaining).map((p) => (
          <button key={p} type="button" disabled={sc.mode === "sequence" && chosen.includes(p)} onClick={() => add(p)} className="glass-card rounded-2xl px-3 py-2.5 text-sm font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-95 disabled:opacity-40">{p}</button>
        ))}
      </div>
      <button type="button" disabled={!enough} onClick={onSolved} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95 disabled:opacity-50">
        <ShieldCheck className="size-5" aria-hidden /> {sc.mode === "sequence" ? (labels?.sequence ?? "That's my plan!") : (labels?.assemble ?? "That's my team!")}
      </button>
    </div>
  );
}
