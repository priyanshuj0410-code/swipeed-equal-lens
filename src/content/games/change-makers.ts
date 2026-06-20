// Change Makers (node #34, ages 15–18) — turn what you care about into real, collective change. "Pick
// something you care about, make a plan, bring people with you, and start small for real." Builds on Lead
// the Way (#33), connects to Justice League (#35). Change is possible & practical; start small & real;
// collective; safe/ethical/lawful. No-fail; the plan & Q&A are private.

export type Fact = { emoji: string; say: string };

// 1 · Find Your Cause — pick & sharpen an issue; then the UN & RE "too small to matter" beat.
export type Cause = { emoji: string; label: string; sharpen: string };
export const CAUSES: Cause[] = [
  { emoji: "🏏", label: "Equal play for girls", sharpen: "Now make it specific: “equal ground time for girls' cricket at our school.”" },
  { emoji: "🚲", label: "Safe travel to school", sharpen: "Now make it specific: “a safe, lit route and a buddy system.”" },
  { emoji: "📚", label: "Keep girls in school", sharpen: "Now make it specific: “a plan so no girl drops out after Class 8.”" },
];
export const CAUSE_UN = "You think you're too young or too small to change anything — and it's not your fault for hearing that.";
export const CAUSE_RE = "Young people have driven real change throughout history. Pick one real thing, bring a few people, take one safe step.";

// 2 · The Plan — set a goal, map allies, choose tactics.
export const PLAN: Fact[] = [
  { emoji: "🎯", say: "Set a real, specific goal." },
  { emoji: "🤝", say: "Map your allies and stakeholders — who's affected, who can help." },
  { emoji: "🛠️", say: "Pick tactics: awareness, advocacy, service, or organising." },
  { emoji: "📋", say: "Write it into a real, doable plan." },
];

// 3 · Build the Movement — the campaign sim: deploy each move to build Momentum.
export const MOVEMENT = [
  { emoji: "🧑‍🤝‍🧑", label: "Recruit allies", say: "Allies joined — you're not alone." },
  { emoji: "👥", label: "Build a team", say: "A team shares the load." },
  { emoji: "📣", label: "Communicate the message", say: "A clear message spreads." },
  { emoji: "🤲", label: "Partner with others", say: "Partners multiply your reach." },
];
export const MOVEMENT_DONE = "Momentum's building — that's collective change in motion!";

// 4 · Make It Stick — measure, adapt, sustain, stay safe.
export const STICK: Fact[] = [
  { emoji: "📊", say: "Measure real impact — over the noise." },
  { emoji: "🔄", say: "Adapt as you learn." },
  { emoji: "🔋", say: "Pace yourself — avoid burnout." },
  { emoji: "🛡️", say: "Keep it safe, ethical and lawful." },
];

// 5 · Launch It + Ask Anything.
export type AskItem = { q: string; a: string; help?: boolean };
export const LAUNCH_ASK: AskItem[] = [
  { q: "What's a good first step?", a: "One concrete, safe step this week beats a perfect plan that never launches." },
  { q: "What if it feels too small?", a: "Most durable change starts small, specific and collaborative. Small and real wins." },
  { q: "How do I keep it safe?", a: "Stay lawful and ethical, bring trusted adults and partners in, and never put yourself or others at risk." },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Pick something you care about, make a plan, bring people with you, and start small — for real. Young people change the world.",
  home: "What next, change maker?",
  cause: "Find your cause — pick one you care about.",
  plan: "The plan — tap each piece.",
  movement: "Build the movement — deploy each move to grow your momentum.",
  stick: "Make it stick — tap each.",
  launch: "Launch it. Tap a question.",
  badge: "Change Maker badge earned!",
  complete: "You found a cause, made a plan, built a movement, and made it stick — start small, change the world. 🌍",
};
