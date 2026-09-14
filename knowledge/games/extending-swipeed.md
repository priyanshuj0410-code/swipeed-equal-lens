---
type: Playbook
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/extending-swipeed.md
title: Extending SwipeEd - adding a game, adding a mechanic
description: The complete, evidence-based checklists for the two ways SwipeEd grows - a new lesson node and an 11th play action - including the ungated steps that are easy to miss and the fail-closed guards that now catch a half-finished mechanic.
resource: https://github.com/priyanshuj0410-code/swipeed-equal-lens
tags: [swipeed, playbook, extension, mechanics, forge, engine]
timestamp: 2026-09-01T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/c9d24ac9-e08c-4f28-a82f-a07331a0ec0c  # SWED-48
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
---

# Extending SwipeEd

Two different jobs with very different costs. **Adding a game** is cheap in code and expensive in
content. **Adding a mechanic** is cheap in content and spread across ~14 files. Both have real
precedent - 77 nodes shipped, and three mechanics (`explore-label` g06, `spot` g08, `swipe` g24) were
added *after* the engine existed.

Everything here was traced from real commits and verified against the code.

## A. Adding a game

Real precedent: **g53 "Choosing & Building"** (`a7b4798`) - **6 files, +185/−1**.

### The wiring (mechanical, ~20 lines)
1. `src/content/games/<id>.ts` - the typed library. Largely a **transcription** of the Scenario Library
   JSON (see below), plus a hand-authored `V2GameConfig` tail (categories, badge, greet, helpLine).
   `gameId` must equal `node.game` *and* the engine-host key - the schema says **DO NOT RENAME**.
2. `src/components/games/<id>.tsx` - the wrapper. ~17 lines, most of them comment. No scaffold exists;
   all 77 are hand-written.
3. `src/components/games/engine-host.tsx` - one `dynamic(...)` entry. `swipeed_status.py` **blocks the
   commit** if a v2 game isn't registered here.
4. `scripts/gen-path.py` - a `GAME` entry and an `EMOJI` entry, then re-run it to regenerate
   `src/content/path.ts`.
5. `.read-first/<gNN>.json` - via `read_first.py --require` then `--attest`.
6. `scripts/master-node-table.xlsx` - **only if the row doesn't already exist.** All 77 rows were
   planned up front, so g53 got a free pass. A genuine 78th node means editing a binary spreadsheet that
   three scripts parse and no reviewer can diff; a mid-path insert renumbers `order` and rewires
   `prerequisite` on every downstream row.

### The real cost (judgment, not automated)
- **Two design docs must exist first.** `read_first.py` *refuses to attest* without `Strategy/GDD N -
  ….pdf` and `Strategy/… GDD N … Scenario Library.json`. That JSON isn't a brief - it holds the finished
  ~84 scenarios already in schema, plus `leadMechanics`, categories and an evidence base.
- **The forge run.** ~84 → 400+ scenarios costs roughly **1M tokens and ~21 minutes** per game.

### ⚠️ Ungated steps - nothing will stop you forgetting these
| Step | What happens if missed |
|---|---|
| `src/content/chapter-canvas/chapter-N.json` - authored myths + an earnable sticker for the node | The 3D path dresses each chapter from this file. No gate, and it wasn't documented anywhere before this doc. |
| The chapter capstone's `recap[]` entry + `GLYPH_EMOJI` in `capstone-schema.ts` | Silently degrades to ⭐. **This already shipped once** - fixed in `68a2e2e`. |
| **Ordering:** add the `gen-path.py` GAME entry **before** committing the content file | `read_first.py` does `if not node: continue` - it silently **skips** a new file whose gameId isn't in the GAME dict yet. The attestation gate passes without attesting. No override needed, no warning. |
| Regenerate `path.ts` before running forge | Until then `chapter_of()` returns `None`, which switches **off** both the band length ceiling and the age-band mechanic allowlist. |

## B. Adding a mechanic (an 11th play action)

