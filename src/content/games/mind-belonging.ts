import type { GameConfig } from "@/components/games/modes-engine";

// Mind & Belonging (node #g49, ages 18–22). College mental health, loneliness & leaving home; body image;
// help-seeking. The adult College node of Thread C's wellbeing register (pattern #20): healthy coping
// only, crisis-routing first, stigma is the key unlearn, honest that it's skills & signposting — not
// therapy. Carries the Life-Skills Toolkit at adult stakes. Crisis routing: Tele-MANAS 14416 · KIRAN.
export const MIND_BELONGING: GameConfig = {
  gameId: "mind-belonging",
  title: "Mind & Belonging",
  coins: 35,
  doneTitle: "Mind & belonging. 💚",
  greet: "Leaving home is one of life's biggest leaps — homesickness, loneliness and low moods are normal. Let's settle in, find your people, and reach out. (Skills & signposting, not therapy.)",
  home: "What next?",
  badge: "Badge earned!",
  complete: "You've got it: the wobble of settling in is normal, belonging is built by reaching out, healthy coping protects you, and asking for help is a strength — never a failure. 💚",
  modes: [
    {
      id: "settling", emoji: "🏡", label: "Settling In", kind: "list", say: "Settling in — tap each one.", footer: "you're not the only one",
      items: [
        { emoji: "🏡", say: "Homesickness is normal — a big move shakes everyone." },
        { emoji: "🌧️", say: "The first months are bumpy for almost everyone — it gets better." },
        { emoji: "🧭", say: "Give it time — settling in is a process, not a switch." },
        { emoji: "🤝", say: "Most people around you feel adrift too, even if they hide it." },
      ],
    },
    {
      id: "people", emoji: "👋", label: "Find Your People", kind: "scenes", say: "Find your people — what's the move?",
      miss: "Belonging is built by reaching out — pick that move.",
      scenes: [
        { emoji: "👋", situation: "You're lonely but nervous to put yourself out there.",
          options: [{ text: "Say yes to one thing this week — reach out first", ok: true }, { text: "Wait for people to come to you", ok: false }],
          result: "Belonging is built by showing up and reaching out first — one small yes at a time." },
        { emoji: "🌱", situation: "A club or community looks interesting but intimidating.",
          options: [{ text: "Try it — you can always leave if it's not for you", ok: true }, { text: "Skip it; you might not fit in", ok: false }],
          result: "Communities are how belonging grows — trying one costs nothing and can change everything." },
      ],
    },
    {
      id: "cope", emoji: "🌬️", label: "Cope Well", kind: "list", say: "Cope well — tap each healthy one.", footer: "healthy coping only",
      tool: { tool: "cool-down", line: "Racing mind? This is a Cool-Down moment — want to use it?" },
      items: [
        { emoji: "🌬️", say: "Cool-Down: slow breathing settles a racing mind." },
        { emoji: "🚶", say: "Move, rest, eat, sleep — the basics protect your mood." },
        { emoji: "💬", say: "Talk it out with someone you trust — naming it shrinks it." },
        { emoji: "🪞", say: "Your worth isn't your body or your feed — be kind to yourself." },
      ],
    },
    {
      id: "reach", emoji: "🆘", label: "Reach Out", kind: "myths", say: "Reach out — bust the stigma with UN and RE.",
      un: "Stigma stops people getting help — and the stigma was never yours to carry. Let's rub it out.",
      miss: "That's the stigma myth — pick the kind, true thought.",
      myths: [
        { myth: "“Asking for help means I'm failing.”",
          facts: [{ text: "Reaching out is a strength, and it works.", ok: true }, { text: "Strong people cope alone.", ok: false }],
          re: "Reaching out is a strength — getting support early is the smart move." },
        { myth: "“Everyone else has settled in fine.”",
          facts: [{ text: "Loneliness at college is common, and it passes.", ok: true }, { text: "You're the only one struggling.", ok: false }],
          re: "Most people feel adrift at first — belonging is built slowly, and it comes." },
        { myth: "“My worth depends on how I look.”",
          facts: [{ text: "Your worth isn't your body or your feed.", ok: true }, { text: "Looks decide your value.", ok: false }],
          re: "Your worth isn't your appearance — protecting body image is part of staying well." },
        { boss: true, myth: "“Struggling means something's wrong with me.”",
          facts: [{ text: "Struggling is human — and help is available.", ok: true }, { text: "Needing help is shameful.", ok: false }],
          re: "Struggling is human, not a flaw. Stigma is the myth — reaching out is the move." },
      ],
    },
    {
      id: "ask", emoji: "💬", label: "Tools & Ask-It", kind: "ask", say: "Tools & Ask Anything — private, and help is always here.",
      items: [
        { q: "Is it normal to feel low or lonely at college?", a: "Very. Leaving home, new pressure and loneliness make this a hard transition for most people. It's common, it's not weakness, and it passes." },
        { q: "How do I cope in a healthy way?", a: "Breathe and ground yourself, move and rest, talk to someone you trust, and be kind to yourself. Small healthy habits protect your mind. (This is skills & signposting, not therapy.)" },
        { q: "I'm really struggling, or thinking about harming myself.", a: "You deserve support right now, and it's not your fault. Please reach out — Tele-MANAS 14416, KIRAN 1800-599-0019, or iCall 9152987821. You don't have to handle this alone.", help: true },
      ],
    },
  ],
};
