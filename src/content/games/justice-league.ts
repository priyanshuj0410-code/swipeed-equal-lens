// "Justice League: Rights Edition" — ages 15–18, UNESCO topics 3.3 & 2.2 (rights & redress).
// Case-based legal-literacy game. The player is an advocate: for each case they play the
// correct LAW card, then choose the correct REDRESS pathway (who to turn to), and resolve
// with a real-resource card. India adaptation: accurate laws & bodies — POSH Act 2013, DV
// Act 2005, Dowry Prohibition Act, IT Act; police/FIR, Internal Committee, Protection Officer,
// NCW, women's helpline 181, cybercrime.gov.in. Empowering, accurate, non-graphic.

export const LAW_DECK: string[] = [
  "POSH Act, 2013",
  "Domestic Violence Act, 2005",
  "Dowry Prohibition Act, 1961",
  "IT Act (online abuse)",
];

export type Case = {
  brief: string;
  emoji: string;
  correctLaw: string;
  pathways: string[];
  correctPathway: string;
  resource: string;
};

export const CASES: Case[] = [
  {
    brief: "A manager keeps making unwanted advances on a junior colleague at work.",
    emoji: "🏢",
    correctLaw: "POSH Act, 2013",
    pathways: ["The workplace Internal Committee", "cybercrime.gov.in", "A Protection Officer"],
    correctPathway: "The workplace Internal Committee",
    resource: "Every workplace with 10+ staff must have an Internal Committee to handle this.",
  },
  {
    brief: "A woman is being beaten and threatened by her husband at home.",
    emoji: "🏠",
    correctLaw: "Domestic Violence Act, 2005",
    pathways: ["A Protection Officer + helpline 181", "The Internal Committee", "cybercrime.gov.in"],
    correctPathway: "A Protection Officer + helpline 181",
    resource: "A Protection Officer can help get a protection order. Women's helpline: 181.",
  },
  {
    brief: "The groom's family is demanding cash and gold before the wedding.",
    emoji: "💍",
    correctLaw: "Dowry Prohibition Act, 1961",
    pathways: ["Police — file an FIR", "The Internal Committee", "cybercrime.gov.in"],
    correctPathway: "Police — file an FIR",
    resource: "Giving or taking dowry is a crime. File a complaint with the police.",
  },
  {
    brief: "Someone is sharing a woman's private photos online to threaten her.",
    emoji: "💻",
    correctLaw: "IT Act (online abuse)",
    pathways: ["Report at cybercrime.gov.in", "The Internal Committee", "A Protection Officer"],
    correctPathway: "Report at cybercrime.gov.in",
    resource: "Online image abuse is punishable. Report it at cybercrime.gov.in (and call 181).",
  },
];
