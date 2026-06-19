// Safety Squad (node #8, ages 6–9) — the Safety & Consent thread on screens. Reading-light, no-fail,
// EMPOWERING NEVER FRIGHTENING. Spot unsafe (touch / online / bullying), make the safe move
// (Say No · Get Away · Tell), keep private things private, and know which secrets to always tell.
// Extends My Body, My Rules (#2). All content is plain words / calm cartoons — never graphic.

export type Scenario = { text: string; safe: boolean; emoji: string };
export const SCENARIOS: Scenario[] = [
  { text: "A hug from someone you love, that you want.", safe: true, emoji: "🤗" },
  { text: "A friend asks before borrowing your things.", safe: true, emoji: "🤝" },
  { text: "Someone touches the parts under your underwear.", safe: false, emoji: "🚫" },
  { text: "A bully keeps teasing you — “you throw like a girl!”", safe: false, emoji: "😟" },
  { text: "A stranger online asks for a photo or your home address.", safe: false, emoji: "💻" },
  { text: "Someone online says “don't tell your parents about me.”", safe: false, emoji: "⚠️" },
];

// The one safe move that works everywhere, online and off.
export const SAFE_MOVE = [
  { label: "Say No!", emoji: "✋", say: "Say a big, strong NO!" },
  { label: "Get Away", emoji: "🚶", say: "Get away to somewhere safe." },
  { label: "Tell a Trusted Adult", emoji: "🗣️", say: "Tell a trusted grown-up. It is never your fault." },
];

// Keep It Private — the vault. Private things stay in; some things are fine to share.
export type Info = { label: string; emoji: string; private: boolean };
export const INFO: Info[] = [
  { label: "Your full name", emoji: "🪪", private: true },
  { label: "Home address", emoji: "🏠", private: true },
  { label: "Your school", emoji: "🏫", private: true },
  { label: "Phone number", emoji: "📞", private: true },
  { label: "Your photos", emoji: "📷", private: true },
  { label: "Passwords", emoji: "🔑", private: true },
  { label: "Your favourite colour", emoji: "🎨", private: false },
  { label: "Your favourite game", emoji: "🎮", private: false },
];

// Good secret vs tell secret — the UN & RE beat.
export type Secret = { text: string; tell: boolean; emoji: string };
export const SECRETS: Secret[] = [
  { text: "A surprise birthday party for a friend!", tell: false, emoji: "🎉" },
  { text: "Someone says “don't tell your parents.”", tell: true, emoji: "⚠️" },
  { text: "A secret that makes you feel upset or scared.", tell: true, emoji: "😟" },
  { text: "Planning a fun surprise gift.", tell: false, emoji: "🎁" },
];
export const SECRET_UN = "You don't always have to keep a secret — that's an old rule, and it's not your fault for learning it. Let's rub it out.";
export const SECRET_RE = "A secret that upsets you, or that someone says you must never tell, should ALWAYS be told. Telling is brave — it's not breaking a promise.";

export const BADGE_TARGET = 5; // five Safety Squad missions

export const SAM = {
  greet: "Welcome to the Safety Squad! Pick a mission.",
  home: "Which mission next, squad hero?",
  spot: "Is this one safe, or unsafe?",
  safeUnsafe: { safe: "That's safe — enjoy it!", unsafe: "Unsafe! Use the safe move." },
  move: "The safe move — tap each step!",
  moveDone: "Say No, Get Away, Tell — you've got it! It is never your fault.",
  private: "Is this private — keep it in the vault? Or okay to share?",
  privateReveal: { keep: "Private! Keep it in the vault — don't share it with people you don't know.", share: "That one's fine to share." },
  secrets: "Good secret to keep, or a tell-secret to always tell?",
  secretReveal: { good: "A good, fun secret — okay to keep!", tell: "A tell-secret — always tell a trusted adult!" },
  squad: "Build your Safety Squad — grown-ups you can always tell.",
  badge: "Safety Squad badge earned!",
  complete: "You're a Safety Squad hero! You can spot what's unsafe, say no, and always tell. 🦺",
};
