"use client";

import Link from "next/link";
import { ArrowLeft, BookHeart, Flame, Star, ChevronRight, Play } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useProfile } from "@/lib/store";
import { availableDecks } from "@/content/decks";

function Stars({ value, className = "", light = false }: { value: number; className?: string; light?: boolean }) {
  return (
    <span className={`flex gap-0.5 ${className}`} aria-label={`${value} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <Star
          key={i}
          className="size-4"
          aria-hidden
          style={{ color: light ? "white" : "var(--flag-green)" }}
          fill={i < value ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}

export function DeckHub() {
  const { profile } = useProfile();
  const decks = availableDecks(profile.schoolComfort);
  const daily = decks.find((d) => d.isDaily);
  const themed = decks.filter((d) => !d.isDaily);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-5 py-6 pb-24 animate-in fade-in slide-in-from-right-2 duration-300">
      <header className="flex items-center gap-3">
        <Link href="/" aria-label="Back to path" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="size-5" aria-hidden />
        </Link>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Green Light / Red Light</p>
          <h1 className="text-xl font-bold tracking-tight">Pick a deck</h1>
        </div>
      </header>

      <div className="flex gap-2">
        <span className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-card py-2 text-sm font-semibold shadow-sm ring-1 ring-border">
          <Flame className="size-4" style={{ color: "var(--flag-red)" }} aria-hidden /> {profile.bestStreak} streak
        </span>
        <span className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-card py-2 text-sm font-semibold shadow-sm ring-1 ring-border">
          <Star className="size-4" style={{ color: "var(--flag-green)" }} aria-hidden /> {profile.coins} pts
        </span>
      </div>

      {daily && (
        <Link
          href={`/play/${daily.id}`}
          className="group relative overflow-hidden rounded-3xl p-5 text-white shadow-lg transition-transform hover:-translate-y-0.5"
          style={{ background: `linear-gradient(135deg, ${daily.accent}, color-mix(in oklab, ${daily.accent} 50%, var(--primary)))` }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-2xl font-extrabold leading-tight">{daily.emoji} Daily Deck</p>
              <p className="mt-1 text-sm leading-snug text-white/85">10 mixed cards · your daily warm-up</p>
            </div>
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/20 backdrop-blur transition-transform group-hover:scale-110">
              <Play className="size-5 fill-white" aria-hidden />
            </span>
          </div>
          <Stars value={profile.deckStars[daily.id] ?? 0} className="mt-3" light />
        </Link>
      )}

      <div className="flex flex-col gap-3">
        <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Decks</p>
        {themed.map((d, i) => {
          const st = profile.deckStars[d.id] ?? 0;
          return (
            <Link
              key={d.id}
              href={`/play/${d.id}`}
              style={{ animationDelay: `${i * 55}ms` }}
              className="flex animate-in fade-in slide-in-from-bottom-2 fill-mode-both items-center gap-3 rounded-2xl bg-card p-3 shadow-sm ring-1 ring-border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <span
                className="grid size-12 shrink-0 place-items-center rounded-2xl text-2xl"
                style={{ background: `color-mix(in oklab, ${d.accent} 20%, transparent)` }}
              >
                {d.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-tight">{d.title}</p>
                <p className="truncate text-xs text-muted-foreground">{d.blurb}</p>
              </div>
              {st > 0 ? (
                <Stars value={st} />
              ) : (
                <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden />
              )}
            </Link>
          );
        })}
      </div>

      <Link href="/flagpedia" className={buttonVariants({ variant: "outline", className: "gap-2 rounded-full" })}>
        <BookHeart className="size-4" aria-hidden /> Flag-pedia · the 20 signs
      </Link>
    </div>
  );
}
