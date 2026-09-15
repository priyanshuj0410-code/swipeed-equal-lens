import type { Card, RunDeck, RunDeckId } from "@/lib/types";
import { RUN_CARDS } from "@/content/cards-runs";

// GLRL 2.0 story-run decks: each is an escalation arc around one character, with two branching
// forks and a boss card. The fork `choices[].branch` values match the `branch_id` on the cards in
// cards-runs.ts; the run engine (Phase 2) assembles the played sequence from the main line plus the
// chosen branch lanes, ordered by escalation_step. Resolution copy is shown on the outcome screen.
export const RUN_DECKS: RunDeck[] = [
  {
    id: "new-crush",
    title: "New Crush",
    blurb: "Sweet beginnings, then disguised intensity and control. Help Meera read it.",
    emoji: "💞",
    accent: "oklch(0.72 0.16 0)",
    character: "meera",
    schoolComfortSafe: false,
    bossCardId: "nc_10",
    forks: [
      {
        afterStep: 4,
        prompt: "“You're my whole world”, sweet, or too much, too fast? What do you tell Meera?",
        choices: [
          { branch: "talk", label: "Talk it out", hint: "Name how it feels and see how he responds", teaches: "communication" },
          { branch: "brush", label: "Brush it off", hint: "Let it go and hope it settles", teaches: "(what happens if you don't speak up)" },
          { branch: "enjoy", label: "Lean in", hint: "Enjoy the intensity for now", teaches: "(spotting where intensity leads)" },
        ],
      },
      {
        afterStep: 7,
        prompt: "He wants to “prove the trust.” What should Meera do?",
        choices: [
          { branch: "boundary", label: "Set a boundary", hint: "Keep her phone private", teaches: "boundary-setting" },
          { branch: "comply", label: "Give in", hint: "Share the password to keep the peace", teaches: "(where giving in leads)" },
          { branch: "quiet", label: "Stay quiet", hint: "Say nothing and avoid a fight", teaches: "(why silence isn't safety)" },
        ],
      },
    ],
    resolution: {
      clear: "Meera names the pattern, possessiveness dressed as love, and steps back with her head high.",
      reflect: "The signs were there, weren't they? Let's look again together, no blame, just another read.",
    },
  },
  {
    id: "toxic-friend",
    title: "The Toxic Friend",
    blurb: "Loyalty and honesty vs jealousy, sabotage and betrayal. Help Aisha see clearly.",
    emoji: "🎭",
    accent: "oklch(0.7 0.15 300)",
    character: "aisha",
    schoolComfortSafe: true,
    bossCardId: "tf_10",
    forks: [
      {
        afterStep: 4,
        prompt: "Her friend mocked Aisha's “no.” What now?",
        choices: [
          { branch: "talk", label: "Talk it out", hint: "Tell her it stung", teaches: "communication" },
          { branch: "brush", label: "Let it go", hint: "Say nothing this time", teaches: "(where letting it slide leads)" },
          { branch: "confront", label: "Confront her", hint: "Call it out in front of everyone", teaches: "(reading the reaction)" },
        ],
      },
      {
        afterStep: 7,
        prompt: "The “jokes” keep coming. How does Aisha handle it?",
        choices: [
          { branch: "boundary", label: "Set a boundary", hint: "“That's not funny to me.”", teaches: "boundary-setting" },
          { branch: "laugh", label: "Laugh along", hint: "Go with it to fit in", teaches: "(what laughing along teaches them)" },
          { branch: "quiet", label: "Withdraw", hint: "Go quiet and pull away", teaches: "(spotting isolation)" },
        ],
      },
    ],
    resolution: {
      clear: "Aisha sees it: this isn't banter, it's belittling, and she leans back toward the friends who lift her up.",
      reflect: "Some of those 'jokes' were red flags. No worries. Let's run the ones we missed and look again.",
    },
  },
  {
    id: "in-dms",
    title: "In the DMs",
    blurb: "Privacy and consent vs monitoring, pressure and grooming. Help Rohan stay safe online.",
    emoji: "💬",
    accent: "oklch(0.7 0.14 240)",
    character: "rohan",
    schoolComfortSafe: true,
    bossCardId: "dm_11",
    forks: [
      {
        afterStep: 4,
        prompt: "“Share your location, always.” What should Rohan do?",
        choices: [
          { branch: "talk", label: "Talk it out", hint: "Say he's not comfortable", teaches: "communication" },
          { branch: "share", label: "Share it", hint: "Turn it on to avoid a fuss", teaches: "(where it leads)" },
          { branch: "mute", label: "Mute & limit", hint: "Use the app's tools and tell a friend", teaches: "safe exit" },
        ],
      },
      {
        afterStep: 7,
        prompt: "They're pressuring him for a photo. What does Rohan do?",
        choices: [
          { branch: "refuse", label: "Refuse & tell someone", hint: "Say no, keep the proof, tell an adult", teaches: "refusal + help-seeking" },
          { branch: "stall", label: "Stall", hint: "Keep saying 'maybe later'", teaches: "(why pressure escalates)" },
          { branch: "freeze", label: "Freeze", hint: "Not sure what to do", teaches: "(it's never too late to tell someone)" },
        ],
      },
    ],
    resolution: {
      clear: "Rohan keeps his boundaries, saves the evidence, and tells a trusted adult: exactly right.",
      reflect: "Some of those messages were more serious than they looked. Let's look again. Remember, Get Help is always one tap away.",
    },
  },
  {
    id: "controlling-partner",
    title: "The Controlling Partner",
    blurb: "The classic slide from 'caring' to control. Help Kabir see what's really going on.",
    emoji: "🔗",
    accent: "oklch(0.66 0.16 18)",
    character: "kabir",
    schoolComfortSafe: false,
    bossCardId: "cp_10",
    forks: [
      {
        afterStep: 4,
        prompt: "“Share your location for me”, caring, or controlling? What does Kabir do?",
        choices: [
          { branch: "talk", label: "Talk it out", hint: "Say he'd rather not", teaches: "communication" },
          { branch: "agree", label: "Agree", hint: "Turn it on to avoid a fuss", teaches: "(where it leads)" },
          { branch: "ignore", label: "Dodge it", hint: "Avoid the question", teaches: "(reading the reaction)" },
        ],
      },
      {
        afterStep: 7,
        prompt: "The tears and jealousy keep coming. How does Kabir respond?",
        choices: [
          { branch: "boundary", label: "Set a boundary", hint: "Say the jealousy isn't okay", teaches: "boundary-setting" },
          { branch: "comfort", label: "Reassure them", hint: "Try to calm them down", teaches: "(why it never satisfies)" },
          { branch: "give", label: "Give in", hint: "Explain every text", teaches: "(where giving in leads)" },
        ],
      },
    ],
    resolution: {
      clear: "Kabir names it, control wearing the mask of love, and stops shrinking himself to keep the peace.",
      reflect: "A lot of that 'love' was really control. No blame. Let's run the ones we missed and look again.",
    },
  },
  {
    id: "family-boundaries",
    title: "Family & Boundaries",
    blurb: "Care vs boundary-crossing at home. Help Anaya tell the difference, kindly.",
    emoji: "🏠",
    accent: "oklch(0.72 0.13 145)",
    character: "anaya",
    schoolComfortSafe: true,
    bossCardId: "fb_10",
    forks: [
      {
        afterStep: 4,
        prompt: "An aunt is reading her messages “to keep her safe.” What should Anaya do?",
        choices: [
          { branch: "tell", label: "Tell a parent", hint: "Ask a trusted adult to back her up", teaches: "help-seeking" },
          { branch: "letgo", label: "Let it go", hint: "Say nothing", teaches: "(where snooping leads)" },
          { branch: "confront", label: "Push back", hint: "Object to the aunt directly", teaches: "(reading the reaction)" },
        ],
      },
      {
        afterStep: 7,
        prompt: "A relative's 'jokes' about her body won't stop. How does Anaya handle it?",
        choices: [
          { branch: "boundary", label: "Set a boundary", hint: "Say it hurts", teaches: "boundary-setting" },
          { branch: "laugh", label: "Laugh it off", hint: "Keep the peace", teaches: "(what it teaches them)" },
          { branch: "quiet", label: "Withdraw", hint: "Skip the gatherings", teaches: "(spotting isolation)" },
        ],
      },
    ],
    resolution: {
      clear: "Anaya holds her boundaries kindly, and knows a caring family respects a 'no'.",
      reflect: "Some of that 'care' overstepped. Let's look again, and remember Get Help is one tap away.",
    },
  },
  {
    id: "group-chat",
    title: "The Group Chat",
    blurb: "Belonging vs pile-ons, dares and image-pressure. Help Veer keep his head.",
    emoji: "💬",
    accent: "oklch(0.7 0.15 280)",
    character: "veer",
    schoolComfortSafe: true,
    bossCardId: "gc_10",
    forks: [
      {
        afterStep: 4,
        prompt: "The group spun up a side-chat to mock someone. What does Veer do?",
        choices: [
          { branch: "speak", label: "Speak up", hint: "Say it's not cool", teaches: "standing up" },
          { branch: "silent", label: "Stay silent", hint: "Keep scrolling", teaches: "(where silence leads)" },
          { branch: "join", label: "Join in", hint: "Add a joke to fit in", teaches: "(reading the cost)" },
        ],
      },
      {
        afterStep: 7,
        prompt: "“It's just a dare. Don't be boring.” How does Veer respond?",
        choices: [
          { branch: "refuse", label: "Refuse", hint: "Say no clearly", teaches: "refusal" },
          { branch: "stall", label: "Stall", hint: "Put it off", teaches: "(why pressure escalates)" },
          { branch: "cave", label: "Cave", hint: "Do the dare", teaches: "(reading the betrayal)" },
        ],
      },
    ],
    resolution: {
      clear: "Veer reads the difference between belonging and pressure, and the friends worth keeping show themselves.",
      reflect: "Some of that 'fun' was pressure in disguise. Let's look again at the tricky ones.",
    },
  },
];

