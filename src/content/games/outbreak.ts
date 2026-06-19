// Outbreak: Stop the Spread (node #23, ages 12–15) — the SRH infection step of Chapter 4. Stop the
// outbreak with KNOWLEDGE, not fear — and the real enemy is STIGMA, never the people who have an
// infection. Picks up condoms (Plan It #22) and the body's-defences idea (Defenders #20), turned toward
// infection. Knowledge-not-fear, compassion-not-shame; testing/treatment normalised; U=U. No punitive
// fail; condom depth gated by School-Comfort.

export type Option = { text: string; ok: boolean };
export type Fact = { emoji: string; say: string };

// 1 · Outbreak! — the strategy sim: deploy the tools that stop a spread (they stack).
export const DEPLOY_TOOLS = [
  { emoji: "📚", label: "Education", say: "Knowledge spreads faster than the infection." },
  { emoji: "🛡️", label: "Condoms", say: "A barrier that blocks transmission." },
  { emoji: "🧪", label: "Testing", say: "Testing finds infections early." },
  { emoji: "💊", label: "Treatment", say: "Treatment keeps people well — and stops transmission." },
  { emoji: "💉", label: "Vaccines", say: "The HPV vaccine prevents infection." },
];
export const OUTBREAK_CONTAINED = "Outbreak contained — with knowledge, not fear!";

// 2 · How It Spreads (& How It Doesn't) — the UN & RE myth-bust; specific routes, NOT casual contact.
export type Myth = { myth: string; facts: Option[]; re: string; boss?: boolean };
export const MYTHS: Myth[] = [
  {
    myth: "“You can catch HIV from a hug or sharing food.”",
    facts: [{ text: "You can't — HIV isn't spread by casual contact.", ok: true }, { text: "Yes — avoid them.", ok: false }],
    re: "HIV isn't spread by casual contact — hugs, sharing food and everyday closeness are all safe.",
  },
  {
    myth: "“Mosquitoes or toilet seats spread HIV.”",
    facts: [{ text: "They don't — HIV spreads only by specific routes.", ok: true }, { text: "Yes, they do.", ok: false }],
    re: "Mosquitoes and toilet seats do not spread HIV.",
  },
  {
    myth: "“You can tell who has an STI by looking.”",
    facts: [{ text: "You can't — many infections have no signs; only testing tells.", ok: true }, { text: "Yes, you can tell.", ok: false }],
    re: "You can't tell by looking — many infections have no visible signs. Only testing tells.",
  },
  {
    boss: true, myth: "“Only certain kinds of people get STIs.”",
    facts: [{ text: "Anyone can — it's not about character; stigma is the real harm.", ok: true }, { text: "It's their own fault.", ok: false }],
    re: "Anyone can get an infection — it's not about character. Stigma is the real harm.",
  },
];
export const MYTH_UN = "That myth is what fuels stigma — and it's not your fault for hearing it. Let's rub it out.";
export const MYTH_MISS = "That's the myth talking — pick the fact that stops the stigma.";

// 3 · Your Defense Kit — layered prevention; they stack. Condom depth gated by School-Comfort.
export const KIT_BASE: Fact[] = [
  { emoji: "🛑", say: "Delaying / not having sex — respected, and 100% effective." },
  { emoji: "💉", say: "The HPV vaccine prevents some infections." },
  { emoji: "🧪", say: "Regular testing catches infections early." },
];
export const KIT_OPEN: Fact[] = [ // shown only when School-Comfort is OFF
  { emoji: "🛡️", say: "Condoms block transmission — and protect against pregnancy too." },
];

// 4 · Test, Treat, Live Well — fear removed.
export const TEST_TREAT: Fact[] = [
  { emoji: "🧪", say: "Getting tested is normal and smart — never shameful." },
  { emoji: "💊", say: "HIV is manageable with treatment." },
  { emoji: "🟰", say: "U = U: effective treatment means HIV can't be passed on." },
  { emoji: "💚", say: "Many STIs are completely curable." },
];

// 5 · End the Stigma + Ask Anything — the heart: dignity and support, and where to get help.
export const STIGMA = {
  claim: "“People with HIV or an STI are dangerous or shameful.”",
  un: "There's nothing shameful or dangerous about a person with an infection — and it's not your fault for absorbing that idea. Let's rub it out.",
  re: "They deserve the same dignity and support as anyone. Ending stigma is how we stop the spread.",
};
export const PLEDGE = "I'll treat people with an infection with dignity — and judge no one.";
export const HELP_LINE = "Get tested or get help: a NACO ICTC centre · an RKSK clinic · a doctor · a trusted adult · Childline 1098.";

export const BADGE_TARGET = 5;

export const SAM = {
  greet: "Stop the outbreak with knowledge, not fear — and remember: the real enemy is stigma, never people.",
  home: "What next, responder?",
  outbreak: "Outbreak! Deploy your tools to stop the spread — they stack.",
  spreads: "How it spreads — and how it doesn't. Bust the myth that fuels stigma.",
  kit: "Your Defense Kit — layered prevention. Tap each.",
  testTreat: "Test, treat, live well. Tap each one.",
  endStigma: "The heart of it: end the stigma. Let's bust it with UN and RE.",
  badge: "Responder badge earned!",
  busted: "Busted — knowledge beats fear.",
  complete: "You stopped the spread with knowledge, normalised testing, and ended the stigma. Real win! 🧫",
};
