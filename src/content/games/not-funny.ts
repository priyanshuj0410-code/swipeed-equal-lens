// "Not Fair, Not Funny" — ages 6–9, UNESCO topic 3.3 (gender-based teasing → being an ally).
// Choose-the-action. A short scene of gender-based teasing/exclusion; the child chooses to
// laugh along, ignore, or speak up & include. Being an ally is celebrated and gives a phrase
// to keep; the unfair options get a gentle, non-shaming outcome and a chance to choose again.
// The last scene teaches the "if it keeps happening, tell a trusted adult / Childline 1098"
// route. No graphic content; always ends on a helpful, kind note.

export type Choice = {
  label: string;
  ally: boolean;
  outcome: string;
  phrase?: string; // ally phrase to keep
  help?: string; // trusted-adult / helpline route
};

export type Scene = { scene: string; emoji: string; choices: Choice[] };

export const SCENES: Scene[] = [
  {
    scene: "They won't let Meena play cricket because she's a girl.",
    emoji: "🏏",
    choices: [
      { label: "Laugh along", ally: false, outcome: "That can make Meena feel left out." },
      { label: "Walk away", ally: false, outcome: "Walking away leaves Meena on her own." },
      { label: "Speak up & include her", ally: true, outcome: "You included Meena!", phrase: "“Let her play — she's good!”" },
    ],
  },
  {
    scene: "A boy is teased: “You cry like a girl!”",
    emoji: "😢",
    choices: [
      { label: "Join the teasing", ally: false, outcome: "Teasing really hurts." },
      { label: "Say nothing", ally: false, outcome: "Saying nothing lets it carry on." },
      { label: "Stand up for him", ally: true, outcome: "You stood up for your friend!", phrase: "“Anyone can cry.”" },
    ],
  },
  {
    scene: "Some boys laugh at Arjun and say cooking is “only for girls”.",
    emoji: "🍳",
    choices: [
      { label: "Laugh too", ally: false, outcome: "That's not fair to Arjun." },
      { label: "Ignore it", ally: false, outcome: "Arjun still feels bad." },
      { label: "Back him up", ally: true, outcome: "You backed up Arjun!", phrase: "“Cooking is for everyone!”" },
    ],
  },
  {
    scene: "Some kids keep teasing Priya every single day. It won't stop.",
    emoji: "🛡️",
    choices: [
      { label: "Hope it stops on its own", ally: false, outcome: "It keeps happening — Priya needs help." },
      { label: "Tease them back", ally: false, outcome: "Two unfair things don't make it fair." },
      {
        label: "Tell a trusted adult",
        ally: true,
        outcome: "You found help for Priya!",
        phrase: "“Let's tell a teacher.”",
        help: "If teasing won't stop, a grown-up can help — or call Childline 1098.",
      },
    ],
  },
];
