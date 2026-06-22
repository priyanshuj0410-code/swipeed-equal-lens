import type { GameConfig } from "@/components/games/modes-engine";

// Swipe Right? — Dating & Apps (node #g45, ages 18–22). Modern dating & app safety: realistic
// expectations, meeting safely, spotting fakes, dating with consent & respect, kindness on both sides
// of a no. Builds on Green Light/Red Light's flag-reading + Firewall's online safety + Consent For Real.
export const SWIPE_RIGHT: GameConfig = {
  gameId: "swipe-right",
  title: "Swipe Right?",
  coins: 35,
  doneTitle: "Swiping smart. 💞",
  greet: "Dating apps, real talk: meet safely, read people honestly, and treat people kindly — including yourself. Let's go.",
  home: "What next?",
  badge: "Badge earned!",
  complete: "You've got modern dating sorted: real expectations, meet-safe habits, spotting fakes, dating with consent, and kindness on both sides of a no. 💞",
  modes: [
    {
      id: "now", emoji: "📱", label: "Dating Now", kind: "list", say: "Dating now — tap each real-world read.",
      footer: "eyes open",
      items: [
        { emoji: "✨", say: "Profiles are a highlight reel — real people are messier, and that's normal." },
        { emoji: "🎯", say: "A match is a maybe, not a promise — keep your expectations real." },
        { emoji: "🧭", say: "You set the pace — there's no rule that you owe anyone anything." },
        { emoji: "🔁", say: "Most chats fizzle — that's the app, not a verdict on you." },
      ],
    },
    {
      id: "safe", emoji: "🛟", label: "Meeting Safely", kind: "scenes", say: "Meeting safely — what's the safe move?",
      miss: "Meet-safe first — pick the move that keeps you in control.",
      scenes: [
        { emoji: "📍", situation: "You're meeting a match in person for the first time.",
          options: [{ text: "Public place, tell a friend, your own transport", ok: true }, { text: "Their place is fine — you've chatted a lot", ok: false }],
          result: "Public, a friend who knows, your own way home — that's how you meet safe." },
        { emoji: "🫳", situation: "Something feels off the moment you arrive.",
          options: [{ text: "Trust your gut — you can leave any time", ok: true }, { text: "Stay so you don't seem rude", ok: false }],
          result: "Your gut is data — you never owe anyone your discomfort. Leaving is always okay." },
      ],
    },
    {
      id: "fakes", emoji: "🕵️", label: "Fakes & Ghosts", kind: "myths", say: "Fakes & ghosts — bust the dating myths with UN and RE.",
      un: "Apps can mess with your head — and none of this is your fault. Let's rub it out.",
      miss: "That's the myth — pick the real-world read.",
      myths: [
        { myth: "“If they're nice online, they're who they say.”",
          facts: [{ text: "Catfishing is common — verify (a video-call) before you trust or meet.", ok: true }, { text: "A nice chat means they're real.", ok: false }],
          re: "Catfishing is common — a quick video-call and consistent details beat blind trust." },
        { myth: "“Ghosting is just easier for everyone.”",
          facts: [{ text: "A kind, honest 'no thanks' beats leaving someone hanging.", ok: true }, { text: "Disappearing is the polite option.", ok: false }],
          re: "Ghosting leaves people confused — a short, kind “not feeling it, take care” is the respectful move." },
        { boss: true, myth: "“A rejection means something's wrong with me.”",
          facts: [{ text: "Not matching is about fit, not your worth.", ok: true }, { text: "Being turned down is a verdict on you.", ok: false }],
          re: "Not matching is fit, not worth — and giving a 'no' kindly matters just as much as taking one." },
      ],
    },
    {
      id: "respect", emoji: "💞", label: "Date with Respect", kind: "scenes", say: "Date with respect — what's the move?",
      miss: "Mutual pace, mutual consent — pick the respectful move.",
      scenes: [
        { emoji: "🐢", situation: "You really like them and want to move fast.",
          options: [{ text: "Let the pace be mutual — check you're both keen", ok: true }, { text: "Push a bit; keenness is flattering", ok: false }],
          result: "Moving at the speed you're both happy with — consent applies to dating too." },
        { emoji: "🙂", situation: "They tell you they're not feeling a second date.",
          options: [{ text: "Thank them and wish them well", ok: true }, { text: "Argue or guilt them into it", ok: false }],
          result: "Taking a 'no' gracefully is a green flag — handle rejection kindly, both ways." },
      ],
    },
    {
      id: "ask", emoji: "💬", label: "Tools & Ask-It", kind: "ask", say: "Tools & Ask Anything — private, and help is always here.",
      items: [
        { q: "How do I meet someone from an app safely?", a: "Public place, tell a friend where you'll be, your own transport, and trust your gut — you can leave any time." },
        { q: "Is it okay to take things slow?", a: "Always. You set the pace; there's no obligation to anyone, ever — consent applies to dating too." },
        { q: "Someone won't take no, is harassing me, or shared something private.", a: "It's not your fault. Block and report them in-app, save evidence, and get support — Cyber Crime 1930 / cybercrime.gov.in, Women Helpline 181, or Emergency 112.", help: true },
      ],
    },
  ],
};