/** The three playable story arcs (Boss Rush is a mode, not a story deck: kept out of this list). */
export const STORY_DECKS = RUN_DECKS;

// Boss Rush: a gauntlet of the hardest reads, every main-line disguised card (including the bosses)
// across all decks, ordered easiest → hardest. No forks, no safeguarding cards; "Coach" frames it.
export const BOSS_RUSH_CARDS: Card[] = RUN_CARDS.filter(
  (c) => c.is_disguised && !c.branch_id && !c.is_safeguarding
).sort((a, b) => a.difficulty - b.difficulty);

export const BOSS_RUSH_DECK: RunDeck = {
  id: "boss-rush",
  title: "Boss Rush",
  blurb: "Coach's gauntlet: only the trickiest, most-disguised cards. Test your eye.",
  emoji: "🦉",
  accent: "oklch(0.7 0.16 50)",
  character: "coach",
  schoolComfortSafe: true,
  forks: [],
  bossCardId: BOSS_RUSH_CARDS[BOSS_RUSH_CARDS.length - 1]?.id ?? "",
  resolution: {
    clear: "Sharp eyes: you read the disguises that fool most people. Coach is impressed.",
    reflect: "Disguised cards are the hard ones: that's the whole point. Let's look again at the tricky ones.",
  },
};

