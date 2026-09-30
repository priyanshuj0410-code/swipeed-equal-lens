---
type: Schema
owner: the-equal-lens
title: SwipeEd question bank
description: How SwipeEd's 69 lesson banks and 8 capstones are shaped, sourced, generated, gated and counted, as of 2026-09-14.
tags: [swipeed, question-bank, schema, content, forge]
timestamp: 2026-09-15T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/785d53d2-2943-49b3-9cad-96dce0c54bfb  # SWED-62
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/2e3bdb51-00e7-45ff-8181-a301db687b5b  # SWED-65
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6d8a2d7c-843d-4058-964b-83f8181fc21b  # SWED-72
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9c4f8ab8-948f-4898-b536-457b25d11d71  # SWED-73
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/80b520f8-46da-4703-82e7-0921d6d1ffa4  # SWED-69
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d29a10b8-b2e1-4f02-8710-0de2de4f36de  # SWED-77
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f9b2ee4c-8681-47c0-bc98-fa7fefd55543  # SWED-70
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6769fb3c-5205-49a1-9b85-ecf593fd6007  # SWED-71
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9a72838c-0fcd-4100-bf57-7d6885f65d2d  # SWED-75
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/091ac0ac-dd11-425c-ba38-8187f00cdb22  # SWED-92
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6969e7af-70f9-4c2c-b3cf-b3b8581b9ecc  # SWED-97
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/2c860719-ffbf-4c2a-8282-ea5ec6b1c3b9  # SWED-96
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8449d339-a540-489c-88e3-61d3d670fdd4  # SWED-100
---

# SwipeEd question bank

## Overview

SwipeEd is not a quiz app. Its "question bank" is really a **typed scenario library**: for each of the 77 nodes on the learning path, one file under `src/content/games/<id>.ts` exports a typed array of scenario objects, each one an instance of one of ten play verbs (reflect, role-play, strike-rewrite, branch, sort, match, build, explore-label, spot, swipe). One shared v2 engine renders all ten, so the "question" is never a bare multiple-choice card; the mechanic itself is the lesson (rewrite the myth, catch the red flag, say the line).

The path is 77 nodes: 69 lesson games across 8 developmental chapters (ages 3 to parenthood) plus 8 chapter-closing capstones. Every lesson bank was grown by the "forge" content pipeline (`scripts/forge/`) from an original hand-authored library of roughly 84 scenarios toward a 400-per-game floor, at upgraded mechanic shapes (6-item sorts, 5-item/2-trick spots, 5-pair matches). The fleet finished 69/69 on 2026-06-29. As of 2026-09-14 the live fleet holds **33,542 lesson scenarios** across the 69 games plus **70 victory laps** across the 8 capstones (see Fleet numbers below for the full breakdown and the method used to count it).

This doc covers the data: its schema, its source chain, the safety and quality gates that police it, the current fleet numbers, and the three known issues from a 2026-09-01 audit (SWED-53/54/55), verified and quantified here read-only. Rendering is covered only where it constrains the data shape (for example, why `spot` and `explore-label` never fail).

## Source-of-truth chain

Two parallel chains feed the live app: the **path** (which nodes exist, in what order) and, per node, the **content** (the scenarios themselves).

### The path chain

| Step | Artifact | Role |
|---|---|---|
| 1 | `scripts/master-node-table.xlsx`, sheet "Master Node Table" (79 rows x 14 cols: order, node_id, node_label, node_type, chapter, age_gate, thread, thread_name, hex, topics (UNESCO), prerequisite, builds_on, note, gating) | The root source of truth for the path. Hand-edited in a spreadsheet. |
| 2 | `scripts/gen-path.py` (209 lines) | Reads the xlsx plus two hand-maintained dicts in the script itself (`GAME`: node id to runtime dispatch id; `EMOJI`: node id to emoji). Regenerates `src/content/path.ts`. |
| 3 | `src/content/path.ts` (135 lines) | The generated `NODES` and `CHAPTERS` arrays the app reads. Its own header says "AUTO-GENERATED... do not edit by hand" (path.ts:1-3). |
| 4 | `scripts/swipeed_status.py` | Re-derives build status (v2 / v1 / unbuilt / capstone) per node from the xlsx, the `GAME` dict and the actual content files, so "what's built" and "what's next" is never asserted from memory (its own docstring names this exact failure mode). |

`path.ts` confirms 77 nodes: 69 `type: "lesson"` rows plus 8 `type: "capstone"` rows, grouped into 8 `CHAPTERS` (path.ts:27-117).

### The content chain, per lesson game

