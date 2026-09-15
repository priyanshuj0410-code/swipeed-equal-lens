"use client";

import { useEffect, useRef, useState } from "react";
import { AnswerCard } from "@/components/games/answer-cells";
import { RevealGate, revealDelayMs } from "@/components/games/lensy-question";
import { shuffle, type StoryScenario } from "@/content/games/v2-schema";

// A multi-step branch or role-play (SWED-96): 3 to 5 questions on one situation. Each pick shows what happens next (or
// what the other person says back) and leads into the next question on Lensy's card; nothing is marked right or wrong
// until the last one, when every pick is shown beside the best option and why it is best. The engine keeps this
// mounted through its resolve so the recap stays on screen above the take-away and Next.

export const RECAP_QUESTION = "Let's look back at each choice.";

const vibrate = (ms: number) => { try { navigator.vibrate?.(ms); } catch { /* unsupported */ } };

export function StoryPlay({ sc, ask, say, onSolved, done }: {
  sc: StoryScenario;
  /** put the next question on Lensy's card and speak it */
  ask: (question: string) => void;
  say: (t: string, shown?: string) => void;
  onSolved: () => void;
  /** the engine is showing the result: render the recap */
  done: boolean;
}) {
  const talk = sc.type === "role-play";
  const n = sc.steps.length;
  const [order] = useState(() => sc.steps.map((st) => shuffle(st.options.map((_, i) => i))));
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);
  // the first question's answers were already held back by the engine; later ones wait here to be read
  const [shown, setShown] = useState(true);
  const continueRef = useRef<HTMLButtonElement>(null);
  const current = sc.steps[step];
  const picked = picks[step];

  useEffect(() => {
    if (shown || done) return;
    const t = window.setTimeout(() => setShown(true), revealDelayMs(current.prompt));
    return () => window.clearTimeout(t);
  }, [shown, done, current.prompt]);

  const pick = (i: number) => {
    if (picked !== undefined) return;
    setPicks((p) => { const np = [...p]; np[step] = i; return np; });
    vibrate(8);
    say(current.options[i].then, "");
    requestAnimationFrame(() => continueRef.current?.focus({ preventScroll: true }));
  };
  const advance = () => {
    if (step + 1 < n) {
      setStep(step + 1);
      setShown(false);
      ask(sc.steps[step + 1].prompt);
      return;
    }
    ask(RECAP_QUESTION);
    onSolved();
  };

  if (done) {
    return (
      <ol aria-label={talk ? "How the talk went" : "How it went"} className="flex flex-col gap-2.5">
        {sc.steps.map((st, i) => {
          const mine = st.options[picks[i]];
          const best = st.options.find((o) => o.best) ?? st.options[0];
          const got = mine === best;
          return (
            <li key={i} data-state={got ? "done" : undefined} className="glass-card flex flex-col gap-1 rounded-2xl px-4 py-3 text-left">
              <p className="text-xs font-semibold leading-snug text-foreground/60">Question {i + 1}: {st.prompt}</p>
              <p className="text-xs font-bold text-foreground/70">{got ? `✓ Your ${talk ? "line" : "pick"} was the best one` : `Your ${talk ? "line" : "pick"}`}</p>
              <p className="text-[15px] font-bold leading-snug text-foreground">{mine?.text}</p>
              {!got && (
                <>
                  <p className="mt-1 text-xs font-bold text-foreground/70">{talk ? "Best line" : "Best move"}</p>
                  <p className="text-[15px] font-bold leading-snug text-foreground">{best.text}</p>
                </>
              )}
              <p className="mt-1 text-sm font-semibold leading-snug text-foreground/80">{st.why}</p>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-center text-xs font-semibold text-foreground/60">Question {step + 1} of {n}</p>
      {picked === undefined ? (
        shown ? (
          <div className="grid grid-cols-1 gap-2.5">
            {order[step].map((i) => (
              <AnswerCard key={`${step}:${i}`} state="idle" onClick={() => pick(i)} aria-label={talk ? `Say: ${current.options[i].text}` : undefined}
                className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-[15px] font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-[0.98]">
                <span className="text-2xl" aria-hidden>{talk ? "🗣️" : "🔀"}</span><span className="flex-1">{current.options[i].text}</span>
              </AnswerCard>
            ))}
          </div>
        ) : (
          <RevealGate onReveal={() => setShown(true)} />
        )
      ) : (
        <>
          <AnswerCard state="selected" disabled aria-label={`${talk ? "You said" : "You chose"}: ${current.options[picked].text}`}
            className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-[15px] font-bold text-foreground disabled:opacity-100">
            <span className="text-2xl" aria-hidden>{talk ? "🗣️" : "🔀"}</span><span className="flex-1">{current.options[picked].text}</span>
          </AnswerCard>
          <div className="glass-pill flex flex-col gap-0.5 rounded-2xl px-4 py-3 text-left">
            <span className="text-xs font-bold text-foreground/60">{talk ? "They reply" : "What happens"}</span>
            <span className="text-[15px] font-semibold leading-snug text-foreground">{current.options[picked].then}</span>
          </div>
          <button ref={continueRef} type="button" onClick={advance}
            className="cta flex h-12 w-full items-center justify-center rounded-2xl bg-[var(--color-sun)] text-base font-extrabold text-slate-900 transition-transform active:scale-95">
            {step + 1 < n ? "Continue" : "See how it went"}
          </button>
        </>
      )}
    </div>
  );
}
