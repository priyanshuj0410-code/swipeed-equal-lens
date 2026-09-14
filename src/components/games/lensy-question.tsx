"use client";

import { useEffect, useRef } from "react";
import { Sam } from "@/components/games/sam";

// Lensy's question card, shared by the v2 lesson engine and the rich capstone engine.
//
// Playtesters read the answer cards and skipped the question: the old chat bubble was 15px on a borderless mist
// fill beside bold sticker cards, answers mounted in the same frame as the question, and the first nudge replaced
// the question. So the question is now the most prominent surface on screen, it stays put while the player works,
// and nudges or confirmations go to a fixed feedback line beneath it (see knowledge/design.md).

const NARRATOR = /(^|[.!?…]\s+)(?:Lensy|Sam)\s*:\s*(\S)/g;

/** Drop "Lensy:" / "Sam:" narrator prefixes: the card is already Lensy speaking. */
export function cleanLine(text: string): string {
  return text.replace(NARRATOR, (_, lead: string, first: string) => lead + first.toUpperCase()).replace(/\s{2,}/g, " ").trim();
}

const QUESTION_WORDS = new Set(["what", "who", "whom", "whose", "why", "how", "when", "where", "which", "do", "does", "did", "is", "are", "am", "was", "were", "can", "could", "would", "should", "will", "shall", "have", "has", "had", "may", "might", "must"]);

/**
 * One question per card. Joins a hook with the prompt or setup that follows it, without asking twice:
 * a prompt the hook already ends with is dropped, and a clipped tag question ("Agree?", "Land right?") is
 * dropped from the end of the hook when a real question follows.
 */
export function joinQuestion(hook: string, follow?: string): string {
  let h = cleanLine(hook);
  const f = follow ? cleanLine(follow) : "";
  if (!f) return h;
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (norm(h).endsWith(norm(f))) return h;
  const tag = h.match(/([.!?…])\s+([^.!?…]{1,24})\?$/);
  if (tag) {
    const words = tag[2].trim().split(/\s+/);
    if (words.length <= 3 && !QUESTION_WORDS.has(words[0].toLowerCase())) h = h.slice(0, tag.index! + 1);
  }
  return `${h} ${f}`;
}

/** How long answers wait after the question appears: reading time, capped so play never drags. */
export function revealDelayMs(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.min(4000, Math.max(1200, 1200 + words * 60));
}

export function LensyQuestion({ text, feedback = "", announce = "", focusKey, onTap }: {
  text: string;
  /** a nudge or confirmation shown on the fixed line under the card (never replaces the question) */
  feedback?: string;
  /** screen-reader-only text for results shown elsewhere on screen */
  announce?: string;
  /** focus moves to the question whenever this changes (a new beat) */
  focusKey?: string;
  /** tapping the question skips the wait for answers */
  onTap?: () => void;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (focusKey) ref.current?.focus({ preventScroll: true });
  }, [focusKey]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-2">
        <Sam size={48} />
        <div className="relative min-w-0 flex-1" onClick={onTap}>
          <h2
            ref={ref}
            tabIndex={-1}
            className="popover max-h-[38vh] overflow-y-auto text-left font-hand text-[19px] font-semibold leading-snug outline-none"
          >
            {text}
          </h2>
        </div>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true" className="flex min-h-10 items-center justify-center px-2 text-center text-sm font-semibold leading-tight text-foreground/80">
        {feedback}
        {announce && <span className="sr-only">{announce}</span>}
      </p>
    </div>
  );
}

/** Stands in for the answers while the question is being read; one tap shows them now. */
export function RevealGate({ onReveal }: { onReveal: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const reveal = () => {
    // The gate unmounts as the answers appear in its place, so hand focus to the first answer: keyboard and
    // screen-reader players carry on from here instead of starting again at the top of the page.
    const zone = ref.current?.parentElement;
    onReveal();
    requestAnimationFrame(() => zone?.querySelector<HTMLElement>('button:not(:disabled), [tabindex="0"]')?.focus({ preventScroll: true }));
  };
  return (
    <button ref={ref} type="button" onClick={reveal} className="mx-auto flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-foreground/60 transition-colors hover:text-foreground active:scale-95">
      Ready to answer? Tap here
    </button>
  );
}
