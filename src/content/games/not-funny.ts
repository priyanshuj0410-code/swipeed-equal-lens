// Not Fair, Not Funny (node #11, ages 6–9) — the gentlest first step of the GBV/ally thread.
// Reading-light, no-fail. Spot gender teasing, learn "if it hurts, it's not a joke" (UN & RE), and be a
// SAFE ally (speak up kindly · include · tell — never escalate). Even-handed: boys are teased too.

export type Choice = { label: string; ally: boolean; result: string };
export type Scene = { situation: string; emoji: string; choices: Choice[] };
export const SCENES: Scene[] = [
  {
    situation: "“She can't play cricket — she's a girl!”",
    emoji: "🏏",
    choices: [
      { label: "“Let her play — she's good! Come on, Meena.”", ally: true, result: "You stood up kindly — Meena gets to play! 🌟" },
      { label: "Laugh along", ally: false, result: "That left Meena out. An ally would include her. Try again?" },
    ],
  },
  {
    situation: "A boy is teased: “You cry like a girl!”",
    emoji: "😢",
    choices: [
      { label: "“Anyone can cry. Leave him alone.”", ally: true, result: "Brave and kind — feelings are for everyone!" },
      { label: "Ignore it", ally: false, result: "He still felt hurt. Speaking up kindly helps. Try again?" },
    ],
  },
  {
    situation: "A boy is teased for dancing.",
    emoji: "💃",
    choices: [
      { label: "“Dancing's great — let's join in!”", ally: true, result: "You warmed the whole scene — anyone can dance!" },
      { label: "Laugh along", ally: false, result: "That wasn't fair. An ally stands up. Try again?" },
    ],
  },
];

// Just a Joke? — the deflection, busted with UN & RE (even-handed: 'boys will be boys' too).
export const JOKE = {
  deflection: "“It's just a joke — can't you take a joke?”",
  un: "Lots of people say teasing is just a joke — that's an old idea, and it's not your fault for hearing it. Let's rub it out.",
  re: "A joke is funny for everyone. If it hurts the person it's about, it's not funny — it's not fair.",
};

// Be an Ally — the safe three-step + the Comeback Kit of kind, brave phrases.
export const ALLY_STEPS = [
  { emoji: "🗣️", label: "Speak up kindly", say: "Speak up kindly: “Hey, that's not fair.”" },
  { emoji: "🤝", label: "Include the person", say: "Include them: “Come play with us!”" },
  { emoji: "🧑‍🏫", label: "Tell a trusted adult if it keeps happening", say: "If it keeps happening, tell a trusted adult." },
];
export const COMEBACK_KIT = [
  { emoji: "✋", line: "That's not fair." },
  { emoji: "🙅", line: "Not funny." },
  { emoji: "🌟", line: "Anyone can." },
  { emoji: "🤗", line: "Come play with us." },
  { emoji: "🛡️", line: "Leave them alone." },
  { emoji: "🧑‍🏫", line: "Let's tell a grown-up." },
];

// How Would You Feel? — the scene from the teased child's side (empathy).
export const FEEL = [
  { emoji: "😔", say: "When they tease me, I feel sad and left out." },
  { emoji: "🙏", say: "I just want to play too." },
  { emoji: "💛", say: "One kind word would help so much." },
];

// Stand Tall — if you're the one being teased.
export const STAND_TALL = [
  { emoji: "💛", say: "Being teased is never your fault." },
  { emoji: "🌟", say: "A tease doesn't decide your worth." },
  { emoji: "🚶", say: "You can walk away." },
  { emoji: "🗣️", say: "You can always tell a trusted adult — and keep telling until someone helps. Childline 1098." },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "When someone's teased, what do you do? Let's find out!",
  home: "Which one next?",
  scenes: "What would an ally do?",
  joke: "“Just a joke”? Let's bust that with UN and RE.",
  ally: "Be an ally! Collect your Comeback Kit — tap each kind phrase.",
  feel: "How does it feel to be teased? Tap to find out.",
  standTall: "If someone teases YOU…",
  badge: "Ally badge earned!",
  complete: "You're an ally — you stand up, kindly and bravely. Not fair, not funny! 🦸",
};
