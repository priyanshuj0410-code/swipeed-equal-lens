import type { GameConfig } from "@/components/games/modes-engine";

// Find Your Feet (node #g52, ages 18–22). Career & future anxiety — arguably the defining stressor of
// these years in India: the comparison spiral, the pressure to have life figured out, the placement/exam
// cooker, worth beyond your CV. Wellbeing register (#20): kind-and-true reframes, crisis-routing, not
// therapy. "Spoiler: no one has it figured out."
export const FIND_YOUR_FEET: GameConfig = {
  gameId: "find-your-feet",
  title: "Find Your Feet",
  coins: 35,
  doneTitle: "Finding your feet. 🌟",
  greet: "Spoiler: no one has it figured out. Quiet the comparison, handle the pressure, and find a path that's actually yours — your worth isn't your CV.",
  home: "What next?",
  badge: "Badge earned!",
  complete: "You've got it: the comparison feed is a highlight reel, you don't need it all sorted, setbacks are information not verdicts, and your worth is bigger than any CV. 🌟",
  modes: [
    {
      id: "compare", emoji: "🪞", label: "The Comparison Trap", kind: "myths", say: "The comparison trap — bust it with UN and RE.",
      un: "The comparison spiral is fuelled by everyone's highlight reel — and it isn't your fault. Let's rub it out.",
      miss: "That's the comparison myth — pick the kinder truth.",
      myths: [
        { myth: "“Everyone else has it all figured out.”",
          facts: [{ text: "No one does — they're just better at hiding the mess.", ok: true }, { text: "They've got it sorted.", ok: false }],
          re: "No one has it figured out — the success feed is a highlight reel, not the full story." },
        { myth: "“My worth is my CV and my package.”",
          facts: [{ text: "Your worth isn't a salary or a title.", ok: true }, { text: "Your job is your value.", ok: false }],
          re: "Who you are is bigger than what you do for work — your worth isn't your CV." },
        { boss: true, myth: "“If I'm not succeeding by now, I never will.”",
          facts: [{ text: "There's no single timeline — your path is yours.", ok: true }, { text: "You're already behind.", ok: false }],
          re: "Lives unfold at different speeds — there's no single timeline, and comparison lies." },
      ],
    },
    {
      id: "sorted", emoji: "🌫️", label: "Not All Sorted", kind: "list", say: "You don't need it all sorted — tap each one.", footer: "uncertainty is normal",
      items: [
        { emoji: "🌫️", say: "Not having it all figured out is normal — almost no one does at this age." },
        { emoji: "🧪", say: "Uncertainty is a phase to explore, not a failure to fix." },
        { emoji: "👣", say: "You don't need the whole map — just the next small step." },
        { emoji: "⏳", say: "There's no deadline on figuring out your life." },
      ],
    },
    {
      id: "bounce", emoji: "🏀", label: "Bounce From Setbacks", kind: "scenes", say: "Bounce from setbacks — what's the move?",
      miss: "A setback is information, not a verdict — pick that reframe.",
      tool: { tool: "cool-down", line: "Stung by a setback? This is a Cool-Down moment — want to use it?" },
      scenes: [
        { emoji: "📉", situation: "You bombed an exam, or got rejected from a placement.",
          options: [{ text: "Treat it as information — what to try next", ok: true }, { text: "Take it as proof you're not good enough", ok: false }],
          result: "A setback is information, not a verdict — it tells you what to adjust, not who you are." },
        { emoji: "🔁", situation: "Everyone around you seems to be landing offers.",
          options: [{ text: "Run your own race — their timeline isn't yours", ok: true }, { text: "Spiral and compare yourself down", ok: false }],
          result: "Their timeline isn't yours — running your own race is how you keep going." },
      ],
    },
    {
      id: "path", emoji: "🧭", label: "Your Path", kind: "scenes", say: "Your path — what's the move?",
      miss: "Values-based next steps beat a perfect plan — pick that move.",
      scenes: [
        { emoji: "🧭", situation: "You're paralysed about what to do with your life.",
          options: [{ text: "Pick one small next step that fits your values", ok: true }, { text: "Wait until the whole plan is perfect", ok: false }],
          result: "Values-based next steps beat a perfect plan — direction comes from moving, not waiting." },
        { emoji: "🌟", situation: "A “prestigious” path doesn't actually excite you.",
          options: [{ text: "Weigh what matters to you, not just status", ok: true }, { text: "Chase the status anyway", ok: false }],
          result: "A path that fits your values beats a shiny one that doesn't — your worth is bigger than a label." },
      ],
    },
    {
      id: "ask", emoji: "💬", label: "Tools & Ask-It", kind: "ask", say: "Tools & Ask Anything — private, and help is always here.",
      items: [
        { q: "Is it normal to feel anxious about my future?", a: "Completely — career and future anxiety is one of the defining stresses of these years. Almost no one has it figured out; you're not behind." },
        { q: "How do I stop comparing myself to everyone?", a: "Remember the feed is a highlight reel, mute what spirals you, and take one small values-based next step. Your worth isn't your CV." },
        { q: "The pressure is overwhelming, or I'm having dark thoughts.", a: "You deserve support, and the pressure isn't a measure of your worth. Please reach out — Tele-MANAS 14416, KIRAN 1800-599-0019, or iCall 9152987821. You're not alone.", help: true },
      ],
    },
  ],
};
