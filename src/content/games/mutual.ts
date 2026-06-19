// Mutual (node #31, ages 15–18) — the consent & communication step of Chapter 5. "Consent isn't the
// absence of 'no' — it's a freely given, enthusiastic, ongoing 'yes' from both people. Anything less
// isn't consent." The culmination of the consent journey (My Body My Rules #2, Boundary Bot #15, Green
// Light/Red Light #24) brought to intimate relationships. NEVER explicit; even-handed; POCSO-aware;
// strongest safeguarding routing. No-fail; consent never rushed; Q&A private.

export type Option = { text: string; ok: boolean };
export type Fact = { emoji: string; say: string };

// 1 · What Consent Really Is — the standard (freely given, reversible, informed, enthusiastic, specific, ongoing).
export const CONSENT_STANDARD: Fact[] = [
  { emoji: "🆓", say: "Freely given — no pressure, guilt or threats." },
  { emoji: "🔄", say: "Reversible — either person can stop anytime." },
  { emoji: "📋", say: "Informed — honest, with nothing hidden." },
  { emoji: "🎉", say: "Enthusiastic — a real yes, not the absence of a no." },
  { emoji: "🎯", say: "Specific & ongoing — a yes to one thing, once, isn't a yes to all." },
];

// 2 · Reading & Respecting — read the cues; respect a boundary instantly.
export type Scene = { emoji: string; situation: string; options: Option[]; result: string };
export const READ_SCENES: Scene[] = [
  {
    emoji: "😟", situation: "They pull back and go quiet.",
    options: [{ text: "Check in: “Are you okay? We can stop.”", ok: true }, { text: "Keep going — they didn't say stop", ok: false }],
    result: "You read the cue and checked in — quiet or hesitation is never a yes.",
  },
  {
    emoji: "🛑", situation: "They say “wait, I'm not sure.”",
    options: [{ text: "Stop immediately and listen", ok: true }, { text: "Try to talk them into it", ok: false }],
    result: "You stopped instantly — uncertainty means pause, no questions asked.",
  },
];
export const READ_MISS = "Enthusiasm is the only yes — pick the move that reads and respects the cue.";

// 3 · Pressure & Coercion — the UN & RE beat on the consent myths.
export type Myth = { myth: string; facts: Option[]; re: string; boss?: boolean };
export const MYTHS: Myth[] = [
  {
    myth: "“No means convince me.”",
    facts: [{ text: "No means no — persistence is coercion, not romance.", ok: true }, { text: "Keep trying until they say yes.", ok: false }],
    re: "No means no. Wearing someone down is coercion, not romance.",
  },
  {
    myth: "“They didn't say no, so it's a yes.”",
    facts: [{ text: "Consent is an enthusiastic yes, not the absence of a no.", ok: true }, { text: "Silence counts as agreement.", ok: false }],
    re: "Consent is an enthusiastic yes — never just the absence of a no.",
  },
  {
    myth: "“A relationship or marriage means automatic consent.”",
    facts: [{ text: "Consent is needed every time, by both people.", ok: true }, { text: "Being together means it's always yes.", ok: false }],
    re: "Consent is needed every time, by both people — a relationship never assumes it.",
  },
  {
    boss: true, myth: "“Being drunk or dressed a certain way means willing.”",
    facts: [{ text: "Incapacitation isn't consent; nothing about a person implies it.", ok: true }, { text: "They were asking for it.", ok: false }],
    re: "Incapacitation is never consent — and nothing about how someone looks or what they wore implies it.",
  },
];
export const MYTH_UN = "Wearing someone down isn't a yes — and it's not your fault for hearing these myths. Let's rub it out.";
export const MYTH_MISS = "That's the myth — pick the real consent standard.";

// 4 · The Mutual Zone — practising mutual respect & enthusiastic consent.
export const MUTUAL_SCENES: Scene[] = [
  {
    emoji: "💬", situation: "You both want to take things further. The mutual move is…",
    options: [{ text: "Ask, listen, and check you're both happy at each step", ok: true }, { text: "Assume it's fine and keep going", ok: false }],
    result: "Asking and checking in is what makes it mutual — both people's comfort matters equally.",
  },
  {
    emoji: "🤝", situation: "Your partner seems okay with one thing but unsure about another.",
    options: [{ text: "Respect the line — a yes to one isn't a yes to all", ok: true }, { text: "Push past the unsure part", ok: false }],
    result: "Specific consent — a yes to one thing isn't a yes to everything. You honoured that.",
  },
];
export const MUTUAL_MISS = "Mutual means both — pick the move that checks in and respects.";

// 5 · Your Right, Their Right + Ask Anything — the law, and the strongest safeguarding routing.
export type AskItem = { q: string; a: string; help?: boolean };
export const RIGHTS_ASK: AskItem[] = [
  { q: "Can either person stop, even after starting?", a: "Yes — always. Consent is reversible; either person can stop at any moment, no reason needed." },
  { q: "What does the law say?", a: "In India the age of consent is 18 (POCSO). Consent must be free — incapacitation or pressure means it isn't consent." },
  { q: "Someone crossed my boundary, pressured me, or hurt me.", a: "It's not your fault. Tell a trusted adult or counsellor now — or call Women Helpline 181, 1091, Childline 1098 (under-18), or Emergency 112.", help: true },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Consent isn't the absence of “no” — it's a freely given, enthusiastic, ongoing “yes” from both people. Let's get it right.",
  home: "What next?",
  standard: "What consent really is — the standard. Tap each part.",
  reading: "Reading & respecting — what's the respectful move?",
  pressure: "Pressure & coercion — bust the consent myths with UN and RE.",
  mutual: "The Mutual Zone — practise mutual, enthusiastic consent.",
  rights: "Your right, their right. Tap a question.",
  badge: "Mutual badge earned!",
  busted: "Busted — that's the real standard.",
  complete: "You know real consent: freely given, enthusiastic, mutual, and reversible anytime. That's what makes intimacy safe and good. 💚",
};
