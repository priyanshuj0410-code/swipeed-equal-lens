"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

// The same calm grassland used on the path & onboarding, behind the glass game UI.
const GrasslandBackdrop = dynamic(
  () => import("@/components/grassland-backdrop").then((m) => m.GrasslandBackdrop),
  { ssr: false, loading: () => null }
);

/**
 * Shared chrome for the non-swipe engine games: a full-screen grassland backdrop, a
 * glass top bar (close · title · optional progress · tools), and a centred body slot.
 * Each game renders its own body; the swipe games keep playing in place on the path.
 */
export function GameShell({
  title,
  progress,
  tools,
  onExit,
  children,
}: {
  title: string;
  progress?: { current: number; total: number };
  tools?: React.ReactNode;
  onExit?: () => void;
  children: React.ReactNode;
}) {
  const router = useRouter();

  // collapse the global Get Help button to its icon while a game is on screen
  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute("data-playing", "true");
    return () => el.removeAttribute("data-playing");
  }, []);

  const exit = onExit ?? (() => router.push("/path"));

  return (
    <div className="fixed inset-0 z-0 touch-none overflow-hidden bg-[#bfe2fb]">
      <div className="absolute inset-0">
        <GrasslandBackdrop />
      </div>

      {/* top bar — matches the path/game chrome: equal-height glass pills */}
      <div className="fixed left-4 top-4 z-50 flex max-w-[calc(100%-4rem)] items-center gap-2">
        <button
          type="button"
          aria-label="Back to path"
          onClick={exit}
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

      <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto px-4 pb-24 pt-20">
        {children}
      </div>
    </div>
  );
}
