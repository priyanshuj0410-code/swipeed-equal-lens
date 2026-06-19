// Smart Screen Heroes (node #12, ages 6–9) — closes Chapter 2; opens the media-literacy
// and health threads. Four hero mini-games + a habits wrap. No-fail, reading-light, audio-first.
// Real vs pretend (UN & RE), good everyday choices, hygiene, and care-not-stigma kindness.

// 1 · Real or Pretend? — sort screen things; the fairness-cream ad carries the UN & RE beat.
export type ScreenThing = { emoji: string; label: string; pretend: boolean; why: string; unRe?: boolean };
export const SCREEN_THINGS: ScreenThing[] = [
  { emoji: "🧴", label: "“This cream makes you fair and happy!”", pretend: true, why: "Pretend — ads exaggerate. Your skin is already good!", unRe: true },
  { emoji: "🦸", label: "“Eat this snack and you'll be a superhero!”", pretend: true, why: "Pretend — that's an ad selling snacks." },
  { emoji: "🐉", label: "A cartoon dragon flies across the sky", pretend: true, why: "Pretend — cartoons are made up." },
  { emoji: "🐶", label: "A real photo of a real dog", pretend: false, why: "Real — that's a real photo of a real dog." },
  { emoji: "🌞", label: "“This drink makes you a superstar!”", pretend: true, why: "Pretend — a drink can't make you a star. It's selling." },
  { emoji: "🌳", label: "A video of a real tree in the wind", pretend: false, why: "Real — that's the real world." },
];
export const PRETEND_UNRE = {
  un: "Ads are made to sell things — that promise isn't really true, and it's not your fault for believing it. Let's rub it out.",
  re: "A screen can show pretend things. You get to decide what to believe — and your skin is already good.",
};

// 2 · Good Choice — simple decision trees; the good choice advances, the other gives a friendly consequence.
export type GoodChoice = { emoji: string; q: string; good: string; bad: string; goodResult: string; badResult: string };
export const CHOICES: GoodChoice[] = [
  { emoji: "🪥", q: "Bedtime! Brush your teeth or skip it?", good: "Brush them", bad: "Skip it", goodResult: "Sparkly clean teeth — great choice!", badResult: "Skipping makes teeth sad. Want to brush instead?" },
  { emoji: "🧸", q: "Your friend wants a turn. Share the toy or grab it?", good: "Share it", bad: "Grab it", goodResult: "Sharing made you both happy!", badResult: "Grabbing left your friend sad. Try sharing?" },
  { emoji: "✏️", q: "You want Didi's crayon. Ask first or just take it?", good: "Ask first", bad: "Just take it", goodResult: "You asked kindly — that's respect!", badResult: "Taking without asking isn't fair. Ask first?" },
  { emoji: "🌙", q: "It's late. Go to bed or stay up?", good: "Go to sleep", bad: "Stay up", goodResult: "A good sleep — you'll feel great tomorrow!", badResult: "Staying up makes mornings hard. Time to sleep?" },
];

// 3 · Germ Busters — a gentle scrub rhythm: wash the germs away, then cover the cough.
export const GERMS = ["🦠", "🦠", "🦠", "🦠", "🦠"];
export const HYGIENE = [
  { emoji: "🧼", say: "Wash your hands before eating and after the toilet." },
  { emoji: "🤧", say: "Cover your cough and sneeze." },
  { emoji: "✨", say: "Keep clean — and have fun doing it!" },
];

// 4 · Be Kind, Not Mean — a friend is unwell; choose care, not stigma.
export type KindChoice = { label: string; kind: boolean; result: string };
export type KindScene = { situation: string; emoji: string; choices: KindChoice[] };
export const KIND_SCENES: KindScene[] = [
  {
    situation: "Your friend has a cold and is sneezing.",
    emoji: "🤧",
    choices: [
      { label: "Sit with them and be gentle", kind: true, result: "You were kind — that's what a hero does! 🌟" },
      { label: "Tease them and run away", kind: false, result: "That left your friend sad. People who are unwell need care. Try again?" },
    ],
  },
  {
    situation: "A classmate stayed home sick and is back today.",
    emoji: "🤒",
    choices: [
      { label: "Welcome them back warmly", kind: true, result: "A warm welcome — kindness, not teasing!" },
      { label: "Keep away and whisper", kind: false, result: "Keeping away can hurt. Being unwell isn't something to tease. Try again?" },
    ],
  },
];

// + Smart Screen Habits — a light wrap; balance and a route to a trusted adult.
export const HABITS = [
  { emoji: "⏸️", say: "Take breaks — screens are fun, but rest your eyes too." },
  { emoji: "⚖️", say: "Balance screen time with play, books and friends." },
  { emoji: "🧑‍🏫", say: "If something online confuses or upsets you, tell a grown-up you trust." },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Ready to be a Smart Screen Hero? Let's go!",
  home: "Which hero mission next?",
  realPretend: "Real, or just pretend? You decide!",
  goodChoice: "What's the good choice here?",
  germBusters: "Germs, beware! Let's scrub them away.",
  beKind: "A friend is unwell. What does a hero do?",
  habits: "Smart screen habits — tap each one.",
  badge: "Hero badge earned! Your cape grows.",
  complete: "You're a Smart Screen Hero — you think for yourself, stay healthy, and are kind! 🦸",
};
