// Consent, For Real (node #g44, ages 18–22) — the adult opener of Chapter 6. The grown-up step of the
// consent journey (My Body My Rules #2 → Boundary Bot #15 → Green Light/Red Light #24 → Mutual #31),
// now in real adult life: parties, dating, relationships, alcohol. "Consent is an active, ongoing,
// sober-enough yes — nothing less." NEVER explicit; even-handed; survivor-centred; no-fail; consent is
// never rushed; Q&A private with urgent help-routing. Sam returns as a level-headed adult peer.

export type Option = { text: string; ok: boolean };
export type Scene = { emoji: string; situation: string; options: Option[]; result: string };
export type Myth = { myth: string; facts: Option[]; re: string; boss?: boolean };
export type AskItem = { q: string; a: string; help?: boolean };

// 1 · Real Situations — read the moment, choose the consent-first move (party, date, message thread).
export const REAL_SCENES: Scene[] = [
  {
    emoji: "🎉", situation: "At a party, someone you like is giving mixed signals — into it one moment, pulling back the next.",
    options: [
      { text: "Slow down and check in: “Want to take a break?”", ok: true },
      { text: "Read the keen moments as a green light", ok: false },
    ],
    result: "You checked in instead of assuming — mixed signals mean pause and ask, every time.",
  },
  {
    emoji: "☕", situation: "A great date is ending and they invite you up “for coffee.”",
    options: [
      { text: "“Coffee” is just coffee — let anything more be asked and mutual", ok: true },
      { text: "Coming up means they want more", ok: false },
    ],
    result: "Coming in is never blanket consent — each step still needs its own clear yes.",
  },
  {
    emoji: "📱", situation: "They sent flirty texts earlier, but in person they seem hesitant.",
    options: [
      { text: "Go by how they feel right now, not the texts", ok: true },
      { text: "The texts already settled it", ok: false },
    ],
    result: "A yes earlier — or online — isn't a yes now. Consent lives in the moment.",
  },
];
export const REAL_MISS = "Read the moment, not your hopes — pick the move that checks in.";

// 2 · Drinks & Capacity — the adult-specific lesson: incapacitation removes consent; look out for friends.
export const CAPACITY_SCENES: Scene[] = [
  {
    emoji: "🍹", situation: "Your match has had way too much to drink and can barely stand.",
    options: [
      { text: "Too drunk to agree means no — help them get home safe", ok: true },
      { text: "They didn't say no, so it's fine", ok: false },
    ],
    result: "Someone incapacitated can't consent — full stop. Looking out for them is the move.",
  },
  {
    emoji: "👀", situation: "At a party, a very drunk friend is being led away by someone.",
    options: [
      { text: "Step in — check your friend is okay and safe", ok: true },
      { text: "Not my business", ok: false },
    ],
    result: "Looking out for each other is what keeps everyone safe — you stepped in.",
  },
  {
    emoji: "🌙", situation: "You've both been drinking and things are getting closer.",
    options: [
      { text: "A sober-enough yes from both, or wait — no regrets", ok: true },
      { text: "A bit drunk is fine for both", ok: false },
    ],
    result: "Consent needs a sober-enough yes from both people — when in doubt, wait.",
  },
];
export const CAPACITY_MISS = "Drunk or high can't be a yes — pick the move that keeps everyone safe.";

// 3 · Spot the Pressure — the UN & RE beat busting the adult myths that excuse harm.
export const MYTHS: Myth[] = [
  {
    myth: "“They didn't say no, so it's a yes.”",
    facts: [
      { text: "Consent is an active, enthusiastic yes — not the absence of a no.", ok: true },
      { text: "Silence means agreement.", ok: false },
    ],
    re: "Consent is an active yes — silence, freezing or going along with it isn't consent.",
  },
  {
    myth: "“We're together, so it's assumed.”",
    facts: [
      { text: "A relationship is never blanket consent — it's a fresh yes every time.", ok: true },
      { text: "Being a couple means it's always yes.", ok: false },
    ],
    re: "Being together never assumes consent — each time is its own yes.",
  },
  {
    myth: "“They came back to mine, so…”",
    facts: [
      { text: "Coming over is not consent to anything.", ok: true },
      { text: "Coming up means they wanted it.", ok: false },
    ],
    re: "Coming over, flirting or a date are never consent — only a yes is.",
  },
  {
    boss: true, myth: "“They were drunk / dressed for it.”",
    facts: [
      { text: "Incapacitation isn't consent, and clothes never imply a yes.", ok: true },
      { text: "They were asking for it.", ok: false },
    ],
    re: "Nothing about what someone drank or wore is consent — and it's never the survivor's fault.",
  },
];
export const MYTH_UN = "These are the myths that excuse harm — and hearing them isn't your fault. Let's rub it out.";
export const MYTH_MISS = "That's the myth talking — pick the real consent standard.";

// 4 · After Harm — Support: respond well when someone discloses. Believe · don't blame · follow their lead.
export const SUPPORT_SCENES: Scene[] = [
  {
    emoji: "🫂", situation: "A friend quietly tells you that someone assaulted them.",
    options: [
      { text: "“I believe you. It's not your fault. I'm here.”", ok: true },
      { text: "Ask what they were wearing or how much they drank", ok: false },
    ],
    result: "Believe, never blame — that first response matters more than anything else.",
  },
  {
    emoji: "🕊️", situation: "They're not sure they want to report it or tell anyone yet.",
    options: [
      { text: "Follow their lead — ask what they need, don't push", ok: true },
      { text: "Tell them they have to report it right now", ok: false },
    ],
    result: "Survivor-led means their choices, at their pace — you ask what they need.",
  },
  {
    emoji: "🤝", situation: "You want to help them find support.",
    options: [
      { text: "Gently signpost a counsellor or helpline, and stay with them", ok: true },
      { text: "Promise to handle it yourself and tell others", ok: false },
    ],
    result: "Signpost real help and keep their trust — they decide each next step.",
  },
];
export const SUPPORT_MISS = "Survivor-first: believe, don't blame, and follow their lead.";

// 5 · Tools & Ask Anything — quick references + private Q&A with urgent help-routing (survivor-centred).
export const ASK: AskItem[] = [
  { q: "Can someone change their mind partway?", a: "Yes — always. Consent is ongoing and reversible; either person can stop at any point, no reason needed." },
  { q: "When can't someone consent?", a: "When they're drunk, high or otherwise incapacitated, asleep, or pressured — or when there's a power imbalance. A sober-enough, free yes is the standard." },
  { q: "If both of us were drinking, whose fault is it?", a: "Harm is the responsibility of the person who caused it — never the survivor, whatever they drank or wore." },
  { q: "Someone pressured, coerced or assaulted me — or my friend.", a: "It's not your fault, and you deserve support. Talk to a trusted person or counsellor now, or call Women Helpline 181 / 1091, or Emergency 112. A campus Internal Committee or counsellor can help confidentially.", help: true },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Consent is an active, ongoing, sober-enough yes — nothing less. Let's read real situations and get it right, together.",
  home: "What next?",
  real: "Real situations — what's the consent-first move?",
  capacity: "Drinks & capacity — when can't someone consent?",
  pressure: "Spot the pressure — bust the myths that excuse harm, with UN and RE.",
  support: "After harm — how to support a survivor.",
  ask: "Tools & Ask Anything — private, and help is always here.",
  badge: "Badge earned!",
  busted: "Busted — that's the real standard.",
  complete: "You've got it: consent is an enthusiastic, ongoing, sober-enough yes — and if harm happens, you believe, never blame, and point to help. That's looking out for each other. 💚",
};
