// Life Ready (node #g42, play order: Ch.5, penultimate, ages 15–18) — Chapter 5, Thread C (Feelings &
// Life Skills). "You're about to run your own life. Know yourself, decide well, handle the big stuff,
// work with people, and build a support network you can lean on — for good." The grown-up of the thread
// (Feelings Friends → Heart Smart → Mind Matters → Bounce → Life Ready); consolidates the Life-Skills
// Toolkit for adult life. Sits just before the Decoded finale (#g36). Healthy strategies only;
// pressure-free (no single 'right' path); not therapy; routes distress to help. Sam appears grown — a
// quiet bookend to the small friend from Feelings Friends. UN & RE at the life-myths. See GDD 42.

export type Step = { emoji: string; say: string };

// 1 · Know Yourself — self-awareness, values & strengths (the base of every good adult decision).
// Reflective: there are no 'right' values, only the work of knowing your own.
export const VALUES: Step[] = [
  { emoji: "💛", say: "Kindness — treating people well, even when it's hard." },
  { emoji: "🛡️", say: "Honesty — being real, with others and with yourself." },
  { emoji: "📚", say: "Growth — I can keep learning and getting better." },
  { emoji: "⚖️", say: "Fairness — standing up for what's right." },
  { emoji: "🎯", say: "Knowing my strengths — what I'm good at and what lights me up." },
  { emoji: "🧠", say: "Self-awareness — noticing how I feel and why. There's no wrong answer here." },
];

// 2 · Decide Like an Adult — mature, values-based decisions. The skill is deciding WELL, not picking a
// single 'right' option (beyond safety & law). Pick the grown-up approach.
export type Scene = { emoji: string; situation: string; options: { text: string; mature: boolean }[]; reason: string };
export const SCENES: Scene[] = [
  {
    emoji: "📅", situation: "Friends are pressuring you to skip study for a party the night before a big exam.",
    options: [
      { text: "Weigh it against my goals and decide for myself — I'll catch the next one.", mature: true },
      { text: "Just go — everyone's going.", mature: false },
      { text: "Freeze, do neither, and feel awful.", mature: false },
    ],
    reason: "Gather facts, check your values and the long term, resist pressure, own the choice.",
  },
  {
    emoji: "🧭", situation: "You're choosing a stream/career — your family wants one path, you lean another way.",
    options: [
      { text: "Do whatever they say so there's no conflict.", mature: false },
      { text: "Gather the facts, weigh my values and theirs, and talk it through honestly.", mature: true },
      { text: "Refuse to discuss it at all.", mature: false },
    ],
    reason: "A mature decision hears others, but is made by your own values — calmly, not by avoidance.",
  },
  {
    emoji: "📱", situation: "A 'too-good-to-be-true' online offer wants a fee upfront, fast.",
    options: [
      { text: "Pay quickly before it's gone.", mature: false },
      { text: "Ignore the feeling that something's off.", mature: false },
      { text: "Check the facts and the long-term catch — if it's pressured, walk away.", mature: true },
    ],
    reason: "Pressure + urgency is a red flag. Slow down, get the facts, and protect yourself.",
  },
];
export const SCENE_MISS = "Think it through — which one is the grown-up move?";

// 3 · Handle the Big Stuff — tools for real adult-threshold transitions & stress, without minimising them.
export const BIG_STUFF: Step[] = [
  { emoji: "🏷️", say: "Name the stress — 'this is exam pressure' — naming it shrinks it." },
  { emoji: "🧩", say: "Break it down — one step, one day at a time." },
  { emoji: "🌬️", say: "Use a healthy strategy — breathe, move, rest, talk it out." },
  { emoji: "🫂", say: "Lean on your people — you're not meant to carry it alone." },
  { emoji: "🆘", say: "Ask for help early — before it gets too big." },
  { emoji: "🌗", say: "Change is hard, and it passes. Not having it all figured out is normal." },
];

// 4 · People & Support — emotional intelligence with others + building a support network you keep for life.
export const PEOPLE: Step[] = [
  { emoji: "🗣️", say: "Communicate clearly — say what you mean, kindly." },
  { emoji: "👂", say: "Listen and collaborate — half of adult life is other people." },
  { emoji: "🚧", say: "Set and respect boundaries — yours, and theirs." },
  { emoji: "🤲", say: "Resolve conflict — talk it out and find a fair fix." },
  { emoji: "🗺️", say: "Build your support map: friends · family · a mentor · a counsellor." },
  { emoji: "☎️", say: "Help-seeking doesn't end at 18: Tele-MANAS 14416 · KIRAN 1800-599-0019." },
];

// 5 · Life Myths Busted — the UN & RE beat on the myths that make the threshold of adulthood harder.
export type Myth = { un: string; re: string };
export const MYTHS: Myth[] = [
  { un: "Asking for help means you've failed at adulthood.", re: "Help-seeking is a lifelong strength — not a failure." },
  { un: "You should have your whole life figured out by 18.", re: "Almost no one does. Uncertainty is normal." },
  { un: "Your exam result decides your whole future.", re: "It's one milestone — not your worth or your destiny." },
  { un: "Adults handle everything alone.", re: "Everyone leans on a support network — that's how it works." },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Hey. It's Sam — all grown up, like you nearly are. Let's get you ready to run your own life.",
  home: "Where to? No rush — this is yours.",
  know: "Know Yourself. Tap what matters to you — there are no wrong answers.",
  decide: "Decide Like an Adult. Pick the grown-up approach.",
  big: "Handle the Big Stuff. Tap each tool for the hard moments.",
  people: "People & Support. Tap each one — you don't do adulthood alone.",
  myths: "Life Myths. Let's clear the ones that make growing up harder.",
  badge: "Skill earned! Your Life Toolkit is coming together.",
  complete: "You know yourself, you decide on purpose, you can handle the big stuff and lean on your people. You're ready — and you never have to do it alone. 🌅",
};
