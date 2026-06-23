"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { BrandSplash } from "@/components/brand-splash";

/**
 * Covers the screen with the branded splash while the 3D world's GLB assets load (real
 * progress via drei's loading manager), then fades out once they're ready and the first
 * frame has had a moment to paint. A hard cap guarantees it never blocks forever (e.g.
 * fully-cached refreshes that report no load events).
 */
export function WorldLoader() {
  const { active, progress } = useProgress();
  const [phase, setPhase] = useState<"show" | "fading" | "gone">("show");
  // drei reports 0% until assets resolve (cached loads emit no events), so the bar looked frozen. Creep a
  // synthetic progress 8→92% while waiting; real progress overrides it, and we snap to 100 once ready/fading.
  const [creep, setCreep] = useState(8);
  useEffect(() => {
    if (phase !== "show") return;
    const id = setInterval(() => setCreep((c) => Math.min(92, c + Math.max(0.6, (92 - c) * 0.06))), 180);
    return () => clearInterval(id);
  }, [phase]);
  const shown = phase !== "show" || (!active && progress >= 100) ? 100 : Math.max(progress, creep);

  // assets finished loading -> begin fade (after a beat so the first frame can render)
  useEffect(() => {
    if (phase !== "show") return;
    if (!active && progress >= 100) {
      const t = setTimeout(() => setPhase("fading"), 350);
      return () => clearTimeout(t);
    }
  }, [active, progress, phase]);

  useEffect(() => {
    if (phase !== "fading") return;
    const t = setTimeout(() => setPhase("gone"), 550);
    return () => clearTimeout(t);
  }, [phase]);

  // safety: never block forever
  useEffect(() => {
    const cap = setTimeout(() => setPhase((p) => (p === "show" ? "fading" : p)), 9000);
    return () => clearTimeout(cap);
  }, []);

  if (phase === "gone") return null;
  return <BrandSplash progress={shown} label="Building your world…" fading={phase === "fading"} />;
}
