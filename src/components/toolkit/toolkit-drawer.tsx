"use client";

import { useState, useEffect } from "react";
import { X, Wind, Briefcase, LifeBuoy, Phone, ExternalLink, ChevronLeft } from "lucide-react";
import { useProfile } from "@/lib/store";
import { unlockedTools, toolLevel } from "@/lib/toolkit";
import { ToolPlayer } from "@/components/toolkit/tool-player";
import { BreathingSpace } from "@/components/toolkit/breathing-space";
import { HELP } from "@/content/help";
import type { ToolId } from "@/lib/types";

// The always-available Toolkit — the home base for the Life-Skills Toolkit AND the single Get-Help entry
// point (folded in, so help is always one tap away even before any tool is unlocked). The launcher lives in
// the top toolbar (icon-only on mobile). The sheet always offers Get Help + a Breathing space; unlocked
// Thread-C tools appear below as the child earns them. Other games *reference* these via tool moments.
type Open = null | "drawer" | "breathing" | "help" | { tool: ToolId };

export function ToolkitDrawer() {
  // aliased off the "use" prefix so the linter doesn't mistake this store action for a React hook
  const { profile, useTool: markToolUsed } = useProfile();
  const [open, setOpen] = useState<Open>(null);
  const tools = unlockedTools(profile);

  // While any toolkit overlay is open, freeze the path world behind it (path-scene reads this flag).
  useEffect(() => {
    const el = document.documentElement;
    if (open !== null) el.dataset.overlay = "1"; else delete el.dataset.overlay;
    return () => { delete el.dataset.overlay; };
  }, [open]);

  const openTool = (id: ToolId) => {
    markToolUsed(id);
    setOpen({ tool: id });
  };

  const sheet = (title: string, onBack: (() => void) | null, body: React.ReactNode) => (
    <div className="fixed inset-0 z-[55] flex items-end justify-center p-3 bg-slate-950/60 backdrop-blur-sm" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }} onClick={() => setOpen(null)}>
      <div
        className="glass-card max-h-[88vh] w-full max-w-sm overflow-y-auto rounded-3xl p-5 backdrop-blur-[16px] backdrop-saturate-150 animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 font-display text-lg font-bold text-foreground">
            {onBack && <button type="button" onClick={onBack} aria-label="Back" className="-ml-1 flex size-7 items-center justify-center rounded-full bg-foreground/10 transition-transform active:scale-95"><ChevronLeft className="size-4" aria-hidden /></button>}
            {title}
          </h2>
          <div className="flex items-center gap-2">
            {(profile.dailyStreak?.count ?? 0) >= 2 && (
              <span className="rounded-full bg-foreground/15 px-2.5 py-1 text-[11px] font-semibold text-foreground/85">🔥 {profile.dailyStreak!.count}-day streak</span>
            )}
            <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="flex size-8 items-center justify-center rounded-full bg-foreground/10 transition-transform active:scale-95"><X className="size-4 text-foreground" aria-hidden /></button>
          </div>
        </div>
        {body}
      </div>
    </div>
  );

  return (
    <>
      {/* launcher — top toolbar (top-right), icon-only on mobile. Folds in Get Help, so it's always shown. */}
      <button
        type="button"
        onClick={() => setOpen("drawer")}
        aria-label="Open your toolkit"
        className="toolkit-trigger glass-pill fixed right-4 top-4 z-50 flex h-9 items-center gap-1.5 rounded-full px-3 backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95"
      >
        <Briefcase className="size-4 shrink-0" aria-hidden />
        <span className="hidden text-sm font-semibold sm:inline">Toolkit</span>
      </button>

      {open === "drawer" && sheet("Your Toolkit", null, (
        <>
          <p className="mb-4 text-xs text-foreground/60">Skills you carry — and help, any time you need it.</p>
          {/* Get Help — always present (folded in from the old top-corner pill) */}
          <button type="button" onClick={() => setOpen("help")} className="glass-card mb-2.5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold text-foreground backdrop-blur-[12px] transition-transform active:scale-95">
            <LifeBuoy className="size-5" aria-hidden /> Get help
          </button>
          <button type="button" onClick={() => setOpen("breathing")} className="cta mb-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-base font-bold text-slate-900 transition-transform active:scale-95">
            <Wind className="size-5" aria-hidden /> Breathing space
          </button>
          {tools.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {tools.map((t) => (
                <button key={t.id} type="button" onClick={() => openTool(t.id)} className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]">
                  <span className="text-3xl" aria-hidden>{t.emoji}</span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold text-foreground">{t.name}</span>
                    <span className="block text-xs text-foreground/60">{t.tagline}</span>
                  </span>
                  <span className="rounded-full bg-foreground/15 px-2 py-0.5 text-[11px] font-semibold text-foreground/80">Lv {toolLevel(profile, t.id)}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-xs text-foreground/55">More skills unlock as you play the feelings & life-skills games. 🌱</p>
          )}
        </>
      ))}

      {open === "help" && sheet("You can get help", () => setOpen("drawer"), (
        <>
          <p className="mb-1 text-sm font-semibold text-foreground">{HELP.reassurance}</p>
          <p className="mb-3 text-xs text-foreground/60">{HELP.prompt}</p>
          <div className="flex flex-col gap-2">
            {HELP.lines.map((line) => (
              <a key={line.name} href={line.href} target={line.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="glass-card flex items-center justify-between gap-2 rounded-2xl px-4 py-2.5 backdrop-blur-[12px]">
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">{line.name}</span>
                  <span className="text-xs text-foreground/60">{line.detail}</span>
                </span>
                {line.href.startsWith("tel:") ? <Phone className="size-4 shrink-0 text-foreground/70" aria-hidden /> : <ExternalLink className="size-4 shrink-0 text-foreground/70" aria-hidden />}
              </a>
            ))}
          </div>
        </>
      ))}

      {open === "breathing" && <BreathingSpace onClose={() => setOpen("drawer")} />}
      {open !== null && typeof open === "object" && <ToolPlayer toolId={open.tool} onClose={() => setOpen("drawer")} />}
    </>
  );
}
