// Safeguarding content. Help is always one tap away; the message is clear:
// if someone is hurting you, it's not your fault.
export const HELP = {
  reassurance: "If someone is hurting you, it's not your fault.",
  prompt:
    "You can always talk to a trusted adult — a parent, a teacher, or your school counsellor.",
  lines: [
    {
      name: "Childline India — 1098",
      detail: "Free, 24/7, confidential help for children. Call any time.",
      href: "tel:1098",
      cta: "Call 1098",
    },
    {
      name: "Tele-MANAS — 14416",
      detail: "Free, 24/7 mental-health support (feelings, stress, low days).",
      href: "tel:14416",
      cta: "Call 14416",
    },
    {
      name: "Cybercrime helpline — 1930",
      detail: "Report grooming, sextortion or image abuse. You won't be in trouble.",
      href: "tel:1930",
      cta: "Call 1930",
    },
    {
      name: "POCSO e-Box (NCPCR)",
      detail: "Report abuse online, safely and privately.",
      href: "https://ncpcr.gov.in/",
      cta: "Open e-Box",
    },
  ],
} as const;
