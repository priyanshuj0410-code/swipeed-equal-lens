"use client";

import { ProfileProvider, useProfile } from "@/lib/store";
import { GetHelp } from "@/components/get-help";
import { Onboarding } from "@/components/onboarding";
import { BrandSplash } from "@/components/brand-splash";

function Gate({ children }: { children: React.ReactNode }) {
  const { profile, ready } = useProfile();
  if (!ready) return <BrandSplash label="Starting up…" />;
  if (!profile.onboarded) return <Onboarding />;
  return <>{children}</>;
}

/** Wraps the app with profile state, the onboarding gate, and the always-on Get Help button. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <Gate>{children}</Gate>
      <GetHelp />
    </ProfileProvider>
  );
}
