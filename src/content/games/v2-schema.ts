// The shared v2 "mechanic-embodying" scenario schema — the typed content format the GDD-rework v2 standard
// runs on (build bible · transition plan · per-game GDD §09 "shared templates"). Every scenario carries a
// `type` (one of ten play actions) + a typed payload, so the lesson IS the verb (no binary "tap the right
// card"). One shared engine (components/games/v2-engine.tsx) renders all ten; each game ships its own
// researched typed library + config. Used by every game in the catalog (g01–g69) and the 8 capstones.
//
// ADDING AN 11TH MECHANIC: this union is only the first of ~14 places that enumerate the mechanic set.
// The others live in v2-engine.tsx (the Play switch — now exhaustiveness-guarded) and scripts/forge/
// (common.py ALL_MECHANICS / REQUIRED_PAYLOAD / visible_fields / must_be_true_texts / shape_errors,
// forge_dedup.py struct_sig, gen_workflow.js SHAPES + the reviewer list).
// The first three now fail closed rather than silently pass; the rest still need doing by hand.

export type V2Mechanic = "reflect" | "choose" | "role-play" | "strike-rewrite" | "branch" | "sort" | "match" | "build" | "explore-label" | "spot" | "swipe";

type Base = { id: string; cat: string; persona: string; source: string; relearn: string; hook: string };

// reflect — affirm autonomy / a body-cue; EVERY option is acceptable (no wrong answer). Tap any → `affirm`.
export type ReflectScenario = Base & { type: "reflect"; prompt: string; options: string[]; affirm: string };
// choose: tap every option that fits, then Check (SWED-69). Exactly 6 options, 2 to 4 with `fits: true`. Every option
// has a `note`: why it fits (shown if the player missed it) or why it does not (shown if they picked it). Feelings,
// personal choices and safety lines stay `reflect`, where no answer is wrong.
export type ChooseScenario = Base & { type: "choose"; prompt: string; options: { text: string; fits: boolean; note: string }[] };
// role-play (voice) — say the words. Exactly one line is `best` (the assertive script); the other is passive.
export type RolePlayScenario = Base & { type: "role-play"; setup: string; yourLine: { text: string; best?: boolean }[] };
// strike-rewrite — UN erases a myth, RE writes the truth with a reason.
export type StrikeRewriteScenario = Base & { type: "strike-rewrite"; myth: { un: string; re: string; why: string } };
// branch — choose what to do; each option has a consequence; one is `best`; a `debrief` reinforces the safe way.
export type BranchScenario = Base & { type: "branch"; options: { text: string; consequence: string; outcome?: string; best?: boolean }[]; debrief: string };
// sort — drop each item into the right bin (the `key` maps item id → bin id). Telling concepts apart.
// `valence` makes a bin's meaning EXPLICIT so the engine never guesses it from the label (colour is a primary
// signal for pre-readers): pos=good/true/safe 💚, neg=bad/false/unsafe 🛑, tell=speak-up 🗣️, uhoh=careful 😬,
// neutral=non-valenced category (distinct position colour). New content always sets it; legacy bins fall back
// to the label-regex in binStyle().
export type BinValence = "pos" | "neg" | "tell" | "uhoh" | "neutral";
export type SortScenario = Base & { type: "sort"; items: { id: string; text: string }[]; bins: { id: string; label: string; valence?: BinValence }[]; key: Record<string, string> };
// match — connect each left to its right.
export type MatchScenario = Base & { type: "match"; pairs: { left: string; right: string }[] };
// build — assemble a team (order-free) or a plan (sequence) from `pieces`; `key` is the set/ordered answer.
export type BuildScenario = Base & { type: "build"; prompt: string; pieces: string[]; mode: "assemble" | "sequence"; key: string[] };
// explore-label — tap the body part (of `parts`) that matches the `find` clue; the right one (`answer`)
// lights up with a fun `reveal` fact. A wrong tap warmly re-asks (no fail). The body-lab's signature verb.
export type ExploreLabelScenario = Base & { type: "explore-label"; parts: string[]; find: string; answer: string; reveal: string };
// spot — tap the "trick"/red-flag in the `scene` (the item with trick:true is the answer); `why` explains it
// on resolve. A wrong tap warmly re-asks (no fail). The safety game's signature spot-the-trick verb.
export type SpotScenario = Base & { type: "spot"; scene: { id: string; text: string; trick: boolean }[]; why: string };
// swipe — read the `cue` and swipe it the right way: `left`/`right` are the two reading labels (e.g. "Red flag" /
// "Green flag"), `answer` is the correct side. A wrong swipe warmly re-asks (no fail); `relearn` shows on resolve.
// The teen flagship's signature green-light / red-light flag-reading verb (Green Light / Red Light, g24).
// `leftValence`/`rightValence` DECLARE what each side means, reusing the same BinValence vocabulary as sort
// bins — the engine must never infer it from the label. The old flagSide() regex did infer it, and got it
// wrong on 16 shipped scenarios: "Not consent" matches /consent/ and "Unsafe step" matches /safe/, so both
// sides painted the same affirming green and the NEGATIVE side carried it. Undeclared → side-distinct
// neutral slots, asserting nothing. A non-valenced A/B swipe declares "neutral" on both sides.
export type SwipeScenario = Base & { type: "swipe"; cue: string; left: string; right: string; answer: "left" | "right"; leftValence?: BinValence; rightValence?: BinValence };

