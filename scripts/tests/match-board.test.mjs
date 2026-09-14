// Match board layout (SWED-68): no pair may sit straight across, and at most one pair in a neighbouring row.
// Run: node --test scripts/tests/match-board.test.mjs   (Node 23.6+ loads the TypeScript source directly)
import { test } from "node:test";
import assert from "node:assert/strict";
import { derange, matchBoard } from "../../src/content/games/v2-schema.ts";

const DRAWS = 10_000;
const isPerm = (p, n) => p.length === n && new Set(p).size === n && p.every((v) => Number.isInteger(v) && v >= 0 && v < n);
const near = (p) => p.filter((v, i) => Math.abs(v - i) === 1).length;

function allValid(n) {
  const out = [];
  const walk = (prefix, rest) => {
    if (!rest.length) { if (prefix.every((v, i) => v !== i) && near(prefix) <= 1) out.push(prefix.join()); return; }
    rest.forEach((v, i) => walk([...prefix, v], [...rest.slice(0, i), ...rest.slice(i + 1)]));
  };
  walk([], Array.from({ length: n }, (_, i) => i));
  return out;
}

test("derange never leaves an item on its own row", () => {
  for (const n of [2, 3, 4, 5, 6]) {
    for (let d = 0; d < DRAWS; d++) {
      const p = derange(n);
      assert.ok(isPerm(p, n), `n=${n}: not a permutation: ${p}`);
      assert.ok(p.every((v, i) => v !== i), `n=${n}: item on its own row: ${p}`);
    }
  }
});

test("from four items up, at most one item lands in a neighbouring row", () => {
  for (const n of [4, 5, 6]) {
    for (let d = 0; d < DRAWS; d++) assert.ok(near(derange(n)) <= 1, `n=${n}: too many neighbours`);
  }
});

test("five-item derangements are spread across every valid layout", () => {
  const valid = allValid(5);
  const seen = new Map();
  for (let d = 0; d < DRAWS; d++) { const k = derange(5).join(); seen.set(k, (seen.get(k) ?? 0) + 1); }
  assert.equal(seen.size, valid.length, `saw ${seen.size} of ${valid.length} valid layouts`);
  const expected = DRAWS / valid.length;
  for (const [k, c] of seen) assert.ok(c > expected * 0.6 && c < expected * 1.4, `layout ${k} drawn ${c} times, expected about ${expected.toFixed(0)}`);
});

test("matchBoard never puts a pair straight across", () => {
  for (const n of [3, 5]) {
    let adjacentBoards = 0;
    for (let d = 0; d < DRAWS; d++) {
      const { left, right } = matchBoard(n);
      assert.ok(isPerm(left, n) && isPerm(right, n));
      const rowR = new Map(right.map((pair, row) => [pair, row]));
      const gaps = left.map((pair, row) => Math.abs(rowR.get(pair) - row));
      assert.ok(gaps.every((g) => g > 0), `n=${n}: a pair shares a row`);
      if (n >= 4) assert.ok(gaps.filter((g) => g === 1).length <= 1, `n=${n}: more than one neighbouring pair`);
      if (gaps.includes(1)) adjacentBoards++;
    }
    if (n === 5) console.log(`n=5: ${((adjacentBoards / DRAWS) * 100).toFixed(1)}% of boards have one pair in a neighbouring row`);
  }
});
