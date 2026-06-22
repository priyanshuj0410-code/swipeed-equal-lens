import type { GameConfig } from "@/components/games/modes-engine";

// Equal & Confident (node #g50, ages 18–22). Gender equality at college/work; claiming your voice &
// leading; active allyship; spotting and calling in everyday adult bias (interruptions, "bossy", office
// housework). Builds on Lead the Way (#g33) and Stand Up (#g27). Even-handed; allyship across genders.
export const EQUAL_CONFIDENT: GameConfig = {
  gameId: "equal-confident",
  title: "Equal & Confident",
  coins: 35,
  doneTitle: "Equal & confident. 🌟",
  greet: "Equality at college and work is built one moment at a time — claim your voice, lead the room, spot the quiet bias, and back others. Let's go.",
  home: "What next?",
  badge: "Badge earned!",
  complete: "You can claim your voice, lead without a title, spot and call in everyday bias, and be an active ally. That's equal and confident. 🌟",
  modes: [
    {
      id: "voice", emoji: "🗣️", label: "Claim Your Voice", kind: "list", say: "Claim your voice — tap each one.", footer: "your voice belongs here",
      items: [
        { emoji: "🗣️", say: "Your voice belongs in the room — say the idea." },
        { emoji: "✋", say: "Talked over? “I'd like to finish my point.”" },
        { emoji: "📝", say: "Write your key point first, so nerves don't erase it." },
        { emoji: "💪", say: "Confidence is a skill — it grows every time you use your voice." },
      ],
    },
    {
      id: "lead", emoji: "🌟", label: "Lead the Room", kind: "scenes", say: "Lead the room — what's the move?",
      miss: "Leadership is initiative and lifting others — pick that move.",
      scenes: [
        { emoji: "🧭", situation: "A group project is drifting with no one steering.",
          options: [{ text: "Take initiative — leading isn't about a title", ok: true }, { text: "Wait for someone “in charge”", ok: false }],
          result: "Everyday leadership is initiative and lifting others — no title required." },
        { emoji: "🤲", situation: "A quieter teammate has a good idea no one heard.",
          options: [{ text: "Amplify it: “I think what they said is key”", ok: true }, { text: "Let it get lost", ok: false }],
          result: "Lifting others up is leadership — amplifying a good idea makes the whole team better." },
      ],
    },
    {
      id: "bias", emoji: "🚩", label: "Spot & Counter Bias", kind: "myths", say: "Spot & counter bias — with UN and RE.",
      un: "Everyday bias hides in small moments — and noticing it isn't “being difficult”. Let's rub it out.",
      miss: "That's the bias myth — pick the equal-and-confident truth.",
      myths: [
        { myth: "“Speaking up will just make me look difficult.”",
          facts: [{ text: "Your voice belongs in the room — use it.", ok: true }, { text: "Better to stay quiet.", ok: false }],
          re: "Claiming your voice is leadership, not trouble — the room needs your idea." },
        { myth: "“The note-taking and tidying can fall to her.”",
          facts: [{ text: "“Office housework” shouldn't default to women.", ok: true }, { text: "It's just what women do.", ok: false }],
          re: "Unseen support work should be shared, not gendered — call it in." },
        { myth: "“She was just being bossy.”",
          facts: [{ text: "The same gets called “leadership” in a man.", ok: true }, { text: "She was too much.", ok: false }],
          re: "Spot the double standard: 'bossy' for her is 'leadership' in him." },
        { boss: true, myth: "“It's not my problem if I'm not the target.”",
          facts: [{ text: "Allyship means stepping in, not staying silent.", ok: true }, { text: "Stay out of it.", ok: false }],
          re: "Allyship turns bystanders into upstanders — stepping in is everyone's job." },
      ],
    },
    {
      id: "ally", emoji: "🤝", label: "Be the Ally", kind: "scenes", say: "Be the ally — what's the move?",
      miss: "Active allyship calls it in — pick that move.",
      scenes: [
        { emoji: "🗣️", situation: "A colleague keeps interrupting a woman in meetings.",
          options: [{ text: "Call it in gently: “Let her finish”", ok: true }, { text: "Say nothing — not your place", ok: false }],
          result: "Calling it in — kindly and clearly — is active allyship that changes the room." },
        { emoji: "🌍", situation: "A “joke” at someone's gender lands badly.",
          options: [{ text: "Name it: “That's not okay”", ok: true }, { text: "Laugh along to keep the peace", ok: false }],
          result: "Naming everyday sexism, even a 'joke', is how allyship makes spaces fairer." },
      ],
    },
    {
      id: "ask", emoji: "💬", label: "Tools & Ask-It", kind: "ask", say: "Tools & Ask Anything — private, and help is always here.",
      items: [
        { q: "How do I sound more confident at work or college?", a: "Prepare your key point, claim space (“I'd like to finish”), and use your voice often — confidence is a skill that grows with practice." },
        { q: "What's “office housework”?", a: "The unseen support work — notes, tidying, organising — that quietly defaults to women. Naming it and sharing it fairly is part of workplace equality." },
        { q: "I'm facing bias or harassment and don't know what to do.", a: "It's not okay and not your fault. Document it, and use your workplace/college POSH Internal Committee. For support, Women Helpline 181 or a trusted mentor can help.", help: true },
      ],
    },
  ],
};
