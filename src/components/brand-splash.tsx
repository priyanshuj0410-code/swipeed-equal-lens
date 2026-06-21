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
      <Logo className="size-20 drop-shadow-md" title="SwipeEd" />
      <span className="font-display text-2xl font-extrabold tracking-tight text-foreground">SwipeEd</span>
      <span className="-mt-1 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--color-brandsoft)" }}>by The Equal Lens</span>
      <div className="flex w-44 flex-col items-center gap-2">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/55">
          {determinate ? (
            <div className="h-full rounded-full bg-[var(--color-brand)] transition-[width] duration-300 ease-out" style={{ width: `${pct}%` }} />
          ) : (
            <div className="animate-splash-bar h-full w-1/3 rounded-full bg-[var(--color-brand)]" />
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
