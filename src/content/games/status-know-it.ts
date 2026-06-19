// Status: Know It (node #30, ages 15–18) — the SRH ownership step of Chapter 5. "Knowing your status is
// power, not shame. Testing is self-care, prevention is yours to own, treatment works — and everyone
// deserves dignity." The personal, adult completion of Outbreak (#23): the population strategy becomes
// your own routine; the Defense Kit becomes your prevention stack; the anti-stigma core becomes
// self-respect. Empowering, non-judgmental, non-explicit; some specifics School-Comfort-gated. No-fail.

export type Option = { text: string; ok: boolean };
export type Fact = { emoji: string; say: string };

// 1 · Know Your Status — testing as normal, smart, empowering self-care; then the UN & RE shame-bust.
export const STATUS_FACTS: Fact[] = [
  { emoji: "🧪", say: "Testing is routine self-care that responsible adults do." },
  { emoji: "📍", say: "Free, confidential testing is available — a NACO ICTC centre, an RKSK clinic, a doctor." },
  { emoji: "👀", say: "Many infections have no signs — only testing tells." },
  { emoji: "🔒", say: "Your results are confidential — knowing is your power." },
];
export const STATUS_UN = "Knowing your status isn't shameful — and testing doesn't mean you did something wrong.";
export const STATUS_RE = "It's power — it means you can protect yourself and the people you care about.";

// 2 · The Prevention Stack — your comprehensive toolkit; you choose and combine. Some gated by School-Comfort.
export const STACK_BASE: Fact[] = [
  { emoji: "🛑", say: "Delaying — respected, and fully effective." },
  { emoji: "💉", say: "The HPV vaccine prevents some infections." },
  { emoji: "🧪", say: "Regular testing — know your status." },
  { emoji: "🤝", say: "Honest disclosure with a partner." },
];
export const STACK_OPEN: Fact[] = [ // shown only when School-Comfort is OFF
  { emoji: "🛡️", say: "Condoms protect against infection and pregnancy." },
  { emoji: "💊", say: "PrEP is medicine that helps prevent HIV, where relevant." },
];

// 3 · Talk About It — partner communication about status, testing and protection.
export type TalkScene = { emoji: string; situation: string; options: Option[]; result: string };
export const TALK_SCENES: TalkScene[] = [
  {
    emoji: "💬", situation: "Before things get serious, you want to talk about testing and protection.",
    options: [{ text: "Bring it up calmly and caringly", ok: true }, { text: "Stay quiet to avoid awkwardness", ok: false }],
    result: "A caring partner welcomes that conversation — it's respect, not awkwardness.",
  },
  {
    emoji: "🚩", situation: "A partner refuses to talk about protection or testing.",
    options: [{ text: "Notice what that tells you, and hold your boundary", ok: true }, { text: "Give in to keep them happy", ok: false }],
    result: "Refusal tells you something — your health and boundaries come first.",
  },
];
export const TALK_MISS = "Your health is worth the conversation — pick the caring, honest move.";

// 4 · Treat & Thrive — fear removed.
export const TREAT: Fact[] = [
  { emoji: "💊", say: "Treatment works — HIV is manageable." },
  { emoji: "🟰", say: "U = U: effective treatment means HIV can't be passed on." },
  { emoji: "💚", say: "Most STIs are treated or completely cured." },
  { emoji: "🌟", say: "A diagnosis is not the end — people live full, healthy lives." },
];

// 5 · Dignity & Ask Anything — anti-stigma, self-respect, and confidential help.
export type AskItem = { q: string; a: string; help?: boolean };
export const DIGNITY_ASK: AskItem[] = [
  { q: "Does a diagnosis make someone “dirty”?", a: "No — infections aren't about character. Everyone deserves dignity and respect." },
  { q: "Should I judge a partner for testing or a past diagnosis?", a: "No — testing is responsible and treatment works. Respect, not judgment." },
  { q: "Where do I get tested or find help, privately?", a: "A NACO ICTC centre (free, confidential), an RKSK clinic, or a doctor. Childline 1098 if you need to talk.", help: true },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Knowing your status is power, not shame. Testing is self-care, prevention is yours, treatment works — and everyone deserves dignity.",
  home: "What next?",
  knowStatus: "Know your status — testing is smart self-care. Tap each fact.",
  stack: "Your prevention stack — choose and combine. Tap each.",
  talk: "Talk about it — the caring, honest move with a partner.",
  treat: "Treat and thrive — tap each one.",
  dignity: "Dignity for all. Tap a question.",
  badge: "Status badge earned!",
  complete: "You own your sexual health — testing is power, prevention is yours, treatment works, and dignity is for everyone. 🩺",
};