| Step | Artifact | Tracked? |
|---|---|---|
| 1 | The 5 read-first docs under `Strategy/`: the build bible (`SwipeEd - Game Strategy (build bible).pdf`), the transition plan (`SwipeEd - Transition Plan (Step 1, GDD rework).pdf`), the game's own GDD (`GDD <N> - <Title> (reworked v2).pdf`), that chapter's personas (`Personas/SwipeEd - Chapter <N> User Personas.pdf`), and the Scenario Library JSON (`SwipeEd - GDD <N> <Title> - Scenario Library.json`) | Yes, in the app repo, read-only design source. `scripts/read_first.py` resolves and hash-pins all 5 before a build may be attested. |
| 2 | The Scenario Library JSON itself | Yes. It is not a brief: it already holds the finished ~84-scenario original library in schema (`scenarios[]`), plus `leadMechanics`, `categories`, `mechanicsUsed` and an `evidenceBase`. Example (`be-the-safe-adult`): `count: 84`, `leadMechanics: ["strike-rewrite","role-play","branch"]`. |
| 3 | `.forge/<gameId>/plan.json` | **No** (gitignored). Written by `forge_plan.py <gameId> --write`: band ceiling, allowed mechanics for that chapter's band, per-(category x mechanic) generation quota, the legacy-reshape worklist (plus `reshape_legacy.lint`, every scenario with a blocking content lint, same-type rewrites a review lists in `.forge/<gameId>/reshape.json`, and `convert`, the reflects a classification step listed in `.forge/<gameId>/convert.json` to become choose, [SWED-69](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/80b520f8-46da-4703-82e7-0921d6d1ffa4)), an `intended_count`, and (since [SWED-73](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9c4f8ab8-948f-4898-b536-457b25d11d71)) `id_prefix` and `id_blocks`: one block of 100 fresh id numbers per category, starting above the highest number already in the bank. `intended_count` is a **pre-generation target** (existing + planned generation), not the eventual shipped count: for `be-the-safe-adult` the plan computed `intended_count: 451` (84 existing + 367 planned); the game shipped at 406. |
| 4 | `.forge/<gameId>/GROUNDING.md` | **No** (gitignored). A grounding agent reads the plan, the GDD, the Scenario Library, the chapter personas and `v2-schema.ts`, then writes this: game purpose, exact age band, per-category teaching intent with 6-10 GDD-cited truth anchors, the persona voice roster, the **exact helpline string** for that game, and banned framings. |
| 5 | `.forge/<gameId>/gen/<category>.ndjson` | **No** (gitignored). One generation agent per category writes newline-delimited JSON, one scenario object per line, self-validating against `forge_check.py --batch ... --game <gameId>` until it reports "0 rejected". New ids must sit in the category's block; a shipped id may appear only as a reshape on the worklist. Lines carry pipeline sidecar keys (`_evidence`, `_anchor`, `needsFact`). |
| 6 | `.forge/<gameId>/combined.ndjson` | **No** (gitignored). The concatenation of every `gen/*.ndjson` for that game (`cat .forge/<gameId>/gen/*.ndjson > .forge/<gameId>/combined.ndjson`). |
| 7 | `src/content/games/<gameId>.ts` | **Yes.** `forge_assemble.py --game <gameId> --batch combined.ndjson --apply` strips the sidecar keys and merges: a reshape (an id on the plan's worklist, same type and category, or a reflect on `convert["reflect:choose"]` becoming a choose) replaces its line in place; a new id is inserted just before the `SCENARIOS` array's closing `];`. It refuses the whole batch if any line is not a scenario, an id repeats, an id would overwrite a shipped scenario that is not on the worklist, a reshape changes type or category, or a new id is outside its block. The merge is written to a temp file, re-parsed, its count asserted, then moved over the game file, so a failure leaves the game untouched. |
| 8 | `.forge/<gameId>/exhaustion.json` | **No** (gitignored). Written only if a game lands under 400: `{"count", "target", "reason"}`, the one logged, deliberate exception to the floor. Two exist today (see Fleet numbers). |
| 9 | `.read-first/<gXX>.json` | **Yes**, tracked. A hash-pinned attestation (doc paths + sha256 + byte size) that the 5 read-first docs were read before a **new** v2 build. |

**What is hand-authored vs generated, inside one shipped `.ts` file.** The `SCENARIOS: Scenario[]` array body (the part between `const SCENARIOS: Scenario[] = [` and the matching `];`) is machine-written: either transcribed from the original Scenario Library JSON or produced/reshaped by forge. The trailing `V2GameConfig` object (`gameId`, `title`, `greet`, `scenarios: SCENARIOS`, `categories`, `badge`, `helpLine`, `helpLabel`, `reassure`, `reassureCats`) is hand-authored once per game and is outside the span `forge_assemble.py` ever touches.

**What is gitignored and regenerable, and its real limit.** The whole `.forge/` tree, plus one-off working files that show up inside it (for example `.forge/my-body/overflow.json`, a leftover list of over-length scenario ids from a message-length trim pass), is disposable in principle: it can be regenerated from `Strategy/` plus the live `.ts`. In practice it is **not kept in sync** after the merge gate forces a hand-fix directly in the shipped `.ts`: the assemble step's own workflow instructions say to fix failures "directly in `src/content/games/<gameId>.ts`" (gen_workflow.js:162) with no step that writes the fix back into `.forge/`. This single fact is the root cause of both SWED-53 and SWED-54 below: `.forge/` is a point-in-time generation log, not a live mirror of the shipped bank.

Capstones (`src/content/games/capstone-1.ts` ... `capstone-8.ts`) are **not** part of the forge pipeline at all: there is no `.forge/capstone-*` directory. Each is authored directly from its `SwipeEd - Capstone c<N> <Title> - Landing.json` design source under `Strategy/`, faithfully transcribed into `capstone-schema.ts`'s `CapstoneConfig` shape. `capstone-1.ts` through `capstone-4.ts` are written one lap object per line (matching the lesson-bank style); `capstone-5.ts` through `capstone-8.ts` are written pretty-printed, multi-line per object. Both are valid, equivalent JSON, just reflowed differently: a reader (or a script) parsing "one JSON object per line" alone will silently undercount `capstone-5` to `capstone-8`, which is why the fleet-counting method below balance-matches braces instead.

## Schema

### `V2GameConfig` (`src/content/games/v2-schema.ts:59-72`)

| Field | Type | Notes |
|---|---|---|
| `gameId` | `string` | Must equal the path node's `game` id and the `engine-host` registry key. "DO NOT RENAME" (v2-schema.ts:60). |
| `title` | `string` | |
| `greet` | `string` | Lensy's opening line. |
| `scenarios` | `Scenario[]` | The typed bank. |
| `categories` | `GameCategory[]` | `{id, emoji, label}` (v2-schema.ts:56); home tiles + the sticker book. |
| `badge` | `{title, blurb}` | |
| `helpLine?` | `string` | A real-help route surfaced on every screen, spoken when tapped. |
| `helpLabel?` | `string` | Defaults to "Get help". |
| `reassureCats?` | `string[]` | Categories whose beats end on a "never your fault" reassurance. |
| `reassure?` | `string` | |
| `buildLabels?` | `{assemble?, sequence?}` | The `build` mechanic's "done" button label, per game (a team / a garden / a kit / a plan). |
| `mythCards?` | `boolean` | Plays about half the strike-rewrite beats as myth cards ([SWED-70](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f9b2ee4c-8681-47c0-bc98-fa7fefd55543)). Off by default; on for Choosing & Building from 2026-09-15. |

### Base fields, every scenario (`v2-schema.ts:15`)

`type Base = { id: string; cat: string; persona: string; source: string; relearn: string; hook: string }`. All six, plus `type`, are required on every scenario regardless of mechanic (`common.py:270`, `REQUIRED_BASE`); a scenario missing any of them would compile clean but is caught by the gate rather than left to fail at `tsc` (common.py:268-269).

### Per-mechanic field tables

Each row cites `v2-schema.ts` for the type, `common.py` for the required-payload and shape rules the gate enforces, and one real, shipped example.

**reflect**: "EVERY option is acceptable (no wrong answer)" (v2-schema.ts:17)

| Field | Type | Constraint |
|---|---|---|
| `prompt` | `string` | required |
| `options` | `string[]` | required, non-empty (common.py:361-362); never carries `best`/`key`/`trick`/`answer` |
| `affirm` | `string` | required; shown with the player's words before the deeper question (spoken on the tap for a tap-only beat) |
| `ask` | `string` | optional ([SWED-97](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6969e7af-70f9-4c2c-b3cf-b3b8581b9ecc)): one question about the player's pick, asked after the tap; the band default when absent; lints `follow-up` (exactly one question) and `disclosure` (never asks about harm in the player's own life) |
| `deeper` | `string` | optional: one perspective-taking question asked after the first answer; same lints and defaults |

Example (`feelings-friends.ts`, ff-004): `prompt: "Point to your feeling."`, `options: ["Happy","Calm","A little wobbly","Excited"]`, `affirm: "Thank you for noticing your feeling. That's a real skill."`.

**choose**: tap every option that fits, then Check ([SWED-69](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/80b520f8-46da-4703-82e7-0921d6d1ffa4), 2026-09-15). The right/wrong successor to reflect for lesson and values questions; feelings, personal choices and safety lines stay reflect

| Field | Type | Constraint |
|---|---|---|
| `prompt` | `string` | required |
| `options` | `{text: string; fits: boolean; note: string}[]` | exactly 6 (`CHOOSE_OPTIONS`); 2 to 4 with `fits: true` (`CHOOSE_FITS`); every option has a non-empty `note`; no duplicate texts; no option that only agrees or disagrees (`ASSENT_ONLY`: "Yes", "No", "Both" and similar) or repeats the prompt or hook |

`note` explains a pick: for a fitting option why it fits (shown if the player missed it), for the others why it does not (shown if they picked it). Fitting option texts and every note are must-be-true fields for the claim sniffer; the texts of options that do not fit are deliberate wrong answers. Notes count toward the 160-character field cap but not toward the band ceiling, because a player sees only the ones for their mistakes.

