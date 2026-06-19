// Crossroads (node #16, ages 9–12) — the Relationships step of Chapter 3. Grows Friend or Frenemy?'s
// friendship stories into a branching life-sim of a pre-teen's WEEK: peer pressure, a first crush, a
// falling-out, a family change. Each choice moves a Trust meter and a Wellbeing meter; Sam debriefs the
// skills used. No-fail, replayable, no single "right" answer — just wiser, kinder paths. Crushes are
// normalised, never pushed toward dating (UN & RE at Crush Corner).

export type Choice = { label: string; trust: number; well: number; result: string; wise?: boolean; skill?: string };
export type Crossroad = { day: string; emoji: string; situation: string; situationSoft?: string; crushBeat?: boolean; choices: Choice[] };

export const WEEK: Crossroad[] = [
  {
    day: "Monday", emoji: "🏃",
    situation: "Your friends dare you to skip class with them.",
    choices: [
      { label: "Go along with the dare", trust: -10, well: -5, result: "You skipped — and felt uneasy. Later, trust dipped." },
      { label: "Say “No, thanks”", trust: +10, well: +5, result: "You said no. A little awkward, but you respected yourself.", wise: true, skill: "Refusing pressure" },
      { label: "Suggest something else fun", trust: +10, well: +10, result: "You offered another plan — everyone won. Nice!", wise: true, skill: "Win-win ideas" },
    ],
  },
  {
    day: "Tuesday", emoji: "💗",
    situation: "You realise you have a crush on a classmate.",
    situationSoft: "You realise you really admire a classmate.",
    crushBeat: true,
    choices: [
      { label: "Tease yourself about it", trust: 0, well: -10, result: "Being hard on yourself just feels bad." },
      { label: "Tell everyone / act on it right away", trust: -5, well: -5, result: "Rushing it made things awkward." },
      { label: "Let the feeling be; focus on growing up", trust: +5, well: +10, result: "You let it be — calm and kind to yourself.", wise: true, skill: "Respecting feelings" },
    ],
  },
  {
    day: "Wednesday", emoji: "🤝",
    situation: "Your best friend made a new friend, and you feel left out.",
    choices: [
      { label: "Sulk and ignore them", trust: -5, well: -10, result: "Sulking left you both unhappy." },
      { label: "Spread a rumour", trust: -15, well: -5, result: "That hurt people — and your trust. A frenemy move." },
      { label: "“Can we talk? I felt left out.”", trust: +10, well: +10, result: "You used your words — trust grew.", wise: true, skill: "Using your words" },
    ],
  },
  {
    day: "Thursday", emoji: "🏠",
    situation: "Your parents have been arguing a lot at home.",
    choices: [
      { label: "Bottle it all up", trust: 0, well: -10, result: "Keeping it in felt heavy." },
      { label: "Take it out on others", trust: -10, well: -5, result: "That just spread the hurt around." },
      { label: "Talk to a trusted adult", trust: +5, well: +15, result: "Sharing it helped you feel lighter.", wise: true, skill: "Asking for help" },
    ],
  },
  {
    day: "Friday", emoji: "📱",
    situation: "A group is teasing someone in the class chat.",
    choices: [
      { label: "Join in", trust: -15, well: -5, result: "Piling on hurt someone — and your trust." },
      { label: "Ignore it", trust: 0, well: -5, result: "Ignoring it let the teasing carry on." },
      { label: "Be an ally — support them and report it", trust: +15, well: +10, result: "You stood up kindly. Hero move!", wise: true, skill: "Being an ally" },
    ],
  },
];

export const CRUSH_UN = "Lots of kids think a crush is embarrassing or wrong — it isn't, and it's not your fault for feeling that way. Let's rub it out.";
export const CRUSH_RE = "A crush is a normal part of growing up. You don't have to act on it — just respect yourself and the other person.";

// Stop–Think–Choose — the simple decision tool shown at each crossroad.
export const STOP_THINK_CHOOSE = "✋ Stop · 🤔 Think (what could happen?) · ✅ Choose the kind, wise move";

export const START_TRUST = 50;
export const START_WELL = 50;

export const SAM = {
  greet: "Live a pre-teen's week with me. Every crossroads is a chance to choose who you're becoming. Ready?",
  crushBusted: "Feelings are okay — you can simply let them be.",
  debrief: "That's your week! There's no single right answer — just wiser, kinder paths. Here's what you did.",
  complete: "Every crossroads is a chance to choose who you're becoming. Beautifully played. 🔀",
};
