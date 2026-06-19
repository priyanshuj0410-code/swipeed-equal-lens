// The SwipeEd learning path (ages 3–18), weaving the core suite with the
// Gender Equality Game Pack. Today only the swipe engine is built, so the two
// swipe-native games are "active" (playable): Green Light / Red Light and
// MythBuster: Gender. Everything else is "locked" until its engine ships.

export type PathStatus = "active" | "locked";

export type PathNode = {
  id: string;
  title: string;
  emoji: string;
  kind: string; // lesson engine: Swipe, Sort, Story, Sim, Tap…
  status: PathStatus;
  href?: string;
  tag?: "gender"; // part of the Gender Equality pack
};

export type PathSection = {
  title: string;
  subtitle: string;
  nodes: PathNode[];
};

export const PATH: PathSection[] = [
  {
    title: "Ages 3–6 · Everyone is equal",
    subtitle: "Feelings, fairness & body-safety",
    nodes: [
      { id: "same-same", title: "Same Same, Different", emoji: "🧒", kind: "Tap", status: "active", href: "/game/same-same", tag: "gender" },
      { id: "my-body", title: "My Body, My Rules", emoji: "🛡️", kind: "Tap", status: "locked" },
      { id: "can-do", title: "Can-Do Kids", emoji: "🦸", kind: "Role-play", status: "active", href: "/game/can-do", tag: "gender" },
    ],
  },
  {
    title: "Ages 6–9 · Fair is fair",
    subtitle: "Sharing, allies & speaking up",
    nodes: [
      { id: "fair-play", title: "Fair Play World", emoji: "⚖️", kind: "Sort", status: "locked", tag: "gender" },
      { id: "trust-detectives", title: "Trust Detectives", emoji: "🕵️", kind: "Sort", status: "locked" },
      { id: "not-funny", title: "Not Fair, Not Funny", emoji: "🙅", kind: "Choose", status: "locked", tag: "gender" },
    ],
  },
  {
    title: "Ages 9–12 · Reading people",
    subtitle: "Flags, scripts & getting help",
    nodes: [
      { id: "puberty-quest", title: "Puberty Quest", emoji: "🌱", kind: "Myth-bust", status: "locked" },
      { id: "glrl", title: "Green Light / Red Light", emoji: "🚦", kind: "Swipe", status: "active", href: "/decks" },
      { id: "flip-script", title: "Flip the Script", emoji: "🎬", kind: "Remix", status: "locked", tag: "gender" },
      { id: "speak-up", title: "Speak Up", emoji: "📣", kind: "Scenario", status: "locked", tag: "gender" },
    ],
  },
  {
    title: "Ages 12–15 · Going deeper",
    subtitle: "Myths, consent & standing up",
    nodes: [
      { id: "mythbuster", title: "MythBuster: Gender", emoji: "💡", kind: "Swipe", status: "active", href: "/play/mythbuster", tag: "gender" },
      { id: "plan-it", title: "Plan It", emoji: "🗓️", kind: "Sim", status: "locked" },
      { id: "stand-up", title: "Stand Up", emoji: "✊", kind: "Scenario", status: "locked", tag: "gender" },
    ],
  },
  {
    title: "Ages 15–18 · Change the system",
    subtitle: "Work, rights & redress",
    nodes: [
      { id: "lead-the-way", title: "Lead the Way", emoji: "💼", kind: "Sim", status: "locked", tag: "gender" },
      { id: "change-makers", title: "Change Makers", emoji: "🌍", kind: "Campaign", status: "locked", tag: "gender" },
      { id: "justice-league", title: "Justice League: Rights", emoji: "⚖️", kind: "Cases", status: "locked", tag: "gender" },
    ],
  },
];