**role-play**: say the words; exactly one line is the assertive script (v2-schema.ts:19)

| Field | Type | Constraint |
|---|---|---|
| `setup` | `string` | required; for a multi-step role-play, one sentence placing the conversation, never an instruction |
| `steps` | `StoryStep[]` | multi-step ([SWED-96](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/2c860719-ffbf-4c2a-8282-ea5ec6b1c3b9)), required for new content: 3 to 5 steps, each `{prompt, options, why}`; `prompt` is what the other person says, attributed with a verb; 4 or 5 `options` of `{text, then, best?}` (a line in double quotes and the other person's reply), exactly one `best: true`; `why` explains the best line in the end recap (`common.py` `story_errors`) |
| `yourLine` | `{text: string; best?: boolean}[]` | single-step (legacy, never together with `steps`); exactly one `best: true` by the generation prompt only |

Example (`feelings-friends.ts`, ff-002): `yourLine: [{"text":"\"I feel ___.\"","best":true},{"text":"Keep it hidden"}]`.

**strike-rewrite**: UN erases a myth, RE writes the truth with a reason (v2-schema.ts:21)

| Field | Type | Constraint |
|---|---|---|
| `myth` | `{un: string; re: string; why: string}` | all three required (common.py:297-298); `un` is the deliberate myth text and is excluded from the fact-claim sniffer, `re`/`why` must be true (`must_be_true_texts`, common.py:146-148) |

**Myth cards ([SWED-70](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f9b2ee4c-8681-47c0-bc98-fa7fefd55543)).** The scenario shape does not change: in a game with `mythCards` on, a strike-rewrite beat can play as a swipe card that shows `myth.un` (the player swipes Myth) or `myth.re` (True), followed by the usual UN/RE card. So `re` has to make sense without its myth. The `myth-context` lint rejects a truth that opens with a pronoun ("Both need...", "Those early conversations..."), and `un` should read as a claim someone might believe.

Example (`be-the-safe-adult.ts` source, sa-900): `myth: {"un":"If something was really wrong, my child would just blurt it out at dinner.","re":"Children often hold the hardest things back the longest...","why":"Telling follows safety, not the other way round."}`.

**branch**: choose what to do; a `debrief` reinforces the safe way (v2-schema.ts:23)

| Field | Type | Constraint |
|---|---|---|
| `steps` | `StoryStep[]` | multi-step ([SWED-96](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/2c860719-ffbf-4c2a-8282-ea5ec6b1c3b9)), required for new content: 3 to 5 steps of `{prompt, options, why}`; `prompt` is what is happening now plus one question and must follow from any option of the step before; 4 or 5 `options` of `{text, then, best?, outcome?}`, exactly one `best: true`, every `then` a different realistic sentence that never grades the pick; `why` explains the best option in the end recap |
| `options` | `{text, consequence, outcome?, best?}[]` | single-step (legacy, never together with `steps`); **exactly one** `best: true`; every non-`best` option must carry a `consequence` |
| `debrief` | `string` | required |

Example (`feelings-friends.ts`, ff-016): the `best` option is "Say 'I'm angry!' and take big breaths"; the non-best option "Hit the other kid" carries its own consequence.

**sort**: drop each item into the right bin (v2-schema.ts:25-31)

| Field | Type | Constraint |
|---|---|---|
| `items` | `{id, text}[]` | required; **exactly 6** for new content (`SORT_ITEMS`, common.py:310-311); unique item ids |
| `bins` | `{id, label, valence?}[]` | required; every bin must be used by at least one `key` entry (common.py:321-323); every bin must declare an explicit `valence` for new content (common.py:324-325) |
| `key` | `Record<string,string>` | required; maps every item id to a real bin id (common.py:315-319) |

`valence` is one of `pos` (good/true/safe), `neg` (bad/false/unsafe), `tell` (speak up), `uhoh` (be careful), `neutral` (non-valenced category), so the engine colours a bin from data, never a label-regex guess (v2-schema.ts:26-29). Example (`be-the-safe-adult.ts`, sa-1394): a 6-item sort into `believe` (pos) / `calm` (tell) / `act` (uhoh) bins.

**match**: connect each left to its right (v2-schema.ts:32-33)

| Field | Type | Constraint |
|---|---|---|
| `pairs` | `{left, right}[]` | required; **exactly 5** for new content (`MATCH_PAIRS`, common.py:341-342); distinct lefts, distinct rights, and no left text may equal a right text (common.py:343-348) |

**build**: assemble a team (order-free) or a plan (sequence) (v2-schema.ts:34-35)

| Field | Type | Constraint |
|---|---|---|
| `prompt` | `string` | required |
| `pieces` | `string[]` | required; no duplicate pieces (common.py:384-385) |
| `mode` | `"assemble" \| "sequence"` | required |
| `key` | `string[]` | required; must be a subset of `pieces` (common.py:382-383) |

No target count; `build` is not one of the three upgraded-shape mechanics.

**explore-label**: tap the body part that matches the clue (v2-schema.ts:36-38)

| Field | Type | Constraint |
|---|---|---|
| `parts` | `string[]` | required |
| `find` | `string` | required, the clue |
| `answer` | `string` | required; must be one of `parts` (common.py:387-388) |
| `reveal` | `string` | required, the fun fact shown on a correct tap |

A wrong tap warmly re-asks; no fail state. This is the signature verb of exactly one game, `body-lab.ts` (node g06): no other bank in the fleet uses it.

**spot**: tap the trick in the scene (v2-schema.ts:39-41)

| Field | Type | Constraint |
|---|---|---|
| `scene` | `{id, text, trick: boolean}[]` | required; **exactly 5** items for new content (`SPOT_SCENE`, common.py:329-330); **exactly 2** with `trick: true` (`SPOT_TRICKS`, common.py:331-332, "3 truths + 2 lies"); unique scene ids |
| `why` | `string` | required, explains the catch on resolve |

**Polarity is the number-one spot bug** (gen_workflow.js:20-25): `trick: true` must be the unsafe/wrong/manipulative item, never the good one, because the engine only registers taps on `trick: true` items: inverting it silently teaches the wrong reflex (no fail state to catch it). Disallowed in Chapters 1-2 unless that game's GDD lists it in `leadMechanics` (`BAND_DISALLOW`, common.py:73).

**swipe**: read the cue, swipe the right way (v2-schema.ts:42-50)

| Field | Type | Constraint |
|---|---|---|
| `cue` | `string` | required |
| `left`, `right` | `string` | required; must differ (common.py:366-367) |
| `answer` | `"left" \| "right"` | required (common.py:364-365) |
| `leftValence?`, `rightValence?` | `BinValence` | required for new content (common.py:373-374); each must be a real `BinValence`; if both sides declare the same non-neutral valence the gate rejects it (they would render identically, common.py:377-379) |

Undeclared valence used to be inferred from the label text by regex and got it wrong on 16 shipped scenarios (`"Not consent"` matches `/consent/`, `"Unsafe step"` matches `/safe/`), painting the negative side green (v2-schema.ts:46-49). Disallowed in Chapters 1-2 unless `leadMechanics` lists it. The signature verb of the teen flagship, `glrl.ts` (node g24, Green Light / Red Light); live in exactly two banks fleet-wide (`glrl`, `reality-check`).

### Capstone schema (`src/content/games/capstone-schema.ts`)

A capstone is not a lesson and never a test: a no-score, no-fail celebration replaying a chapter's big truths through varied mechanics. `CapstoneConfig` (capstone-schema.ts:37-54): `gameId`, `capstone` (display name), `node`, `chapter`, `ages`, `arrival`, `canvasPayoff`, `threadsRecapped`, `recap: CapRecap[]` (`{node, game, thread, bigTruth, glyph}`, one per chapter game), `playback: CapLap[]` (the victory laps), `reflect: CapReflect[]` (`{id, prompt, options, affirm}`: gentle prompts with **no `type` field**, so they are not laps), `celebration: {glyph, certificate, stickerBook}`, `preview`, `share`, `doneTitle`, `coins?`.

`CapLap` is a 9-way union (capstone-schema.ts:10-31), one fewer than the 10 lesson mechanics, since there is no capstone `reflect` lap or `explore-label` lap:

| Lap type | Distinctive fields | Notes |
|---|---|---|
| `gallery` | `stickers: string[]` | The "look back" lap; always `lap[0]`. |
| `match`, `sort`, `build`, `branch`, `strike-rewrite`, `role-play` | Same payload shape as the lesson mechanic, plus `celebrate` | A non-best `branch`/`role-play` pick is a warm nudge, never a buzzer. |
| `spot` | `scene: {text, trick}[]` (no `id`) | Every `trick: true` item is a correct catch; there may be several (a happy multi-catch, not "find the 2 bad ones"). |
| `swipe` | `cue`, `up`, `celebrate` | One happy "swipe up" action; no `left`/`right`/`answer`. |

Every lap carries `id`, `from` (the source node id, or `"all"` for the gallery), `frame`, and `celebrate`. A chapter glyph with no `GLYPH_EMOJI` entry falls back to a generic star (capstone-schema.ts:89).

## Categories, bands and mix rules

| Rule | Value | Source |
|---|---|---|
| Per-game floor | 400 scenarios | `common.py:15` (`TARGET`), `bank_spec.py:26` |
| Upgraded sort shape | 6 items | `common.py:24` (`SORT_ITEMS`) |
| Upgraded spot shape | 5 scene items, exactly 2 `trick: true` | `common.py:25-26` |
| Upgraded match shape | 5 pairs | `common.py:27` (`MATCH_PAIRS`) |
| Per-category target | `ceil(400 / category count)` | `forge_plan.py:62`, `bank_spec.py:91` |
| Variety floor | >= 8 per category for every mechanic the game actually uses | `forge_plan.py:16` (`VARIETY_FLOOR`), `bank_spec.py:108` |
| Max single-mechanic share | 35% of a game's bank | `forge_check.py:21` (`MAX_MECH_SHARE`) |
| Max "easy verb" share | 42% for `reflect` + `role-play` combined | `forge_check.py:22-23` (`EASY_VERBS`, `MAX_EASY_SHARE`) |
| Band-disallowed mechanics | Chapters 1-2 (ages 3-9): no `spot`, no `swipe`, unless the game's own GDD lists it in `leadMechanics` | `common.py:71-73` (`BAND_DISALLOW`) |
| Band prose ceiling (per scenario) | Ch.1-2: 360 · Ch.3-4: 400 · Ch.5-6: 460 · Ch.7-8: 500 chars, summed across all narrated fields. A multi-step branch or role-play is held to the ceiling per step instead: the step's prompt, every option text and the longest `then`, plus the hook (and a role-play's setup) on step 1 (`story_prose`) | `common.py:21` (`BAND_CEIL`) |
| Per-field cap | 160 real code points (emoji/curly quotes count as one) per player-visible bubble/pill/card | `common.py:20` (`FIELD_MAX`) |
| Prose near-dup threshold | 0.82 Jaccard over normalized 3-shingles | `forge_dedup.py:23` (`PROSE_JACCARD`) |

