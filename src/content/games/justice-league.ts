// Justice League: Rights Edition (node #35, ages 15–18) — your rights, the laws that protect you, and how
// to get justice. "You have rights, there are laws that protect you, and there are real ways to get help
// and justice — knowing them is your superpower." Builds on Defenders (#20), pairs with Change Makers
// (#34). Empowering & accurate; EDUCATIONAL, NOT legal advice. No-fail; Q&A private.

export type Option = { text: string; ok: boolean };
export type Fact = { emoji: string; say: string };

// 1 · Know Your Rights — fundamental & child rights; then the UN & RE beat.
export const RIGHTS: Fact[] = [
  { emoji: "⚖️", say: "You have the right to equality — and to be free from discrimination." },
  { emoji: "🙂", say: "You have the right to dignity, and to be safe." },
  { emoji: "📚", say: "You have the right to education." },
  { emoji: "🛡️", say: "You have the right to protection from harm and abuse." },
];
export const RIGHTS_UN = "You think rights are only for adults or the powerful — that the law isn't for someone like you.";
export const RIGHTS_RE = "Every child and teen holds rights, guaranteed by law — and here's exactly how to claim them.";

// 2 · Know the Law — the key laws in plain language.
export const LAWS: Fact[] = [
  { emoji: "🔰", say: "POCSO protects under-18s from sexual offences — the age of consent is 18." },
  { emoji: "🏢", say: "The POSH Act protects you from sexual harassment at work or college." },
  { emoji: "💍", say: "The law sets a minimum marriage age — child marriage is illegal." },
  { emoji: "💻", say: "Cyber laws cover online abuse, fakes and non-consensual images." },
];

// 3 · Get Justice — the practical path to redress.
export const JUSTICE: Fact[] = [
  { emoji: "🧑‍🏫", say: "Tell a trusted adult, teacher or counsellor first." },
  { emoji: "🚔", say: "For serious offences, the police must register an FIR." },
  { emoji: "🏫", say: "School/college Internal Committees and Child Welfare Committees can help." },
  { emoji: "📞", say: "Helplines: Childline 1098, Women 181/1091, Emergency 112, Cyber 1930." },
  { emoji: "⚖️", say: "Free legal aid is your right — via the Legal Services Authority." },
];

// 4 · Rights in Action — apply rights to real scenarios.
export type Scene = { emoji: string; situation: string; options: Option[]; result: string };
export const ACTION_SCENES: Scene[] = [
  {
    emoji: "🏫", situation: "A teacher says girls “don't need” to be in the science stream.",
    options: [{ text: "That's discrimination — my right to education applies", ok: true }, { text: "Accept it", ok: false }],
    result: "Right spotted — equality and education are your rights. Raise it with a trusted adult or committee.",
  },
  {
    emoji: "💻", situation: "Someone shares a private image of a classmate to shame her.",
    options: [{ text: "That's a crime — report it (1930) and tell an adult", ok: true }, { text: "Forward it", ok: false }],
    result: "Correct — non-consensual images are illegal. Report to 1930 / cybercrime.gov.in and a trusted adult.",
  },
  {
    emoji: "💍", situation: "A 16-year-old is being pushed into marriage.",
    options: [{ text: "That's illegal — call Childline 1098", ok: true }, { text: "It's a family matter, stay out", ok: false }],
    result: "Child marriage is illegal — Childline 1098 and a trusted adult can help safely.",
  },
];
export const ACTION_MISS = "Look for the right being violated — then pick the move that claims it.";

// 5 · Your Rights Toolkit + Ask Anything.
export type AskItem = { q: string; a: string; help?: boolean };
export const TOOLKIT_ASK: AskItem[] = [
  { q: "What if the police won't take my complaint?", a: "For serious offences they must register an FIR. You can escalate to a senior officer, or get free legal aid via the Legal Services Authority." },
  { q: "Is reporting shameful?", a: "No — reporting is your right, and committees and helplines exist to support you. It's never your fault." },
  { q: "I'm in danger or need help now.", a: "Call Emergency 112, Childline 1098 (under-18), Women 181/1091, or tell a trusted adult immediately.", help: true },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "You have rights, there are laws that protect you, and there are real ways to get justice — knowing them is your superpower.",
  home: "What next?",
  rights: "Know your rights — tap each one.",
  laws: "Know the law — the key protections, in plain language. Tap each.",
  justice: "Get justice — the real routes to redress. Tap each.",
  action: "Rights in action — spot the violation and respond.",
  toolkit: "Your rights toolkit. Tap a question. (Educational, not legal advice.)",
  badge: "Justice badge earned!",
  complete: "You know your rights, the laws, and how to get justice — that's your superpower. Use it well. 🏛️",
};
