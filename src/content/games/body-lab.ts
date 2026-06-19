// Body Lab Juniors (node #6, ages 6–9) — opens Chapter 2. Reading-light (with audio), no-fail,
// science-framed. Five lab stations; the body thread's step from "my body is mine" (#2) to "here's how
// it works and grows". UN & RE (the unlearn–relearn duo) formally appear here for the first time.

export type Organ = { id: string; name: string; emoji: string; does: string };
export const ORGANS: Organ[] = [
  { id: "heart", name: "Heart", emoji: "❤️", does: "Pumps blood — ba-dum, ba-dum!" },
  { id: "lungs", name: "Lungs", emoji: "🫁", does: "Breathe air in and out." },
  { id: "brain", name: "Brain", emoji: "🧠", does: "Thinks, feels, and remembers." },
  { id: "tummy", name: "Tummy", emoji: "🍽️", does: "Turns food into energy." },
  { id: "muscles", name: "Muscles", emoji: "💪", does: "Move you around!" },
  { id: "bones", name: "Bones", emoji: "🦴", does: "Hold you up, nice and strong." },
];

export type Sense = { id: string; emoji: string; say: string };
export const SENSES: Sense[] = [
  { id: "eyes", emoji: "👀", say: "Eyes — to SEE the world!" },
  { id: "ears", emoji: "👂", say: "Ears — to HEAR sounds!" },
  { id: "nose", emoji: "👃", say: "Nose — to SMELL!" },
  { id: "tongue", emoji: "👅", say: "Tongue — to TASTE!" },
  { id: "skin", emoji: "✋", say: "Skin — to FEEL touch!" },
];

export type Stage = { emoji: string; label: string; say: string };
export const STAGES: Stage[] = [
  { emoji: "👶", label: "Baby", say: "A baby — tiny and new!" },
  { emoji: "🧒", label: "Child — you are here!", say: "A child — that's you right now!" },
  { emoji: "🧑", label: "Teen", say: "A teen — bigger changes come when you're older." },
  { emoji: "🧑‍🦱", label: "Grown-up", say: "All grown up!" },
  { emoji: "🧓", label: "Older grown-up", say: "An older grown-up — a whole life of growing." },
];
export const YOU_ARE_HERE = 1;

// Where Babies Grow — simple + factual; depth set by the School-Comfort toggle.
export const BABIES = {
  simple: "Babies grow in a part of the body called the uterus.",
  fuller: "A baby starts from a tiny egg from a woman and a tiny sperm from a man, and grows in the uterus.",
  un: "“Babies come from a tummy” is what lots of little kids think — let's gently update it. You're not wrong, you're growing.",
  reSimple: "Babies grow in the uterus — a special part of the body.",
  reFuller: "Babies grow in the uterus — and it starts from a tiny egg and a tiny sperm.",
};

export type BodyCard = { emoji: string; say: string };
export const ALL_BODIES: BodyCard[] = [
  { emoji: "📏", say: "Tall and short — all good!" },
  { emoji: "🤗", say: "Big and small — all good!" },
  { emoji: "🎨", say: "Every skin colour — all beautiful!" },
  { emoji: "💇", say: "Curly and straight hair — all good!" },
  { emoji: "🦽", say: "A body that uses a wheelchair — all good!" },
  { emoji: "👓", say: "Glasses or a hearing aid — all good!" },
];
export const SKIN_MYTH = {
  wrong: "Fair skin is better!",
  un: "“Fair skin is better” is an old idea lots of people hear — let's rub it out. You're not wrong, you're growing.",
  re: "Every skin colour is good and beautiful — your skin is perfect as it is.",
};

export const SAM = {
  greet: "Welcome to my Body Lab! Pick a station to explore.",
  home: "Which station next?",
  label: "Tap each part to see what it does!",
  senses: "Your five senses — tap each one!",
  grow: "Slide to see how bodies grow — from baby to grown-up!",
  babies: "A science question lots of kids ask…",
  bodies: "Every body is good. Tap to see!",
  badge: "Body Boss! Badge earned!",
  complete: "You're a Body Boss! Your body is amazing — and you're growing. 🌟",
};