Categories themselves are per-game (6 for `be-the-safe-adult`, 5 for `glrl`, 6 for `body-lab`; see Fleet numbers) and come from that game's Scenario Library JSON `categories` map. They are not standardized fleet-wide. The chapter band (1-8) is what drives ceilings and the mechanic allowlist, read off `path.ts` by `chapter_of()` (common.py:230-235), which resolves the file's **runtime** `gameId` rather than trusting the filename stem (the one game where they differ is `feelings-friends.ts`, whose `gameId` is `"feelings"`).

## Safety and quality gates

| Gate | What it blocks | Pre-commit? | Forge-only? |
|---|---|---|---|
| `swipeed_status.py --check` | Build-status inconsistency between the xlsx, the `GAME` map and the actual content files; a v2 game built but not registered in `engine-host` | Yes (`githooks/pre-commit:10`) | none |
| `read_first.py --gate` | A **new** v2 build committed without a hash-pinned attestation that its 5 source docs were read | Yes (`githooks/pre-commit:23`), but only fires when a content file newly becomes v2 | none |
| `no_dashes.py` | An em or en dash in any tracked text file (copy, content, comments, scripts, docs), except the hash-pinned `.read-first/` attestations ([SWED-92](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/091ac0ac-dd11-425c-ba38-8187f00cdb22)). How to write around them: [writing without dashes](../playbooks/writing-without-dashes.md) | Yes, on the staged files | Also `npm run gates` over every tracked file, so a build fails on it |
| `content_gate.py` | Over the whole bank: parse errors, a lesson bank under 300 scenarios, duplicate ids within a game, every per-scenario check in `common.scenario_errors` (required fields, strict shapes, helplines on every visible field, 160 characters per field, the chapter band ceiling, band-mechanic membership using the committed scenario libraries' `leadMechanics`), the 35% and 42% mix caps, config strings (length and helplines), and every capstone and help-sheet string (length and helplines). About 5 seconds | Yes, when `src/content/` or the gate scripts are staged; override for one commit with `SWIPEED_CONTENT_GATE_OVERRIDE=1` | Also `npm run gates`, and before every build (`prebuild`), so a Vercel preview or production deploy fails on it with no override |
| `lints.py` | Content lints from the playtest plan ([SWED-77](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d29a10b8-b2e1-4f02-8710-0de2de4f36de)): em or en dashes, "Lensy:"/"Sam:" prefixes or the scenario's own persona name used as one ("Sneha: ...", [SWED-71](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6769fb3c-5205-49a1-9b85-ecf593fd6007)), a reflect or choose hook plus prompt with more than one question or a clipped tag question ("Agree?"), a match left and right that share a content word, a sort item that shares a word with its own zone's label that no other zone has, a `myth.re` that opens with a pronoun, a single-step branch or role-play, a multi-step `then` that grades the pick, a branch step prompt that does not ask exactly one question ([SWED-100](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8449d339-a540-489c-88e3-61d3d670fdd4)), a multi-step scenario whose best option is at least 6 characters longer than every other option in more than half its steps ([SWED-96](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/2c860719-ffbf-4c2a-8282-ea5ec6b1c3b9)), a comma splice, found by a heuristic that catches 68 of the 71 splices the Choosing & Building review fixed by hand and skips tags ("I guess"), intros ("Honestly,") and if, when or because clauses ([SWED-100](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8449d339-a540-489c-88e3-61d3d670fdd4)), and a reflect `ask` or `deeper` that is not exactly one question or that asks about harm in the player's own life ([SWED-97](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6969e7af-70f9-4c2c-b3cf-b3b8581b9ecc)). `--review` also lists match rights that share a word (possible near-synonyms, audit A12) | Yes, through the content gate, for games on `scripts/forge/lint_clean.json` (Choosing & Building since 2026-09-15; a cleaned game is added and never removed) | Also on every new batch in `forge_check.py --batch`; `python3 scripts/forge/lints.py <file stem>` reports a game |
| `forge_check.py --game <gid>` | The content gate's lesson checks for one game, plus the forge plan's persona roster and a count under 400 without a logged `exhaustion.json` (both read the gitignored `.forge/`, so they stay forge-only) | **No** | Yes: the merge-gate step of `gen_workflow.js` |
| `forge_check.py --batch <file> --game <gid>` | The same per-scenario checks over one NDJSON batch, plus the content lints, id safety against the shipped bank and the plan's id blocks, and a rejection for any non-empty line that is not a scenario | **No** | Yes: the self-validation loop each generation/review agent runs |
| `forge_dedup.py --verify --game <gid>` | INTRA-band (same chapter) structural or >=0.82 Jaccard prose near-duplicates. Cross-band echoes are logged, not blocked (legitimate age re-teaching) | **No** | Yes: the assemble step |
| `forge_assemble.py --apply` | A merge that would overwrite shipped scenarios, change a reshape's category, change its type other than a listed reflect-to-choose conversion, use an out-of-block or repeated id, or carry a non-scenario line; and a merged file that fails its parse and count round trip (written atomically, so the game file is untouched on failure) | **No** (it *is* the write step) | Yes |
| `test_gates.py` | A fixture suite proving the gates reject malformed content: missing required fields, retired helplines, and the content gate's planted problems (a wrong helpline in a hook, an emptied bank, an over-length reflect option, a broken line, bad capstone and help-sheet numbers) and the dash gate (an em dash and an en dash fail, a hyphenated range and a clean line pass) | Yes, with the content gate | Also before every build (`npm run gates`) |

**Net effect:** committing a hand-edit to an existing scenario is only gated on message length, build-status consistency and (for a brand-new game) the read-first attestation. Shape correctness, mechanic-mix caps, duplicate ids and dedup are **not** re-checked at commit time. They run only inside the forge workflow or when a maintainer runs them by hand. [Extending SwipeEd](../games/extending-swipeed.md) flags the same gap.

### The helpline allowlist (`common.py:37-50`)

Byte-exact name-to-number binding, direct-binding only (a service name immediately followed by a number must be one of that service's own numbers; a bare number in prose is never flagged).

| Service | Accepted numbers |
|---|---|
| Childline | 1098 |
| Women | 181, 1091 |
| Emergency | 112, 100 |
| Tele-MANAS | 14416, 1-800-891-4416, 18008914416 |
| Cyber | 1930 |
| Legal aid (NALSA) | 15100 |

Also enforced: a retired-helpline block that rejects any mention of KIRAN or its old number, merged into Tele-MANAS ([SWED-62](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/785d53d2-2943-49b3-9cad-96dce0c54bfb)); a US-framing denylist (911, CPS, "grade 3", zip code, "$", and similar, `common.py:57-59`) and a law/statute sniffer (`common.py:61-66`) that force-flags any POCSO/POSH/BNS/PCMA/age-of-consent/statistic claim for web verification regardless of the generator's own tagging. The cross-check below compares this allowlist with current India guidance.

### Helpline cross-check, 2026-09-14

The allowlist was last web-verified on 2026-06-24 (`common.py:37`). Compared with The Equal Lens child-safe-content helpline reference (verified August 2026):

| Finding | Detail |
|---|---|
| **KIRAN retired (resolved)** ([SWED-62](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/785d53d2-2943-49b3-9cad-96dce0c54bfb)) | KIRAN (1800-599-0019) was merged into Tele-MANAS (14416), announced on 15 Feb 2024. On 2026-09-14 all 163 mentions across 7 files were routed to Tele-MANAS or another real route, KIRAN left the allowlist, and the gate now blocks any mention of it. |
| **POCSO e-Box has no allowlist entry** ([SWED-64](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/4b84c004-94c4-4487-9515-e467b32178ae)) | Shipped content names "POCSO e-Box" (a real NCPCR route) 14 times across 3 files, but `common.py` has no name pattern for it, so a number written next to it is never checked. |
| **Legal aid routing** | `common.py` binds legal aid to the national NALSA line 15100; the reference routes a young person's legal matter to the local District Legal Services Authority. A routing difference, not a wrong number. |
| **Women's helpline** | 181 and 1091 are allowlisted but absent from the child-focused reference; likely scope, not an error. |

Childline (1098), Tele-MANAS (14416, 1-800-891-4416) and Cybercrime (1930) match exactly.

## Fleet numbers as of 2026-09-14

**Method.** A one-off read-only count (not committed) parses every `src/content/games/*.ts` except the two schema files, using the same rule the engine and the forge gates use: a scenario is any line that, stripped and with a trailing comma removed, starts with `{` and contains both `"id":` and `"type":` (matching `common.py`'s `is_scenario_line`). Each such line is valid JSON on its own. Capstone laps are parsed differently, by balance-matching braces inside the `playback` array, because `capstone-5.ts` through `capstone-8.ts` are pretty-printed across multiple lines rather than one object per line. The method was validated against the two known counts before being trusted: `be-the-safe-adult.ts` = 406 and `glrl.ts` = 517, both matched exactly.

### Per game, per chapter, per mechanic (69 lesson games)

| Ch | gameId | file | total | mechanics used |
|---|---|---|---|---|
| 1 | can-do | can-do.ts | 503 | reflect, role-play, strike-rewrite, branch, sort, match, build |
| 1 | clean-crew | clean-crew.ts | 436 | reflect, role-play, strike-rewrite, branch, sort, match, build |
| 1 | family-garden | family-garden.ts | 466 | reflect, role-play, strike-rewrite, branch, sort, match, build |
| 1 | feelings | feelings-friends.ts | 488 | reflect, role-play, strike-rewrite, branch, sort, match, build |
| 1 | my-body | my-body.ts | 486 | reflect, role-play, strike-rewrite, branch, sort, match, build |
| 1 | same-same | same-same.ts | 434 | reflect, role-play, strike-rewrite, branch, sort, match, build |
| 2 | body-lab | body-lab.ts | 537 | reflect, role-play, strike-rewrite, branch, sort, match, build, explore-label |
| 2 | fair-play | fair-play.ts | 495 | reflect, role-play, strike-rewrite, branch, sort, match, build |
| 2 | friend-frenemy | friend-frenemy.ts | 506 | reflect, role-play, strike-rewrite, branch, sort, match, build |
| 2 | heart-smart | heart-smart.ts | 487 | reflect, role-play, strike-rewrite, branch, sort, match, build |
| 2 | not-funny | not-funny.ts | 463 | reflect, role-play, strike-rewrite, branch, sort, match, build |
| 2 | safety-squad | safety-squad.ts | 479 | reflect, role-play, strike-rewrite, branch, sort, build, spot |
| 2 | smart-screen | smart-screen.ts | 436 | reflect, role-play, strike-rewrite, branch, sort, build |
| 2 | what-makes-me | what-makes-me.ts | 501 | reflect, role-play, strike-rewrite, branch, sort, match, build |
| 3 | amazing-journey | amazing-journey.ts | 502 | reflect, role-play, strike-rewrite, branch, sort, match, build |
| 3 | boundary-bot | boundary-bot.ts | 486 | reflect, role-play, strike-rewrite, branch, sort, build, spot |
| 3 | crossroads | crossroads.ts | 518 | reflect, role-play, strike-rewrite, branch, sort, match, build |
| 3 | defenders | defenders.ts | 514 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 3 | flip-script | flip-script.ts | 536 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 3 | mind-matters | mind-matters.ts | 522 | reflect, role-play, strike-rewrite, branch, sort, match, build |
| 3 | norm-storm | norm-storm.ts | 512 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 3 | puberty-quest | puberty-quest.ts | 446 | reflect, role-play, strike-rewrite, branch, sort, match, build |
| 3 | speak-up | speak-up.ts | 558 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 4 | body-confident | body-confident.ts | 509 | reflect, role-play, strike-rewrite, branch, sort, build, spot |
| 4 | bounce | bounce.ts | 518 | reflect, role-play, strike-rewrite, branch, sort, match, build |
| 4 | equalize | equalize.ts | 520 | reflect, role-play, strike-rewrite, branch, sort, match, build |
| 4 | firewall | firewall.ts | 538 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 4 | glrl | glrl.ts | 517 | reflect, role-play, strike-rewrite, branch, sort, spot, swipe |
| 4 | mythbuster-lab | mythbuster-lab.ts | 524 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 4 | outbreak | outbreak.ts | 522 | reflect, role-play, strike-rewrite, branch, sort, match, build |
| 4 | plan-it | plan-it.ts | 504 | reflect, role-play, strike-rewrite, branch, sort, match, build |
| 4 | rabbit-hole | rabbit-hole.ts | 519 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 4 | reality-check | reality-check.ts | 566 | reflect, role-play, strike-rewrite, branch, sort, match, spot, swipe |
| 4 | stand-up | stand-up.ts | 538 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 5 | change-makers | change-makers.ts | 512 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 5 | decoded | decoded.ts | 489 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 5 | justice-league | justice-league.ts | 492 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 5 | lead-the-way | lead-the-way.ts | 531 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 5 | life-ready | life-ready.ts | 509 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 5 | mutual | mutual.ts | 510 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 5 | my-choices | my-choices.ts | 545 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 5 | spectrum | spectrum.ts | 508 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 5 | status-know-it | status-know-it.ts | 506 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 6 | consent-real | consent-real.ts | 524 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 6 | equal-confident | equal-confident.ts | 462 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 6 | find-your-feet | find-your-feet.ts | 451 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 6 | know-your-rights | know-your-rights.ts | 451 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 6 | mind-belonging | mind-belonging.ts | 490 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 6 | money-independence | money-independence.ts | 456 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 6 | own-your-health | own-your-health.ts | 487 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 6 | real-relationships | real-relationships.ts | 503 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 6 | swipe-right | swipe-right.ts | 503 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 7 | choosing-building | choosing-building.ts | 498 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 7 | equal-partners | equal-partners.ts | 468 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 7 | family-map | family-map.ts | 447 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 7 | if-when-whether | if-when-whether.ts | 434 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 7 | many-ways-to-family | many-ways-to-family.ts | 441 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 7 | money-together | money-together.ts | 453 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 7 | respect-at-home | respect-at-home.ts | 518 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 7 | your-path-your-call | your-path-your-call.ts | 456 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 8 | be-the-safe-adult | be-the-safe-adult.ts | 406 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 8 | break-the-cycle | break-the-cycle.ts | 416 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 8 | equal-parents | equal-parents.ts | 446 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 8 | looking-after-you | looking-after-you.ts | 397 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 8 | navigating-addictions | navigating-addictions.ts | 435 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 8 | raising-gender-diverse-kids | raising-gender-diverse-kids.ts | 437 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 8 | raising-neurodiverse-kids | raising-neurodiverse-kids.ts | 396 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 8 | the-talks | the-talks.ts | 441 | reflect, role-play, strike-rewrite, branch, sort, match, spot |
| 8 | us-after-kids | us-after-kids.ts | 438 | reflect, role-play, strike-rewrite, branch, sort, match, spot |

### Per chapter x per mechanic (lesson scenarios only)

| Ch | games | scenarios | reflect | role-play | strike-rewrite | branch | sort | match | build | explore-label | spot | swipe |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 6 | 2,813 | 484 | 372 | 512 | 400 | 345 | 334 | 366 | 0 | 0 | 0 |
| 2 | 8 | 3,904 | 733 | 488 | 580 | 820 | 442 | 305 | 395 | 78 | 63 | 0 |
| 3 | 9 | 4,594 | 759 | 576 | 817 | 849 | 589 | 423 | 256 | 0 | 325 | 0 |
| 4 | 11 | 5,775 | 757 | 745 | 1,058 | 1,007 | 745 | 444 | 290 | 0 | 528 | 201 |
| 5 | 9 | 4,602 | 908 | 546 | 730 | 908 | 568 | 485 | 0 | 0 | 457 | 0 |
| 6 | 9 | 4,327 | 647 | 549 | 699 | 842 | 595 | 514 | 0 | 0 | 481 | 0 |
| 7 | 8 | 3,715 | 518 | 476 | 693 | 643 | 490 | 470 | 0 | 0 | 425 | 0 |
| 8 | 9 | 3,812 | 527 | 571 | 684 | 601 | 518 | 469 | 0 | 0 | 442 | 0 |
| **All** | **69** | **33,542** | **5,333** | **4,323** | **5,773** | **6,070** | **4,292** | **3,444** | **1,307** | **78** | **2,721** | **201** |

By share of the fleet: branch 18.1%, strike-rewrite 17.2%, reflect 15.9%, role-play 12.9%, sort 12.8%, match 10.3%, spot 8.1%, build 3.9%, swipe 0.6%, explore-label 0.2%.

### Capstones (8, 70 victory laps total)

| Capstone | laps | gallery | match | sort | build | spot | swipe | branch | strike-rewrite | role-play |
|---|---|---|---|---|---|---|---|---|---|---|
| capstone-1 | 8 | 1 | 2 | 1 | 2 | 1 | 1 | 0 | 0 | 0 |
| capstone-2 | 8 | 1 | 2 | 2 | 1 | 1 | 1 | 0 | 0 | 0 |
| capstone-3 | 10 | 1 | 2 | 3 | 1 | 1 | 1 | 1 | 0 | 0 |
| capstone-4 | 11 | 1 | 1 | 3 | 1 | 1 | 1 | 2 | 1 | 0 |
| capstone-5 | 9 | 1 | 1 | 1 | 0 | 1 | 2 | 2 | 1 | 0 |
| capstone-6 | 9 | 1 | 1 | 1 | 0 | 0 | 2 | 1 | 2 | 1 |
| capstone-7 | 7 | 1 | 1 | 1 | 0 | 0 | 1 | 1 | 1 | 1 |
| capstone-8 | 8 | 1 | 1 | 1 | 0 | 0 | 1 | 1 | 2 | 1 |
| **All 8** | **70** | 8 | 11 | 13 | 5 | 5 | 10 | 8 | 7 | 3 |

### Totals

| Metric | Value |
|---|---|
| Lesson games | 69 |
| Lesson scenarios | 33,542 |
| Capstones | 8 |
| Capstone victory laps | 70 |
| **Grand total (lessons + capstone laps)** | **33,612** |
| Average scenarios per lesson game | 486.1 |
| Games below the 400 floor | 2: `looking-after-you` (397), `raising-neurodiverse-kids` (396): both carry a logged `.forge/<gameId>/exhaustion.json` |

## Known issues

Verified read-only against the live repo on 2026-09-14, against a 2026-09-01 audit.

### SWED-53: `.forge/` source lost `leftValence`/`rightValence` for swipe items (CONFIRMED)

The shipped fleet carries declared valence on every swipe item: 201/201 in `src/content/games/*.ts` (across the only two games that use `swipe`: `glrl` 120, `reality-check` 81). The `.forge/` source snapshots carry it on **none**: 0/160 in `.forge/*/combined.ndjson` and 0/160 in the underlying `.forge/*/gen/*.ndjson` batches for those same two games. Root cause: `scripts/forge/migrate_swipe_valence.py` is a one-off migration that splices `leftValence`/`rightValence` into a line via a regex anchor on `"answer":"left|right"`, keyed off `swipe_valence_map.json`'s label-pair table (86 entries). Its own docstring describes exactly what it touches: `src/content/games/*.ts`, nothing under `.forge/`. It was run once, directly against the shipped files, and never back-ported to the generation snapshots, the same staleness pattern as SWED-54.

### SWED-54: 14 scenario ids shared by two different scenarios (CONFIRMED, exact match)

Not present in the shipped bank (0 duplicate ids within any single `src/content/games/*.ts`, verified two independent ways) and not present in any individual pre-combine `.forge/*/gen/<category>.ndjson` batch. All 14 live in `.forge/<gameId>/combined.ndjson`, the post-concatenation, pre-assembly file:

| Game | Colliding ids | Count |
|---|---|---|
| `lead-the-way` | lw-990 through lw-997 | 8 |
| `mutual` | mt-990 through mt-995 | 6 |

Each pair comes from two **different** category batches independently generating a scenario at the same id (for example `lw-990` exists once as a `the-gaps` `spot` scenario and once as a `what-allyship-is` `strike-rewrite` scenario). Since each individual `gen/*.ndjson` file is clean, the collision is introduced specifically at the `cat gen/*.ndjson > combined.ndjson` step, at what looks like a category id-block boundary. The shipped `.ts` for both games has zero duplicate ids today: `forge_check.py`'s merge gate hard-fails on duplicate ids (`forge_check.py:91-93`), which would have forced a hand-fix in the `.ts` directly (`lead-the-way.ts` keeps only the `the-gaps`/`spot` version of `lw-990`), but, as with SWED-53, that fix was never carried back into `.forge/`.

### SWED-55: 52 duplicate or near-duplicate scenarios (directionally confirmed, order of magnitude match)

`forge_dedup.py` was not run for this audit; its documented method (a per-mechanic structural signature plus 3-shingle Jaccard >= 0.82 over normalized, helpline-masked visible text, INTRA-band (same chapter) blocking and CROSS-band (different chapter) merely logged) was independently reimplemented from scratch for this audit. Results over the live fleet (33,542 scenarios):

| Class | Structural collisions | Prose near-dups (>= 0.82) | Distinct scenarios touched |
|---|---|---|---|
| Intra-band (the blocking class) | 2 pairs | 0 pairs | 4 |
| Cross-band (logged, allowed by design) | 51 pairs | 7 pairs | 99 |
| **Combined** | **53 pairs** | **7 pairs** | **103** |

The audit's headline "52" lines up closely with the structural-signature pair count (53 here); an exact match would need a run of the real `forge_dedup.py`, which this audit did not do. The large majority are cross-band echoes tied to explicit spiral-curriculum links in `path.ts`'s `buildsOn` field: `my-body` <-> `safety-squad` (My Body, My Rules -> Safety Squad) alone accounts for 11 of the 53 structural pairs, which is exactly the "legitimate age re-teaching" case `forge_dedup.py`'s own design calls out as logged, not blocked. Only the 2 intra-band pairs are the class the merge gate is meant to catch: A run of the real `forge_dedup.py --verify` for all 69 games on 2026-09-14 reported 0 intra-band collisions, including the two pairs below, so they are candidates for a human look rather than gate failures; the reimplementation's normalisation evidently differs.

- `feelings:ff-013` (strike-rewrite) and `same-same:ss-041`, both Ch.1: "Big boys don't cry."
- `feelings:ff-083` (reflect) and `my-body:mb-082`, both Ch.1: near-identical "who would you tell" prompts.

Both pairs sit in the original ~84-scenario hand-authored libraries of two *different* Chapter-1 games (not forge-generated), which is consistent with `forge_dedup.py`'s whole-bank pass only running inside one game's own forge cycle: two pre-existing games that were never forged against each other in the same pass would not have been cross-checked. Worth a maintainer follow-up; low severity (4 scenarios out of 33,542).

### Which gates catch which issue

| Issue | Would a pre-commit hook have caught it? | Would `forge_check`/`forge_dedup` (forge-only) have caught it? |
|---|---|---|
| SWED-53 (`.forge/` missing valence) | No: pre-commit never reads `.forge/` | No: the merge gate only checks the committed `.ts`, where valence is present |
| SWED-54 (14 duplicate ids) | No: duplicate-id detection is inside `forge_check.py`, not pre-commit | Yes, on the shipped `.ts` (and did: that is why the shipped files are clean); never on `.forge/` snapshots |
| SWED-55 (52 near-dups) | No: dedup is inside `forge_dedup.py`, not pre-commit | Yes for intra-band, by design; cross-band is logged, not blocked, so these mostly would not be "caught" even in forge |

## How to change a bank safely

**Hand edit** (a typo, a wrong answer key, one scenario needs a rewrite): edit the scenario's single-line JSON object directly inside `src/content/games/<gameId>.ts`, keeping it valid JSON and respecting that mechanic's required fields and shape from the tables above. Then, before committing:

```
python3 scripts/content_gate.py                                   # the whole-bank gate (also runs at pre-commit and before every build)
python3 scripts/forge/forge_check.py --game <gameId>               # shape/mix/count/helpline - NOT run at pre-commit, run it anyway
python3 scripts/forge/forge_dedup.py --verify --game <gameId>      # intra-band dedup - NOT run at pre-commit, run it anyway
python3 scripts/swipeed_status.py --check                          # build-status consistency (also runs at pre-commit)
git commit -m "[SWED-n] ..."
```

**Forge regrowth** (grow a game further, add a whole category, reshape legacy sort/spot/match items to the upgraded target):

```
python3 scripts/read_first.py --require gXX                        # confirms the 5 source docs exist
python3 scripts/read_first.py --attest  gXX                        # hash-pins them as read; stage .read-first/gXX.json
python3 scripts/forge/forge_plan.py <gameId> --write                # writes .forge/<gameId>/plan.json
# run scripts/forge/gen_workflow.js for <gameId> (via the Workflow tool):
#   ground -> GROUNDING.md; one generate+review agent pair per category -> .forge/<gameId>/gen/<cat>.ndjson,
#   each self-validated in a loop against:
python3 scripts/forge/forge_check.py --batch .forge/<gameId>/gen/<cat>.ndjson --game <gameId>
# then combine and assemble:
cat .forge/<gameId>/gen/*.ndjson > .forge/<gameId>/combined.ndjson
python3 scripts/forge/forge_assemble.py --game <gameId> --batch .forge/<gameId>/combined.ndjson --apply
python3 scripts/forge/forge_check.py --game <gameId>                # the blocking merge gate; fix failures directly in the .ts and re-run
python3 scripts/forge/forge_dedup.py --verify --game <gameId>       # resolve any INTRA-band collision, then re-run
# if the final count is under 400, write .forge/<gameId>/exhaustion.json = {"count", "target": 400, "reason"}
python3 scripts/content_gate.py
python3 scripts/swipeed_status.py --check
git commit -m "[SWED-n] ..."   # pre-commit re-runs status, the read-first gate and the content gate automatically
```

**Cleanup and conversion pass** on a shipped game ([SWED-69](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/80b520f8-46da-4703-82e7-0921d6d1ffa4), first run on Choosing & Building): classify its reflects and write
`.forge/<gameId>/convert.json` as `{"reflect:choose": [ids]}` (feelings, personal choices and safety lines are left
out and stay reflect), re-run `forge_plan.py <gameId> --write`, and write batches that reuse only ids on
`reshape_legacy.lint` (same-type rewrites) or `convert`. Check them as above, then have a reviewer who has not seen
the keys solve every choose, match and sort: `blind_review.py make <gameId> <dir> <batches>` writes the questions
without answers, and `blind_review.py diff <gameId> <dir> <batches>` lists each disagreement ([SWED-75](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9a72838c-0fcd-4100-bf57-7d6885f65d2d)). List a
shipped scenario it finds ambiguous in `.forge/<gameId>/reshape.json` (`{"blind-review": [ids]}`), re-plan, rewrite it and
review the rewrites blind again. Assemble when it reports none, and add the game to `lint_clean.json` once `lints.py` finds nothing. The planner refuses a
convert file that names an unsupported conversion or an id that is not a shipped reflect.

**Multi-step rollout** of a game's single-step branches and role-plays ([SWED-100](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8449d339-a540-489c-88e3-61d3d670fdd4), first run on Chapter 7).
The per-wave procedure, the owner's decisions and the auto-resume are in the
[multi-step rollout playbook](../playbooks/multi-step-rollout.md). `steps_wave.py` splits a chapter's stories into
source files of about 50 under `.forge/<gameId>/steps/` and works out each batch's next stage from its files, and the
repo's named workflow `multi-step-wave` (`.claude/workflows/multi-step-wave.js`) runs the roles, each with a brief in
`scripts/forge/briefs/`:

1. **Writer** (`steps-write.md`, plus `steps-minors.md` for Chapters 3 to 5): converts the batch until
   `forge_check.py --batch` rejects nothing and `steps_batch.py <source> <batch>` proves every source id is covered
   once, unchanged in type, category, persona and source.
2. **Three reviewers per round**, side by side, on inputs `steps_final.py make` writes: a blind reviewer picks each
   step's best option without the answers (`steps-review.md`, pass 1); an auditor gives a verdict on every transition a
   player can reach, an option's `then` followed by the next prompt (`steps-audit.md`, checked by `steps_audit.py`);
   and a safety and fidelity reviewer reads each story beside its single-step source for survivor-centred safety, the
   source's lesson, facts and judged life choices (`steps-final-safety.md`).
3. **Fixer** (`steps-fix.md`): `steps_final.py check` collects every finding and fails on any missing review; the
   fixer resolves the blocking ones (safety first), logs each decision in `fix-log.ndjson`, and `steps_final.py next`
   lists what changed. Round 1 reviews every scenario; rounds 2 to 4 review only what the last fix changed. A batch
   is certified when a fix changes nothing; anything the round 4 fix changed is read by the shipping session.

Whole-scenario continuity reviews missed most breaks in the first Chapter 7 batches, and a Sonnet auditor could not
finish the transition audit, so the audit and the safety review run on Opus, as do the writers and fixers of
safety-heavy games. Where the player is the one being pressured or harmed, the briefs treat freezing, silence and giving
in as survival responses, never as wrong options.

**A standing caution**, given SWED-53 and SWED-54 above: whichever path you take, a fix made by hand directly in the `.ts` (as the merge gate's own failure-recovery instructions require) is never carried back into `.forge/<gameId>/`. Treat `.forge/` as a historical log of one generation run, not a live mirror of the shipped bank: never diff against it to decide whether the shipped content is correct.

## Glossary

| Term | Meaning |
|---|---|
| Node | One stop on the 77-node path: a lesson (`g01`-`g69`) or a capstone (`c1`-`c8`). |
| Bank | One game's `Scenario[]` array; the "question bank" of this doc's title. |
| Mechanic / play verb | One of the ten typed scenario shapes (reflect, role-play, strike-rewrite, branch, sort, match, build, explore-label, spot, swipe). |
| Band | A chapter (1-8), the unit the mechanic allowlist and the prose ceiling are keyed to. |
| Forge | The content-growth pipeline under `scripts/forge/` that took every lesson bank from ~84 toward 400+. |
| GROUNDING.md | Per-game generation brief written by an agent from the GDD, personas and library; gitignored. |
| Exhaustion | The one logged, deliberate exception to the 400 floor: a game whose distinct-idea space ran out honestly, recorded in `exhaustion.json` rather than padded with paraphrase filler. |
| Reshape | Rewriting an existing (legacy-shaped) scenario to the upgraded shape (sort 6, spot 5/2, match 5) while keeping its id and its answer key. |
| Intra-band / cross-band | Same chapter vs different chapter, for dedup purposes: intra-band near-duplicates block the merge gate, cross-band ones are logged as legitimate age re-teaching. |
| Valence | The declared meaning (`pos`/`neg`/`tell`/`uhoh`/`neutral`) of a sort bin or a swipe side, so the engine never infers colour from label text. |
| Direct-binding | The helpline-allowlist check's rule: only a service name immediately followed by a number is checked against that service's real numbers; a bare number in prose is ignored. |

## Related

- [Content pipeline (forge)](../games/swipeed-content-pipeline.md): how the fleet was grown, wave by wave.
- [Extending SwipeEd](../games/extending-swipeed.md): the checklist for adding a game or an 11th mechanic.
- [SwipeEd: what we built and why](../games/swipeed-build-overview.md): the end-to-end synthesis of the build.
- [Reusable game patterns](../games/swipeed-game-patterns.md): the engine and content patterns this schema assumes.
- [Games catalog](../games/index.md): all 69 games and 8 capstones by chapter.
- [v2 engine](../architecture/v2-engine.md) · [design system](../design.md) · [knowledge base index](../README.md)
- [Question bank audit, 2026-09-14](../audits/question-bank-audit-2026-09-14.md) and [forge pipeline review, 2026-09-14](../audits/forge-pipeline-review-2026-09-14.md).
- Spot-checked against this doc: [Be the Safe Adult](../games/be-the-safe-adult.md), [Green Light / Red Light](../games/green-light-red-light.md), [Body Lab Juniors](../games/body-lab-juniors.md).
