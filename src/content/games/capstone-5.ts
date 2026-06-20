// Capstone 5 — "Ready for the World" (node c5): the Chapter 5 (ages 15–18) graduation AND the final
// graduation of the whole 15-year journey. Not a new lesson — a warm, no-fail celebration where Sam (now
// fully grown) recaps the chapter's nine big ideas (My Choices → Decoded), lighting a star for each, then
// awards the entire journey. Mirrors Capstones 1–4, with an extra finale beat.

export type Recap = { emoji: string; idea: string; sam: string };

// One big idea per Chapter-5 game, in play order.
export const RECAP: Recap[] = [
  { emoji: "🧭", idea: "Whether, when and how — these choices are mine, made with full information.", sam: "You owned your choices and your future." },
  { emoji: "🩺", idea: "Knowing my status is power — I own my health, with dignity for all.", sam: "You learned to know your status." },
  { emoji: "💚", idea: "Consent is an enthusiastic, mutual, ongoing yes.", sam: "You learned what mutual respect really means." },
  { emoji: "🌈", idea: "Everyone deserves dignity, respect and safety — no exceptions.", sam: "You stood for dignity across the spectrum." },
  { emoji: "💼", idea: "I can lead change with vision and fairness.", sam: "You learned to lead the way." },
  { emoji: "🌍", idea: "I can run a campaign and move the world.", sam: "You became a change maker." },
  { emoji: "🏛️", idea: "I know my rights and how justice works.", sam: "You joined the justice league." },
  { emoji: "🌅", idea: "I know myself, decide on purpose, handle the big stuff — and never face it alone.", sam: "You're Life Ready." },
  { emoji: "🔓", idea: "I can decode the feed, the message, and myself.", sam: "You decoded it all." },
];

export const SAM = {
  greet: "This is it — the final chapter. We've grown up together. Let's light a star for each big idea. Tap one!",
  more: "Yes! Tap another star.",
  graduate: "You did it! Chapter Five complete — and the whole journey too. You're ready for the world.",
  complete: "Graduation day! From your very first feeling to decoding the world — you've grown wise, kind and brave. Go change it. 🎓🌟",
};
