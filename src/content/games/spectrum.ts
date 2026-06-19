// Spectrum (node #32, ages 15–18) — the diversity & respect step of Chapter 5. "People differ in who they
// are and who they love — and every single one deserves dignity, respect and safety. That part isn't up
// for debate." Extends What Makes Me Me (#7) and MythBuster: Gender (#25) to orientation and gender
// identity. NEVER shames anyone or any family; NEVER outs anyone; non-explicit; high-stakes safeguarding
// with careful triage; constitutional-values framing. No-fail; Q&A private and carefully routed.

export type Option = { text: string; ok: boolean };
export type Fact = { emoji: string; say: string };

// 1 · The Spectrum — orientation & gender identity vary; accurate terms, natural diversity.
export const SPECTRUM: Fact[] = [
  { emoji: "🧭", say: "Sexual orientation is who a person is romantically or sexually attracted to." },
  { emoji: "🪞", say: "Gender identity is a person's own internal sense of their gender." },
  { emoji: "🌈", say: "People vary — this is natural human diversity, across cultures and history." },
  { emoji: "🇮🇳", say: "This diversity exists in India's own history too — it isn't a foreign import." },
];

// 2 · Myths & Respect — the UN & RE beat; dignity is non-negotiable.
export type Myth = { myth: string; facts: Option[]; re: string; boss?: boolean };
export const MYTHS: Myth[] = [
  {
    myth: "“It's a choice you can change.”",
    facts: [{ text: "Orientation & gender identity aren't chosen or “fixable”.", ok: true }, { text: "People can just change.", ok: false }],
    re: "Orientation and gender identity are not a choice and not something to “fix” — people simply vary.",
  },
  {
    myth: "“It's an illness.”",
    facts: [{ text: "It is not an illness — that's settled in health science.", ok: true }, { text: "It needs curing.", ok: false }],
    re: "It is not an illness — that's settled in health science.",
  },
  {
    myth: "“It's contagious, or can be taught.”",
    facts: [{ text: "It cannot be “caught” or taught.", ok: true }, { text: "You can catch it.", ok: false }],
    re: "It cannot be “caught” or taught — that's a myth.",
  },
  {
    boss: true, myth: "“It's a foreign / Western import.”",
    facts: [{ text: "This diversity exists across cultures and India's own history.", ok: true }, { text: "It came from the West.", ok: false }],
    re: "This diversity exists across cultures — and throughout India's own history. It's not an import.",
  },
];
export const MYTH_UN = "That belief about who people are isn't true, and it's caused real harm — it's not your fault for hearing it.";
export const MYTH_MISS = "That's the myth — pick the understanding that's true.";

// 3 · Dignity for All — respect, inclusion & anti-bullying in real scenarios.
export type Scene = { emoji: string; situation: string; options: Option[]; result: string };
export const DIGNITY_SCENES: Scene[] = [
  {
    emoji: "🛡️", situation: "Someone is being bullied for being “different”.",
    options: [{ text: "Step in safely, support them, and report it", ok: true }, { text: "Laugh along to fit in", ok: false }],
    result: "You stood up — everyone deserves safety, and that's a constitutional value.",
  },
  {
    emoji: "🤝", situation: "A classmate comes out to you, in confidence.",
    options: [{ text: "Accept them, keep it private, be a friend", ok: true }, { text: "Tell everyone", ok: false }],
    result: "Acceptance and privacy — you never out someone. That's real allyship.",
  },
  {
    emoji: "💬", situation: "You disagree with someone's identity or beliefs.",
    options: [{ text: "Treat them with dignity and safety anyway", ok: true }, { text: "Use it to justify disrespect", ok: false }],
    result: "You don't have to agree with everyone to treat everyone with dignity, respect and safety.",
  },
];
export const DIGNITY_MISS = "Dignity is non-negotiable — pick the respectful, safe move.";

// 4 · Being You — for anyone questioning.
export const BEING_YOU: Fact[] = [
  { emoji: "🌱", say: "It's okay to be unsure — there's no pressure to label yourself." },
  { emoji: "⏳", say: "Take all the time you need; nothing has to be figured out today." },
  { emoji: "🫂", say: "You're not alone — and you deserve support and safety." },
  { emoji: "🔒", say: "Sharing anything is always your own choice." },
];

// 5 · Support & Ask Anything — carefully triaged.
export type AskItem = { q: string; a: string; help?: boolean };
export const SUPPORT_ASK: AskItem[] = [
  { q: "How can I be a good ally?", a: "Listen, respect, never out anyone, and step in safely against bullying." },
  { q: "Is it okay if I'm still figuring myself out?", a: "Completely — there's no deadline and no pressure. You're okay exactly as you are." },
  { q: "I'm being bullied, or struggling with how I feel.", a: "You deserve support and safety. Talk to a trusted adult or counsellor — or call KIRAN / Tele-MANAS 1800-599-0019, or Childline 1098. Sharing is always your choice.", help: true },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "People differ in who they are and who they love — and every one deserves dignity, respect and safety. That part isn't up for debate.",
  home: "What next?",
  spectrum: "The spectrum — understanding identity. Tap each.",
  myths: "Myths & respect — bust the harmful myths with UN and RE.",
  dignity: "Dignity for all — what's the respectful, safe move?",
  beingYou: "Being you — for anyone figuring themselves out. Tap each.",
  support: "Support is here. Tap a question.",
  badge: "Spectrum badge earned!",
  busted: "Busted — understanding, not myth.",
  complete: "People simply vary — and every one deserves dignity, respect and safety. You get it. 🌈",
};