export type Scenario =
  | ReflectScenario | ChooseScenario | RolePlayScenario | StrikeRewriteScenario | BranchScenario | SortScenario | MatchScenario | BuildScenario | ExploreLabelScenario | SpotScenario | SwipeScenario;

// A game's home categories (theme tiles + the sticker book).
export type GameCategory = { id: string; emoji: string; label: string };

// Everything the shared engine needs to render one game — the typed library + per-game copy/config.
export type V2GameConfig = {
  gameId: string; // === node.game === GameDone key === engine-host id. DO NOT RENAME.
  title: string;
  greet: string;
  scenarios: Scenario[];
  categories: GameCategory[];
  badge: { title: string; blurb: string };
  helpLine?: string; // a real-help route surfaced on every screen (spoken when tapped)
  helpLabel?: string; // the help button's text (e.g. "Get help — Childline 1098"); defaults to "Get help"
  reassureCats?: string[]; // categories whose beats end on a "never your fault" reassurance
  reassure?: string;
  // the "done" button label for the build mechanic (per game — a team / a garden / a kit / a plan)
  buildLabels?: { assemble?: string; sequence?: string };
};

export const shuffle = <T,>(a: T[]): T[] =>
  a.map((v) => [Math.random(), v] as const).sort((x, y) => x[0] - y[0]).map(([, v]) => v);

/**
 * A random permutation `p` of 0..n-1 with `p[i] !== i` for every i and at most one `|p[i] - i| === 1`: moved off
 * its own row and, for all but one item, off the rows either side. Two and three items cannot avoid neighbours,
 * so those keep the derangement and take the fewest neighbours found. One item stays put.
 */
export const derange = (n: number): number[] => {
  const ids = Array.from({ length: n }, (_, i) => i);
  if (n < 2) return ids;
  let best: number[] | null = null, bestNear = Infinity;
  for (let t = 0; t < 400; t++) {
    const p = shuffle(ids);
    if (p.some((v, i) => v === i)) continue;
    const near = p.filter((v, i) => Math.abs(v - i) === 1).length;
    if (near <= 1) return p;
    if (near < bestNear) { best = p; bestNear = near; }
  }
  return best ?? ids.map((i) => (i + 1) % n);
};

/**
 * Row layout for a match board: `left[row]` and `right[row]` are the pair indices shown in that row. The left
 * column is shuffled and the right column deranged against it, so no pair ever sits straight across.
 */
export const matchBoard = (n: number): { left: number[]; right: number[] } => {
  const left = shuffle(Array.from({ length: n }, (_, i) => i));
  const move = derange(n);
  const right: number[] = new Array(n);
  left.forEach((pair, row) => { right[move[row]] = pair; });
  return { left, right };
};
export const byCat = (s: Scenario[], c: string) => s.filter((x) => x.cat === c);
export const byType = (s: Scenario[], t: V2Mechanic) => s.filter((x) => x.type === t);
export const MECHANIC_OF = (s: Scenario): V2Mechanic => s.type;
