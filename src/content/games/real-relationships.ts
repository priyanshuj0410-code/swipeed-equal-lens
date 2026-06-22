import type { GameConfig } from "@/components/games/modes-engine";

// Real Relationships (node #g46, ages 18–22). Building healthy adult relationships; recognising &
// leaving unhealthy ones; conflict, repair & breakups. Even-handed (balance red flags with the green
// markers of health), abuse-aware with strong routing. Builds on GLRL flag-reading + Consent For Real.
export const REAL_RELATIONSHIPS: GameConfig = {
  gameId: "real-relationships",
  title: "Real Relationships",
  coins: 35,
  doneTitle: "Reading it real. 💚",
  greet: "A healthy relationship runs on respect, trust, equality and honest communication — and you can spot the opposite. Let's read the real thing.",
  home: "What next?",
  badge: "Badge earned!",
  complete: "You can read a healthy relationship, fight fair and repair, spot coercive control behind “they're just protective”, leave safely, and heal from heartbreak. 💚",
  modes: [
    {
      id: "healthy", emoji: "💚", label: "What Healthy Looks Like", kind: "list", say: "What healthy looks like — tap each daily marker.",
      footer: "the daily markers",
      items: [
        { emoji: "🤝", say: "Respect — your no is heard, your yes is real." },
        { emoji: "🔓", say: "Trust — no snooping, no jealousy-as-control." },
        { emoji: "⚖️", say: "Equality — decisions and effort are shared." },
        { emoji: "🌱", say: "Independence — you both keep your own friends and life." },
        { emoji: "💬", say: "Communication — you can disagree, and repair." },
      ],
    },
    {
      id: "fight", emoji: "🔧", label: "Fight Right", kind: "scenes", say: "Fight right — what's the move?",
      miss: "Fair fighting repairs — pick the move that does.",
      tool: { tool: "talk-it-out", line: "Talk-It-Out helps you say the hard thing kindly." },
      scenes: [
        { emoji: "💢", situation: "You're hurt by something your partner did.",
          options: [{ text: "Use an 'I' statement: “I felt… when…”", ok: true }, { text: "“You always…” — go on the attack", ok: false }],
          result: "'I' statements share how you feel without blaming — that's fighting fair." },
        { emoji: "🩹", situation: "After a fight, things are tense.",
          options: [{ text: "Own your part and apologise sincerely", ok: true }, { text: "Wait for them to crack first", ok: false }],
          result: "Repair — owning your part and apologising — is what keeps a relationship strong." },
      ],
    },
    {
      id: "flags", emoji: "🚩", label: "Red Flags, Grown Up", kind: "myths", say: "Red flags, grown up — bust the myths with UN and RE.",
      un: "“They're just protective” often hides control — and spotting it isn't your fault. Let's rub it out.",
      miss: "That's the myth — pick the healthy-relationship truth.",
      myths: [
        { myth: "“Jealousy means they really love me.”",
          facts: [{ text: "Controlling jealousy is a red flag, not love.", ok: true }, { text: "Jealousy proves they care.", ok: false }],
          re: "Controlling jealousy is a red flag, not love — healthy love is built on trust." },
        { myth: "“They check my phone because they care.”",
          facts: [{ text: "Monitoring and isolation are control, not protection.", ok: true }, { text: "Checking up is just being protective.", ok: false }],
          re: "Monitoring you and cutting you off from people is coercive control — not caring." },
        { myth: "“Healthy couples never fight.”",
          facts: [{ text: "Conflict is normal — repair is what matters.", ok: true }, { text: "A real couple never argues.", ok: false }],
          re: "All couples disagree — how you repair afterwards is what counts." },
        { boss: true, myth: "“Love means losing yourself in someone.”",
          facts: [{ text: "Healthy love keeps room for your own life.", ok: true }, { text: "You should merge into one.", ok: false }],
          re: "Healthy love keeps room for your own friends, goals and self." },
      ],
    },
    {
      id: "leaving", emoji: "🚪", label: "Leaving & Breakups", kind: "scenes", say: "Leaving safely & breakups — what's the move?",
      miss: "Survivor-first and safe — pick the supportive move.",
      scenes: [
        { emoji: "🚩", situation: "A friend's partner controls their money, who they see, and puts them down.",
          options: [{ text: "That's abuse — gently support them and signpost help", ok: true }, { text: "Tell them it's normal couple stuff", ok: false }],
          result: "Control, isolation and put-downs are abuse — believe them and point to support." },
        { emoji: "🛟", situation: "Someone wants to leave an unsafe relationship.",
          options: [{ text: "Leave with a plan and people who can help", ok: true }, { text: "Just walk out alone with no plan", ok: false }],
          result: "Leaving can be the most dangerous time — a safety plan and support make it safer." },
        { emoji: "💔", situation: "You're heartbroken after a breakup.",
          options: [{ text: "Lean on friends, be kind to yourself, give it time", ok: true }, { text: "Bottle it up and pretend you're fine", ok: false }],
          result: "Heartbreak is real — support, self-kindness and time are how you heal." },
      ],
    },
    {
      id: "ask", emoji: "💬", label: "Tools & Ask-It", kind: "ask", say: "Tools & Ask Anything — private, and help is always here.",
      items: [
        { q: "How do I know if a relationship is healthy?", a: "The daily markers: respect, trust, equality, independence and good communication — and you can disagree and repair without fear." },
        { q: "What wrecks relationships?", a: "Contempt, criticism, defensiveness and stonewalling. Catching these early — and repairing — protects a relationship." },
        { q: "I think I'm in an abusive relationship, or a friend is.", a: "It's not your fault, and you deserve support. Talk to someone you trust, or call Women Helpline 181 / 1091, a DV helpline, or Emergency 112. Leaving is safest with a plan.", help: true },
      ],
    },
  ],
};
