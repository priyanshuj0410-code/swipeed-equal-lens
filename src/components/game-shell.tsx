"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Shared chrome for in-place games: a glass top bar (close · title · optional progress
 * · tools) and a centred body slot, rendered as a transparent overlay. Whatever is behind
 * it (the path's 3D grassland, or a standalone backdrop on the /game route) shows through.
 * Both swipe and engine games use this so they share one look.
 */
export function GameShell({
  title,
  progress,
  tools,
  onExit,
  children,
  align = "center",
}: {
  title: string;
  progress?: { current: number; total: number };
  tools?: React.ReactNode;
  onExit: () => void;
  children: React.ReactNode;
  // "center" (default) vertically centres the content; "fill" stretches it to full height so the child can
  // pin its own top/bottom rows (used by the v2 engine to stop content "dancing" between beats).
  align?: "center" | "fill";
}) {
  // collapse the global Get Help button to its icon while a game is on screen
  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute("data-playing", "true");
    return () => el.removeAttribute("data-playing");
  }, []);

  return (
    <>
      {/* top bar: equal-height glass pills, matching the path chrome. Its max width leaves room for the
          toolkit button in the top-right corner (40px icon-only on phones, about 110px with its label from sm). */}
      <div className="fixed left-4 top-4 z-50 flex max-w-[calc(100%-5.5rem)] items-center gap-2 sm:max-w-[calc(100%-10rem)]">
        <button
          type="button"
          aria-label="Back to path"
          onClick={onExit}
          className="glass-pill flex size-9 shrink-0 items-center justify-center rounded-full backdrop-blur-md backdrop-saturate-150 transition-transform active:scale-95"
        >
          <X className="size-5" aria-hidden />
        </button>
        <span className="glass-pill flex h-9 min-w-0 items-center rounded-full px-3 backdrop-blur-md backdrop-saturate-150">
          <span className="min-w-0 truncate text-xs font-semibold">{title}</span>
        </span>
        {progress && (
          <span className="glass-pill flex h-9 shrink-0 items-center rounded-full px-3 text-xs font-bold backdrop-blur-md backdrop-saturate-150">
            {progress.current}/{progress.total}
          </span>
        )}
        {tools}
      </div>

      {/* Scroll container + a min-h-full centering wrapper: short content centres, tall content
          (e.g. Flag-pedia) scrolls from the top instead of being clipped. An opaque app-bg layer hides the
          path/scene behind it while a game is on, so the game is the calm focus (not floating over the curve). */}
      <div className="fixed inset-0 z-40 overflow-y-auto" style={{ backgroundColor: "var(--color-paper)", backgroundImage: "var(--app-bg)" }}>
        <div className={`flex min-h-full px-4 pt-20 ${align === "fill" ? "flex-col items-center pb-5" : "items-center justify-center pb-24"}`}>
          {children}
        </div>
      </div>
    </>
  );
}
