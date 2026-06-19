// Plan It (node #22, ages 12–15) — the SRH planning step of Chapter 4. Pregnancy isn't a mystery — it
// follows clear rules. Learn how it happens, how it's prevented, and how planning protects the future you
// want. Continues The Amazing Journey (#14) into prevention/planning. Non-judgmental, no-fail; abstinence
// is respected as a real choice; accurate, NON-explicit contraception basics are gated by School-Comfort.

export type Option = { text: string; ok: boolean };
export type Fact = { emoji: string; say: string };

// 1 · The Fertility Cycle — when pregnancy can happen.
export const CYCLE_FACTS: Fact[] = [
  { emoji: "🥚", say: "Pregnancy begins when a sperm cell meets an egg cell." },
  { emoji: "🔄", say: "An egg is released about once a cycle — and the timing varies person to person." },
  { emoji: "⏱️", say: "Sperm can survive a few days, so the “fertile window” isn't a single day." },
  { emoji: "📅", say: "Because cycles vary, you can't reliably “guess” a safe time." },
];

// 2 · Myths Busted — the UN & RE core; these myths cause real, preventable harm.
export type Myth = { myth: string; facts: Option[]; re: string; boss?: boolean };
export const MYTHS: Myth[] = [
  {
    myth: "“You can't get pregnant the first time.”",
    facts: [{ text: "Pregnancy can happen any time sperm reaches an egg — including the first time.", ok: true }, { text: "The first time is always safe.", ok: false }],
    re: "Pregnancy can happen any time sperm reaches an egg — including the very first time.",
  },
  {
    myth: "“You can't get pregnant standing up or in water.”",
    facts: [{ text: "Position and place make no difference.", ok: true }, { text: "Standing up prevents it.", ok: false }],
    re: "Position and place make no difference to whether pregnancy can occur.",
  },
  {
    myth: "“You can't get pregnant during a period.”",
    facts: [{ text: "It's less likely, but still possible.", ok: true }, { text: "Periods are always safe.", ok: false }],
    re: "It's less likely but still possible — cycles vary, so it's not safe to assume.",
  },
  {
    boss: true, myth: "“Pulling out is reliable, and contraception causes infertility.”",
    facts: [{ text: "Withdrawal isn't reliable; standard methods don't cause infertility.", ok: true }, { text: "Both of those are true.", ok: false }],
    re: "Withdrawal is not reliable, and standard methods do not cause infertility — that's a common false fear.",
  },
];
export const MYTH_UN = "That myth is how people get caught out — and it's not your fault for hearing it. Let's rub it out.";
export const MYTH_MISS = "That's the myth talking — pick the fact so you're never caught out.";

// 3 · Ways to Prevent — delaying respected (always shown); contraception basics gated by School-Comfort.
export const PREVENT_BASE: Fact[] = [
  { emoji: "🛑", say: "Not having sex yet is the only 100% sure way — and a choice plenty of people your age make. That's completely okay." },
  { emoji: "💛", say: "It's okay to wait until you're older and ready. There's no rush." },
];
export const PREVENT_OPEN: Fact[] = [ // shown only when School-Comfort is OFF
  { emoji: "🩺", say: "If someone does have sex, methods exist that prevent pregnancy — a doctor or youth clinic can explain them properly." },
  { emoji: "🛡️", say: "Condoms also protect against infections — that's two jobs in one." },
];

// 4 · Plan It! — the life-sim: choices ripple into the future, without fear or shame.
export type PlanChoice = { label: string; result: string; safe: boolean };
export type PlanScene = { emoji: string; situation: string; choices: PlanChoice[] };
export const PLAN_SCENES: PlanScene[] = [
  {
    emoji: "🎯", situation: "You have big goals — finishing school, a career. A relationship is getting serious.",
    choices: [
      { label: "Delay sex for now", result: "A clear, respected choice — your goals stay fully on track.", safe: true },
      { label: "If you have sex, protect against pregnancy & infection", result: "Planning ahead keeps your future wide open.", safe: true },
      { label: "Take a risk and just hope", result: "Hoping isn't a plan — an unplanned pregnancy can change your path. Knowing the facts protects you.", safe: false },
    ],
  },
  {
    emoji: "🗺️", situation: "A friend says “it'll be fine, don't worry about it.”",
    choices: [
      { label: "Get the real facts and decide for yourself", result: "Smart — facts beat guesses, and the choice stays yours.", safe: true },
      { label: "Go along to avoid the awkwardness", result: "Your future is worth a little awkwardness. The facts keep your plan safe.", safe: false },
    ],
  },
];
export const PLAN_RECONSIDER = "No fear, no shame — just reconsider with the facts.";

// 5 · My Future + Ask Anything — private reflection, Q&A and trustworthy help.
export type AskItem = { q: string; a: string; help?: boolean };
export const ASK_HELP: AskItem[] = [
  { q: "How do I know when I'm ready?", a: "There's no rush — readiness is about you, your values, and being safe. Waiting is always okay." },
  { q: "Where can I get accurate, private answers?", a: "A doctor or an RKSK adolescent-friendly health clinic can explain things properly and privately." },
  { q: "I'm worried I might be pregnant, or someone is pressuring me.", a: "Talk to a trusted adult or a doctor now — or call Childline 1098. You deserve support and accurate help.", help: true },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Pregnancy isn't a mystery — it follows clear rules. Learn how it works, how it's prevented, and plan the future you want.",
  home: "What next?",
  cycle: "When can pregnancy happen? Tap each fact.",
  myths: "Bust the dangerous pregnancy myths — pick the fact.",
  prevent: "Ways to prevent — tap each one.",
  planIt: "Plan it! See how today's choices ripple into your future.",
  myFuture: "Your future, your questions. Tap a question.",
  badge: "Plan It badge earned!",
  busted: "Busted — now you're never caught out.",
  complete: "You know how pregnancy happens, how it's prevented, and how planning protects your future. Plan It! 🗓️",
};
