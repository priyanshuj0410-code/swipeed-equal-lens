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
          className="glass-card flex w-full max-w-sm flex-col gap-5 p-7 text-white backdrop-blur-[14px] backdrop-saturate-150"
          style={{ background: "rgba(11, 14, 20, 0.5)" }}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="grid size-16 place-items-center rounded-3xl bg-white/15 shadow-sm ring-1 ring-white/20">
              <Logo className="size-10" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#b3c8ff" }}>
              SwipeEd
            </span>
            <h1 className="font-display text-2xl font-extrabold leading-tight text-white">Learn by swiping</h1>
            <p className="text-sm text-white/75">
              Quick, friendly games about relationships, fairness and growing up — travel the path one lesson at a time.
            </p>
          </div>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-white/90">Pick a name (any name)</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder="e.g. Sky"
              className="rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-base text-white outline-none placeholder:text-white/45 focus-visible:ring-2 focus-visible:ring-white/60"
            />
          </label>

          <div className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-white/90">Pick an avatar</span>
            <div className="grid grid-cols-8 gap-1">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  aria-pressed={avatar === a}
                  className={`grid aspect-square place-items-center rounded-md text-xl transition-colors ${
                    avatar === a ? "bg-white/25 ring-2 ring-white" : "hover:bg-white/10"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-white/90">Language</span>
            <div className="flex gap-2">
              <span className="rounded-md bg-white/25 px-3 py-1.5 text-sm font-semibold text-white ring-1 ring-white/50">English</span>
              <span className="rounded-md border border-white/25 px-3 py-1.5 text-sm text-white/55">हिन्दी — soon</span>
            </div>
          </div>

          <p className="rounded-lg bg-white/10 p-3 text-xs leading-relaxed text-white/80 ring-1 ring-white/10">
            These games cover real-life topics like relationships and fairness. If anything feels too real, tap{" "}
            <span className="font-semibold text-white">Get Help</span> any time — it&apos;s always in the corner.
          </p>

          <button
            type="button"
            disabled={name.trim().length === 0}
            onClick={() => completeOnboarding({ name: name.trim(), avatar, locale: "en-IN" })}
            className="h-12 rounded-2xl bg-white text-base font-bold text-zinc-900 shadow-lg transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start playing
          </button>
        </div>
      </div>
    </>
  );
}
