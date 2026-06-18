// The SwipeEd learning path (a slice of the ages 3–18 curriculum from the spec).
// Only Green Light / Red Light is built, so it's the single "active" node;
// everything else is "locked" until we build those engines.

export type PathStatus = "active" | "locked" | "done";

export type PathNode = {
  id: string;
  title: string;
  emoji: string;
  kind: string; // the lesson engine, e.g. "Swipe", "Story"
  status: PathStatus;
  href?: string;
};

export type PathSection = {
  title: string;
  subtitle: string;
  nodes: PathNode[];
};

export const PATH: PathSection[] = [
  {
    title: "Ages 9–12 · You & Others",
    subtitle: "Reading people, on and offline",
    nodes: [
      { id: "glrl", title: "Green Light / Red Light", emoji: "🚦", kind: "Swipe", status: "active", href: "/decks" },
      { id: "boundary-bot", title: "Boundary Bot", emoji: "🤖", kind: "Sim", status: "locked" },
      { id: "crossroads", title: "Crossroads", emoji: "🛣️", kind: "Story", status: "locked" },
      { id: "puberty-quest", title: "Puberty Quest", emoji: "🌱", kind: "Myth-bust", status: "locked" },
      { id: "defenders", title: "Defenders of the Body", emoji: "🛡️", kind: "Mini-sim", status: "locked" },
    ],
  },
  {
    title: "Ages 12–15 · Going Deeper",
    subtitle: "Consent, choices & wellbeing",
    nodes: [
      { id: "lines-limits", title: "Lines & Limits", emoji: "✋", kind: "Story", status: "locked" },
      { id: "plan-it", title: "Plan It", emoji: "🗓️", kind: "Sim", status: "locked" },
      { id: "real-talk", title: "Real Talk: Bodies", emoji: "💬", kind: "Cards", status: "locked" },
      { id: "change-makers", title: "Change Makers", emoji: "🌍", kind: "Mini-sim", status: "locked" },
    ],
  },
];
