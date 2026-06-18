"use client";

import { useRef, useState } from "react";
import { Check, Flag, LifeBuoy, ArrowRight, Flame, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Card as GameCard, DeckSummary, Flag as FlagType } from "@/lib/types";
import { cardPoints, POINTS } from "@/lib/scoring";
import { DECK_BY_ID } from "@/content/decks";
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
  const deckEmoji = DECK_BY_ID[deckId]?.emoji ?? "💡";

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"play" | "reveal">("play");
  const [chosen, setChosen] = useState<FlagType | null>(null);
  const [dx, setDx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [lastPoints, setLastPoints] = useState(0);
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

    let pts = 0;
    if (scoring && !card.is_safeguarding) {
      const nextStreak = isCorrect ? streak + 1 : 0;
      setStreak(nextStreak);
      setBestStreak((b) => Math.max(b, nextStreak));
      pts = cardPoints(card, isCorrect, nextStreak);
      setScore((s) => s + pts);
      if (isCorrect) setCorrectCount((c) => c + 1);
      else missedRef.current = [...missedRef.current, card];
      recordCard(card.signId, isCorrect);
    }

    setLastPoints(pts);
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
    else setDx(0);
  }

  const rotate = dx / 18;
  const greenHint = Math.max(0, Math.min(1, dx / 120));
  const redHint = Math.max(0, Math.min(1, -dx / 120));

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5">
      {/* status row */}
      <div className="flex w-full items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {mode === "review" ? "Review" : "Card"} {index + 1} / {cards.length}
        </span>
        {scoring ? (
          <div className="flex items-center gap-2">
            {streak >= 3 && (
              <span
                className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold text-white"
                style={{ background: "var(--flag-red)" }}
              >
                <Flame className="size-3.5" aria-hidden /> {streak}
              </span>
            )}
            <span className="rounded-full bg-card px-2.5 py-0.5 text-xs font-semibold shadow-sm ring-1 ring-border">
              {score} pts
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Practice</span>
        )}
      </div>

      {/* card stack */}
      <div ref={stackRef} className="relative h-[22rem] w-full select-none">
        {cards[index + 1] && phase === "play" && (
          <Card className="absolute inset-0 translate-y-2 scale-95 rounded-[1.75rem] opacity-50" aria-hidden />
        )}

        <Card
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{
            transform: `translateX(${dx}px) rotate(${rotate}deg)`,
            transition: startX.current === null ? "transform 0.25s ease" : "none",
          }}
          className="absolute inset-0 flex touch-none cursor-grab flex-col gap-4 rounded-[1.75rem] p-6 shadow-xl active:cursor-grabbing"
        >
          <span className="flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
            <span aria-hidden>{deckEmoji}</span> {card.context_tag}
          </span>

          <p className="flex flex-1 items-center text-balance text-center text-2xl font-bold leading-snug">
            {card.scenario_text}
          </p>

          <span
            className="pointer-events-none absolute right-5 top-16 flex items-center gap-1 rounded-lg border-2 px-2 py-0.5 text-xs font-extrabold uppercase"
            style={{ opacity: greenHint, color: "var(--flag-green)", borderColor: "var(--flag-green)", transform: "rotate(12deg)" }}
          >
            <Check className="size-3.5" aria-hidden /> Green
          </span>
          <span
            className="pointer-events-none absolute left-5 top-16 flex items-center gap-1 rounded-lg border-2 px-2 py-0.5 text-xs font-extrabold uppercase"
            style={{ opacity: redHint, color: "var(--flag-red)", borderColor: "var(--flag-red)", transform: "rotate(-12deg)" }}
          >
            <Flag className="size-3.5" aria-hidden /> Red
          </span>

          <span className="text-center text-[11px] text-muted-foreground">
            Healthy or unhealthy? Swipe the card or use the buttons.
          </span>
        </Card>

        {phase === "reveal" && chosen && (
          <Card
            className="absolute inset-0 flex animate-in fade-in zoom-in-95 flex-col gap-3 overflow-hidden rounded-[1.75rem] p-6 shadow-xl duration-200"
          >
            {card.is_safeguarding ? (
              <SafeguardingReveal card={card} onNext={next} />
            ) : (
              <ScoredReveal card={card} correct={correct} points={lastPoints} onNext={next} />
            )}
          </Card>
        )}
      </div>

      {/* action buttons */}
      <div className="flex w-full items-center justify-center gap-3">
        <Button
          size="lg"
          className="h-14 flex-1 gap-2 rounded-2xl text-base font-bold"
          disabled={phase !== "play"}
          onClick={() => commit("red")}
          style={{
            background: "color-mix(in oklab, var(--flag-red) 14%, var(--card))",
            color: "var(--flag-red)",
            border: "2px solid color-mix(in oklab, var(--flag-red) 35%, transparent)",
          }}
        >
          <Flag className="size-5" aria-hidden /> Red flag
        </Button>
        <Button
          size="lg"
          className="h-14 flex-1 gap-2 rounded-2xl text-base font-bold"
          disabled={phase !== "play"}
          onClick={() => commit("green")}
          style={{
            background: "color-mix(in oklab, var(--flag-green) 14%, var(--card))",
            color: "var(--flag-green)",
            border: "2px solid color-mix(in oklab, var(--flag-green) 35%, transparent)",
          }}
        >
          <Check className="size-5" aria-hidden /> Green flag
        </Button>
      </div>
    </div>
  );
}

function ScoredReveal({
  card,
  correct,
  points,
  onNext,
}: {
  card: GameCard;
  correct: boolean;
  points: number;
  onNext: () => void;
}) {
  const color = correct ? "var(--flag-green)" : "var(--flag-red)";
  return (
    <>
      <span
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ background: color }}
        aria-hidden
      />
      <div className="flex items-center justify-between pt-1">
        <span className="flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide" style={{ color }}>
          {correct ? <Check className="size-5" aria-hidden /> : <Flag className="size-5" aria-hidden />}
          {correct ? "Spot on" : "Look again"}
        </span>
        <div className="flex items-center gap-1.5">
          {card.is_disguised && (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
              Disguised
            </span>
          )}
          {correct && points > 0 && (
            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: color }}>
              <Sparkles className="size-3" aria-hidden /> +{points}
            </span>
          )}
        </div>
      </div>

      <p className="text-3xl font-extrabold leading-tight">{card.sign}</p>
      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{card.feedback_short}</p>

      <div className="flex items-center justify-between">
        {card.learn_more_ref ? (
          <a href="/flagpedia" className="text-xs font-semibold text-primary underline-offset-2 hover:underline">
            Learn more
          </a>
        ) : (
          <span />
        )}
        <Button className="h-11 gap-1.5 rounded-2xl px-5 font-bold" onClick={onNext}>
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
      <p className="text-2xl font-bold leading-tight">{card.sign}</p>
      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{card.feedback_short}</p>
      <p className="text-xs text-muted-foreground">
        Tap <span className="font-semibold text-foreground">Get Help</span> (bottom-right) any time.
        This isn&apos;t scored.
      </p>
      <div className="flex justify-end">
        <Button variant="secondary" className="h-11 rounded-2xl px-5 font-semibold" onClick={onNext}>
          I understand
        </Button>
      </div>
    </>
  );
}
