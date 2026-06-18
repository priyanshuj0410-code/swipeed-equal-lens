"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProfile } from "@/lib/store";

const AVATARS = ["🦊", "🐼", "🦉", "🐯", "🐸", "🐙", "🦄", "🐱"];

/** First-run onboarding: pick a name + avatar, language, and a calm safety note. */
export function Onboarding() {
  const { completeOnboarding } = useProfile();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-5 py-10">
      <Card className="flex w-full max-w-sm flex-col gap-5 rounded-[1.75rem] p-7 shadow-xl">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="grid size-16 place-items-center rounded-3xl bg-primary/15 text-4xl shadow-sm">
            🚦
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            Green Light / Red Light
          </span>
          <h1 className="text-2xl font-extrabold leading-tight">Learn to read the flags</h1>
          <p className="text-sm text-muted-foreground">Swipe right on green, left on red. Let&apos;s set you up.</p>
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Pick a name (any name)</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder="e.g. Sky"
            className="rounded-md border bg-background px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>

        <div className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Pick an avatar</span>
          <div className="grid grid-cols-8 gap-1">
            {AVATARS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAvatar(a)}
                aria-pressed={avatar === a}
                className={`grid aspect-square place-items-center rounded-md text-xl transition-colors ${
                  avatar === a ? "bg-primary/15 ring-2 ring-primary" : "hover:bg-accent"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Language</span>
          <div className="flex gap-2">
            <span className="rounded-md bg-primary/15 px-3 py-1.5 text-sm font-medium text-primary ring-1 ring-primary">
              English
            </span>
            <span className="rounded-md border px-3 py-1.5 text-sm text-muted-foreground">
              हिन्दी — soon
            </span>
          </div>
        </div>

        <p className="rounded-lg bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
          This is a game about relationships. If anything here feels too real, tap{" "}
          <span className="font-medium text-foreground">Get Help</span> any time — it&apos;s always
          in the corner.
        </p>

        <Button
          size="lg"
          disabled={name.trim().length === 0}
          onClick={() =>
            completeOnboarding({ name: name.trim(), avatar, locale: "en-IN" })
          }
        >
          Start playing
        </Button>
      </Card>
    </div>
  );
}
