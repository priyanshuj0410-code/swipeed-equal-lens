// What Makes Me, Me (node #7, ages 6–9) — the conceptual keystone of the Gender & Respect thread.
// Reading-light, no-fail. Sort traits into Body (born with) vs Learned (taught), then bust the unfair
// learned "rules" with UN & RE — gender rules are MADE, not natural, so they can change. Even-handed.
// Stays on learned ROLES (not gender identity), which is age-right and broadly acceptable.

export type SortCard = { text: string; kind: "body" | "learned"; reveal: string };
export const SORT_CARDS: SortCard[] = [
  { text: "Some bodies can grow a beard", kind: "body", reveal: "That's about the body — we're born with it." },
  { text: "“Boys are the leaders”", kind: "learned", reveal: "That's a learned rule — society teaches it. It can change!" },
  { text: "Some bodies can have a baby grow inside", kind: "body", reveal: "That's about the body — we're born with it." },
  { text: "“Girls should cook and serve”", kind: "learned", reveal: "That's a learned rule — and it can change!" },
  { text: "Voices get deeper as you grow", kind: "body", reveal: "That's about the body — it happens as you grow." },
  { text: "“Boys don't cry”", kind: "learned", reveal: "That's a learned rule — feelings are for everyone!" },
  { text: "“Pink is for girls, blue is for boys”", kind: "learned", reveal: "That's a learned rule — colours are for everyone!" },
  { text: "We all have a heart, lungs and a brain", kind: "body", reveal: "That's about the body — everyone has them!" },
];

// Bust the 'Rule' — the unfair learned rules, each with UN & RE lines. Even-handed (boys + girls).
export type Rule = { rule: string; un: string; re: string };
export const RULES: Rule[] = [
  { rule: "“Boys are the leaders”", un: "That's an old rule lots of people hear — it's not your fault for thinking it. Let's rub it out.", re: "Anyone can be a leader — that's a learned rule, and it can change!" },
  { rule: "“Girls should cook and serve”", un: "Lots of people hear this — let's gently rub it out. You're not wrong, you're growing.", re: "Cooking and caring are for everyone — a learned rule can change!" },
  { rule: "“Boys don't cry”", un: "That's an old rule — let's erase it. It's okay that you heard it.", re: "All feelings are for everyone — boys can cry too. It can change!" },
  { rule: "“Girls should stay close to home”", un: "An old learned rule — let's rub it out, gently.", re: "Girls can go, explore and lead anywhere — it can change!" },
  { rule: "“Boys don't do housework”", un: "Lots of homes say this — let's rub it out, no blame.", re: "Everyone can help at home — a learned rule, and it can change!" },
];
export const BADGE_TARGET = 4; // bust 4 rules to fill the It-Can-Change Badge Book

export type Line = { emoji: string; say: string };
export const IT_CAN_CHANGE: Line[] = [
  { emoji: "✈️", say: "Women fly planes!" },
  { emoji: "🍳", say: "Men cook and care for babies!" },
  { emoji: "🏅", say: "Women lead and win medals!" },
  { emoji: "🩺", say: "Men can be nurses!" },
  { emoji: "🕰️", say: "In different times and places, the rules were completely different!" },
];

// Same Body, Many Ways — similar bodies, very different likes (your body doesn't decide who you are).
export const SAME_BODY = {
  kidA: { emoji: "🧒🏽", name: "Aarav", likes: "loves cricket and drawing" },
  kidB: { emoji: "🧒🏽", name: "Ishaan", likes: "loves dancing and science" },
  say: "Same kind of body — completely different likes! Your body doesn't decide who you are.",
};

// What Makes Me, Me — the identity self-portrait (likes + strengths; none decided by gender).
export const ME_TAGS: { emoji: string; label: string }[] = [
  { emoji: "🏏", label: "Cricket" }, { emoji: "🎨", label: "Drawing" }, { emoji: "💃", label: "Dancing" },
  { emoji: "📚", label: "Reading" }, { emoji: "🐶", label: "Animals" }, { emoji: "🎵", label: "Music" },
  { emoji: "💛", label: "Kind" }, { emoji: "🦁", label: "Brave" }, { emoji: "🔍", label: "Curious" },
  { emoji: "😄", label: "Funny" }, { emoji: "🤝", label: "Helpful" }, { emoji: "⚽", label: "Sporty" },
];

export const SAM = {
  greet: "Some things are about your body, and some are just learned rules. Let's sort them!",
  home: "What shall we explore?",
  sort: "Body — born with it? Or Learned — society teaches it?",
  rules: "These learned rules wobble — let's bust them with UN and RE!",
  change: "Learned rules really do change! Tap to see.",
  sameBody: "Same body, different likes!",
  me: "What makes YOU, you? Pick what you love and what you're good at.",
  badge: "It can change! Badge earned!",
  meDone: "That's what makes you, YOU — and none of it is decided by being a boy or a girl. 🌟",
  complete: "Gender rules are made, not natural — so they can change. And YOU decide who you are! 🌟",
};
