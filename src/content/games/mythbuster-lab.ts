// MythBuster: Gender (node #25, ages 12–15) — the 5-mode "myth-busting lab" rebuild. "Put the claim in the
// lab, check the evidence, and watch the myth get busted." Evidence-based and even-handed: genuine facts
// are CONFIRMED; the myth is busted, never the believer. UN & RE run throughout. Builds on Flip the Script
// (#17) / Norm Storm (#18); sets up Equalize (#26) / Stand Up (#27). No-fail; Q&A private.
// (The earlier swipe deck remains reachable at /play/mythbuster; this is the path-node game.)

export type Option = { text: string; ok: boolean };
export type Fact = { emoji: string; say: string };

// 1 · The Myth Lab — test a claim against evidence → BUSTED or CONFIRMED; then the central UN & RE beat.
export type Claim = { emoji: string; claim: string; myth: boolean; evidence: string };
export const LAB: Claim[] = [
  { emoji: "🧮", claim: "“Boys are better at maths and science.”", myth: true, evidence: "BUSTED — no real ability gap; the gap is opportunity and expectation." },
  { emoji: "👩‍💼", claim: "“Girls are too emotional to lead.”", myth: true, evidence: "BUSTED — leadership isn't gendered; women lead everywhere, ably." },
  { emoji: "😢", claim: "“Boys don't cry — they must be tough.”", myth: true, evidence: "BUSTED — all humans feel; suppressing it harms boys." },
  { emoji: "🧬", claim: "“Some bodies differ between the sexes.”", myth: false, evidence: "CONFIRMED — bodies can differ; but ability and character are not gendered." },
];
export const LAB_MISS = "Test it against the evidence — is that a stereotype, or a real fact?";
export const LAB_UN = "That's a stereotype, not a fact — and it's not your fault for hearing it everywhere.";
export const LAB_RE = "Here's what the evidence actually shows — ability and character are never gendered.";

// 2 · Busted! — the gallery of big gender myths busted with evidence (incl. ones that box in boys/men).
export const BUSTED: Fact[] = [
  { emoji: "🧮", say: "“Boys are better at maths” — busted: it's opportunity, not ability." },
  { emoji: "👩‍✈️", say: "“Girls can't lead” — busted: women lead everywhere." },
  { emoji: "😢", say: "“Boys must be tough” — busted: all humans feel." },
  { emoji: "👨‍🍳", say: "“Caring isn't manly” — busted: earning and caring aren't gendered." },
];

// 3 · The 'It's Just Biology' Files — separate real sex differences from pseudo-scientific stereotype.
export type Scene = { emoji: string; situation: string; options: Option[]; result: string };
export const BIOLOGY: Scene[] = [
  {
    emoji: "📏", situation: "“Average height differs a bit between the sexes.”",
    options: [{ text: "A real difference (on average)", ok: true }, { text: "A sexist stereotype", ok: false }],
    result: "Real — some bodily averages differ. But an average never decides an individual.",
  },
  {
    emoji: "🧠", situation: "“Boys are wired for maths, girls for caring.”",
    options: [{ text: "Pseudo-science stereotype", ok: true }, { text: "Real biology", ok: false }],
    result: "Stereotype dressed as science — there's no such wiring; individual variation beats group averages.",
  },
];
export const BIOLOGY_MISS = "Is it a real bodily average, or a stereotype dressed up as “biology”?";

// 4 · Double Standard Detector — same act, judged differently by gender.
export const DOUBLE: Scene[] = [
  {
    emoji: "🔁", situation: "An assertive boy is called a “leader”; an assertive girl is called “bossy”.",
    options: [{ text: "That's a double standard", ok: true }, { text: "That's fair", ok: false }],
    result: "Spotted — same act, judged by gender. That's a double standard.",
  },
  {
    emoji: "🙄", situation: "“Boys will be boys” excuses a boy; a girl is blamed for the same thing.",
    options: [{ text: "Double standard — call it out", ok: true }, { text: "That's normal", ok: false }],
    result: "Right — an excuse for one and blame for the other is a double standard.",
  },
];
export const DOUBLE_MISS = "Same act, different judgment by gender? That's the tell.";

// 5 · Myth-Buster's Toolkit + Ask Anything.
export type AskItem = { q: string; a: string; help?: boolean };
export const TOOLKIT_ASK: AskItem[] = [
  { q: "How do I answer a gender myth in real life?", a: "Ask for the evidence, check what it actually says, give a real counter-example — and answer with respect, not a fight." },
  { q: "What if someone won't listen?", a: "Bust the myth, not the believer. Plant the evidence calmly — minds change over time." },
  { q: "Where can I check a claim?", a: "Look for real evidence and reliable sources — and remember individual variation beats any group average." },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "“Boys are better at maths”? “Girls can't lead”? Put the claim in the lab, check the evidence, and bust the myth.",
  home: "What shall we test?",
  lab: "The Myth Lab — is it a stereotype, or a real fact? Judge each claim.",
  busted: "The Busted gallery — tap each myth we've busted with evidence.",
  biology: "The “It's Just Biology” files — real difference, or stereotype?",
  doubleStd: "Double Standard Detector — spot the gendered double standard.",
  toolkit: "Your Myth-Buster's toolkit. Tap a question.",
  badge: "Myth-Buster badge earned!",
  busted_one: "Busted — the evidence wins.",
  complete: "You test the claim, check the evidence, and bust the myth — not the believer. Myth-Buster! 💡",
};
