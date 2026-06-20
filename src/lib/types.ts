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

/** The three 2.0 story-run decks (escalation arcs around a recurring character), plus the
 *  Boss Rush mode (a gauntlet of the hardest disguised/boss cards across all decks). */
export type StoryDeckId =
  | "new-crush"
  | "toxic-friend"
  | "in-dms"
  | "controlling-partner"
  | "family-boundaries"
  | "group-chat";
export type RunDeckId = StoryDeckId | "boss-rush";

export type DeckId =
  | "daily"
  | "online"
  | "friendships"
  | "family"
  | "peer"
  | "norm-busters"
  | "crushes"
  | "mythbuster"
  | RunDeckId;

export type Deck = {
  id: DeckId;
  title: string;
  blurb: string;
  emoji: string;
  accent: string; // oklch accent colour used for the deck tile
  /** Decks that are NOT school-comfort-safe (romantic framing) are hidden when School-Comfort Mode is on. */
  schoolComfortSafe: boolean;
  isDaily?: boolean;
  /** Its own game, not a Green Light/Red Light deck — hidden from the GL/RL hub. */
  standalone?: boolean;
  /** Swipe semantics for this deck. Defaults to red/green flags. */
  swipe?: { left: string; right: string };
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
  // --- 2.0 (optional, so v1 cards still validate) ---
  character?: CharacterId; // the recurring cast member this card belongs to
  escalation_step?: number; // 1-based place in a run's arc
  branch_id?: string; // which fork-branch it belongs to (omit = main line, shown to all)
  illustration_ref?: string;
};

// --- Life-Skills Toolkit (Thread C spine) — see knowledge/games/life-skills-toolkit.md ---
// The four persistent tools a child builds & levels across the whole 15-year journey.
export type ToolId = "cool-down" | "decision-steps" | "talk-it-out" | "help-map";
// Per-tool state on the profile. level 0 = locked; 1–5 = unlocked & deepened (one per chapter).
export type ToolState = { level: number; lastUsedAt?: string };

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
  // --- 2.0 run meta-progression (optional; default-merged on load) ---
  runsCompleted?: number;
  runDeckCleared?: Record<string, boolean>; // story-deck arcs finished (by RunDeckId)
  disgSeen?: number; // lifetime disguised cards seen — the headline learning signal
  disgCorrect?: number; // lifetime disguised cards read correctly
  dailyRunOn?: string; // YYYY-MM-DD the Daily Run was last taken
  muted?: boolean; // global sound mute (synced to the juice layer)
  // --- Life-Skills Toolkit (optional; default-merged). Unlocked/levelled by the Thread-C games. ---
  toolkit?: Partial<Record<ToolId, ToolState>>;
  // --- Wellbeing shell (optional; default-merged). On-device only — never a mood *value*, just cadence. ---
  calmMode?: boolean; // reduced-stimulation across the whole app
  mood?: { lastCheckDayKey?: string }; // when the gentle mood check-in was last shown (YYYY-MM-DD)
  dailyStreak?: { count: number; lastDayKey: string; freezes: number }; // the kind streak (with freezes)
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

// ───────────────────────── 2.0: runs, characters, perks ─────────────────────────

/** The small recurring, deliberately diverse cast whose relationships the player reads.
 *  `coach` is the framing mentor for non-story modes (Boss Rush), not a relationship arc. */
export type CharacterId = "meera" | "aisha" | "rohan" | "kabir" | "anaya" | "veer" | "coach";
export type Character = {
  id: CharacterId;
  name: string;
  avatar: string; // emoji stand-in until illustration_ref art lands
  pronoun: "she" | "he" | "they";
  blurb: string; // who they are — shown on the loadout / character chip
};

/** A branching choice at a fork. `branch` is the branch_id later cards are gated to. */
export type ForkChoice = {
  branch: string;
  label: string; // "Talk it out"
  hint: string; // a hint of the consequence
  teaches: string; // the skill this branch models (communication / boundary / exit)
};
/** Twice per run the story forks on a choice that changes later cards + the ending. */
export type Fork = {
  afterStep: number; // shown after this escalation_step on the main line
  prompt: string;
  choices: ForkChoice[];
};

/** A story deck = an escalation arc around one character, with two forks + a boss. */
export type RunDeck = {
  id: RunDeckId;
  title: string;
  blurb: string;
  emoji: string;
  accent: string; // oklch tile accent
  character: CharacterId;
  schoolComfortSafe: boolean; // romantic arcs are hidden in School-Comfort Mode
  forks: Fork[]; // two per run
  bossCardId: string; // the climactic, most-disguised card
  resolution: { clear: string; reflect: string }; // high- vs low-Clarity outcome copy
};

/** Insight perks ("powers") are reading/learning aids — never auto-win, never purchased. The first
 *  four are available from the start; the rest unlock by play (see `isPerkUnlocked`). */
export type PerkId =
  | "slow-mo"
  | "gut-check"
  | "truth-serum"
  | "calm-mind"
  | "x-ray"
  | "streak-shield"
  | "combo-master"
  | "boss-bane";
export type Perk = {
  id: PerkId;
  name: string;
  emoji: string;
  effect: string; // player-facing description
  tag: "read" | "learn" | "comfort"; // effect category (drives synergy hints)
  unlock: string; // "Start" or an unlock condition (MVP perks are all Start)
};
