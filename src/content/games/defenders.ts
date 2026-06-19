// Defenders of the Body (node #20, ages 9–12) — closes Chapter 3. A gentle "defend the body's city"
// game: place good-habit defences to stop germs, power up with real facts to blast the "myth-germs"
// (UN & RE), and learn the biggest lesson — people who are unwell deserve CARE, not fear. HIV is taught
// at facts + anti-stigma level only (sexual transmission waits for Outbreak #23). No punishing fail.
// Grows Smart Screen Heroes (#12): its hygiene + "be kind to a sick friend" become real habits + a full
// anti-stigma storyline.

export type Option = { text: string; ok: boolean };

// 1 · Defend the Body — place the good-habit defence that stops each germ invader.
export type Wave = { emoji: string; attack: string; options: Option[]; blocked: string };
export const DEFEND: Wave[] = [
  {
    emoji: "🖐️", attack: "A germ sneaks in on dirty hands!",
    options: [{ text: "🧼 Handwashing tower", ok: true }, { text: "🎮 Keep playing", ok: false }],
    blocked: "Blocked! Clean hands stop germs.",
  },
  {
    emoji: "🦠", attack: "A disease tries to invade!",
    options: [{ text: "🛡️ Vaccine shield", ok: true }, { text: "🍭 Eat sweets", ok: false }],
    blocked: "Blocked! Vaccines shield the body.",
  },
  {
    emoji: "🩸", attack: "A germ aims for an open cut!",
    options: [{ text: "🩹 Cover the cut", ok: true }, { text: "🤝 Share a blade", ok: false }],
    blocked: "Blocked! Covered cuts — and never sharing blades — keep germs out.",
  },
];
export const DEFEND_MISS = "That won't stop the germ — pick the good-habit defence!";

// 2 · Stay Healthy — the everyday habits that keep you well.
export const STAY_HEALTHY = [
  { emoji: "🧼", say: "Wash your hands well." },
  { emoji: "💧", say: "Drink clean water." },
  { emoji: "💉", say: "Get your vaccines." },
  { emoji: "🩹", say: "Cover cuts; never share blades or needles." },
  { emoji: "😴", say: "Eat well and sleep well." },
];

// 3 · Fact Power-Ups — the UN & RE core: blast the myth-germs with the real fact.
export type MythGerm = { emoji: string; myth: string; facts: Option[]; re: string; boss?: boolean };
export const MYTH_GERMS: MythGerm[] = [
  {
    emoji: "🤗", myth: "“You can catch HIV from a hug!”",
    facts: [{ text: "You can't — not from everyday contact.", ok: true }, { text: "Yes — stay away from them.", ok: false }],
    re: "You can't catch HIV from a hug, sharing food, or playing — it spreads only in specific ways, like blood.",
  },
  {
    emoji: "💀", myth: "“HIV is a death sentence!”",
    facts: [{ text: "It's manageable with medicine.", ok: true }, { text: "There's no hope.", ok: false }],
    re: "HIV is manageable with medicine — people with HIV live long, full lives.",
  },
  {
    emoji: "🦟", myth: "“You get HIV from mosquitoes or sharing food!”",
    facts: [{ text: "No — neither spreads HIV.", ok: true }, { text: "Yes — avoid both.", ok: false }],
    re: "Mosquitoes and sharing food do not spread HIV.",
  },
  {
    emoji: "👀", boss: true, myth: "“You can tell who has HIV by looking!”",
    facts: [{ text: "No — you can't tell by looking.", ok: true }, { text: "Yes — they look sick.", ok: false }],
    re: "You can't tell by looking — and people with HIV deserve care and friendship, not fear.",
  },
];
export const MYTH_UN = "Lots of people fear that one — it's a myth, and it's not your fault for hearing it. Let's blast it.";
export const MYTH_MISS = "That's the myth talking! Pick the real fact to blast the myth-germ.";

// 4 · Bust the Stigma — the warm storyline: befriend a classmate living with HIV.
export type StigmaChoice = { label: string; care: boolean; result: string };
export type StigmaScene = { emoji: string; situation: string; choices: StigmaChoice[] };
export const STIGMA_SCENES: StigmaScene[] = [
  {
    emoji: "🍱", situation: "Ravi, your classmate, has HIV. It's lunchtime.",
    choices: [
      { label: "Sit with him and share lunch", care: true, result: "You can't catch HIV from sharing food — and friendship is exactly right. 💛" },
      { label: "Move to another table", care: false, result: "Ravi felt left out — and HIV doesn't spread from everyday contact. Try again?" },
    ],
  },
  {
    emoji: "🏏", situation: "Ravi wants to join the cricket game.",
    choices: [
      { label: "“Come play with us!”", care: true, result: "Of course — you can't catch HIV from playing. Everyone's welcome!" },
      { label: "Tell him he can't join", care: false, result: "That's unfair — HIV doesn't spread from playing. Try again?" },
    ],
  },
];

// 5 · Health Helpers — where to get help; HIV and most infections are treatable.
export const HEALTH_HELPERS = [
  { emoji: "🧑‍⚕️", say: "A doctor — for check-ups and medicine." },
  { emoji: "🏥", say: "A hospital or clinic." },
  { emoji: "👩‍⚕️", say: "An ASHA or health worker in your community." },
  { emoji: "💊", say: "HIV and most infections are treatable." },
];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Defend the body's city! Good habits and real facts beat the germs — and the biggest lesson: care, not fear.",
  home: "Which defence next?",
  defend: "Germs incoming! Pick the good-habit defence.",
  stayHealthy: "Build up your healthy habits — tap each one.",
  factPowerUps: "Myth-germs! Blast each one with the real fact (UN and RE).",
  bustStigma: "Meet Ravi — a classmate with HIV who loves the same games. What do you do?",
  healthHelpers: "Health Helpers — tap each one.",
  badge: "Defender badge earned!",
  busted: "Blasted! Myth-germ busted with a fact.",
  complete: "You defended the body, busted the myths, and chose care, not fear. True Defender! 🦠➡️💪",
};
