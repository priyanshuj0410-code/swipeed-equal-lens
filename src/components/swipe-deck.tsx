"use client";

import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type LearnCard = {
  id: number;
  tag: string;
  prompt: string;
  answer: string;
};

const CARDS: LearnCard[] = [
  {
    id: 1,
    tag: "Cognition",
    prompt: "What is the “generation effect”?",
    answer:
      "You remember information better when you actively produce it yourself rather than just reading it — the core idea behind active learning.",
  },
  {
    id: 2,
    tag: "Memory",
    prompt: "Why does spaced repetition beat cramming?",
    answer:
      "Revisiting material across increasing intervals fights the forgetting curve, strengthening recall far more than one long session.",
  },
  {
    id: 3,
    tag: "Focus",
    prompt: "Why is passive scrolling called “brainrot”?",
    answer:
      "Infinite low-effort feeds optimise for engagement, not understanding — they shorten attention and crowd out effortful thinking.",
  },
  {
    id: 4,
    tag: "Practice",
    prompt: "What is “retrieval practice”?",
    answer:
      "Recalling answers from memory (testing yourself) is one of the most effective ways to learn — much stronger than re-reading.",
  },
  {
    id: 5,
    tag: "Praxis",
    prompt: "What does “praxis” mean?",
    answer:
      "Turning theory into action — learning by doing. Exactly the habit SwipeEd is built to make daily.",
  },
];

const THRESHOLD = 120;

export function SwipeDeck() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [dx, setDx] = useState(0);
  const [known, setKnown] = useState(0);
  const startX = useRef<number | null>(null);
  const moved = useRef(false);

  const done = index >= CARDS.length;
  const card = CARDS[index];

  function advance(direction: "left" | "right") {
    if (direction === "right") setKnown((k) => k + 1);
    setIndex((i) => i + 1);
    setFlipped(false);
    setDx(0);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
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
    if (dx > THRESHOLD) advance("right");
    else if (dx < -THRESHOLD) advance("left");
    else setDx(0);
  }

  function onCardClick() {
    if (moved.current) {
      moved.current = false;
      return;
    }
    setFlipped((f) => !f);
  }

  function restart() {
    setIndex(0);
    setKnown(0);
    setFlipped(false);
    setDx(0);
  }

  if (done) {
    return (
      <Card className="flex w-full max-w-sm flex-col items-center gap-4 p-8 text-center">
        <span className="text-4xl">🎉</span>
        <h2 className="text-xl font-semibold">You’re caught up</h2>
        <p className="text-sm text-muted-foreground">
          You marked {known} of {CARDS.length} as known. In the full game these would feed
          spaced-repetition scheduling on the Praxis engine.
        </p>
        <Button onClick={restart} className="mt-2">
          Start over
        </Button>
      </Card>
    );
  }

  const rotate = dx / 18;
  const likeOpacity = Math.max(0, Math.min(1, dx / THRESHOLD));
  const reviewOpacity = Math.max(0, Math.min(1, -dx / THRESHOLD));

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
        <span>
          Card {index + 1} of {CARDS.length}
        </span>
        <span>{known} known</span>
      </div>

      <div className="relative h-80 w-full select-none">
        {CARDS[index + 1] && (
          <Card className="absolute inset-0 scale-95 opacity-60" aria-hidden />
        )}
        <Card
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onClick={onCardClick}
          style={{
            transform: `translateX(${dx}px) rotate(${rotate}deg)`,
            transition: startX.current === null ? "transform 0.25s ease" : "none",
          }}
          className="absolute inset-0 flex cursor-grab touch-none flex-col items-center justify-center gap-4 p-6 text-center active:cursor-grabbing"
        >
          <span className="absolute left-4 top-4 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-secondary-foreground">
            {card.tag}
          </span>
          <span
            className="absolute right-4 top-4 rounded-md border-2 border-primary px-2 py-0.5 text-xs font-bold uppercase text-primary"
            style={{ opacity: likeOpacity }}
          >
            Known
          </span>
          <span
            className="absolute left-4 top-12 rounded-md border-2 border-destructive px-2 py-0.5 text-xs font-bold uppercase text-destructive"
            style={{ opacity: reviewOpacity }}
          >
            Review
          </span>

          {flipped ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{card.answer}</p>
          ) : (
            <p className="text-lg font-semibold leading-snug">{card.prompt}</p>
          )}

          <span className="absolute bottom-4 text-[11px] text-muted-foreground">
            {flipped ? "tap to flip back" : "tap to reveal"}
          </span>
        </Card>
      </div>

      <div className="flex w-full items-center justify-center gap-4">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => advance("left")}
        >
          ↩ Review
        </Button>
        <Button size="lg" className="flex-1" onClick={() => advance("right")}>
          Known →
        </Button>
      </div>
    </div>
  );
}
