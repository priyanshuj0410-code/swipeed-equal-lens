import type { GameConfig } from "@/components/games/modes-engine";

// Own Your Health (node #g47, ages 18–22). Adult SRH ownership: contraception & dual protection,
// routine confidential testing, sexual wellbeing & pleasure (within consent & respect), and the
// partner health-talk. Non-explicit, behaviour-level, shame-busting; fully open Ask-It with services.
export const OWN_YOUR_HEALTH: GameConfig = {
  gameId: "own-your-health",
  title: "Own Your Health",
  coins: 35,
  doneTitle: "Health, owned. 💚",
  greet: "Your sexual health is yours to own — protection sorted, testing routine, no shame, and honest talk. Let's get you confident.",
  home: "What next?",
  badge: "Badge earned!",
  complete: "You own your health: dual protection, routine confidential testing, no shame about your body or pleasure, and a straight-talking health chat with a partner. 💚",
  modes: [
    {
      id: "protection", emoji: "🛡️", label: "Protection, Sorted", kind: "list", say: "Protection, sorted — tap each one.",
      footer: "choose, use, access — confidently",
      items: [
        { emoji: "🛡️", say: "Dual protection — a condom plus another method covers pregnancy and STIs." },
        { emoji: "🤝", say: "Contraception is a shared responsibility, not just one person's." },
        { emoji: "🏥", say: "Methods are free or low-cost and confidential at adult health services." },
        { emoji: "🔁", say: "Emergency contraception exists for when something goes wrong — sooner is better." },
      ],
    },
    {
      id: "status", emoji: "🩺", label: "Know Your Status", kind: "scenes", say: "Know your status — what's the move?",
      miss: "Testing is normal self-care — pick that move.",
      scenes: [
        { emoji: "🩺", situation: "You've started seeing someone new.",
          options: [{ text: "Get a routine test — it's normal self-care", ok: true }, { text: "Only people who've done wrong get tested", ok: false }],
          result: "Routine testing is normal self-care — knowing your status protects you both." },
        { emoji: "🔒", situation: "You're worried a clinic will tell your family.",
          options: [{ text: "Adult sexual-health services are confidential — go", ok: true }, { text: "Skip it to avoid being found out", ok: false }],
          result: "Adult SRH care is confidential — and most STIs are easily treated when caught early." },
      ],
    },
    {
      id: "shame", emoji: "🚫", label: "Bust the Shame", kind: "myths", say: "Bust the shame — with UN and RE.",
      un: "Shame keeps people from care — and the shame isn't yours to carry. Let's rub it out.",
      miss: "That's the shame myth — pick the healthy truth.",
      myths: [
        { myth: "“Getting tested means you've done something wrong.”",
          facts: [{ text: "Routine STI testing is normal self-care.", ok: true }, { text: "Only the 'guilty' get tested.", ok: false }],
          re: "Testing is part of looking after your body — normal, routine, no shame." },
        { myth: "“Contraception is the woman's job.”",
          facts: [{ text: "It's a shared responsibility.", ok: true }, { text: "She should handle it.", ok: false }],
          re: "Contraception and sexual health are a shared responsibility — both partners own it." },
        { myth: "“Pleasure isn't something to talk about.”",
          facts: [{ text: "Wellbeing and pleasure, within consent, are healthy.", ok: true }, { text: "It's shameful to discuss.", ok: false }],
          re: "Within consent and respect, communication and pleasure are a healthy part of life." },
        { boss: true, myth: "“Clinics will judge me or tell my family.”",
          facts: [{ text: "Adult sexual-health services are confidential.", ok: true }, { text: "They'll out you.", ok: false }],
          re: "You have a right to private, non-judgmental care — confidentiality is the standard." },
      ],
    },
    {
      id: "talk", emoji: "💬", label: "The Health Talk", kind: "scenes", say: "The health talk — what's the move?",
      miss: "Your health, your boundary — pick the move that holds it.",
      scenes: [
        { emoji: "🗣️", situation: "You want to bring up testing and protection with a partner.",
          options: [{ text: "Say it plainly and early — “let's both test and sort protection”", ok: true }, { text: "Hope it just works out without talking", ok: false }],
          result: "A calm, direct chat about testing and protection is care, not awkwardness." },
        { emoji: "🙂", situation: "Your partner brushes off using protection.",
          options: [{ text: "Hold your boundary — no protection, no go", ok: true }, { text: "Give in to avoid the awkwardness", ok: false }],
          result: "Your health, your boundary — “no protection, no go” is always yours to keep." },
      ],
    },
    {
      id: "ask", emoji: "❓", label: "Tools & Ask-It", kind: "ask", say: "Tools & Ask Anything — fully open, and help is always here.",
      items: [
        { q: "How often should I get tested?", a: "Routinely — e.g. with each new partner, and regularly if you're sexually active. It's quick, confidential and normal self-care." },
        { q: "Is talking about pleasure normal?", a: "Yes — within consent and respect, communicating about what feels good (and what doesn't) is a healthy, normal part of wellbeing." },
        { q: "Where can I get confidential help or services?", a: "Adult sexual-health services and clinics are confidential. You can also call the National AIDS Helpline 1097, or find services via your nearest health centre.", help: true },
      ],
    },
  ],
};
