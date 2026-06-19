// Content for Feelings Friends (node #1, ages 3–6) — authored as data, audio-first, no-fail.
// One creature per core feeling; short everyday "match" scenes; the Big No actions. (en-IN; the
// strings are the narration Sam speaks and the on-screen labels, kept short for pre-readers.)

export type Feeling = {
  id: string;
  name: string;
  emoji: string;
  color: string; // distinct colour so a pre-reader recognises it without words
  sam: string; // Sam's reassurance — every feeling is okay
};

// Appendix A — the Feelings Friends (collected into the "Feelings Family").
export const FEELINGS: Feeling[] = [
  { id: "happy", name: "Happy", emoji: "😄", color: "#F5C518", sam: "It feels good to be happy!" },
  { id: "sad", name: "Sad", emoji: "😢", color: "#5B9BD5", sam: "It's okay to feel sad. I'm right here." },
  { id: "angry", name: "Angry", emoji: "😠", color: "#E05C52", sam: "Angry is okay — let's find a calm way." },
  { id: "scared", name: "Scared", emoji: "😨", color: "#9B6FD6", sam: "Being scared is okay. You can tell a grown-up." },
  { id: "shy", name: "Shy", emoji: "🫣", color: "#F49AC2", sam: "Feeling shy is okay — take your time." },
  { id: "excited", name: "Excited", emoji: "🤩", color: "#FF9F40", sam: "So much excited energy!" },
  { id: "calm", name: "Calm", emoji: "😌", color: "#62B84B", sam: "Ahh — calm feels nice. Let's breathe together." },
];

export const FEELING_BY_ID: Record<string, Feeling> = Object.fromEntries(FEELINGS.map((f) => [f.id, f]));

// Appendix B — "Match the Feeling" scenes. `answer` is the best-fit feeling; there is NO wrong answer,
// only a gentle nudge, so any tap gets a warm response.
export type Scene = { text: string; answer: string };
export const SCENES: Scene[] = [
  { text: "Your ice cream falls on the ground.", answer: "sad" },
  { text: "It's your birthday party!", answer: "excited" },
  { text: "A big dog barks loudly.", answer: "scared" },
  { text: "Someone takes your toy without asking.", answer: "angry" },
  { text: "You meet lots of new people all at once.", answer: "shy" },
  { text: "You finish a hard puzzle all by yourself.", answer: "happy" },
  { text: "Your best friend goes home.", answer: "sad" },
  { text: "The room is very, very dark.", answer: "scared" },
];

// Mode 4 — the Big No. Loud, proud, celebrated actions (the refusal/safety foundation).
export type BigNo = { label: string; emoji: string; sam: string; accent: string };
export const BIG_NO: BigNo[] = [
  { label: "No!", emoji: "✋", sam: "A big, strong NO! Well done!", accent: "#E05C52" },
  { label: "Stop!", emoji: "🛑", sam: "STOP! Loud and clear!", accent: "#FF9F40" },
  { label: "Yes!", emoji: "👍", sam: "Yes! You can say yes too.", accent: "#62B84B" },
  { label: "I need help", emoji: "🆘", sam: "Asking for help is brave. I'm proud of you.", accent: "#5B9BD5" },
];

// Calm Corner — one simple belly-breath, framed for a preschooler. Sam breathes along.
export const CALM_STEPS = [
  { id: "in", label: "Smell the flower", emoji: "🌸", say: "Smell the flower… breathe in slowly.", ms: 4000 },
  { id: "out", label: "Blow the candle", emoji: "🕯️", say: "Blow the candle… breathe out slowly.", ms: 4000 },
] as const;
export const CALM_CYCLES = 3;

export const SAM = {
  greet: "Hello! I'm Sam. How do you feel today?",
  checkInThanks: "Thank you for telling me. Let's play!",
  meet: "Tap a friend to say hello.",
  match: "How would you feel?",
  mirror: "How do YOU feel right now?",
  bigNo: "Let's practise our big, brave voice!",
  calm: "Let's breathe together.",
  familyComplete: "You met the whole Feelings Family! 🎉",
};
