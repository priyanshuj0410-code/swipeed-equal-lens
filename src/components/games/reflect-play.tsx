"use client";

import { useRef, useState, type ReactNode } from "react";
import type { ReflectScenario } from "@/content/games/v2-schema";

// Reflect as a short conversation (SWED-97). The player picks an option, says in their own words why, sees their words
// with Lensy's affirm, answers one deeper question, and the beat closes on the relearn. Either answer can be skipped
// in one tap. What they write stays in this component's state: it is never saved, logged or sent.
//
// Three cases keep the old single tap. A safety beat ("it's never your fault") shows the reassurance and help straight
// away, because an open question there invites a disclosure the app cannot receive. Ages 3-6 get a card asking them to
// tell a grown-up nearby instead of a text box. And words that suggest harm to the player stop the conversation for a
// calm support card that points to Get help.

export type ReflectBand = "talk" | "kids" | "adults";

const NOTE_MAX = 280;
const ASK: Record<Exclude<ReflectBand, "talk">, string> = {
  kids: "What made you pick that one?",
  adults: "What makes that one fit for you?",
};
const DEEPER: Record<Exclude<ReflectBand, "talk">, string> = {
  kids: "What might a friend pick, and why?",
  adults: "What might someone close to you pick, and why?",
};
// a starter for the band's own questions; a scenario's tailored question gets a neutral one
const STARTER = { write: "I picked it because…", deeper: "I think they might…" };
const CLOSING = "Thanks for thinking it through.";
// Words that may mean a player is describing harm to themselves. Deliberately broad: a false match only shows a kind
// card and lets them carry on.
const DISTRESS = /\b(?:hurts? me|hurting me|hit(?:s|ting)? me|beat(?:s|ing)? me|touch(?:es|ed|ing)? me|abus\w*|rap(?:e|ed|ing)|molest\w*|harass\w*|kill (?:myself|me)|suicid\w*|wants? to die|wanna die|end my life|cut(?:ting)? myself|self[- ]?harm|hate myself|unsafe at home|scared to go home|no ?one cares|nobody cares|forc(?:e|ed|ing) (?:me|to marry)|maar(?:ta|te|ti)|peet(?:ta|te|ti))\b/i;

type Turn = "pick" | "talk" | "write" | "deeper" | "support" | "end";

