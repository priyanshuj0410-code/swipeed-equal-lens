// "Stand Up" — ages 12–15, UNESCO topics 3.3 & 2.2 (safe bystander action + rights).
// Branching scenario + the 4 Ds bystander toolkit: Distract, Delegate, Document, Direct.
// The player always chooses a SAFE action (never put yourself at risk); each scenario ends
// on a rights & helpline card. India adaptation: 'eve-teasing' realism, image-abuse, coercive
// control; women's helpline 181, Childline 1098, POCSO for under-18s, cybercrime.gov.in.
// Never victim-blaming; safety first.

export type DName = "Distract" | "Delegate" | "Document" | "Direct";

export const D_INFO: Record<DName, { blurb: string }> = {
  Distract: { blurb: "You took attention off the situation — safe and clever." },
  Delegate: { blurb: "You brought in someone with authority — smart and safe." },
  Document: { blurb: "You kept proof without resharing — that really helps." },
  Direct: { blurb: "You spoke up safely and clearly — well done." },
};

export const D_LEGEND: { d: DName; what: string }[] = [
  { d: "Distract", what: "take attention off it" },
  { d: "Delegate", what: "get an adult who can act" },
  { d: "Document", what: "safely record proof" },
  { d: "Direct", what: "safely say something" },
];

export type BystanderOption = { d?: DName; label: string; safe: boolean };
export type StandScenario = { scene: string; emoji: string; options: BystanderOption[]; right: string };

export const SCENARIOS: StandScenario[] = [
  {
    scene: "On the bus, a man keeps standing too close to a girl and won't move away.",
    emoji: "🚌",
    options: [
      { d: "Distract", label: "Ask her loudly: “Is this your stop too?”", safe: true },
      { d: "Delegate", label: "Tell the conductor or a nearby adult", safe: true },
      { d: "Direct", label: "Say calmly: “Please give her space.”", safe: true },
      { label: "Shove him away yourself", safe: false },
    ],
    right: "This is harassment. Women's helpline 181 · Childline 1098 for anyone under 18.",
  },
  {
    scene: "The class group-chat is passing around a girl's photo to mock her.",
    emoji: "📱",
    options: [
      { d: "Document", label: "Screenshot it as proof — don't reshare", safe: true },
      { d: "Delegate", label: "Report it to a teacher or parent", safe: true },
      { d: "Direct", label: "Message the group: “Not okay. Delete it.”", safe: true },
      { label: "Forward it so everyone sees what happened", safe: false },
    ],
    right: "Sharing such images is an offence. POCSO protects under-18s · report at cybercrime.gov.in.",
  },
  {
    scene: "Your friend's boyfriend checks her phone and tells her what she can wear.",
    emoji: "📵",
    options: [
      { d: "Direct", label: "Tell her gently: “That's control, not love.”", safe: true },
      { d: "Delegate", label: "Help her talk to a trusted adult or counsellor", safe: true },
      { d: "Distract", label: "Invite her out so she has space to think", safe: true },
      { label: "Confront him angrily in public", safe: false },
    ],
    right: "Controlling a partner is abuse, not love. Women's helpline 181 can help.",
  },
];
