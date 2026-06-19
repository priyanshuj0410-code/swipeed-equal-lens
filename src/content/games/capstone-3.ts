// Capstone 3 — "Growing Up Smart" (node c3): the Chapter 3 (ages 9–12) graduation. Not a new lesson —
// a warm, no-fail celebration where Sam helps the child look back at the chapter's eight big ideas
// (Puberty Quest → Defenders of the Body), lighting a star for each, then awards the chapter. Mirrors
// Capstones 1 & 2.

export type Recap = { emoji: string; idea: string; sam: string };

// One big idea per Chapter-3 game (g13 → g20), in order.
export const RECAP: Recap[] = [
  { emoji: "🌱", idea: "Every body changes — and that's normal. I've got the facts!", sam: "You busted the puberty myths." },
  { emoji: "🧬", idea: "I know the amazing science of how a new life begins.", sam: "You took the whole amazing journey." },
  { emoji: "🤖", idea: "I ask first, respect a no, and stay safe online.", sam: "You became a Boundary hero." },
  { emoji: "🔀", idea: "At every crossroads, I choose who I'm becoming.", sam: "You navigated a whole week of choices." },
  { emoji: "🎬", idea: "I spot the stereotype and flip the script — fair and real!", sam: "You became a media editor." },
  { emoji: "🌪️", idea: "I keep the good traditions and question the harmful ones.", sam: "You calmed the Norm Storm." },
  { emoji: "📣", idea: "I spot harm, respond safely, and find help — it's never my fault.", sam: "You learned to speak up." },
  { emoji: "🦠", idea: "I stay healthy, bust the myths, and choose care, not fear.", sam: "You defended the body." },
];

export const SAM = {
  greet: "Look how much you've grown! Let's light a star for each big idea. Tap one!",
  more: "Yes! Tap another star.",
  graduate: "You did it! Chapter Three complete — you're Growing Up Smart!",
  complete: "Graduation day! You're growing up smart, safe and kind. On to the next adventure. 🎓",
};
