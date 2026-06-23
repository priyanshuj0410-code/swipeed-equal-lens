"use client";

import { useState } from "react";
import { X, Wind, Briefcase } from "lucide-react";
import { useProfile } from "@/lib/store";
import { unlockedTools, toolLevel } from "@/lib/toolkit";
import { ToolPlayer } from "@/components/toolkit/tool-player";
import { BreathingSpace } from "@/components/toolkit/breathing-space";
import type { ToolId } from "@/lib/types";

// The always-available Toolkit drawer — the home base for the Life-Skills Toolkit. A small launcher pill
// (hidden until the child has unlocked their first tool by playing a Thread-C game) opens a sheet listing
// the tools they carry, plus a one-tap Breathing space. Other games *reference* these via tool moments.
type Open = null | "drawer" | "breathing" | { tool: ToolId };

export function ToolkitDrawer() {
  const { profile, useTool } = useProfile();
  const [open, setOpen] = useState<Open>(null);
  const tools = unlockedTools(profile);

  if (tools.length === 0) return null; // nothing to carry yet

  const openTool = (id: ToolId) => {
    useTool(id);
    setOpen({ tool: id });
  };

  return (
    <>
      {/* launcher */}
      <button
        type="button"
        onClick={() => setOpen("drawer")}
        aria-label="Open your toolkit"
        className="toolkit-trigger glass-pill fixed bottom-4 left-4 z-50 flex h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95"
      >
        <Briefcase className="size-4 shrink-0" aria-hidden />
        <span>Toolkit</span>
      </button>

      {/* drawer sheet */}
      {open === "drawer" && (
        <div className="fixed inset-0 z-[55] flex items-end justify-center bg-slate-950/60 backdrop-blur-sm" onClick={() => setOpen(null)}>
          <div
            className="glass-card w-full max-w-sm rounded-t-3xl p-5 pb-12 backdrop-blur-[16px] backdrop-saturate-150 animate-in slide-in-from-bottom duration-300"
            style={{ paddingBottom: "max(3rem, calc(env(safe-area-inset-bottom) + 1.5rem))" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-foreground">Your Toolkit</h2>
              <div className="flex items-center gap-2">
                {(profile.dailyStreak?.count ?? 0) >= 2 && (
                  <span className="rounded-full bg-foreground/15 px-2.5 py-1 text-[11px] font-semibold text-foreground/85">
                    🔥 {profile.dailyStreak!.count}-day streak
                  </span>
                )}
                <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="flex size-8 items-center justify-center rounded-full bg-foreground/10 transition-transform active:scale-95">
                  <X className="size-4 text-foreground" aria-hidden />
                </button>
              </div>
            </div>
            <p className="mb-4 text-xs text-foreground/60">Four skills you carry — open any one, any time.</p>

            <button
              type="button"
              onClick={() => setOpen("breathing")}
              className="mb-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95"
            >
              <Wind className="size-5" aria-hidden /> Breathing space
            </button>

            <div className="flex flex-col gap-2.5">
              {tools.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => openTool(t.id)}
                  className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]"
                >
                  <span className="text-3xl" aria-hidden>{t.emoji}</span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold text-foreground">{t.name}</span>
                    <span className="block text-xs text-foreground/60">{t.tagline}</span>
                  </span>
                  <span className="rounded-full bg-foreground/15 px-2 py-0.5 text-[11px] font-semibold text-foreground/80">
                    Lv {toolLevel(profile, t.id)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {open === "breathing" && <BreathingSpace onClose={() => setOpen("drawer")} />}
      {open !== null && typeof open === "object" && (
        <ToolPlayer toolId={open.tool} onClose={() => setOpen("drawer")} />
      )}
    </>
  );
}
