// Body Confident (node #21, ages 12–15) — opens Chapter 4. Continues Puberty Quest's (#13) body education
// into the teens and turns "everyone develops at a different time" into a full body-image game; extends
// Flip the Script's (#17) media literacy onto the teen's own self-image. Body-positive/neutral, NEVER
// triggering: NO weight/calorie tracking. Help-signposted. No-fail; tracker & Q&A are private.

export type Option = { text: string; ok: boolean };

// 1 · Fact or Filter — judge real vs filtered/edited; the signature UN & RE beat.
export type Shot = { emoji: string; claim: string; filtered: boolean; why: string };
export const FACT_OR_FILTER: Shot[] = [
  { emoji: "🤳", claim: "A flawless “no-makeup” selfie with perfect skin.", filtered: true, why: "Filtered — smoothing and lighting tricks. Real skin has texture." },
  { emoji: "🏋️", claim: "An influencer's “I woke up like this” gym body.", filtered: true, why: "Posed, lit and often edited — not an everyday look." },
  { emoji: "📸", claim: "A slightly blurry candid of friends laughing.", filtered: false, why: "Real — real moments aren't perfect." },
  { emoji: "💄", claim: "An ad model with impossibly smooth, even skin.", filtered: true, why: "Edited and retouched — almost no one looks like that." },
];
export const FOF_MISS = "Look again — is that “perfect” look real, or filtered?";
export const FILTER_UN = "That image is edited to look perfect — and it's not your fault for comparing. Let's slide it back to real.";
export const FILTER_RE = "Real bodies are diverse and changing. Yours is good — and you're far more than how you look.";

// 2 · My Body, My Pace — puberty in the teens + menstrual health with dignity (no weight on the tracker).
export const MY_PACE = [
  { emoji: "⏳", say: "Puberty keeps going through the teens — at everyone's own pace." },
  { emoji: "🩸", say: "Periods: track the cycle, manage pain, use the products that suit you." },
  { emoji: "🌸", say: "Menstrual health, with dignity — it's normal and healthy." },
  { emoji: "📅", say: "An optional private tracker logs your cycle and how you feel — never weight." },
];

// 3 · The Comparison Trap — body image & self-acceptance (body-neutral; never triggering).
export const COMPARISON = [
  { emoji: "📱", say: "Comparison steals your joy — your feed isn't real life." },
  { emoji: "🌈", say: "All bodies are different — and all are good." },
  { emoji: "🎨", say: "Beauty isn't a colour — every skin is good." },
  { emoji: "💛", say: "Your worth was never about your looks." },
];

// 4 · Self-Care Quests — healthy, kind self-care (never about looks).
export const SELF_CARE = [
  { emoji: "😴", say: "Sleep well — rest is real self-care." },
  { emoji: "🤸", say: "Move for joy, not as punishment." },
  { emoji: "🍎", say: "Eat to fuel your body, not to shrink it." },
  { emoji: "🛁", say: "Hygiene, rest, and kindness to yourself." },
];

// 5 · Ask Anything + Get Help — private Q&A; body-image/eating distress is signposted to support.
export type AskItem = { q: string; a: string; help?: boolean };
export const ASK_HELP: AskItem[] = [
  { q: "Is it normal to develop later than my friends?", a: "Totally — every body has its own timing. There's no “right” age." },
  { q: "I don't like how I look in photos.", a: "Most photos online are edited. Be kind to yourself — your worth isn't your looks." },
  { q: "My period is really painful — is that okay?", a: "Some cramps are normal, but bad pain is worth checking with a doctor." },
  { q: "I'm struggling with how I feel about my body or eating.", a: "You deserve support — this is common and you're not alone. Talk to a trusted adult or a counsellor, or call KIRAN 1800-599-0019 or Childline 1098.", help: true },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Your body is changing, it's yours, and it's good — you don't have to match anyone. Let's go!",
  home: "What next?",
  factOrFilter: "Real, or filtered? Spot the tricks media uses to fake “perfect”.",
  myPace: "Your body, your pace. Tap each one.",
  comparison: "The comparison trap — tap each truth.",
  selfCare: "Kind self-care, never about looks. Tap each quest.",
  askHelp: "Ask anything, privately. Tap a question.",
  badge: "Body Confident badge earned!",
  complete: "You spot the filters, look after yourself, and like who you are. You're far more than how you look. 💪",
};
