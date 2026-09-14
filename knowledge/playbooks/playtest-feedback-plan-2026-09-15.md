---
type: playbook
owner: the-equal-lens
title: Playtest feedback plan, 2026-09-15
description: The approved plan for the Choosing & Building playtest feedback (question focus, match and sort giveaways, unstable option heights, reflect, swipe versus strike-rewrite), with root causes, phases, tickets and progress.
tags: [swipeed, playtest, engine, question-bank, plan]
timestamp: 2026-09-15T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/368de34e-fae5-48bc-b229-6844dee0ca7e  # SWED-66
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/a6537a7e-3bcf-418f-9ae7-da53e0241956  # SWED-67
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/e4cc4443-d867-41a0-b827-fb434940eb62  # SWED-68
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/80b520f8-46da-4703-82e7-0921d6d1ffa4  # SWED-69
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f9b2ee4c-8681-47c0-bc98-fa7fefd55543  # SWED-70
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6769fb3c-5205-49a1-9b85-ecf593fd6007  # SWED-71
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6d8a2d7c-843d-4058-964b-83f8181fc21b  # SWED-72
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9c4f8ab8-948f-4898-b536-457b25d11d71  # SWED-73
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/1de71970-d924-45d7-acb9-3c28e8a33126  # SWED-74
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9a72838c-0fcd-4100-bf57-7d6885f65d2d  # SWED-75
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/87cb9b6b-551a-4c34-a209-514be826753b  # SWED-76
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d29a10b8-b2e1-4f02-8710-0de2de4f36de  # SWED-77
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/e0437d36-ca6c-45e5-a252-a97f98540836  # SWED-86
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/baa41435-d56c-487b-ac9b-7557d49c85f5  # SWED-87
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6d8ed837-a59d-4d5b-9457-ba32b594c6fe  # SWED-88
---

# Playtest feedback plan, 2026-09-15

Approved by the owner on 2026-09-15. Related docs: [design system](../design.md),
[v2 engine](../architecture/v2-engine.md), [question bank](../schemas/question-bank.md),
[interaction model](../games/swipeed-interaction-model.md), [project log](../log/log.md).

## Context

Friends playtested SwipeEd on phones (screens in `Feedback/`, all from Choosing & Building, Chapter 7, dark theme, sound off) and reported:

1. Reflect is confusing. Wanted: 6 options with a mix of right and wrong answers, equally plausible, so players have to think.
2. The two-column question (the `match` mechanic) was solvable at a glance: every correct pair sat straight across.
3. Option heights change within a question.
4. Swipe is a better myth-busting interaction than strike-rewrite: grow both corpora and use them interchangeably.
5. Players look at the answers, not Lensy's question.

Owner decisions (2026-09-15): reflect becomes **"tap all that fit, then Check"** (2 to 4 of 6 right, count varies); **feelings, personal and safety reflects keep "no wrong answer"**; **ages 3-9 get the same new mechanics as older players**; match gets the anti-alignment fix **plus rewrites of giveaway content** (no decoy card).

## Root causes (confirmed in code and content)

