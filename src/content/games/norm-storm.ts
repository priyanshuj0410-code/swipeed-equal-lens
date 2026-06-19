// Norm Storm (node #18, ages 9–12) — the most culturally-sensitive game. The child sorts the "that's just
// how it's done" rules swirling around them onto Help / Harm / Depends (the REASON matters as much as the
// bin), celebrates the traditions worth keeping (Keep the Good — the crucial balance), plays Rights Cards
// on harmful norms (UN & RE), sees norms that have already changed, and reflects in My Voice. The message
// is never "your culture is bad" — it's "keep the good, question the harmful; questioning is part of a
// living culture." No-fail. The most sensitive norms (dowry/seclusion) are School-Comfort-gated.

export type Bin = "help" | "harm" | "depends";
export type Norm = { emoji: string; text: string; bin: Bin; reason: string };

export const NORMS: Norm[] = [
  { emoji: "🧓", text: "“Respect and care for your elders.”", bin: "help", reason: "Yes — a lovely tradition worth keeping." },
  { emoji: "🤝", text: "“Look after each other in the family and community.”", bin: "help", reason: "Yes — caring for each other helps everyone." },
  { emoji: "👶", text: "“Sons are needed to carry the family name.”", bin: "harm", reason: "Son-preference harms — every child is equally precious." },
  { emoji: "🏫", text: "“Girls shouldn't study far from home.”", bin: "harm", reason: "That harms — every child has the right to education." },
  { emoji: "🧹", text: "“Boys shouldn't do housework.”", bin: "harm", reason: "That harms fairness — everyone shares the work." },
  { emoji: "🎉", text: "“Dress up for festivals.”", bin: "depends", reason: "It depends — usually just fun and culture!" },
];
// Gated harmful norm — shown only when School-Comfort is OFF (with facilitator support).
export const GATED_NORM: Norm = { emoji: "⚠️", text: "“A bride's family must give dowry.”", bin: "harm", reason: "Dowry harms — and it's illegal. Every family is equal." };

export const SORT_MISS = "Think about who it helps and who it harms — try another bin.";

// Keep the Good — the helpful traditions worth keeping (celebrates culture).
export const KEEP_GOOD = [
  { emoji: "🧓", say: "Respect and care for elders." },
  { emoji: "🫶", say: "Looking after each other." },
  { emoji: "🪔", say: "Festivals and celebrations." },
  { emoji: "🍵", say: "Hospitality and welcome." },
  { emoji: "🤗", say: "Community and kindness." },
];

// Rights Trump Harm — the UN & RE beat: a Rights Card trumps a harmful "it's tradition" norm.
export const RIGHTS_TRUMP = {
  norm: "“It's always been done this way, so it must be right.”",
  un: "“It's always been done this way” doesn't make a rule fair — and it's not your fault for hearing it. Let's rub that part out.",
  re: "Norms are made by people. Some help, some harm — and the harmful ones can change. We keep the good ones.",
};
export const RIGHTS_CARDS = ["📚 go to school", "🛡️ be safe", "⚖️ be treated equally", "🎈 play", "🗣️ have a say"];

// Norms Change — bright examples of harmful norms that have already changed.
export const NORMS_CHANGED = [
  { emoji: "🏫", say: "Girls go to school now — that wasn't always allowed." },
  { emoji: "🗳️", say: "Women vote, work and lead." },
  { emoji: "👨‍🍳", say: "More men cook and care at home." },
  { emoji: "✊", say: "Proof: harmful norms can — and do — change." },
];

// My Voice — name one tradition to keep, and one to respectfully question.
export const KEEP_CHOICES = ["Respect for elders", "Festivals together", "Caring for each other"];
export const QUESTION_CHOICES = ["“Only girls do housework”", "“Sons matter more”", "“Girls can't study far”"];

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "A storm of “that's just how it's done” rules is swirling! Let's sort them — keep the good, question the harmful.",
  home: "Which one next?",
  sort: "Help, harm, or depends? Sort the norm — and your reason matters most.",
  keepGood: "Let's celebrate the traditions worth keeping. Tap each one.",
  rightsTrump: "A harmful norm dressed as tradition. Play a Rights Card and bust it with UN and RE.",
  normsChange: "Norms can change — look! Tap each one.",
  myVoice: "Your voice: pick one tradition to keep, and one to respectfully question.",
  badge: "Norm Storm badge earned!",
  complete: "You keep the good and question the harmful — that's what a living, growing culture does! 🌪️",
};
