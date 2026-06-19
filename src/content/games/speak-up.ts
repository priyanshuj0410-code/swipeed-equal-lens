// "Speak Up" — ages 9–12, UNESCO topic 3.3 (recognising gender-based harm + safe responses).
// Scenario → safe-response choice → a help-map of who to turn to. Several responses are safe
// (set a boundary / find an ally / tell a trusted adult / use a helpline); passive or unsafe
// options get a gentle, never-victim-blaming nudge. India adaptation: realistic school
// scenarios; routes to Childline 1098 and the POCSO e-Box. Serious, handled supportively.

export type Response = {
  label: string;
  safe: boolean;
  kind?: string; // the safe-response category, shown on the reveal
};

export type Situation = { scene: string; emoji: string; options: Response[] };

export const SITUATIONS: Situation[] = [
  {
    scene: "A boy keeps commenting on a girl's body in class.",
    emoji: "🗣️",
    options: [
      { label: "Say firmly: “Stop — that's not okay.”", safe: true, kind: "Set a boundary" },
      { label: "Tell a teacher, together", safe: true, kind: "Tell a trusted adult" },
      { label: "Laugh so it's less awkward", safe: false },
    ],
  },
  {
    scene: "Friends tell a girl she can't join because “girls are weak”.",
    emoji: "💪",
    options: [
      { label: "Stand with her: “She's playing.”", safe: true, kind: "Find an ally" },
      { label: "Tell her to just ignore it forever", safe: false },
      { label: "Ask a teacher to help include her", safe: true, kind: "Tell a trusted adult" },
    ],
  },
  {
    scene: "Someone shares a girl's photo around to tease her.",
    emoji: "📵",
    options: [
      { label: "Forward it to warn other people", safe: false },
      { label: "Don't share it — tell a trusted adult", safe: true, kind: "Tell a trusted adult" },
      { label: "Report it to Childline 1098", safe: true, kind: "Use a helpline" },
    ],
  },
  {
    scene: "A classmate is being bullied and begs you to tell no one.",
    emoji: "🤝",
    options: [
      { label: "Keep it secret, no matter what", safe: false },
      { label: "Support them and find a safe adult together", safe: true, kind: "Find an ally" },
      { label: "Show them the POCSO e-Box to report safely", safe: true, kind: "Use a helpline" },
    ],
  },
];

export type HelpRoute = { icon: string; name: string; detail: string };

export const HELP_MAP: HelpRoute[] = [
  { icon: "🧑‍🏫", name: "A teacher", detail: "someone at school you trust" },
  { icon: "🫂", name: "A counsellor or parent", detail: "any trusted adult at home" },
  { icon: "☎️", name: "Childline 1098", detail: "free, 24/7, for any child" },
  { icon: "📩", name: "POCSO e-Box", detail: "report online, safely" },
];
