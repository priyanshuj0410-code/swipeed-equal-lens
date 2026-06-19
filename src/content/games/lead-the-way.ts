// "Lead the Way" — ages 15–18, UNESCO topic 3.2 (structural inequality at work).
// Life-and-work SIM with a light data dashboard. Each decision is a structural barrier
// (pay gap, the unpaid 'second shift', hiring bias, mobility/safety, parental leave, the
// glass ceiling). Fair choices move three equality meters toward parity; the status-quo
// choice reveals a "years later" cost (no-fail, then rethink). India adaptation: low female
// labour-force participation, unpaid care, mobility & safety, the pay gap. Structural, not
// blaming any gender.

export type Metric = "pay" | "lead" | "care";

export const METRIC_LABEL: Record<Metric, string> = {
  pay: "Equal pay",
  lead: "Women leading",
  care: "Care shared",
};

export const START: Record<Metric, number> = { pay: 50, lead: 30, care: 25 };

export type Decision = {
  scene: string;
  emoji: string;
  metric: Metric;
  gain: number;
  fair: string;
  fairNote: string;
  statusQuo: string;
  cost: string; // the "years later" downstream cost
};

export const DECISIONS: Decision[] = [
  {
    scene: "Anaya does the same job as Raj — but is offered less pay.",
    emoji: "💰",
    metric: "pay",
    gain: 25,
    fair: "Negotiate equal pay for equal work",
    fairNote: "Equal pay for equal work.",
    statusQuo: "Accept less, to seem grateful",
    cost: "Underpaid for years, talented women leave — the gap costs everyone.",
  },
  {
    scene: "Both partners work full-time, but Meena does all the housework and childcare.",
    emoji: "🧺",
    metric: "care",
    gain: 38,
    fair: "Share the care work 50/50",
    fairNote: "A shared second shift.",
    statusQuo: "She works a 'second shift' alone",
    cost: "Exhausted, she's forced to quit — a top reason women leave work in India.",
  },
  {
    scene: "Two equal candidates; the panel assumes the woman 'will just leave to have kids'.",
    emoji: "📋",
    metric: "lead",
    gain: 35,
    fair: "Hire on merit; set fair hiring rules",
    fairNote: "Hired on merit.",
    statusQuo: "Pick the man, 'to be safe'",
    cost: "Bias shrinks the talent pool — and keeps leadership male.",
  },
  {
    scene: "A better-paid job is across the city; safe, affordable travel is a worry.",
    emoji: "🚆",
    metric: "pay",
    gain: 25,
    fair: "Back safe transport & flexible hours",
    fairNote: "Safe travel opens doors.",
    statusQuo: "She turns the job down",
    cost: "Mobility & safety limits shrink women's options — a real barrier in India.",
  },
  {
    scene: "New parents both want to keep their careers going.",
    emoji: "🍼",
    metric: "care",
    gain: 37,
    fair: "Equal parental leave for both",
    fairNote: "Both stay in their careers.",
    statusQuo: "Only the mother takes all the leave",
    cost: "Her career stalls while his races ahead.",
  },
  {
    scene: "Very few women reach senior roles in the company.",
    emoji: "🏢",
    metric: "lead",
    gain: 35,
    fair: "Mentor & promote women leaders",
    fairNote: "The ceiling cracks.",
    statusQuo: "Keep the old boys' club",
    cost: "The glass ceiling holds; diverse leadership is lost.",
  },
];
