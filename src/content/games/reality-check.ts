// Reality Check (node #28, ages 12–15) — the media-literacy step of Chapter 4. Almost nothing online is
// as real as it looks. Learn to spot what's staged, what's fake, and what's just not true. The grown-up
// culmination of Smart Screen Heroes (#12) and Flip the Script (#17); hands to Decoded (#36). Critical &
// calm, NEVER explicit; the media-and-sexuality card is gated by School-Comfort. No-fail.

export type Option = { text: string; ok: boolean };
export type Fact = { emoji: string; say: string };

// 1 · Real vs Reel — judge whether a post/image/"life" is real or staged & curated.
export type Reel = { emoji: string; claim: string; staged: boolean; why: string };
export const REAL_VS_REEL: Reel[] = [
  { emoji: "🏝️", claim: "An influencer's “perfectly spontaneous” holiday photo.", staged: true, why: "Staged — planned, posed, edited and curated." },
  { emoji: "🍔", claim: "A glossy burger ad that looks nothing like the real thing.", staged: true, why: "Staged — food ads are styled with tricks." },
  { emoji: "📷", claim: "A friend's slightly messy photo of a normal day.", staged: false, why: "Real — real life isn't curated." },
  { emoji: "😍", claim: "A couple's “we never fight” perfect-relationship post.", staged: true, why: "A highlight reel — not the whole story." },
];
export const REEL_MISS = "Look again — is that real, or staged and curated?";

// 2 · The Manipulation Files — spot the tricks; the UN & RE beat.
export type Myth = { myth: string; facts: Option[]; re: string; boss?: boolean };
export const MYTHS: Myth[] = [
  {
    myth: "“If it's online or in a video, it's real.”",
    facts: [{ text: "Posts are curated; images and video can be faked.", ok: true }, { text: "Cameras never lie.", ok: false }],
    re: "Posts are curated, and images and video can be faked — seeing isn't believing online.",
  },
  {
    myth: "“Everyone's life is better than mine.”",
    facts: [{ text: "Feeds are highlight reels, not real life.", ok: true }, { text: "Their life really is perfect.", ok: false }],
    re: "Feeds are highlight reels — you're comparing your behind-the-scenes to everyone's best moments.",
  },
  {
    boss: true, myth: "“You can't tell what's fake.”",
    facts: [{ text: "Every trick has a tell — and you can learn them.", ok: true }, { text: "Fakes are undetectable.", ok: false }],
    re: "Every trick has a tell — once you can see how it's made, it can't fool you.",
  },
];
export const MYTH_UN = "It looks real — but look how it was made. And it's not your fault for being fooled.";
export const MYTH_MISS = "That's the trick working — pick the reality so it can't fool you.";

// 3 · Love, Romance & Sex on Screen — non-explicit; the porn-specific card is School-Comfort-gated.
export const LOVE_FACTS: Fact[] = [
  { emoji: "🎬", say: "Media dramatises and idealises love — real relationships aren't like the movies." },
  { emoji: "💞", say: "“We never fight” is a highlight reel — real love includes ordinary, unglamorous moments." },
  { emoji: "🚫", say: "Pornography is staged performance — not real life, not a model to copy, and not sex education." },
];
// In School-Comfort mode only the first two are shown (the porn-specific card is hidden).
export const LOVE_SCHOOL_COMFORT_COUNT = 2;

// 4 · Fakes & Your Rights — deepfakes, the law, protect & report.
export const FAKES: Fact[] = [
  { emoji: "🤖", say: "Deepfakes use AI to fake images, video and voices convincingly." },
  { emoji: "⛔", say: "Making or sharing a non-consensual image is wrong — and illegal." },
  { emoji: "🛡️", say: "Protect yourself: lock down privacy, and think before you share." },
  { emoji: "📞", say: "Report a fake / non-consensual image: 1930 · cybercrime.gov.in · Childline 1098. Never forward it." },
];

// 5 · Think for Yourself — the critical-questions toolkit.
export const TOOLKIT: Fact[] = [
  { emoji: "❓", say: "Who made this, and why?" },
  { emoji: "🕳️", say: "What's left out?" },
  { emoji: "🎭", say: "Is it staged, sponsored or faked?" },
  { emoji: "✅", say: "Does a reliable source confirm it?" },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Almost nothing online is as real as it looks. Let's learn to spot what's staged, fake, or just not true.",
  home: "What next?",
  realVsReel: "Real, or reel? Judge whether it's genuine or staged & curated.",
  manipulation: "The Manipulation Files — spot the trick. Bust the myth with UN and RE.",
  love: "How screens show love and sex — and what's real. Tap each one.",
  fakes: "Fakes and your rights — tap each one.",
  toolkit: "Think for yourself — the critical-questions toolkit. Tap each.",
  badge: "Reality Check badge earned!",
  busted: "Busted — now you can see the trick.",
  complete: "You can spot what's staged, what's fake, and what's just not true. Think for yourself! 🔍",
};
