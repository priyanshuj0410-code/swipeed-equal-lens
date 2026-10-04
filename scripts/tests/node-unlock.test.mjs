// Path node unlocking after a v2 Green Light / Red Light finish (SWED-105). GameDone saves the v2 game's stars
// under its game id, and that alone must complete g24 and open g25 for players who entered at ages 3 to 15.
// Run: node --test scripts/tests/node-unlock.test.mjs   (Node 23.6+ loads the TypeScript source directly)
import { test } from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

// The app imports through its "@/" alias (tsconfig paths): point it at src/*.ts before loading the modules.
const SRC = new URL("../../src/", import.meta.url);
registerHooks({
  resolve: (spec, ctx, next) => next(spec.startsWith("@/") ? new URL(`${spec.slice(2)}.ts`, SRC).href : spec, ctx),
});
const { NODES } = await import("../../src/content/path.ts");
const { default: GLRL } = await import("../../src/content/games/glrl.json", { with: { type: "json" } });
const { isNodeUnlocked, makeNodeCompleted, makeGameDone } = await import("../../src/lib/node-unlock.ts");

const node = (id) => NODES.find((n) => n.id === id);
// The path page's rule: done is "completed", else unlocked is "playable", else "locked".
function state(id, profile, entryAge) {
  const isDone = makeGameDone(profile.deckStars, profile.runDeckCleared);
  const n = node(id);
  return isDone(n.game) ? "completed" : isNodeUnlocked(n, makeNodeCompleted(isDone), entryAge) ? "playable" : "locked";
}
const fresh = { deckStars: {}, runDeckCleared: {} };
// What the v2 game leaves in the profile when it ends: GameDone's finishDeck(gameId, 3, ...), no story run.
const v2Finished = { deckStars: { [GLRL.gameId]: 3 }, runDeckCleared: {} };

test("g24 plays the v2 Green Light / Red Light game, and g25 needs g24", () => {
  assert.equal(node("g24").game, GLRL.gameId);
  assert.equal(node("g25").prereq, "g24");
});

test("a v2 GLRL finish completes g24 and unlocks g25 for entry ages 3, 6, 9 and 12", () => {
  for (const age of [3, 6, 9, 12]) {
    assert.equal(state("g25", fresh, age), "locked", `entry ${age}: g25 open before GLRL`);
    assert.equal(state("g24", v2Finished, age), "completed", `entry ${age}: g24`);
    assert.equal(state("g25", v2Finished, age), "playable", `entry ${age}: g25`);
  }
});

test("entry at 15 or older keeps Chapter 4 open, and a v2 GLRL finish still completes g24", () => {
  for (const age of [15, 18]) {
    assert.equal(state("g25", fresh, age), "playable", `entry ${age}: g25`);
    assert.equal(state("g24", v2Finished, age), "completed", `entry ${age}: g24`);
  }
});

test("legacy GLRL completions still count: a cleared story run, or stars on a Quick Play deck", () => {
  assert.equal(state("g24", { deckStars: {}, runDeckCleared: { "new-crush": true } }, 12), "completed");
  assert.equal(state("g24", { deckStars: { online: 2 }, runDeckCleared: {} }, 12), "completed");
  assert.equal(state("g24", { deckStars: { mythbuster: 3 }, runDeckCleared: {} }, 12), "locked");
});

test("every other game completes only from stars under its own id", () => {
  const isDone = makeGameDone(v2Finished.deckStars, v2Finished.runDeckCleared);
  for (const n of NODES) if (n.game && n.game !== GLRL.gameId) assert.equal(isDone(n.game), false, n.id);
  assert.equal(makeGameDone({ "mythbuster-lab": 3 }, {})("mythbuster-lab"), true);
});
