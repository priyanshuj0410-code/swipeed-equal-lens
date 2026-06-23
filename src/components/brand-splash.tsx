"use client";

import { Logo } from "@/components/logo";

/**
 * Full-screen branded loading splash, used while the app boots and while the 3D world's
 * assets load. Sky-coloured so it blends into the path scene as it fades out. Safe-area
 * aware for mobile notches. Pass `progress` for a determinate bar, omit it for indeterminate.
 */
export function BrandSplash({
  progress,
  label = "Loading…",
  fading = false,
}: {
  progress?: number;
  label?: string;
  fading?: boolean;
}) {
  const determinate = typeof progress === "number";
  const pct = determinate ? Math.max(6, Math.min(100, progress!)) : 0;
  return (
    <div
      role="status"
      aria-busy="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 px-10 text-center transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background: "linear-gradient(180deg, #ece6f6 0%, #f3f0f6 55%, #fbf9ff 100%)",
        paddingTop: "max(2rem, env(safe-area-inset-top))",
        paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
      }}
    >
      <Logo className="size-20" title="SwipeEd" />
      {/* The splash background is hardcoded LIGHT, so its colours must NOT use theme tokens (--foreground /
          --color-ink / --color-brand) — the path's ThemeController flips those to dark inline on <html> at
          night, which turned the wordmark + bar invisible. Hardcode the brand ink + purple here. */}
      <span className="font-display text-2xl font-extrabold tracking-tight" style={{ color: "#2a1a47" }}>SwipeEd</span>
      <span className="-mt-1 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#7c5cab" }}>by The Equal Lens</span>
      <div className="flex w-44 flex-col items-center gap-2">
        <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(42,26,71,0.16)" }}>
          {determinate ? (
            <div className="h-full rounded-full transition-[width] duration-300 ease-out" style={{ width: `${pct}%`, background: "#553286" }} />
          ) : (
            <div className="animate-splash-bar h-full w-1/3 rounded-full" style={{ background: "#553286" }} />
          )}
        </div>
        <span className="text-xs font-medium text-slate-600">
          {label}
          {determinate ? ` ${Math.round(progress!)}%` : ""}
        </span>
      </div>
    </div>
  );
}
