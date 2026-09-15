"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useProfile } from "@/lib/store";
import { isUnlocked, toolById } from "@/lib/toolkit";
import { ToolPlayer } from "@/components/toolkit/tool-player";
import type { ToolId } from "@/lib/types";

// In-context "tool moment": the spine's key mechanic. An optional, NEVER-BLOCKING nudge dropped at a
// high-stakes beat inside another game ("This is a Cool-Down moment: want to use it?"), pulling the same
// guided tool from the child's drawer so the skill is practised in the exact context it's needed.
// Self-hides if the tool isn't unlocked yet (a child only sees moments for skills they carry) or once
// dismissed. Does not pause or gate the host game.
export function ToolMoment({ tool, line }: { tool: ToolId; line?: string }) {
  const { profile, useTool } = useProfile();
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);

  if (dismissed || !isUnlocked(profile, tool)) return null;
  const t = toolById(tool);

  return (
    <>
      <div className="glass-pill flex items-center gap-2.5 rounded-2xl px-3 py-2.5 backdrop-blur-md backdrop-saturate-150" style={{ color: "var(--color-ink)" }}>
        <span className="text-xl" aria-hidden>{t.emoji}</span>
        <span className="flex-1 text-xs font-semibold leading-snug">
          {line ?? `This is a ${t.name} moment. Want to use it?`}
        </span>
        <button
          type="button"
          onClick={() => { useTool(tool); setOpen(true); }}
          className="cta shrink-0 rounded-full bg-[var(--color-sun)] px-3 py-1 text-xs font-bold text-slate-900 transition-transform active:scale-95"
        >
          Use it
        </button>
        <button type="button" onClick={() => setDismissed(true)} aria-label="Not now" className="shrink-0 text-foreground/55 transition-transform active:scale-95">
          <X className="size-4" aria-hidden />
        </button>
      </div>
      {open && <ToolPlayer toolId={tool} onClose={() => setOpen(false)} />}
    </>
  );
}
