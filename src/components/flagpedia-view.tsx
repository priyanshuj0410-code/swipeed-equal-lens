"use client";

import Link from "next/link";
import { ArrowLeft, Check, Flag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { GREEN_SIGNS, RED_SIGNS } from "@/content/signs";
import type { Sign } from "@/lib/types";
import { useProfile } from "@/lib/store";

export function FlagpediaView() {
  const { profile } = useProfile();
  const seenCount = Object.keys(profile.signMastery).length;

  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <header className="flex items-center gap-3">
        <Link href="/" aria-label="Back" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="size-5" aria-hidden />
        </Link>
        <div>
          <h1 className="text-lg font-semibold">Flag-pedia</h1>
          <p className="text-xs text-muted-foreground">{seenCount} of 20 signs encountered</p>
        </div>
      </header>

      <Section title="Green flags" color="var(--flag-green)" icon="green" signs={GREEN_SIGNS} mastery={profile.signMastery} />
      <Section title="Red flags" color="var(--flag-red)" icon="red" signs={RED_SIGNS} mastery={profile.signMastery} />
    </div>
  );
}

function Section({
  title,
  color,
  icon,
  signs,
  mastery,
}: {
  title: string;
  color: string;
  icon: "green" | "red";
  signs: Sign[];
  mastery: Record<string, { seen: number; correct: number }>;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="flex items-center gap-1.5 text-sm font-semibold" style={{ color }}>
        {icon === "green" ? <Check className="size-4" aria-hidden /> : <Flag className="size-4" aria-hidden />}
        {title}
      </h2>
      {signs.map((s) => {
        const m = mastery[s.id];
        const acc = m && m.seen ? Math.round((m.correct / m.seen) * 100) : null;
        return (
          <Card key={s.id} className="flex flex-col gap-1 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{s.name}</span>
              <span className="text-[11px] text-muted-foreground">
                {acc === null ? "Not seen yet" : `${acc}% · ${m!.seen} seen`}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{s.definition}</p>
          </Card>
        );
      })}
    </section>
  );
}
