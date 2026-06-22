"use client";

import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, Home, RotateCcw, Check } from "lucide-react";
import { GameShell } from "@/components/game-shell";
import { GameDone } from "@/components/games/game-done";
import { Sam } from "@/components/games/sam";
import { UnReBeat } from "@/components/games/un-re";
import { ToolMoment } from "@/components/toolkit/tool-moment";
import type { ToolId } from "@/lib/types";
import { speak, stopSpeaking, replay } from "@/lib/speak";
import { celebrate } from "@/lib/confetti";

// ── Shared "modes game" engine ───────────────────────────────────────────────────────────────────
// The reusable engine behind SwipeEd's mode-based games (Mutual, Consent For Real, and the adult
// journey). A game is a CONFIG of modes; the engine renders the home grid, Sam host, badge book, the
// four reusable mode kinds, and the shared GameDone. New games = a content config + one registry line.
// (Patterns doc #2: one engine per verb, games are content on it.) NEVER-fail; help is always one tap
// away; UN→RE used with restraint at genuine-misconception beats.

export type Option = { text: string; ok: boolean };
export type Scene = { emoji: string; situation: string; options: Option[]; result: string };
export type Myth = { myth: string; facts: Option[]; re: string; boss?: boolean };
export type AskItem = { q: string; a: string; help?: boolean };
export type ListItem = { emoji: string; say: string };
type ModeBase = { id: string; emoji: string; label: string; say: string; tool?: { tool: ToolId; line: string } };
export type Mode =
  | (ModeBase & { kind: "scenes"; scenes: Scene[]; miss: string })
  | (ModeBase & { kind: "myths"; myths: Myth[]; un: string; miss: string })
  | (ModeBase & { kind: "list"; items: ListItem[]; footer?: string })
  | (ModeBase & { kind: "ask"; items: AskItem[]; footer?: string });

export type GameConfig = {
  gameId: string;
  title: string;
  coins?: number;
  doneTitle: string;
  greet: string;
  home: string;
  badge: string;
  complete: string;
  modes: Mode[];
};