- **Match alignment:** `MatchPlay` zips two independent shuffles row by row (`src/components/games/v2-engine.tsx:598-599,656-657`), so 63% of boards put at least one correct pair side by side (1 in 120 all five). `MatchLap` never shuffles the left column (`capstone-rich.tsx:85,141`). Content adds giveaways: 284 matches with 2+ pairs sharing words, 203 with near-synonym answers (cb-1263), 33 solvable by word matching alone. Sort has the same problem: 743 sorts have items containing their bin's label word; 32 two-bin sorts have bins with the same meaning.
- **Height changes:** matched and selected cells set an inline `boxShadow` that replaces `.glass-card`'s 4px hard shadow (`v2-engine.tsx:662,667,563`; `globals.css:246-252`); the match number is inline text that can re-wrap and, with `gridAutoRows: 1fr`, grow every row (`:655,663,668`); a conditional "Not a match" line and a changing bubble shift the grid (`:633,635,652`); `animate-pulse` fades selected cells to half opacity; sort bins grow as chips land and bin labels gain an arrow suffix (`:545-566`). `.glass-card` is unlayered, so `ring-*` state classes never render.
- **Question focus:** the bubble (`SamSays`, `v2-engine.tsx:190-198`) is 15px semibold on a borderless mist fill (about 1.5:1 edge contrast in the dark theme) while answers are bordered sticker cards (about 16:1); question and answers mount in the same render (`present()`, `:123`); the first nudge or confirmation overwrites the question and replay repeats only the last line; 95% of reflect hooks start with "Lensy:"; `hookLine` (`:108-114`) joins hook and prompt, so 63% of reflects show two questions and 1,876 end in clipped tags like "Agree?" or "Land right?".
- **Reflect:** any tap wins and gets the same affirm; options are never shuffled; 4,128 have 3 options, 1,204 have 4; 1,639 offer "Yes"; 21% of options just echo the question. "No wrong answer" is enforced in the schema, gates (`scripts/forge/common.py:357-362`, dead code), generator (`gen_workflow.js:28,146`) and docs.
- **Swipe and strike-rewrite:** swipe is only in `glrl` and `reality-check` (201 flag-reading cards), has no tap or screen-reader fallback, hardcoded red-flag copy (`:348,391`) and no double-commit guard; strike-rewrite has 5,773 myths, 5,499 of which have a stand-alone myth and truth sentence usable as cards; 35% of strike hooks quote the myth, repeating the card; scrub progress resets on every new stroke (`interactions.tsx:46`).

## Dependency: the forge must be safe first

Converting about 3,300 reflects, rewriting about 1,250 matches and sorts, and growing myth content is a forge reshape and regrowth. The SWED-65 pipeline review found that a regrowth run can silently overwrite shipped scenarios, factual claims are never verified, and no content gate runs before deploy. Content phases below wait on those fixes; engine phases do not.

## Phase 1: Engine and layout (no content changes, ships first)

