// Safeguarding content. Help is always one tap away; the message is clear:
// if someone is hurting you, it's not your fault.
// A row with an audience shows only to that group: "adult" to players who entered at 18 or over, "child" to
// everyone younger (and to legacy profiles with no entry age). Rows without one show to everyone (SWED-128).
export type HelpLine = {
  name: string;
  detail: string;
  href: string;
  cta: string;
  audience?: "child" | "adult";
};

export const HELP: { reassurance: string; prompt: string; adultPrompt: string; lines: HelpLine[] } = {
  reassurance: "If someone is hurting you, it's not your fault.",
  prompt: "Talk to an adult you trust, like a parent, a teacher or a relative. If they don't help, tell another one.",
  adultPrompt: "You can talk to someone you trust, or call one of these free lines.",
  lines: [
    {
      name: "Emergency: 112",
      detail: "If someone is in danger right now.",
      href: "tel:112",
      cta: "Call 112",
    },
    {
      name: "Childline India: 1098",
      detail: "Free help for children, day and night. They keep it private unless someone is being hurt.",
      href: "tel:1098",
      cta: "Call 1098",
      audience: "child",
    },
    {
      name: "Childline India: 1098",
      detail: "Call if a child needs help or protection, day and night.",
      href: "tel:1098",
      cta: "Call 1098",
      audience: "adult",
    },
    {
      name: "Women Helpline: 181",
      detail: "For women facing violence, at home or anywhere, day and night.",
      href: "tel:181",
      cta: "Call 181",
      audience: "adult",
    },
    {
      name: "Tele-MANAS: 14416",
      detail: "Free mental health support for any age, day and night: feelings, stress and low days.",
      href: "tel:14416",
      cta: "Call 14416",
    },
    {
      name: "Cybercrime helpline: 1930",
      detail: "Call if someone online asks for private photos or threatens to share them. It is not your fault.",
      href: "tel:1930",
      cta: "Call 1930",
    },
    {
      name: "POCSO e-Box (NCPCR)",
      detail: "A government website for reporting abuse of a child. It opens outside the app.",
      href: "https://ncpcr.gov.in/",
      cta: "Open e-Box",
    },
  ],
};

export function isAdultPlayer(entryAgeGate?: number) {
  return (entryAgeGate ?? 0) >= 18;
}

export function helpLinesFor(entryAgeGate?: number): HelpLine[] {
  const audience = isAdultPlayer(entryAgeGate) ? "adult" : "child";
  return HELP.lines.filter((l) => !l.audience || l.audience === audience);
}