export function ModesEngine({ config, onExit }: { config: GameConfig; onExit: () => void }) {
  const { modes } = config;
  const target = modes.length;
  const [mode, setMode] = useState<string>("home");
  const [muted, setMuted] = useState(false);
  const [bubble, setBubble] = useState(config.greet);
  const [done, setDone] = useState(false);
  const [badges, setBadges] = useState<Set<string>>(new Set());
  const [idx, setIdx] = useState<Record<string, number>>({});
  const [busted, setBusted] = useState<Record<string, boolean>>({});
  const [got, setGot] = useState<Record<string, Set<number>>>({});

  const say = useCallback((t: string, onEnd?: () => void) => { setBubble(t); speak(t, { muted, onEnd }); }, [muted]);

  useEffect(() => {
    speak(config.greet, { muted });
    return () => stopSpeaking();
    // greet once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const earn = useCallback((id: string) => {
    setBadges((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev); next.add(id);
      celebrate("small");
      if (next.size >= target) window.setTimeout(() => say(config.complete, () => setDone(true)), 1200);
      else say(config.badge);
      return next;
    });
  }, [say, target, config.complete, config.badge]);

  const reset = () => {
    setBadges(new Set()); setIdx({}); setBusted({}); setGot({}); setDone(false); setMode("home"); say(config.greet);
  };

  const go = (id: string) => {
    setMode(id);
    if (id === "home") { say(config.home); return; }
    const m = modes.find((x) => x.id === id);
    if (!m) return;
    if (m.kind === "scenes") setIdx((s) => ({ ...s, [id]: 0 }));
    if (m.kind === "myths") { setIdx((s) => ({ ...s, [id]: 0 })); setBusted((b) => ({ ...b, [id]: false })); }
    say(m.say);
  };

  const active = modes.find((x) => x.id === mode);

  const chooseScene = (m: Extract<Mode, { kind: "scenes" }>) => (ok: boolean) => {
    const i = idx[m.id] ?? 0;
    if (!ok) { say(m.miss); return; }
    celebrate("small");
    say(m.scenes[i].result, () => { if (i + 1 >= m.scenes.length) { earn(m.id); go("home"); } else setIdx((s) => ({ ...s, [m.id]: i + 1 })); });
  };
  const chooseFact = (m: Extract<Mode, { kind: "myths" }>) => (ok: boolean) => {
    const i = idx[m.id] ?? 0;
    if (!ok) { say(m.miss); return; }
    setBusted((b) => ({ ...b, [m.id]: true })); celebrate("small"); say(m.myths[i].re);
  };
  const nextMyth = (m: Extract<Mode, { kind: "myths" }>) => {
    const i = idx[m.id] ?? 0;
    if (i + 1 >= m.myths.length) { earn(m.id); go("home"); }
    else { setBusted((b) => ({ ...b, [m.id]: false })); setIdx((s) => ({ ...s, [m.id]: i + 1 })); }
  };
  const tapItem = (m: Mode, i: number, total: number, line: string) => {
    const cur = got[m.id] ?? new Set<number>();
    if (cur.has(i)) return;
    const next = new Set(cur); next.add(i);
    setGot((g) => ({ ...g, [m.id]: next })); say(line); celebrate("small");
    if (next.size >= total) earn(m.id);
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
      <span className="glass-pill flex-1 rounded-2xl px-4 py-2.5 text-center text-base font-bold backdrop-blur-md backdrop-saturate-150" style={{ color: "var(--color-ink)" }}>{bubble}</span>
    </div>
  );
  const HomeBtn = (
    <button type="button" onClick={() => go("home")} className="glass-pill mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95">
      <Home className="size-5" aria-hidden /> Home
    </button>
  );
  const BadgeBook = (
    <div className="glass-card flex justify-center gap-2 rounded-2xl p-2.5 backdrop-blur-[12px] backdrop-saturate-150" aria-label={`${badges.size} of ${target} badges`}>
      {modes.map((m) => (
        <span key={m.id} className={`text-2xl ${badges.has(m.id) ? "animate-in zoom-in duration-300" : "opacity-40"}`} aria-hidden>{badges.has(m.id) ? "🏅" : "🤍"}</span>
      ))}
    </div>
  );
  const SceneView = (m: Extract<Mode, { kind: "scenes" }>) => {
    const i = idx[m.id] ?? 0; const sc = m.scenes[i];
    return (
      <>
        <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
          <span className="text-5xl" aria-hidden>{sc.emoji}</span>
          <p className="font-display text-base font-bold text-foreground">{sc.situation}</p>
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          {sc.options.map((o, k) => (
            <button key={k} type="button" onClick={() => chooseScene(m)(o.ok)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.98]">{o.text}</button>
          ))}
        </div>
        <p className="text-center text-xs text-foreground/60">{i + 1} / {m.scenes.length}</p>
      </>
    );
  };

  if (done) {
    return (
      <GameShell title={config.title} tools={tools} onExit={onExit}>
        <GameDone gameId={config.gameId} stars={3} coins={config.coins ?? 35} title={config.doneTitle} blurb={config.complete} onReplay={reset} onExit={onExit} />
      </GameShell>
    );
  }

  return (
    <GameShell title={config.title} tools={tools} onExit={onExit}>
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        {SamSays}
        {BadgeBook}
        {active?.tool && <ToolMoment tool={active.tool.tool} line={active.tool.line} />}

        {mode === "home" && (
          <div className="grid grid-cols-2 gap-2.5">
            {modes.map((m) => (
              <button key={m.id} type="button" onClick={() => go(m.id)} className="glass-card flex flex-col items-center gap-1.5 rounded-2xl py-5 backdrop-blur-[12px] backdrop-saturate-150 transition-transform active:scale-[0.97]">
                <span className="text-4xl" aria-hidden>{m.emoji}</span>
                <span className="text-center text-sm font-bold text-foreground">{m.label}</span>
              </button>
            ))}
          </div>
        )}

        {active?.kind === "scenes" && active.scenes[idx[active.id] ?? 0] && (<>{SceneView(active)}{HomeBtn}</>)}

        {active?.kind === "myths" && active.myths[idx[active.id] ?? 0] && (() => {
          const i = idx[active.id] ?? 0; const my = active.myths[i]; const isBusted = busted[active.id];
          return (
            <>
              <div className="glass-card flex flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center backdrop-blur-[12px] backdrop-saturate-150">
                {my.boss && !isBusted && <span className="text-[11px] font-bold uppercase tracking-wide text-amber-300">Boss Myth</span>}
                <p className={`font-display text-base font-bold ${isBusted ? "text-foreground/40 line-through" : "animate-pulse"}`} style={isBusted ? undefined : { color: "#ff9085" }}>{my.myth}</p>
              </div>
              {isBusted ? (
                <>
                  <UnReBeat un={active.un} re={my.re} />
                  <button type="button" onClick={() => nextMyth(active)} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">💥 {i + 1 >= active.myths.length ? "Last one busted!" : "Next myth"}</button>
                </>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {my.facts.map((f, k) => (
                    <button key={k} type="button" onClick={() => chooseFact(active)(f.ok)} className="glass-card rounded-2xl px-4 py-3 text-left text-sm font-semibold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.98]">{f.text}</button>
                  ))}
                </div>
              )}
              <p className="text-center text-xs text-foreground/60">Myth {i + 1} / {active.myths.length}</p>
              {HomeBtn}
            </>
          );
        })()}

        {active?.kind === "list" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {active.items.map((c, i) => {
                const hit = (got[active.id] ?? new Set()).has(i);
                return (
                  <button key={i} type="button" onClick={() => tapItem(active, i, active.items.length, c.say)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={hit ? { boxShadow: "inset 0 0 0 2px #059669" } : undefined}>
                    <span className="text-2xl" aria-hidden>{c.emoji}</span>
                    <span className="flex-1 text-sm font-semibold text-foreground">{c.say}</span>
                    {hit && <Check className="size-5 text-foreground" aria-hidden />}
                  </button>
                );
              })}
            </div>
            <p className="text-center text-xs text-foreground/60">{(got[active.id] ?? new Set()).size} / {active.items.length}{active.footer ? ` · ${active.footer}` : ""}</p>
            {HomeBtn}
          </>
        )}

        {active?.kind === "ask" && (
          <>
            <div className="grid grid-cols-1 gap-2.5">
              {active.items.map((it, i) => {
                const hit = (got[active.id] ?? new Set()).has(i);
                return (
                  <button key={i} type="button" onClick={() => tapItem(active, i, active.items.length, it.a)} className="glass-card flex flex-col gap-1.5 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]" style={hit ? { boxShadow: `inset 0 0 0 2px ${it.help ? "#F59E0B" : "#059669"}` } : undefined}>
                    <span className="flex items-center gap-2 text-sm font-bold text-foreground"><span aria-hidden>{it.help ? "🆘" : "💬"}</span> {it.q}</span>
                    {hit && <span className="text-sm font-medium text-foreground/85">{it.a}</span>}
                  </button>
                );
              })}
            </div>
            <p className="text-center text-xs text-foreground/60">{active.footer ?? "Private & anonymous — help is always here."}</p>
            {HomeBtn}
          </>
        )}
      </div>
    </GameShell>
  );
}
