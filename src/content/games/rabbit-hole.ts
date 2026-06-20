// The Rabbit Hole (node #g43, play order: Ch.4, ages 12–15) — Chapter 4, Threads E + G (Gender & Respect ·
// Values/Media). "There's a funnel online that turns 'be a better man' into 'blame women'. Learn how it
// works, who profits from it — and what real strength actually looks like." Extends MythBuster: Gender
// (#g25) & Equalize (#g26) onto online misogyny; uses the media literacy of Reality Check/Decoded.
// MAKE-OR-BREAK: never 'boys/men are the problem' — non-shaming, compassionate to the need underneath,
// media-literacy-led, centred on POSITIVE MASCULINITY, and it NEVER platforms real influencers or content.
// Routes the underlying loneliness to real help. School-Comfort sets depth. Sam (teen) hosts. See GDD 43.

export type Step = { emoji: string; say: string };

// 1 · The Funnel — how the algorithm escalates relatable bait into misogyny. A step-by-step reveal; the
// payoff is the disarming insight: it's a designed funnel, not your failing.
export const FUNNEL: { emoji: string; step: string }[] = [
  { emoji: "💪", step: "It starts relatable: 'get fit', 'do better with girls', 'make money', 'be a man'." },
  { emoji: "📈", step: "Outrage and extremes get the most engagement — so the feed keeps pushing further." },
  { emoji: "😤", step: "Step by step, 'self-improvement' shades into blaming women and 'us vs them'." },
  { emoji: "🎯", step: "It targets boys who feel lonely or unsure — offering an identity, a brotherhood, someone to blame." },
  { emoji: "💡", step: "Here's the key: it's a designed funnel, not your failing. Seeing it is how you step out." },
];
export const FUNNEL_DONE = "You can see the funnel now — and once you see it, it loses its grip. Nice.";

// 2 · Follow the Money — the grift. BASE always shown; OPEN (blunter) only when School-Comfort is OFF.
export const MONEY_BASE: Step[] = [
  { emoji: "🛒", say: "You're not a disciple — you're the product." },
  { emoji: "💸", say: "Gurus monetise your insecurity: courses, subs, 'academies', affiliate hustles." },
  { emoji: "🔥", say: "Rage-bait and manufactured outrage exist because they pay." },
  { emoji: "🧾", say: "The guy telling you you're 'not enough' is selling you the cure." },
];
export const MONEY_OPEN: Step[] = [
  { emoji: "🎭", say: "He invented the problem — 'you're not a real man' — so he could sell you the fix." },
];

// 3 · Spot the Hook — the UN & RE beat. Bust the claims; never shame a teen for having found them convincing.
export type Myth = { un: string; re: string };
export const HOOKS: Myth[] = [
  { un: "You're not a real man unless…", re: "Worth isn't a rank — you're already enough." },
  { un: "Women or feminism are why your life is hard.", re: "Loneliness and rejection are real and common — and not someone else's fault to punish." },
  { un: "'Alpha / high-value male' science.", re: "It's pseudo-science — people aren't ranked like that." },
  { un: "It's us versus them.", re: "Us-vs-them is the manipulation. Respect isn't a war." },
  { un: "This mentor will fix you.", re: "You're the product; he's selling the cure for a problem he invented." },
];

// 4 · Real Strong — positive masculinity (the heart). Strength that lifts, never belittles.
export const REAL_STRONG: Step[] = [
  { emoji: "🫱", say: "Strong AND kind — real strength lifts people; it never needs anyone else to be small." },
  { emoji: "🎯", say: "Ambitious AND respectful — you can want more without putting anyone down." },
  { emoji: "📈", say: "Improve yourself without belittling anyone." },
  { emoji: "🤝", say: "Real friends, real community, real purpose — that's the belonging it promised you." },
  { emoji: "💛", say: "And the big one: you're already enough." },
];

// 5 · Have Each Other's Backs — support a friend (call-in, not call-out); resist; help for the loneliness.
export const BACKS: Step[] = [
  { emoji: "🤝", say: "A friend slipping in? Stay connected — don't mock or write them off (that pushes them deeper)." },
  { emoji: "❓", say: "Ask real questions, and be the belonging the funnel was offering." },
  { emoji: "🧑", say: "Loop in a trusted adult if you need to." },
  { emoji: "🛡️", say: "For everyone: recognise online misogyny, refuse to absorb it, don't be harassed into silence." },
  { emoji: "☎️", say: "Help for the loneliness underneath is real: Tele-MANAS 14416 · KIRAN 1800-599-0019." },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Hey — Sam here. Let's pull back the curtain on the 'manosphere': how the funnel works, who profits, and what real strength actually is.",
  home: "Where to? No judgement here.",
  funnel: "The Funnel. Let's trace how relatable content escalates — step by step.",
  money: "Follow the Money. Tap each one — once you see the incentive, the message loses its grip.",
  hooks: "Spot the Hook. Let's bust the claims — they're built to be convincing.",
  realStrong: "Real Strong. Tap each one — this is the better answer.",
  backs: "Have Each Other's Backs. Tap each one — this part's for everyone.",
  badge: "Got it! You're seeing the strings now.",
  complete: "Someone made you feel not enough so they could sell you the fix. The truth: real strength lifts people — it never needs anyone else to be small. 💪",
};