export const RUN_DECK_BY_ID: Record<RunDeckId, RunDeck> = Object.fromEntries(
  [...RUN_DECKS, BOSS_RUSH_DECK].map((d) => [d.id, d])
) as Record<RunDeckId, RunDeck>;

// Daily Run: one deterministic story deck per calendar day (shared seed = the date).
export function dailyDeckId(date = new Date()): RunDeckId {
  const seed = Number(`${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`);
  return STORY_DECKS[seed % STORY_DECKS.length].id;
}

export function todayKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/** All cards authored for a run deck (unordered pool; the engine assembles the played sequence). */
export function runCardPool(deckId: RunDeckId): Card[] {
  return RUN_CARDS.filter((c) => c.deck === deckId);
}

/** A card by id (used by the engine to resolve the boss + branch lanes). */
export function runCardById(id: string): Card | undefined {
  return RUN_CARDS.find((c) => c.id === id);
}

/**
 * Assemble the sequence of cards a run will play, given the branch chosen at each fork.
 * Main-line cards (no branch_id) always play; a branch card plays only if its branch was chosen.
 * Ordered by escalation_step. (The engine in Phase 2 calls this once the forks are decided, or
 * incrementally; exposed here so content + assembly rules live with the data.)
 */
export function assembleRun(deckId: RunDeckId, chosenBranches: string[]): Card[] {
  const chosen = new Set(chosenBranches);
  return runCardPool(deckId)
    .filter((c) => !c.branch_id || chosen.has(c.branch_id))
    .sort((a, b) => (a.escalation_step ?? 0) - (b.escalation_step ?? 0));
}
