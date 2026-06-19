// Friend or Frenemy? (node #9, ages 6–9) — the Relationships thread's first "is this healthy?" game,
// the child-level seed of Green Light / Red Light. Reading-light, no-fail. Branching friend stories,
// a Words Toolbox, peer-pressure (the UN & RE beat) and conflict repair. BEHAVIOURS, never labels.

export type Choice = { label: string; friend: boolean; result: string };
export type Story = { situation: string; emoji: string; choices: Choice[] };
export const STORIES: Story[] = [
  {
    situation: "Your group won't let the new kid play.",
    emoji: "🛝",
    choices: [
      { label: "“Come and play with us!”", friend: true, result: "You included them — that's what a true friend does! 💛" },
      { label: "Go along and leave them out", friend: false, result: "That left someone out. A true friend includes others. Want to try again?" },
    ],
  },
  {
    situation: "Your best friend made a new friend, and you feel left out.",
    emoji: "😔",
    choices: [
      { label: "“I feel left out when that happens.”", friend: true, result: "You used your words — brave and kind! Friends can have other friends too." },
      { label: "Give them the cold shoulder", friend: false, result: "That made it worse. Telling them how you feel works better. Try again?" },
    ],
  },
  {
    situation: "A friend dares you to be mean to someone.",
    emoji: "😬",
    choices: [
      { label: "“No, I don't want to.”", friend: true, result: "You stood up for kindness — a true friend won't dare you to be mean!" },
      { label: "Do the dare to fit in", friend: false, result: "That hurt someone. A true friend respects your 'no'. Try again?" },
    ],
  },
];

export type Tool = { emoji: string; line: string };
export const WORDS: Tool[] = [
  { emoji: "💬", line: "I feel left out when…" },
  { emoji: "✋", line: "No, I don't want to." },
  { emoji: "🙇", line: "I'm sorry, I was wrong." },
  { emoji: "🙋", line: "Can I join in?" },
];

export type PressureStory = { situation: string; emoji: string; choices: { label: string; ok: boolean; result: string }[] };
export const PRESSURE: PressureStory[] = [
  {
    situation: "Your friends want you to skip class with them.",
    emoji: "🏫",
    choices: [
      { label: "“No, I don't want to.”", ok: true, result: "A true friend respects that. Well done!" },
      { label: "“Let's do something fun at break instead!”", ok: true, result: "Great — you suggested something else!" },
      { label: "Go along, even though you don't want to", ok: false, result: "You didn't really want to. Real friends respect your no." },
    ],
  },
  {
    situation: "A friend pressures you to leave someone out of the game.",
    emoji: "🎮",
    choices: [
      { label: "“No — let's all play together.”", ok: true, result: "Kind and brave — everyone gets to play!" },
      { label: "Leave them out to keep your friend happy", ok: false, result: "That left someone out. A true friend wouldn't ask you to." },
    ],
  },
];
export const PRESSURE_UN = "Lots of people feel they have to say yes to keep friends — that's an old idea, and it's not your fault for feeling it. Let's rub it out.";
export const PRESSURE_RE = "Real friends respect your no. You can say no and still keep a true friend — or suggest something else.";

export const MAKE_IT_RIGHT = [
  { emoji: "👂", label: "Listen to each other", say: "First, listen to how each friend feels." },
  { emoji: "🙇", label: "Say sorry", say: "Say sorry for your part." },
  { emoji: "🤝", label: "Find a fair fix", say: "Find a fair fix together — friends again!" },
];

export const GOOD_FRIEND_TAGS = [
  { emoji: "🤝", label: "Shares" }, { emoji: "🫂", label: "Includes you" }, { emoji: "🎉", label: "Happy for you" },
  { emoji: "🙇", label: "Says sorry" }, { emoji: "✋", label: "Respects your no" }, { emoji: "💛", label: "Is kind" },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Let's play some friend stories! What would you do?",
  home: "Which story next?",
  stories: "What would you do?",
  words: "Collect your friendship words — tap to say each one!",
  pressure: "A tricky moment with friends…",
  makeRight: "Two friends fell out. Help them make up — tap each step!",
  makeRightDone: "You helped them make up — that's a real friendship skill!",
  check: "What makes a good friend? Pick the ones you think matter.",
  checkDone: "That's what makes a good friend — and YOU can be one! If a friend ever makes you feel bad or unsafe, you can tell a trusted adult.",
  badge: "Friendship badge earned!",
  complete: "Be the friend you'd want — and know you deserve good friends too. 🤝",
};
