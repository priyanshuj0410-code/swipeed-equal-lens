"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Profile, SignId, ToolId } from "@/lib/types";
import { TOOL_IDS, MAX_LEVEL } from "@/lib/toolkit";
import { setMuted as setJuiceMuted, setCalm as setJuiceCalm } from "@/lib/juice";

// Local YYYY-MM-DD (device clock): the day key for the kind streak + mood-check cadence.
function dayKey(offset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const STORAGE_KEY = "glrl.profile.v1";

const DEFAULT_PROFILE: Profile = {
  onboarded: false,
  name: "",
  avatar: "🦊",
  locale: "en-IN",
  schoolComfort: false,
  textScale: 1,
  coins: 0,
  bestStreak: 0,
  deckStars: {},
  signMastery: {},
  runsCompleted: 0,
  runDeckCleared: {},
  disgSeen: 0,
  disgCorrect: 0,
  dailyRunOn: "",
  muted: false,
};

type ProfileContextValue = {
  profile: Profile;
  ready: boolean;
  completeOnboarding: (p: { name: string; avatar: string; locale: string; entryAgeGate?: number }) => void;
  setSchoolComfort: (v: boolean) => void;
  setTextScale: (v: number) => void;
  recordCard: (signId: SignId | undefined, correct: boolean) => void;
  finishDeck: (deckId: string, stars: number, coins: number, bestStreak: number) => void;
  recordRun: (p: { deckId: string; disgSeen: number; disgCorrect: number; isStory: boolean }) => void;
  markDailyRun: (dateKey: string) => void;
  setMuted: (v: boolean) => void;
  // --- Life-Skills Toolkit ---
  unlockTool: (id: ToolId, level: number) => void; // raise one tool to at least `level`
  levelTools: (level: number) => void; // raise every tool to at least `level` (Thread-C completion)
  useTool: (id: ToolId) => void; // record the tool was used (lastUsedAt)
  // --- Wellbeing shell ---
  setCalmMode: (v: boolean) => void;
  recordMoodCheck: () => void; // mark the gentle check-in shown today (no mood value stored)
  recordVisit: () => void; // tick the kind daily streak (idempotent per day; uses a freeze if a day is missed)
  reset: () => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [ready, setReady] = useState(false);

  // Load once on mount (client only) to avoid hydration mismatch.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage exists only after mount, so the saved profile loads here
      if (raw) setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(raw) });
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  // Persist on change.
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      /* storage may be unavailable */
    }
  }, [profile, ready]);

  // Keep the shared juice layer's mute in sync with the saved preference (global across all games).
  useEffect(() => {
    setJuiceMuted(profile.muted ?? false);
  }, [profile.muted]);

  // Calm Mode: dial down motion app-wide (juice/confetti) and tag the root for any CSS hooks.
  useEffect(() => {
    const on = profile.calmMode ?? false;
    setJuiceCalm(on);
    document.documentElement.classList.toggle("calm", on);
  }, [profile.calmMode]);

  // Apply text scaling to the document root (rem-based, so the whole UI scales).
  useEffect(() => {
    document.documentElement.style.fontSize = `${Math.round(profile.textScale * 100)}%`;
  }, [profile.textScale]);

  const completeOnboarding = useCallback(
    (p: { name: string; avatar: string; locale: string; entryAgeGate?: number }) =>
      setProfile((prev) => ({ ...prev, onboarded: true, ...p })),
    []
  );
  const setSchoolComfort = useCallback(
    (v: boolean) => setProfile((prev) => ({ ...prev, schoolComfort: v })),
    []
  );
  const setTextScale = useCallback(
    (v: number) => setProfile((prev) => ({ ...prev, textScale: v })),
    []
  );
  const recordCard = useCallback(
    (signId: SignId | undefined, correct: boolean) =>
      setProfile((prev) => {
        if (!signId) return prev; // safeguarding / non-core labels aren't tracked for mastery
        const signMastery = { ...prev.signMastery };
        const cur = signMastery[signId] ?? { seen: 0, correct: 0 };
        signMastery[signId] = { seen: cur.seen + 1, correct: cur.correct + (correct ? 1 : 0) };
        return { ...prev, signMastery };
      }),
    []
  );
  const finishDeck = useCallback(
    (deckId: string, stars: number, coins: number, bestStreak: number) =>
      setProfile((prev) => ({
        ...prev,
        coins: prev.coins + coins,
        bestStreak: Math.max(prev.bestStreak, bestStreak),
        deckStars: { ...prev.deckStars, [deckId]: Math.max(prev.deckStars[deckId] ?? 0, stars) },
      })),
    []
  );
  // Run meta-progression: lifetime disguised-card accuracy (the headline learning signal), runs
  // completed, and which story arcs are cleared. Currency/stars stay in finishDeck (shared with v1).
  const recordRun = useCallback(
    (p: { deckId: string; disgSeen: number; disgCorrect: number; isStory: boolean }) =>
      setProfile((prev) => ({
        ...prev,
        runsCompleted: (prev.runsCompleted ?? 0) + 1,
        disgSeen: (prev.disgSeen ?? 0) + p.disgSeen,
        disgCorrect: (prev.disgCorrect ?? 0) + p.disgCorrect,
        runDeckCleared: p.isStory ? { ...prev.runDeckCleared, [p.deckId]: true } : prev.runDeckCleared,
      })),
    []
  );
  const markDailyRun = useCallback(
    (dateKey: string) => setProfile((prev) => ({ ...prev, dailyRunOn: dateKey })),
    []
  );
  const setMuted = useCallback((v: boolean) => setProfile((prev) => ({ ...prev, muted: v })), []);

  // --- Life-Skills Toolkit (Thread C spine) ---
  // Raise one tool to at least `level` (clamped to MAX_LEVEL); only ever levels up, never down.
  const unlockTool = useCallback(
    (id: ToolId, level: number) =>
      setProfile((prev) => {
        const want = Math.min(Math.max(level, 1), MAX_LEVEL);
        const cur = prev.toolkit?.[id];
        if (cur && cur.level >= want) return prev;
        return { ...prev, toolkit: { ...prev.toolkit, [id]: { ...cur, level: want } } };
      }),
    []
  );
  // Raise every tool to at least `level`: the toolkit grows a chapter at a time as Thread-C games finish.
  const levelTools = useCallback(
    (level: number) =>
      setProfile((prev) => {
        const want = Math.min(Math.max(level, 1), MAX_LEVEL);
        const toolkit = { ...prev.toolkit };
        let changed = false;
        for (const id of TOOL_IDS) {
          const cur = toolkit[id];
          if (!cur || cur.level < want) {
            toolkit[id] = { ...cur, level: want };
            changed = true;
          }
        }
        return changed ? { ...prev, toolkit } : prev;
      }),
    []
  );
  const useTool = useCallback(
    (id: ToolId) =>
      setProfile((prev) => {
        const cur = prev.toolkit?.[id];
        if (!cur) return prev; // only unlocked tools are usable
        return { ...prev, toolkit: { ...prev.toolkit, [id]: { ...cur, lastUsedAt: new Date().toISOString() } } };
      }),
    []
  );

  // --- Wellbeing shell ---
  const setCalmMode = useCallback((v: boolean) => setProfile((prev) => ({ ...prev, calmMode: v })), []);
  const recordMoodCheck = useCallback(
    () => setProfile((prev) => ({ ...prev, mood: { ...prev.mood, lastCheckDayKey: dayKey() } })),
    []
  );
  // Tick the kind streak once per day. A missed day spends a freeze (if any) to protect the streak;
  // otherwise it resets gently to 1: never any shame. New visitors start at day 1 with two freezes.
  const recordVisit = useCallback(
    () =>
      setProfile((prev) => {
        const today = dayKey();
        const ds = prev.dailyStreak;
        if (!ds) return { ...prev, dailyStreak: { count: 1, lastDayKey: today, freezes: 2 } };
        if (ds.lastDayKey === today) return prev; // already counted today
        if (ds.lastDayKey === dayKey(-1)) return { ...prev, dailyStreak: { ...ds, count: ds.count + 1, lastDayKey: today } };
        if (ds.freezes > 0) return { ...prev, dailyStreak: { ...ds, lastDayKey: today, freezes: ds.freezes - 1 } }; // streak protected
        return { ...prev, dailyStreak: { ...ds, count: 1, lastDayKey: today } }; // gentle reset
      }),
    []
  );

  const reset = useCallback(() => setProfile(DEFAULT_PROFILE), []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        ready,
        completeOnboarding,
        setSchoolComfort,
        setTextScale,
        recordCard,
        finishDeck,
        recordRun,
        markDailyRun,
        setMuted,
        unlockTool,
        levelTools,
        useTool,
        setCalmMode,
        recordMoodCheck,
        recordVisit,
        reset,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
