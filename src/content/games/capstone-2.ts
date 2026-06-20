// Capstone 2 — "Fair & Safe Explorer" (node c2): the Chapter 2 (ages 6–9) graduation. Not a new lesson —
// a warm, no-fail celebration where Sam helps the child look back at the eight big ideas they learned
// across the chapter (Body Lab Juniors → Smart Screen Heroes), lighting a star for each, then awards the
// chapter. Audio-first, co-played. Mirrors Capstone 1.

export type Recap = { emoji: string; idea: string; sam: string };

// One big idea per Chapter-2 game, in play order.
export const RECAP: Recap[] = [
  { emoji: "🧪", idea: "Every body is amazing — and every skin is good!", sam: "You explored how bodies work, and learned every skin is good." },
  { emoji: "🪞", idea: "Boy or girl, I can like anything — those 'rules' are made up!", sam: "You learned that gender 'rules' are just made up." },
  { emoji: "🦺", idea: "I know safe from unsafe — and I tell a grown-up I trust.", sam: "You became a Safety Squad hero." },
  { emoji: "🤝", idea: "A true friend is kind — and I know the difference!", sam: "You learned what makes a real friend." },
  { emoji: "💗", idea: "I notice feelings, calm the big ones, and get along!", sam: "You grew Heart Smart." },
  { emoji: "⚖️", idea: "Everyone shares; every child deserves the same chances!", sam: "You made your world fair." },
  { emoji: "🙅", idea: "If it hurts, it's not a joke — I stand up, kindly!", sam: "You became an ally." },
  { emoji: "📱", idea: "Real or pretend? I think for myself, stay healthy, and am kind!", sam: "You became a Smart Screen Hero." },
];

export const SAM = {
  greet: "Look how much you've learned! Let's light a star for each big idea. Tap one!",
  more: "Yes! Tap another star.",
  graduate: "You did it! Chapter Two complete — you're a Fair & Safe Explorer!",
  complete: "Graduation day! You're ready for the next adventure. 🎓",
};
