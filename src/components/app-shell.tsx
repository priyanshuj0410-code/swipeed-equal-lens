"use client";

import { ProfileProvider, useProfile } from "@/lib/store";
import { GetHelp } from "@/components/get-help";
import { Onboarding } from "@/components/onboarding";

function Gate({ children }: { children: React.ReactNode }) {
  const { profile, ready } = useProfile();
  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }
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