**1a. Question first** (feedback 5)
- `SamSays` becomes a question card: full width, 18-20px in `--font-hand` (Baloo 2 is designated for Lensy's voice), `--color-surface` fill with the ink border and hard shadow. Answer cards drop to the lighter 3px shadow. Record the deliberate departure from the brand `.bubble` rule in `knowledge/design.md`.
- Staged reveal: answers fade in after Lensy's line, on a word-count timer (about 1.2s plus 60ms a word, capped at 4s) that also works when muted, because `stopSpeaking()` cancels `onEnd` (`src/lib/speak.ts:72-74`). Tapping the question skips the wait. Reduced motion: no animation, same timing.
- The question stays: nudges and confirmations go to a fixed-height feedback line under the card instead of replacing the question; the replay button replays the question.
- Strip a leading "Lensy:" in `hookLine` and before `speak()`; drop the prompt when the hook already ends with it.
- Move focus to the question on each beat and announce verdicts (closes SWED-58 and SWED-57 for lesson games).
- Remove the em dashes from engine strings: the match and sort confirmations, the match nudge and the swipe nudge.
- Mirror in `capstone-rich.tsx`: its `SamSays` (`:560-568`), per-lap mount `say` calls, `next()` (`:533`).

**1b. Stable heights** (feedback 3)
- Move `.glass-card` and `.glass-pill` into `@layer components` in `src/app/globals.css` and express matched, selected and hover states as classes that change border colour only, keeping the hard shadow and border width. Replace `animate-pulse` with a steady selected style.
- Match numbers become a corner badge (absolutely positioned), not inline text.
- Reserve fixed space for the "Not a match" and "Carrying" lines instead of mounting them conditionally.
- Sort bins get a minimum height that fits all six chips; placed chips are compact tokens; the armed bin shows an icon badge, not an arrow appended to the label.
- Same changes in `MatchLap` and `SortLap`.

**1c. Match and sort layout** (feedback 2, engine half)
- Add `derange(order)` next to `shuffle` (`src/content/games/v2-schema.ts:74-75`): the right column never puts a correct pair on the same row as its left, and at most one pair sits in an adjacent row. Use it in `MatchPlay` and `MatchLap`; shuffle the capstone left column too.
- Shuffle sort bin order in `SortPlay` and `SortLap`, and items in `SortLap`.
- Key match cells by pair index instead of label text, which fixes SWED-56; also fix its live capstone case (`capstone-3.ts` `c3-p8`, "Helps everyone" twice).

**1d. Swipe foundations** (feedback 4, engine half)
- Extract a `SwipeCard` core from `SwipePlay` (`v2-engine.tsx:335-401`): cue, two sides, answer, valence styles, nudge text, a done-guard, arrow keys, and two side buttons as the tap and screen-reader floor.
- `glrl` and `reality-check` keep their flag swipes on the new core, with buttons added.
- Fix the scrub reset: keep cumulative distance across strokes in `StrikePlay` and `StrikeLap`.

## Phase 2: Pipeline changes (after the SWED-65 forge fixes)

- **New mechanic `choose`** (reflect's right/wrong successor) in `v2-schema.ts`: `prompt`, `options` (exactly 6 of `{text, fits, note}`, 2 to 4 with `fits: true`), `relearn`. `note` explains a wrong or missed pick and is shown only for that option. Plain `reflect` stays and keeps "no wrong answer".
- **Myth cards:** no schema change. Any strike-rewrite scenario can play as a scrub or as a myth card. New lint: `myth.re` must stand alone (264 open with "It", "They", "Both").
- **Gates** (`scripts/forge/common.py`, `scripts/content_gate.py`, fixtures in `test_gates.py`):
  - `choose` shape rules, fact-checking of `fits: true` options, and no echo or assent-only options.
  - Reflect rules: the dead "no key" check made real, one question per bubble, no clipped tags.
  - No "Lensy:" prefix anywhere.
  - Match: left and its right must not share content words; answers in one match must not be near-synonyms.
  - Sort: an item must not contain its bin's label word; bins must differ in meaning; at least two bins.
  - Voice: no em or en dashes.
  - Band ceilings re-checked so a 6-option `choose` fits Chapters 1-2.
- **Generator** (`scripts/forge/gen_workflow.js`): add `choose`, myth-card and swipe shapes; replace the narrator rule with "never prefix Lensy:"; add the voice rules; blind key derivation in review (derive `fits`, pairs and bins without seeing them, then diff by script).

## Phase 3: Pilot on Choosing & Building

1. Classify its reflects:
   - **Stays `reflect`:** feelings, personal choices, and safety or "not your fault" lines.
   - **Converts:** lesson and values reflects become `choose`, with 6 options and notes.
2. Rewrite:
   - its match and sort giveaways;
   - its reflect hooks, so each asks one clear question with no clipped tags.
3. Turn on alternating presentation for strike-rewrite: myth card or scrub, about half each, never three of one kind in a row.
   - The bubble shows a neutral instruction, not the quoted myth.
   - Myth cards mix myths and truths (a truth card uses another scenario's `myth.re`), so the right swipe is not always the same.
   - Every card ends on the UN/RE beat.
4. Pilot a Chapter 1 game the same way (for example `feelings-friends`), because the new mechanics now reach ages 3-6.
   - Options and cards are read aloud when tapped.
   - The Myth and True buttons sit under the card.
5. Playtest with the same friends, sound on and off, before rolling out.

## Phase 4: Rollout in chapter waves

Per wave, through the forge with review and gates:

| Change | Scope |
|---|---|
| Convert lesson and values reflects to `choose` | about 3,300 |
| Quality pass on kept reflects (one question, no echo options, 3-4 shuffled options) | about 2,000 |
| Match giveaway rewrites | about 500 |
| Sort giveaway and broken-bin rewrites | about 750 |
| Make stand-alone `myth.re` lines | 264 |
| Strip "Lensy:" prefixes (scripted) | 5,256 |

The owner sets growth targets for the myth corpus before this phase. Flag-reading swipes stay out of Chapters 1-2 (spot and flag swipes remain barred there); myth cards appear everywhere, per the owner's decision.

## Docs and tracking

- **Docs to update in the same changes:**
  - `knowledge/design.md`: question card, answer states, match badge, myth card, `choose` layout.
  - `knowledge/architecture/v2-engine.md`: the new layout, reveal and `SwipeCard`.
  - `knowledge/schemas/question-bank.md`: `choose`, myth cards, new gates, mix caps.
  - `knowledge/games/swipeed-interaction-model.md` and `swipeed-game-patterns.md`.
  - Game docs touched by the pilot, plus a log entry per wave.
- **Plane tickets:**
  - [SWED-66](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/368de34e-fae5-48bc-b229-6844dee0ca7e) question-first layout (Phase 1a)
  - [SWED-67](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/a6537a7e-3bcf-418f-9ae7-da53e0241956) stable option heights (Phase 1b)
  - [SWED-68](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/e4cc4443-d867-41a0-b827-fb434940eb62) match and sort challenge, engine plus content per wave (Phase 1c, Phases 3-4)
  - [SWED-69](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/80b520f8-46da-4703-82e7-0921d6d1ffa4) `choose` mechanic and reflect conversion (Phases 2-4)
  - [SWED-70](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f9b2ee4c-8681-47c0-bc98-fa7fefd55543) myth cards and corpus growth (Phase 1d, Phases 2-4)
  - [SWED-71](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6769fb3c-5205-49a1-9b85-ecf593fd6007) voice cleanup: "Lensy:" prefixes, double questions, clipped tags, engine dashes

  [SWED-56](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/a4b0bddb-0951-40ec-a66f-1c7bae11b823), [SWED-57](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/04be0c5a-f6b0-4372-b2bc-79b26f3fcd6c) and [SWED-58](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/4e86866f-408c-4033-9056-5eed8edfa912) close with Phase 1. The content phases depend on the [SWED-65](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/2e3bdb51-00e7-45ff-8181-a301db687b5b) forge tickets.
- **Not in scope, worth a follow-up:** 93% of role-plays and 89% of branches offer only two options, which is the same "too easy" problem.

## Verification

- `derange` unit test: 10,000 draws with no correct pair on a shared row and a sane adjacency rate.
- Gate fixtures pass and fail for every new rule; `forge_check.py` and `forge_dedup.py --verify` 69/69; `content_gate.py`, `npm run lint`, `npm run build`.
- Headless Chrome on the dev server at 360, 390 and 412px widths, light and dark themes, reduced motion on and off, for:
  - Choosing & Building (match, sort, reflect or `choose`, strike and myth card);
  - a Chapter 1 game;
  - a capstone.

  Script a full match and sort playthrough and assert every cell's height stays constant, and screenshot before and after each beat.
- Keyboard-only playthrough and a VoiceOver or TalkBack spot check: focus lands on the question, `choose` options act as checkboxes, verdicts are announced, the swipe buttons work.
- Pilot playtest with the original testers, noting whether they read the question before answering.

## Progress

**Phase 1 shipped on 2026-09-15:** the four branches were merged into `main` and deployed to production (`1f58f2b`).
SWED-56, SWED-57, SWED-58, SWED-66 and SWED-67 are closed; SWED-68 and SWED-70 stay open for their content halves.

**Before Phase 2:** the forge safety work this plan depends on is filed as [SWED-72](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6d8a2d7c-843d-4058-964b-83f8181fc21b) (gates before every
deploy), [SWED-73](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9c4f8ab8-948f-4898-b536-457b25d11d71) (safe regrowth), [SWED-74](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/1de71970-d924-45d7-acb9-3c28e8a33126) (claim verification), [SWED-75](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9a72838c-0fcd-4100-bf57-7d6885f65d2d) (independent
safety review), [SWED-76](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/87cb9b6b-551a-4c34-a209-514be826753b) (validator gaps) and [SWED-77](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d29a10b8-b2e1-4f02-8710-0de2de4f36de) (voice gate and mechanic coverage), from the
[forge pipeline review](../audits/forge-pipeline-review-2026-09-14.md).

### Phase 1a, question first: built on 2026-09-15 (SWED-66)

What shipped, beyond the plan above:

- The question card uses the brand's own `.popover` class ("Lensy's chat card") rather than a new style, so the
  only new visual pattern is its use for questions. Answer cards kept their 4px shadow: the card's 5px/6px lift
  and 19px Baloo 2 were enough to lead.
- Mechanics lost their inline nudge lines, which repeated the spoken nudge and shifted the grid when they mounted.
- Capstone swipe and strike laps show only `lap.frame` on the question card and only `lap.celebrate` when solved,
  because the card already shows the cue or the UN/RE truth. Speech still reads the full line.
- A non-best branch pick keeps its consequence card; the line is announced, not shown twice. The lesson retry
  button now reads "Let's find a better way" (it said "safe way" on beats that are not about safety).
- Spot copy no longer calls every target a red flag.

How it was checked: headless Chrome drove Choosing & Building, Feelings Friends, Green Light / Red Light and
Reality Check, plus capstones 1, 3 and 8, at 360, 390 and 412px, light and dark, with reduced motion on and
off. Every mechanic and every capstone lap type was covered. Each beat started gated with focus on a card that
already held its question. Nudges left the question in place, and Next took focus once solved. Tapping the
question skipped the wait, and a keyboard reveal put focus on the first answer. `tsc`, `eslint` and
`npm run build` pass. Not done yet: a VoiceOver or TalkBack spot check on a real phone.

Found while checking, not fixed here:

| Finding | Where it goes |
|---|---|
| Capstone 3's `c3-p8` match cannot be finished: two pairs share "Helps everyone", so matching one disables both | Fixed in Phase 1c ([SWED-68](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/e4cc4443-d867-41a0-b827-fb434940eb62)), closing [SWED-56](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/a4b0bddb-0951-40ec-a66f-1c7bae11b823) |
| Sort bins grow as chips land (124px to 228px within one question) | Fixed in Phase 1b ([SWED-67](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/a6537a7e-3bcf-418f-9ae7-da53e0241956)) |
| The capstone gallery's long `bigTruth` lines on the feedback line push the sticker grid down on each tap | Fixed in Phase 1b: the line reserves the height of the lap's longest line |
| `BuildLap` pieces respond only to pointer taps (`onTap`), so Enter or Space on a focused piece does nothing | [SWED-86](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/e0437d36-ca6c-45e5-a252-a97f98540836) |
| At 360px a long capstone title pushes the sound button over the toolkit button | [SWED-87](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/baa41435-d56c-487b-ac9b-7557d49c85f5) |
| The swipe nudge "Read the flag" shows on non-flag swipes such as Reality Check's "Real, or reel?" | [SWED-70](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f9b2ee4c-8681-47c0-bc98-fa7fefd55543) |
| Strike hooks that quote the myth repeat the myth card word for word | [SWED-71](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6769fb3c-5205-49a1-9b85-ecf593fd6007) |
| `cb-1292` (a friend being forced into marriage) resolves without the reassurance card or Get help pill: its category is not in `reassureCats` and its best option is `outcome: "routed"`, not `"safe"`. Its option text does carry 181, 1091 and 112 | Owner decision: [SWED-88](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6d8ed837-a59d-4d5b-9457-ba32b594c6fe) |

### Phase 1b, stable heights: built on 2026-09-15 (SWED-67)

- `AnswerCard` and `CornerBadge` (`src/components/games/answer-cells.tsx`) replace inline `boxShadow` rings,
  `ring-*` classes and `animate-pulse` in match, sort, spot, explore-label and the capstone gallery, spot, branch,
  role-play and reflect steps. `.glass-card[data-state]` rules in `globals.css` recolour a card for `selected`,
  `target` and `done` and keep its border width and hard shadow offset. The plan's first idea, moving
  `.glass-card` into `@layer components`, was dropped: `rounded-2xl` and `rounded-3xl` utilities would then
  override its 20px radius across the app.
- Match numbers are corner badges in the cord colour. Placed sort chips stay in their slot, tinted and badged
  with their zone, so zones never grow. The zone arrow is a corner badge instead of text added to the label.
- The sort hint is a fixed two-line line ("Tap a card, then its zone", then "Carrying ..."). The spot "Caught!"
  label and the gallery check reserve their space before they appear.
- `LensyQuestion` takes a `reserve` list; the capstone gallery passes its big truths, so the sticker grid holds
  its position across taps.

Checked the same way as 1a: scripted match, sort, spot and explore-label playthroughs at 360, 390 and 412px,
light and dark, recording every answer card's height and position after each move, plus full runs of capstones
1 and 8. No card changed height or position within a beat. The only change is at solve, when Next appears and
the capstone sort zones share less space.

### Phase 1c, match and sort layout (engine half): built on 2026-09-15 (SWED-68)

- `derange(n)` and `matchBoard(n)` sit next to `shuffle` in `src/content/games/v2-schema.ts`, with a unit test
  (`node --test scripts/tests/match-board.test.mjs`): 10,000 draws per size show no pair on a shared row, at
  most one neighbouring pair from four pairs up, and all valid five-pair layouts drawn evenly. With five pairs,
  74% of boards have exactly one pair in a neighbouring row; that one allowed neighbour keeps adjacent rows
  plausible, so the rule itself does not become a tell.
- Match is now one shared `MatchBoard` (`src/components/games/match-board.tsx`) in both engines, keyed by cell
  position. A connection counts when any unused pair has those two labels, which closes SWED-56 for repeated
  labels on either side.
- Sort shuffles its zones in both engines, and the capstone sort shuffles its items.
- `c3-p8` has three distinct answers now, chosen to share no words with their norms.

Checked in the browser: five-pair boards across repeated Choosing & Building runs had no pair straight across
and at most one neighbouring pair, sort zones appeared in both orders, and capstone 3 ran start to finish. It
also finished with the original `c3-p8` content restored, proving the engine fix on its own. `tsc`, `eslint`,
the unit test, `check_msg_len.py` and `npm run build` pass.

### Phase 1d, swipe foundations (engine half): built on 2026-09-15 (SWED-70)

- `SwipeCard` (`src/components/games/swipe-card.tsx`) is the two-way swipe core: drag or flick, ←/→ on the
  focused card, or one button per side under the card, labelled with the side's word and emoji. It ignores
  input once the right side is chosen, so a second swipe or key press during the fly-off can't solve twice.
  Green Light / Red Light and Reality Check play their swipes on it, ready for myth cards in Phase 3.
- The swipe nudge no longer assumes a flag: "Look again. Read the card, then swipe it the other way."
- The capstone swipe-up lap has a "tap to cheer it on" button in place of its hint line.
- Scrubbing a myth adds each stroke to the last in both engines, so lifting a finger no longer resets it. A
  click with `detail === 0` (from a keyboard or screen reader) erases the myth card too.

Checked in the browser: the wrong side button nudged and the right one resolved; a real pointer swipe resolved,
with an extra arrow press during the fly-off; a myth scrubbed in two separate 120px strokes stayed half-erased
after the first and resolved on the second; capstone 1's swipe lap finished from its button. `tsc`, `eslint`
and `npm run build` pass.
