// Boundary Bot (node #15, ages 9–12) — the Safety & Consent step of Chapter 3. Advances Safety Squad
// (#8): deepens consent (ask first / respect a no, everyday & non-sexual) and online safety (privacy,
// cyberbullying, grooming red-flags). Its signature is Boundary Bot — a SAFE, vetted, NON-generative
// "what should I do if…" helper (curated answers only; serious matters route to real help). No-fail.

// 1 · Ask First — a consent simulator of everyday situations; consent starts with asking.
export type AskScene = { emoji: string; situation: string; ask: string; grab: string; askResult: string; grabResult: string };
export const ASK_FIRST: AskScene[] = [
  { emoji: "📸", situation: "You want to post a photo of your friend.", ask: "Ask them first", grab: "Just post it", askResult: "You asked first — that's consent! 🟢", grabResult: "Posting without asking isn't fair. Ask them first?" },
  { emoji: "✏️", situation: "You'd like to borrow a classmate's pen.", ask: "“Can I borrow this?”", grab: "Just take it", askResult: "Asking first — respect!", grabResult: "Taking without asking isn't okay. Ask first?" },
  { emoji: "🤗", situation: "You want to hug your cousin hello.", ask: "Check if they'd like a hug", grab: "Just grab them", askResult: "You checked first — that's consent, even for a hug!", grabResult: "Not everyone wants a hug. Ask first?" },
];

// 2 · No Means No — the UN & RE beat (the genuine misconception lives in respecting a no).
export const NO_MEANS_NO = {
  myth: "“No just means try harder!”",
  un: "Lots of people think no just means try harder — that's not true, and it's not your fault. Let's rub it out.",
  re: "No means no. Pestering isn't okay. And anyone can change their mind — even after a yes.",
};

// 3 · My Boundaries — set and state your own boundaries with simple, assertive words.
export const BOUNDARIES = [
  { emoji: "✋", say: "“Please ask first.”" },
  { emoji: "🙅", say: "“No — I don't like that.”" },
  { emoji: "🧍", say: "“This is my space.”" },
  { emoji: "⏰", say: "“I need some time to myself.”" },
  { emoji: "🧑‍🏫", say: "“If you don't stop, I'll tell a trusted adult.”" },
];

// 4 · Online Shields — privacy, cyberbullying, grooming red-flags as practical, doable moves.
export type ShieldPuzzle = { emoji: string; situation: string; options: { text: string; ok: boolean }[]; safe: string };
export const ONLINE_SHIELDS: ShieldPuzzle[] = [
  {
    emoji: "🔒", situation: "An app asks to make your profile public.",
    options: [{ text: "Keep it private", ok: true }, { text: "Make it public", ok: false }],
    safe: "Private keeps you safer online. Shield up! 🛡️",
  },
  {
    emoji: "💬", situation: "The group chat is piling on one kid.",
    options: [{ text: "Don't join — report it and support them", ok: true }, { text: "Pile on too", ok: false }],
    safe: "You shielded them — don't pile on, block/report, support the person targeted.",
  },
  {
    emoji: "🕵️", situation: "An online stranger: “You're so grown-up — don't tell your parents. Send a photo?”",
    options: [{ text: "Red flag — stop, don't share, tell a trusted adult", ok: true }, { text: "Send the photo", ok: false }],
    safe: "That's a grooming red flag — stop, don't share, and tell a trusted adult. 🚩",
  },
];
export const SHIELD_MISS = "Let's stay safe — try the safer move.";

// Grooming red-flags (shown as a reference card in Online Shields).
export const RED_FLAGS = "🚩 An over-friendly stranger · showers you with attention · asks you to keep secrets from parents · asks for photos · wants to meet → tell a trusted adult.";

// 5 · Ask Boundary Bot — the SAFE, vetted, curated helper. Everyday Q&A; serious matters route to help.
export type BotItem = { q: string; a: string; help?: boolean };
export const ASK_BOT: BotItem[] = [
  { q: "A friend keeps borrowing my things without asking.", a: "Tell them clearly: “Please ask first.” If it keeps happening, tell a trusted adult." },
  { q: "Someone's being mean in the group chat.", a: "Don't pile on. You can block and report them, and support the person being targeted. Tell a trusted adult if it continues." },
  { q: "Someone shared my photo without asking.", a: "Ask them to take it down, block if you need to, and tell a trusted adult. You can report it on the app." },
  { q: "Someone is pressuring or touching me, or asking me to keep a secret.", a: "That's not okay, and it's never your fault. Tell a trusted adult now — call Childline 1098, or use the POCSO e-Box. Keep telling until someone helps.", help: true },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Meet Boundary Bot! Let's practise asking first, respecting a no, and staying safe online.",
  home: "What shall we practise next?",
  askFirst: "Consent starts with asking. What's the right move?",
  noMeansNo: "“No means no.” Let's bust a big myth with UN and RE.",
  myBoundaries: "Your boundaries are yours. Tap each one to make it your own.",
  onlineShields: "Shields up! Pick the safe move online.",
  askBot: "Ask Boundary Bot 'what should I do if…' — tap a question.",
  badge: "Boundary badge earned!",
  busted: "Bam! Myth busted.",
  complete: "You can ask first, respect a no, and stay safe online and off. Boundary hero! 🤖",
};
