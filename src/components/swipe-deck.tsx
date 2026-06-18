"use client";

import { useRef, useState } from "react";
import { Check, Flag, LifeBuoy, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Card as GameCard, DeckSummary, Flag as FlagType } from "@/lib/types";
import { cardPoints, POINTS } from "@/lib/scoring";
import { useProfile } from "@/lib/store";

type Props = {
  cards: GameCard[];
  deckId: DeckSummary["deckId"];
  mode?: "score" | "review";
  onComplete: (summary: DeckSummary) => void;
};

const COMMIT_FRACTION = 0.35;
const THOUGHTFUL_MS = 1200;

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* not supported */
    }
  }
}

export function SwipeDeck({ cards, deckId, mode = "score", onComplete }: Props) {
  const { recordCard } = useProfile();
  const scoring = mode === "score";

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"play" | "reveal">("play");
  const [chosen, setChosen] = useState<FlagType | null>(null);
  const [dx, setDx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const missedRef = useRef<GameCard[]>([]);
  const startX = useRef<number | null>(null);
  const moved = useRef(false);
  const stackRef = useRef<HTMLDivElement>(null);
  const revealAt = useRef(0);

  const card = cards[index];
  const correct = chosen !== null && chosen === card.correct_flag;

  function commit(flag: FlagType) {
    if (phase !== "play") return;
    const isCorrect = flag === card.correct_flag;
    vibrate(card.is_safeguarding ? [12, 40, 12] : 10);

    if (scoring && !card.is_safeguarding) {
      const nextStreak = isCorrect ? streak + 1 : 0;
      setStreak(nextStreak);
      setBestStreak((b) => Math.max(b, nextStreak));
      setScore((s) => s + cardPoints(card, isCorrect, nextStreak));
      if (isCorrect) setCorrectCount((c) => c + 1);
      else missedRef.current = [...missedRef.current, card];
      recordCard(card.signId, isCorrect);
    }

    setChosen(flag);
    setDx(0);
    setPhase("reveal");
    revealAt.current = Date.now();
  }

  function next() {
    if (scoring && !card.is_safeguarding && Date.now() - revealAt.current > THOUGHTFUL_MS) {
      setScore((s) => s + POINTS.thoughtful);
    }
    const last = index + 1 >= cards.length;
    if (last) {
      const scored = cards.filter((c) => !c.is_safeguarding).length;
      onComplete({
        deckId,
        total: scored,
        correct: correctCount,
        score,
        bestStreak,
        missed: missedRef.current,
      });
      return;
    }
    setIndex((i) => i + 1);
    setChosen(null);
    setPhase("play");
  }

  // ── drag handlers (top card) ──
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (phase !== "play") return;
    startX.current = e.clientX;
    moved.current = false;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (startX.current === null) return;
    const delta = e.clientX - startX.current;
    if (Math.abs(delta) > 6) moved.current = true;
    setDx(delta);
  }
  function onPointerUp() {
    if (startX.current === null) return;
    startX.current = null;
    const width = stackRef.current?.offsetWidth ?? 320;
    const threshold = width * COMMIT_FRACTION;
    if (dx > threshold) commit("green");
    else if (dx < -threshold) commit("red");
    else setDx(0); // below threshold: snap back, no decision recorded
  }

  const rotate = dx / 18;
  const greenHint = Math.max(0, Math.min(1, dx / 120));
  const redHint = Math.max(0, Math.min(1, -dx / 120));
  const progress = `${index + 1} / ${cards.length}`;

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5">
      {/* status row */}
      <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
        <span>{mode === "review" ? `Review ${progress}` : `Card ${progress}`}</span>
        {scoring ? (
          <span className="flex items-center gap-3">
            {streak >= 3 && <span className="font-semibold text-primary">🔥 {streak}</span>}
            <span>{score} pts</span>
          </span>
        ) : (
          <span>Practice</span>
        )}
      </div>

      {/* card stack */}
      <div ref={stackRef} className="relative h-80 w-full select-none">
        {cards[index + 1] && phase === "play" && (
          <Card className="absolute inset-0 scale-95 opacity-60" aria-hidden />
        )}

        {/* front (scenario) */}
        <Card
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{
            transform: `translateX(${dx}px) rotate(${rotate}deg)`,
            transition: startX.current === null ? "transform 0.25s ease" : "none",
          }}
          className="absolute inset-0 flex touch-none cursor-grab flex-col gap-4 p-6 active:cursor-grabbing"
        >
          <span className="self-start rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-secondary-foreground">
            {card.context_tag}
          </span>
          <p className="flex flex-1 items-center text-center text-lg font-semibold leading-snug">
            {card.scenario_text}
          </p>
          {/* drag stamps — colour is never the only signal (icon + label + position) */}
          <span
            className="pointer-events-none absolute right-4 top-14 flex items-center gap-1 rounded-md border-2 px-2 py-0.5 text-xs font-bold uppercase"
            style={{ opacity: greenHint, color: "var(--flag-green)", borderColor: "var(--flag-green)" }}
          >
            <Check className="size-3.5" aria-hidden /> Green flag
          </span>
          <span
            className="pointer-events-none absolute left-4 top-14 flex items-center gap-1 rounded-md border-2 px-2 py-0.5 text-xs font-bold uppercase"
            style={{ opacity: redHint, color: "var(--flag-red)", borderColor: "var(--flag-red)" }}
          >
            <Flag className="size-3.5" aria-hidden /> Red flag
          </span>
          <span className="text-center text-[11px] text-muted-foreground">
            Healthy or unhealthy? Swipe or use the buttons.
          </span>
        </Card>

        {/* reveal overlay */}
        {phase === "reveal" && chosen && (
          <Card
            className="absolute inset-0 flex animate-in fade-in zoom-in-95 flex-col gap-3 p-6 duration-200"
            style={
              card.is_safeguarding
                ? undefined
                : { borderColor: correct ? "var(--flag-green)" : "var(--flag-red)" }
            }
          >
            {card.is_safeguarding ? (
              <SafeguardingReveal card={card} onNext={next} />
            ) : (
              <ScoredReveal card={card} correct={correct} onNext={next} />
            )}
          </Card>
        )}
      </div>

      {/* action buttons (the no-gesture, accessible path) */}
      <div className="flex w-full items-center justify-center gap-4">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 gap-2"
          disabled={phase !== "play"}
          onClick={() => commit("red")}
          style={{ borderColor: "color-mix(in oklab, var(--flag-red) 45%, transparent)" }}
        >
          <Flag className="size-4" aria-hidden style={{ color: "var(--flag-red)" }} /> Red
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex-1 gap-2"
          disabled={phase !== "play"}
          onClick={() => commit("green")}
          style={{ borderColor: "color-mix(in oklab, var(--flag-green) 45%, transparent)" }}
        >
          <Check className="size-4" aria-hidden style={{ color: "var(--flag-green)" }} /> Green
        </Button>
      </div>
    </div>
  );
}

