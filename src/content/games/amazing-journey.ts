// The Amazing Journey (node #14, ages 9–12) — opens the Sexual & Reproductive Health thread. A
// science-museum "journey" explainer: how two tiny cells become a whole new person. Wonder-first,
// science-framed, myth-free, no-fail. The one sensitive step (how the cells meet) is gated by the
// School-Comfort setting; prevention is high-level only (no methods — that waits for Plan It #22).

export type Option = { text: string; ok: boolean };

// The five stops on the journey (4 exhibits + the myth bust) — each earns a passport stamp.
export type Exhibit = { id: string; emoji: string; title: string; explain: string; explainFuller?: string; q: string; options: Option[]; stamp: string };
export const EXHIBITS: Exhibit[] = [
  {
    id: "where", emoji: "🥚", title: "Where Life Begins",
    explain: "It starts with two tiny cells: an egg cell from a woman and a sperm cell from a man.",
    explainFuller: "These two cells come together when a grown man and woman have sex.",
    q: "What two cells start a baby?",
    options: [{ text: "An egg cell and a sperm cell", ok: true }, { text: "A seed you swallow", ok: false }],
    stamp: "Egg + sperm — the start of everything!",
  },
  {
    id: "meeting", emoji: "✨", title: "The Big Meeting",
    explain: "One sperm cell joins the egg — that's called fertilisation — and the two become a single new cell.",
    q: "What is fertilisation?",
    options: [{ text: "A sperm cell joins an egg cell, making one new cell", ok: true }, { text: "Two eggs sticking together", ok: false }],
    stamp: "Fertilisation — one amazing new cell!",
  },
  {
    id: "nine", emoji: "🤰", title: "Nine Amazing Months",
    explain: "That one cell divides again and again, growing in the uterus into a whole baby over about nine months — a heartbeat, tiny fingers, the lot.",
    q: "Where does the baby grow?",
    options: [{ text: "In the uterus, over about nine months", ok: true }, { text: "In the tummy, where food goes", ok: false }],
    stamp: "Nine months in the uterus — incredible!",
  },
  {
    id: "new", emoji: "👶", title: "A New Person",
    explain: "The baby is born and joins a family. Having a baby is a big thing grown-ups plan for — and pregnancy can be prevented too.",
    q: "Having a baby is…",
    options: [{ text: "Something grown-ups plan and prepare for", ok: true }, { text: "Something that just happens to anyone", ok: false }],
    stamp: "A brand-new person joins the world!",
  },
];

// Bust the Baby Myths — the UN & RE core; choose the real science to bust each myth.
export type Myth = { emoji: string; myth: string; facts: Option[]; re: string; boss?: boolean };
export const MYTHS: Myth[] = [
  {
    emoji: "🦩", myth: "“A stork brings the baby!”",
    facts: [{ text: "Babies grow inside the uterus.", ok: true }, { text: "A big bird drops them off.", ok: false }],
    re: "No stork — a baby grows inside the uterus, from an egg and a sperm cell.",
  },
  {
    emoji: "💋", myth: "“Babies come from a kiss!”",
    facts: [{ text: "It takes an egg cell and a sperm cell.", ok: true }, { text: "Any kiss makes a baby.", ok: false }],
    re: "A kiss doesn't make a baby — it takes an egg cell and a sperm cell joining.",
  },
  {
    emoji: "🌰", myth: "“You swallow a seed!”",
    facts: [{ text: "It's a sperm cell joining an egg cell — not food.", ok: true }, { text: "You eat a special seed.", ok: false }],
    re: "Nothing to swallow — it's a sperm cell joining an egg cell, inside the body.",
  },
  {
    emoji: "🍼", boss: true, myth: "“Babies just grow in the tummy!”",
    facts: [{ text: "They grow in the uterus, from two cells.", ok: true }, { text: "They grow where food goes.", ok: false }],
    re: "Remember when we said babies grow in a tummy? Now you know the whole story: a baby grows in the uterus, from two tiny cells.",
  },
];
export const MYTH_UN = "That's a story lots of kids are told — it's not your fault. Let's rub it out.";
export const MYTH_MISS = "That's a myth too! Pick the real science to bust it.";
export const CHECK_MISS = "Not quite — try the other one.";

export const BADGE_TARGET = 5; // 4 exhibits + the myth bust

export const SAM = {
  greet: "Ready for the most amazing journey there is — how a new life begins? Let's explore!",
  home: "Which exhibit next, explorer?",
  exhibit: "Have a look, then stamp your passport with the right answer.",
  myths: "Time to bust some baby myths! Pick the real science.",
  stamp: "Passport stamped!",
  busted: "Bam! Myth busted with the real science.",
  complete: "You took the whole amazing journey — two tiny cells to a whole new person, myth-free. Wow! 🧬",
};
