// Mind Matters (node #g38, play order 17, ages 9–12) — Chapter 3, Thread C (Feelings & Life Skills).
// "All feelings are okay — even the hard ones. Name them, cool them down, bounce back, and know it's OK
// to ask for help." Grows Feelings Friends (#g01) into the bigger pre-teen emotions; follows Puberty
// Quest (#g13). Wellbeing-sensitive: HEALTHY COPING ONLY, never reinforces self-criticism, anti-stigma,
// routes distress to real help. UN & RE do their gentlest work here, on the myths that keep kids silent.
// Sam returns as an older child. See GDD 38.

export type Step = { emoji: string; say: string };

// 1 · Name It to Tame It — recognising & naming feelings; all of them are normal and allowed.
export const FEELINGS: Step[] = [
  { emoji: "😟", say: "Nervous is normal — it just means something matters to you." },
  { emoji: "😠", say: "Angry is okay — it's telling you something feels unfair." },
  { emoji: "😢", say: "Sad is allowed — it's part of being human, and it passes." },
  { emoji: "😳", say: "Embarrassed happens to everyone — and it fades fast." },
  { emoji: "😔", say: "Lonely is a signal — a nudge to reach out to someone." },
  { emoji: "🌪️", say: "Overwhelmed means slow down and take one small step." },
  { emoji: "😤", say: "Jealous is honest — it shows you what you care about." },
  { emoji: "🌟", say: "Hopeful counts too — hold on to it. Naming a feeling already calms it." },
];

// 2 · Cool-Down Toolkit — build a kit of healthy strategies (only safe, kind ones).
export const TOOLKIT: Step[] = [
  { emoji: "🌬️", say: "Slow breathing: breathe in slow… and out slower. The storm settles." },
  { emoji: "👀", say: "Grounding: name five things you can see. You're here, you're okay." },
  { emoji: "💬", say: "Talk to someone you trust — saying it out loud takes the weight off." },
  { emoji: "🏃", say: "Move your body or step outside — feelings shift when you do." },
  { emoji: "⏸️", say: "Take a break. You're allowed to pause and come back to it." },
  { emoji: "💛", say: "Be kind to yourself — talk to you like you would to a good friend." },
];

// 3 · Bounce-Back Lab — handle a setback with resilience & self-kindness. Pick the kind, true thought.
export type Setback = { emoji: string; setback: string; thoughts: { text: string; kind: boolean }[]; reason: string };
export const SETBACKS: Setback[] = [
  {
    emoji: "📝", setback: "You failed a test you studied for.",
    thoughts: [
      { text: "One test isn't the whole story — I can learn from it and try again.", kind: true },
      { text: "I'm just stupid and always will be.", kind: false },
      { text: "I'm never doing this subject again.", kind: false },
    ],
    reason: "A setback isn't a verdict on you. Learning means getting it wrong sometimes.",
  },
  {
    emoji: "🎉", setback: "Your friends went out and didn't invite you.",
    thoughts: [
      { text: "Nobody likes me.", kind: false },
      { text: "That stings — and it doesn't mean I'm unlikable. I'll ask them about it.", kind: true },
      { text: "I'll never speak to them again.", kind: false },
    ],
    reason: "Feelings are real and they're not the final truth. Kindness — to you and them — helps.",
  },
  {
    emoji: "⚽", setback: "You didn't make the team this time.",
    thoughts: [
      { text: "I'm a total failure.", kind: false },
      { text: "I'm disappointed — and I can practise and try again next time.", kind: true },
      { text: "I should just give up everything.", kind: false },
    ],
    reason: "You can improve with practice. Disappointment is allowed; it doesn't define you.",
  },
  {
    emoji: "😬", setback: "You made a mistake in front of the whole class.",
    thoughts: [
      { text: "Everyone makes mistakes — this won't matter next week.", kind: true },
      { text: "Everyone will remember this forever.", kind: false },
      { text: "I can never show my face again.", kind: false },
    ],
    reason: "Bad moments pass. Being kind to yourself is how you bounce back.",
  },
];
export const SETBACK_MISS = "That one's a bit harsh on yourself. Which thought is kind AND true?";

// 4 · Mind Myths Busted — the UN & RE beat. Stigma is what keeps kids silent; this is the key unlearn.
export type Myth = { un: string; re: string };
export const MYTHS: Myth[] = [
  { un: "Strong people — or boys — don't get sad.", re: "Everyone has feelings, including hard ones. That's being human, not being weak." },
  { un: "Being stressed or anxious means you're weak.", re: "Stress and worry are normal — they're not weakness." },
  { un: "Just snap out of it.", re: "Feelings aren't a switch. Kind strategies and a little time are what help." },
  { un: "Asking for help is embarrassing.", re: "Reaching out is one of the bravest, smartest things a person can do." },
  { un: "A bad day means a bad me.", re: "A setback isn't a verdict on you — and bad days pass." },
];

// 5 · Reach Out — when & how to ask for help, and how to support a friend. Help is real and one tap away.
export const REACH: Step[] = [
  { emoji: "🌧️", say: "Sadness or worry that won't lift is a sign to tell a grown-up." },
  { emoji: "🆘", say: "Anything scary, or too big to handle alone — tell someone you trust." },
  { emoji: "🧑‍🏫", say: "Who? A parent, a teacher, a school counsellor — or a helpline." },
  { emoji: "💬", say: "How to start: 'Can we talk? I've been feeling…' That's enough." },
  { emoji: "👂", say: "If a friend is struggling: listen, be kind, and tell a trusted adult." },
  { emoji: "☎️", say: "Help is real: Childline 1098 · Tele-MANAS 14416 · KIRAN 1800-599-0019." },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Hey — it's Sam. All feelings are okay here, even the hard ones. Let's build your toolkit.",
  home: "Which one next? Take your time.",
  name: "Name It to Tame It. Tap each feeling — naming it already helps.",
  cool: "Cool-Down Toolkit. Tap each tool to add it to your kit.",
  bounce: "Bounce-Back Lab. Pick the thought that's kind AND true.",
  myths: "Mind Myths. Let's gently bust the ones that keep people silent.",
  reach: "Reach Out. When feelings get big, you never have to carry them alone.",
  badge: "Skill earned! Look at your toolkit growing.",
  complete: "You can name a feeling, cool it down, bounce back, and ask for help. That's real strength. 💛",
};
