// Decoded (node #36, ages 15–18) — THE FINALE lesson node. "The feed is designed to use you — unless you
// can read it." Decode the machine, the message, and yourself, and step into adulthood as the wise, kind,
// critical person you've become. The summit of the media thread (Smart Screen Heroes #12, Flip the Script
// #17, Reality Check #28) and a synthesis of the whole curriculum. UN & RE make their final, REFLECTIVE
// appearance — not to bust one more myth, but to look back on the hundreds busted and hand the skill over
// for life. Critical but not cynical; no dark patterns; closes on Unlearn · Relearn · Grow. No-fail.

export type Option = { text: string; ok: boolean };
export type Fact = { emoji: string; say: string };

// 1 · Decode the Algorithm — how feeds, recommendations and the attention economy work.
export const ALGORITHM: Fact[] = [
  { emoji: "🎯", say: "The feed is algorithmically selected to keep you engaged — not just to show you what's out there." },
  { emoji: "🫧", say: "Personalised feeds create filter bubbles — a narrowed view of the world." },
  { emoji: "⏱️", say: "The attention economy profits from your time — that's the business model." },
  { emoji: "👀", say: "Knowing why you see what you see puts you back in control." },
];

// 2 · Decode the Influence — the UN & RE beat on manipulation.
export type Myth = { myth: string; facts: Option[]; re: string; boss?: boolean };
export const MYTHS: Myth[] = [
  {
    myth: "“If it's viral, it must be true.”",
    facts: [{ text: "Virality is engineered; truth needs checking.", ok: true }, { text: "Popular means true.", ok: false }],
    re: "Virality is engineered to spread — truth still needs checking.",
  },
  {
    myth: "“I'm too smart to be manipulated.”",
    facts: [{ text: "Everyone is targeted; manipulation works while it's invisible.", ok: true }, { text: "Only gullible people fall for it.", ok: false }],
    re: "Everyone is targeted — manipulation works precisely while it stays invisible.",
  },
  {
    boss: true, myth: "“A dark pattern is just a design choice.”",
    facts: [{ text: "It's a trick that nudges you into choices you didn't intend.", ok: true }, { text: "It's harmless.", ok: false }],
    re: "A dark pattern is a deliberate trick — once you can name it, it loses its power.",
  },
];
export const MYTH_UN = "It looks neutral — but it's built to influence you, and it's not your fault for being targeted.";
export const MYTH_MISS = "That's the manipulation working — pick the truth that decodes it.";

// 3 · Decode Yourself — digital wellbeing; living online on purpose.
export const YOURSELF: Fact[] = [
  { emoji: "🎯", say: "Use it on purpose — intentional use beats the endless scroll." },
  { emoji: "⚖️", say: "More screen time isn't more connection — protect your wellbeing." },
  { emoji: "🔒", say: "Mind your privacy and your digital footprint." },
  { emoji: "🧘", say: "Protect your attention — it's yours, not theirs." },
];

// 4 · The Decoder — the master "decode anything" tool.
export const DECODER: Fact[] = [
  { emoji: "❓", say: "Who made this, and why?" },
  { emoji: "🤖", say: "How did the algorithm serve it to me?" },
  { emoji: "🎭", say: "What's the manipulation or dark pattern?" },
  { emoji: "✅", say: "What's actually true — does a reliable source confirm it?" },
  { emoji: "🧭", say: "How will I act on it?" },
];

// 5 · Grow: Your Journey — the finale reflection; UN & RE's last words; your digital-life charter.
export const GROW_UN = "For years we erased the myths together.";
export const GROW_RE = "And rewrote the truth each time. Now you can do it yourself — for the rest of your life.";
export const GROW_TOGETHER = "Unlearn. Relearn. Grow.";
export const CHARTER: Fact[] = [
  { emoji: "🎯", say: "I use it on purpose." },
  { emoji: "🛡️", say: "I protect my attention and privacy." },
  { emoji: "🔍", say: "I check before I share." },
  { emoji: "💛", say: "I'm kind online." },
  { emoji: "📚", say: "I keep learning — Unlearn, Relearn, Grow." },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "The feed is designed to use you — unless you can read it. Let's decode the machine, the message, and yourself.",
  home: "What shall we decode?",
  algorithm: "Decode the algorithm — why you see what you see. Tap each.",
  influence: "Decode the influence — bust the manipulation with UN and RE.",
  yourself: "Decode yourself — digital wellbeing. Tap each.",
  decoder: "The Decoder — decode anything. Tap each question of the master tool.",
  grow: "And now… your journey. Let's look back, together.",
  charter: "Write your digital-life charter — tap each line to make it yours.",
  badge: "Decoder badge earned!",
  busted: "Decoded — the trick loses its power.",
  complete: "You can decode anything now — the machine, the message, and yourself. Step into adulthood wise, kind and critical. Unlearn. Relearn. Grow. 🔓",
};
