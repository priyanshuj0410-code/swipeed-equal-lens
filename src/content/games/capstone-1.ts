// Capstone 1 — "My First Friends" (node c1): the Chapter 1 (ages 3–6) graduation. Not a new lesson —
// a warm, no-fail celebration where Sam helps the child look back at the six big ideas they learned
// across the chapter, lighting a star for each, then awards the chapter. Audio-first, co-played.

export type Recap = { emoji: string; idea: string; sam: string };

// One big idea per Chapter-1 game (Feelings Friends → Can-Do Kids), in order.
export const RECAP: Recap[] = [
  { emoji: "😊", idea: "I can name how I feel!", sam: "You learned to name your big feelings." },
  { emoji: "🛡️", idea: "My body is mine — I can say a big NO!", sam: "You learned your body belongs to you." },
  { emoji: "🫧", idea: "I wash, brush and take care of my body every day!", sam: "You joined the Clean Crew." },
  { emoji: "🌷", idea: "Every family is special, and kindness grows!", sam: "You grew a whole garden of kindness." },
  { emoji: "🌈", idea: "Same inside, different outside — wonderful!", sam: "You found what makes us all friends." },
  { emoji: "🌟", idea: "Anyone can be anything — and so can I!", sam: "You learned that anyone can do anything." },
];

export const SAM = {
  greet: "You've come so far! Let's look back at everything you learned. Tap a star!",
  more: "Yes! Tap another star.",
  graduate: "You did it! Chapter One complete!",
  complete: "Graduation day! You're ready for the next adventure. 🎓",
};
