// Bounce (node #g39, play order 27, ages 12–15) — Chapter 4, Thread C (Feelings & Life Skills).
// "Stress, setbacks and low days are part of life — and you can build the skills to handle them, be kind
// to yourself, support your friends, and know when to get help." The teen step up from Mind Matters
// (#g38); sits beside Body Confident (#g21). HIGHEST-CARE wellbeing: healthy coping ONLY, crisis routing
// first, never reinforces self-criticism, not therapy. Sam returns as a teen peer. See GDD 39.

export type Step = { emoji: string; say: string };

// 1 · Stress Signals — spot stress/anxiety/low mood; tell a normal hard patch from a sign to get help.
export const SIGNALS: Step[] = [
  { emoji: "🧠", say: "Racing thoughts you can't switch off — that's stress talking." },
  { emoji: "😮‍💨", say: "A tight chest or a knot in your stomach — your body feeling the pressure." },
  { emoji: "😴", say: "Sleeping badly, or sleeping all the time — a signal worth noticing." },
  { emoji: "😶", say: "Pulling away from people you usually like — a quiet sign to check in with yourself." },
  { emoji: "😤", say: "Snapping at small things — irritability is often stress underneath." },
  { emoji: "🚩", say: "Low mood that won't lift, or anything frightening — that's a sign to get help today." },
];

// 2 · The Resilience Toolkit — build a kit of healthy coping & resilience skills (only safe, kind ones).
export const TOOLKIT: Step[] = [
  { emoji: "🔄", say: "Reframe the thought — is there a kinder, truer way to see this?" },
  { emoji: "🪜", say: "Break it into steps — one small thing at a time beats one big panic." },
  { emoji: "🌬️", say: "Slow breathing and grounding — settle the body first, then the mind." },
  { emoji: "😴", say: "Protect your sleep — it's the foundation everything else sits on." },
  { emoji: "🏃", say: "Move your body — even a short walk shifts a mood." },
  { emoji: "🫂", say: "Stay connected — reach out to people; don't isolate." },
  { emoji: "📵", say: "Take a break from the feed — it's a highlight reel, not real life." },
  { emoji: "💚", say: "Be kind to yourself — talk to you like you would a good friend." },
];

// 3 · Bounce (the signature) — get back up after a real setback. Pick the kind, true, self-compassionate thought.
export type Setback = { emoji: string; setback: string; thoughts: { text: string; kind: boolean }[]; reason: string };
export const SETBACKS: Setback[] = [
  {
    emoji: "📄", setback: "You failed an exam that really mattered to you.",
    thoughts: [
      { text: "This is a setback, not a verdict on me — I can work out the next step.", kind: true },
      { text: "I've ruined my whole future.", kind: false },
      { text: "I'm just a failure and always will be.", kind: false },
    ],
    reason: "A setback is information, not a verdict. You can regroup — sometimes with help.",
  },
  {
    emoji: "💔", setback: "Someone you liked turned you down.",
    thoughts: [
      { text: "No one will ever want me.", kind: false },
      { text: "It stings — and it doesn't mean I'm unlovable. The right people will get me.", kind: true },
      { text: "I should never put myself out there again.", kind: false },
    ],
    reason: "Rejection hurts and it isn't a measure of your worth. Be as kind to you as you'd be to a friend.",
  },
  {
    emoji: "👥", setback: "You had a big falling-out with a close friend.",
    thoughts: [
      { text: "I'm impossible to be around.", kind: false },
      { text: "Conflict happens — I can cool off, try to repair it, and I'll be okay either way.", kind: true },
      { text: "I'll just cut everyone off.", kind: false },
    ],
    reason: "One conflict isn't the whole friendship — or proof of anything about you.",
  },
  {
    emoji: "😳", setback: "You messed up badly in front of everyone.",
    thoughts: [
      { text: "Everyone will judge me forever.", kind: false },
      { text: "Everyone has cringe moments — this fades, and I'm so much more than one of them.", kind: true },
      { text: "I can never show my face again.", kind: false },
    ],
    reason: "Bad moments pass faster than they feel like they will. Self-compassion is how you bounce back.",
  },
];
export const SETBACK_MISS = "That one's harsh on yourself — and it isn't true. Which thought is kind AND true?";

// 4 · Mind Myths Busted — the UN & RE beat. Stigma is the single biggest barrier to teens getting help.
export type Myth = { un: string; re: string };
export const MYTHS: Myth[] = [
  { un: "Anxiety or depression means you're weak.", re: "They're common and human — not weakness, and not a character flaw." },
  { un: "Real men — strong people — don't struggle.", re: "Everyone struggles sometimes; real strength includes reaching out." },
  { un: "Everyone else has it together.", re: "Feeds are highlight reels — almost no one is as fine as they look online." },
  { un: "Asking for help is failure.", re: "Asking for help early is the smart, strong move." },
  { un: "Just be positive / just get over it.", re: "Feelings aren't a switch — skills, time and support are what help." },
];

// 5 · Hold Space + Reach Out — support a friend safely (not alone), your own help-seeking, the helplines.
export const HOLD: Step[] = [
  { emoji: "👂", say: "If a friend is struggling: listen without judging, and take them seriously." },
  { emoji: "🤝", say: "Don't carry it alone — help them reach a trusted adult, especially if they could be at risk." },
  { emoji: "🆘", say: "If a friend might harm themselves, tell a trusted adult today — that's being a real friend." },
  { emoji: "🗣️", say: "Your own help: when it feels too big, tell someone — a parent, teacher, or counsellor." },
  { emoji: "💬", say: "How to start: 'I've not been okay lately. Can we talk?' That's enough." },
  { emoji: "☎️", say: "Help is real, day or night: Tele-MANAS 14416 · KIRAN 1800-599-0019 · Childline 1098." },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Hey — Sam here. Stress and low days are part of life. Let's build the skills to handle them.",
  home: "Where to? Take it at your pace.",
  signals: "Stress Signals. Tap each one — noticing is the first skill.",
  toolkit: "The Resilience Toolkit. Tap each skill to add it to your kit.",
  bounce: "Bounce. Pick the thought that's kind AND true — the way you'd talk to a friend.",
  myths: "Mind Myths. Let's bust the stigma that stops people reaching out.",
  hold: "Hold Space. How to support a friend — and yourself — without struggling alone.",
  badge: "Skill earned! Your toolkit's growing.",
  complete: "You can spot stress, build resilience, bounce back, and reach out. Resilience is a skill — and you're building it. 💚",
};