function ScoredReveal({
  card,
  correct,
  onNext,
}: {
  card: GameCard;
  correct: boolean;
  onNext: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-2">
        <span
          className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide"
          style={{ color: correct ? "var(--flag-green)" : "var(--flag-red)" }}
        >
          {correct ? <Check className="size-4" aria-hidden /> : <Flag className="size-4" aria-hidden />}
          {correct ? "Spot on" : "Look again"}
        </span>
        {card.is_disguised && (
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
            Disguised
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold leading-tight">{card.sign}</p>
      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{card.feedback_short}</p>
      <div className="flex items-center justify-between">
        {card.learn_more_ref ? (
          <a href="/flagpedia" className="text-xs font-medium text-primary underline-offset-2 hover:underline">
            Learn more
          </a>
        ) : (
          <span />
        )}
        <Button size="sm" className="gap-1.5" onClick={onNext}>
          Next <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>
    </>
  );
}

function SafeguardingReveal({ card, onNext }: { card: GameCard; onNext: () => void }) {
  return (
    <>
      <span className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
        <LifeBuoy className="size-4" aria-hidden /> This one matters
      </span>
      <p className="text-2xl font-semibold leading-tight">{card.sign}</p>
      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{card.feedback_short}</p>
      <p className="text-xs text-muted-foreground">
        Tap <span className="font-medium text-foreground">Get Help</span> (bottom-right) any time.
        This isn&apos;t scored.
      </p>
      <div className="flex justify-end">
        <Button size="sm" variant="secondary" onClick={onNext}>
          I understand
        </Button>
      </div>
    </>
  );
}
