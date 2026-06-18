"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Flame, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useProfile } from "@/lib/store";
import { PATH } from "@/content/path";
import type { SceneNode } from "@/components/path-scene";

// The 3D scene is a self-contained, client-only module — lazy-loaded (ssr:false) so
// the three.js bundle never touches the main entry and only loads on this route.
const PathScene = dynamic(() => import("@/components/path-scene").then((m) => m.PathScene), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
      <span className="size-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" aria-hidden />
      <span className="ml-2">Loading the path…</span>
    </div>
  ),
});

export default function PathPage() {
  const router = useRouter();
  const { profile } = useProfile();
  // null = unknown (optimistically render the scene); false = no WebGL -> fallback.
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setWebgl(!!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"))));
    } catch {
      setWebgl(false);
    }
  }, []);

  // Real, data-driven node states: completed (played), current (active/playable), or locked.
  const nodes = useMemo<SceneNode[]>(() => {
    const stars = profile.deckStars ?? {};
    const isDone = (id: string) => {
      if (id === "mythbuster") return stars["mythbuster"] != null;
      if (id === "glrl") return Object.keys(stars).some((k) => k !== "mythbuster"); // any GL/RL deck cleared
      return stars[id] != null;
    };
    return PATH.flatMap((s) => s.nodes).map((n): SceneNode => ({
      id: n.id,
      label: n.title,
      state: isDone(n.id) ? "completed" : n.status === "active" ? "current" : "locked",
      href: n.href,
      emoji: n.emoji,
    }));
  }, [profile.deckStars]);

  const handleSelect = (node: SceneNode) => {
    if (node.state !== "locked" && node.href) router.push(node.href);
  };

  return (
    <>
      {/* full-viewport scene; fixed so R3F always has a definite size to measure */}
      <div className="fixed inset-0 z-0 touch-none overscroll-none bg-[#bfe2fb]">
        {webgl === false ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="max-w-xs text-sm text-muted-foreground">
              The 3D path isn&apos;t supported on this device, but you can use the classic view.
            </p>
            <Link href="/classic" className={buttonVariants({})}>
              Open the classic path
            </Link>
          </div>
        ) : (
          <PathScene nodes={nodes} onSelectNode={handleSelect} />
        )}
      </div>
      {webgl !== false && (
        <div className="fixed left-4 top-4 z-50 flex items-center gap-2">
          <span className={buttonVariants({ variant: "secondary", size: "sm", className: "pointer-events-none gap-1.5 rounded-full font-bold shadow-md" })}>
            <Flame className="size-4" style={{ color: "var(--flame)" }} aria-hidden /> {profile.bestStreak}
          </span>
          <span className={buttonVariants({ variant: "secondary", size: "sm", className: "pointer-events-none gap-1.5 rounded-full font-bold shadow-md" })}>
            <Star className="size-4" style={{ color: "var(--accent-amber)" }} fill="currentColor" aria-hidden /> {profile.coins}
          </span>
        </div>
      )}
      {webgl !== false && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
          <span className="rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-md ring-1 ring-border backdrop-blur">
            Tap a node to start · scroll or drag to travel
          </span>
        </div>
      )}
    </>
  );
}
