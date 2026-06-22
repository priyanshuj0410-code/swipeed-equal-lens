// The shared v2 "mechanic-embodying" scenario schema — the typed content format the GDD-rework v2 standard
// runs on (build bible · transition plan · per-game GDD §09 "shared templates"). Every scenario carries a
// `type` (one of seven play actions) + a typed payload, so the lesson IS the verb (no binary "tap the right
// card"). One shared engine (components/games/v2-engine.tsx) renders all seven; each game ships its own
// researched typed library + config. Reused by Feelings Friends (g01), My Body My Rules (g02), and the rest
// of the chapter as they retrofit to v2.

export type V2Mechanic = "reflect" | "role-play" | "strike-rewrite" | "branch" | "sort" | "match" | "build" | "explore-label" | "spot";

type Base = { id: string; cat: string; persona: string; source: string; relearn: string; hook: string };

// reflect — affirm autonomy / a body-cue; EVERY option is acceptable (no wrong answer). Tap any → `affirm`.
export type ReflectScenario = Base & { type: "reflect"; prompt: string; options: string[]; affirm: string };
// role-play (voice) — say the words. Exactly one line is `best` (the assertive script); the other is passive.
export type RolePlayScenario = Base & { type: "role-play"; setup: string; yourLine: { text: string; best?: boolean }[] };
// strike-rewrite — UN erases a myth, RE writes the truth with a reason.
export type StrikeRewriteScenario = Base & { type: "strike-rewrite"; myth: { un: string; re: string; why: string } };
// branch — choose what to do; each option has a consequence; one is `best`; a `debrief` reinforces the safe way.
export type BranchScenario = Base & { type: "branch"; options: { text: string; consequence: string; outcome?: string; best?: boolean }[]; debrief: string };
// sort — drop each item into the right bin (the `key` maps item id → bin id). Telling concepts apart.
export type SortScenario = Base & { type: "sort"; items: { id: string; text: string }[]; bins: { id: string; label: string }[]; key: Record<string, string> };
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

export type Scenario =
  | ReflectScenario | RolePlayScenario | StrikeRewriteScenario | BranchScenario | SortScenario | MatchScenario | BuildScenario | ExploreLabelScenario | SpotScenario;

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
export const byCat = (s: Scenario[], c: string) => s.filter((x) => x.cat === c);
export const byType = (s: Scenario[], t: V2Mechanic) => s.filter((x) => x.type === t);
export const MECHANIC_OF = (s: Scenario): V2Mechanic => s.type;
