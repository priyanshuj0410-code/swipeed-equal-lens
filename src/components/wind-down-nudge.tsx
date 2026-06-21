"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

// A gentle, non-guilt bedtime cue shown once per session during a quiet window (default
// 8pm–6am, device clock; `?tod=night` forces it for preview). Honest framing: winding down
// near bedtime, not a health claim. (Companion character comes with the Mini Characters Kit.)
export function WindDownNudge() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (sessionStorage.getItem("swipeed.winddown")) return;
    } catch {
      /* ignore */
    }
    const o = new URLSearchParams(window.location.search).get("tod");
    const h = new Date().getHours();
    const quiet = o === "night" || (o == null && (h >= 20 || h < 6));
    if (!quiet) return;
    const t = setTimeout(() => setShow(true), 2500);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;
  const dismiss = () => {
    try {
      sessionStorage.setItem("swipeed.winddown", "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };
  return (
    <div
      className="glass-pill fixed inset-x-4 z-[90] mx-auto flex max-w-sm items-center gap-3 rounded-2xl px-4 py-3 backdrop-blur-md backdrop-saturate-150"
      style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      role="status"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/companion.png" alt="" aria-hidden className="size-10 shrink-0 rounded-xl bg-foreground/10" />
      <span className="flex-1 text-sm font-medium leading-snug">It&apos;s getting late — let&apos;s pick this up tomorrow. 🌙</span>
      <button type="button" onClick={dismiss} aria-label="Dismiss" className="shrink-0 rounded-full p-1 transition-transform active:scale-90">
        <X className="size-4" aria-hidden />
      </button>
    </div>
  );
}
