"use client";

import Link from "next/link";
import { BookHeart, Settings as SettingsIcon, Flame, Star, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { useProfile } from "@/lib/store";
import { availableDecks } from "@/content/decks";

export default function HomePage() {
  const { profile } = useProfile();
  const decks = availableDecks(profile.schoolComfort);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col gap-5 px-5 py-6 pb-24">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-2xl">
            {profile.avatar}
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Green Light / Red Light</p>
            <h1 className="text-lg font-semibold">Hi, {profile.name || "there"}</h1>
          </div>
        </div>
        <Link
          href="/settings"
          aria-label="Settings"
          className={buttonVariants({ variant: "ghost", size: "icon" })}
        >
          <SettingsIcon className="size-5" aria-hidden />
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <Card className="flex items-center gap-2 p-3">
          <Flame className="size-5" aria-hidden style={{ color: "var(--flag-red)" }} />
          <span>
            Best streak <span className="font-semibold">{profile.bestStreak}</span>
          </span>
        </Card>
        <Card className="flex items-center gap-2 p-3">
          <Star className="size-5" aria-hidden style={{ color: "var(--flag-green)" }} />
          <span>
            <span className="font-semibold">{profile.coins}</span> pts
          </span>
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        {decks.map((d) => {
          const st = profile.deckStars[d.id] ?? 0;
          return (
            <Link key={d.id} href={`/play/${d.id}`}>
              <Card className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-accent">
                <div className="min-w-0">
                  <p className="font-medium">{d.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{d.blurb}</p>
                </div>
                {st > 0 ? (
                  <span className="flex shrink-0 gap-0.5" aria-label={`${st} of 3 stars`}>
                    {[0, 1, 2].map((i) => (
                      <Star
                        key={i}
                        className="size-3.5"
                        aria-hidden
                        style={{ color: "var(--flag-green)" }}
                        fill={i < st ? "currentColor" : "none"}
                      />
                    ))}
                  </span>
                ) : (
                  <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                )}
              </Card>
            </Link>
          );
        })}
      </div>

      <Link
        href="/flagpedia"
        className={buttonVariants({ variant: "outline", className: "gap-2" })}
      >
        <BookHeart className="size-4" aria-hidden /> Flag-pedia · the 20 signs
      </Link>
    </div>
  );
}
