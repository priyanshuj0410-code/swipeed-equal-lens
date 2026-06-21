"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useProfile } from "@/lib/store";
import { Logo } from "@/components/logo";

const AVATARS = ["🦊", "🐼", "🦉", "🐯", "🐸", "🐙", "🦄", "🐱"];

const GrasslandBackdrop = dynamic(() => import("@/components/grassland-backdrop").then((m) => m.GrasslandBackdrop), {
  ssr: false,
  loading: () => null,
});

/** First-run onboarding: a glass card over the grassland — pick a name + avatar, language, safety note. */
export function Onboarding() {
  const { completeOnboarding } = useProfile();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);

  return (
    <>
      <div className="fixed inset-0 z-0 bg-[#bfe2fb]">
        <GrasslandBackdrop />
      </div>

      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center px-5 py-10">
        <div
          className="glass-card flex w-full max-w-sm flex-col gap-5 p-7 text-foreground backdrop-blur-[14px] backdrop-saturate-150"
          style={{ background: "rgba(11, 14, 20, 0.5)" }}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="grid size-16 place-items-center rounded-3xl bg-foreground/15 shadow-sm ring-1 ring-foreground/20">
              <Logo className="size-10" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-brandsoft)" }}>
              SwipeEd by The Equal Lens
            </span>
            <h1 className="font-display text-2xl font-extrabold leading-tight text-foreground">Learn by swiping</h1>
            <p className="text-sm text-foreground/75">
              Quick, friendly games about relationships, fairness and growing up — travel the path one lesson at a time.
            </p>
          </div>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground/90">Pick a name (any name)</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder="e.g. Sky"
              className="rounded-lg border border-foreground/25 bg-foreground/10 px-3 py-2 text-base text-foreground outline-none placeholder:text-foreground/45 focus-visible:ring-2 focus-visible:ring-foreground/60"
            />
          </label>

          <div className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground/90">Pick an avatar</span>
            <div className="grid grid-cols-8 gap-1">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  aria-pressed={avatar === a}
                  className={`grid aspect-square place-items-center rounded-md text-xl transition-colors ${
                    avatar === a ? "bg-foreground/25 ring-2 ring-white" : "hover:bg-foreground/10"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground/90">Language</span>
            <div className="flex gap-2">
              <span className="rounded-md bg-foreground/25 px-3 py-1.5 text-sm font-semibold text-foreground ring-1 ring-foreground/50">English</span>
              <span className="rounded-md border border-foreground/25 px-3 py-1.5 text-sm text-foreground/55">हिन्दी — soon</span>
            </div>
          </div>

          <p className="rounded-lg bg-foreground/10 p-3 text-xs leading-relaxed text-foreground/80 ring-1 ring-foreground/10">
            These games cover real-life topics like relationships and fairness. If anything feels too real, tap{" "}
            <span className="font-semibold text-foreground">Get Help</span> any time — it&apos;s always in the corner.
          </p>

          <button
            type="button"
            disabled={name.trim().length === 0}
            onClick={() => completeOnboarding({ name: name.trim(), avatar, locale: "en-IN" })}
            className="h-12 rounded-2xl bg-foreground text-base font-bold text-zinc-900 shadow-lg transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start playing
          </button>
        </div>
      </div>
    </>
  );
}
