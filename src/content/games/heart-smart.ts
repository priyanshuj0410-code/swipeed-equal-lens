// Heart Smart (node #g41, play order: Ch.2, ages 6–9) — Chapter 2, Thread C (Feelings & Life Skills).
// "Be a feelings detective: notice how you and others feel, handle big feelings in small steps, be kind,
// and sort out squabbles the friendly way." The bridge between Feelings Friends (#g01, naming feelings)
// and Mind Matters (#g38, managing them). Warm, never shaming; all feelings okay; healthy coping only;
// questions go to a grown-up (no Ask-It yet). UN & RE make their first gentle appearances. Sam returns a
// bit older. Starts the shared Life-Skills Toolkit. See GDD 41.

export type Step = { emoji: string; say: string };

// 1 · Feelings Detective — notice feelings in yourself AND others (the start of empathy).
export const FEELINGS: Step[] = [
  { emoji: "😊", say: "Happy — a big smile, bright eyes. You can spot it in others too!" },
  { emoji: "😢", say: "Sad — droopy and quiet, maybe teary. It helps just to notice." },
  { emoji: "😠", say: "Angry — a frown, tight fists. It's okay to feel it." },
  { emoji: "😨", say: "Scared — wide eyes, a wobbly tummy. Everyone feels scared sometimes." },
  { emoji: "🤩", say: "Excited — bouncy and bright. Yay!" },
  { emoji: "😤", say: "Jealous — when someone has what you'd like. That feeling is honest." },
  { emoji: "😳", say: "Embarrassed — cheeks go warm. It passes, promise." },
  { emoji: "🥲", say: "Proud — standing tall after trying hard. You did it!" },
];

// 2 · Big Feelings, Small Steps — simple, healthy ways to handle a big feeling (no pain/shock, ever).
export const SMALL_STEPS: Step[] = [
  { emoji: "🌬️", say: "Take a slow breath — in… and out." },
  { emoji: "🖐️", say: "Count to five, nice and slow." },
  { emoji: "🚶", say: "Take some space — step away for a moment." },
  { emoji: "🧸", say: "Squeeze something soft." },
  { emoji: "🗣️", say: "Tell a trusted grown-up how you feel." },
];

// 3 · Walk in Their Shoes — understand how others feel; choose the kind, helpful thing.
export type Scene = { emoji: string; situation: string; options: { text: string; kind: boolean }[]; reason: string };
export const SCENES: Scene[] = [
  {
    emoji: "🧍", situation: "A new kid is standing all alone at break.",
    options: [
      { text: "Go over and ask them to play.", kind: true },
      { text: "Leave them — not my problem.", kind: false },
      { text: "Whisper about them with my friends.", kind: false },
    ],
    reason: "Noticing someone left out, and including them — that's being kind.",
  },
  {
    emoji: "🐶", situation: "Your friend's pet just died and they're crying.",
    options: [
      { text: "Tell them to stop crying, it's just a pet.", kind: false },
      { text: "Sit with them and say you're sorry.", kind: true },
      { text: "Change the subject right away.", kind: false },
    ],
    reason: "Being there and saying 'I'm sorry' helps more than fixing it.",
  },
  {
    emoji: "🍱", situation: "A classmate trips and drops their whole lunch.",
    options: [
      { text: "Point and laugh.", kind: false },
      { text: "Walk past — someone else will help.", kind: false },
      { text: "Help them pick it up.", kind: true },
    ],
    reason: "A small kind hand makes a bad moment so much better.",
  },
];
export const SCENE_MISS = "Hmm, that one isn't very kind. Which choice helps your friend?";

// 4 · Get-Along Gang — sort out an everyday squabble, step by step (the first 'Talk-It-Out' tool).
export const SQUABBLE_INTRO = "Two friends both want the same ball. Let's sort it out the friendly way — step by step.";
export const REPAIR: { emoji: string; step: string }[] = [
  { emoji: "✋", step: "Stop — take a breath before it grows." },
  { emoji: "💬", step: "Use your words — say how you feel." },
  { emoji: "👂", step: "Listen to the other person too." },
  { emoji: "🤝", step: "Make it right — say sorry, or find a fair fix (take turns!)." },
];
export const REPAIR_DONE = "Sorted it — the friendly way! That's a skill you'll use your whole life.";

// 5 · Good Choices — the first, gentlest UN & RE: softly bust the everyday feelings-myths kids pick up.
export type Myth = { un: string; re: string };
export const MYTHS: Myth[] = [
  { un: "Big kids don't cry.", re: "All feelings are okay — and everyone has them, big kids too." },
  { un: "Being scared means you're not brave.", re: "Being brave can include being scared." },
  { un: "Boys don't get sad.", re: "Everyone feels — boys feel too." },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Hi again! I'm Sam. Let's be feelings detectives — notice feelings, be kind, and get along.",
  home: "Which one next?",
  feelings: "Feelings Detective! Tap each feeling — can you spot it in others too?",
  steps: "Big feelings, small steps. Tap each calm-down idea.",
  walk: "Walk in their shoes. Pick the kind thing to do.",
  squabble: "Get-Along Gang! Let's sort out a squabble, step by step.",
  good: "Good choices. Let's gently fix some feelings fibs.",
  badge: "Sticker earned! Look at your heart chart!",
  complete: "You're Heart Smart — you notice feelings, stay kind, and get along. Your heart is growing wise! 💗",
};
