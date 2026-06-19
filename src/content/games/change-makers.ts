// "Change Makers" — ages 15–18, UNESCO topics 3.2 & 3.3 (campaigning + rights/laws).
// Campaign SIM: pick a cause, spend a limited action-point budget on campaign cards (the
// strong, law-and-survivor ones unlock real rights and score the most; performative ones
// score little), face one realistic pushback, and measure community impact. India adaptation:
// real laws — POSH Act 2013, Prohibition of Child Marriage Act, school pad access — and
// helplines. Survivor-centred, non-graphic; builds civic literacy and agency.

export const BUDGET = 6;

export type Action = { id: string; label: string; cost: number; impact: number; law?: string };
export type Campaign = {
  key: string;
  title: string;
  emoji: string;
  actions: Action[];
  pushback: { quote: string; firm: string; firmBonus: number };
};

export const CAMPAIGNS: Campaign[] = [
  {
    key: "harassment",
    title: "Stop workplace harassment",
    emoji: "🛑",
    actions: [
      { id: "h-posh", label: "Set up a POSH Internal Committee", cost: 3, impact: 40, law: "POSH Act, 2013" },
      { id: "h-rights", label: "Run a know-your-rights workshop", cost: 2, impact: 26 },
      { id: "h-support", label: "Offer survivors a counsellor", cost: 2, impact: 24 },
      { id: "h-box", label: "Add an anonymous complaint box", cost: 2, impact: 20 },
      { id: "h-hashtag", label: "Post a hashtag online", cost: 1, impact: 8 },
    ],
    pushback: { quote: "“Why make a fuss? It's just office banter.”", firm: "Harassment is illegal under the POSH Act, 2013.", firmBonus: 15 },
  },
  {
    key: "child-marriage",
    title: "End child marriage",
    emoji: "🚸",
    actions: [
      { id: "c-pcma", label: "Stop a child wedding using the law", cost: 3, impact: 40, law: "Prohibition of Child Marriage Act" },
      { id: "c-school", label: "Scholarships to keep girls in school", cost: 2, impact: 28 },
      { id: "c-childline", label: "Connect families to Childline 1098", cost: 2, impact: 22, law: "Childline 1098" },
      { id: "c-panchayat", label: "Win over parents & the panchayat", cost: 2, impact: 20 },
      { id: "c-posters", label: "Put up posters", cost: 1, impact: 8 },
    ],
    pushback: { quote: "“But it's our tradition.”", firm: "Marriage under 18 is illegal — and girls have a right to school.", firmBonus: 15 },
  },
  {
    key: "period-stigma",
    title: "Break period stigma",
    emoji: "🩸",
    actions: [
      { id: "p-pads", label: "Win free pads in school", cost: 3, impact: 38, law: "School pad access" },
      { id: "p-health", label: "Run myth-busting health sessions", cost: 2, impact: 26 },
      { id: "p-allies", label: "Train boys as allies", cost: 2, impact: 24 },
      { id: "p-toilets", label: "Clean toilets & private disposal", cost: 2, impact: 22 },
      { id: "p-poster", label: "Make a poster", cost: 1, impact: 8 },
    ],
    pushback: { quote: "“Periods shouldn't be talked about at school.”", firm: "Period health is health — and a girl's right to stay in school.", firmBonus: 15 },
  },
];
