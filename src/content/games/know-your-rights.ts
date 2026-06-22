import type { GameConfig } from "@/components/games/modes-engine";

// Know Your Rights (Adult) (node #g51, ages 18–22). Adult rights: labour/POSH-harassment, tenancy,
// consumer & cyber rights, and redress. The Ch.6 closer of Thread G — knowing the system so you can use
// it. Builds on Justice League (#g35). Teaches recognition + how to claim, with live-issue routing.
export const KNOW_YOUR_RIGHTS: GameConfig = {
  gameId: "know-your-rights",
  title: "Know Your Rights",
  coins: 35,
  doneTitle: "Rights, claimed. ⚖️",
  greet: "You have rights at work, at home and online — and they're only powerful if you know them. Let's claim them.",
  home: "What next?",
  badge: "Badge earned!",
  complete: "You know your core adult rights — work, POSH/harassment, tenancy, consumer and cyber — and that you can fight the system through real redress routes. Knowing them is half the protection. ⚖️",
  modes: [
    {
      id: "work", emoji: "💼", label: "Rights at Work", kind: "list", say: "Rights at work — tap each one.", footer: "get it in writing",
      items: [
        { emoji: "📄", say: "Get it in writing — a contract or offer letter protects you." },
        { emoji: "⏰", say: "Know your hours, pay, leave and notice — those are your rights." },
        { emoji: "🚫", say: "Unpaid “internships” doing real work, or no payslip, aren't okay." },
        { emoji: "🤝", say: "You can ask questions and push back — that's not being difficult." },
      ],
    },
    {
      id: "posh", emoji: "⚖️", label: "Harassment & POSH", kind: "scenes", say: "Harassment & POSH — what's the move?",
      miss: "POSH gives you a real path — pick the move that uses it.",
      scenes: [
        { emoji: "🛡️", situation: "A colleague is being sexually harassed at work.",
          options: [{ text: "POSH law gives an Internal Committee — they can complain", ok: true }, { text: "Nothing can be done", ok: false }],
          result: "Every workplace/college must have a POSH Internal Committee — there's a real path to complain." },
        { emoji: "📣", situation: "You're unsure if what happened “counts”.",
          options: [{ text: "If it's unwelcome and sexual, it counts — you can report", ok: true }, { text: "Brush it off to avoid fuss", ok: false }],
          result: "Unwelcome sexual conduct counts under POSH — you have the right to be heard and protected." },
      ],
    },
    {
      id: "renting", emoji: "🏠", label: "Renting & Money Rights", kind: "scenes", say: "Renting & money rights — what's the move?",
      miss: "You have legal protections — pick the move that uses them.",
      scenes: [
        { emoji: "🏠", situation: "A landlord wants to keep your whole deposit unfairly.",
          options: [{ text: "Know your tenancy rights — deposits aren't free to keep", ok: true }, { text: "Assume they can do what they like", ok: false }],
          result: "Tenancy rights protect your deposit and against arbitrary eviction — know them." },
        { emoji: "💻", situation: "Someone is harassing or threatening you online.",
          options: [{ text: "Report it — cyber harassment is a crime (1930)", ok: true }, { text: "Ignore it; it's just online", ok: false }],
          result: "Cyber harassment is illegal and reportable — Cyber Crime 1930 / cybercrime.gov.in." },
      ],
    },
    {
      id: "claim", emoji: "✊", label: "Claim It", kind: "myths", say: "Claim it — bust the helplessness with UN and RE.",
      un: "“You can't fight the system” keeps people from their rights — and that helplessness isn't true. Let's rub it out.",
      miss: "That's the myth — pick the know-your-rights truth.",
      myths: [
        { myth: "“If it happens at work, there's nothing I can do.”",
          facts: [{ text: "POSH gives you an Internal Committee and the right to complain.", ok: true }, { text: "You just have to take it.", ok: false }],
          re: "POSH law gives every workplace an Internal Committee — there's a path, and it's yours." },
        { myth: "“A landlord can throw me out whenever.”",
          facts: [{ text: "Tenancy rights protect against arbitrary eviction.", ok: true }, { text: "They own it, they decide.", ok: false }],
          re: "Renters have legal protections against arbitrary eviction — know your tenancy rights." },
        { myth: "“Online harassment isn't a real crime.”",
          facts: [{ text: "Cyber harassment is illegal and reportable.", ok: true }, { text: "It's just the internet.", ok: false }],
          re: "Stalking, threats and image abuse online are offences — report them (1930)." },
        { boss: true, myth: "“You can't fight the system.”",
          facts: [{ text: "Redress routes and free legal aid exist.", ok: true }, { text: "The little guy always loses.", ok: false }],
          re: "You can. Redress routes, consumer forums and free legal aid (NALSA) exist to be used." },
      ],
    },
    {
      id: "ask", emoji: "💬", label: "Tools & Ask-It", kind: "ask", say: "Tools & Ask Anything — private, and help is always here.",
      items: [
        { q: "What are my basic rights at work?", a: "A clear contract, agreed pay and hours, leave, notice, and a safe, harassment-free workplace. Get key terms in writing." },
        { q: "How does POSH protection work?", a: "Every workplace and college must have an Internal Committee. You can file a written complaint about sexual harassment, and the law protects you from retaliation." },
        { q: "I have a live issue — harassment, eviction, a scam, or rights being denied.", a: "You have options and it's not hopeless. Use your POSH Internal Committee, a consumer forum, or free legal aid (NALSA 15100). For cyber issues call 1930; for safety, Women Helpline 181 / Emergency 112.", help: true },
      ],
    },
  ],
};
