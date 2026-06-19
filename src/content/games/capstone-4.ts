// Capstone 4 — "Reading Relationships" (node c4): the Chapter 4 (ages 12–15) graduation. Not a new
// lesson — a warm, no-fail celebration where Sam recaps the chapter's eight big ideas (Body Confident →
// Reality Check), lighting a star for each, then awards the chapter. Mirrors Capstones 1–3.

export type Recap = { emoji: string; idea: string; sam: string };

// One big idea per Chapter-4 game (g21 → g28), in order.
export const RECAP: Recap[] = [
  { emoji: "💪", idea: "My body is mine and it's good — I spot the filters.", sam: "You got Body Confident." },
  { emoji: "🗓️", idea: "I know how pregnancy happens — and how planning protects my future.", sam: "You learned to Plan It." },
  { emoji: "🧫", idea: "Knowledge stops the spread — and stigma is the real enemy.", sam: "You stopped the Outbreak." },
  { emoji: "🚦", idea: "I can read the green and red flags in a relationship.", sam: "You read the green and red lights." },
  { emoji: "💡", idea: "Gender stereotypes are myths — I bust them.", sam: "You busted the gender myths." },
  { emoji: "🟰", idea: "Equality lifts everyone — I help close the gap.", sam: "You learned to Equalize." },
  { emoji: "✊", idea: "When I see harm, I step in safely.", sam: "You learned to Stand Up." },
  { emoji: "🔍", idea: "I spot what's real, staged, or fake online.", sam: "You did the Reality Check." },
];

export const SAM = {
  greet: "You've learned to read yourself, others and the world. Let's light a star for each big idea. Tap one!",
  more: "Yes! Tap another star.",
  graduate: "You did it! Chapter Four complete — you can read relationships!",
  complete: "Graduation day! You read yourself, others and the feed with clear eyes. On to the final chapter. 🎓",
};
