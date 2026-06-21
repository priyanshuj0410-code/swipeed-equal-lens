"use client";

import { TOOLS } from "@/lib/toolkit";
import { TOOL_GUIDE } from "@/content/toolkit";

// The capstone Thread-C reflection — a short "look at the skills you've grown" beat shown at a chapter
// graduation. It surfaces the Life-Skills Toolkit's progress (the four tools at this chapter's level), so
// a child sees their emotional & life-skills growth, not just topic knowledge. The final capstone looks
// back across the whole toolkit a young person carries into adulthood — the emotional bookend.
export function ToolkitReflection({ chapterLevel, final }: { chapterLevel: number; final?: boolean }) {
  const idx = Math.max(0, Math.min(chapterLevel, 5) - 1);
  return (
    <div className="glass-card w-full max-w-xs rounded-2xl px-5 py-4 backdrop-blur-[12px] backdrop-saturate-150" style={{ color: "var(--color-ink)" }}>
      <p className="mb-3 text-center font-display text-base font-bold">🧰 Skills you've grown</p>
      <div className="flex flex-col gap-2.5">
        {TOOLS.map((t) => (
          <div key={t.id} className="flex items-center gap-2.5 text-left">
            <span className="text-xl" aria-hidden>{t.emoji}</span>
            <span className="flex-1">
              <span className="block text-xs font-bold text-foreground">{t.name}</span>
              <span className="block text-[11px] leading-snug text-foreground/65">{TOOL_GUIDE[t.id].levelLabels[idx]}</span>
            </span>
          </div>
        ))}
      </div>
      {final && (
        <p className="mt-3 text-center text-xs font-semibold text-foreground/80">
          Four skills — carried for fifteen years, and yours for life. 💛
        </p>
      )}
    </div>
  );
}
