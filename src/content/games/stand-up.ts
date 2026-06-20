// Stand Up (node #27, ages 12–15) — from bystander to upstander, SAFELY. "When someone's being harassed,
// you don't have to be a hero or do nothing — there are five safe ways to help, and your safety comes
// first." Builds on Speak Up (#19); safety-first always; centres the target; helplines built in. No-fail;
// nothing rewards unsafe action.

export type Option = { text: string; ok: boolean };
export type Fact = { emoji: string; say: string };
export type Scene = { emoji: string; situation: string; options: Option[]; result: string };

// 1 · Read the Room — spot harassment and the moment to act (real harm vs banter).
export const READ_SCENES: Scene[] = [
  {
    emoji: "🚌", situation: "On the bus, a man keeps moving closer and commenting at a girl who looks uncomfortable.",
    options: [{ text: "That's harassment — time to act safely", ok: true }, { text: "Mind your own business", ok: false }],
    result: "You read it right — her discomfort is the signal. If you can help safely, it is your business.",
  },
  {
    emoji: "😂", situation: "Friends are all laughing together at a joke they're equally in on.",
    options: [{ text: "That's banter — everyone's in on it", ok: true }, { text: "Call it harassment", ok: false }],
    result: "Good read — when everyone's genuinely in on it and no one is targeted, it's banter, not harm.",
  },
  {
    emoji: "📱", situation: "In a group chat, people are piling on one girl with cruel comments.",
    options: [{ text: "That's online harassment — act safely", ok: true }, { text: "It's just a joke", ok: false }],
    result: "Harassment dressed as a joke is still harassment — don't pile on; help safely.",
  },
];
export const READ_MISS = "Look at who's targeted and how they feel — is this harm, or genuine shared fun?";

// 2 · The 5 Ds — a safe option for every situation; then the UN & RE bystander beat.
export const FIVE_DS: Fact[] = [
  { emoji: "🗣️", say: "Direct — speak up, only when it's safe to." },
  { emoji: "🎈", say: "Distract — interrupt: ask the time, change the subject, “drop” something." },
  { emoji: "🧑‍🏫", say: "Delegate — get someone safer: a teacher, guard or trusted adult." },
  { emoji: "⏳", say: "Delay — check in with the person afterwards." },
  { emoji: "📸", say: "Document — safely record, and give it to the person targeted." },
];
export const DS_UN = "You don't have to be a hero, and you don't have to freeze — and it's not your fault if you've frozen before.";
export const DS_RE = "Pick a safe D — even a small, safe act can change everything for the person being targeted.";

// 3 · Safety First — judging risk; your safety comes first.
export const SAFETY_SCENES: Scene[] = [
  {
    emoji: "⚖️", situation: "The harasser seems aggressive, and you're alone.",
    options: [{ text: "Don't go Direct — Distract or Delegate instead", ok: true }, { text: "Confront them head-on", ok: false }],
    result: "Smart — when Direct isn't safe, Distract or Delegate keeps everyone safer.",
  },
  {
    emoji: "🆘", situation: "It's escalating, and someone could get hurt.",
    options: [{ text: "Call for help — 112, a guard, or 181", ok: true }, { text: "Handle it all yourself", ok: false }],
    result: "Calling for help is strong, not weak. Your safety comes first.",
  },
];
export const SAFETY_MISS = "Your safety comes first — pick the move that helps without putting you in danger.";

// 4 · Support the Target — after the moment.
export const SUPPORT: Fact[] = [
  { emoji: "🫂", say: "Check in: “Are you okay? That wasn't right.”" },
  { emoji: "💛", say: "Believe them — don't question or blame." },
  { emoji: "🤝", say: "Ask what they need; don't take over." },
  { emoji: "🧑‍🏫", say: "Offer to go with them to report it, if they want." },
];

// 5 · Be an Upstander + Ask Anything.
export type AskItem = { q: string; a: string; help?: boolean };
export const UPSTANDER_ASK: AskItem[] = [
  { q: "What if I'm scared to step in?", a: "You don't have to be a hero — a small, safe D like Distract or Delegate still changes everything." },
  { q: "What if I pick the “wrong” D?", a: "There's no wrong safe choice. Any safe action beats freezing or walking away." },
  { q: "It's serious, or someone's in danger.", a: "Call for help now — Women Helpline 181, 1091, Emergency 112, or Childline 1098. Get a trusted adult.", help: true },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "You don't have to be a hero or do nothing — there are five safe ways to help, and your safety comes first.",
  home: "What next?",
  read: "Read the room — is this harassment, or just banter?",
  fiveDs: "The 5 Ds — a safe option for every situation. Tap each.",
  safety: "Safety first — what's the safe move here?",
  support: "Support the target — after the moment. Tap each.",
  upstander: "Be an upstander. Tap a question.",
  badge: "Upstander badge earned!",
  complete: "From bystander to upstander — safely. You can read the room, pick a safe D, and support the target. 💪",
};
