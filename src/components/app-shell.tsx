"use client";

import { useEffect } from "react";
import { ProfileProvider, useProfile } from "@/lib/store";
import { GetHelp } from "@/components/get-help";
import { Onboarding } from "@/components/onboarding";
import { BrandSplash } from "@/components/brand-splash";
import { WindDownNudge } from "@/components/wind-down-nudge";
import { ToolkitDrawer } from "@/components/toolkit/toolkit-drawer";
import { MoodCheckIn } from "@/components/toolkit/mood-check-in";

function Gate({ children }: { children: React.ReactNode }) {
  const { profile, ready, recordVisit } = useProfile();
  // Tick the kind daily streak on entry (idempotent per day).
  useEffect(() => {
    if (ready && profile.onboarded) recordVisit();
  }, [ready, profile.onboarded, recordVisit]);
  if (!ready) return <BrandSplash label="Starting up…" />;
  if (!profile.onboarded) return <Onboarding />;
  return <>{children}</>;
}

/**
 * Wraps the app with profile state, the onboarding gate, and the always-on wellbeing chrome:
 * Get Help, the day/night wind-down, and the Life-Skills Toolkit drawer (self-hides until the
 * child has unlocked their first tool by playing a Thread-C game).
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <Gate>{children}</Gate>
      <GetHelp />
      <WindDownNudge />
      <ToolkitDrawer />
      <MoodCheckIn />
    </ProfileProvider>
  );
}
