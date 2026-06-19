// "Fair Play World" — ages 6–9, UNESCO topic 3.2 (equality & stereotypes).
// Tap-to-assign (button alternative to drag). For each task the player chooses who does
// it; fair / stereotype-breaking choices raise a Fairness Meter, biased ones get a gentle
// non-shaming nudge (no fail). Some tasks reveal a Rights Card. India adaptation: shared
// care-work, girls' education and play — son-preference and unpaid care work, in the
// spirit of Beti Bachao, Beti Padhao.

export type FairOption = { emoji: string; label: string; fair: boolean; nudge?: string };
export type FairTask = {
  q: string;
  emoji: string;
  options: FairOption[];
  cheer: string; // shown on a fair choice
  right?: string; // optional Rights Card reveal
};

export const TASKS: FairTask[] = [
  {
    q: "Who cooks dinner?",
    emoji: "🍳",
    options: [
      { emoji: "👩", label: "Only Ma", fair: false, nudge: "Only Ma cooks? Let's share! 💛" },
      { emoji: "👨", label: "Papa cooks", fair: true },
      { emoji: "🧑‍🤝‍🧑", label: "Share it", fair: true },
    ],
    cheer: "Cooking is for everyone!",
  },
  {
    q: "Who fixes the fan?",
    emoji: "🔧",
    options: [
      { emoji: "👨", label: "Only Papa", fair: false, nudge: "Didi can fix things too!" },
      { emoji: "👧", label: "Didi fixes it", fair: true },
      { emoji: "🧑‍🤝‍🧑", label: "Share it", fair: true },
    ],
    cheer: "Girls can fix things!",
  },
  {
    q: "Who goes to school?",
    emoji: "📚",
    options: [
      { emoji: "👦", label: "Only the boy", fair: false, nudge: "Every child has the right to school!" },
      { emoji: "👧", label: "Only the girl", fair: false, nudge: "Every child has the right to school!" },
      { emoji: "👧👦", label: "Both children", fair: true },
    ],
    cheer: "Both go to school!",
    right: "Every child has the right to go to school.",
  },
  {
    q: "Who plays cricket?",
    emoji: "🏏",
    options: [
      { emoji: "👦", label: "Only boys", fair: false, nudge: "Girls can play cricket too!" },
      { emoji: "👧", label: "Girls play too", fair: true },
      { emoji: "👧👦", label: "Everyone", fair: true },
    ],
    cheer: "Everyone can play!",
    right: "Every child has the right to rest and play.",
  },
  {
    q: "Who cleans up?",
    emoji: "🧹",
    options: [
      { emoji: "👧", label: "Only Didi", fair: false, nudge: "Let's all help clean! 💛" },
      { emoji: "👦", label: "Bhai helps", fair: true },
      { emoji: "🧑‍🤝‍🧑", label: "Share it", fair: true },
    ],
    cheer: "We all help at home!",
  },
  {
    q: "Who can lead the team?",
    emoji: "🧭",
    options: [
      { emoji: "👦", label: "Only boys", fair: false, nudge: "Girls can lead too!" },
      { emoji: "👧", label: "A girl leads", fair: true },
      { emoji: "👧👦", label: "Anyone", fair: true },
    ],
    cheer: "Anyone can lead!",
  },
];
