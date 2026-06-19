// "Same Same, Different" (node #4, ages 3–6) — the gender opener. Audio-first, no-reading, no-fail.
// Two children who look different appear; the child taps what they SHARE (each tap lights a friendship
// thread) until they become friends, then celebrates what's DIFFERENT ("different is wonderful!").
// A gentle myth-bubble pop is the ages-3–6 seed of Unlearn → Relearn → Grow. India-diverse cast.

export type Kid = { emoji: string; name: string };
export type Trait = { emoji: string; say: string };
export type Myth = { wrong: string; right: string };
export type Pair = { left: Kid; right: Kid; layer: string; same: Trait[]; different: Trait[]; myth?: Myth };

export const PAIRS: Pair[] = [
  {
    left: { emoji: "👧🏽", name: "Meena" },
    right: { emoji: "👦🏾", name: "Arjun" },
    layer: "Feelings",
    same: [
      { emoji: "😄", say: "We can both feel happy!" },
      { emoji: "😨", say: "We both get scared in the dark!" },
      { emoji: "😢", say: "We can both cry when we're sad!" },
    ],
    different: [
      { emoji: "💇", say: "Different hair — wonderful!" },
      { emoji: "👕", say: "Different clothes — wonderful!" },
    ],
    myth: { wrong: "Boys don't cry!", right: "Everyone can cry — feelings are for everyone!" },
  },
  {
    left: { emoji: "🧑🏻‍🦽", name: "Sara" },
    right: { emoji: "👦🏽", name: "Dev" },
    layer: "Can-Do",
    same: [
      { emoji: "🎨", say: "We both love to paint!" },
      { emoji: "🔬", say: "We can both be scientists!" },
      { emoji: "⚽", say: "We can both score a goal!" },
    ],
    different: [
      { emoji: "♿", say: "We move in different ways — wonderful!" },
      { emoji: "🌈", say: "Different favourite colours — wonderful!" },
    ],
    myth: { wrong: "Science is only for boys!", right: "Anyone can be a scientist!" },
  },
  {
    left: { emoji: "👧🏼", name: "Priya" },
    right: { emoji: "👦🏿", name: "Imran" },
    layer: "Can-Do",
    same: [
      { emoji: "🧭", say: "We can both lead the team!" },
      { emoji: "💃", say: "We can both dance!" },
      { emoji: "🍳", say: "We can both cook!" },
    ],
    different: [
      { emoji: "🧕", say: "Different clothes — wonderful!" },
      { emoji: "🙂", say: "Different smiles — wonderful!" },
    ],
    myth: { wrong: "Only girls can dance!", right: "Anyone can dance!" },
  },
  {
    left: { emoji: "👧🏾", name: "Anya" },
    right: { emoji: "👦🏼", name: "Karan" },
    layer: "Fair & Safe",
    same: [
      { emoji: "🤝", say: "We both deserve a turn!" },
      { emoji: "🎲", say: "We can both join the game!" },
      { emoji: "🛡️", say: "We both deserve to be safe and treated kindly!" },
    ],
    different: [
      { emoji: "🥭", say: "We like different foods — wonderful!" },
      { emoji: "🏡", say: "We live in different places — wonderful!" },
    ],
  },
];

export const GARDEN_TARGET = PAIRS.length; // a flower per friendship; full garden = the finish

// Make-a-Friend — a simple, inclusive avatar builder (creation + identity + disability inclusion).
export const SKINS = ["🧒🏻", "🧒🏽", "🧒🏿"];
export const ACCESSORIES = [
  { id: "none", label: "Just me", emoji: "" },
  { id: "glasses", label: "Glasses", emoji: "👓" },
  { id: "wheelchair", label: "Wheelchair", emoji: "🦽" },
  { id: "hearing", label: "Hearing aid", emoji: "🦻" },
];
export const CANDO = ["fly a plane! ✈️", "cook dinner! 🍳", "lead the team! 🧭", "score a goal! ⚽", "be a doctor! 🩺", "be a scientist! 🔬"];

export const SAM = {
  greet: "Hello! I'm Sam. Let's find friends — same inside, different outside!",
  share: "What do they share?",
  diff: "And what's different? Different is wonderful!",
  friends: "They're friends now!",
  next: "Let's meet more friends!",
  make: "Make your own friend! They can be anyone — and do anything.",
  complete: "Your Friendship Garden is full of friends! We're all the same inside.",
};