Precedent sizes: each of the three historical additions shipped a schema type, a `Play` component, and
the adopting game in one commit.

### The app (2 files)
1. `src/content/games/v2-schema.ts` - add to the `V2Mechanic` union **and** add a payload type to the
   `Scenario` union.
2. `src/components/games/v2-engine.tsx` - a `case` in `Play()` and the `<XPlay>` component. Reuse
   `interactions.tsx` (`usePointerDrag`, `hitTestZone`, `ConnectorOverlay`) rather than rolling gestures.

### The pipeline (`scripts/forge/`, ~12 more places)
`common.py`: `ALL_MECHANICS` · `REQUIRED_PAYLOAD` · `visible_fields` · `must_be_true_texts` ·
`shape_errors` · `BAND_DISALLOW` (the age-band allowlist) - plus `forge_dedup.py: struct_sig`,
`gen_workflow.js` `SHAPES` **and** the adversarial reviewer's answer-key list, `forge_check.py`
`EASY_VERBS`, `bank_spec.py`, `forge_plan.py`, `check_msg_len.py` `SC_PLAIN`.

### The three guards that now catch a half-finished addition (SWED-48)
These used to fail **silently**. All three now raise:

| Guard | The old silent failure |
|---|---|
| `default: { const _exhaustive: never = sc }` in `Play()` **and** `LapView()` | A missing case compiled clean (`strict` is on but `noImplicitReturns` is not), rendered nothing and never called `onSolved` - **no fail state, player stuck**. Verified: an injected 11th union member used to give `tsc` exit 0; it now errors `Type 'DialScenario' is not assignable to type 'never'`. |
| `else: raise` in `visible_fields` | Registered in `ALL_MECHANICS`+`REQUIRED_PAYLOAD` but missing here made the ≤160 cap, the US-framing denylist, the helpline name↔number binding **and** the dedup fingerprint all fail open at once, every gate reporting green. |
| `else: raise` in `must_be_true_texts` | Silent fallthrough meant a new mechanic could assert an unverified legal or medical claim and never be flagged for web verification. |
| `raise` in `struct_sig` | Returned a bare `(t,)`, giving every scenario of the verb one signature → an O(n²) false-collision flood that made the merge gate **un-passable**. Its own guard was unreachable dead code (`and` binds tighter than `or`). |

`must_be_true_texts` now also carries **explicit no-op arms** for `role-play` and `build`, which
genuinely contribute nothing beyond `relearn` - previously indistinguishable from an accidental
omission.

### Still needing care
- **The pipeline already lags the engine.** `gen_workflow.js` `SHAPES` documents only **8 of 10**
  mechanics (`explore-label` and `swipe` are absent), and the adversarial reviewer prompt names only
  **five**. Since that reviewer is what caught the [key-inversion clusters](swipeed-content-pipeline.md),
  a new verb ships with no semantic review unless you extend it.
- **`shape_errors` has no arm for `role-play` or `strike-rewrite`**, and the `reflect` guard's body is
  literally `pass`. Don't copy the nearest precedent - it may be a hole.
- **`check_msg_len.py` is weaker than `forge_check`** on the per-field cap for 7 of 10 mechanics, and
  `forge_check`/`forge_dedup` are **not** in the pre-commit hook - they're advisory unless run.

## The honest prerequisite

There is **no test runner, no `test` script and no test files** in the app. The forge gates cover
*content* correctness thoroughly; nothing covers *engine* correctness. The guards above convert the
worst silent failures into loud ones, but they are not a substitute for tests - and every extraction
step in [engine current-state](../architecture/v2-engine.md) is gated behind having them.

## Related
- [Reusable game patterns](swipeed-game-patterns.md) (pattern #26 = the v2 standard) · [Content pipeline / forge](swipeed-content-pipeline.md) · [Interaction model](swipeed-interaction-model.md)
- [Engine - current state vs. the plan](../architecture/v2-engine.md) · [SwipeEd (app)](swipeed.md) · [Games catalog](index.md)