export function ReflectPlay({ sc, band, safety, ask, say, onSolved, done, help }: {
  sc: ReflectScenario;
  band: ReflectBand;
  /** a safety beat: tap, reassure and offer help, with no text box */
  safety: boolean;
  /** put the next question on Lensy's card; `lead` is spoken before it */
  ask: (question: string, lead?: string) => void;
  say: (t: string, shown?: string) => void;
  /** `talked` means the conversation ran, so the affirm has been shown and the result closes on the relearn */
  onSolved: (picked?: string, branch?: undefined, talked?: boolean) => void;
  done: boolean;
  help: ReactNode;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const [turn, setTurn] = useState<Turn>("pick");
  const [notes, setNotes] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const resumeTo = useRef<"deeper" | "end">("deeper");
  const box = useRef<HTMLTextAreaElement>(null);
  const focusBox = () => requestAnimationFrame(() => box.current?.focus({ preventScroll: true }));
  const adult = band === "adults";

  const choose = (o: string) => {
    if (picked) return;
    setPicked(o);
    if (safety) { setTurn("end"); onSolved(o); return; }
    if (band === "talk") {
      setTurn("talk");
      ask("Tell a grown-up near you about your pick.", `${o}.`);
      return;
    }
    setTurn("write");
    ask(sc.ask ?? ASK[band], `${o}.`);
    focusBox();
  };
  const toDeeper = (note: string) => {
    setNotes(note ? [note] : []);
    setDraft("");
    setTurn("deeper");
    ask(sc.deeper ?? DEEPER[band === "talk" ? "kids" : band], sc.affirm);
    focusBox();
  };
  const finish = () => { setDraft(""); setTurn("end"); ask(CLOSING); onSolved(picked ?? undefined, undefined, true); };
  const share = () => {
    const text = draft.trim();
    if (!text) return;
    if (DISTRESS.test(text)) {
      resumeTo.current = turn === "write" ? "deeper" : "end";
      setDraft("");
      setTurn("support");
      ask("You're not alone with this.");
      say(supportLine(adult), "");
      return;
    }
    if (turn === "write") toDeeper(text);
    else { setNotes((n) => [...n, text]); finish(); }
  };
  const skip = () => (turn === "write" ? toDeeper("") : finish());

  const pickedCard = picked && (
    <div className="glass-card flex flex-col gap-0.5 rounded-2xl px-4 py-3 text-left" data-state="selected">
      <span className="text-xs font-bold text-foreground/60">Your pick</span>
      <span className="text-[15px] font-bold leading-snug text-foreground">{picked}</span>
    </div>
  );
  const wrote = (text: string, i: number) => (
    <div key={i} className="glass-pill flex flex-col gap-0.5 rounded-2xl px-4 py-3 text-left">
      <span className="text-xs font-bold text-foreground/60">You wrote</span>
      <span className="whitespace-pre-wrap break-words text-[15px] font-semibold leading-snug text-foreground">{text}</span>
    </div>
  );

  if (turn === "pick") {
    return (
      <div className="grid grid-cols-1 gap-2.5">
        {sc.options.map((o) => (
          <button key={o} type="button" onClick={() => choose(o)} className="glass-card flex items-center justify-center rounded-2xl px-3 py-4 text-center text-[15px] font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.96]">{o}</button>
        ))}
      </div>
    );
  }

  if (turn === "end" || done) {
    return <div className="flex flex-col gap-2.5">{pickedCard}{notes.map(wrote)}</div>;
  }

  if (turn === "talk") {
    return (
      <div className="flex flex-col gap-2.5">
        {pickedCard}
        <div className="glass-pill flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] font-semibold leading-snug text-foreground">
          <span className="text-2xl" aria-hidden>🗣️</span>
          <span>Say it out loud to a grown-up near you. They would love to hear it.</span>
        </div>
        <button type="button" onClick={() => { setTurn("end"); onSolved(picked ?? undefined); }}
          className="cta flex h-12 w-full items-center justify-center rounded-2xl bg-[var(--color-sun)] text-base font-extrabold text-slate-900 transition-transform active:scale-95">
          I told them
        </button>
        <button type="button" onClick={() => { setTurn("end"); onSolved(picked ?? undefined); }}
          className="mx-auto rounded-full px-4 py-2 text-sm font-semibold text-foreground/60 transition-colors hover:text-foreground active:scale-95">
          Maybe later
        </button>
      </div>
    );
  }

  if (turn === "support") {
    return (
      <div className="flex flex-col gap-2.5">
        <div className="glass-card flex flex-col gap-1.5 rounded-2xl px-4 py-3.5 text-left">
          <span className="text-[15px] font-bold leading-snug text-foreground">{supportLine(adult)}</span>
          <span className="text-sm font-semibold leading-snug text-foreground/80">
            {adult ? "Get help at the top of the screen has free lines you can call." : "You can also tap Get help at the top of the screen."}
          </span>
        </div>
        {help}
        <button type="button" onClick={() => (resumeTo.current === "deeper" ? toDeeper("") : finish())}
          className="cta flex h-12 w-full items-center justify-center rounded-2xl bg-[var(--color-sun)] text-base font-extrabold text-slate-900 transition-transform active:scale-95">
          Continue
        </button>
      </div>
    );
  }

  // write or deeper: a text box the player can fill or skip
  return (
    <div className="flex flex-col gap-2.5">
      {pickedCard}
      {turn === "deeper" && notes.map(wrote)}
      {turn === "deeper" && (
        <div className="glass-pill rounded-2xl px-4 py-3 text-left text-[15px] font-semibold leading-snug text-foreground">💛 {sc.affirm}</div>
      )}
      <label className="flex flex-col gap-1.5">
        <span className="sr-only">{turn === "write" ? sc.ask ?? ASK[band === "talk" ? "kids" : band] : sc.deeper ?? DEEPER[band === "talk" ? "kids" : band]}</span>
        <textarea ref={box} value={draft} maxLength={NOTE_MAX} rows={3} onChange={(e) => setDraft(e.target.value)} placeholder={(turn === "write" ? sc.ask : sc.deeper) ? "Write a few words…" : STARTER[turn]}
          className="w-full resize-none rounded-2xl border-[2.5px] border-[var(--color-ink)] bg-[var(--color-paper)] px-4 py-3 text-base font-semibold text-[var(--color-ink)] outline-none transition-colors placeholder:font-medium placeholder:text-[color-mix(in_oklch,var(--color-ink),transparent_55%)] focus-visible:border-[var(--color-brand)]" />
      </label>
      <p className="flex justify-between gap-3 px-1 text-xs font-semibold text-foreground/60">
        <span>Only you see this. It isn&apos;t saved or sent anywhere.</span>
        <span aria-hidden className="tabular-nums">{draft.length}/{NOTE_MAX}</span>
      </p>
      <button type="button" onClick={share} disabled={!draft.trim()}
        className="cta flex h-12 w-full items-center justify-center rounded-2xl bg-[var(--color-sun)] text-base font-extrabold text-slate-900 transition-transform active:scale-95 disabled:opacity-50">
        That&apos;s my answer
      </button>
      <button type="button" onClick={skip}
        className="mx-auto rounded-full px-4 py-2 text-sm font-semibold text-foreground/60 transition-colors hover:text-foreground active:scale-95">
        Skip
      </button>
    </div>
  );
}

function supportLine(adult: boolean): string {
  return adult
    ? "It sounds like something may be hard right now. If this is happening to you, it is not your fault, and you don't have to handle it alone."
    : "It sounds like something may be hard right now. If someone is hurting you, it is not your fault. Tell a grown-up you trust.";
}
