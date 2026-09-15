// The Life-Skills Toolkit: guided content for the four tools (steps + Sam intros + per-level labels).
// Design-of-record: knowledge/games/life-skills-toolkit.md. HEALTHY-ONLY: every Cool-Down strategy is
// safe and kind (breathe, ground, move, talk, rest, create): no pain/shock/restriction is ever included.
// The Help Map's actual contacts come from src/content/help.ts (the global Get Help); here we frame the
// tiers. levelLabels[i] is what the child can do at chapter level i+1 (used by the drawer + reflection).

import type { ToolId } from "@/lib/types";

export type ToolStep = { emoji: string; label: string; say: string; kind?: "breathe" | "helplines" };
export type ToolGuide = {
  id: ToolId;
  samIntro: string; // Sam hands the tool over
  steps: ToolStep[];
  levelLabels: string[]; // index 0 = level 1 (Ch.1) … index 4 = level 5 (Ch.5)
};

export const TOOL_GUIDE: Record<ToolId, ToolGuide> = {
  "cool-down": {
    id: "cool-down",
    samIntro: "When a feeling gets big, this is your Cool-Down. Let's settle it together, no rush.",
    steps: [
      { emoji: "👀", label: "Notice", say: "Notice the feeling and name it: 'I feel…'. Naming it already helps." },
      { emoji: "🌬️", label: "Breathe", say: "Breathe slowly with me. In… two, three, four. Out… two, three, four, five, six.", kind: "breathe" },
      { emoji: "🖐️", label: "Ground", say: "Ground yourself: name five things you can see, and four you can hear." },
      { emoji: "🏃", label: "Move", say: "Move or take some space: a stretch, a short walk, a different room." },
      { emoji: "💬", label: "Talk", say: "Talk to someone you trust. Saying it out loud takes the weight off." },
      { emoji: "🎨", label: "Rest or create", say: "Rest, or do something kind for yourself: draw, music, a break." },
    ],
    levelLabels: ["Name a feeling & take a basic calm", "Big feelings, small steps", "A full Cool-Down kit", "Resilience-grade coping", "Adult stress management"],
  },
  "decision-steps": {
    id: "decision-steps",
    samIntro: "A big choice? These are your Decision Steps: let's walk through them, your way.",
    steps: [
      { emoji: "✋", label: "Stop & think", say: "Stop and think. Don't rush it." },
      { emoji: "📋", label: "List options", say: "List your options, even the ones you might skip." },
      { emoji: "⚖️", label: "Weigh", say: "Weigh them against your values and what happens next." },
      { emoji: "✅", label: "Choose", say: "Choose the one that fits you." },
      { emoji: "💪", label: "Own it", say: "Own it: it's your choice to make." },
    ],
    levelLabels: ["Make a simple choice", "Stop, think, choose", "Decisions on health & relationships", "Decisions under pressure", "The adult decision method"],
  },
  "talk-it-out": {
    id: "talk-it-out",
    samIntro: "Something to sort out? Talk-It-Out helps you say it and fix it, calmly.",
    steps: [
      { emoji: "👂", label: "Listen", say: "Listen first: really hear the other person." },
      { emoji: "🗣️", label: "Use 'I'", say: "Use 'I' statements: 'I feel… when…'. No blaming." },
      { emoji: "😌", label: "Stay calm", say: "Stay calm: slow voice, slow breath." },
      { emoji: "🤝", label: "Sort it", say: "Repair, negotiate, or set a boundary: find a fair fix." },
    ],
    levelLabels: ["Say how I feel; say 'no'", "Sort out a squabble", "Assertive communication", "Boundaries & repair", "People skills at adult stakes"],
  },
  "help-map": {
    id: "help-map",
    samIntro: "You never have to handle the big stuff alone. This is your Help Map.",
    steps: [
      { emoji: "🧑", label: "A trusted adult", say: "Start with a trusted adult: a parent, teacher, or relative." },
      { emoji: "🩺", label: "A counsellor", say: "A school counsellor or doctor can help too." },
      { emoji: "☎️", label: "Helplines", say: "Helplines are there for you, day and night.", kind: "helplines" },
      { emoji: "🧑‍🤝‍🧑", label: "Your people", say: "Build your support network: the people you can lean on, for life." },
    ],
    levelLabels: ["Find a trusted adult", "Ask a grown-up", "Childline 1098 & Ask-It", "Tele-MANAS; support a friend", "Build a support network"],
  },
};
