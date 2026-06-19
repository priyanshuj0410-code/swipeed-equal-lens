// Speak Up (node #19, ages 9–12) — the Gender & Respect step that names gender-based harm and finds help.
// Safety-critical, non-graphic, NEVER victim-blaming. Grows Not Fair, Not Funny (#11): the ally instinct
// and "if it hurts it's not a joke" mature into recognising real harm and knowing exactly who to tell —
// because it's never your fault, and you're never alone. No-fail; supportive throughout.

export type Option = { text: string; ok: boolean };

// 1 · Spot the Harm — calm scenarios across the spectrum; learn what counts and why it's wrong.
export type SpotScene = { emoji: string; scene: string; options: Option[]; why: string };
export const SPOT: SpotScene[] = [
  {
    emoji: "🗣️", scene: "A boy keeps making comments about a girl's body in class.",
    options: [{ text: "That's harassment — not okay.", ok: true }, { text: "Just a joke — ignore it.", ok: false }],
    why: "That crossed from teasing into harm. It's not okay — and it's not her fault.",
  },
  {
    emoji: "🚫", scene: "Friends say a girl can't join “because girls are weak”.",
    options: [{ text: "That's unfair exclusion.", ok: true }, { text: "That's just how games are.", ok: false }],
    why: "Shutting someone out for their gender is harm — name it as unfair, and include her.",
  },
  {
    emoji: "📲", scene: "Someone shares a girl's photo to tease and shame her.",
    options: [{ text: "That's harm — don't share, report it.", ok: true }, { text: "Forward it for a laugh.", ok: false }],
    why: "Sharing a photo to shame someone is serious harm. Don't pile on — report it and tell an adult.",
  },
];
export const SPOT_MISS = "Look again — has this crossed from teasing into harm?";

// 2 · The Safe Response — boundary / ally / tell / helpline; never a risky confrontation.
export type SafeOption = { label: string; safe: boolean; kind?: string };
export type SafeScene = { emoji: string; scene: string; options: SafeOption[] };
export const SAFE: SafeScene[] = [
  {
    emoji: "✋", scene: "Someone keeps commenting on your body.",
    options: [
      { label: "Say firmly: “Stop — that's not okay.”", safe: true, kind: "Set a boundary" },
      { label: "Laugh it off and say nothing", safe: false },
      { label: "Tell a trusted adult", safe: true, kind: "Tell a trusted adult" },
    ],
  },
  {
    emoji: "🧑‍🤝‍🧑", scene: "A friend is being shut out and teased.",
    options: [
      { label: "Include them and speak up kindly", safe: true, kind: "Find an ally" },
      { label: "Join in so you fit in", safe: false },
      { label: "Tell a teacher together", safe: true, kind: "Tell a trusted adult" },
    ],
  },
  {
    emoji: "📞", scene: "Something serious is happening and you don't know who to tell.",
    options: [
      { label: "Call Childline 1098", safe: true, kind: "Use a helpline" },
      { label: "Keep it a secret", safe: false },
      { label: "Tell a trusted adult", safe: true, kind: "Tell a trusted adult" },
    ],
  },
];
export const SAFE_MISS = "That leaves you on your own — choose a safe response: a boundary, an ally, telling, or a helpline.";

// 3 · It's Not Your Fault — the crucial UN & RE unlearn.
export const NOT_FAULT = {
  myths: "“She asked for it.” · “Boys will be boys.” · “Telling is snitching.”",
  un: "“She asked for it” and “boys will be boys” are old, wrong ideas — and it's not your fault for hearing them. Let's rub them out.",
  re: "No one ever asks to be harmed. It's always the fault of the person who harms. Telling is brave, not snitching.",
};

// 4 · The Help Map — match a situation to the right help; build a map you keep.
export const HELP_MAP = [
  { emoji: "🧑‍🏫", say: "A trusted adult or teacher — for most worries." },
  { emoji: "🧑‍⚕️", say: "The school counsellor — to talk things through." },
  { emoji: "📞", say: "Childline 1098 — free, any time, for any child." },
  { emoji: "📮", say: "The POCSO e-Box — to report unsafe touch safely." },
  { emoji: "☎️", say: "The women's helpline — 181." },
];

// 5 · Stand Together — supporting someone harmed; keep telling until someone helps.
export const STAND_TOGETHER = [
  { emoji: "🤝", say: "Support the person — you believe them; it's not their fault." },
  { emoji: "🧑‍🏫", say: "Report it together — get a trusted adult." },
  { emoji: "🔁", say: "Keep telling until someone helps." },
  { emoji: "💛", say: "You're never alone." },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Some things cross from teasing into harm. Let's learn to spot them, respond safely, and find help.",
  home: "Which one next? Take your time.",
  spot: "Is this harm? Spot it — and know why it's wrong.",
  safe: "What's a safe response here? (Never a risky confrontation.)",
  notFault: "The most important thing: it's never your fault. Let's bust these old ideas.",
  helpMap: "Build your Help Map — tap each one to keep it.",
  standTogether: "Standing together. Tap each one.",
  badge: "Speak Up badge earned!",
  complete: "You can spot harm, respond safely, and find help — it's never your fault, and you're never alone. 📣",
};
