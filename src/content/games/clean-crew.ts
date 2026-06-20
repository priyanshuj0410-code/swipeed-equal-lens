// Clean Crew (node #g37, play order 3, ages 3–6) — Chapter 1. "Meet the Clean Crew! Wash, brush and take
// care of your body every day." Follows My Body, My Rules (#g02): once a child knows their body is their
// own, this shows how to look after it. Parent co-play, audio-first, no fail, never shaming. No formal
// UN & RE yet (a gentle precursor — Sam models "germs we can't see wash away"). Sam + the Clean Crew.

export type Step = { emoji: string; say: string };

// 1 · Wash Up! — when and how to wash; germs wash happily away.
export const WASH_UP: Step[] = [
  { emoji: "🍽️", say: "Wash your hands before you eat." },
  { emoji: "🚽", say: "Wash your hands after the toilet." },
  { emoji: "🤧", say: "Wash after play, and after a sneeze." },
  { emoji: "🫧", say: "Scrub with soap and water — germs wash happily away!" },
];

// 2 · Sparkle Smile — brushing teeth + gentle hygiene & tidiness.
export const SPARKLE: Step[] = [
  { emoji: "🪥", say: "Brush your teeth in the morning and at night." },
  { emoji: "😁", say: "Little circles, all around — sparkle smile!" },
  { emoji: "💇", say: "Comb your hair, neat and tidy." },
  { emoji: "🧻", say: "Stay clean and tidy after the toilet." },
];

// 3 · Daily Routine (the heart) — do the morning routine, step by step, in order.
export const ROUTINE: { emoji: string; step: string }[] = [
  { emoji: "☀️", step: "Wake up" },
  { emoji: "🚽", step: "Use the toilet" },
  { emoji: "🧼", step: "Wash hands & face" },
  { emoji: "🪥", step: "Brush your teeth" },
  { emoji: "🍳", step: "Eat a good breakfast" },
  { emoji: "💧", step: "Drink some water" },
];
export const ROUTINE_DONE = "Routine done — what a star! The whole Clean Crew is cheering!";

// 4 · Healthy Me — simple healthy habits.
export const HEALTHY: Step[] = [
  { emoji: "😴", say: "Get plenty of sleep." },
  { emoji: "🥗", say: "Eat colourful, healthy food." },
  { emoji: "💧", say: "Drink water through the day." },
  { emoji: "🤸", say: "Play and move — and rest when you're tired." },
];

// 5 · I Can Do It! (+ Grown-up Together) — celebrate doing it yourself; a warm co-play moment.
export const I_CAN: Step[] = [
  { emoji: "💪", say: "I can wash my own hands!" },
  { emoji: "🦷", say: "I can brush my own teeth!" },
  { emoji: "🌟", say: "I did it all by myself!" },
  { emoji: "🫶", say: "Do it together with a grown-up today!" },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Meet the Clean Crew! Let's wash, brush and look after your body — with a big happy splash!",
  home: "Which one next?",
  washUp: "Wash up! Tap each one.",
  sparkle: "Sparkle smile! Tap each one.",
  routine: "Let's do your morning routine — one happy step at a time!",
  healthy: "Healthy me! Tap each one.",
  iCan: "You can do it! Tap each one.",
  badge: "Sticker earned! Look at your chart!",
  complete: "You're a Clean Crew star — washing, brushing and caring for your body every day! 🫧",
};
