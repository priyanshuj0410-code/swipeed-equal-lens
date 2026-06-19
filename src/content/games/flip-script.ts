// Flip the Script (node #17, ages 9–12) — the Gender & Respect media step of Chapter 3. The child is a
// media editor who spots the gender, colour and body stereotypes hiding in ads and films, then FLIPS them
// into something fair and real. The flip IS the UN & RE move. Builds on What Makes Me Me (#7), Fair Play
// World (#10) and Smart Screen Heroes (#12); the colourism work is a key spiral relearn. No-fail.

export type Option = { text: string; ok: boolean };

// 1 · Spot the Stereotype — find the gender/colour/body stereotype hidden in a piece of media.
export type SpotScene = { emoji: string; media: string; options: Option[]; spotted: string };
export const SPOT: SpotScene[] = [
  {
    emoji: "🎬", media: "A film poster: the hero is a man; the woman is tied up, waiting to be rescued.",
    options: [{ text: "“Heroes are always men; women get rescued”", ok: true }, { text: "The colours are too bright", ok: false }],
    spotted: "Spotted! Heroes come in every gender.",
  },
  {
    emoji: "🧴", media: "A cream ad: “Get fair skin to be beautiful and successful.”",
    options: [{ text: "“Fair skin = beautiful & successful” (colourism)", ok: true }, { text: "The bottle is too small", ok: false }],
    spotted: "Spotted the colourism — every skin is beautiful.",
  },
  {
    emoji: "💪", media: "A poster: “Real boys are tough and never cry.”",
    options: [{ text: "“Boys must be tough and can't feel”", ok: true }, { text: "It needs more exclamation marks", ok: false }],
    spotted: "Spotted! Boys can feel and cry too.",
  },
];
export const SPOT_MISS = "Look again — what idea is the media selling here?";

// 2 · Flip It! — swap the biased line for a fair one (before → after).
export type Ad = { emoji: string; poster: string; original: string; options: { text: string; fair: boolean }[]; cheer: string };
export const FLIP_ADS: Ad[] = [
  {
    emoji: "🧴", poster: "Fairness Cream Ad", original: "“Get fair skin to find a husband.”",
    options: [
      { text: "“Get fair skin to get the job.”", fair: false },
      { text: "“Every skin is beautiful — beauty isn't a colour.”", fair: true },
      { text: "“Buy two, get one free!”", fair: false },
    ],
    cheer: "You flipped the colourism!",
  },
  {
    emoji: "🍲", poster: "Kitchen Product Poster", original: "“For the lady of the house.”",
    options: [
      { text: "“For whoever cooks — everyone shares.”", fair: true },
      { text: "“For the best wives only.”", fair: false },
      { text: "“Now in three colours!”", fair: false },
    ],
    cheer: "Flipped — cooking is for everyone!",
  },
  {
    emoji: "🦸", poster: "Action Film Banner", original: "“Real heroes are men.”",
    options: [
      { text: "“Only the strongest men win.”", fair: false },
      { text: "“Heroes come in every gender.”", fair: true },
      { text: "“Coming soon to cinemas!”", fair: false },
    ],
    cheer: "Flipped — heroes come in every gender!",
  },
];
export const FLIP_MISS = "That one still isn't fair — find the line that flips the script.";

// 3 · Bust the Media Myth — the UN & RE beat (colourism is the central media myth to flip).
export const MEDIA_MYTH = {
  claim: "“Fair skin makes you beautiful and successful.”",
  un: "Ads are made to sell — that message isn't true, and it's not your fault for soaking it up. Let's rub it out.",
  re: "Every skin is beautiful; beauty isn't a colour. You get to decide what's true.",
};

// 4 · Real Stars — against the media's narrow images, meet real, diverse role models.
export const REAL_STARS = [
  { emoji: "👩‍🔬", say: "Women are scientists, pilots, athletes and leaders." },
  { emoji: "👨‍🍳", say: "Men cook, care, nurse and dance." },
  { emoji: "🌈", say: "Real stars come in every skin tone, size and ability." },
  { emoji: "🦽", say: "Strength and beauty have no single look." },
];

// 5 · Make a Fair Ad — design your own fair message, added to the Flipped Gallery.
export const MAKE_TOPICS = [
  { emoji: "🌈", topic: "Skin & beauty", slogan: "“Every skin is beautiful — beauty isn't a colour.”" },
  { emoji: "🦸", topic: "Heroes", slogan: "“Heroes come in every gender.”" },
  { emoji: "🤸", topic: "Bodies", slogan: "“Every shape and size is good.”" },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Welcome to the studio! Let's spot the stereotypes hiding in the media — and flip them fair.",
  home: "What shall we flip next?",
  spot: "Spot the stereotype hiding in this media.",
  flip: "Now flip it! Pick the fair version.",
  mediaMyth: "Time to bust the big media myth with UN and RE.",
  realStars: "Meet the Real Stars — tap each one.",
  makeAd: "Make your own fair ad! Tap a topic to add it to your Flipped Gallery.",
  badge: "Editor badge earned!",
  complete: "You're a media editor — you spot the stereotype and flip the script, fair and real! 🎬",
};
