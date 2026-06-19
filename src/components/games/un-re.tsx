"use client";

import { Eraser, Pencil } from "lucide-react";

// UN & RE — the unlearn–relearn duo behind SwipeEd's core principle (Unlearn → Relearn → Grow). They
// formally appear from age 6+. UN (the eraser) gently rubs out an old idea, without shame; RE (the
// pencil) redraws the truer one, with a reason. Shared so the duo looks/behaves the same everywhere.
export function UnReBeat({ un, re }: { un: string; re: string }) {
  return (
    <div className="glass-pill rounded-2xl px-4 py-3 text-sm leading-relaxed backdrop-blur-md backdrop-saturate-150 animate-in fade-in" style={{ color: "#eef1f7" }}>
      <p className="flex items-start gap-2">
        <Eraser className="mt-0.5 size-4 shrink-0" style={{ color: "#b3c8ff" }} aria-hidden />
        <span><b>UN:</b> {un}</span>
      </p>
      <p className="mt-1.5 flex items-start gap-2">
        <Pencil className="mt-0.5 size-4 shrink-0" style={{ color: "#62e08f" }} aria-hidden />
        <span><b>RE:</b> {re}</span>
      </p>
    </div>
  );
}
