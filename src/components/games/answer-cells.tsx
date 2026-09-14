"use client";

import type { ButtonHTMLAttributes, CSSProperties, ReactNode, Ref } from "react";

// Answer cards for match and sort, shared by the v2 lesson engine and the rich capstone engine.
//
// Playtesters saw options change size mid-question: selected and matched cells swapped the card's hard shadow for
// an inset ring, match numbers were inline text that re-wrapped, and sort bins grew as chips landed. A state now
// only recolours a card (`.glass-card[data-state]` in globals.css) and marks it with a corner badge, so nothing on
// screen moves while the player works (see knowledge/design.md, Components).

export type AnswerState = "idle" | "selected" | "target" | "done";

/** A small round marker pinned to a card's corner: a pair number, a zone emoji, the armed-zone arrow. */
export function CornerBadge({ children, tint }: { children: ReactNode; tint?: string }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -right-2 -top-2 grid size-6 place-items-center rounded-full border-2 text-xs font-extrabold leading-none"
      style={{ borderColor: "var(--color-ink)", background: tint ?? "var(--color-surface)", color: tint ? "var(--prx-on-fill)" : "var(--color-ink)" }}
    >
      {children}
    </span>
  );
}

type AnswerCardProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  state: AnswerState;
  /** colour of the done state (a correct match, the zone a chip landed in) */
  tint?: string;
  badge?: ReactNode;
  badgeTint?: string;
  ref?: Ref<HTMLButtonElement>;
};

export function AnswerCard({ state, tint, badge, badgeTint, className = "", style, children, ref, ...rest }: AnswerCardProps) {
  return (
    <button
      ref={ref}
      type="button"
      data-state={state}
      className={`glass-card relative ${className}`}
      style={tint ? ({ ...style, "--cell-tint": tint } as CSSProperties) : style}
      {...rest}
    >
      {children}
      {badge != null && <CornerBadge tint={badgeTint}>{badge}</CornerBadge>}
    </button>
  );
}
