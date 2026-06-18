"use client";

import Link from "next/link";
import { Lock, Settings as SettingsIcon, Flame, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useProfile } from "@/lib/store";
import { Logo } from "@/components/logo";
import { PATH, type PathNode } from "@/content/path";

// Gentle left/right weave for the path spine.
const OFFSETS = [0, 54, 76, 54, 0, -54, -76, -54];

export function LearningPath() {
  const { profile } = useProfile();
  let gi = -1;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-5 py-6 pb-24 animate-in fade-in duration-300">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="size-8" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">SwipeEd</p>
            <h1 className="text-lg font-bold leading-tight">Your path</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-xs font-bold shadow-sm ring-1 ring-border">
            <Flame className="size-3.5" style={{ color: "var(--flame)" }} aria-hidden /> {profile.bestStreak}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-xs font-bold shadow-sm ring-1 ring-border">
            <Star className="size-3.5" style={{ color: "var(--accent-amber)" }} fill="currentColor" aria-hidden /> {profile.coins}
          </span>
          <Link href="/settings" aria-label="Settings" className={buttonVariants({ variant: "ghost", size: "icon" })}>
            <SettingsIcon className="size-5" aria-hidden />
          </Link>
        </div>
      </header>

      <div className="relative flex flex-col gap-1">
        <div className="pointer-events-none absolute inset-y-3 left-1/2 -translate-x-1/2 border-l-[3px] border-dashed border-primary/25" aria-hidden />
        {PATH.map((section) => (
          <div key={section.title} className="flex flex-col gap-1">
            <div className="relative my-3 flex flex-col items-center gap-0.5 text-center">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground shadow-sm">
                {section.title}
              </span>
              <span className="text-[11px] text-muted-foreground">{section.subtitle}</span>
            </div>
            {section.nodes.map((node) => {
              gi += 1;
              return <NodeRow key={node.id} node={node} offset={OFFSETS[gi % OFFSETS.length]} />;
            })}
          </div>
        ))}
        <p className="relative mt-5 text-center text-xs text-muted-foreground">More lessons are on the way ✨</p>
      </div>
    </div>
  );
}

function NodeRow({ node, offset }: { node: PathNode; offset: number }) {
  const isActive = node.status === "active";

  const bubble = (
    <div className="relative flex flex-col items-center gap-1.5">
      {isActive && (
        <span className="absolute -top-7 z-10 animate-bounce rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-md">
          Start
        </span>
      )}
      <div className="relative">
        {isActive && <span className="absolute inset-0 -m-1 animate-ping rounded-full bg-primary/30" aria-hidden />}
        <div
          className={
            isActive
              ? "relative grid size-20 place-items-center rounded-full bg-card shadow-[0_14px_32px_-10px_var(--primary)] ring-4 ring-primary transition-transform group-active:scale-95"
              : "relative grid size-20 place-items-center rounded-full bg-muted text-3xl opacity-60 ring-1 ring-border"
          }
        >
          {node.id === "glrl" ? <Logo className="size-11" /> : <span aria-hidden>{node.emoji}</span>}
          {!isActive && (
            <span className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full bg-background text-muted-foreground ring-1 ring-border">
              <Lock className="size-3.5" aria-hidden />
            </span>
          )}
        </div>
      </div>
      <span className={`max-w-[8.5rem] text-center text-xs font-semibold leading-tight ${isActive ? "" : "text-muted-foreground"}`}>
        {node.title}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{isActive ? node.kind : "Soon"}</span>
    </div>
  );

  return (
    <div className="relative flex justify-center py-1" style={{ transform: `translateX(${offset}px)` }}>
      {isActive && node.href ? (
        <Link href={node.href} className="group" aria-label={`${node.title} — start`}>
          {bubble}
        </Link>
      ) : (
        <div aria-disabled title="Coming soon" className="cursor-not-allowed">
          {bubble}
        </div>
      )}
    </div>
  );
}
