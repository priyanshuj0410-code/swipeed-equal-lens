// Domain types for Green Light / Red Light. Cards are data, never hard-coded UI.

export type Flag = "green" | "red";

export type SignId =
  // Green-flag signs (swipe right)
  | "comfortable-pace"
  | "trust"
  | "honesty"
  | "independence"
  | "respect"
  | "equality"
  | "kindness"
  | "taking-responsibility"
  | "healthy-conflict"
  | "fun"
  // Red-flag signs (swipe left)
  | "intensity"
  | "possessiveness"
  | "manipulation"
  | "isolation"
  | "sabotage"
  | "belittling"
  | "guilting"
  | "volatility"
  | "deflecting-responsibility"
  | "betrayal";

export type Sign = {
  id: SignId;
  name: string;
  flag: Flag;
  definition: string;
};

export type DeckId =
  | "daily"
  | "online"
  | "friendships"
  | "family"
  | "peer"
  | "norm-busters"
  | "crushes";

export type Deck = {
  id: DeckId;
  title: string;
  blurb: string;
  /** Decks that are NOT school-comfort-safe (romantic framing) are hidden when School-Comfort Mode is on. */
  schoolComfortSafe: boolean;
  isDaily?: boolean;
};

export type Card = {
  id: string;
  deck: DeckId;
  context_tag: string;
  scenario_text: string; // <= ~240 chars, a teen's natural voice
  correct_flag: Flag;
  sign: string; // display name shown on the reveal (the most important teaching element)
  signId?: SignId; // links to one of the 20 core signs for Flag-pedia mastery
  difficulty: 1 | 2 | 3;
  is_disguised: boolean; // looks like the opposite of the correct answer
  is_safeguarding: boolean; // genuine abuse — never scored; routes to supportive screen
  feedback_short: string; // one-line "why" on the reveal
  learn_more_ref?: string;
  locale: string;
};

export type Profile = {
  onboarded: boolean;
  name: string;
  avatar: string;
  locale: string;
  schoolComfort: boolean;
  textScale: number; // 1 | 1.15 | 1.3
  coins: number;
  bestStreak: number;
  deckStars: Record<string, number>; // best stars (0-3) per deck
  signMastery: Record<string, { seen: number; correct: number }>; // by SignId
};

export type CardOutcome = {
  card: Card;
  chosen: Flag;
  correct: boolean;
};

export type DeckSummary = {
  deckId: DeckId;
  total: number; // scored cards
  correct: number;
  score: number;
  bestStreak: number;
  missed: Card[];
};
