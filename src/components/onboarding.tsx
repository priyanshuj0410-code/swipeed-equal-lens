"use client";

import { useState } from "react";
import { useProfile } from "@/lib/store";

const AVATARS = ["🦊", "🐼", "🦉", "🐯", "🐸", "🐙", "🦄", "🐱"];

/** First-run onboarding: a brand sticker card on dotted paper — pick a name + avatar, language, safety note. */
export function Onboarding() {
  const { completeOnboarding } = useProfile();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const canStart = name.trim().length > 0;

  return (
    <>
      {/* Clean dotted-paper backdrop (replaces the realistic grassland) — no colour glows */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundColor: "var(--color-paper)",
          backgroundImage: "radial-gradient(var(--dot) 1.4px, transparent 1.6px)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center px-5 py-10">
        <div className="sticker flex w-full max-w-sm flex-col gap-5 rounded-[28px] bg-[var(--color-surface)] p-7">
          {/* header: Lensy waving hello */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/lensy/lensy-wave.svg"
              alt=""
              width={88}
              height={88}
              className="-mt-2 drop-shadow-[3px_4px_0_var(--violet-200)]"
            />
            <span className="eyebrow">SwipeEd by The Equal Lens</span>
            <h1 className="font-[family-name:var(--font-hand)] text-3xl font-extrabold leading-none text-[var(--color-ink)]">
              Learn by swiping
            </h1>
            <p className="text-sm leading-relaxed text-[color-mix(in_oklch,var(--color-ink),transparent_28%)]">
              Quick, friendly games about relationships, fairness and growing up — travel the path one lesson at a time.
            </p>
          </div>

          {/* name */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-bold text-[var(--color-ink)]">Pick a name (any name)</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder="e.g. Sky"
              className="rounded-2xl border-[2.5px] border-[var(--color-ink)] bg-[var(--color-paper)] px-4 py-2.5 text-base font-semibold text-[var(--color-ink)] outline-none transition-colors placeholder:font-medium placeholder:text-[color-mix(in_oklch,var(--color-ink),transparent_55%)] focus-visible:border-[var(--color-brand)]"
            />
          </label>

          {/* avatar */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-bold text-[var(--color-ink)]">Pick an avatar</span>
            <div className="grid grid-cols-8 gap-1.5">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  aria-pressed={avatar === a}
                  className={`grid aspect-square place-items-center rounded-xl text-xl transition-transform active:scale-90 ${
                    avatar === a
                      ? "border-[2.5px] border-[var(--color-brand)] bg-[var(--violet-100)] shadow-[2px_2px_0_var(--violet-200)]"
                      : "border-2 border-[var(--color-mist)] bg-[var(--color-paper)] hover:-translate-y-0.5"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* language */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-bold text-[var(--color-ink)]">Language</span>
            <div className="flex gap-2">
              <span className="rounded-full border-[2.5px] border-[var(--color-ink)] bg-[var(--color-brand)] px-4 py-1.5 text-sm font-bold text-white shadow-[2px_2px_0_var(--color-ink)]">
                English
              </span>
              <span className="rounded-full border-2 border-dashed border-[var(--violet-200)] px-4 py-1.5 text-sm font-semibold text-[color-mix(in_oklch,var(--color-ink),transparent_45%)]">
                हिन्दी — soon
              </span>
            </div>
          </div>

          {/* safety note */}
          <p
            className="rounded-2xl border-2 p-3 text-xs leading-relaxed text-[var(--color-ink)]"
            style={{
              borderColor: "color-mix(in oklch, var(--color-insight), transparent 55%)",
              background: "color-mix(in oklch, var(--color-insight), transparent 90%)",
            }}
          >
            These games cover real-life topics like relationships and fairness. If anything feels too real, tap{" "}
            <span className="font-bold">Get Help</span> any time — it&apos;s always in the corner.
          </p>

          {/* CTA */}
          <button
            type="button"
            disabled={!canStart}
            onClick={() => completeOnboarding({ name: name.trim(), avatar, locale: "en-IN" })}
            className="mt-1 inline-flex h-14 w-full items-center justify-center gap-1 rounded-full border-[2.5px] border-[var(--color-ink)] bg-[var(--color-grow)] font-[family-name:var(--font-hand)] text-lg font-extrabold text-[var(--color-ink)] shadow-[4px_4px_0_var(--color-ink)] transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0_var(--color-ink)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-[4px_4px_0_var(--color-ink)]"
          >
            Start playing
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </>
  );
}
