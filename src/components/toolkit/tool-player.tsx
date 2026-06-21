"use client";

import { useEffect, useState } from "react";
import { X, Volume2, VolumeX, Phone, ExternalLink, Wind } from "lucide-react";
import { Sam } from "@/components/games/sam";
import { BreathingSpace } from "@/components/toolkit/breathing-space";
import { useProfile } from "@/lib/store";
import { toolById, toolLevel } from "@/lib/toolkit";
import { TOOL_GUIDE } from "@/content/toolkit";
import { HELP } from "@/content/help";
import { speak, stopSpeaking } from "@/lib/speak";
import type { ToolId } from "@/lib/types";

// A guided run of one toolkit tool — Sam hands it over, then each step is tap-to-hear. The Cool-Down
// "breathe" step opens the Breathing space; the Help Map "helplines" step lists the real services
// (reused from the global Get Help). Generic over all four tools (content lives in src/content/toolkit.ts).
export function ToolPlayer({ toolId, onClose }: { toolId: ToolId; onClose: () => void }) {
  const { profile } = useProfile();
  const guide = TOOL_GUIDE[toolId];
  const tool = toolById(toolId);
  const level = toolLevel(profile, toolId);
  const muted = profile.muted ?? false;
  const [breathing, setBreathing] = useState(false);
  const [heard, setHeard] = useState<Set<number>>(new Set());

  useEffect(() => {
    speak(guide.samIntro, { muted });
    return () => stopSpeaking();
    // intro once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hear = (i: number, say: string) => {
    setHeard((prev) => new Set(prev).add(i));
    speak(say, { muted });
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex min-h-full w-full max-w-sm flex-col gap-4 px-4 pb-10 pt-16">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close tool"
          className="glass-pill absolute right-4 top-4 flex size-10 items-center justify-center rounded-full backdrop-blur-md transition-transform active:scale-95"
        >
          <X className="size-5" aria-hidden />
        </button>

        <div className="flex items-center gap-3">
          <Sam size={60} />
          <div className="flex-1">
            <p className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
              <span aria-hidden>{tool.emoji}</span> {tool.name}
              {level > 0 && (
                <span className="rounded-full bg-foreground/15 px-2 py-0.5 text-[11px] font-semibold text-foreground/80">
                  Lv {level}
                </span>
              )}
            </p>
            <p className="text-xs text-foreground/60">{tool.tagline}</p>
          </div>
        </div>

        <p className="glass-pill rounded-2xl px-4 py-2.5 text-center text-sm font-semibold backdrop-blur-md" style={{ color: "var(--color-ink)" }}>
          {guide.samIntro}
        </p>

        <div className="flex flex-col gap-2.5">
          {guide.steps.map((s, i) => (
            <div key={i} className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => hear(i, s.say)}
                className="glass-card flex items-start gap-3 rounded-2xl px-4 py-3 text-left backdrop-blur-[12px] transition-transform active:scale-[0.98]"
                style={heard.has(i) ? { boxShadow: "inset 0 0 0 2px #8B7CF6" } : undefined}
              >
                <span className="text-2xl" aria-hidden>{s.emoji}</span>
                <span className="flex-1">
                  <span className="block text-xs font-bold uppercase tracking-wide text-foreground/55">{s.label}</span>
                  <span className="block text-sm font-semibold text-foreground">{s.say}</span>
                </span>
                {!muted && <Volume2 className="mt-0.5 size-4 shrink-0 text-foreground/50" aria-hidden />}
                {muted && <VolumeX className="mt-0.5 size-4 shrink-0 text-foreground/40" aria-hidden />}
              </button>

              {s.kind === "breathe" && (
                <button
                  type="button"
                  onClick={() => setBreathing(true)}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--color-sun)] text-sm font-bold text-slate-900 transition-transform active:scale-95"
                >
                  <Wind className="size-4" aria-hidden /> Open the breathing space
                </button>
              )}

              {s.kind === "helplines" && (
                <div className="flex flex-col gap-2">
                  {HELP.lines.map((line) => (
                    <a
                      key={line.name}
                      href={line.href}
                      target={line.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="glass-card flex items-center justify-between gap-2 rounded-2xl px-4 py-2.5 backdrop-blur-[12px]"
                    >
                      <span className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">{line.name}</span>
                        <span className="text-xs text-foreground/60">{line.detail}</span>
                      </span>
                      {line.href.startsWith("tel:") ? (
                        <Phone className="size-4 shrink-0 text-foreground/70" aria-hidden />
                      ) : (
                        <ExternalLink className="size-4 shrink-0 text-foreground/70" aria-hidden />
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="glass-pill mt-2 flex h-12 w-full items-center justify-center rounded-2xl text-base font-bold backdrop-blur-md transition-transform active:scale-95"
        >
          Done
        </button>
      </div>

      {breathing && <BreathingSpace onClose={() => setBreathing(false)} />}
    </div>
  );
}
