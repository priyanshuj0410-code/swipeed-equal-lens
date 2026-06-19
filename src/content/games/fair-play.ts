// Fair Play World (node #10, ages 6–9) — the fairness step of the Gender & Respect thread. Reading-light,
// no-fail. Run a little world: share the chores, chances and rights fairly, watch the Fairness Meter
// balance, flip roles on Swap Day, and bust the unfair "rule" with UN & RE. Even-handed, India-pointed
// (son-preference, unpaid care, girls' education — in the spirit of Beti Bachao, Beti Padhao).

// Share the Work — each chore can go to one person (stereotyped) or be shared fairly.
export type Share = { label: string; emoji: string };
export const CHORES: Share[] = [
  { label: "Cooking", emoji: "🍳" },
  { label: "Cleaning", emoji: "🧹" },
  { label: "Fixing the fan", emoji: "🔧" },
  { label: "Paying the bills", emoji: "🧾" },
  { label: "Caring for the baby", emoji: "👶" },
];
export const CHORE_OPTIONS = [
  { label: "Only Ma", fair: false, nudge: "Only Ma? Let's share!" },
  { label: "Only Papa", fair: false, nudge: "One person can't do it all — let's share!" },
  { label: "Everyone shares", fair: true, nudge: "Everyone helps — Papa cooks, Didi fixes the fan!" },
];

// Fair Chances — opportunities shared fairly between boys and girls (busting son-preference).
export const CHANCES: Share[] = [
  { label: "Going to school", emoji: "🏫" },
  { label: "The cricket team", emoji: "🏏" },
  { label: "The new bike", emoji: "🚲" },
  { label: "Computer time", emoji: "💻" },
];
export const CHANCE_OPTIONS = [
  { label: "Give it to the boy", fair: false, nudge: "Just the boy? Every child deserves a chance!" },
  { label: "Give it to the girl", fair: false, nudge: "Share it — both deserve a turn!" },
  { label: "Share — both!", fair: true, nudge: "Both children get a chance — that's fair!" },
];

// Rights for Every Child — Rights Cards the child collects.
export type Right = { label: string; emoji: string; say: string };
export const RIGHTS: Right[] = [
  { label: "The right to go to school", emoji: "🏫", say: "Every child has the right to go to school!" },
  { label: "The right to play", emoji: "⚽", say: "Every child has the right to play!" },
  { label: "The right to be safe", emoji: "🛡️", say: "Every child has the right to be safe!" },
  { label: "The right to a say", emoji: "🗣️", say: "Every child has the right to be heard!" },
];

// Swap Day — flip roles; feel the other side.
export const SWAPS = [
  { emoji: "🍳", say: "Today, the one who never cooks… cooks! How does it feel?" },
  { emoji: "🚲", say: "Today, the one always left out gets the first turn on the bike!" },
  { emoji: "🧹", say: "Today, everyone sweeps together — even-steven!" },
];

// Bust the 'Rule' — unfair patterns dressed up as natural, busted with UN & RE (even-handed).
export type Rule = { rule: string; un: string; re: string };
export const RULES: Rule[] = [
  { rule: "“Only girls do the housework.”", un: "That's just how it's always been done — but that's an old rule, and it's not your fault for hearing it. Let's rub it out.", re: "Everyone shares the work — Papa and the boys help too!" },
  { rule: "“Send the boy to school, keep the girl home.”", un: "An old rule lots of homes hear — let's gently rub it out, no blame.", re: "Every child deserves the same chance to learn. It can change!" },
  { rule: "“Boys don't help at home.”", un: "Another old rule — let's erase it.", re: "Boys can cook, clean and care too — everyone helps!" },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Welcome to Fair Play World! Let's make things fair.",
  home: "Which corner of the world shall we make fair?",
  work: "Who should do this chore?",
  chances: "Who gets this chance?",
  rights: "Collect every child's rights — tap each card!",
  swap: "It's Swap Day! Tap to flip the roles.",
  rules: "An unfair rule! Let's bust it with UN and RE.",
  fair: "The Fairness Meter is balanced — well done!",
  badge: "Fair Play badge earned!",
  complete: "Your world is fair — everyone shares, and every child gets a chance! 🌍",
};
