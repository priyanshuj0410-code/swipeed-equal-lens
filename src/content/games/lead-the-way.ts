// Lead the Way (node #33, ages 15–18) — becoming an active ally and a quiet leader for equality. "You
// don't need a title or a megaphone to lead. Be the ally, set the example, lift others, and change the
// room you're in." Builds on Equalize (#26) & Stand Up (#27); allyship is everyone's job; male allyship as
// strength; call-in over call-out. No-fail; the plan & Q&A are private.

export type Option = { text: string; ok: boolean };
export type Fact = { emoji: string; say: string };
export type Scene = { emoji: string; situation: string; options: Option[]; result: string };

// 1 · What Allyship Really Is — listen, amplify, show up; then the UN & RE beat.
export const ALLYSHIP: Fact[] = [
  { emoji: "👂", say: "Allyship starts with listening — not speaking over people." },
  { emoji: "📣", say: "Amplify others' voices, and credit their ideas." },
  { emoji: "🙋", say: "Show up — allyship is everyone's job, including boys and men." },
  { emoji: "💪", say: "Real allyship is action, not a hashtag." },
];
export const ALLY_UN = "You think allyship isn't your job — especially if you're a boy. That's not true, and it's not your fault for hearing it.";
export const ALLY_RE = "Allyship is everyone's, and male allyship is a strength. Listen, amplify, and show up.";

// 2 · Lead by Example — your everyday behaviour sets the norm.
export const EXAMPLE: Fact[] = [
  { emoji: "🤝", say: "Share the work — and the credit — fairly." },
  { emoji: "🚫", say: "Don't laugh at a sexist joke — your reaction sets the norm." },
  { emoji: "✊", say: "Back people up when they're talked over." },
  { emoji: "🌟", say: "One steady example often shifts the whole room — no speech needed." },
];

// 3 · Lift as You Climb — mentoring, amplifying, sharing opportunity.
export const LIFT_SCENES: Scene[] = [
  {
    emoji: "💡", situation: "In a meeting, a quieter teammate's good idea gets ignored.",
    options: [{ text: "“Going back to her idea — I think it's great.”", ok: true }, { text: "Say nothing", ok: false }],
    result: "You amplified her — and credited her. That's lifting as you climb.",
  },
  {
    emoji: "🎯", situation: "There's an opportunity you could grab — or share.",
    options: [{ text: "Share it — recommend someone who'd shine", ok: true }, { text: "Take it all for yourself", ok: false }],
    result: "Sharing opportunity lifts others up with you — real leadership.",
  },
];
export const LIFT_MISS = "Lift as you climb — pick the move that raises someone else up.";

// 4 · Call In, Not Just Out — challenge sexism constructively.
export const CALLIN_SCENES: Scene[] = [
  {
    emoji: "💬", situation: "A friend makes a sexist joke.",
    options: [{ text: "Privately: “That one didn't sit right — can we not?”", ok: true }, { text: "Publicly humiliate them", ok: false }, { text: "Laugh along", ok: false }],
    result: "Calling in — with respect, assuming good faith — changes minds better than calling out.",
  },
  {
    emoji: "🔁", situation: "Someone repeats a stereotype, not realising the harm.",
    options: [{ text: "Share a fact, kindly, assuming good faith", ok: true }, { text: "Shame them in front of everyone", ok: false }],
    result: "Respect and persuasion actually shift people — humiliation just makes them defensive.",
  },
];
export const CALLIN_MISS = "Call in, don't just call out — pick the respectful move that actually changes minds.";

// 5 · Your Leadership Style + Ask Anything.
export type AskItem = { q: string; a: string; help?: boolean };
export const STYLE_ASK: AskItem[] = [
  { q: "Do I need to be loud to lead?", a: "No — quiet, everyday leadership changes the most. Lead in your own authentic way." },
  { q: "How do I even start?", a: "Pick one thing: amplify one voice, model one respectful habit, call one thing in. Small and steady wins." },
  { q: "What's my next step?", a: "Build a simple action plan — one ally move you'll make this week. That's leading the way." },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "You don't need a title or a megaphone to lead. Be the ally, set the example, lift others, and change the room you're in.",
  home: "What next, leader?",
  allyship: "What allyship really is — tap each. (It's everyone's job.)",
  example: "Lead by example — tap each.",
  lift: "Lift as you climb — what's the move that raises someone up?",
  callin: "Call in, not just out — pick the respectful move.",
  style: "Your leadership style. Tap a question.",
  badge: "Leader badge earned!",
  complete: "You lead by example, lift others, and call in with respect. No title needed — you change the room. 💼",
};
