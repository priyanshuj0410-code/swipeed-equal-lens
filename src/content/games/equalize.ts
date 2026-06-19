// Equalize (node #26, ages 12–15) — the Gender & Respect step that closes the gap between BELIEVING in
// equality and LIVING it. Spot the gap, rebalance it, and see that equality lifts everyone (non-zero-sum).
// The natural next step after MythBuster: Gender (#25); carries Fair Play (#10) / Not Fair Not Funny (#11)
// into structural fairness; hands to Stand Up (#27). Hopeful; changes the pattern, not the person. No-fail.

export type Option = { text: string; ok: boolean };
export type Fact = { emoji: string; say: string };

// 1 · The Equality Gap — the belief–practice gap in plain sight.
export const GAP_FACTS: Fact[] = [
  { emoji: "🧹", say: "“We share the housework” — but mostly she does. That's the gap." },
  { emoji: "💰", say: "“Equal pay” — yet a real pay and ownership gap remains." },
  { emoji: "👔", say: "“Anyone can lead” — yet few women hold power." },
  { emoji: "🔍", say: "Most people believe in equality — the gap is in living it." },
];

// 2 · The Second Shift — a household sim: redistribute the unpaid load until it's fair.
export const CHORES = [
  { emoji: "🍲", task: "Cooking" },
  { emoji: "🧺", task: "Laundry" },
  { emoji: "👶", task: "Childcare" },
  { emoji: "🧹", task: "Cleaning" },
];
export const SHIFT_SHARED = "Shared — fairer already!";
export const SHIFT_BALANCED = "The second shift is balanced — the load is genuinely fair now.";

// 3 · Equalize! — the signature: spot the imbalance and rebalance it.
export type EqScene = { emoji: string; situation: string; options: Option[]; fixed: string };
export const EQUALIZE_SCENES: EqScene[] = [
  {
    emoji: "🏫", situation: "In class, the boys always get picked to lead.",
    options: [{ text: "Make sure girls get equal turns to lead", ok: true }, { text: "Leave it — that's just how it is", ok: false }],
    fixed: "Equal turns — everyone's ideas get heard.",
  },
  {
    emoji: "💼", situation: "At a workplace, only men get promoted.",
    options: [{ text: "Fair hiring, pay and promotion by default", ok: true }, { text: "Men are just better at it", ok: false }],
    fixed: "Fair by default — talent isn't a gender.",
  },
  {
    emoji: "🏛️", situation: "A community council has no women on it.",
    options: [{ text: "Equal voice and representation", ok: true }, { text: "Women don't need a say", ok: false }],
    fixed: "Equal voice — better decisions for everyone.",
  },
];
export const EQ_MISS = "That keeps the gap open — pick the move that rebalances it.";

// 4 · Equality Lifts Everyone — the UN & RE beat: equality is not zero-sum.
export const LIFTS = {
  myth: "“Equality means men lose.”",
  un: "Equality isn't a pie where your slice shrinks — and it's not your fault for hearing that. Let's rub it out.",
  re: "When the old roles loosen, everyone — including boys and men — gets more freedom, closeness, and less pressure.",
};

// 5 · Be the Change + Ask Anything — concrete actions a teen can take now.
export const BE_CHANGE: Fact[] = [
  { emoji: "🧹", say: "Share chores at home." },
  { emoji: "🗣️", say: "Speak up when a girl's idea is ignored." },
  { emoji: "📚", say: "Encourage anyone toward any subject or role." },
  { emoji: "⚖️", say: "Split group work fairly." },
  { emoji: "👀", say: "Notice and name a double standard." },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Most people say they believe in equality — so why is the work, the pay and the power still unequal? Let's rebalance it.",
  home: "Where to next?",
  gap: "The equality gap — belief vs practice. Tap each one.",
  secondShift: "Redistribute the unpaid load until it's fair. Tap each chore to share it.",
  equalize: "Equalize! Spot the imbalance and fix it.",
  lifts: "Equality lifts everyone — let's bust the zero-sum myth with UN and RE.",
  beChange: "Be the change — tap each action you can take now.",
  badge: "Equalize badge earned!",
  complete: "You spotted the gap, rebalanced it, and saw that equality lifts everyone. Change the pattern! 🟰",
};
