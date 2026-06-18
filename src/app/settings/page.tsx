"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useProfile } from "@/lib/store";

const SCALES = [
  { v: 1, label: "A", cls: "text-sm" },
  { v: 1.15, label: "A", cls: "text-base" },
  { v: 1.3, label: "A", cls: "text-lg" },
];

export default function SettingsPage() {
  const { profile, setSchoolComfort, setTextScale, reset } = useProfile();

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col gap-4 px-5 py-6 pb-24">
      <header className="flex items-center gap-3">
        <Link href="/" aria-label="Back" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="size-5" aria-hidden />
        </Link>
        <h1 className="text-lg font-semibold">Settings</h1>
      </header>

      <Card className="flex items-center justify-between gap-4 p-4">
        <div>
          <p className="text-sm font-medium">School-Comfort Mode</p>
          <p className="text-xs text-muted-foreground">
            Hides the romantic “Crushes & Dating” deck. Keeps Friendship, Family, Online, Peer and
            Norm-Buster content.
          </p>
        </div>
        <Switch
          checked={profile.schoolComfort}
          onCheckedChange={setSchoolComfort}
          aria-label="School-Comfort Mode"
        />
      </Card>

      <Card className="flex items-center justify-between gap-4 p-4">
        <div>
          <p className="text-sm font-medium">Text size</p>
          <p className="text-xs text-muted-foreground">Make everything bigger or smaller.</p>
        </div>
        <div className="flex gap-1">
          {SCALES.map((s) => (
            <Button
              key={s.v}
              variant={profile.textScale === s.v ? "default" : "outline"}
              size="icon"
              className={s.cls}
              onClick={() => setTextScale(s.v)}
              aria-label={`Text scale ${Math.round(s.v * 100)}%`}
              aria-pressed={profile.textScale === s.v}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col gap-2 p-4 text-xs text-muted-foreground">
        <p className="text-sm font-medium text-foreground">About</p>
        <p>
          A game about reading relationships — green flags and red flags. Content is behaviour-only.
          The <span className="font-medium text-foreground">Get Help</span> button is always in the
          corner.
        </p>
      </Card>

      <Button
        variant="outline"
        className="text-destructive"
        onClick={() => {
          if (window.confirm("Reset all progress and start over?")) reset();
        }}
      >
        Reset progress
      </Button>
    </div>
  );
}
