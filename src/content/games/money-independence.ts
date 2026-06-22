import type { GameConfig } from "@/components/games/modes-engine";

// Money & Independence (node #g48, ages 18–22). Work & money: financial literacy & independence; money
// in relationships. Budget · dodge debt/scams · read a payslip & negotiate · keep money fair and spot
// financial control (UN & RE). India-aware (stipends, EMIs, OTP scams). No-fail; help routes for abuse/scams.
export const MONEY_INDEPENDENCE: GameConfig = {
  gameId: "money-independence",
  title: "Money & Independence",
  coins: 35,
  doneTitle: "Money, sorted. 💰",
  greet: "Money is freedom and confidence — budget it, dodge the traps, know your worth, and keep money fair in love. Let's get you sorted.",
  home: "What next?",
  badge: "Badge earned!",
  complete: "You can budget, save and dodge debt traps, read a payslip and ask for fair pay, and keep money equal and abuse-free in a relationship. That's independence. 💰",
  modes: [
    {
      id: "budget", emoji: "💰", label: "Budget It", kind: "list", say: "Budget it — tap each one.", footer: "where does it go?",
      items: [
        { emoji: "🧮", say: "Split your income — needs, wants, savings — before it disappears." },
        { emoji: "🏠", say: "Needs first: rent, food, transport, bills." },
        { emoji: "🎮", say: "Wants are fine — within a limit you set." },
        { emoji: "🐷", say: "Pay yourself first — save a slice every month, even a small one." },
      ],
    },
    {
      id: "save", emoji: "🪤", label: "Save & Avoid Traps", kind: "scenes", say: "Save & avoid traps — what's the move?",
      miss: "If you can't afford it now, you can't afford the EMIs — pick the safe move.",
      scenes: [
        { emoji: "💳", situation: "A shiny “Buy Now, Pay Later” offer for something you can't afford.",
          options: [{ text: "Skip it — “pay later” is debt with a smile", ok: true }, { text: "Grab it, sort the EMIs later", ok: false }],
          result: "“Pay later” is still debt — if you can't afford it now, you can't afford the EMIs." },
        { emoji: "🎣", situation: "A message says you've won money — just share your bank OTP to claim.",
          options: [{ text: "It's a scam — never share an OTP or bank details", ok: true }, { text: "Share it; the prize sounds real", ok: false }],
          result: "No real prize needs your OTP — never share it. That's how scams drain accounts." },
      ],
    },
    {
      id: "earn", emoji: "📈", label: "Earn & Ask", kind: "scenes", say: "Earn & ask — what's the move?",
      miss: "Knowing your worth is your right — pick the confident move.",
      scenes: [
        { emoji: "🧾", situation: "Your first payslip has deductions you don't recognise.",
          options: [{ text: "Read it — know your gross, deductions and net pay", ok: true }, { text: "Ignore it; the number's the number", ok: false }],
          result: "Understanding your payslip — gross, tax, net — is how you spot mistakes and plan." },
        { emoji: "🤝", situation: "You're offered a role below the going rate.",
          options: [{ text: "Politely ask if there's room to negotiate", ok: true }, { text: "Accept silently to avoid awkwardness", ok: false }],
          result: "Asking about pay is normal and your right — it's how the gap gets closed." },
      ],
    },
    {
      id: "love", emoji: "❤️", label: "Money & Love", kind: "myths", say: "Money & love — bust the myths with UN and RE.",
      un: "Money myths keep people stuck and unequal — and they're not your fault. Let's rub it out.",
      miss: "That's the myth — pick the money-smart truth.",
      myths: [
        { myth: "“He handles the money — that's just how it works.”",
          facts: [{ text: "Both partners deserve a say and their own footing.", ok: true }, { text: "The man should manage it.", ok: false }],
          re: "Shared, transparent money is a sign of an equal partnership — both have a say." },
        { myth: "“Budgeting is only for people short on money.”",
          facts: [{ text: "A budget is how anyone stays in control.", ok: true }, { text: "Only the broke budget.", ok: false }],
          re: "A budget is how anyone — at any income — stays in control of their money." },
        { myth: "“Controlling all the money is a way of caring.”",
          facts: [{ text: "Cutting off money access is financial abuse.", ok: true }, { text: "It's just being careful.", ok: false }],
          re: "Cutting a partner off from money is financial abuse — everyone needs their own access." },
        { boss: true, myth: "“Asking about pay is rude.”",
          facts: [{ text: "Knowing your worth and negotiating is your right.", ok: true }, { text: "Just take what's offered.", ok: false }],
          re: "Talking about money is how you avoid being short-changed — it's your right." },
      ],
    },
    {
      id: "ask", emoji: "💬", label: "Tools & Ask-It", kind: "ask", say: "Tools & Ask Anything — private, and help is always here.",
      items: [
        { q: "How do I start budgeting?", a: "Track income and spending for a month, split into needs / wants / savings, and pay yourself first — even a small saving each month builds the habit." },
        { q: "Is it okay to negotiate my salary?", a: "Yes — it's normal and your right. Know the going rate, and ask politely if there's room. Closing the pay gap starts with asking." },
        { q: "A partner controls all my money, or I'm being scammed / in debt trouble.", a: "Cutting off money access is financial abuse — it's not your fault. Talk to someone you trust; for scams report to Cyber Crime 1930, and for support call Women Helpline 181.", help: true },
      ],
    },
  ],
};
