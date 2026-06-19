// Content for My Family Garden (node #3, ages 3–6) — the start of the Relationships thread.
// Audio-first, no-fail. Radically inclusive family-builder (joint-family-led), and a Kindness Garden
// that blooms with every caring act. Affection & care only — no romantic content.

export type Member = { id: string; name: string; emoji: string };
// Joint/extended family led (the beloved Indian default), warmly including every other shape + pets.
export const MEMBERS: Member[] = [
  { id: "mum", name: "Mum", emoji: "👩" },
  { id: "dad", name: "Dad", emoji: "👨" },
  { id: "grandma", name: "Grandma", emoji: "👵" },
  { id: "grandpa", name: "Grandpa", emoji: "👴" },
  { id: "aunty", name: "Aunty", emoji: "👩‍🦰" },
  { id: "uncle", name: "Uncle", emoji: "👨‍🦱" },
  { id: "cousin", name: "Cousin", emoji: "🧒" },
  { id: "sister", name: "Sister", emoji: "👧" },
  { id: "brother", name: "Brother", emoji: "👦" },
  { id: "baby", name: "Baby", emoji: "👶" },
  { id: "guardian", name: "Carer", emoji: "🧑" },
  { id: "dog", name: "Dog", emoji: "🐶" },
  { id: "cat", name: "Cat", emoji: "🐱" },
];

// Flowers that bloom in the Kindness Garden (one per kind act).
export const FLOWERS = ["🌸", "🌼", "🌷", "🌻", "🌺", "🪷", "💐", "🌹"];
export const GARDEN_TARGET = 8; // a full garden → the celebratory finish

// Families Love & Care — a short scene; tap the caring thing. No "wrong"; a gentle nudge guides.
export type CareScene = { text: string; options: { emoji: string; label: string; caring: boolean }[]; sam: string };
export const CARE_SCENES: CareScene[] = [
  { text: "Your little brother is sad.", sam: "Comforting someone is caring. 💛", options: [{ emoji: "🤗", label: "Give a hug", caring: true }, { emoji: "📺", label: "Watch TV", caring: false }] },
  { text: "Grandma is carrying heavy bags.", sam: "Helping is a lovely way to care!", options: [{ emoji: "💪", label: "Help carry", caring: true }, { emoji: "🏃", label: "Run ahead", caring: false }] },
  { text: "It's a festival at home!", sam: "Celebrating together is family love. ✨", options: [{ emoji: "🪔", label: "Celebrate together", caring: true }, { emoji: "😴", label: "Stay in bed", caring: false }] },
  { text: "Dad made everyone dinner.", sam: "Saying thank you is caring!", options: [{ emoji: "🙏", label: "Say thank you", caring: true }, { emoji: "🤐", label: "Say nothing", caring: false }] },
];

// Friends Forever — kind friend actions (each blooms a flower).
export type Act = { emoji: string; label: string; sam: string };
export const FRIEND_ACTS: Act[] = [
  { emoji: "🧸", label: "Share a toy", sam: "Sharing makes friends happy!" },
  { emoji: "🔁", label: "Take turns", sam: "Taking turns is fair and kind." },
  { emoji: "🤝", label: "Include the new kid", sam: "Including someone is a big kindness." },
  { emoji: "🙇", label: "Say sorry", sam: "Saying sorry is brave and kind." },
  { emoji: "📣", label: "Cheer a friend", sam: "Cheering a friend on — lovely!" },
];

// Kindness Garden — the signature mode: do a kind act, a flower blooms.
export const KIND_ACTS: Act[] = [
  { emoji: "🧸", label: "Share a toy", sam: "A flower for sharing! 🌸" },
  { emoji: "🛍️", label: "Help carry the shopping", sam: "A flower for helping!" },
  { emoji: "🙏", label: "Say thank you", sam: "A flower for kind words!" },
  { emoji: "🤗", label: "Comfort a friend", sam: "A flower for comforting!" },
  { emoji: "👋", label: "Include someone", sam: "A flower for including!" },
  { emoji: "💧", label: "Water the plants", sam: "A flower for caring for living things!" },
];

// Kinds of Love — family / friend / pet affection, and ways we show it.
export const LOVES: Act[] = [
  { emoji: "👨‍👩‍👧", label: "Family love", sam: "Family love — shown by spending time together. 💛" },
  { emoji: "🧑‍🤝‍🧑", label: "Friend love", sam: "Friend love — shown by sharing and including." },
  { emoji: "🐾", label: "Pet love", sam: "Pet love — shown by feeding and cuddling them." },
];

export const SAM = {
  greet: "Welcome to your Kindness Garden! Let's grow it together. 🌱",
  home: "What shall we play?",
  family: "Build your family! Add anyone who loves you.",
  familyDone: "What a wonderful family! Every family is special — and yours is one of them. 💛",
  care: "What's the caring thing to do?",
  friends: "Let's be a good friend!",
  garden: "Do a kind thing and watch a flower bloom!",
  love: "There are many kinds of love. Tap to see!",
  bloom: "Your garden is blooming! 🌷",
  complete: "Your Kindness Garden is full of flowers! Kindness makes the world beautiful. 🌸",
};
