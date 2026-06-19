// My Choices, My Future (node #29, ages 15–18) — opens Chapter 5. The mature completion of Plan It (#22):
// the full contraceptive picture, the real reproductive choices (whether/when/spacing) and the rights and
// access that protect them. "Whether, when and how — made with full information, your own values, and
// respect for your future." Comprehensive, non-judgmental, pressure-free; delaying respected; non-explicit;
// method specifics gated by School-Comfort. No-fail; sim & Q&A private.

export type Option = { text: string; ok: boolean };
export type Fact = { emoji: string; say: string };

// 1 · The Full Picture — the contraceptive methods, factual & non-explicit, then the UN & RE myth-bust.
export const PICTURE_BASE: Fact[] = [
  { emoji: "🛑", say: "Delaying / not having sex is 100% effective — and a respected choice." },
  { emoji: "📋", say: "If someone has sex, several methods prevent pregnancy — they differ in how they work and how effective they are." },
  { emoji: "🩺", say: "A doctor or clinic helps you choose what fits — privately and without judgment." },
];
export const PICTURE_OPEN: Fact[] = [ // shown only when School-Comfort is OFF
  { emoji: "🛡️", say: "Barrier methods (like condoms) also protect against infection." },
  { emoji: "💊", say: "Hormonal methods (like the pill) are highly effective when used correctly." },
  { emoji: "⏳", say: "Long-acting methods are among the most effective and need no daily action." },
];
export const PICTURE_UN = "You don't have to decide from rumour or pressure — “contraception harms your health” is a myth.";
export const PICTURE_RE = "Standard methods are safe and effective. Here's the full picture — now the choice is genuinely yours.";

// 2 · If, When & Whether — the real reproductive choices, and the rights that protect them.
export const IF_WHEN: Fact[] = [
  { emoji: "🤔", say: "Whether to have children at all is your choice." },
  { emoji: "📅", say: "When — and how spaced — is your choice too." },
  { emoji: "⚖️", say: "Reproductive rights protect those choices, for everyone." },
  { emoji: "🕊️", say: "Waiting until you're ready is always respected." },
];

// 3 · Decide It — the values-based decision sim (no right answer; decide well).
export type DecideChoice = { label: string; result: string; good: boolean };
export type DecideScene = { emoji: string; situation: string; choices: DecideChoice[] };
export const DECIDE_SCENES: DecideScene[] = [
  {
    emoji: "🧭", situation: "You're facing a decision about a relationship and sex.",
    choices: [
      { label: "Gather the facts, check your values, decide freely", result: "That's deciding well — informed, by your values, freely. The choice is yours.", good: true },
      { label: "Go along because of pressure", result: "A choice made under pressure isn't really yours. You don't have to decide from rumour or pressure.", good: false },
      { label: "Wait until you're sure you're ready", result: "Waiting is always respected — and a completely valid choice.", good: true },
    ],
  },
  {
    emoji: "🎯", situation: "A choice now could affect your big goals.",
    choices: [
      { label: "Weigh the consequences for your future", result: "Considering consequences is part of deciding well.", good: true },
      { label: "Ignore it and just hope", result: "Your future is worth deciding with the full picture, not hope.", good: false },
    ],
  },
];
export const DECIDE_RECONSIDER = "No pressure, no judgment — decide it with the full picture.";

// 4 · Access & Rights — confidential services and talking it through.
export const ACCESS: Fact[] = [
  { emoji: "🔒", say: "Services are confidential — you have the right to private care." },
  { emoji: "🏥", say: "An RKSK clinic, a family-planning service, or a doctor can help." },
  { emoji: "💬", say: "You can talk openly with a partner — and ask a doctor anything." },
  { emoji: "📜", say: "Knowing your rights means no one decides for you." },
];

// 5 · My Future + Ask Anything — a values reflection and fully open, private Q&A.
export type AskItem = { q: string; a: string; help?: boolean };
export const ASK_HELP: AskItem[] = [
  { q: "How do I choose the right method?", a: "A doctor or clinic walks you through the options to fit your life — privately and without judgment." },
  { q: "What if my partner and I disagree?", a: "It's a shared, respectful conversation — and “your body, your choice” always holds." },
  { q: "I feel pressured, or I'm unsure where to turn.", a: "You don't have to decide from pressure. Talk to a trusted adult or a doctor — or reach an RKSK clinic, or Childline 1098.", help: true },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "You're nearly an adult, and these are your choices: whether, when and how — with full information and your own values.",
  home: "What next?",
  picture: "The full picture of your options. Tap each fact.",
  ifWhen: "If, when and whether — your reproductive choices. Tap each.",
  decideIt: "Decide it — weigh a real choice against your own values.",
  access: "Access and rights — tap each one.",
  myFuture: "Your future, your questions. Tap a question.",
  badge: "My Choices badge earned!",
  complete: "You know the full picture, your rights, and how to decide well — the choice is genuinely yours. 🧭",
};
