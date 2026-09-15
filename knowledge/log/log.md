---
type: log
owner: the-equal-lens
title: SwipeEd project log
description: Dated record of SwipeEd work, newest first. Entries up to 2026-09-01 were carried over from the owhile-engine knowledge log.
tags: [swipeed, log, history]
timestamp: 2026-09-15T00:00:00Z
copied_from: owhile-engine@c182048:knowledge/log.md
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/2e3bdb51-00e7-45ff-8181-a301db687b5b  # SWED-65
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/368de34e-fae5-48bc-b229-6844dee0ca7e  # SWED-66
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/a6537a7e-3bcf-418f-9ae7-da53e0241956  # SWED-67
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/e4cc4443-d867-41a0-b827-fb434940eb62  # SWED-68
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f9b2ee4c-8681-47c0-bc98-fa7fefd55543  # SWED-70
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6d8a2d7c-843d-4058-964b-83f8181fc21b  # SWED-72
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9c4f8ab8-948f-4898-b536-457b25d11d71  # SWED-73
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/80b520f8-46da-4703-82e7-0921d6d1ffa4  # SWED-69
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d29a10b8-b2e1-4f02-8710-0de2de4f36de  # SWED-77
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6769fb3c-5205-49a1-9b85-ecf593fd6007  # SWED-71
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9a72838c-0fcd-4100-bf57-7d6885f65d2d  # SWED-75
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/533b7f5e-e740-46cf-bb6d-bd250addcbf5  # SWED-89
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/091ac0ac-dd11-425c-ba38-8187f00cdb22  # SWED-92
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/15cccb6b-b650-4a05-aca2-0c1dcd8957fb  # SWED-95
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6969e7af-70f9-4c2c-b3cf-b3b8581b9ecc  # SWED-97
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d1a2181d-de35-49cb-9ab5-2766a364dac9  # SWED-99
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/2c860719-ffbf-4c2a-8282-ea5ec6b1c3b9  # SWED-96
---

# SwipeEd project log

Newest first. Every change that affects a game, the path, the engine or the question bank adds an entry here in the same piece of work (see [AGENTS.md](../../AGENTS.md)).

Entries dated 2026-09-01 and earlier were written in the owhile-engine repo while SwipeEd's knowledge base lived there, and were copied here on 2026-09-14 under SWED-61. 6 Owhile engine and venture entries from that period, and everything Owhile logged after 2026-09-01, were left out; the full original is owhile-engine [`knowledge/log.md`](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/log.md). In older entries "Praxis" is the venture now called Owhile, "this repo" usually means owhile-engine, and some links point at owhile-engine.

## 2026-09-15 · engine and content: branch and role-play become multi-step ([SWED-96](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/2c860719-ffbf-4c2a-8282-ea5ec6b1c3b9))
- **Why.** The owner asked for at least 4 options, several questions (3 to 5) on the same scenario building on the
  previous answer, and the right answers revealed at the end. 89% of branches and 93% of role-plays had two options
  and one question with the answer shown at once.
- **Shape.** `steps`: 3 to 5 of `{prompt, options, why}`, 4 or 5 options of `{text, then, best}` with exactly one
  best. Single-step scenarios stay valid until their game converts; new content must be multi-step.
- **Play.** `StoryPlay`: pick, see what happens (or what they say back), Continue; the next question replaces the one
  on Lensy's card; a recap at the end shows each pick beside the best option and why, then the debrief.
- **Gates.** Story shape, a band ceiling per step, visible and must-be-true fields, a dedup signature, a blind review
  of each step's best option, and four lints: `single-step`, `then-verdict`, `step-questions`, `best-longest`.
- **Pilot content.** All 152 Choosing & Building branches and role-plays (525 questions). Option lengths evened out
  by hand; the blind reviewer agreed on 522 of 525 best options; 137 questions that assumed one earlier pick were
  rewritten, and 71 comma splices fixed. Other 68 games: not converted yet (10,241 scenarios).
- **Checked.** Content gate, forge_check, dedup and fixtures; headless playthroughs at 360, 390 and 412px in both
  themes, including a 5-question safety role-play.

## 2026-09-15 · docs: game doc descriptions no longer stop at a # ([SWED-99](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d1a2181d-de35-49cb-9ab5-2766a364dac9))
- **Why.** 15 game docs had an unquoted frontmatter `description:` with a `#` after a space, as in "SwipeEd node #g39
  (ages 12-15), the teen mental-health & resilience game." YAML reads that `#` as the start of a comment, so the
  parsed description was "SwipeEd node" (or "Node", or "SwipeEd's first game (node") and the rest was lost. They came
  in with the SWED-61 copy.
- **What changed.** Those 15 values are now in double quotes, with inner double quotes escaped in 3 of them. One line
  per doc, nothing else in them: [Body Lab Juniors](../games/body-lab-juniors.md), [Bounce](../games/bounce.md),
  [Clean Crew](../games/clean-crew.md), [Feelings Friends](../games/feelings-friends.md),
  [Firewall](../games/firewall.md), [Friend or Frenemy?](../games/friend-or-frenemy.md),
  [Green Light / Red Light](../games/green-light-red-light.md), [Heart Smart](../games/heart-smart.md),
  [Life Ready](../games/life-ready.md), [Mind Matters](../games/mind-matters.md),
  [My Body, My Rules](../games/my-body-my-rules.md), [My Family Garden](../games/my-family-garden.md),
  [The Rabbit Hole](../games/rabbit-hole.md), [Safety Squad](../games/safety-squad.md) and
  [What Makes Me, Me](../games/what-makes-me-me.md).
- **Checks.** A script compared the raw text of every top-level frontmatter value in the 95 knowledge base docs with
  `yaml.safe_load` and flagged values that parse shorter. It found these 15 and now finds none. Every frontmatter
  parses in PyYAML and js-yaml, each fixed description parses to exactly the text that was on the line, and each doc's
  body and other keys match the previous commit. `scripts/no_dashes.py` passes.

## 2026-09-15 · docs: the knowledge base drops its spaced hyphens ([SWED-98](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850))
- **Why.** SWED-92 removed every em and en dash, but 2,551 spaced hyphens were still standing in for them in
  knowledge base prose, left by an earlier dash-to-hyphen swap. The rule says a spaced hyphen is no substitute, and the
  gate cannot see one.
- **What changed.** Every one in 88 docs rebuilt by what it was doing: a colon after a label or before a list, a comma
  for a short tail, two sentences for two thoughts, brackets for an aside, "like" or "such as" for an example. Wording
  the game docs share was set once so they all match (the `**Mode**:` lists, "How it works:" headings, the GDD rework
  notes, "**Node #g62: Chapter 8…**"). Two empty table cells now read "none". List markers, code, file names, flags,
  ranges and numbers are untouched; titles that gained a colon are quoted so the frontmatter still parses.
- **Checks.** Every changed file was compared with HEAD: code spans, link targets, numbers, bold markers and table
  pipes are unchanged. The template rules were checked by pattern and every other rewrite was read; about 100 were
  rebuilt again on review (comma splices, lists that ran into the rest of the sentence, stacked colons). 169 headings
  changed, and the 4 links into renamed capstone headings follow them. `scripts/no_dashes.py` passes.
- **Docs.** [Writing without dashes](../playbooks/writing-without-dashes.md): Known debt cleared, and new notes on
  frontmatter, stacked colons and heading anchors. design.md debt item 10 updated.

## 2026-09-15 · engine: reflect continues past the tap ([SWED-97](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6969e7af-70f9-4c2c-b3cf-b3b8581b9ecc))
- **Why.** The owner asked for reflect to ask players to write about the option they picked, and for the reflection to
  continue instead of ending on one affirm line.
- **Play.** Pick, then Lensy asks about the pick; the player writes up to 280 characters or skips; their words and the
  affirm appear with one deeper, perspective-taking question; the beat closes on the relearn. Defaults per band, or a
  scenario's own `ask` and `deeper`. Ages 3-6 get a tell-a-grown-up card; safety beats keep the single tap.
- **Safety and privacy.** Nothing typed is saved, logged or sent, and the screen says so. Follow-up questions never ask
  about harm in the player's own life (lint `disclosure`). Words that suggest harm show a calm support card with the
  game's help route instead of being echoed back.
- **Content and gates.** 16 Choosing & Building reflects got tailored `ask` and `deeper`; `ask` and `deeper` are
  visible fields (160 characters, helplines) with `follow-up` and `disclosure` lints and fixtures.
- **Checked.** Headless on Choosing & Building (write, distress, safety beat, dark), Heart Smart (skip, 360px) and
  Feelings Friends (talk card).

## 2026-09-15 · engine: tidy confirmation lines and one explore-label question ([SWED-95](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/15cccb6b-b650-4a05-aca2-0c1dcd8957fb))
- **Why.** The question types gallery showed "Cheering when they try: Helps 💚 . ✓" on a correct sort, zones that
  showed their emoji twice, and explore-label cards that asked twice ("Tap why. Find why your heart beats faster
  when you run.") with a wrong-tap nudge of "Find Which part ...".
- **Change.** `pairLine()` builds sort and match confirmations in both engines without the answer's trailing emoji
  and ends them on ✔, which speech skips; `plainLabel()` drops a zone label's own emoji; explore-label shows the
  hook alone and `clueLine()` turns `find` into a grammatical hint on a wrong tap.
- **Checked.** Headless on Fair Play World and Money & Independence sorts, Feelings Friends and Choosing & Building matches,
  and two Body Lab Juniors explore-label beats.

## 2026-09-15 · voice: no em or en dashes, anywhere ([SWED-92](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/091ac0ac-dd11-425c-ba38-8187f00cdb22))
- **Why.** The owner saw a dash in the Us, After Kids greeting: The Equal Lens never uses them, and the app held
  5,113. A spaced hyphen is not an acceptable swap.
- **Content.** 3,056 visible strings in 85 files rewritten by what the dash was doing (two sentences, a comma, a
  colon, "like", a hyphen for ranges). About 540 first drafts had become comma splices and were redone by hand,
  including the 69 greetings. 81 chapter-canvas myths and truths and the app's own UI strings rewritten too.
  Safeguarding lines kept every number and "never your fault"; one peer line that promised privacy while bringing
  in an adult now just brings in the adult.
- **Everything else.** Comments, scripts and docs rebuilt with colons, brackets and commas; ranges take a hyphen;
  code that must match a dash uses an escape (the helpline regex in `common.py`, the node table reader).
  Log headings now use a middle dot instead of a spaced hyphen.
- **Gate.** `scripts/no_dashes.py` fails `npm run gates` (so every build) and the pre-commit hook on any em or en
  dash in a tracked text file, with fixtures in `test_gates.py`. `.read-first/` attestations are skipped.
- **Docs.** New [writing without dashes](../playbooks/writing-without-dashes.md) playbook; design.md Voice and copy
  and debt item 10; the question-bank gates table. Content gate, forge_check 69/69, dedup, tsc and build pass.

## 2026-09-15 · design: press, don't float ([SWED-93](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/7c73c697-ebd9-49fe-862f-210febf8f2df))
- **Why.** The owner, on a game start screen: "The hard shadow is getting too much... everything doesn't need it.
  Rethink!" Every pill, card and panel had a 3 to 6px diagonal ink shadow, which in dark mode became a light lavender
  offset, and the one sun button had none.
- **Rule.** Flat for what you read (question card, pills, result cards, panels); a lip straight under the bottom edge for
  what you press (answer cards, topic tiles, answer pills, path nodes; `.lift` for drag cards); the strongest lip for the
  one main action (`.cta`). Lips are darker than the surface in light mode and a quiet purple-grey in dark mode.
- **Code.** `globals.css` (`--lip`, `--lip-brand`, `--lip-sun`, `.press`, `.lift`, `.cta`, `.question-card`), sun
  buttons tagged `cta`, inline offset shadows removed from onboarding, the swipe deck and the capstone swipe lap.
- **Docs.** design.md elevation table, question card and answer card rows. Checked in headless Chrome, both themes.

## 2026-09-15 · research: visual answer options on a zero budget ([SWED-90](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/49cf4efd-6622-4ac8-907c-7c01ccfd0754))
- **Why.** The owner set the budget for pictures to zero.
- **Route.** Fluent Emoji (MIT) for feelings and people; FLUX.1 [schnell] (Apache 2.0) run free on the Mac with a
  style model trained on the brand art for actions and scenes; vtracer for SVG; Humaaans and Open Peeps (CC0);
  CSS or GSAP motion on our own SVGs. Free costs time: about a day to set up and two to three days for Feelings Friends.
- **Ruled out by their terms.** Gemini and AI Studio (18+, not for apps likely used by under-18s), Recraft free
  (Recraft owns outputs), Runway and Krea free (non-commercial), Leonardo and Ideogram free (outputs public).
  ARASAAC needs owner sign-off (non-commercial, share-alike, clinical look).
- **Doc.** A zero-budget section in [research/visual-answer-options-2026-09-15.md](../research/visual-answer-options-2026-09-15.md).

## 2026-09-15 · research: visual answer options for pre-readers ([SWED-89](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/533b7f5e-e740-46cf-bb6d-bd250addcbf5))
- **Why.** The owner wants options to be visual for children who cannot read yet, so pictures help them read and
  make the games more interesting, for older players too; Runway was suggested.
- **Findings.** Pictures help understanding but can pull attention away from the printed word, so the word must
  stay dominant and pictures should fade. A reusable picture bank of about 200 pictures covers most of Feelings
  Friends. Recraft (SVG, style lock, about $0.04 an image) suits the library; Runway suits motion but trains on
  uploads below Enterprise and has no SVG; free emoji art (Fluent Emoji, MIT) suits a prototype. Open AAC symbol
  sets are mostly non-commercial and off-brand.
- **Doc.** [research/visual-answer-options-2026-09-15.md](../research/visual-answer-options-2026-09-15.md), with a
  proposed picture card, rules for pictures, a pilot plan and owner decisions. Nothing is built yet.

## 2026-09-15 · content: the Choosing & Building pilot ([SWED-69](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/80b520f8-46da-4703-82e7-0921d6d1ffa4), [SWED-71](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6769fb3c-5205-49a1-9b85-ecf593fd6007), [SWED-68](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/e4cc4443-d867-41a0-b827-fb434940eb62), [SWED-75](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9a72838c-0fcd-4100-bf57-7d6885f65d2d))
- **Why.** Phase 3 of the [playtest feedback plan](../playbooks/playtest-feedback-plan-2026-09-15.md): the game the
  playtesters played gets the new mechanics and the content fixes first.
- **Reflects.** 48 lesson and values reflects are now choose questions (six options, two to four fit, a note each).
  19 stay reflect: 12 personal picks, 5 safety lines and 2 identity affirmations, the last 7 with real options.
- **Voice and giveaways.** 75 narrator prefixes, 6 speaker-name prefixes and 51 dashes removed; stacked and clipped
  questions rewritten; 10 matches and 7 sorts reworded; 2 guesswork matches (cb-1270, cb-1277) rewritten.
- **Review.** Writer agents drafted from a brief, every line was edited by hand, and independent reviewers solved
  the questions blind with the new `scripts/forge/blind_review.py`. A second reviewer solved all 69 matches and 70 sorts blind: every sort agreed with its key, and 11 matches did not because their answers were near-synonyms, so those were rewritten. A second blind round on the 11 rewrites and the 8 choose questions edited after review agreed with every key.
- **Result.** Zero lint findings; the game is the first on `lint_clean.json`. `forge_check.py --game`,
  `forge_dedup.py --verify`, `npm run gates` and `npm run build` pass; choose and reflect beats were played in
  headless Chrome in both palettes.

## 2026-09-15 · forge: the narrator lint also catches persona names ([SWED-71](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6769fb3c-5205-49a1-9b85-ecf593fd6007))
- **Why.** Choosing & Building had hooks such as "Sneha: relatives push one match hard" that the "Lensy:"/"Sam:"
  rule missed. A general "Name:" rule would also hit labels like "Sort:", "Sound:" and "Spark:".
- **Rule.** `lints.py` flags a line that opens with the scenario's own `persona` followed by a colon. It found 133
  more lines across the bank (29 in Norm Storm, 20 in Plan It, 18 in Life Ready, 6 in Choosing & Building).
- **Checks.** Two new lint fixtures (a prefix is caught; the name inside a sentence is not); `npm run gates` passes.

## 2026-09-15 · forge: planned reflect-to-choose conversions ([SWED-69](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/80b520f8-46da-4703-82e7-0921d6d1ffa4))
- **Why.** The pilot turns Choosing & Building's lesson reflects into choose questions through the forge, and a
  reshape could not change a scenario's type (SWED-73), which is right for everything except this conversion.
- **Rule.** `common.py` `CONVERSIONS` allows one type change, reflect to choose, and only for ids on the plan's
  `convert["reflect:choose"]` list. Category changes, other conversions and unlisted ids are still refused.
- **Planner.** `forge_plan.py` adds `reshape_legacy.lint` (scenarios with blocking content lints, so a cleanup pass
  can rewrite them) and reads `convert` from `.forge/<gameId>/convert.json`, refusing unsupported conversions and
  ids that are not shipped reflects.
- **Checks.** Four new regrowth fixtures in `test_gates.py`; `npm run gates` passes.

## 2026-09-15 · engine: myth cards, on for Choosing & Building ([SWED-70](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f9b2ee4c-8681-47c0-bc98-fa7fefd55543))
- **Why.** Playtesters said swiping was a better way to bust a myth than scrubbing it out. Phase 3 of the
  [playtest feedback plan](../playbooks/playtest-feedback-plan-2026-09-15.md) plays strike-rewrite beats both ways.
- **Engine.** New `mythCards` game option. `present()` makes each strike-rewrite beat a scrub or a myth card
  (`MythCardPlay` on the shared `SwipeCard`) at random, never three of one kind in a row. A card shows the myth or
  its own truth on the same rule, the question card reads "Myth or true? Swipe the card.", Lensy reads the card
  aloud (and again on replay), a wrong side nudges, and the resolve is the UN/RE card. A truth card uses its own
  scenario's `re` rather than another scenario's, unlike the plan, so the UN/RE card matches it.
- **Content.** On for Choosing & Building. cb-032 and cb-041 had truths that opened with "Both" and "Those" and
  now stand alone.
- **Docs.** design.md (Myth card), v2-engine.md, question-bank.md (`mythCards`, `re` must stand alone), the
  interaction model, the game doc and the plan's Progress section.
- **Checks.** Headless Chrome runs listed in the plan; `npm run gates`, `tsc`, `eslint` and `npm run build` pass.

## 2026-09-15 · forge: content lints and the generator's voice rules ([SWED-77](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d29a10b8-b2e1-4f02-8710-0de2de4f36de))
- **Why.** Playtesters matched pairs by their wording and read two questions in one bubble. The generator prompt
  required a "Lensy:" prefix, had no voice rules and described only 8 of 10 mechanics (forge pipeline review P7,
  P8), so new content would keep making the same problems.
- **Lints.** New `scripts/forge/lints.py`: dashes, narrator prefixes, reflect or choose hooks that ask two questions
  or end in a clipped tag, match pairs and sort items that share their answer's words, and truths that open with a
  pronoun. They block every new forge batch (`forge_check.py --batch`) and any game on
  `scripts/forge/lint_clean.json` (enforced by the content gate; empty until the pilot cleans Choosing & Building).
  `--review` lists match rights that share a word, for a human to judge.
- **Generator.** The narrator rule is reversed (never prefix a line), the voice and giveaway rules are in the
  prompt, and swipe and explore-label shapes are described.
- **Baseline.** Choosing & Building has 255 findings and Feelings Friends 168, listed in the plan's Progress
  section; the pilot clears them.
- **Checks.** 13 new fixtures in `test_gates.py`; `npm run gates` passes.

## 2026-09-15 · engine: a new mechanic, choose ([SWED-69](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/80b520f8-46da-4703-82e7-0921d6d1ffa4))
- **Why.** Playtesters found reflect confusing because any tap wins. The owner chose "tap all that fit, then Check"
  with six options, two to four of them right, for lesson and values questions; feelings, personal choices and
  safety lines keep reflect. Phase 2 of the [playtest feedback plan](../playbooks/playtest-feedback-plan-2026-09-15.md).
- **Engine.** `ChooseScenario` in `v2-schema.ts` (`prompt`, six `{text, fits, note}` options) and `ChoosePlay` in
  `v2-engine.tsx`: options are checkbox cards; a first Check that misses says how many fit and allows a retry; the
  next Check reveals every answer, with notes on wrong and missed picks, and resolves. `V2Game` keeps the
  renderer on screen through the resolve.
- **Pipeline.** `common.py` knows the mechanic everywhere it lists them, with shape rules (six options, two to four
  fit, a note on each, no duplicates, no "Yes"/"No"/"Both", no option that repeats the question). Fitting texts
  and notes are must-be-true fields, and notes are left out of the band ceiling. `forge_dedup.py`, `bank_spec.py`
  and the generator's shapes and reviewer key list cover it too. No shipped content uses it yet.
- **Checks.** New choose fixtures in `test_gates.py`. A temporary Choosing & Building scenario (removed before
  commit) checked the flow in headless Chrome in both themes at 360 and 390px: checkbox semantics, card heights
  unchanged while picking, the first-miss count, the reveal with ✓, ✕ and notes, a clean first-time run, and
  focus on Next. `npm run gates`, `tsc` and `eslint` pass.
- **Docs.** [design.md](../design.md) (Choose card set), [v2 engine](../architecture/v2-engine.md), [question bank](../schemas/question-bank.md),
  [interaction model](../games/swipeed-interaction-model.md), [extending SwipeEd](../games/extending-swipeed.md).

## 2026-09-15 · forge: regrowth can no longer overwrite shipped scenarios ([SWED-73](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/9c4f8ab8-948f-4898-b536-457b25d11d71))
- **Why.** Ids were handed out as `900 + i*90` per category whatever the bank held, the batch gate never checked
  ids, and assembly replaced any bank line whose id matched, so the next regrowth run could silently overwrite
  live scenarios (every grown game already used ids 900 to 1439). Id blocks were not enforced either, which is how
  SWED-54 happened. Assembly wrote the game file before parsing it, and unrecognised lines were skipped (forge
  pipeline review P2, P3, P14, P15).
- **Pipeline.** `forge_plan.py` gives each category a block of 100 id numbers above the bank's highest id.
  `forge_check.py --batch` and `forge_assemble.py` share one id rule (`common.regrowth_id_errors`): a shipped id
  may return only as a reshape on the worklist with the same type and category, a new id must sit in its block,
  no id may repeat, and every non-empty line must be a scenario. Assembly refuses the whole batch on any problem,
  writes to a temp file, checks the parse and count, and only then replaces the game file. `gen_workflow.js`
  passes the planner's blocks to the generators instead of computing its own.
- **Checks.** Nine new fixtures in `test_gates.py` (each refusal, a clean add, a clean reshape, and a failed round
  trip that leaves the file untouched); with the id rule disabled, five of them fail. A dry regrowth against a
  copy of Choosing & Building refused an overwrite of `cb-002` and, with only a new scenario, changed no shipped
  scenario.
- **Docs.** [question bank](../schemas/question-bank.md) (content chain, gates table), [content pipeline](../games/swipeed-content-pipeline.md).

## 2026-09-15 · gates: the content gate runs before every build ([SWED-72](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6d8a2d7c-843d-4058-964b-83f8181fc21b))
- **Why.** The forge pipeline review (SWED-65) found every gate opt-in: hooks needed `core.hooksPath` set by hand,
  there was no CI, and Vercel ran a plain `next build`. The commit-time guard, `check_msg_len.py`, also missed
  helplines in scenario prose, most fields, empty banks and unparseable lines (G2, G4, G5, G6, G18). This is the
  first of the forge fixes the [playtest feedback plan](../playbooks/playtest-feedback-plan-2026-09-15.md)'s content
  phases wait on.
- **Gate.** New `scripts/content_gate.py` checks the whole bank in about 5 seconds:
  - lesson games: parse errors, a bank under 300, duplicate ids, every `common.scenario_errors` check (with
    band membership read from the committed scenario libraries), the mix caps, and config strings;
  - every capstone and help-sheet string: length and helplines.
  It replaces `check_msg_len.py`, which also applied no band ceiling to files whose name differs from their
  gameId. The shipped bank passes.
- **Wiring.** `npm run build` now runs `npm run gates` first (content gate, gate fixtures, engine unit tests), so a
  Vercel preview or production build fails on bad content with no override. `npm install` turns the git hooks on
  (`prepare`), and the pre-commit hook runs the content gate whenever `src/content/` or the gate scripts change.
- **Checks.** New fixtures in `test_gates.py` plant each problem (a wrong helpline in a hook, an emptied bank, an
  over-length reflect option, a broken line, wrong capstone and help-sheet numbers) and pass on real content. A
  build with a planted "Childline 112" stopped before compiling; the clean build passes.
- **Docs.** [question bank](../schemas/question-bank.md) (gates table, commands), [deployment](../architecture/deployment.md),
  [extending SwipeEd](../games/extending-swipeed.md), [build overview](../games/swipeed-build-overview.md),
  [game patterns](../games/swipeed-game-patterns.md), [v2 engine](../architecture/v2-engine.md).

## 2026-09-15 · engine: swipe cards get side buttons, scrubbing keeps its progress ([SWED-70](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f9b2ee4c-8681-47c0-bc98-fa7fefd55543))
- **Why.** Swipe had no tap or screen-reader path and could solve twice if swiped again during its fly-off, and a
  myth being scrubbed reset to zero on every new stroke. Phase 1d (engine half) of the
  [playtest feedback plan](../playbooks/playtest-feedback-plan-2026-09-15.md), laying the ground for myth cards.
- **Engine.** New shared `SwipeCard` (`src/components/games/swipe-card.tsx`) with one button per side and a
  done-guard, used by the lesson swipe beats; a neutral nudge ("Read the card"); a tap button on the capstone
  swipe-up lap; cumulative scrubbing in `StrikePlay` and `StrikeLap`, plus keyboard and screen-reader clicks.
- **Checks.** Headless runs of button, pointer-swipe, double-commit and two-stroke scrub cases, and capstone 1's
  swipe lap by tap. `tsc`, `eslint` and `npm run build` pass.
- **Docs.** [design.md](../design.md) (Swipe card, tap floor), the [v2 engine](../architecture/v2-engine.md), the
  [interaction model](../games/swipeed-interaction-model.md), [game patterns](../games/swipeed-game-patterns.md).

## 2026-09-15 · engine: match and sort stop giving the answer away ([SWED-68](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/e4cc4443-d867-41a0-b827-fb434940eb62))
- **Why.** Playtesters solved match boards at a glance: two independent shuffles zipped row by row put at least one
  correct pair straight across on 63% of five-pair boards, and capstone match never shuffled its left column.
  Sort always showed its zones in authored order. Phase 1c (engine half) of the
  [playtest feedback plan](../playbooks/playtest-feedback-plan-2026-09-15.md); content rewrites follow in later waves.
- **Engine.** `derange()` and `matchBoard()` in `src/content/games/v2-schema.ts` lay out boards with no pair on a
  shared row and, from four pairs up, at most one in a neighbouring row. Both engines render a shared `MatchBoard`
  (`src/components/games/match-board.tsx`) keyed by cell position, which also fixes the repeated-label soft-lock
  ([SWED-56](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/a4b0bddb-0951-40ec-a66f-1c7bae11b823)).
  Sort shuffles its zones in both engines and its items in the capstone.
- **Content.** Capstone 3's Norm Storm lap (`c3-p8`) had "Helps everyone" twice and could not be finished; it now has
  three distinct answers ([capstones](../games/capstones.md)).
- **Checks.** New `scripts/tests/match-board.test.mjs` (10,000 draws per size); browser runs showed no aligned pairs,
  shuffled zones and a complete capstone 3, including with the old `c3-p8` restored. `tsc`, `eslint`,
  `check_msg_len.py` and `npm run build` pass.

## 2026-09-15 · engine: answer cards keep their size ([SWED-67](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/a6537a7e-3bcf-418f-9ae7-da53e0241956))
- **Why.** Playtesters saw options change height within a question. Selected and matched cells swapped the card's
  hard shadow for an inset ring, match numbers were text that re-wrapped, sort zones grew as chips landed, and
  several "picked" states used `ring-*` classes that never render on `.glass-card`. Phase 1b of the
  [playtest feedback plan](../playbooks/playtest-feedback-plan-2026-09-15.md).
- **Engine.** New `AnswerCard` and `CornerBadge` (`src/components/games/answer-cells.tsx`) with
  `.glass-card[data-state]` styles for selected, drag-target and done, used by match, sort, spot, explore-label and
  the capstone gallery, spot, branch, role-play and reflect steps. Match numbers and zone emoji are corner badges,
  placed sort chips stay in their slot, the sort hint has a fixed height, late marks reserve their space, and the
  capstone gallery reserves its feedback line for its longest big truth.
- **Checks.** Scripted playthroughs recording every answer card's height and position after each move at 360, 390
  and 412px, light and dark, plus capstones 1 and 8: nothing moved within a beat. `tsc`, `eslint` and
  `npm run build` pass.
- **Docs.** [design.md](../design.md) (Answer cards, Interaction and motion), the [v2 engine](../architecture/v2-engine.md),
  the [interaction model](../games/swipeed-interaction-model.md) and the plan's Progress section.

## 2026-09-15 · engine: Lensy's question leads every beat ([SWED-66](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/368de34e-fae5-48bc-b229-6844dee0ca7e))
- **Why.** Friends playtested Choosing & Building and answered without reading the question. The question was a
  15px borderless bubble beside bold sticker answer cards, the answers appeared in the same frame, and the first
  nudge replaced the question. This is Phase 1a of the [playtest feedback plan](../playbooks/playtest-feedback-plan-2026-09-15.md).
- **Engine.** New shared `LensyQuestion` and `RevealGate` (`src/components/games/lensy-question.tsx`), used by
  `V2Game` and `RichCapstone`. The question sits on the brand's `.popover` chat card in 19px Baloo 2 and stays for
  the whole beat. Nudges and confirmations go to a live feedback line under it. Answers wait 1.2s plus 60ms a
  word (at most 4s), and a tap on the question or the gate shows them at once. Narrator prefixes ("Lensy:") are
  stripped, and a hook and its prompt are joined without asking twice or ending on a clipped tag. Focus moves to
  the question at the start of each beat and to Next when solved, and branch verdicts are announced, which closes
  [SWED-57](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/04be0c5a-f6b0-4372-b2bc-79b26f3fcd6c)
  and [SWED-58](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/4e86866f-408c-4033-9056-5eed8edfa912).
- **Also.** Mechanics lost their inline nudge lines, which repeated the spoken nudge. Capstone swipe and strike
  laps no longer print the cue or truth twice. A non-best branch pick keeps its consequence card. Spot copy no
  longer calls every target a red flag. 27 engine strings lost their em dashes.
- **Checks.** Headless Chrome playthroughs of four lesson games and capstones 1, 3 and 8 at 360, 390 and 412px,
  light and dark, reduced motion on and off, covering every mechanic and lap type. `tsc`, `eslint` and
  `npm run build` pass. Findings for later tickets are in the plan's Progress section. They include capstone 3's
  live `c3-p8` soft-lock (SWED-56), and a Choosing & Building forced-marriage beat that resolves without a help
  pill, which needs an owner decision.
- **Docs.** [design.md](../design.md) (How Lensy speaks, elevation, Components, Focus, References) and the
  [v2 engine](../architecture/v2-engine.md) (new section: Question card, reveal and focus; SWED-57 and SWED-58
  marked fixed).

## 2026-09-14 · audit: the question bank and the forge pipeline ([SWED-65](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/2e3bdb51-00e7-45ff-8181-a301db687b5b))
- **What.** A read-only pass over all 33,542 lesson scenarios, 70 capstone laps, every help string and the Get Help
  sheet, plus the generator and every gate. Findings: [question bank audit](../audits/question-bank-audit-2026-09-14.md)
  and [forge pipeline review](../audits/forge-pipeline-review-2026-09-14.md).
- **Healthy.** Every answer key passed deterministic checks, no match can trigger SWED-56, categories and mechanic
  caps are clean, reading level falls with age, disclosure responses and self-harm messaging are right, 40 legal and
  factual claims were checked, and `forge_check.py` passes all 69 games.
- **Content problems.** Two parent-facing scenarios present transgender self-identification as current law, which a
  2026 amendment removed; `my-choices` tells 15-18-year-olds that mandatory reporting is a myth, and two games
  promise confidential sexual-health care without its POCSO limit; `plan-it` models "just between us" as the right
  thing to say to a trusted adult; the Get Help sheet calls Childline confidential with no exception; a few
  statistics need attribution; 2,999 dashes in player text.
- **Pipeline problems.** No gate runs by default or before deploy; claims were never verified and evidence is
  discarded; a regrowth run could silently overwrite shipped scenarios; the review agent is not independent; the
  commit-time checks miss scenario helplines, most field lengths and empty banks; `DESIGN.md` promises steps that
  were never built.
- **Next.** Follow-up tickets are proposed at the end of both audits; filed on 2026-09-15 (see the plan's Progress section).

## 2026-09-14 · safety: KIRAN retired, every mention routed to Tele-MANAS ([SWED-62](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/785d53d2-2943-49b3-9cad-96dce0c54bfb))
- **Why.** KIRAN (1800-599-0019), the mental-health rehabilitation line of the Department of Empowerment of Persons
  with Disabilities, was merged into Tele-MANAS (14416). NITI Aayog's Dr V K Paul announced it at the National
  Workshop on Mental Health on 15 Feb 2024, with KIRAN calls diverted for three months and the line then phased out
  (reported by BioSpectrum India and Digital Health News). The Equal Lens child-safe-content helpline reference,
  verified in August 2026, agrees. The department's own helpline page still lists KIRAN, undated, and was treated as
  stale. SwipeEd still named KIRAN 163 times across 7 files.
- **Content.** 47 scenarios in 6 games, their `helpLine`, `helpLabel` and `reassure` strings, and the shared Get Help
  sheet (`src/content/help.ts`). Where KIRAN sat beside Tele-MANAS it was dropped. Where it had a role of its own,
  the replacement is a real route that fits the audience: the cybercrime helpline 1930 for online harm in Spectrum
  and Life Ready, emergency 112 for danger in Mind & Belonging and Find Your Feet, and a doctor, a counsellor or a
  parents' support group in the Chapter 8 games. Two Spectrum scenarios that promised a helpline or counsellor
  "stays private" were rewritten without that promise, because confidentiality has limits when someone is being hurt.
- **Gate.** `scripts/forge/common.py` drops KIRAN from the allowlist and adds `RETIRED_HELPLINES`: naming KIRAN or its
  old number is now an error in every scenario and config string (case-sensitive, so a character named Kiran is
  fine), with fixtures in `test_gates.py`.
- **Checks.** `test_gates.py`, `check_msg_len.py`, `forge_check.py` and `forge_dedup.py --verify` pass for all six
  games, `swipeed_status.py --check` is consistent, and `npm run build` succeeds.
- **Docs.** The helpline table and cross-check in the [question bank](../schemas/question-bank.md), and the KIRAN
  mentions in 15 game and overview docs. Older log entries still name KIRAN; they are history.

## 2026-09-14 · docs: SwipeEd gets its own knowledge base (SWED-61)
- **Why.** SwipeEd's docs lived only in owhile-engine, which a chat working in The Equal Lens's repos may not
  edit, so the rule that docs ship with code could not be followed. The repo also had no `plane.config.md` or
  `design.md`, which the Plane and design guard hooks require before edits.
- **Copied** from owhile-engine `c182048`: all 82 docs in `games/`, and 215 SwipeEd log entries up to
  2026-09-01 (6 Owhile engine and venture entries from that period left out). Owner set to the-equal-lens,
  `copied_from:` provenance added, SWED ids turned into Plane issue URLs, em and en dashes replaced with
  hyphens, 1,320 relative links re-pointed (36 Owhile-only targets now open owhile-engine on GitHub), and four
  invalid frontmatter blocks, a missing description and several broken anchors repaired.
- **Written fresh from the code:** [v2 engine](../architecture/v2-engine.md),
  [stack, build and deployment](../architecture/deployment.md), [question bank](../schemas/question-bank.md),
  [design system](../design.md) with its [design audit](../audits/design-audit-2026-09-14.md),
  [Plane configuration](../plane.config.md) and the [index](../README.md). `AGENTS.md` now points here.
- **Stale facts corrected in the copied docs:** the repo is `swipeed-equal-lens` on GitHub and a push to
  `main` deploys (the prebuilt CLI flow is history); GLRL ships 120 swipe scenarios and 104 in `flags` (not 28
  and 30); Body Lab's `curiosity` category holds 92 (not 10); six catalog rows overstated their mechanic
  counts; the fleet landed at 33,542 scenarios, roughly 27,700 net-new (not ~21,800); "Sam" restored where a
  blanket rename to "Lensy" had broken sentences, and "Lensy/Lensy" duplicates removed.
- **New findings, ticketed:** UN and RE label text fails WCAG AA contrast in light mode, 1.86:1 and 2.56:1
  ([SWED-63](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/198fdeb2-d7c8-4462-bdf3-5636484e3587)); KIRAN, named 163 times in 7 content files, may have been merged into Tele-MANAS ([SWED-62](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/785d53d2-2943-49b3-9cad-96dce0c54bfb));
  "POCSO e-Box" has no helpline allowlist entry ([SWED-64](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/4b84c004-94c4-4487-9515-e467b32178ae)). Recorded but not ticketed: every heading is set in
  Baloo 2 against the brand canon (a decision for the owner), and `src/` holds 5,113 em or en dashes, 4,260 of
  them in game content.
- **Not touched:** nothing in owhile-engine changed; [PRX-29](https://app.plane.so/claude-pri/projects/76bc2c6d-d7e2-4b88-8ce4-b9fa7e59f5b2/issues/6b3fe8df-f7df-44d2-a805-8e25aa4f67f2) asks an Owhile chat to point its older copies of
  these docs here.

## 2026-09-01 · engine: a SHIPPED MIS-TEACH fixed (the negative swipe side was painted green)
- **The defect, in safeguarding content.** `flagSide()` was a *second* prose-guessing regex, reading the
  swipe side labels. `"Not consent"` matches `/consent/` and `"Unsafe step"` matches `/safe/`, so **both
  sides classified positive: the two sides rendered the same green and the NEGATIVE side carried the
  affirming wash and badge.** 16 scenarios in GLRL: `gl-1239…1246` (consent) and `gl-1334…1341`
  (safeguarding). A child dragging toward *"Not consent"* saw green. Shipped, live. PRX-3, `c5e8dc2`.
- **The fix follows the pattern that worked for sort bins:** `flagSide` deleted; `SwipeScenario` declares
  `leftValence`/`rightValence`, **reusing the `BinValence` vocabulary** rather than inventing a second one;
  `swipeStyles()` falls both sides back to neutral slots if they would ever collide, so the two sides can
  never merge again. All **201** swipe scenarios migrated.
- **The migration was made provable, not trusted.** Key order is not uniform across the bank, so a
  JSON round-trip would reorder keys on all 201 lines and could bury a changed `answer` in the diff.
  Instead: a textual splice at a single anchor, plus an **inverse-splice byte-identity proof**: stripping
  the two new keys must reproduce `HEAD` exactly, which is re-runnable as `--verify`. It passes.
- **A content judgement worth recording:** reality-check's media-literacy pairs are deliberately
  `neutral`/`neutral`. *"Real vs staged"* is **factual discrimination, not moral judgement**. Colouring
  "Staged perfection" red would moralise about media instead of teaching how to tell the difference. Only
  GLRL's relationship-safety, consent and scam pairs assert `pos`/`neg`.
- **Other measured shipped defects, all fixed:** white-on-fill **failed WCAG AA in both themes** (white on
  `#F0A93B` = 2.01:1) at the swipe badge that *carries the answer*, and in capstone-rich. Now
  `--prx-on-fill`, scoring 3.9-8.6, deliberately non-flipping. `game-done`'s unearned star composited to
  **1.02:1 on the adult ground**, invisible, so 1 star and 3 were indistinguishable in Ch.6-8. The neutral
  wheel had 4 slots but six sorts have 5-6 bins, so bins 5-6 rendered identically to 1-2, now six slots,
  none sharing a hue with a declared valence (two were previously **byte-identical** to `pos` and `tell`,
  making "an undeclared bin asserts nothing" false as implemented). The matched/found state rode
  `--color-grow`, a **themeable brand token**: a customer brand pack could have repainted "correct".
- **Gate:** new swipe content must declare both sides, values must be in the enum, and two non-neutral
  sides may not declare the same valence. The sort rule tightened from *presence* to *enum membership*.
  `NON_PROSE` updated in **both** `common.py` and `check_msg_len.py`, which are identical by contract.
- **A premise of mine was wrong and is recorded as such.** I claimed the hardcoded hex "renders light-theme
  colours on a dark ground" as a contrast defect. Measured, it is false: the hex mostly *gains* contrast on
  the adult ground (`#62B84B` 2.37 → 7.53); only `#7C5CFC` regresses. The real case is divergence,
  un-themeability and the defects above.
- **Verified:** tsc · production build · `forge_check` glrl + reality-check · `check_msg_len` · gate
  fixtures · `forge_dedup --verify` **0 intra-band across 33,542** · the migration's own byte-identity proof.
- **Still open:** the non-colour redundancy channel is **still emoji**, rendered by the viewer's OS font. A
  platform-drawn SVG symbol set is designed but unbuilt, an improvement rather than a shipped defect, and
  one mark (the "careful" cue) needs a printed 22px test rather than an assertion.

## 2026-09-01 · engine: semantic colour reserved, the prose-guessing regex deleted, helpLine gated
- Three boundary holes closed in the shipped engine (`swipeed-equal-lens` `d22dc1b`). PRX-2, the first
  engine work filed to Praxis's own project.
- **A · Semantic colour was creator-addressable.** `--flag-green`/`--flag-red` sat in the *same override
  namespace as the brand tokens* and drove live gameplay in the swipe mechanics, so a customer theme could
  **invert a red/green flag**, an answer-key attack. And `--destructive` was derived **from** `--flag-red`,
  coupling a chrome colour to a gameplay flag backwards. Both moved to a reserved **`--prx-*`** namespace a
  brand pack is structurally unable to name; `--destructive` given its own value.
- **B · A regex inferred bin meaning from prose.** `binStyle()`'s ~152-alternative English regex made a
  bin's colour, and therefore the visual answer key, a function of author *wording*, silently wrong in any
  non-English locale. Added `valence` to the final **18** bins (capstones 1-4), so all **8,676** now declare
  it, then **deleted the regex**: an undeclared bin now gets a neutral position colour and asserts nothing
  rather than being guessed at. Valence was read from each scenario's **content, not its label**: notably
  **both HIV/STI transmission sorts are `neutral`**, because colouring "Can spread it" red would stigmatise,
  which is the opposite of what those anti-stigma games teach. Two further judgement calls, flagged for the
  founder: "Not so helpful" (coping) and "Not so kind" (body image) were set `uhoh` rather than `neg`: a
  red STOP reads as shaming a child's own coping strategy or self-belief.
- **C · `helpLine` was an ungated free string**: spoken aloud, with authority, to a child in distress, and
  previously length-checked and nothing more. Config prose now passes the **same verified-helpline
  allowlist** as scenario prose, via a shared `helpline_errors_text()` so there is one source of truth. All
  **63** shipped values pass unchanged; a wrong service↔number binding, a hallucinated `911` and US framing
  are each demonstrably blocked.
- **`tsc` caught a gap worth noting:** capstones run their own schema, which had no `valence` on bins. Added,
  importing `BinValence` from `v2-schema` rather than redefining it, one contract, not two.
- **Verified:** tsc clean · production build green · `check_msg_len` pass · `forge_check` pass ·
  forge self-tests pass · `forge_dedup --verify` **0 intra-band collisions across all 33,542 scenarios** ·
  `swipeed_status` consistent.
- **Still open** (both prerequisites for shipping customer theming, recorded in
  [creator-identity.md](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/creator-identity.md)): the **two divergent valence palettes** (hex in
  `VALENCE_STYLE` vs the `--prx-flag-*` tokens) mean a palette-integrity gate would fail SwipeEd on day one;
  and the **non-colour redundancy channel is still emoji**, rendered by the viewer's OS font, worst on the
  cheap Android tablets the accessibility case targets.

## 2026-09-01 · engine/forge: adding a mechanic now fails loudly; extension playbook written
- **Question behind it:** what actually blocks building more games or extending the mechanic set? Answer:
  nothing structural, but three likely mistakes failed **silently**. New doc:
  [games/extending-swipeed.md](../games/extending-swipeed.md), linked from the root index. SWED-48.
- **Adding a game is cheap in code, expensive in content.** g53 (`a7b4798`) was 6 files, +185/−1. The real
  cost is upstream: `read_first.py` refuses to attest without a GDD PDF **and** a Scenario Library JSON
  that already contains the finished ~84 scenarios, then the forge run to 400+ costs ~1M tokens / ~21 min.
  Three steps are **ungated**: the per-node myths + sticker in `chapter-canvas/chapter-N.json`; the chapter
  capstone's `recap[]` + `GLYPH_EMOJI` (silently degrades to ⭐, already shipped once as a bug, `68a2e2e`);
  and an ordering trap where committing the content file before the `gen-path.py` GAME entry makes
  `read_first.py` **skip it entirely** (`if not node: continue`) with no warning.
- **Adding a mechanic touches ~14 places.** Two in the app, twelve in `scripts/forge/`. Fixed the three
  that failed silently:
  - `Play()` and `LapView()` switched a closed union with **no `default`** and no return annotation
    (`noImplicitReturns` unset): a missing case compiled clean, rendered nothing, never called
    `onSolved`: **no fail state, player stuck**. Both now carry a `never`-typed default. Verified by
    experiment: an injected 11th union member previously gave `tsc` exit 0; it now errors
    `Type 'DialScenario' is not assignable to type 'never'`.
  - `common.py` `visible_fields` / `must_be_true_texts` were `if/elif` with no `else`. A mechanic
    registered in `ALL_MECHANICS`+`REQUIRED_PAYLOAD` but missing there made the ≤160 cap, the US-framing
    denylist, the helpline name↔number binding, the claim sniffer and the dedup fingerprint **all fail
    open at once**. Both now raise. `must_be_true_texts` also gained **explicit no-op arms** for
    `role-play` and `build`, which really do contribute nothing, previously indistinguishable from an
    accidental omission.
  - `forge_dedup.struct_sig` returned a bare `(t,)`, collapsing every scenario of an unregistered verb
    into one signature and making the merge gate **un-passable**. Now raises; its own guard was
    unreachable dead code (`and` binds tighter than `or`) and is simplified.
- **Verified no behaviour change:** all **33,542** scenarios pass the three functions with 0 unexpected
  raises; `forge_check --game my-body` PASS; `forge_dedup --verify` 0 intra-band collisions; tsc, eslint
  and production build green. Merged `--no-ff`, pushed.
- **Noted, not fixed:** `gen_workflow.js` SHAPES documents only 8 of 10 mechanics and the adversarial
  reviewer prompt names only 5. The pipeline already lags the engine, so a new verb would ship with no
  semantic review. `shape_errors` has no arm for `role-play`/`strike-rewrite` and the `reflect` guard's
  body is literally `pass`. And the standing prerequisite: **still no test runner, script or test files.**

## 2026-09-01 · engine: state assessed, finale bug fixed, dead code removed, roadmap written
- **New doc: [architecture/engine-current-state.md](../architecture/v2-engine.md)** (SWED-47): the
  architecture docs describe the *intended* engine; nothing recorded what exists. Now it does, verified
  against code and linked from both indexes.
- **The finding that matters: the built registry inverts the documented one.**
  `components/games/engine-host.tsx` is a **hand-maintained 77-entry compile-time map**: `next/dynamic`
  code-splits the chunks but the specifiers are build-time literals, so shipping a game means *editing the
  engine*. [game-registry.md](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/game-registry.md) says "never via direct imports" and
  [repo-topology.md](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/repo-topology.md) says "never depends on a specific game". The same
  inversion repeats one level down: mechanics are a closed 10-case switch with every Play component
  module-private.
- **The engine is nonetheless real and well-factored:** ~1,900 lines (`v2-engine.tsx` 841,
  `capstone-rich.tsx` 614, `engine-host.tsx` 256, `interactions.tsx` 106, the last importing only React),
  with **69 wrappers averaging 16.6 lines** over a 38,558-line content corpus. Only **two** Next.js imports
  in the whole games directory, and helplines are config fields: no Indian helpline number appears
  anywhere in the engine layer. It is far more subject-agnostic than the RSE content implies.
- **Half the spec is a platform, not a library.** Identity, content delivery, marketplace backend,
  payments, the 25% commission, SCORM/xAPI: none of it can be extracted from a client app because it was
  never in one. The authoring tool and marketplace, which the business model rests on, sit entirely in
  that half.
- **Live bug fixed (SWED-45):** `game-done.tsx` passed `final={capstoneLevel === 5}`, correct when the
  catalog stopped at 18 and c5 was the finale, wrong since Ch.8 (parenthood) was added. The Life-Skills
  Toolkit's emotional bookend showed at Chapter 5 and **never at c8, the real finale**. Now
  `FINAL_CAPSTONE = 8`, with the reflection's clamp routed through `toolkit.MAX_LEVEL`. **Explicitly not
  changed:** `MAX_LEVEL = 5` and the `Math.min(…, 5)` clamp are correct by design: the Thread-C toolkit
  is a 5-level model (one game per chapter 1-5, exactly 5 `levelLabels` per tool), so capstones 6-8
  rightly show the fully-grown toolkit. An earlier pass mis-reported that clamp as part of the bug.
  Bookend copy also refreshed off the retired "carried for fifteen years".
- **Dead code removed (SWED-46):** `modes-engine.tsx` (261) + `capstone-engine.tsx` (109), the pre-v2
  engines, zero code references; the 19 hits on their names are historical prose comments in game files,
  which stay. `capstone-engine.tsx` also exported a `CapstoneConfig` that name-collided with the live
  schema's. `tsc` + production build green; merged `--no-ff` and pushed.
- **The real ceiling on any extraction: no tests.** No runner, no `test` script, no test files. The forge
  gates cover *content* correctness thoroughly; nothing covers *engine* correctness. That is the
  prerequisite, not the follow-up.

## 2026-09-01 · chore: vendored `@equal-lens/brand` (cloud builds now work; old repo cleared for archive)
- **The blocker, removed (SWED-44).** `@equal-lens/brand` was declared as
  `file:../The Equal Lens/brand/design-system/equal-lens-brand-0.1.0.tgz`, a path **outside** the repo and
  untracked, so any Vercel cloud build died at `npm install`. That is the whole reason deploys were
  `vercel build --prod` + `vercel deploy --prebuilt --prod` from local. The 260K tarball is now committed at
  `vendor/equal-lens-brand-0.1.0.tgz` and the dependency repointed to `file:./vendor/…`.
- **Verified the honest way:** the tarball was first confirmed **byte-identical** to the installed
  `node_modules/@equal-lens/brand` (so this ships exactly what is live, no style change), then a **fresh
  `git clone` + `npm ci` + `next build`** was run in a temp directory with no access to
  `/Users/priyanshu/The Equal Lens/`. Both succeeded; all 11 routes built. `package.json` and
  `package-lock.json` now contain no path outside the repo. Merged `--no-ff` and pushed
  (`swipeed-equal-lens` `0f673d9`).
- **Old repo `/Users/priyanshu/swipeed`: safe to archive, nothing would be lost.** Verified at the object
  level rather than by feature: **0 commits exist in the old repo that are not already in
  `swipeed-equal-lens`** (274 vs 845 commits; fork point `82d2e9f`, 2026-06-20, which is also still the old
  repo's tip: it has not advanced one commit since the clone). All 38 local branches are 0 ahead of
  `origin/main` (merged pointers, not pending work). Clean tree, no stashes, no tags, no unreachable
  objects. The 11 tracked files absent from equal-lens are **deliberate deletions**: `weather.tsx`,
  `seasons.ts`, `time-of-day.ts` (removed in `b8a6bda`), `swipeed-logo.svg` (replaced by `public/brand/`),
  and a gitignored `.lazyweb/` report, and all are recoverable from equal-lens's own history at `b8a6bda^`.
- **⚠️ Second deploy hazard found.** `/Users/priyanshu/swipeed/.vercel/project.json` points at
  **`prj_BYLrgKs8JH2BLHe4xNwtThViNJMj`, the same Vercel project** as the Equal Lens repo. So the frozen
  June-20 app can reach production by **two** routes: a push to `priyanshuj0410-code/SwipeEd` (the git
  integration), *or* a stray `vercel --prod` from that directory. Archiving the local directory closes the
  second; only disconnecting the git integration closes the first.
- **Remaining, needs the founder (browser):** in the Vercel dashboard → `swipeed` → Settings → Git,
  **disconnect `priyanshuj0410-code/SwipeEd` and connect `priyanshuj0410-code/swipeed-equal-lens`**. The
  build-side blocker is gone, so git auto-deploy will work once repointed. Also worth removing the now-
  pointless `upstream` remote from the Equal Lens repo. SWED-44, follows SWED-43.

## 2026-09-01 · CORRECTION to SWED-42: Vercel *does* have a git integration (pointed at the wrong repo)
- **What SWED-42 got wrong.** It recorded that Vercel had no git integration and that the GitHub app was
  never authorized. Both false. The founder's dashboard screenshot shows the `swipeed` project **has** a
  Connected Git Repository: **`priyanshuj0410-code/SwipeEd`, connected Jun 20**, the *frozen ancestor*,
  not the live app. The correct inference from `.vercel/output` was "this deploy was prebuilt", not
  "there is no git integration".
- **Why it never fired:** every production deployment is CLI `--prebuilt`, 7-10s durations (no cloud
  build) under the account owner's name, and nothing has been pushed to `priyanshuj0410-code/SwipeEd`
  since Jun 20 (`main` there is in sync with origin at `82d2e9f`).
- **The live hazard:** the integration is armed and aimed at the wrong repo. **A push to
  `priyanshuj0410-code/SwipeEd` would auto-build and deploy the frozen 43-node pre-v2 app over
  production**, replacing the Equal Lens app. That repo still holds unmerged local feature branches.
- **Why it can't simply be repointed at `swipeed-equal-lens`:** `@equal-lens/brand` is
  `file:../The Equal Lens/brand/design-system/equal-lens-brand-0.1.0.tgz`, a path **outside** the repo and
  untracked, so a Vercel cloud build fails at `npm install`. This is the original reason for the prebuilt
  flow. **Vendoring or publishing that package is a prerequisite** for any git-based deploy.
- SWED-41's separate finding stands and is fixed: the app repo now has a private GitHub remote. Note the
  two are independent: the backup gap and the deploy path are different problems. SWED-43.

## 2026-09-01 · infra: the live app repo is now backed up to a private GitHub remote
- **The gap SWED-41 surfaced:** `swipeed-equal-lens` (the canonical app, the v2 engine, and all 33,542
  scenarios) had **no git remote at all**. Being live on Vercel was not a backup: `.vercel/project.json`
  links a *directory*, and `.vercel/output/` holds Build Output API artifacts from a local `vercel build`,
  so deploys were CLI uploads of compiled output, never a git integration. The one copy of ~11 days of
  intensive content work lived on a single Mac.
- **Root cause (long-standing, not new):** Vercel git auto-deploy needs a one-time GitHub-app
  authorization; the original workaround was "until then `vercel deploy --prod`". That stopgap was never
  undone, and when the Equal Lens repo was branched off `swipeed` as a fresh repo it never got a remote.
- **Fixed:** created **`priyanshuj0410-code/swipeed-equal-lens` (PRIVATE)** and pushed `main`, 842
  commits, verified `origin/main == main`. Private is required, not preference: the repo is RSE/CSE and
  child-safeguarding content for minors. No secrets tracked (`.env*` and `.vercel` are gitignored;
  confirmed nothing sensitive in the pushed tree). `main` already contains every forge/docs branch via
  `--no-ff`, so no history was lost by pushing `main` alone.
- **Still open (needs the founder, browser step):** authorize the Vercel GitHub app to get git
  auto-deploy. Until then **push and deploy are two separate actions**: pushing does not deploy, and
  deploying does not push. Noted in [README](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/README.md) and [AGENTS.md](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/AGENTS.md). SWED-42.

## 2026-09-01 · docs: KB staleness sweep (corrected 181 verified stale facts across 81 files)
- **Why:** the SWED-40 refresh fixed the app-level counts but a full audit (every KB doc cross-checked
  against the live `swipeed-equal-lens` code, each finding independently re-verified) found the drift was
  much wider, **181 confirmed stale facts in 81 files**. SWED-41.
- **The big one: the 3D world in the KB no longer existed.** [swipeed-world.md](../games/swipeed-world.md)
  and [world-art-tokens.md](../games/world-art-tokens.md) still documented the Kenney-kit **grassland** world
  with per-chapter **seasons**, **weather emitters** and a **day/night lighting** layer. The Equal Lens
  re-skin had deleted all of it (`refactor(path): canvas is the only/default world` →
  `refactor(path): delete the realistic 3D world completely`): `src/lib/seasons.ts`, `src/lib/time-of-day.ts`
  and `src/components/weather.tsx` **do not exist**, and `path-scene.tsx` (now 2297 lines) loads **no GLB
  models** and sets `scene.fog = null`. Both docs rewritten to the shipped **canvas** world: the kids→adult
  **theme flip** (`ThemeController` / `adultStartU` / `data-audience="adult"` at the Ch.5→Ch.6 boundary) and
  **per-chapter canvas dressing** (`chapter-canvas/chapter-1…8.json`), the two systems that actually style
  all 8 chapter regions. The path companion is the **brand flying ship** (SVG via drei `<Html>`), not a
  walking 3D character. Colormap PNGs, Kenney/Holiday GLBs and `character-female-c.glb` marked **orphaned**.
  This also closes SWED-40's open item ("unverified whether Ch.6-8 got region styling"): they do, just not
  by seasons, and neither do Ch.1-5.
- **Per-game bank counts (69 docs).** Every game doc's v2 blockquote still quoted its **pre-forge ~84-scenario**
  library with per-category and per-mechanic tallies. All three number groups recomputed from the live banks
  using the forge's own parser (`scripts/forge/common.py: parse_file`), e.g. be-the-safe-adult 84→**406**,
  outbreak 84→**522**, puberty-quest 85→**446**. Verified fleet totals: **69 games, 33,542 scenarios**,
  median 495, only two below 400 (raising-neurodiverse-kids 396, looking-after-you 397, the logged
  quality-first dips). [swipeed-content-pipeline.md](../games/swipeed-content-pipeline.md)'s "5,794-scenario
  bank" → ~33,500.
- **Narrator.** 157 user-facing **"Sam"** references across 70 files → **Lensy** (retired in the re-skin;
  confirmed 0 user-facing "Sam" left in the app: the one hit is an internal `source` metadata field). The
  component is still named `sam.tsx` and those code paths were deliberately preserved.
- **Repo identity + a real risk surfaced.** [README.md](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/README.md) and [AGENTS.md](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/AGENTS.md) both
  called this the "core engine repo" while it tracks **zero code**; both now say documentation-only with the
  engine as intent. README also pointed readers at `github.com/priyanshuj0410-code/SwipeEd` as "the app's
  code": that repo is the **ancestor, frozen at 2026-06-20** (pre-v2, pre-forge, 43 nodes). The canonical
  app is **`swipeed-equal-lens`, which has no git remote: it is local-only**, and it is the only copy of
  the v2 engine and all 33.5k scenarios. Flagged for the founder; not a docs fix.
- **Also corrected:** README (ages 3-18 → 3→parenthood, 43+5 → 69+8, five → eight chapters);
  [games/index.md](../games/index.md) (5 → 8 capstones, whole catalog built);
  [swipeed-interaction-model.md](../games/swipeed-interaction-model.md) (six → eight capstones);
  [swipeed-core-principle.md](../games/swipeed-core-principle.md) (Lensy hosts in-game; the path companion is
  a separate object); [swipeed-game-patterns.md](../games/swipeed-game-patterns.md) (Ch.1-2 retrofit note
  historicised: the fleet is complete); [architecture/index.md](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/index.md) ("tech stack
  undecided" scoped to the *engine*; the frontend stack is decided and shipped);
  [life-skills-toolkit.md](../games/life-skills-toolkit.md) (dead `time-of-day.ts` reference);
  root **Developer Hand-off** doc given a HISTORICAL banner (its "do NOT build yet" list (manosphere beat,
  parent layer, 18+) was all built).
- **Left for the founder to rule on:** 12 game docs whose "**led by** \<mechanic\>" prose no longer matches
  the mechanic with the largest count after growth (several are near-ties; one, justice-league-rights, is an
  exact tie). That phrase reads as *design* lead rather than a histogram claim, so it was not auto-rewritten.
- Dated `log.md` history left untouched throughout (correct as-of its time).

## 2026-06-29 · docs: refreshed stale app-level docs to the current 69-game/8-chapter state
- Post-fleet-complete KB audit found pre-session app docs still on the "ages 3-18 / 43-node / 5-chapter" era. Corrected the live-state facts: [swipeed.md](../games/swipeed.md) (69 games + 8 capstones, ages 3→parenthood, all grown ≥400), [games/index.md](../games/index.md) (removed the contradictory Chapter-7/8 "under construction" narration (both are complete) and scoped the old "whole path / 43 nodes" summary to "the child journey, Ch.1-5"), [capstones.md](../games/capstones.md) frontmatter (5→8), and [green-light-red-light.md](../games/green-light-red-light.md) ("43 nodes"→69). Dated `log.md` history left as-is (correct as-of its time). **Open item (not fixed):** `swipeed-world.md` still says "five chapter regions" for the 3D per-region *styling* (seasons/weather), unverified whether Ch.6-8 got region styling; the content path itself spans all 8 chapters. SWED-40.

## 2026-06-29 · docs: SwipeEd build overview ("what we built & why")
- Wrote [games/swipeed-build-overview.md](../games/swipeed-build-overview.md), an end-to-end synthesis tying together the product, the v2 mechanic-embodying engine, the forge content pipeline, the deterministic-gate + adversarial-reviewer safety design (and why it's load-bearing), the 14→69 run, the three hardenings, tooling/guardrails, repo topology/deploy, and outcomes/next. Linked from [index.md](../README.md) and [games/index.md](../games/index.md); refreshed the stale root project-status line (43 nodes/ages 3-18 → 69 games/ages 3→parenthood, fleet complete). SWED-39.

## 2026-06-29 · 🎉 FORGE FLEET COMPLETE: all 69 games grown to ≥400 and live
- **Wave 31 (final): navigating-addictions 84→435, be-the-safe-adult (g69) 84→406**: both safety-critical and 0 review fixes; merged `--no-ff`, deployed. swipeed.vercel.app → `dpl_8DQXJFUvVBidKnTSnD3psb5572XZ` (200). Tracked as SWED-38.
- **THE ENTIRE 69-GAME CATALOG IS NOW GROWN.** Every node g01-g69, **Chapters 1-8 (ages 3 → parenthood)**, is at ≥400 scenarios (67 at ≥400; 2 logged quality-first dips: looking-after-you 397, raising-neurodiverse-kids 396, each with `exhaustion.json`). All live.
- **The run, end to end (started this session at 14/69):** 27 waves (5-31) grew **55 games** from ~84 → 400+; every game independently verified (forge_check --game + forge_dedup + check_msg_len + tsc + narrator==Lensy), committed on its own branch, `--no-ff` merged, and deployed per wave. Cadence: waves of 2; staggered single-game relaunch on throttle/post-reset.
- **Pipeline hardenings shipped along the way:** Ground-stage retry (SWED-10), spot-polarity generator rule (SWED-17), narrator pin to Lensy (SWED-27).
- **Why the adversarial reviewer mattered (the load-bearing safety layer the deterministic gate is blind to):** caught + fixed **2 full sort/spot key-inversion clusters** (bounce ×7 exam-stress boards, speak-up ×8 + glrl ×7 + others "spot" scenes, all structurally valid), plus a grooming "meet-to-verify-identity" trap, an under-18 safeguarding misroute (181→Childline 1098), a DV live-danger ordering (112 first), a "secret-keeping=loyalty" reflex, depicted disordered-eating/self-harm methods removed, a transphobic slur removed from a 9-12 hook, a shaken-baby-safe-down keyed correctly, and CSA-disclosure handling (believe / never-promise-total-secrecy / report). Zero answer-key inversions shipped.
- **Tracking:** 38 SWED issues opened across the project, all closed; every commit `[SWED-n]`-tagged. KB (log + pipeline doc + patterns) and fleet memory current. Both repos clean on `main`.

## 2026-06-29 · Forge wave 30: Chapter 8 to 7/9 (67/69)
- **2 games grown, verified, merged, deployed** (~1M tokens each), Ch.8 (parenthood, ceiling 500), narrator all Lensy, both inclusion-heavy parenting games:
  - **raising-gender-diverse-kids** (Ch.8: accepting/affirming LGBTQ+ children): **84 → 437**. 0 review fixes. Acceptance halves suicide-attempt odds; conversion "cures" always harmful; never-out the child; refuse-cure/repair-possible/love-first; parent's fear framed protective-not-hate; KIRAN 1800-599-0019 / Tele-MANAS 14416 / 112.
  - **raising-neurodiverse-kids** (Ch.8: parenting neurodivergent children): **87 → 396** (second quality-first floor dip, `exhaustion.json` logged, no filler). Difference-not-deficiency; meltdowns = overwhelm not naughtiness; cure-sellers/quacks flagged; accommodations = fair access (like glasses); RPwD Act 2016 rights; burnout → Tele-MANAS 14416. Review fixed 2 ungrammatical labels.
- **Cumulative 67/69; Chapter 8 at 7/9**: only navigating-addictions + be-the-safe-adult (g69, the final node) left. Deployed: swipeed.vercel.app → `dpl_DJLfb5supk9xbLz5jfEzG8SgRZLa` (200). Tracked as SWED-37.

## 2026-06-29 · Forge wave 29: Chapter 8 to 5/9 (65/69)
- **2 games grown, verified, merged, deployed** (~1M tokens each), Ch.8 (parenthood, ceiling 500), both 0 review fixes + narrator all Lensy, two of the most safety-sensitive games in the catalog:
  - **break-the-cycle** (Ch.8: ending harsh intergenerational patterns): **84 → 416**. Shaken-baby risk keyed to "lay baby down safely, step out"; fear-of-harming-child → Childline 1098/112; parent's load/flashbacks → Tele-MANAS 14416; harsh discipline always negative; firm-and-kind, fear != respect; busts the practice, never shames the parent.
  - **the-talks** (Ch.8: age-by-age conversations with kids): **84 → 441**. Correct body-part names = protection; "don't tell your parents" = unsafe; disclosure → stay calm/believe → Childline 1098/112; secret-games flagged; no-body-secrets; consent-at-four; explicit detail age-appropriately deferred.
- **Cumulative 65/69; Chapter 8 at 5/9**: 4 games left (raising-gender-diverse-kids, raising-neurodiverse-kids, navigating-addictions, be-the-safe-adult). Deployed: swipeed.vercel.app → `dpl_CPsGvtVgAd6Pn1pMWV9U8o3JKfwg` (200). Tracked as SWED-36.

## 2026-06-29 · Forge wave 28: Chapter 8 to 3/9 (63/69); first quality-first floor dip
- **2 games grown, verified, merged, deployed** (~1M tokens each), Ch.8 (parenthood, ceiling 500), narrator all Lensy:
  - **equal-parents** (Ch.8: shared parenting, involved dads, parental mental load): **84 → 446**. Pro-men/never father-shaming; "helper/babysitting" only ever myths-to-erase; only breastfeeding mother-specific; burnout → Looking After You / Tele-MANAS 14416. Review caught + fixed a garbled inverted best-option consequence (ep2-927).
  - **looking-after-you** (Ch.8: parental wellbeing/burnout, PPD): **84 → 397**, **first quality-first floor dip** (just under the 400 target; the assemble agent logged `exhaustion.json` rather than padding with filler, exactly the founder's locked decision). PPD = treatable symptom not verdict; intrusive thoughts named as symptom+cue, never elaborated → Tele-MANAS 14416 / KIRAN / 112; fathers (~1/10) included; self-harm always negative.
- **Cumulative 63/69; Chapter 8 at 3/9.** Deployed: swipeed.vercel.app → `dpl_6naUiwAssCkUn6zpiFYU21zbBgjy` (200). Tracked as SWED-35.
- **Operational:** Wave 28's first attempt hit the account session limit mid-generation (both rolled back clean); recovered after the 17:10 IST reset via staggered single-game relaunch. 6 games left, all Ch.8.

## 2026-06-29 · Forge wave 27: CHAPTER 7 COMPLETE (8/8); Chapter 8 opened (61/69)
- **2 games grown, verified, merged, deployed** (~1M tokens each), narrator all Lensy:
  - **many-ways-to-family** (Ch.7, ages 22→first child: adoption/IVF/surrogacy/diverse family forms): **84 → 441**, **completes Chapter 7 (8/8)**. Indian legal facts accurate + dated (CARA 2022, Surrogacy/ART Acts 2021 altruistic-only, Supriyo 2023); dignity-first (no family form lesser, bio not disparaged); off-book "fixers" flagged risky; official routes (CARA/licensed clinic/NALSA 15100); not legal advice. Review shifted safe/unsafe→risky/sound (adult register).
  - **us-after-kids** (Ch.8, parenthood: the couple after a baby): **84 → 438**, **opens Chapter 8 (the final chapter)**. 0 review fixes. Perinatal depression real + treatable → Tele-MANAS 14416; abuse-vs-normal-strain line crisp; father-isn't-babysitting; no intimacy-owed/clock framing; doom thoughts deferred-not-invalidated.
- **CHAPTER 7 COMPLETE (8/8).** **61/69 games** at ≥400, all live. Only Chapter 8 (parenthood, 8 games left) remains. swipeed.vercel.app → `dpl_HjrCmdnFc4CYf6q8E6kxM9TiFdhN` (200). Tracked as SWED-34.

## 2026-06-29 · Forge wave 26: Chapter 7 to 7/8 (59/69)
- **2 games grown, verified, merged, deployed** (~1M tokens each), Ch.7 (ages 22→first child, ceiling 500), narrator all Lensy:
  - **if-when-whether** (Ch.7: whether/when to have children, fertility, spacing): **84 → 434**. 0 review fixes. Childfree always valid; son-preference always flagged as pressure; sex-selection illegal (PCPNDT); male-factor infertility named common; no fertility-clock scare; IVF never guaranteed; not medical advice.
  - **money-together** (Ch.7: joint finances, fair-not-gendered, control-is-abuse): **84 → 453**. Economic control = abuse under PWDVA 2005 (181/1091/112/NALSA 15100); even-handed (husband protected too); stridhan + joint+personal accounts honoured; lower-earner never shamed; childcare/eldercare = real work. Review fixed 1 garbled hook.
- **Cumulative 59/69; Chapter 7 at 7/8**: only many-ways-to-family left to complete Ch.7, then only Chapter 8 (parenthood) remains. Deployed: swipeed.vercel.app → `dpl_7Jsg8prFTBErpZj5zKgfGtJugKwb` (200). Tracked as SWED-33.

## 2026-06-29 · Forge wave 25: Chapter 7 to 5/8 (57/69)
- **2 games grown, verified, merged, deployed** (~1M tokens each), Ch.7 (ages 22→first child, ceiling 500), narrator all Lensy:
  - **respect-at-home** (Ch.7: domestic respect & safety, consent inside, spotting abuse/coercive control): **84 → 518**. Safety-critical and handled carefully: abuse 100% on the abuser, even-handed (male survivors incl.), leaving always the survivor's choice (no leave-pressure), helpline allowlist only (181/1091/112/NALSA 15100/trusted person; wrong-number trap on 1098/100), DV Act educational. Review fixed 1 malformed hook.
  - **family-map** (Ch.7: in-laws/extended family, couple-as-team, kind boundaries, respect both ways): **84 → 447**. Respect != obedience; estrangement-by-default never the good answer; control/dowry/threats = abuse (not friction) → counsellor/181/112; dowry illegal (1961 Act). Review fixed 6 dropped-word clarity issues + trimmed 2 over-ceiling.
- **Cumulative 57/69; Chapter 7 at 5/8.** Deployed: swipeed.vercel.app → `dpl_7VDxDhkYLxtqcprUvFpuhys4hGop` (200). Tracked as SWED-32.

## 2026-06-29 · Forge wave 24: Chapter 7 to 3/8 (55/69)
- **2 games grown, verified, merged, deployed** (~1M tokens each), Ch.7 (ages 22→first child, ceiling 500), both 0 review fixes + narrator all Lensy:
  - **equal-partners** (Ch.7): sharing housework/childcare fairly, seeing the mental load, owning vs helping, two careers: **84 → 468**. "Owning vs helping" (not helping=sharing); even-handed (men as equal owners, no man-bashing); control/coercion → 181/1091/112 + Respect at Home.
  - **your-path-your-call** (Ch.7): whether/when/whom to marry, childfree-as-complete, holding your ground, worth beyond marital status: **84 → 456**. Strongly even-handed (marriage-by-choice AND childfree both affirmed, no pressure either way); forced/coerced marriage → 181/1091/112/1098 with a deliberate "call 100" wrong-route trap.
- **Cumulative 55/69; Chapter 7 at 3/8.** Deployed: swipeed.vercel.app → `dpl_3bfCvvoZG2Zx8bBjJkJQ5pdaJiJo` (200). Tracked as SWED-31.

## 2026-06-29 · Forge wave 23: CHAPTER 6 COMPLETE (9/9); Chapter 7 opened (53/69)
- **2 games grown, verified, merged, deployed** (~1M tokens each), both 0/low review fixes + narrator all Lensy:
  - **know-your-rights** (Adult, Ch.6, ages 18-22: POSH, cyber/data, renting/consumer, rights at work): **84 → 451**, **completes Chapter 6 (9/9)**. 0 review fixes. Verified helplines (NALSA 15100, 181/1091/112/1930/1098); POSH facts accurate; image-abuse on the perpetrator; no false-outcome guarantees.
  - **choosing-building** (Choosing & Building, Ch.7, ages 22→first child, band ceiling 500): **84 → 498**, **opens Chapter 7**. Review replaced an off-grounding helpline; free "no"/"not yet" always best; even-handed love-vs-arranged; queer partnerships affirmed; no pressure toward/against marriage.
- **CHAPTER 6 COMPLETE (9/9).** With Ch.1-5 already done, the **entire ages 3→22 span (Chapters 1-6) is now fully grown**, **53/69 games** at ≥400, all live. swipeed.vercel.app → `dpl_Ft2sZDoWtLYo5mhvqt9jcaGiCYdc` (200). Tracked as SWED-30.
- Chapter 7 (partnership/family-formation, 22→first child) now 1/8. Next: rest of Ch.7, then Ch.8 (parenthood). 16 games left.

## 2026-06-29 · Forge wave 22: Chapter 6 to 8/9 (51/69)
- **2 games grown, verified, merged, deployed** (~1M tokens each), Ch.6 (ages 18-22), both 0 review fixes + narrator all Lensy:
  - **find-your-feet** (Ch.6): early-career pressure, comparison trap, worth-beyond-CV, your own path: **84 → 451**. "You've failed / too late / just think positive" appear only as named fear-distractors the content negates; distress → Tele-MANAS 14416 / KIRAN.
  - **equal-confident** (Ch.6): workplace voice, allyship, spotting/countering bias, leading the room: **84 → 462**. Evenhanded (men-as-allies, never anti-boy/zero-sum); "bossy" double-standard rejected; never-out LGBTQ+ colleagues; call-in alongside call-out; harassment → POSH IC / 181.
- **Cumulative 51/69; Chapter 6 at 8/9**: only know-your-rights left to complete Ch.6. Deployed: swipeed.vercel.app → `dpl_9ZENaLs7n5vsovst7ViGbTbCrnd2` (200). Tracked as SWED-29.

## 2026-06-29 · Forge wave 21: Chapter 6 to 6/9 (49/69); narrator-pin validated
- **2 games grown, verified, merged, deployed** (~1M tokens each), Ch.6 (ages 18-22), **first wave on the narrator-pinned generator (SWED-27)**: both came out 0 "Sam" (hardening validated):
  - **money-independence** (Ch.6): budgeting/earning/money-&-love/scams/independence: **84 → 456**. Financial control named as DV-Act abuse (181/1091); scam mechanics accurate (UPI-request/OTP/advance-fee → cybercrime 1930); supporting family without shaming. Review fixed a hook/myth + a payslip-line.
  - **mind-belonging** (Ch.6): mental health/belonging/coping/self-worth: **84 → 490**. Review **removed depicted disordered-eating methods from 4 scenarios** (restriction reframed to event-avoidance / self-critical beliefs per the no-method ban); crisis beats route to Tele-MANAS 14416 + trusted adult; help-seeking as strength across genders.
- **Cumulative 49/69; Chapter 6 at 6/9.** Deployed: swipeed.vercel.app → `dpl_B5KnB6njiGdXKeV4KGUWtxGZdWi5` (200). Tracked as SWED-28.
- **Session paused here at the founder's request** (after 17 waves this session, 5→21 = 34 games grown + deployed, plus 3 pipeline hardenings). Remaining: 20 games, rest of Ch.6 (find-your-feet, equal-confident, know-your-rights) + all of Ch.7-8.

## 2026-06-29 · Forge wave 20: Chapter 6 to 4/9 (47/69); narrator-leak caught
- **2 games grown, verified, merged, deployed** (~1M tokens each), Ch.6 (ages 18-22):
  - **real-relationships** (Ch.6): healthy vs abusive relationships, fighting fair (Gottman four-wreckers), red flags, leaving safely: **84 → 503**. Review fixed rr-1134 (image-based threats route to cybercrime 1930, not 112). Control/abuse named plainly; "leaving can be dangerous: plan, tell someone"; even-handed across genders + queer.
  - **own-your-health** (Ch.6): sexual/reproductive health, confidential access, U=U, pleasure-positive (non-explicit): **84 → 502**. Routes NACO ICTC / RKSK / clinic, 181 / 1098; queer-inclusive; no marital-status gating.
- **Narrator-leak caught + fixed:** own-your-health's GROUNDING (derived from the original pre-re-skin GDD) leaked the old narrator **"Sam:"** into 47 lines, and one category reviewer wrongly "corrected" toward it. The **bank-wide convention is "Lensy:"** (the Equal Lens re-skin mascot, 3964 hooks; only own-your-health had any "Sam"). Standardized own-your-health to Lensy. **Risk for remaining Ch.6-8 games** (same GDD lineage) → hardening the generator prompt next (SWED-27).
- **Cumulative 47/69; Chapter 6 at 4/9.** Deployed: swipeed.vercel.app → `dpl_5P8rrYbac6rJ6JtN41e8HM27D6Wc` (200). Tracked as SWED-26.

## 2026-06-29 · Forge wave 19: CHAPTER 5 COMPLETE (9/9); Chapter 6 opened (45/69)
- **2 games grown, verified, merged, deployed** (~1M tokens each):
  - **decoded** (Ch.5, ages 15-18: media/porn/algorithm literacy, non-explicit): **84 → 489**, **completes Chapter 5 (9/9)**. Review fixed a spot hook/key inversion (dc-1010: doomscroll/auto-play wrongly tagged as the "on-purpose" items the player taps) and tightened 2 safety overclaims. Critical-not-cynical; verify-the-source > spot-a-fake-by-looking.
  - **swipe-right** (Ch.6, ages 18-22: Dating & Apps): **84 → 503**, **opens Chapter 6**. 0 review fixes. Adult dating-safety: meet-in-public/video-verify/own-way-home; romance-scams + image abuse → cybercrime 1930 / 181 / 1098; deceit on the deceiver (no victim-blaming); pace/number-of-matches never shamed.
- **CHAPTER 5 COMPLETE (9/9).** With Ch.1-4 already done, the **entire ages 3→18 span (Chapters 1-5) is now fully grown**, **45/69 games** at ≥400, all live. swipeed.vercel.app → `dpl_81xv7nATEuQ5GgwomsWiMJEUFMTm` (200). Tracked as SWED-25.
- Chapter 6 (young-adult, ages 18-22) now 2/9 (consent-real pilot + swipe-right). Next: the rest of Ch.6, then Ch.7-8.

## 2026-06-29 · Forge wave 18: Chapter 5 to 8/9 (43/69)
- **2 games grown, verified, merged, deployed** (~1M tokens each), Ch.5 (ages 15-18, ceiling 460):
  - **life-ready** (Ch.5): life skills (decisions/coping/people-skills/support): **85 → 509**. 0 review fixes across all 6 categories. Distress routed warmly to Tele-MANAS 14416 / KIRAN / Manodarpan ("life-skills, not therapy"); help-seeking as strength; no marks=worth.
  - **justice-league** (Justice League: Rights Edition, Ch.5): legal rights & justice: **84 → 492**. Review fixed an important **live-danger routing** issue (ongoing DV at home now routes emergency 112 + trusted adult FIRST, before the legal-process step), a teacher→trusted-adult narrowing, and an item-vs-bin id collision. Verified helplines (NALSA 15100, 1098/181/1091/112/1930); revenge/doxxing always non-best; DV not "private".
- **Cumulative 43/69; Chapter 5 at 8/9**: only decoded left to complete Ch.5. Deployed: swipeed.vercel.app → `dpl_APMxHuX3mza2Z6dYoBWbxm8JkvKf` (200). Tracked as SWED-24.

## 2026-06-29 · Forge wave 17: Chapter 5 to 6/9 (41/69)
- **2 games grown, verified, merged, deployed** (~1M tokens each), Ch.5 (ages 15-18, ceiling 460):
  - **change-makers** (Ch.5): youth activism / advocacy: **84 → 512**. Review fixed 2 safeguarding-route narrowings (a minor disclosing abuse at home routed to women's helpline 181 → corrected to Childline 1098, the under-18 line). Activism framed safe/lawful/adult-backed (no vigilante/doxx/lone-confrontation); laws cited correctly.
  - **lead-the-way** (Ch.5): allyship & leadership: **84 → 531**. Review fixed 2 "trusted teacher"→"trusted adult" narrowings. Male-allyship-as-strength (never betrayal); call-in over call-out; unsafe confrontation deferred to a trusted adult / 181 / 112 / 1098.
- **Cumulative 41/69; Chapter 5 at 6/9.** Deployed: swipeed.vercel.app → `dpl_8veFBko1BHSNoSX2qvzi2P7KHRMY` (200). Tracked as SWED-23.
- Recurring reviewer value this wave: under-18 safeguarding-route correctness (Childline 1098 vs 181) and "any trusted adult" breadth, both invisible to the shape-only gate.

## 2026-06-29 · Forge wave 16: Chapter 5 to 4/9 (39/69); recovered from session-limit + throttle
- **2 games grown, verified, merged, deployed** (~1M tokens each), Ch.5 (ages 15-18, ceiling 460):
  - **mutual** (Ch.5): consent / FRIES standard: **84 → 510**. 0 key inversions across all 6 categories. Freeze isn't yes, earlier-yes isn't ongoing, incapacitated/coerced yes is void; survivor never at fault; even-handed (no gendered aggressor/victim defaulting).
  - **spectrum** (Ch.5): LGBTQ+ dignity & inclusion: **84 → 508**. 0 review fixes across all 6 categories. "Never out someone" confidentiality rule held; conversion practices framed as discredited/harmful; no label-pressure; slurs abstract (never spelled).
- **Cumulative 39/69; Chapter 5 at 4/9.** Deployed: swipeed.vercel.app → `dpl_DqqUjVZMojuTEWwPzdmZYUaZ5fuH` (200). Tracked as SWED-22.
- **Operational:** Wave 16's first attempt hit the **account session limit** mid-generation (both rolled back clean, untouched at 84); an immediate paired retry then tripped a **transient server throttle** (too many rapid launches: the Ground-retry hardening caught it cleanly). Recovered by **backing off ~4 min, then relaunching one game at a time staggered ~2.5 min apart**. Lesson: on a throttle, stagger single-game relaunches rather than re-bursting the pair.

## 2026-06-28 · Forge wave 15: Chapter 5 opened (37/69)
- **2 games grown, verified, merged, deployed** (~1M tokens each), first Ch.5 games (ages 15-18, band ceiling 460, adult register):
  - **status-know-it** (Status: Know It, Ch.5): **84 → 506**: HIV/STI status, testing, U=U, anti-stigma. Review fixed a soft safety inversion (avoidant "skip the protection talk" wrongly affirmed as a clear "no"), a degenerate two-identical-bin sort, and a loose "guards against STIs" bin label. Outing someone's status framed as a stigma trick; NACO ICTC / Childline 1098 routes.
  - **my-choices** (My Choices My Future, Ch.5): **84 → 545**: contraception / reproductive choice. POCSO-clean (older-person pressure framed as exploitation, never the young person's fault); comprehensive-never-explicit; "not ready"/"wait"/"unsure" affirmed throughout. 0 spot inversions.
- **Cumulative 37/69; Chapter 5 at 2/9.** Deployed: swipeed.vercel.app → `dpl_cYUgLYeYbbS86V5aQYiVBypnNZYh` (200). Tracked as SWED-21.
- Adult-chapter content (consent/contraception/STI/rights) handled cleanly under the same gates + adversarial review; spot-polarity hardening holding (0 spot inversions).

## 2026-06-28 · Forge wave 14: CHAPTER 4 COMPLETE (11/11); ages 3-15 fully grown (35/69)
- **2 games grown, verified, merged, deployed** (~1M tokens each):
  - **rabbit-hole** (The Rabbit Hole, Ch.4, ages 12-15: manosphere/incel-funnel media literacy): **84 → 519**. 0 review fixes across all 6 categories. Pseudo-science (alpha/sigma/"high-value") only ever as quoted grift the scenario busts; "the funnel is the target, never the boy"; loneliness/self-harm cues route to Tele-MANAS 14416.
  - **reality-check** (Ch.4, ages 12-15: deepfakes/porn-vs-reality/sextortion): **85 → 566**. 0 review fixes. **Critical check passed:** CSAM/leaked-nude content binned "never store, report" (not "keep as evidence"); fakes never the victim's fault; verify-the-source > visual tells; allowlisted routes only.
- **CHAPTER 4 COMPLETE (11/11).** With Chapters 1-3 already done, the **entire ages 3→15 span (Chapters 1-4) is now fully grown**, **35/69 games** at ≥400, all live. swipeed.vercel.app → `dpl_8LrPG8AL4UpzWNWRJ1AFpJeU7M6Y` (200). Tracked as SWED-20.
- Spot-polarity hardening still holding (0 spot inversions across both games; rabbit-hole + reality-check needed 0 review fixes total). Next: Chapters 5-8 (ages 15→parenthood), 34 games, starting with Ch.5 (my-choices, status-know-it, …).

## 2026-06-28 · Forge wave 13: Chapter 4 to 9/11 (33/69)
- **2 games grown, verified, merged, deployed** (~1M tokens each), both safeguarding-heavy:
  - **stand-up** (Ch.4, ages 12-15): **84 → 538**. Review fixed an ID collision (3 reused ids → free range), two "teacher"→"trusted adult" narrowings, a "who is responsible" sort valence mis-signal (so the harasser's action isn't coloured green), and a five-Ds wording that risked endorsing shouting at a harasser. Survivor-centred; helplines 181/112/1098 verbatim.
  - **firewall** (Ch.4, ages 12-15, online safety/sextortion/grooming): **84 → 538**. Review caught a subtle grooming-unsafe inversion (fw-1159 framed *meeting* an online contact as identity verification) → "vouched for by people you trust offline", and added "tell a trusted adult" to a sextortion plan. Allowlisted routes only (cybercrime.gov.in/1930, Childline 1098); "you're the victim, not in trouble". 0 spot inversions.
- **Cumulative 33/69; Chapter 4 at 9/11**: only rabbit-hole + reality-check left to complete Ch.4. Deployed: swipeed.vercel.app → `dpl_32kdS8DUUwvnrLqYvEAcibdYYDHN` (200). Tracked as SWED-19.
- Spot-polarity hardening still holding (0 spot inversions across both games). stand-up used `SWIPEED_MSGLEN_OVERRIDE=1` (firewall mid-assembly tripped the whole-bank guard; firewall's own gate then trimmed its 2 over-ceiling scenarios, final bank clean).

## 2026-06-28 · Forge wave 12: Chapter 4 to 7/11 (31/69); spot-polarity hardening validated
- **2 games grown, verified, merged, deployed** (~1M tokens each), **first wave on the spot-polarity-hardened generator (SWED-17)**:
  - **mythbuster-lab** (MythBuster: Gender, Ch.4): **90 → 524**. **0 review fixes across all 6 categories, incl. every spot scenario**, vs 7-8 spot inversions in the two prior waves. Evidence-based, evenhanded/never-anti-boy; India role-model facts verified.
  - **equalize** (Ch.4, ages 12-15): **84 → 520**. 0 key inversions; minor fixes only (broadened a "talk to a teacher"→"teacher or trusted adult" route, fixed a sort-bin valence colour). Never-zero-sum (men inside the win); child-marriage beats hope-not-fear, PCMA 18/21 accurate.
- **Cumulative 31/69; Chapter 4 at 7/11.** Deployed: swipeed.vercel.app → `dpl_5zmaLRS3XgRqegcTDVkZdKzRKa3T` (200). Tracked as SWED-18.
- **SWED-17 spot-polarity prompt hardening validated:** the wave that immediately followed it produced **zero spot inversions** across both games, where every wave 8-11 game had multiple. The adversarial reviewer remains the load-bearing catch; the generator prompt now cuts the input error rate.

## 2026-06-28 · Forge wave 11: Chapter 4 to 5/11 (29/69); spot-hook inversions now a clear pattern
- **2 games grown, verified, merged, deployed** (~1M tokens each):
  - **outbreak** (Ch.4, ages 12-15): **84 → 522**. Review un-narrowed a "condoms are the only prevention" overclaim and fixed a medically-loose "silent STIs clear on their own" line (could teach skipping treatment); STI facts CDC-aligned; stigma words only as struck myths.
  - **glrl** (Green Light / Red Light, Ch.4): **84 → 517**. Review caught **7 more spot hook/key mismatches** (gl-955 + gl-1139..1145): hooks told the player to tap the *good* lines while `trick:true` (the items the engine accepts taps on) sat on the *bad* lines. Rewrote each hook to name the manipulative lines; re-verified two directly.
- **Cumulative 29/69; Chapter 4 at 5/11.** Deployed: swipeed.vercel.app → `dpl_3ErzokLb4SkycJuGAX1mWkY4G7NZ` (200). Tracked as SWED-16.
- **The spot-hook inversion is now a confirmed systematic generator failure mode** (speak-up ×8, body-confident ×1, glrl ×7 = 16 spot inversions, plus bounce ×7 sort). Every one structurally valid → shape-gate blind; every one caught by the different-context reviewer. Next: harden the generator prompt so fewer are produced inverted in the first place (SWED-17).

## 2026-06-28 · Forge wave 10: Chapter 4 to 3/11 (27/69); biggest answer-key catch yet
- **2 games grown, verified, merged, deployed** (~1M tokens each):
  - **bounce** (Ch.4, ages 12-15): **84 → 518**. **Biggest catch of the fleet:** **7 exam-pressure SORT scenarios** (bn-1023..1027, 1029, 1030) had **fully inverted keys**: every item binned to the opposite (breakfast/slow-breathing/arriving-early keyed "stress-spiking"; self-compassion keyed "harsh"). Shape-only gate passed all 7; reviewer flipped them, and I independently re-derived two of the fixes before merging. Also fixed crisis helpline anchors (1098→1098/112).
  - **plan-it** (Ch.4, ages 12-15): **85 → 504**. Review removed off-band lactational-contraception detail and a wet-dream/pregnancy-risk confusion; no "safe day"/withdrawal/douching framed as reliable; help-routing kept broad.
- **Cumulative 27/69; Chapter 4 at 3/11.**
- **Independently verified each:** forge_check PASS, forge_dedup 0 intra-band, check_msg_len clean (whole-bank), tsc 0. Merged `--no-ff`; deployed via prebuilt flow: swipeed.vercel.app → `dpl_HL6rKPpPUEsbhABpj5T3iNptATL8` (200). Tracked as SWED-15.
- **Operational note:** bounce was committed with `SWIPEED_MSGLEN_OVERRIDE=1` because plan-it (mid-assembly sibling) momentarily tripped the whole-bank length guard; plan-it's own assemble gate then trimmed its 2 over-ceiling scenarios before returning, and the final whole-bank check is clean. **Running tally: 3 spot/sort key inversions caught across waves 8-10**: the deterministic gate is structurally blind to them; the different-context reviewer is the only thing that catches them.

## 2026-06-28 · Forge wave 9: Chapter 3 COMPLETE (9/9), Chapter 4 opened (25/69)
- **2 games grown, verified, merged, deployed** (~1M tokens each):
  - **defenders** (Ch.3, ages 9-12): **84 → 514**, **completes Chapter 3 (9/9)**. HIV-transmission facts verified vs CDC/NIH anchors; softened a graphic blood-route item for the band; anti-stigma "kindness-not-fear" framing intact ("punishment / bad people get sick" only ever as struck myths).
  - **body-confident** (Ch.4, ages 12-15): **84 → 509**, **opens Chapter 4**. Another **spot-key inversion caught** (bc-1320: ordinary off-days tagged as the warning-sign red flags, real ones as distractors), re-tagged + independently re-verified. Colourism always flipped as harmful; body-neutral not forced-positive; diet-culture phrases only as named/rejected.
- **Cumulative 25/69; Chapter 3 done (9/9), Chapter 4 at 1/11.**
- **Independently verified each** (incl. a direct re-check of the fixed spot scene): forge_check PASS, forge_dedup 0 intra-band, check_msg_len clean, tsc 0. Merged `--no-ff`; deployed via prebuilt flow: swipeed.vercel.app → `dpl_FqzAtigcis7RVDD6uwUYhjAGLfrY` (200). Tracked as SWED-14.
- **Second spot-key inversion in two waves**, which confirms the [pattern note](../games/swipeed-game-patterns.md) and the load-bearing role of the different-context reviewer.

## 2026-06-28 · Forge wave 8: Chapter 3 to 8/9 (23/69); critical spot-key inversion caught
- **2 games grown, verified, merged, deployed** (~1M tokens each):
  - **norm-storm** (Ch.3, ages 9-12): **84 → 512**. Review renumbered 8 re-emitted IDs to free slots (would have tripped the dup-id merge gate) and fixed a garbled item; heavy topics (dowry, caste, period stigma) framed as norms-to-question, non-graphic.
  - **speak-up** (Ch.3, ages 9-12): **85 → 558**. **Critical catch:** 8 of 13 `be-the-upstander` **spot** scenes had an **inverted answer key**: the good/upstander items were marked `trick:true` (the red flag the engine asks the child to catch). As generated, the engine would brand "fetch a teacher" a red flag and praise "films the teasing", teaching the unsafe reflex. Structurally valid (gate passes), so only the adversarial re-derivation caught it. All 8 fixed and **independently re-verified** (harmful/unsafe items now the tricks; unsafe "jump in / challenge the bully" heroics correctly flagged too).
- **Cumulative 23/69; Chapter 3 now 8/9**: only **defenders** left before Chapter 4.
- **Independently verified each:** forge_check PASS, forge_dedup 0 intra-band, check_msg_len clean, tsc 0. Merged `--no-ff`; deployed via prebuilt flow: swipeed.vercel.app → `dpl_4EMHXn2CPTTNXvgg21VuTK5mMWdt` (200). Tracked as SWED-13.
- **Pattern recorded:** the spot/sort/branch/match key-inversion hazard is now a load-bearing rule in [swipeed-game-patterns.md](../games/swipeed-game-patterns.md): a script can't verify an answer key; the different-context reviewer must re-derive every one.

## 2026-06-28 · Forge wave 7: Chapter 3 to 6/9 (21/69)
- **2 games grown, verified, merged, deployed** (~1M tokens each):
  - **crossroads** (Ch.3, ages 9-12): **84 → 518**. Review replaced a "secret-keeping = loyalty" exemplar (unsafe-secret reflex), un-narrowed several "any trusted adult" anchors, and routed a self-harm dilemma to trusted-adult-first (not Childline-only).
  - **flip-script** (Ch.3, ages 9-12): **84 → 536**. Review removed a verbatim transphobic slur from a 9-12 hook (lesson kept), fixed an arbitrary two-synonym sort key, and fixed a "Mum drives the truck → home/care" narrowing.
- **Cumulative 21/69; Chapter 3 now 6/9** (puberty-quest, mind-matters, amazing-journey, boundary-bot, crossroads, flip-script). 3 Ch.3 games left: norm-storm, speak-up, defenders.
- **Independently verified each:** forge_check --game PASS, forge_dedup 0 intra-band, check_msg_len clean, tsc 0. Each merged `--no-ff`; deployed via prebuilt flow: swipeed.vercel.app → `dpl_Csoh9YGYAZbXLb1NPY6qjtPsE2NA` (200). Tracked as SWED-12.

## 2026-06-28 · Forge wave 6: Chapter 3 to 4/9 (19/69); first waves-of-2 run
- **2 games grown, verified, merged, deployed** (full per-game workflow, ~1M tokens each):
  - **amazing-journey** (Ch.3, ages 9-12): **84 → 502**. Review fixed truth-anchor narrowings: baby's sex "from the father's side" → "from the sperm, by chance" (no-fault anchor), tightened "look it up safely" → "ask a trusted adult", and corrected an unattended-birth normalization (trained helpers WITH a hospital/clinic).
  - **boundary-bot** (Ch.3, ages 9-12): **85 → 486**. Review softened a metro-groping line to the 9-12 register and swapped an out-of-scope disordered-eating sort item for an in-theme risky dare. Zero key inversions across 72/71/67/71/66 reviewed.
- **Cumulative 19/69; Chapter 3 now 4/9** (puberty-quest, mind-matters, amazing-journey, boundary-bot).
- **Independently verified each:** forge_check --game PASS, forge_dedup 0 intra-band (cross-band echoes logged, allowed), check_msg_len clean, tsc 0. Each merged `--no-ff`; wave deployed via prebuilt flow: swipeed.vercel.app → `dpl_7PVqZdo4AESd2A9rJRxKuPxPpdeL` (Ready, 200).
- **First wave run at the new cadence of 2** (post-SWED-10): no rate-limit failures. Tracked as SWED-11.

## 2026-06-28 · Forge wave 5: Chapter 2 complete, Chapter 3 started (17/69); pipeline hardened; Plane tracking live
- **3 games grown, verified, merged, deployed** (each: ground → generate + adversarial-review/category → assemble + gate; ~1M tokens):
  - **smart-screen** (Ch.2, ages 6-9): **84 → 436**. Review softened "gory"→"creepy", tightened "an older person"→"a trusted grown-up", removed an actionable eye-harm sort item.
  - **puberty-quest** (Ch.3, ages 9-12): **85 → 446**. Review softened self-harm-ideation sort tiles to the GDD "lasting low mood" ceiling (answer key unchanged); boys/girls puberty bands kept exact.
  - **mind-matters** (Ch.3, ages 9-12): **84 → 522**. Review removed self-harm naming for the band, un-narrowed a safety route back to "any trusted adult / Childline 1098", and replaced a third-party cruelty script with a sanctioned self-directed contrast.
- **This completes Chapter 2 (8/8 games)** and **starts Chapter 3 (2/9)**. Cumulative: **17/69 games at ≥400.**
- **Independently verified each** (never the workflow self-report): forge_check --game PASS, forge_dedup 0 intra-band, check_msg_len clean, tsc 0. Each merged `--no-ff`; the wave shipped via the prebuilt flow (`vercel build --prod` → `deploy --prebuilt --prod`): swipeed.vercel.app now resolves to `dpl_9wcZR5kbBG4b7vbXxU5gJ3qXnrx4` (Ready, 200).
- **Pipeline hardened (SWED-10):** the Ground stage now retries 3× on a transient server rate-limit: mind-matters' first attempt died exactly there and rolled back clean, untouched. Adopted **waves of 2** to stop over-saturating the API (3-at-once was the trigger).
- **Plane tracking live:** created the **SwipeEd (SWED)** project + fleet issues; every change now carries a `[SWED-n]` commit tag. Config at [plane.config.md](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/plane.config.md); pipeline design at [games/swipeed-content-pipeline.md](../games/swipeed-content-pipeline.md).

## 2026-06-24 · Forge 2-game pilot complete + deployed; fleet started
- **The content pipeline is proven end-to-end on two opposite games and live.** Each ran through the full
  per-game workflow (ground → generate + adversarial-review per category → assemble → merge gate; 14 agents,
  ~1M tokens, ~21 min/game):
  - **my-body** (Ch.1, ages 3-6): **84 → 486**. No spot/swipe (correctly disallowed for the band), every sort 6
    items + valence, every match 5 pairs. Reviewer caught a valence mis-tag; 0 key inversions.
  - **consent-real** (Ch.6, adult: the sensitive stress test): **84 → 524**. Spots all 5-item/2-trick,
    survivor-centred + even-handed framing, helplines only from the allowlist and correctly **no Childline
    1098** (a child line) in an adult game; 0 inversions.
- **Independently verified each** (never the workflow's self-report): forge_check --game PASS, forge_dedup 0
  intra-band, check_msg_len clean, tsc 0. Both merged `--no-ff` + deployed (routes 200).
- **Two real bugs caught by verifying:** (1) forge_check's band counter was looser than the pre-commit
  check_msg_len guard → **aligned them** (identical NON_PROSE, now also excluding the structural
  `valence`/`outcome` enums); (2) a game whose filename ≠ its config gameId (feelings-friends.ts → "feelings")
  lost its chapter lookup → **chapter_of() resolves the runtime gameId** so the band ceiling + age-band mechanic
  guard always apply. Both fixed + merged.
- **Cost/throughput:** ~1M tokens + ~21 min per game, ~480-520 validated scenarios each (over the 400 target,
  genuine variety, no padding). Fleet = 67 remaining games run in **waves of 3**, each verified + committed
  independently as it lands. **Wave 1 launched:** feelings-friends, clean-crew, family-garden.

## 2026-06-24 · Content-growth pipeline (`forge`): tooling built + generation loop proven
- **The deeper fix for "games feel like wrappers."** The mechanic-count asks (sort 6 / spot 5 / match 5) and the
  shallowness are fundamentally a **content-bank** problem: ~84/game, ~14/category can't sustain fresh sessions.
  Founder confirmed scope **≥400/game, full fleet** (~21,800 new scenarios). Designed via a 9-agent adversarial
  workflow, then built the tooling. Full design: [content pipeline](../games/swipeed-content-pipeline.md).
- **Principle:** anything a script can prove, a script proves and **blocks** on (recomputed from the committed
  `.ts`, never an agent self-report); only semantic calls (key correct? age-appropriate? a reskin?) go to an
  adversarial agent in a **different context** than the generator, force-triggered by deterministic tripwires.
  (Directly answers the earlier trim workflow's self-certification failure.)
- **Built + verified (`swipeed-equal-lens/scripts/forge/`):** `common.py` (web-verified India helpline allowlist,
  0 false positives on the bank; age-band mechanic allowlist so ages 3-6 get **no predator-spot**; must-be-true
  field roles; parse-or-die; structural validators), `bank_spec.py`, `forge_plan.py` (band-aware quotas),
  `forge_check.py` (one validator = per-batch lint **and** blocking merge gate; correctly blocks the un-upgraded
  bank), `forge_assemble.py` (parse-or-die round-trip), `forge_dedup.py` (whole-bank, intra-band blocks /
  cross-band logs, found 10 pre-existing cross-game twins).
- **Decisions:** floor = **quality-first** (founder: allow a KB-logged dip under 400 rather than ship paraphrase
  filler); **explicit sort-bin `valence`** field added to the schema + engine (kills the binStyle regex-guess
  class for new content; backward-compatible, deployed); helpline/law allowlist founder-signed-off.
- **Proven:** generation loop end-to-end on `my-body/safe-unsafe`, 18 scenarios at the upgraded shapes,
  gate-clean (gate caught 6 band + 1 dup-rights failures → agent self-corrected), India-grounded, age-right.
  Tooling + the `valence` engine change merged `--no-ff` + deployed (routes 200). **Next:** finish the 2-game
  sample through the merge gate + deploy, then the fleet in waves.

## 2026-06-24 · Engine depth pass: anti-repeat rotation, 6-beat sub-topics, shuffled sort, multi-catch spot
- **Founder flagged that games "still feel like wrappers"** (`swipeed-equal-lens`): sort showed the same 4 options
  in the same up/down order, spot had only 3, match only 3-3, and sub-games only 3 questions at a time. Audited the
  engine: the root cause is shallow, predictably-served beats: the bank is ~84/game (~14/category) and `shuffle()`
  is memoryless. The option **counts** (sort items, spot scene, match pairs) live in the **scenario data**, not the
  engine, so the engine caps nothing.
- **Track 1: engine fixes shipped** (`v2-engine.tsx`, merged `--no-ff`, live on swipeed.vercel.app):
  - **Anti-repeat rotation.** A per-game `swipeed:seen:<gid>` id-ring in localStorage; rotate + sub-topic draws now
    pick **unseen beats first** (each tier shuffled), capped at ~60% of the bank, so beats don't recur until you've
    moved well past them.
  - **Sub-topic sessions 3 → 6 beats.**
  - **Sort display shuffled.** Items were rendered in authored order (with 2 bins the up/down answer pattern was
    memorisable), now `useState(() => shuffle(sc.items))`, like the other mechanics. Match's left column likewise.
  - **Spot is multi-catch.** `SpotPlay` resolved on the FIRST `trick:true` tap, so extra red flags were unreachable:
    **154 existing scenes already carried 2 tricks**. Rebuilt to require catching **all** tricks (with an "x/n
    caught" line), enabling **3 truths + 2 lies**. Fixes that latent bug too.
- **Track 2: the content pipeline (next).** The option-count increases (sort 6 / spot 5 / match 5) and the felt
  shallowness are fundamentally a **content-bank** problem. Founder confirmed scope: **≥400 scenarios per game**
  (from ~84 → ~21,800 new across 69 games), **full fleet**. Plan: a hardened, resumable generation pipeline:
  ingest (per-game GDD PDF + chapter personas + `Strategy/…Scenario Library.json` + live `.ts` bank → spec) →
  **web-grounded generation** per category → **multi-lens adversarial validation** (schema · factual/citation ·
  safety · India-appropriateness · dedup · answer-key/binStyle sanity · ≤160 + band guard) → merge. A new
  `check_bank.py` will enforce ≥400/game + mechanic-mix (enough 6-item sorts, 5-item/2-trick spots, 5-pair matches)
  + dup-freeness, same spirit as the length guardrail. Designing the architecture via an adversarial workflow before
  writing generator code; self-validating on a 1-2 game sample, then running the fleet in waves. See
  [swipeed-game-patterns #27](../games/swipeed-game-patterns.md).

## 2026-06-24 · Content-drift fix: trim outlier scenarios + banded length guardrail
- **Founder flagged a felt "content drift"** (`swipeed-equal-lens`): per-game character count climbs steadily by
  chapter. Audited it before touching anything. **Verdict: mostly NOT bloat.** Scenario count is flat (~84/game);
  **0 player-visible field ever exceeded the 160-char bubble cap**; the growth is per-scenario prose scaling with
  reader age (Ch.1→Ch.8 ≈1.9×): a parent's safeguarding beat legitimately carries more nuance than a toddler's
  body-rules card. The genuinely fixable part was the **densest ~5% of scenarios** (mostly fat `branch`
  consequence/debrief stacks that had grown into walls).
- **Fix (deliberately NOT a mass flatten: that would gut adult nuance):**
  - **Trimmed 307 outlier scenarios** back under their chapter band, preserving every helpline number, every
    answer key (`best`/`outcome`/`key`/`answer`/`trick` untouched), and each beat's meaning. Saved ~15k chars;
    **max scenario anywhere fell 668 → 500**; per-scenario **average is essentially unchanged** (the legitimate
    age-curve is kept by design).
  - **Installed a second guard rule.** `scripts/check_msg_len.py` now enforces, beside Rule 1 (≤160/field,
    readability), **Rule 2: per-scenario total prose ≤ a chapter-band ceiling**: Ch.1-2 360, Ch.3-4 400, Ch.5-6
    460, Ch.7-8 500. The ceiling **rises with age but is bounded**, so the curve may grow with the audience yet
    can't drift past its band. **Capstones are exempt from Rule 2** (ceremonial surface; Rule 1 still applies).
    Both rules wired into the `scripts/githooks/pre-commit` gate (deliberate override `SWIPEED_MSGLEN_OVERRIDE=1`).
- Updated-count comparison (vs HEAD), avg→ and max→ per scenario: Ch.1 213→212 / 381→343, Ch.2 250→248 / 462→**360**,
  Ch.3 259→258 / 419→**400**, Ch.4 269→268 / 475→**400**, Ch.5 297→297 / 497→**460**, Ch.6 315→313 / 668→**460**,
  Ch.7 358→354 / 591→**500**, Ch.8 390→380 / 619→**499**. tsc/eslint green; guard exit 0; merged `--no-ff`.
- **Pattern doc updated** ([swipeed-game-patterns #27](../games/swipeed-game-patterns.md)) with the band-ceiling
  anti-drift rule. **Takeaway for the founder:** the per-scenario averages barely moved on purpose: there was no
  real bloat to cut; the durable win is the guardrail, which lets copy keep scaling with reader age but pins each
  band so the drift can't silently resume.

## 2026-06-24 · UI polish round 2: capstone ≤160 + sort "stuck chip" drag fix
- **Two more live-feedback fixes (`swipeed-equal-lens`)**:
  - **Capstone ≤160.** The 160-char cap now covers the **rich capstones** too (round 1 only reached the lesson
    games). An 8-agent pass tightened **52 ceremonial fields** across c1-c8: arrival, canvasPayoff, every recap
    bigTruth, lap frames/celebrates, reflect prompts/affirms, and the certificates (some were 600-850 chars) +
    stickerBooks, all now ≤160 while staying celebratory. Verified zero capstone strings over 160.
  - **Sort "stuck chip".** A dragged sort chip could **stick to the cursor** when its own `pointerup` was missed
    (pointer-capture loss / a fast release off-element / a mid-drag re-render), orphaning the floating ghost. Added
    a **window-level `pointerup`/`pointercancel` safety listener** in `SortPlay` that clears the ghost regardless (a
    valid drop's `onEnd` still runs first, so placement is unaffected) + a defensive `releasePointerCapture` in the
    shared `usePointerDrag.finish`.
  tsc/eslint/build green; lesson + capstone message-length guards pass; merged `--no-ff`; deployed (the `vercel
  deploy` upload hit transient `AbortError`s, succeeded via `--archive=tgz`). **Note for the founder:** worked up
  a full **ElevenLabs audio cost model**: the only *personalised* audio is the game greets (each spoken "Name! …"
  via `greetWithName`; the path scene's name use is a visual button label, no audio); everything else (all game +
  capstone narration) is **fixed**. Totals: **~1.78M fixed chars** (lessons 1.74M + capstones 37k) one-time, and
  the greets (~9.7k) are the personalised surface: recurring is ~free if the name is spliced as one clip/user.

## 2026-06-24 · UI polish from live feedback: ≤160-char messages, Lensy (not Sam), bottom-pinned branch Next
- **Three live-app fixes (`swipeed-equal-lens`)** from the founder's screenshots:
  - **Max message length 160.** Every player-visible message/text block is now **≤160 characters** (real code
    points: emoji & curly quotes count as one). A **12-agent workflow** tightened greet/helpLine/reassure/
    badge.blurb across **60 lesson games** + 2 scenario outliers, keeping **every** helpline number AND label
    (181/1091/112/1098/Childline/Tele-MANAS 14416/KIRAN 1800-599-0019/NALSA 15100/cybercrime 1930/POCSO e-Box) and
    all safeguarding framing, independently verified: **zero numbers/labels dropped vs HEAD**. The **strike-rewrite
    resolve now renders `re` and `why` as two separate ≤160 blocks** (UnReBeat gained an optional `why` line),
    clearing 95/96 strike overflows with no content change. New guard **`scripts/check_msg_len.py`** enforces the
    cap (counts re/why separately; uses `json.loads` so UTF-8 is counted as code points, not mojibake bytes).
  - **Removed 'Sam' → Lensy.** The narrator is **Lensy** everywhere: 26 greets + 313 reflect prompts converted; the
    one *character* named Sam (a colleague in an equal-confident role-play) renamed to **Ravi** so dialogue isn't
    corrupted. Zero "Sam" left in content.
  - **Bottom-pinned branch Next.** `BranchPlay` was the only mechanic rendering its resolve + Next **inline** in the
    middle zone (so its Next floated mid-screen). It now hands the picked consequence to the engine (new
    `branchResolve` state in `solve`/`present`/`reset`), which renders it in the **standard resolve area with the
    bottom-pinned Next**, matching every other mechanic; the "find the safe way" re-pick stays inline.
  Engine touched: `v2-engine.tsx`, `un-re.tsx`, `capstone-rich.tsx`. tsc/eslint/build green; guard passes; merged
  `--no-ff`; deployed. KB: this entry + patterns-doc note (the 160-cap rule, Lensy-not-Sam, engine-rendered branch
  resolve, split strike resolve are now reusable decisions). **The whole catalog stays 77/77 live and consistent.**

## 2026-06-24 · 🎉 c8 capstone "Full Circle": the WHOLE 3→parenthood catalog is complete (77/77)
- **c8 capstone (`swipeed-equal-lens`)**: built the **Chapter-8 graduation "Full Circle", the FINAL capstone of
  the entire catalog**, to the rich [Capstone format v1](../games/capstones.md), matching c1-c7 on the shared rich
  engine (`capstone-rich.tsx`). Driven by the c8 Landing: arrive → look back (the "Full Circle" constellation
  gallery, nine Chapter-8 stickers) → play back **eight victory laps** (gallery · strike-rewrite · branch ·
  role-play · match · swipe · strike-rewrite · sort) → reflect (**five** prompts) → celebrate (constellation + a
  "Full Circle" certificate + graduation star). Recaps the nine Chapter-8 lessons (g61-g69). **The c8 Landing was
  the loosest yet**: a faithful build added **`myth.why` AND `celebrate`** to its two strike laps (c8-p2 "a father
  isn't babysitting", c8-p8 "believe your child"), per-option `consequence` + a `debrief` to its branch lap (c8-p4
  pause→choose→repair), reframed a v2-style left/right swipe into swipe-up-to-affirm (c8-p7), and folded the
  authored "reflect" lap (c8-p3) into the reflect section as a fifth prompt; added `doneTitle` + `coins`. Added the
  Chapter-8 glyph→emoji set to `GLYPH_EMOJI` (💑🍼🌿💬🔄🏳️‍🌈🧩🎮🛟 + crowning full-circle-star 🌳). **gameId trap:**
  Landing's `capstone-ch8` aspirational; engine-host registry id is **`capstone-8`** (config uses that). New-node
  wiring (gen-path `GAME` dict `c8→capstone-8` → regen `path.ts`, **77/77 built/playable** → `engine-host`). No
  score, no fail. tsc/eslint/build green; merged `--no-ff`; deployed. KB: [games/capstones.md](../games/capstones.md)
  (header → all 8 rich; table row; a Capstone-8 section) + index "whole catalog complete" note + this entry.
  **🎉 MILESTONE: with c8, ALL 77 nodes (g01-g69 lessons + c1-c8 capstones) across Chapters 1-8 are live: the
  entire 3 → parenthood journey is built to the v2/rich standard.** The generational loop comes full circle: the
  child the journey began with ([My Body, My Rules](../games/my-body-my-rules.md) g02) is now the parent who teaches
  it ([The Talks](../games/the-talks.md) g64; [Be the Safe Adult](../games/be-the-safe-adult.md) g69).

## 2026-06-24 · g69 Be the Safe Adult: the safeguarding keystone (all 69 lesson nodes now v2)
- **g69 Be the Safe Adult (`swipeed-equal-lens`)**: built the **ninth and final Chapter-8 lesson node, the
  safeguarding keystone**, to the [GDD v2 mechanic-embodying standard](../games/swipeed-game-patterns.md): it
  **closes the Parent Layer and underwrites the entire kids' journey**: from [My Body, My Rules](../games/my-body-my-rules.md)
  (g02) onward every child node says *"tell a trusted adult"*, and this node makes sure that adult exists, notices,
  and responds right. **Maximum-care, trauma-informed, never graphic.** **84-scenario typed library** (gameId
  `be-the-safe-adult`): be-tellable 14 · spot-the-signs 14 · if-they-tell-you 14 · the-law-and-the-call 14 ·
  safe-online-and-off 14 · tools-and-respond 14, across strike-rewrite 16 · role-play 15 · branch 14 · sort 13 ·
  match 10 · spot 8 · reflect 8, **0% binary**, led by strike-rewrite + role-play + branch. Six modes: be tellable
  (open no-blame door; read silence as fear not betrayal), spot the signs (calmly; **most abuse is by a known,
  trusted adult**), if they tell you (the disclosure response: **believe, stay calm, NOT their fault**, don't
  interrogate, act & protect, never hush up), the law and the call (**POCSO** basics: child ALWAYS the victim,
  reporting obliged & protective; Childline 1098, police, POCSO e-Box, cybercrime 1930), safe online and off
  (grooming/sextortion never the child's fault), tools and respond. Educational, NOT legal advice; routes real
  concerns to authorities; **NEVER any detail that could enable harm**; centres the child as ALWAYS the protected
  victim. `reassureCats` be-tellable + if-they-tell-you + safe-online-and-off. India: most CSA by someone known
  while silence/disbelief/victim-blaming common. **No new engine mechanic and no `binStyle` change** (pair-aware
  emulation: no visible mis-colours; Helps spot it/Helps the child/Healthy safety/Real route green, Harms them/A
  dead end red). Spot ids injected (8). New-node wiring (gen-path `GAME` dict + 🛟 emoji → regen `path.ts`, 76
  built/playable → `engine-host`). Read-first attested; tsc/eslint/build green; merged `--no-ff`; deployed. KB: new
  doc [games/be-the-safe-adult.md](../games/be-the-safe-adult.md) + index row + this entry. Builds on
  [Safety Squad](../games/safety-squad.md) (g08), [My Body, My Rules](../games/my-body-my-rules.md) (g02) and
  [Firewall](../games/firewall.md) (g40). **With g69, ALL 69 lesson nodes are now v2: the status reads "All lessons
  are v2." Only the c8 capstone remains to close the whole 3 → parenthood catalog.** **Next:** c8 capstone (Full
  Circle / Raising the Next Generation).

## 2026-06-24 · g68 Navigating Addictions: a high-care Parent-Layer pillar (Chapter 8)
- **g68 Navigating Addictions (`swipeed-equal-lens`)**: built the **eighth Chapter-8 node, a high-care
  Parent-Layer pillar**, to the [GDD v2 mechanic-embodying standard](../games/swipeed-game-patterns.md). Core
  insight: *shame and punishment drive addiction underground, while calm, connection and the right help bring it
  into the light.* **84-scenario typed library** (gameId `navigating-addictions`): spot-the-signs 14 ·
  respond-dont-rupture 14 · its-a-health-issue 14 · get-the-right-help 14 · screens-and-modelling 14 ·
  tools-and-safety 14, across strike-rewrite 14 · branch 14 · role-play 14 · sort 13 · match 10 · reflect 10 · spot
  9, **0% binary**, led by strike-rewrite + branch + role-play. Six modes: spot the signs (calm noticing not panic/
  snooping; gaming disorder is recognised), respond don't rupture (busts *'crack down/just willpower/good kids
  don't/shame scares them straight'*; **connection over control**; firm about behaviour, unconditionally there for
  the child), it's a health issue (treatable condition: brain/genes/environment, **not weak willpower or a moral
  failing**; recovery is real), get the right help (counselling & de-addiction EARLY; family involvement strongly
  improves outcomes; **Tele-MANAS 14416, Childline 1098**), screens and modelling (whole-family limits; tend your
  OWN habits), tools and safety (**acute risk = EMERGENCY → 112/hospital**). **HIGH-CARE & firmly non-shaming of
  child AND parent; dependence = health not moral failure; NEVER any how-to for obtaining/using substances; NOT
  medical advice.** `reassureCats` respond-dont-rupture + its-a-health-issue + get-the-right-help. India: youth
  substance & screen/gaming dependence rising, stigma & harsh punitive responses common (drive it deeper). **No new
  engine mechanic and no `binStyle` change** (pair-aware emulation: no visible mis-colours; 'Keeps it open' greens
  correctly as a good bin; Helpful fact/Helps manage it green, Harmful stigma/Fuels dependence/Risky gap red). Spot
  ids injected (9). New-node wiring (gen-path `GAME` dict + 🎮 emoji → regen `path.ts`, 75 built/playable →
  `engine-host`). Read-first attested; tsc/eslint/build green; merged `--no-ff`; deployed. KB: new doc
  [games/navigating-addictions.md](../games/navigating-addictions.md) + index row + this entry. Builds on
  [Bounce](../games/bounce.md) (g39); connects to [Reality Check](../games/reality-check.md) (g28) &
  [Decoded](../games/decoded.md) (g36). **Next:** g69 Be the Safe Adult, the last Chapter-8 lesson node before
  capstone c8.

## 2026-06-24 · g67 Raising Neurodiverse Kids: difference not deficiency (Chapter 8)
- **g67 Raising Neurodiverse Kids (`swipeed-equal-lens`)**: built the **seventh Chapter-8 node, a Parent-Layer
  pillar and a warm callback to [Same Same, Different](../games/same-same-different.md) (g04)**, to the
  [GDD v2 mechanic-embodying standard](../games/swipeed-game-patterns.md): reframes neurodivergence as
  **difference, not deficiency**, strengths-first, never deficit-shaming. **84-scenario typed library** (gameId
  `raising-neurodiverse-kids`): understand-your-child 14 · accommodate 14 · advocate 14 · drop-the-shame 14 ·
  strengths-and-wellbeing 14 · support-and-you 14, across strike-rewrite 17 · branch 14 · sort 12 · role-play 12 ·
  match 10 · reflect 10 · spot 9, **0% binary**, led by strike-rewrite + branch + sort. Six modes: understand your
  child (different not less; brains naturally vary), accommodate (adjust the environment not the child;
  accommodations are fair access like glasses), advocate (key advocate; rights under the **RPwD Act 2016**; seek
  assessment without shame), drop the shame and blame (no one's fault, **not parenting/screens/vaccines**;
  meltdowns are overwhelm not naughtiness), strengths and wellbeing (build on strengths; calm co-regulation not
  punishment; whole wonderful child not a label), support and you (demanding; lean on peers & professionals;
  burnout → Looking After You g63). **Strengths-based, never deficit-shaming, never blaming; NOT a diagnostic tool
  → professionals.** `reassureCats` drop-the-shame + support-and-you. India: heavily stigmatised/under-recognised,
  delayed diagnoses blamed on parenting, accommodations a fight; de-stigmatises and points to RPwD Act 2016 rights.
  **No new engine mechanic and no `binStyle` change**. Verbatim, *pair-aware* `binStyles` emulation found no
  VISIBLE mis-colours: the good bins *"Lifts shame"* / *"True, lifts shame"* contain a NEG `shame` token, but their
  paired bins are also red, so the both-red pairs hit the engine's **neutral fallback** (no good bin renders red);
  A real strength / Respects the wiring / Strengthens it green, Chips at / Myth / Weakens it / Erodes it red. Spot
  ids injected (9). New-node wiring (gen-path `GAME` dict + 🧩 emoji → regen `path.ts`, 74 built/playable →
  `engine-host`). Read-first attested; tsc/eslint/build green; merged `--no-ff`; deployed. KB: new doc
  [games/raising-neurodiverse-kids.md](../games/raising-neurodiverse-kids.md) + index row + this entry. Builds on
  [Same Same, Different](../games/same-same-different.md) (g04); a pillar alongside g65 & g66. **Next:** g68 Navigating
  Addictions.

## 2026-06-24 · g66 Raising Gender-Diverse Kids: affirming an LGBTQ+ child (Chapter 8)
- **g66 Raising Gender-Diverse Kids (`swipeed-equal-lens`)**: built the **sixth Chapter-8 node, a sensitive
  Parent-Layer node handled with the care of [Spectrum](../games/spectrum.md) (g32)** (dignity-first, never-out,
  child-safety-centred) to the [GDD v2 mechanic-embodying standard](../games/swipeed-game-patterns.md). *The
  evidence is the spine: an affirming parent is the single biggest protective factor: family acceptance roughly
  HALVES the odds of suicidal thoughts and attempts.* **84-scenario typed library** (gameId
  `raising-gender-diverse-kids`): acceptance-is-protection 14 · understand 14 · if-they-come-out 14 ·
  protect-and-affirm 14 · your-own-journey 14 · support-and-india 14, across strike-rewrite 16 · branch 14 · reflect
  14 · role-play 12 · sort 11 · match 9 · spot 8, **0% binary**, led by strike-rewrite + branch + role-play. Six
  modes: acceptance is protection (busts *'accepting causes it'/'disapproval steers them back'*; lead with love),
  understand (orientation/identity/expression are 3 different things; busts phase/choice/illness myths), if they
  come out (first reaction matters most; gratitude & unconditional love; **never out the child**), protect and
  affirm (safe harbour; name & pronouns; no pressure to label/mask), your own journey (take your fears to a
  supportive ADULT, not your child), support & India (**NEVER conversion 'cures'**; KIRAN 1800-599-0019, Tele-MANAS
  14416; NALSA recognition & decriminalisation). **Affirming, evidence-based, compassionate; meets parents where
  they start without shaming beliefs; child's safety & dignity NON-NEGOTIABLE; records no identity.** `reassureCats`
  acceptance-is-protection + if-they-come-out + your-own-journey. **binStyle: a real mis-colour caught + fixed:**
  POS's bare `keep` greened the bad bin **'Keeps you stuck'** (gd-043): NEG had `keeps stuck` but not `keeps you
  stuck`; added `keeps you stuck` to NEG. Cross-game regression: only g66 uses it, now correctly red, zero
  collisions. Spot ids injected (8). New-node wiring (gen-path `GAME` dict + 🏳️‍🌈 emoji → regen `path.ts`, 73
  built/playable → `engine-host`). Read-first attested; tsc/eslint/build green; merged `--no-ff`; deployed. KB: new
  doc [games/raising-gender-diverse-kids.md](../games/raising-gender-diverse-kids.md) + index row + this entry. Builds
  on [Spectrum](../games/spectrum.md) (g32) and [What Makes Me, Me](../games/what-makes-me-me.md) (g07). **Next:** g67
  Raising Neurodiverse Kids.

## 2026-06-24 · g65 Break the Cycle: the emotional core of the Parent Layer (Chapter 8)
- **g65 Break the Cycle (`swipeed-equal-lens`)**: built the **fifth Chapter-8 node, the emotional core of the
  Parent Layer and the deepest Unlearn→Relearn beat in the app**, to the
  [GDD v2 mechanic-embodying standard](../games/swipeed-game-patterns.md): *we parent the way we were parented,
  until we choose not to.* **Firmly non-shaming, busts the practice, never the parent.** **84-scenario typed
  library** (gameId `break-the-cycle`): how-you-were-raised 14 · discipline-differently 14 · the-repair 14 ·
  calm-yourself 14 · heal-your-wounds 14 · tools-and-help 14, across strike-rewrite 14 · branch 14 · reflect 14 ·
  role-play 12 · sort 12 · match 10 · spot 8, **0% binary**, led by strike-rewrite + branch + reflect. Six modes:
  how you were raised (keep the good, leave the harmful; inheritance isn't destiny), discipline differently (firm
  AND kind; busts *'a slap never hurt me'/'fear=respect'/'positive=permissive'/'shaming motivates'*; **physical
  punishment is harmful & ineffective**), the repair (clean apology; **repair beats perfection**), calm yourself
  (self-regulation, triggers, step away safely), heal your own wounds (tend old pain; not therapy), tools/help.
  **Care-sensitive & child-safety aware; never endorses hitting/shaming.** Deeper wounds → **Tele-MANAS 14416**;
  patterns risking real harm → Be the Safe Adult g69 (Childline 1098/112). `reassureCats` how-you-were-raised +
  the-repair + heal-your-wounds. India: corporal punishment/shaming widely normalised, most parents using them
  were raised that way; change is hard but real. **binStyle: THREE real mis-colours caught + fixed:** POS's bare
  `keep` wrongly greened bad bins **'Keeps it running'** (bc-044) & **'Keeps them on edge'** (bc-070), and POS's
  `passes` wrongly greened **'Passes it on'** (bc-078, = passing the cycle on). Added `keeps it running | keeps
  them on edge | passes it on` to the NEG regex (before POS). Cross-game regression: these 3 phrases appear only in
  g65, all now correctly red; no good bin anywhere matches, zero collisions. Spot ids injected (8). New-node
  wiring (gen-path `GAME` dict + 🔄 emoji → regen `path.ts`, 72 built/playable → `engine-host`). Read-first
  attested; tsc/eslint/build green; merged `--no-ff`; deployed. KB: new doc
  [games/break-the-cycle.md](../games/break-the-cycle.md) + index row + this entry. Builds on
  [Mind Matters](../games/mind-matters.md) (g38) and [Bounce](../games/bounce.md) (g39) + the UN→RE core. **Next:** g66
  Raising Gender-Diverse Kids.

## 2026-06-24 · g64 The Talks, Age by Age: the Parent-Layer keystone (Chapter 8)
- **g64 The Talks, Age by Age (`swipeed-equal-lens`)**: built the **fourth Chapter-8 node, the keystone of the
  Parent Layer and the hinge of the generational loop**, to the
  [GDD v2 mechanic-embodying standard](../games/swipeed-game-patterns.md): a parent guided here becomes the trusted
  adult the kids' journey always assumed. Core reframe: *it isn't one dreaded "talk", it's many small, age-right
  conversations.* **84-scenario typed library** (gameId `the-talks`): how-to-talk 14 · early-years 14 ·
  middle-years 14 · the-teen-talks 14 · facts-and-values 14 · tools-and-help 14, across strike-rewrite 15 · branch
  14 · role-play 14 · sort 12 · reflect 11 · match 10 · spot 8, **0% binary**, led by **role-play** + strike-rewrite
  + branch. Six modes mapped to the child's journey: how to talk (the askable open door; *"I don't know"* is fine),
  the early years (correct body names protect against abuse & aid disclosure; consent basics; no body secrets), the
  middle years (puberty BEFORE it starts; periods & wet dreams for ALL kids; online basics), the teen talks
  (consent, **porn-literacy vs the manosphere**, respect, staying askable), facts and your values (**both, not
  either/or**: silence cedes the field to the algorithm), tools/help (routes child-safety to Be the Safe Adult
  g69). **Protective & evidence-based: correct names make children SAFER, not more at risk; expert-reviewed,
  non-explicit; respects family values while keeping facts honest; NEVER shames a parent for not knowing.**
  `reassureCats` how-to-talk; disclosure → believe + Childline 1098/112. India: silence & *"log kya kahenge"* leave
  the manosphere to teach; culturally-aware scripts, mindful of grandparents/joint families. **No new engine
  mechanic and no `binStyle` change** (verbatim emulation: no mis-colours; Undermines it red, Keeps-them-coming
  correctly green, Honest fact/Safety fact greened benignly in facts-vs-values categorisations; rest neutral). Spot
  ids injected (8). New-node wiring (gen-path `GAME` dict + 💬 emoji → regen `path.ts`, 71 built/playable →
  `engine-host`). Read-first attested; tsc/eslint/build green; merged `--no-ff`; deployed. KB: new doc
  [games/the-talks.md](../games/the-talks.md) + index row + this entry. **Builds on / mirrors**
  [My Body, My Rules](../games/my-body-my-rules.md) (g02), closing the generational loop; around it sit g65-g69.
  **Next:** g65 Break the Cycle.

## 2026-06-24 · g63 Looking After You: parental wellbeing (Chapter 8, high-care)
- **g63 Looking After You (`swipeed-equal-lens`)**: built the **third Chapter-8 node, the parent's-own-wellbeing
  node and a high-care one** (the node g61/g62 route parental burnout to), to the
  [GDD v2 mechanic-embodying standard](../games/swipeed-game-patterns.md): *you can't pour from an empty cup.*
  **84-scenario typed library** (gameId `looking-after-you`): empty-cup 14 · your-needs-count 14 ·
  baby-blues-and-beyond 14 · reach-out 14 · healthy-coping 14 · tools-and-help 14, across strike-rewrite 17 ·
  branch 14 · reflect 12 · sort 12 · role-play 11 · match 10 · spot 8, **0% binary**, led by strike-rewrite +
  branch + reflect. Six modes: the empty cup (busts *"good parents sacrifice everything"*; self-care is part of
  childcare; struggling isn't failing), your needs count (protect needs/identity/time without guilt), **baby blues
  and beyond** (passing blues vs **PPD/anxiety, in mums AND dads**; frightening intrusive thoughts = symptom + cue
  to get help, never a verdict), reach out (help-seeking is strength), healthy coping (rest/breathe/move/connect/
  accept help; **never a pain technique**), tools/help (breathing space, help-finder, crisis routing). **HIGH-CARE
  & non-shaming; healthy coping only, explicitly NOT therapy, signposts professional care; includes fathers;
  addresses joint-family stigma.** `reassureCats` empty-cup + baby-blues-and-beyond + reach-out. India: PPD ~1 in 5
  (≈22%) mothers (fathers ~1 in 10); routes **Tele-MANAS 14416, KIRAN 1800-599-0019, a doctor, emergency 112**.
  **No new engine mechanic and no `binStyle` change** (verbatim emulation: no mis-colours; Healthy/Healthy coping,
  Quietly harmful/Harmful, Helps long-term coloured by existing tokens; rest neutral). Spot ids injected (8);
  ly-031 multiple valid tricks. New-node wiring (gen-path `GAME` dict + 🌿 emoji → regen `path.ts`, 70
  built/playable → `engine-host`). Read-first attested; tsc/eslint/build green; merged `--no-ff`; deployed. KB: new
  doc [games/looking-after-you.md](../games/looking-after-you.md) + index row + this entry. Builds on
  [Mind & Belonging](../games/mind-belonging.md) (g49) and [Bounce](../games/bounce.md) (g39). **Next:** g64 The Talks
  (Age by Age).

## 2026-06-24 · g62 Equal Parents: co-parenting as equals (Chapter 8)
- **g62 Equal Parents (`swipeed-equal-lens`)**: built the **second Chapter-8 node** to the
  [GDD v2 mechanic-embodying standard](../games/swipeed-game-patterns.md): takes the equal-home work of
  [Equal Partners](../games/equal-partners.md) (g55) into **raising children**, the stage where gendered defaults
  snap back hardest. *Parenting isn't mum's job with dad "helping".* **84-scenario typed library** (gameId
  `equal-parents`): share-the-care 14 · parental-mental-load 14 · involved-dads 14 · kids-are-watching 14 ·
  everyone-gains 14 · tools-and-help 14, across strike-rewrite 17 · branch 16 · reflect 12 · sort 11 · match 10 ·
  role-play 10 · spot 8, **0% binary**, led by strike-rewrite + branch + sort. Six modes: share the care (owned
  shares; **only breastfeeding is mother-specific**), the parental mental load (own the noticing, not tasks on
  request), involved dads (busts *"fathers help / providing is enough / nurturing isn't a man's role"*;
  hands-on fatherhood is good fathering AND a fuller manhood; **pro-men**; addresses maternal gatekeeping), kids
  are watching (children learn equality by watching parents), everyone gains (better for children, mothers AND
  fathers, not a sacrifice), tools/help (parental burnout → Looking After You g63). **Even-handed; engages fathers
  as equal owners; never anti-men; never shames any arrangement.** `reassureCats` tools-and-help; burnout →
  Tele-MANAS 14416. India: childcare defaults to mothers/grandmothers, fathers cast as providers, minimal
  paternity leave. **binStyle: a real mis-colour caught + fixed:** POS's bare `keep` token wrongly greened the
  *bad* bin **"Keeps it one-sided"** (ep2-009); added **`one-sided`** to the NEG regex (before POS), matching the
  prior `keeps it lopsided`/`keeps stuck` fixes. **Cross-game regression:** the only other `one-sided` bin (g56's
  *"One-sided power"*) is now also correctly reddened (an improvement; was neutral): no good bin anywhere contains
  `one-sided`, zero collisions. Spot ids injected (8). New-node wiring (gen-path `GAME` dict + 🍼 emoji → regen
  `path.ts`, 69 built/playable → `engine-host`). Read-first attested; tsc/eslint/build green; merged `--no-ff`;
  deployed. KB: new doc [games/equal-parents.md](../games/equal-parents.md) + index row + this entry. Builds on g55 &
  g26; beside g61; links g63. **Next:** g63 Looking After You.

## 2026-06-24 · Chapter 8 opens: g61 Us, After Kids (the final chapter begins)
- **g61 Us, After Kids (`swipeed-equal-lens`)**: built the **opener of Chapter 8 (Parenthood), the final
  chapter**, to the [GDD v2 mechanic-embodying standard](../games/swipeed-game-patterns.md): it starts where
  parenting strains most: **the couple's own relationship, and the self within it.** *A baby changes everything,
  including you two.* **84-scenario typed library** (gameId `us-after-kids`): the-big-shift 14 · talk-through-tired
  14 · share-dont-resent 14 · reconnecting 14 · you-still-matter 14 · tools-and-help 14, across strike-rewrite 16 ·
  branch 14 · role-play 13 · sort 12 · reflect 12 · match 11 · spot 6, **0% binary**, led by branch + strike-rewrite
  + role-play. Six modes: the big shift (**~2 in 3 couples feel the dip; not a verdict**; thrivers use learnable
  skills), talk through the tired (name the tiredness not each other; busts *"the romance is just over"*), share
  don't resent (**engages fathers: a father isn't 'babysitting' his own child**; links g62), reconnecting
  (intimacy at *both* partners' pace, no deadline, no obligation; postpartum discomfort → clinician), you still
  matter (you're a whole person not only a parent; persistent low mood → Looking After You g63), tools/help.
  **Even-handed & warm; engages fathers as equal parents; NO pressure on intimacy timing; NOT medical advice.**
  Perinatal depression → **Tele-MANAS 14416**; strain→control/abuse → Respect at Home g56 (181/112). `reassureCats`
  the-big-shift + you-still-matter. India: joint-family arrival (help but also pressure & less privacy); postpartum
  dual burden/role conflict/guilt. **No new engine mechanic and no `binStyle` change** (verbatim emulation: no
  mis-colours; Healthy reconnecting/support, Fair expectation, Harsh start, Safe rebuilding/Pressures them, Keeps
  them whole coloured by existing tokens; rest neutral). Spot ids injected (6). New-node wiring (gen-path `GAME`
  dict + 💑 emoji → regen `path.ts`, 68 built/playable → `engine-host`). Read-first attested; tsc/eslint/build
  green; merged `--no-ff`; deployed. KB: new doc [games/us-after-kids.md](../games/us-after-kids.md) + index row + this
  entry. Builds on [Choosing & Building](../games/choosing-building.md) (g53) and
  [Real Relationships](../games/real-relationships.md) (g46); links g62/g63/g57/g56. **Next:** g62 Equal Parents.

## 2026-06-24 · c7 capstone "A Life, Built": Chapter 7 complete (the whole 3→first-child journey is built)
- **c7 capstone (`swipeed-equal-lens`)**: built the **Chapter-7 graduation "A Life, Built"** to the rich
  [Capstone format v1](../games/capstones.md), matching c1-c6 on the shared rich engine (`capstone-rich.tsx`). Driven
  by the c7 Landing: arrive → look back (the "A Life, Built" constellation gallery, eight Chapter-7 stickers) →
  play back **seven victory laps** (gallery · sort · strike-rewrite · branch · match · swipe · role-play, each
  re-cueing a chapter truth through a different mechanic) → reflect (**five** prompts) → celebrate (constellation +
  an "A Life, Built" certificate + graduation star). Recaps the eight Chapter-7 lessons (g53-g60). **The c7 Landing
  was looser than the `CapstoneConfig` schema in places**: a faithful build added `myth.why` to the strike lap,
  per-option `consequence` + a `debrief` to the branch lap, reframed a v2-style left/right swipe into the
  capstone's swipe-up-to-affirm, and **folded the authored 8th "reflect" lap (not a `CapLap` type) into the reflect
  section** as a fifth prompt (same content, same place in flow); added `doneTitle` + `coins` (not in the Landing).
  Added the Chapter-7 glyph→emoji set to `GLYPH_EMOJI`, each mirroring its game's node emoji (💍🛤️🧺🏠🗺️💵🤰👪 +
  crowning a-life-built-star 🏡). **gameId trap:** the Landing's `capstone-ch7` is aspirational; engine-host
  registry id is **`capstone-7`** (config uses that). New-node wiring (gen-path `GAME` dict `c7→capstone-7` → regen
  `path.ts`, **67 built/playable** → `engine-host`). No score, no fail. tsc/eslint/build green; merged `--no-ff`;
  deployed. KB: [games/capstones.md](../games/capstones.md) (header + table row + a Capstone-7 section) + index note +
  this entry. **With c7, all of Chapter 7 (g53-g60 + c7) is live, and the entire 3 → first-child journey
  (Chapters 1-7, 67 nodes) is now built to the v2/rich standard.** Only Chapter 8 (Parenthood, g61-g69 + c8)
  remains. **Next (new chapter, future):** g61 Us, After Kids.

## 2026-06-24 · g60 Many Ways to Family: equity node closing Chapter 7's lessons
- **g60 Many Ways to Family (`swipeed-equal-lens`)**: built the **eighth and final Chapter-7 *lesson* node** (the
  c7 capstone still remains) to the [GDD v2 mechanic-embodying standard](../games/swipeed-game-patterns.md): the
  equity bookend and counterpart to [If, When & Whether](../games/if-when-whether.md) (g59), for everyone whose route
  to parenthood isn't the default biological one. **84-scenario typed library** (gameId `many-ways-to-family`):
  every-route-real 14 · the-routes 14 · the-real-path 14 · name-the-barriers 14 · your-family-your-way 14 ·
  tools-and-help 14, across strike-rewrite 17 · branch 14 · match 12 · reflect 12 · sort 11 · role-play 10 · spot
  8, **0% binary**, led by strike-rewrite + match + sort. Six modes: every route is real family (busts *"real
  family is only biological"*), the routes (adoption/fostering/IVF-ART/surrogacy/single & LGBTQ+ parenthood), the
  real path (honest steps/costs/emotions; setbacks aren't a verdict), name the barriers (India's specific gendered
  & legal barriers told honestly), your family your way (dignity, chosen family), tools/help. **Legal/eligibility
  content general, DATED (2024-25) & EVOLVING, NOT legal advice; verify & localise** (CARA single-man girl-child
  rule; Surrogacy/ART Acts altruistic-only/mainly-married; **Supriyo v. Union of India Oct 2023**: no same-sex
  marriage or joint adoption, single LGBTQ+ person may adopt as single applicant). **Every family form full
  dignity; LGBTQ+ handled with Spectrum's care (no outing).** `reassureCats` every-route-real + your-family-your-way;
  routes via CARA/licensed clinics/NALSA 15100. **No new engine mechanic and no `binStyle` change** (verbatim
  emulation: no mis-colours; Real family, Dignity-affirming/A false ranking, False promise, Builds it up/Undermines
  it coloured by existing tokens; eligibility/route-type/accurate-misconception pairs neutral: correctly, they're
  categorisations). Spot ids injected (8); mf-040 multiple valid tricks. New-node wiring (gen-path `GAME` dict + 👪
  emoji → regen `path.ts`, 66 built/playable → `engine-host`). Read-first attested; tsc/eslint/build green; merged
  `--no-ff`; deployed. KB: new doc [games/many-ways-to-family.md](../games/many-ways-to-family.md) + index row + this
  entry. Builds on [Spectrum](../games/spectrum.md) (g32) and [Your Path, Your Call](../games/your-path-your-call.md)
  (g54). **All eight Chapter-7 lesson nodes (g53-g60) are now live; only the c7 capstone (Building Together)
  remains.** **Next:** c7 capstone (rich).

## 2026-06-24 · g59 If, When & Whether: reproductive decisions (Chapter 7)
- **g59 If, When & Whether (`swipeed-equal-lens`)**: built the **seventh Chapter-7 node** to the
  [GDD v2 mechanic-embodying standard](../games/swipeed-game-patterns.md): the reproductive-decision heart and the
  **adult version of [My Choices, My Future](../games/my-choices-my-future.md) (g29)**: whether to have children,
  when, and how many, made with real knowledge, together, and **free of pressure in any direction.** **84-scenario
  typed library** (gameId `if-when-whether`): whether-and-why 14 · fertility-for-real 14 · when-and-spacing 14 ·
  if-its-hard 14 · free-of-pressure 14 · tools-and-help 14, across strike-rewrite 21 · branch 13 · reflect 12 ·
  sort 11 · match 10 · role-play 10 · spot 7, **0% binary**, led by strike-rewrite + branch + sort. Six modes:
  whether & why (childfree is a complete valid life; busts *"a woman who doesn't want kids is selfish"*), fertility
  for real (calm honest facts, women AND men; busts both *"there's always time"* and *"it just happens"*; no scare
  tactics), when & spacing (your own timeline), if it's hard (infertility with compassion, ~1 in 6, men/women
  roughly equally; no shame; routes to Many Ways to Family g60), free of pressure (autonomy; **son-preference &
  sex-selection illegal, PCPNDT Act**; refusing a weaponised fertility clock), tools/help. Even-handed &
  non-coercive; medically accurate but panic-free; **not medical advice, points to clinicians/RKSK.** `reassureCats`
  free-of-pressure + if-its-hard. **Unlike the other Ch.7 nodes, no DV helpline** (a health/autonomy node, not a
  safety node). Help route is a clinician + RKSK. **No new engine mechanic and no `binStyle` change** (verbatim
  emulation: no mis-colours; Honest fact/Panic myth, Respects autonomy/Violates it, Healthy support/Harmful
  pressure, Compassionate truth/Harmful-Cruel myth coloured by existing tokens; rest neutral). Spot ids injected
  (7); iw-054 multiple valid tricks. New-node wiring (gen-path `GAME` dict + 🤰 emoji → regen `path.ts`, 65
  built/playable → `engine-host`). Read-first attested; tsc/eslint/build green; merged `--no-ff`; deployed. KB: new
  doc [games/if-when-whether.md](../games/if-when-whether.md) + index row + this entry. Builds on g29; pairs with g60.
  **Next:** g60 Many Ways to Family (the last Chapter-7 lesson node before capstone c7).

## 2026-06-24 · g58 Money, Together: work & money in partnership (Chapter 7)
- **g58 Money, Together (`swipeed-equal-lens`)**: built the **sixth Chapter-7 node** to the
  [GDD v2 mechanic-embodying standard](../games/swipeed-game-patterns.md): carries the Work & Money domain from
  [Money & Independence](../games/money-independence.md) (g48) into shared adult life, *two incomes, one life.*
  **84-scenario typed library** (gameId `money-together`): money-talk 14 · plan-together 14 · stay-independent 14 ·
  fair-not-gendered 14 · control-is-abuse 14 · tools-and-help 14, across strike-rewrite 19 · branch 16 · reflect 12
  · sort 11 · match 9 · spot 9 · role-play 8, **0% binary**, led by branch + strike-rewrite + sort. Six modes: the
  money talk (care not coldness), plan together (joint AND personal accounts; both partners know the money), stay
  independent (busts *"he handles the money because he earns it"*; homemaker's unpaid work is real economic value),
  fair not gendered (managing money isn't a man's job; a stay-at-home partner is an equal, not a dependent),
  **control is abuse** (allowances/cut-offs/seizing salary or **stridhan**/barring work = economic abuse,
  recognised DV under **PWDVA 2005** → Respect at Home g56 + help), tools/help. Even-handed; centres each partner's
  financial independence, esp. women's; educational, not financial/legal advice. `reassureCats` control-is-abuse;
  help → 181/1091/112/**NALSA 15100**; stridhan is a woman's property by law. **No new engine mechanic and no
  `binStyle` change** (verbatim emulation: no mis-colours; Green/Red flag, Fair/Unfair, Healthy/Unhealthy, Risky
  gap, Erodes it, Harmful habit coloured by existing tokens; *Economic abuse* left neutral: `abuse` can't be a
  global red token). Spot ids injected (9); mt-056 & mt-081 carry multiple valid tricks. New-node wiring (gen-path
  `GAME` dict + 💵 emoji → regen `path.ts`, 64 built/playable → `engine-host`). Read-first attested;
  tsc/eslint/build green; merged `--no-ff`; deployed. KB: new doc [games/money-together.md](../games/money-together.md)
  + index row + this entry. Builds on g48; pairs with g55; guards g56. **Next:** g59 If, When & Whether.

## 2026-06-24 · g57 The Family Map: in-laws & joint family (Chapter 7)
- **g57 The Family Map (`swipeed-equal-lens`)**: built the **fifth Chapter-7 node** to the
  [GDD v2 mechanic-embodying standard](../games/swipeed-game-patterns.md): the **full-circle callback to
  [My Family Garden](../games/my-family-garden.md) (g03)**: in India you don't just marry a person. You join a
  family. **84-scenario typed library** (gameId `family-map`): web-you-join 14 · kind-boundaries 14 · couple-team
  14 · respect-both-ways 14 · when-it-turns-harmful 14 · tools-and-help 14, across strike-rewrite 18 · branch 18 ·
  reflect 12 · sort 11 · match 10 · spot 8 · role-play 7, **0% binary**, led by branch + strike-rewrite + sort.
  Six modes: the web you join (both partners join each other's families), kind boundaries (busts *"family always
  knows best" / "interference is love" / "a good bahu never says no"*), couple as a team (decide together, then
  face family as one; refuse triangulation), respect both ways (**respect is not obedience** and flows both ways),
  when it turns harmful (**dowry illegal: Dowry Prohibition Act 1961**; coercive in-law control/threats/dowry
  harassment are abuse not friction → Respect at Home g56 + help), tools/help. **Even-handed and warm; never "cut
  them off" as a default.** `reassureCats` when-it-turns-harmful; help → 181/112/counsellor. India: joint families
  a leading source of marital strain, expectations heaviest on the daughter-in-law. **No new engine mechanic and
  no `binStyle` change** (verbatim-engine emulation: no mis-colours; Healthy boundary/Unkindly shutting out,
  Unfair expectation, Undermines the couple, Red flag get help coloured by existing tokens; rest neutral). Spot ids
  injected (8); fm-060 carries multiple valid tricks. New-node wiring (gen-path `GAME` dict + 🗺️ emoji → regen
  `path.ts`, 63 built/playable → `engine-host`). Read-first attested; tsc/eslint/build green; merged `--no-ff`;
  deployed. KB: new doc [games/family-map.md](../games/family-map.md) + index row + this entry. Builds on
  [My Family Garden](../games/my-family-garden.md) (g03); links g55 & g56. **Next:** g58 Money, Together.

## 2026-06-24 · g56 Respect at Home: Chapter 7's highest-safeguarding node
- **g56 Respect at Home (`swipeed-equal-lens`)**: built the **fourth Chapter-7 node and the chapter's protective
  backbone** to the [GDD v2 mechanic-embodying standard](../games/swipeed-game-patterns.md): it carries the
  **consent thread into marriage**, the place consent is most often assumed away. *Marriage doesn't cancel
  consent; love is never control.* **84-scenario typed library** (gameId `respect-at-home`): respect-daily 13 ·
  consent-inside 13 · spot-abuse-control 17 · safety-and-help 14 · never-your-fault 14 · tools-and-help 13, across
  branch 18 · strike-rewrite 16 · sort 13 · reflect 12 · role-play 10 · match 8 · spot 7, **0% binary**, led by
  strike-rewrite + branch + role-play. Modes: respect daily, consent inside (married ≠ standing consent; UN&RE),
  spot abuse & control (emotional/financial/sexual/physical + coercive control: it's never love), safety & help
  (recognise danger, safety-planning, where to get help, no blame), never-your-fault, tools/help. **HIGH-STAKES &
  survivor-centred: never victim-blaming** (abuse is always the perpetrator's responsibility), urgent routing
  **181/1091/112**, even-handed across genders (men/others especially silenced), strictly non-graphic. **DV Act
  2005** civil framing; **marital-consent criminal law flagged as contested/evolving, educational, not legal
  advice**; safety-planning noted that **risk can rise at leaving**. `reassureCats` spot-abuse-control +
  safety-and-help + never-your-fault. **No new engine mechanic and no `binStyle` change**. *Verbatim*-engine
  emulation over all 13 sort pairs found no mis-colours (clearest pairs correctly coloured; rest neutral, valence
  in labels); coloring `abuse`/`control` globally rejected as unsafe (*control* has good senses; `abuse`→red would
  wrongly red the *Not abuse* safe side, which the safe-negation guard doesn't cover). Spot ids injected (7); 3
  spots carry multiple valid tricks (engine solves on any). New-node wiring (gen-path `GAME` dict + 🏠 emoji →
  regen `path.ts`, 62 built/playable → `engine-host`). Read-first attested; tsc/eslint/build green; merged
  `--no-ff`; deployed. KB: new doc [games/respect-at-home.md](../games/respect-at-home.md) + index row + this entry.
  Builds on [Mutual](../games/mutual.md) (g31) and [Consent, For Real](../games/consent-for-real.md) (g44); g55 routes
  coercive control here. **Next:** g57 The Family Map.

## 2026-06-24 · g55 Equal Partners: the equal-home heart of Chapter 7
- **g55 Equal Partners (`swipeed-equal-lens`)**: built the **third Chapter-7 node** to the
  [GDD v2 mechanic-embodying standard](../games/swipeed-game-patterns.md): *the most unequal place in most lives is
  the home.* **84-scenario typed library** (gameId `equal-partners`): see-the-load 17 · helping-vs-owning 16 ·
  share-it-fairly 15 · two-careers 12 · keep-it-equal 12 · tools-and-help 12, across branch 18 · strike-rewrite 15
  · sort 14 · reflect 12 · role-play 11 · match 7 · spot 7, **0% binary**, led by branch + strike-rewrite +
  role-play. **The signature move reframes a man's role from "helping" to OWNING an equal share**, the planning
  and remembering (the invisible *mental load*), not just the chores. Themes: see the load, helping vs owning (the
  core reframe), share it fairly, two careers (whose job "flexes" shouldn't default to gender), keep it equal,
  tools/help. Everyone gains; **even-handed, engages men as equal owners, never anti-men, never shames any current
  arrangement**, but coercive control (over money, movement, who you can see) is **named as abuse** and routed to
  Respect at Home (g56) + help (181/1091/112; `reassureCats` tools-and-help). India: ~2.6× unpaid-care gap even in
  dual-income homes; in-laws/joint families. **No new engine mechanic and no `binStyle` change** (Fair/Unfair,
  Quietly fails, Genuinely shared coloured by existing tokens; reframe/abstract pairs neutral, valence carried by
  labels, no mis-colours, no collisions). Spot ids injected (7); two "see the load" spots carry two valid
  `trick:true` items (engine `SpotPlay` solves on any trick → multi-answer spots work as-is). New-node wiring
  (gen-path `GAME` dict + 🧺 emoji → regen `path.ts`, 61 built/playable → `engine-host`). Read-first attested;
  tsc/eslint/build green; merged `--no-ff`; deployed. KB: new doc [games/equal-partners.md](../games/equal-partners.md)
  + index row + this entry. Builds on [Equalize](../games/equalize.md) (g26); sets up Equal Parents (g62). **Next:**
  g56 Respect at Home.

## 2026-06-24 · g54 Your Path, Your Call: the equity heart of Chapter 7
- **g54 Your Path, Your Call (`swipeed-equal-lens`)**: built the **second Chapter-7 node** to the
  [GDD v2 mechanic-embodying standard](../games/swipeed-game-patterns.md), the **deliberate counterpoint to
  [Choosing & Building](../games/choosing-building.md) (g53)**: g53 equips the person who chooses a partnership; g54
  defends **autonomy over whether to walk that path at all**: *marriage and children are one valid path, not the
  measure of a life or a verdict on worth.* **84-scenario typed library** (gameId `your-path-your-call`):
  script-and-choice 14 · not-marrying 14 · childfree-complete 14 · hold-your-ground 14 · worth-beyond-status 15 ·
  tools-and-reflection 13, across branch 18 · strike-rewrite 16 · sort 13 · reflect 12 · role-play 11 · match 7 ·
  spot 7, **0% binary**, led by strike-rewrite + branch + role-play. Five themes: the script & the choice, not
  marrying (busts the *"still unmarried?"* stigma; UN&RE), childfree complete (womanhood isn't motherhood), hold
  your ground (family pressure, kindly but firmly), worth beyond status (never your marital state, looks or the
  marriage market incl. colourism). **No pressure in any direction; never shames those who do marry/have kids;
  even-handed** (men feel a version too). Coercion/distress → support; **forced marriage → 181/1091/112/Childline
  1098** (`reassureCats` hold-your-ground + worth-beyond-status). India: the marriage clock, *"log kya kahenge"*,
  worth-questioning stigma heaviest on women. **No new engine mechanic and no `binStyle` change**. Emulation over
  all 13 sort pairs found 8 correctly coloured by existing tokens, 5 abstract worth pairs left neutral, zero
  mis-colours, zero cross-game collisions (same conservative call as g53). New-node wiring (gen-path `GAME` dict +
  🛤️ emoji → regen `path.ts`, 60 built/playable → `engine-host`). Spot ids injected (7). Read-first attested;
  tsc/eslint/build green; merged `--no-ff`; deployed. KB: new doc
  [games/your-path-your-call.md](../games/your-path-your-call.md) + index row + this entry. Builds on
  [Equal & Confident](../games/equal-confident.md) (g50) and [Equalize](../games/equalize.md) (g26). **Next:** g55 Equal
  Partners.

## 2026-06-24 · Chapter 7 opens: Choosing & Building (g53), the first genuinely-new node
- **g53 Choosing & Building (`swipeed-equal-lens`)**: built the **opener of Chapter 7 (Building a Life,
  22 → first child)** to the [GDD v2 mechanic-embodying standard](../games/swipeed-game-patterns.md). This is the
  **first genuinely-new node** built after the Ch.1-6 retrofit, so it needed **fresh wiring** (not just content):
  a new runtime `gameId` `choosing-building` added to the gen-path `GAME` dict (+ 💍 emoji), `path.ts`
  **regenerated** (now **59 built/playable**), and an `engine-host` registration. **84-scenario typed library**
  (choosing-well 17 · what-it-takes 15 · love-and-arranged 15 · commitment-clearly 13 · starting-strong 12 ·
  tools-and-help 12) across seven play actions (branch 18 · strike-rewrite 15 · sort 14 · reflect 12 · role-play 10
  · match 8 · spot 7), **0% binary**. Turns the journey from "me" to "us": **choose on values not sparks**, what a
  relationship actually takes (communication / trust / **repair**, build *us* without erasing *me*), **eyes-open
  commitment** (busts *"marriage will fix me"*), **love and arranged marriage as two paths to the same skills**
  (consent always; family respected but the couple's judgement leads), and **starting equal from day one**. Every
  path respected incl. not marrying; **forced/coerced marriage is never reframed as choice**, routed to
  **181 / 1091 / 112** and **Childline 1098**. India-grounded (the marriage clock, *log kya kahenge*, in-laws,
  arranged introductions). **No new engine mechanic and no `binStyle` change** (good/bad bins already covered;
  judgement-pair bins correctly left neutral). Read-first attested; tsc/eslint/build green; merged `--no-ff`;
  deployed. KB: new doc [games/choosing-building.md](../games/choosing-building.md) + index row + this entry.
  Builds on [Real Relationships](../games/real-relationships.md) (g46) and [Mutual](../games/mutual.md) (g31); sets up
  Equal Partners (g55) and The Family Map (g57). **Next:** g54 Your Path, Your Call.

## 2026-06-23 · Reverted all the voice/TTS exploration: back to plain Web Speech
- **Voice (`swipeed-equal-lens`)**: at the founder's call, **reverted the entire 2026-06-23 voice exploration**
  (opt-in Kokoro neural voice, the `/voice` tuning lab, per-chapter voices, app-wide `BUILTIN` defaults, and the
  pre-generated-clips pipeline + Chapter-1 pilot). `speak.ts` + `engine-host.tsx` restored to their pre-voice
  state; removed `lib/tts-kokoro.ts`, `lib/chapters.ts`, `lib/audio-key.ts`, `app/voice`, `scripts/
  collect-narration.py`, `scripts/gen-audio.mts`, `public/audio/*` (255 clips); dropped deps kokoro-js,
  @breezystack/lamejs, tsx; reverted tsconfig + .gitignore. **Narration is once again the device Web Speech
  voice (`window.speechSynthesis`, en-IN), exactly as before.** tsc/build green; deployed (`/game/feelings` 200,
  `/voice` + `/audio/*` 404). The capstone/game **gesture + UI parity** work (chat bubble, three-zone layout,
  drag gestures, UN/RE reveal, etc.) was NOT reverted, only the voice work. If revisited, pre-generated clips
  were the most promising path. See [pattern #10](../games/swipeed-game-patterns.md).

## 2026-06-23 · Pre-generated narration clips pipeline (option C) + Chapter-1 pilot
- **Pre-gen audio (`swipeed-equal-lens`: `audio-key.ts` + `speak.ts` + `scripts/collect-narration.py` +
  `scripts/gen-audio.mts`)**, the production answer for **one consistent narration voice, instant, offline, no
  per-user model download**. `collect-narration.py` extracts the EXACT strings the v2 engine speaks (mirrors
  `hookLine`/`resolveLine` + branch consequences + static nudges + greet/badge/helpLine), tagged by chapter;
  `gen-audio.mts` (tsx) renders each via **Kokoro at build time** (free; MP3 in-process via `@breezystack/lamejs`,
  no ffmpeg; per-chapter render voice; resumable) into `public/audio/<folder>/<hash>.mp3` + `manifest.json`.
  `speak()` plays the clip when a line was pre-rendered for the current chapter, else falls back to the live
  engine (coverage grows incrementally, zero risk). `audio-key.ts` shares `clean()`+FNV-1a `audioKey()` so
  generator and player filenames match (255/255 hash-verified). **Pilot live: Feelings Friends (Ch.1, bf_emma,
  255 clips, 8.6 MB).** ~1.5s/clip on CPU. Provider swappable (ElevenLabs later); at full scale clips move to a
  bucket/CDN (not the repo). `scripts/` excluded from the app typecheck. tsc/build green; deployed (`/game/feelings`
  + `/audio/manifest.json` + clips all 200). See [pattern #10](../games/swipeed-game-patterns.md).

## 2026-06-23 · App-wide per-chapter voice defaults (not just per-device localStorage)
- **Voice defaults (`swipeed-equal-lens`: `chapters.ts` `BUILTIN` + `speak.ts` `pickWebVoice` + `/voice`)**: the
  `/voice` lab only wrote **localStorage (per-device)**, so tuned voices never reached other users/devices.
  Added a **code-level default layer** that ships to everyone: `BUILTIN` per-chapter defaults (age-tuned rate/
  pitch) using a **portable voice preference** (`webVoicePrefer`: best Indian/UK/US English voice available on
  each device) rather than a fixed `voiceURI` that wouldn't exist everywhere; localStorage overrides BUILTIN per
  device. `pickWebVoice()` resolves a specific saved voice → preference list → browser default. The lab gained a
  **"Copy config"** export (clipboard JSON) to bake back into `BUILTIN`. **Key fact for the founder:** device
  voices vary per device, so a device voice can't be a universal default: **only Kokoro (or pre-generated clips)
  gives the same voice on every device.** tsc/lint/build green; deployed. See [pattern #10](../games/swipeed-game-patterns.md).

## 2026-06-23 · Per-chapter narration voices (8 personas, a voice each)
- **Per-chapter voice (`swipeed-equal-lens`: `src/lib/chapters.ts` + `speak.ts` + `engine-host.tsx` + `/voice`)**:
  each of the 8 chapters targets a different persona/age band, so the narration voice is now set **per
  chapter**. `chapters.ts` maps runtime gameId→chapter (from the canonical path table), defines the 8 persona
  labels, the `VoiceCfg` type, and the `swipeed.voices` storage contract (one JSON keyed by chapter number +
  `default`; legacy flat keys read as the default). `speak()` picks the config for the **current chapter**:
  `setNarrationChapter(n)` set by `EngineGameHost` on game mount (`chapterOf(id)`, cleared on exit), and each
  chapter independently chooses engine (device voice + rate/pitch, or Kokoro voice + speed), read fresh per line.
  The `/voice` lab gained a chapter/persona selector: configure + preview each chapter, "copy this voice to all
  chapters", Save writes all. No game code changed. tsc/lint/build green; deployed (`/voice` + `/game/*` 200).
  See [pattern #10](../games/swipeed-game-patterns.md).

## 2026-06-23 · Voice lab (/voice) + tunable device voice
- **Voice tuning (`swipeed-equal-lens`: `src/app/voice/page.tsx` + `speak.ts` + `tts-kokoro.ts`)**: added a
  **`/voice` lab** to audition and tune the narration voice live: pick the engine (device Web Speech vs neural
  Kokoro), choose a specific voice, tune rate/pitch (web) or speed (kokoro), preview against real Lensy sample
  lines, and **Save** (persists to localStorage; `applyVoicePrefs()` applies without a reload). `speak()` now
  honours a chosen **device voice (by voiceURI) + rate + pitch** read fresh per line, so selecting a better
  device voice (e.g. an Apple "Enhanced"/Indian-English voice) is the cheapest fix for robotic narration.
  `kokoroSpeak` takes per-call voice/speed overrides; `KOKORO_VOICES` catalogue powers the dropdown without a
  model download. No game code changed. tsc/lint/build green; deployed (`/voice` 200). See
  [pattern #10](../games/swipeed-game-patterns.md).

## 2026-06-23 · Opt-in in-browser neural TTS (Kokoro-82M) behind speak()
- **Voice engine (`swipeed-equal-lens`: `src/lib/tts-kokoro.ts` + `src/lib/speak.ts`)**: added an **opt-in**
  alternative to the device Web Speech voice: **Kokoro-82M run on-device via onnxruntime-web** (WebGPU when
  available, else WASM/CPU). One consistent warm "Lensy" voice on every device, fully offline after a one-time
  ~80 MB model download, no per-play cost. Wired behind the single `speak()` choke-point (no game code changed),
  enabled with **`?voice=kokoro`** (persists to localStorage; `?v=<voice>` picks a voice, default `af_heart`;
  `?voice=web` reverts). **Gated** (default users get Web Speech, no download), **lazy/dynamically-imported** (the
  heavy `kokoro-js`/`@huggingface/transformers` stay out of the server + initial client bundle, verified as
  separate async chunks), clips **cached by text** (repeats/replay instant), and **falls back to the device
  voice while the model downloads or where WebGPU/WASM can't run**. tsc/lint/build green; deployed. Trade-offs:
  voices are US/UK English (no native Indian accent), and WASM/CPU generation is slow on low-end devices, so
  **pre-generated clips remain the low-latency production path** (render the static authored lines at build time,
  serve cached audio behind the same `speak()` interface). Documented in [pattern #10](../games/swipeed-game-patterns.md).

## 2026-06-23 · Capstone+game UI follow-ups from on-device review (UN/RE reveal, swipe, match cells, text)
- **Engine UX (`capstone-rich.tsx` + `v2-engine.tsx`)**: five fixes from a device review of the capstones, **no
  content/data changes**: (1) strike-rewrite reveal now uses the **shared `UnReBeat` UN/RE card** (UN eraser teal
  → RE pencil coral, brand icons) like the lesson engine, not plain inline text; (2) the **swipe lap** no longer
  flies off-screen leaving an empty box: on commit it's replaced by a compact "💚 cheered!" confirmation; (3)
  **match cells equal height** via a single `grid-auto-rows:1fr` grid with interleaved left/right, fixed in
  **both** engines so the cords are tidy; (4) capstone **Next** dropped its duplicate arrow ("Next → →" → "Next
  →"/"Finish ⭐"); (5) long text bounded: the **chat bubble caps at 34vh + scrolls** (both engines) and the
  **graduation certificate shows a short bubble** (full cert stays in its card + is spoken). tsc/lint/build green;
  `fix/capstone-ui-followups` → `--no-ff` merged; deployed (capstone routes + lesson routes 200). See
  [interaction model](../games/swipeed-interaction-model.md#capstones-share-the-model-2026-06-23).

## 2026-06-23 · Capstone laps brought to v2 design parity (gestures + chat bubble + three-zone shell)
- **[Rich capstone engine](../games/capstones.md) (`capstone-rich.tsx`, all six capstones c1-c6)**: the victory
  laps had reimplemented each mechanic with the **old tap-button UI** and a separate shell, so the post-Green-Light/
  Red-Light overhaul (which landed only in `v2-engine.tsx`) never reached the chapter graduations. The capstone
  engine now **inherits the shared [interaction model](../games/swipeed-interaction-model.md#capstones-share-the-model-2026-06-23)**:
  Lensy's **chat bubble** (mist + tail + aria-live), the stable **three-zone layout** (top progress + bubble /
  flexible middle / bottom-pinned Next + counter + tertiary Home, Next lifted out of each lap into the engine),
  and **direct-manipulation gestures** via the shared `interactions.tsx` primitives: swipe = drag the card up
  (↑ key), sort = drag a chip into a big top/bottom dropzone (`binStyles`-tinted, now exported from `v2-engine`),
  match = draw a cord (`ConnectorOverlay` + ①②③ tokens), strike-rewrite = scrub the myth then reveal the truth
  inline, build = drag onto the slate. Tap stays for gallery/branch/role-play/spot/reflect and is the keyboard/
  screen-reader fallback; branch & role-play shuffle + 🔀/🗣️ cards; spot 🔎→🚩. Honours prefers-reduced-motion.
  **No content/data changes**, engine UX only. tsc/lint/build/status green. `fix/capstone-design-parity` →
  `--no-ff` merged. (Reported by the founder: "a lot of the design fixes after Green Light Red Light are not
  applied to the capstone questions.")

## 2026-06-23 · c6 Capstone "Standing on My Own" reworked to rich format v1: Chapter 6 fully v2/rich
- **[Capstone: Standing on My Own](../games/capstones.md#capstone-6-standing-on-my-own-rich-format-v1-the-college-graduation) (c6, gameId
  `capstone-6`, Ch.6 College graduation)**: replaced the old nine-star tap build (the simple `capstone-engine.tsx`)
  with the shared **rich capstone engine**, matching c1-c5. Landing config (`content/games/capstone-6.ts`) drives
  arrive → look back (the Standing-on-My-Own constellation gallery) → play back **9 victory laps** (gallery · swipe
  · branch · sort · strike-rewrite · match · **role-play** · strike-rewrite · swipe) → reflect (4) → celebrate
  (independent-young-adult certificate). Recaps the nine Ch.6 lessons (g44-g52). **Added the role-play victory lap
  to the rich engine**: new `CapRolePlayLap` type (`capstone-schema.ts`) + `RolePlayLap` renderer + dispatch
  (`capstone-rich.tsx`); the first capstone to use it (Equal & Confident "amplify a colleague"). Added the Ch.6
  glyph→emoji set (consent-real 🫶 · swipe-smart 💘 · real-relationships 💞 · own-health 🩺 · independence-key 🔑 ·
  mind-belonging 🫂 · find-feet 🧭 · equal-confident 🗣️ · standing-on-my-own-star 🌟), all mapped, no ⭐ fallback.
  **gameId trap:** Landing's `capstone-ch6` is aspirational; registry id is `capstone-6`. The old simple
  `capstone-engine.tsx` is now orphaned (all six capstones are rich). tsc/lint/build/status green.
  `feat/c6-capstone-rich` → `--no-ff` merged. **Chapter 6 (g44-g52 + c6, ages 18-22) is now fully built to the
  v2/rich standard**: the entire 3-22 journey (Chapters 1-6) is done. Remaining: Chapters 7-8 (g53-g69, unbuilt).

## 2026-06-23 · #g51 Know Your Rights (Adult) reworked to GDD 51 v2: all 9 Chapter-6 lessons now v2
- **[Know Your Rights (Adult)](../games/know-your-rights.md) (#g51, gameId `know-your-rights`, Ch.6, Thread G)**:
  the Chapter-6 closer moved **off the ModesEngine onto the shared v2 engine**. **84-scenario typed library**
  (rights-at-work 15 · harassment-and-posh 15 · renting-and-consumer 13 · cyber-and-data 14 · claim-it 15 ·
  tools-and-help 12): seven play actions (branch ×18 · strike-rewrite ×16 · sort ×13 · reflect ×12 · match ×10 ·
  role-play ×8 · spot ×7), **0% binary**, led by branch + strike-rewrite + match (right→route). Turns Justice
  League (g35) rights work into adult arenas: rights at work (labour/contracts/pay/interns), harassment & POSH
  (Internal Committee), renting & consumer, cyber & data, claim it (redress & free legal aid), tools/help.
  EDUCATIONAL not legal advice; all law content flagged for expert review/localisation/currency. India: POSH Act
  2013 & ICs (10+ staff, 3-month window, interns covered), Consumer Protection Act 2019, DPDP, NALSA legal aid
  15100, Zero FIR; helplines 181/1091/112/1930/1098 (`reassureCats` harassment-and-posh + claim-it +
  cyber-and-data). gameId matches registry. binStyle: added exploitation/dead end/hinders→red (g51-only). Spot
  ids injected (7). Read-first attested; tsc/lint/build/status green. `feat/g51-know-your-rights-v2` → `--no-ff`
  merged. **All nine Chapter-6 lessons (g44-g52) are now v2**: only the c6 capstone remains. Builds on g35;
  pairs g50. Next: rich rework of capstone c6 (Standing on My Own).

## 2026-06-23 · #g50 Equal & Confident reworked to GDD 50 v2 (voice/leadership/allyship; everyday bias)
- **[Equal & Confident](../games/equal-confident.md) (#g50, gameId `equal-confident`, Ch.6, Thread E)**: the
  voice/leadership/allyship node moved **off the ModesEngine onto the shared v2 engine**. **84-scenario typed
  library** (claim-your-voice 19 · lead-the-room 14 · spot-counter-bias 15 · be-the-ally 16 ·
  equality-lifts-everyone 10 · tools-and-help 10): seven play actions (branch ×19 · strike-rewrite ×15 · sort ×14
  · reflect ×14 · role-play ×13 · spot ×5 · match ×4), **0% binary**, led by branch + strike-rewrite + role-play.
  Gender equality into adult arenas (seminar room/internship/first job): claim your voice, lead the room (no
  title), spot & counter bias (interruptions, 'bossy' double-bind, office housework), be the ally, equality lifts
  everyone (not zero-sum). Evenhanded, never anti-boy. Harassment -> POSH Internal Committees / 181 (rights/redress
  in g51) (`reassureCats` claim-your-voice + spot-counter-bias + be-the-ally). India: women under-represented in
  workforce/leadership. gameId matches registry. binStyle: added shrinks it/just optics/fades you out/drains it
  ->red (g50-only). Spot ids injected (5). Read-first attested; tsc/lint/build/status green.
  `feat/g50-equal-confident-v2` → `--no-ff` merged. Builds on g33/g26; pairs g51; feeds g55/g62. Next: g51 Know Your Rights.

## 2026-06-23 · #g52 Find Your Feet reworked to GDD 52 v2 (career/future anxiety; comparison trap)
- **[Find Your Feet](../games/find-your-feet.md) (#g52, gameId `find-your-feet`, Ch.6, Thread C)**: the
  career/future-anxiety node (completing the College wellbeing cluster g48/g49/g52) moved **off the ModesEngine
  onto the shared v2 engine**. **84-scenario typed library** (comparison-trap 15 · not-all-sorted 14 ·
  bounce-from-setbacks 16 · worth-beyond-cv 14 · your-path 14 · tools-and-help 11): seven play actions (branch
  ×18 · strike-rewrite ×16 · sort ×14 · reflect ×12 · role-play ×9 · match ×8 · spot ×7), **0% binary**, led by
  branch + strike-rewrite + sort. No one has it figured out: comparison trap (UN&RE), don't need it all sorted,
  bounce from setbacks (failure=information, a comma not a full stop), your path (worth beyond CV), tools & crisis
  routing. Wellbeing-sensitive: healthy coping only, never reinforces hopelessness; worth-beyond-CV; warm crisis
  routing (Tele-MANAS 14416/KIRAN 1800-599-0019/counsellor); NOT careers-counselling or therapy. India: placement
  seasons, JEE/NEET/UPSC, settled-job ideal, peer comparison (`reassureCats` comparison-trap + not-all-sorted +
  bounce-from-setbacks + worth-beyond-cv). gameId matches registry. binStyle: no change (nuanced real-vs-illusion
  bins left neutral). Spot ids injected (7). Read-first attested; tsc/lint/build/status green.
  `feat/g52-find-your-feet-v2` → `--no-ff` merged. Builds on g42/g39; pairs g48/g49. Next: g50 Equal & Confident.

## 2026-06-23 · #g49 Mind & Belonging reworked to GDD 49 v2 (college mental health; help=strength)
- **[Mind & Belonging](../games/mind-belonging.md) (#g49, gameId `mind-belonging`, Ch.6, Thread C)**: the College
  wellbeing anchor moved **off the ModesEngine onto the shared v2 engine**. **84-scenario typed library**
  (settling-in 13 · find-your-people 15 · cope-well 14 · mind-and-self-worth 14 · reach-out 15 · tools-and-help
  13): seven play actions (branch ×19 · strike-rewrite ×15 · sort ×14 · reflect ×12 · role-play ×10 · spot ×7 ·
  match ×7), **0% binary**, led by branch + strike-rewrite + sort. College mental health, loneliness, leaving
  home, body image, help-seeking: settling in (homesickness normalised), find your people, cope well (healthy
  coping ONLY, body image), reach out (help=strength), tools & crisis routing. HIGH-CARE: distress met with
  warmth + immediate help route, never assessment questions; healthy coping only; anti-stigma, NOT therapy;
  serious distress->professionals. India: hostel isolation, academic pressure, stigma esp young men; Tele-MANAS
  14416 (primary)/KIRAN 1800-599-0019/campus counsellors (`reassureCats` settling-in + cope-well +
  mind-and-self-worth + reach-out). gameId matches registry. binStyle: no change (deliberately avoided a generic
  'deepens' token, good in mb-083, bad in mb-008). Spot ids injected (7). Read-first attested; tsc/lint/build/
  status green. `feat/g49-mind-belonging-v2` → `--no-ff` merged. Builds on g39; continues g42. Next: g52 Find Your Feet.

## 2026-06-23 · #g48 Money & Independence reworked to GDD 48 v2 (financial literacy; fair money in love)
- **[Money & Independence](../games/money-independence.md) (#g48, gameId `money-independence`, Ch.6, Thread C)**:
  the College stand-on-your-own-feet node moved **off the ModesEngine onto the shared v2 engine**. **84-scenario
  typed library** (budget-it 15 · save-and-traps 16 · earn-and-ask 15 · money-and-love 16 · money-is-freedom 12 ·
  tools-and-help 10): seven play actions (branch ×20 · sort ×16 · strike-rewrite ×15 · reflect ×12 · match ×8 ·
  role-play ×8 · spot ×5), **0% binary**, led by branch + sort + strike-rewrite. Money = independence/safety/
  choices: budget it, save & avoid traps (debt/EMIs/BNPL/scams), earn & ask (payslips/pay gap/negotiating), money
  & love (fair money; financial control as abuse under DV Act -> 181/1091), money is freedom. Educational, NOT
  financial advice; no products promoted; no real data collected. India: UPI/EMIs/payslips/pay gap (`reassureCats`
  money-and-love + money-is-freedom). gameId matches registry. binStyle: added \btrap\b→red (Debt trap/Trap) +
  sensible→green; categorisation bins left neutral. Spot ids injected (5). Read-first attested; tsc/lint/build/
  status green. `feat/g48-money-independence-v2` → `--no-ff` merged. Builds on g42; pairs g49/g52; continues into
  g58. Next: g49 Mind & Belonging.

## 2026-06-23 · #g47 Own Your Health reworked to GDD 47 v2 (adult SRH ownership; shame-free; confidential)
- **[Own Your Health](../games/own-your-health.md) (#g47, gameId `own-your-health`, Ch.6, Thread F)**: the College
  SRH-ownership node moved **off the ModesEngine onto the shared v2 engine**. **84-scenario typed library**
  (protection-sorted 16 · know-your-status 15 · pleasure-and-wellbeing 14 · the-health-talk 13 ·
  access-and-confidential 14 · tools-and-help 12): seven play actions (branch ×21 · strike-rewrite ×17 · sort ×13
  · reflect ×13 · spot ×7 · role-play ×7 · match ×6), **0% binary**, led by branch + strike-rewrite + sort. SRH
  becomes fully the young adult's own: protection sorted (dual protection), routine testing (U=U, confidential),
  pleasure & wellbeing (normal part of health within consent), the health talk, confidential access.
  Comprehensive/frank, never explicit-as-instruction, medically accurate, shame-free; confidentiality
  foregrounded; even-handed across genders/orientations. India: NACO ICTC/RKSK/doctors/pharmacies (`reassureCats`
  know-your-status + pleasure-and-wellbeing + access-and-confidential). gameId matches registry. binStyle: no
  change needed (bins emulated clean). Spot ids injected (7). Read-first attested; tsc/lint/build/status green.
  `feat/g47-own-your-health-v2` → `--no-ff` merged. Builds on g30/g29/g22; pairs g44. Next: g48 Money & Independence.

## 2026-06-23 · #g46 Real Relationships reworked to GDD 46 v2 (healthy vs coercive; leaving safely)
- **[Real Relationships](../games/real-relationships.md) (#g46, gameId `real-relationships`, Ch.6, Thread D)**: the
  relationship heart of College moved **off the ModesEngine onto the shared v2 engine**. **84-scenario typed
  library** (what-healthy-looks-like 15 · fight-right 16 · red-flags-grown-up 16 · leaving-safely 14 · breakups
  13 · tools-and-help 10): seven play actions (branch ×21 · sort ×16 · strike-rewrite ×14 · reflect ×13 ·
  role-play ×9 · spot ×6 · match ×5), **0% binary**, led by branch + sort + strike-rewrite. Good relationships
  are built not found: what healthy looks like, fight right (Four Horsemen + repair), red flags grown up
  (coercive control, jealousy-as-love, isolation, gaslighting), leaving safely & breakups. Abuse-aware (leaving
  valid/brave/never the target's fault; exit can escalate); breakup wellbeing-safe; even-handed; non-graphic.
  India: family scrutiny, caring-vs-controlling romanticised; helplines 181/1091/112 (`reassureCats`
  red-flags-grown-up + leaving-safely + breakups). gameId matches registry. binStyle: **fixed two POS-'keep'
  bad-green mis-colors**: keeps stuck (rr-073) + keeps it lopsided (a pre-existing Equalize bug)→red, plus
  smothering/wrecker→red. Spot ids injected (6). Read-first attested; tsc/lint/build/status green.
  `feat/g46-real-relationships-v2` → `--no-ff` merged. Builds on g24/g31/g09. Next: g47 Own Your Health.

## 2026-06-23 · #g45 Swipe Right? reworked to GDD 45 v2 (modern dating & app safety)
- **[Swipe Right? (Dating & Apps)](../games/swipe-right.md) (#g45, gameId `swipe-right`, Ch.6, Thread D)**: the
  College dating node moved **off the ModesEngine onto the shared v2 engine**. **84-scenario typed library**
  (dating-now 14 · meeting-safely 16 · fakes-and-ghosts 16 · date-with-respect 16 · profiles-are-people 12 ·
  tools-and-help 10): seven play actions (branch ×19 · strike-rewrite ×15 · sort ×15 · reflect ×13 · role-play
  ×9 · spot ×8 · match ×5), **0% binary**, led by branch + strike-rewrite + role-play. Meet safely, spot fakes/
  ghosts, rejection both ways, profiles are people. Practical safety not fear-mongering (public, tell a friend,
  own way home, video-verify); skeptical of fast love/money (romance scams); even-handed across genders/
  orientations. India: dating hidden from family->tell a friend; image-based abuse->cybercrime 1930/
  cybercrime.gov.in/1098/181 (`reassureCats` meeting-safely + fakes-and-ghosts + tools-and-help). gameId matches
  registry. binStyle: added disposable/draining→red (rejected 'real check'→green to avoid mis-coloring Smart
  Screen Heroes' 'Not a real check'). Spot ids injected (8). Read-first attested; tsc/lint/build/status green.
  `feat/g45-swipe-right-v2` → `--no-ff` merged. Builds on g24/g40/g44. Next: g46 Real Relationships.

## 2026-06-23 · #g44 Consent, For Real reworked to GDD 44 v2: Chapter 6 (adult) rework begins
- **[Consent, For Real](../games/consent-for-real.md) (#g44, gameId `consent-real`, Ch.6, Thread B)**: the FIRST
  Chapter-6 (adult, ages 18-22) node moved **off the ModesEngine onto the shared v2 mechanic engine**, opening
  the rework of the adult journey to the same standard as the child journey. **84-scenario typed library**
  (real-situations 15 · drinks-and-capacity 15 · spot-the-pressure 15 · after-harm-support 15 · consent-culture
  13 · tools-and-help 11): seven play actions (branch ×21 · strike-rewrite ×16 · sort ×14 · reflect ×13 ·
  role-play ×10 · spot ×6 · match ×4), **0% binary**, led by branch + strike-rewrite + role-play. Adult consent
  in practice (enthusiastic/ongoing/freely-given/revocable/sober-enough yes between equals; parties/drinks/apps/
  hostel). **Survivor-centred** (believe, never blame, respect reporting choices; responsibility only on the
  person who ignored consent); even-handed across genders (male & LGBTQ+ survivors especially silenced);
  trauma-aware, strictly non-graphic. India: campus/hostel, Internal Committee (POSH/UGC); helplines 181/1091/112
  (`reassureCats` drinks-and-capacity + spot-the-pressure + after-harm-support). **gameId trap:** GDD says
  `consent-for-real`; registry id is `consent-real`. binStyle: added enthusiastic/looking out/survivor-centred/
  real route/capacity present→green (collision-checked; also correctly greens GLRL/Outbreak/Justice League good
  bins). Spot ids injected (6). Read-first attested; tsc/lint/build/status green. `feat/g44-consent-real-v2` →
  `--no-ff` merged. Builds on g31 (Mutual). Next: g45 Swipe Right? (Dating & Apps).

## 2026-06-23 · c5 Capstone "Ready for the World" reworked to rich Capstone format v1: closes the whole path
- **[Capstone: Ready for the World](../games/capstones.md#capstone-5-ready-for-the-world-rich-format-v1-the-final-graduation) (c5,
  gameId `capstone-5`, Ch.5 graduation + the close of the whole 4-18 journey)**: replaced the old nine-star tap
  build with the shared **rich capstone engine** (`capstone-rich.tsx`), matching c1-c4. Landing config
  (`content/games/capstone-5.ts`) drives arrive → look back (the Ready-for-the-World constellation gallery) → play
  back **9 victory laps** (gallery · swipe · spot · branch · sort · match · branch · strike-rewrite · swipe, each
  a Ch.5 truth re-cued through a different mechanic) → reflect (4) → celebrate (constellation + sunrise +
  whole-journey graduation certificate). Recaps the nine Ch.5 lessons (g29-g36, g42). Added the Chapter-5
  glyph→emoji set to `capstone-schema.ts` (choice-compass 🧭 · status-strength 🩺 · mutual-hearts 💞 · spectrum-prism
  🌈 · lead-torch 🔦 · change-spark ⚡ · rights-shield 🛡️ · life-toolkit 🧰 · decoder-lens 🔍 · ready-for-the-world-star
  🌅), all glyphs mapped, no ⭐ fallback. **gameId trap:** Landing's `capstone-ch5` is aspirational; registry id is
  `capstone-5` (config uses `capstone-5`). No score, no fail. tsc/lint/build/status green. `feat/c5-capstone-rich`
  → `--no-ff` merged. **All 43 lesson nodes + all 5 child-journey capstones (ages 3-18) are now built to the
  v2/rich standard.** Next: Chapter 6 (g44 Consent, For Real onward).

## 2026-06-23 · #g36 Decoded built to GDD 36 v2 (media-literacy finale; decode anything): Chapter 5 lessons all v2
- **[Decoded](../games/decoded.md) (#g36, gameId `decoded`, Ch.5, Thread G)**: the media-literacy **finale and
  summit of the 3-18 journey**, reworked onto the shared v2 engine as an **84-scenario typed library**
  (decode-the-algorithm 14 · decode-the-influence 16 · decode-pornography 14 · decode-yourself 14 · the-decoder 12
  · grow-the-journey 14). Seven play actions (branch ×17 · strike-rewrite ×16 · reflect ×15 · sort ×13 · spot ×9 ·
  match ×8 · role-play ×6), **0% binary**, led by strike-rewrite + branch + spot. The feed is engineered to use
  you. Learn to read it and use it instead: decode the machine (algorithms/attention economy/filter bubbles),
  the influence (misinfo/AI fakes/deepfakes/scams/dark patterns), pornography (non-explicit: staged performance
  not real, not sex-ed, no shame), yourself (digital wellbeing), decode anything, Grow (URG/digital-life charter).
  Critical not cynical; a game about manipulation that uses NO dark patterns. India: deepfakes/scams/DPDP Act/
  cybercrime 1930/cybercrime.gov.in (`reassureCats` decode-pornography + decode-yourself). gameId matches registry.
  binStyle: safe-negation += 'not manipulation'→green; NEG += leaves you open/distortion/erodes it→red; POS +=
  protects it→green (collision-free, g36-only); reframe/categorisation bins left neutral. Spot ids injected (9).
  Read-first attested; tsc/lint/build/status green. `feat/g36-decoded-v2` → `--no-ff` merged. **All Chapter 5
  lessons (g29-g36, g42) are now v2.** Next: rich rework of capstone c5 (Ready for the World).

## 2026-06-23 · #g42 Life Ready built to GDD 42 v2 (adult life-skills; culminates the feelings thread)
- **[Life Ready](../games/life-ready.md) (#g42, gameId `life-ready`, Ch.5, Thread C)**: the adult life-skills node
  (Chapter 5's penultimate lesson), reworked onto the shared v2 engine as an **85-scenario typed library**
  (know-yourself 14 · decide-like-an-adult 15 · handle-the-big-stuff 17 · people-skills 15 · support-network 13 ·
  life-ready-toolkit 11). Seven play actions (reflect ×26 · branch ×24 · strike-rewrite ×12 · sort ×10 · match ×6
  · role-play ×5 · spot ×2), **0% binary**, led by branch + reflect + strike-rewrite. The **culmination of the
  feelings/life-skills thread** (Feelings Friends → Heart Smart → Mind Matters → Bounce → Life Ready): know
  yourself, decide like an adult, handle the big stuff, people skills, build a support network. Healthy strategies
  only; pressure-free (no single right path beyond safety/law); help-seeking is a lifelong strength; NOT therapy.
  India board-exam/family-career pressure; routes distress Tele-MANAS 14416 / KIRAN 1800-599-0019 / Manodarpan /
  trusted adult (`reassureCats` handle-the-big-stuff + support-network). gameId matches registry. binStyle: added
  makes it harder/isolates you/avoids it/poor basis/strains→red + builds support/strengthens/good basis/emotional
  intelligence→green (regression-clean; also fixed My Choices 'Poor basis' bin). Spot ids injected (2). Read-first
  attested; tsc/lint/build/status green. `feat/g42-life-ready-v2` → `--no-ff` merged. Next: g36 Decoded (last Ch.5
  lesson), then capstone c5.

## 2026-06-23 · #g35 Justice League: Rights built to GDD 35 v2 (rights & redress; educational-not-advice)
- **[Justice League: Rights](../games/justice-league-rights.md) (#g35, gameId `justice-league`, Ch.5, Thread G)**:
  the rights-&-redress node, reworked onto the shared v2 engine as an **84-scenario typed library** (know-your-rights
  14 · know-the-law 14 · get-justice 18 · rights-in-action 16 · educational-not-advice 10 · your-rights-toolkit 12).
  Seven play actions (branch ×19 · reflect ×18 · sort ×15 · match ×13 · strike-rewrite ×12 · spot ×4 · role-play
  ×3), **0% binary**, led by branch + match (law→plain meaning) + strike-rewrite. Empowerment through knowledge;
  EDUCATIONAL not legal advice (plain-language law, demystified redress, never promises outcomes). India:
  constitutional rights, POCSO(18), POSH IC, child-marriage law(18/21), DV Act, cyber-law; routes trusted adult /
  police FIR (Zero FIR) / Internal Committees / Child Welfare Committees / NCPCR / NALSA free legal aid 15100 /
  helplines 1098-181-1091-112-1930 (`reassureCats` get-justice + your-rights-toolkit + educational-not-advice).
  gameId matches registry. binStyle: safe-negation guard += 'not a violation'→green + NEG += 'violates'→red
  (regression-clean, g35-only); definitional/corrective/routing-categorisation bins left neutral. Spot ids injected
  (4). All law content flagged for expert review/localisation. Read-first attested; tsc/lint/build/status green.
  `feat/g35-justice-league-v2` → `--no-ff` merged. Chapter 5 lessons complete (g29-g35, g42 next). Next: g42 Life Ready.

## 2026-06-23 · #g34 Change Makers built to GDD 34 v2 (campaign/collective change; the law as a tool)
- **[Change Makers](../games/change-makers.md) (#g34, gameId `change-makers`, Ch.5, Thread E)**: the campaign /
  collective-change node, reworked onto the shared v2 engine as an **84-scenario typed library** (find-your-cause
  14 · make-the-plan 14 · build-the-movement 16 · the-law-as-a-tool 14 · make-it-stick 14 · launch-it 12). Seven
  play actions (branch ×28 · reflect ×17 · sort ×14 · strike-rewrite ×10 · match ×6 · role-play ×5 · spot ×4),
  **0% binary**, led by branch + sort + strike-rewrite. Scales Lead the Way (g33) into organised change:
  cause→plan→movement→law-as-tool→impact→safe first step. Change is possible AND practical; nothing meaningful
  alone; activism safe/lawful/non-violent/ethical/sustainable; sensitive causes backed by trusted adults/
  institutions. India laws (DV Act 2005, POSH 2013, Dowry Prohibition, BNS 2023) + helplines 181/1098/112
  (`reassureCats` the-law-as-a-tool + make-it-stick). gameId matches registry. binStyle: added too vague/
  over-reach/stalls it/just noise/risks it→red + real impact/actionable/good partner/lawful & ethical/real
  protection→green (collision-free; nuanced not-yet bins + tactic-categorisation bin left neutral by design).
  Spot ids injected (4). Read-first attested; tsc/lint/build/status green. `feat/g34-change-makers-v2` → `--no-ff`
  merged. Next: g35 Justice League: Rights.

## 2026-06-23 · #g33 Lead the Way built to GDD 33 v2 (structural equality → everyday leadership; allyship)
- **[Lead the Way](../games/lead-the-way.md) (#g33, gameId `lead-the-way`, Ch.5, Thread E)**: the structural-
  equality→leadership node, reworked onto the shared v2 engine as an **84-scenario typed library** (the-gaps 15 ·
  what-allyship-is 14 · lead-by-example 14 · lift-as-you-climb 16 · call-in-not-out 13 · your-leadership-style 12).
  Seven play actions (reflect ×26 · branch ×20 · strike-rewrite ×12 · sort ×10 · role-play ×9 · match ×4 · spot
  ×3), **0% binary**, led by branch + strike-rewrite + reflect. You don't need a title to lead; allyship is
  everyone's job; **men leading on equality is strength, not betrayal** (key India reframe); real gaps (pay ~34%,
  leadership, unpaid care) → quiet everyday leadership (lead by example, lift as you climb, call in not out).
  India: engage boys/men, persuasion over confrontation, Women's Reservation Act 2023. Safety-first routing
  181/112/Childline 1098 (`reassureCats` call-in-not-out). gameId matches registry. binStyle: added
  victim-blam/widens it/holds them down/undercuts/hardens them/shaming call/bystander→red + lifts others/active
  allyship/closes a gap/strong example→green (full cross-game regression clean; also correctly reddened Equalize
  'Widens it' and Stand Up/Speak Up 'Bystander'). Spot ids injected (3). Read-first attested; tsc/lint/build/status
  green. `feat/g33-lead-the-way-v2` → `--no-ff` merged. Next: g34 Change Makers.

## 2026-06-23 · #g32 Spectrum built to GDD 32 v2 (identity, orientation, respect-not-a-debate)
- **[Spectrum](../games/spectrum.md) (#g32, gameId `spectrum`, Ch.5, Thread D)**: the identity/orientation/respect
  node, reworked onto the shared v2 engine as an **84-scenario typed library** (the-spectrum 15 · myths-and-respect
  15 · dignity-for-all 16 · being-you 14 · stand-against-bullying 12 · support-and-rights 12). Seven play actions
  (reflect ×27 · branch ×17 · strike-rewrite ×14 · sort ×10 · role-play ×7 · match ×5 · spot ×4), **0% binary**,
  led by strike-rewrite + branch + reflect. Built on one non-negotiable: **respect is a value, not a debate**;
  busts harmful myths without disparaging family/beliefs; separates honest belief-differences from the dignity
  floor. No pressure to label, full confidentiality, never outs. India 2018 decrim / NALSA / constitutional
  dignity; routes distress/family-conflict to Tele-MANAS 14416 / KIRAN 1800-599-0019 / Childline 1098 / a trusted
  adult (`reassureCats` being-you + stand-against-bullying + support-and-rights). gameId matches registry. binStyle
  unchanged (all bins emulated clean). Spot ids injected (4). Read-first attested; tsc/lint/build/status green.
  `feat/g32-spectrum-v2` → `--no-ff` merged. Next: g33 Lead the Way.

## 2026-06-23 · #g31 Mutual built to GDD 31 v2 (sexual consent; FRIES; legal age; even-handed)
- **[Mutual](../games/mutual.md) (#g31, gameId `mutual`, Ch.5, Thread B)**: the consent/relationships node **at
  its adult peak**, reworked onto the shared v2 engine as an **84-scenario typed library** (what-consent-is 15 ·
  reading-respecting 14 · pressure-coercion 17 · the-mutual-zone 14 · rights-and-law 12 · mutual-respect-equal
  12). Seven play actions (reflect ×20 · strike-rewrite ×17 · branch ×16 · role-play ×11 · sort ×10 · spot ×6 ·
  match ×4), **0% binary**, led by branch + strike-rewrite + role-play. **Consent = FRIES**, a yes from both
  (presence of a yes, not absence of a no), withdrawable anytime; pressure/manipulation/incapacitation cancels
  it. Even-handed (any gender), never victim-blaming, never explicit; delaying respected. India: age of consent
  18, POCSO for minors; routes assault/abuse/coercion to Women Helpline 181 / 1091 / emergency 112 / Childline
  1098 / a trusted adult (`reassureCats` pressure-coercion + rights-and-law). gameId matches registry. binStyle:
  `coercion`→red (regression-clean). Spot ids injected (6). Read-first attested; tsc/lint/build/status green.
  `feat/g31-mutual-v2` → `--no-ff` merged. Next: g32 Spectrum.

## 2026-06-23 · #g30 Status: Know It built to GDD 30 v2 (HIV/STI testing; treatment works; zero stigma)
- **[Status: Know It](../games/status-know-it.md) (#g30, gameId `status-know-it`, Ch.5, Thread F)**: STI/HIV
  testing-&-treatment, reworked onto the shared v2 engine as an **84-scenario typed library** (know-your-status
  16 · prevention-stack 14 · talk-about-it 13 · treat-and-thrive 16 · dignity-no-stigma 13 · own-it-decide 12).
  Seven play actions (strike-rewrite ×18 · branch ×18 · reflect ×17 · sort ×13 · match ×8 · role-play ×6 · spot
  ×4), **0% binary**. Testing-is-power-not-shame; prevention stack; partner talk; treatment works (HIV
  manageable, U=U; STIs treatable/curable); dignity/zero-stigma. NACO ICTC confidential testing; POCSO-aware;
  routes coercion/distress to a doctor / Childline 1098. gameId matches registry. binStyle: `dignity`→green +
  `^stigma`→red (anchored; "reduces stigma" stays green). Spot ids injected (4). Read-first attested;
  tsc/lint/build green. `feat/g30-status-v2` → `--no-ff` merged. Next: g31 Mutual.

## 2026-06-23 · #g29 My Choices, My Future built to GDD 29 v2 (Chapter 5 opener; contraception & rights; autonomy-first)
- **[My Choices, My Future](../games/my-choices-my-future.md) (#g29, gameId `my-choices`, Ch.5, Thread F)**: the
  contraception / family-planning / services node and the **Chapter 5 opener** (ages 15-18), reworked onto the
  **shared v2 engine** as an **84-scenario typed library**: the-full-picture 16 · if-when-whether 13 · decide-it
  16 · access-and-rights 13 · talk-it-through 12 · my-future-no-pressure 14. Seven typed play actions (branch ×18
  · strike-rewrite ×16 · reflect ×15 · sort ×13 · role-play ×9 · spot ×7 · match ×6), **0% binary**, led by
  branch + strike-rewrite + sort. AUTONOMY-FIRST, comprehensive-but-never-explicit: no pressure in any direction
  (waiting fully valid + most certain; active isn't irresponsible). Confidential AFHC/Ujala care; age-of-consent
  18 / POCSO / coercion = child-protection → routes to a doctor / trusted adult / Childline 1098. Builds on g22;
  links g30/g31.
- **gameId trap:** library/GDD aspirational `my-choices-future` vs registry `my-choices`: config uses
  `my-choices`. **Engine:** no new mechanic; `binStyle` added `pressures`/`violation`/`undermines`→red +
  `respected`→green for the autonomy bins; deliberately did NOT add `forced` (it would wrongly red the
  pro-autonomy "Never to be forced" bin mc-024: negation trap); emulated all 13 bins, no mis-color. Spot ids
  injected (7); no builds. reassureCats = [access-and-rights, if-when-whether, my-future-no-pressure] + reassure
  + clinic/1098 helpLine. Wrapper `MyChoicesGame` kept. Read-first (GDD 29 + full library incl. all
  access-and-rights + my-future-no-pressure scenarios verbatim); `--attest g29`; gate validated; tsc/lint/build
  green. `feat/g29-mychoices-v2` → `--no-ff` merged (`f9a2166` → merge). **Chapter 5 begun.** Next: g30 Status:
  Know It.

## 2026-06-23 · #c4 Capstone "Reading Relationships" reworked to rich format v1: Chapter 4 complete
- **[Capstone 4: Reading Relationships](../games/capstones.md#capstone-4-reading-relationships-rich-format-v1)
  (`capstone-4`, Ch.4 graduation, ages 12-15)**: reworked off the old eight-star tap build onto the shared rich
  capstone engine (the c1/c2/c3 precedent), driven by the c4 Landing JSON. Five beats: arrive & bloom → look
  back (the Reading-Relationships constellation gallery) → **eleven victory laps**, each chapter truth re-cued
  through a different mechanic (gallery · branch · swipe · sort · strike-rewrite · build · spot · match) → four
  reflects → celebrate (constellation + graduation star + certificate). Consolidates the 11 Chapter-4 truths
  (g21-g28, g39, g40, g43) via spaced, varied retrieval. No score, no fail.
- **New: the strike-rewrite victory lap**: added `CapStrikeLap` to `capstone-schema.ts` (+ CapLap union) and a
  no-fail `StrikeLap` renderer to `capstone-rich.tsx` (rub out a myth you can now bust → see the truth →
  celebrate). c4 is the first capstone whose chapter has the strike-rewrite myth-busting flagships
  (MythBuster g25, The Rabbit Hole g43). gameId `capstone-4` (Landing's `capstone-ch4` is design-doc only).
  Faithful from the Landing JSON; tsc/lint/build green. `feat/c4-reading-relationships-rich` → `--no-ff` merged
  (`5f38285` → merge). **Chapter 4 is fully complete** (all games + capstone v2/rich). c1-c4 are now rich;
  c5-c6 still on the simple star format. Next: Chapter 5 (g29 My Choices, My Future on).

## 2026-06-23 · #g28 Reality Check built to GDD 28 v2 (teen media literacy; gated non-explicit; fakes & rights): Chapter 4 games complete
- **[Reality Check](../games/reality-check.md) (#g28, gameId `reality-check`, Ch.4, Thread G)**: the teen
  media-literacy peak and the **last Chapter 4 game**, reworked onto the **shared v2 engine** as an
  **85-scenario typed library**: real-vs-reel 15 · manipulation-files 16 · media-love-sex 15 · fakes-and-rights
  13 · finding-help 12 · think-for-yourself 14. **Eight typed play actions** (spot ×16 · strike-rewrite ×15 ·
  **swipe ×13** · branch ×11 · reflect ×10 · sort ×10 · role-play ×6 · match ×4), **0% binary**, led by spot +
  strike-rewrite + swipe (**2nd game to use swipe** after g24). See the curation; the manipulation toolkit; a
  **gated non-explicit** media-&-sexuality module (films ≠ real love; porn is staged not sex-ed; bodies vary;
  curiosity-is-normal no-shame); deepfakes & rights (fake nude of a minor = illegal CSAM, never-blame,
  reportable, verify-the-source; POCSO/BNS/IT-Rules); the four questions. Routes to cybercrime.gov.in / 1930 /
  Childline 1098. Builds on g16 & g12/g17; sets up g36.
- `gameId "reality-check"` matches the registry. **Engine:** no new mechanic; `binStyle` added `manipulation`→red
  + `not trusted`→red (emulated all 10 bins, no mis-color); swipe real-vs-reel pairs take neutral side-tints
  (real/staged isn't a moral green/red). Spot ids injected (16); no builds. reassureCats = [media-love-sex,
  fakes-and-rights, finding-help] + reassure + 1930/1098 helpLine. Wrapper `RealityCheckGame` kept. Read-first
  (GDD 28 + full library incl. all gated media-love-sex + fakes-and-rights scenarios verbatim); `--attest g28`;
  gate validated; tsc/lint/build green. `feat/g28-realitycheck-v2` → `--no-ff` merged (`8cc70af` → merge).
  **All Chapter 4 GAMES are now v2** (g21-g28, g39, g40, g43): only **capstone c4** remains to close the
  chapter. Next: capstone c4 (rich-format rework), then Chapter 5 (g29 My Choices, My Future on).

## 2026-06-23 · #g43 The Rabbit Hole built to GDD 43 v2 (manosphere → positive masculinity; never shame the boy)
- **[The Rabbit Hole](../games/rabbit-hole.md) (#g43, gameId `rabbit-hole`, Ch.4, Thread E/G)**: the
  online-misogyny / manosphere node, reworked onto the **shared v2 engine** as an **84-scenario typed library**:
  the-funnel 14 · follow-the-money 13 · spot-the-hook 15 · real-strong 16 · have-each-others-backs 14 ·
  the-need-underneath 12. Seven typed play actions (branch ×16 · reflect ×16 · strike-rewrite ×15 · spot ×12 ·
  sort ×12 · role-play ×7 · match ×6), **0% binary**, led by strike-rewrite + spot + branch. **THE ONE RULE:
  never shame the boy**. The funnel & grift are the target; boys pulled in are lonely/anxious/seeking identity.
  Media-literacy-led, evenhanded (manosphere harms boys), positive masculinity (real strength lifts people; strong
  AND kind; confidence built not bought). Never platforms real influencers. Routes loneliness → Tele-MANAS 14416 +
  trusted adult; harassment → 1930 / Childline 1098. Builds on g25/g26.
- **gameId trap:** library/GDD aspirational `the-rabbit-hole` vs registry `rabbit-hole`: config uses
  `rabbit-hole`. **Engine:** no new mechanic; `binStyle` added `grift`→red + `real strength`/`genuine`→green
  (emulated all 12 bins, no mis-color). Spot ids injected (12); no builds. reassureCats = [the-need-underneath]
  + reassure + Tele-MANAS helpLine. Wrapper `RabbitHoleGame` kept. Read-first (GDD 43 + full library incl. all
  the-need-underneath + real-strong scenarios verbatim); `--attest g43`; gate validated; tsc/lint/build green.
  `feat/g43-rabbithole-v2` → `--no-ff` merged (`b8a910b` → merge). **Chapter 4 games are all v2** (g21-g28, g39,
  g40, g43). Next: g28 Reality Check, then capstone c4.

## 2026-06-23 · #g40 Firewall built to GDD 40 v2 (teen online safety; the sextortion plan; never victim-blaming)
- **[Firewall](../games/firewall.md) (#g40, gameId `firewall`, Ch.4, Thread B)**: the teen online-safety node
  (high-stakes safeguarding, calm not fear-mongering), reworked onto the **shared v2 engine** as an
  **84-scenario typed library**: spot-grooming 15 · think-before-share 14 · sextortion-plan 17 · myths-busted 12
  · lock-it-down 13 · find-help-no-blame 13. Seven typed play actions (branch ×22 · strike-rewrite ×14 · spot
  ×12 · sort ×12 · role-play ×9 · reflect ×9 · match ×6), **0% binary**, led by the safe-move chooser + spot +
  role-play. The signature **sextortion plan** (don't panic / don't pay / don't send more / NOT your fault /
  save evidence / tell / report). Non-explicit, never victim-blaming, POCSO/IT-Act protected-victim ("you won't
  be in trouble"); routes cybercrime.gov.in / 1930 / Childline 1098. Builds on g15; prereq g27.
- `gameId "firewall"` matches the registry. **Engine:** no new mechanic; `binStyle` added
  `\bsafe\b`/`green flag`/`the truth`→green and `red flag`/`a trap`/`grows your risk`/`leaves you exposed`→red,
  plus a **safe-negation guard** (`not a red flag`/`not a trap`→green checked BEFORE NEG, so GLRL gl-043's milder
  "not a red flag" side isn't wrongly reddened). Emulated all 12 g40 bins + a full cross-game regression, clean.
  Spot ids injected (12); no builds. reassureCats = [spot-grooming, sextortion-plan, find-help-no-blame] +
  reassure + 1930/1098 helpLine. Wrapper `FirewallGame` kept. Read-first (GDD 40 + full library incl. all
  sextortion + find-help scenarios verbatim); `--attest g40`; gate validated; tsc/lint/build green.
  `feat/g40-firewall-v2` → `--no-ff` merged (`bd04a92` → merge). Next: g43 The Rabbit Hole.

## 2026-06-23 · #g27 Stand Up built to GDD 27 v2 (teen bystander → upstander; the 5 Ds; safety-first)
- **[Stand Up](../games/stand-up.md) (#g27, gameId `stand-up`, Ch.4, Thread B)**: the teen bystander-to-upstander
  node and the gender thread's call to action on GBV & harassment, reworked off the old 5-mode build onto the
  **shared v2 engine** as an **84-scenario typed library** (`content/games/stand-up.ts`): gbv-and-rights 15 ·
  spot-harassment 12 · safety-first 11 · five-ds 16 · after-support 13 · be-the-upstander 17. Seven typed play
  actions (branch ×22 · reflect ×14 · strike-rewrite ×12 · role-play ×11 · sort ×10 · spot ×10 · match ×5),
  **0% binary**, led by the **five-moves chooser (the same 5 Ds engine as Speak Up g19)** + role-play + spot.
  Safety-first / non-graphic: never confront danger alone; target never to blame (freezing normal; "it wasn't
  your fault"; "I believe you"); survivor-centred; routes to a trusted adult, Women Helpline 181, ERSS 112,
  Childline 1098. Builds on g19; prereq g26.
- `gameId "stand-up"` matches the registry (no trap). **Engine:** no new mechanic; `binStyle` added
  `harassment`→red + `escalates`→red (harassment / safe-vs-risky / safety-first bins now correct; emulated all
  10, no mis-color). Spot ids injected (10); no builds. reassureCats = [gbv-and-rights, spot-harassment,
  safety-first, after-support] + reassure + 181/112/1098 helpLine. Wrapper `StandUpGame` kept. Read-first (GDD 27
  + full library incl. all safety-first + after-support scenarios verbatim); `--attest g27`; pre-commit gate
  validated; tsc/lint/build green. `feat/g27-standup-v2` → `--no-ff` merged (`6490cd5` → merge). Next: g40
  Firewall.

## 2026-06-23 · #g26 Equalize built to GDD 26 v2 (balancing-sim; equality pays off; child marriage as a rights issue)
- **[Equalize](../games/equalize.md) (#g26, gameId `equalize`, Ch.4)**: the gender-equality balancing-sim node
  (Thread E, ages 12-15), reworked off the old balancing-sim onto the **shared v2 engine** as an **84-scenario
  typed library** (`content/games/equalize.ts`, faithful from GDD 26 JSON): belief-vs-practice 14 · unpaid-load
  13 · pay-and-power 12 · pays-off 16 · child-marriage 16 · rebalance-it 13. Seven typed play actions (branch
  ×23 · strike-rewrite ×17 · sort ×15 · reflect ×12 · match ×6 · role-play ×6 · build ×5), **0% binary**, led by
  branch + strike-rewrite + sort. Belief-vs-lived equality, the unpaid-care load, pay & power, equality-is-not-
  zero-sum (lifts everyone incl. boys), rebalance home/school. **Child marriage = a RIGHTS issue:** respectful,
  non-graphic, legally accurate (illegal/18 in India), never-blame-the-target, evenhanded (harms boys too),
  routes at-risk to a trusted adult / Childline 1098. Builds on g10; prereq g25.
- `gameId "equalize"` matches the registry (no trap). **Engine:** no new mechanic; `binStyle` unchanged
  (existing regexes handle the valenced bins; the rest are acceptable neutral two-category distinctions,
  emulated all 15, no mis-color). Build modes assemble+sequence (keys==pieces) → buildLabels; `reassureCats`
  ["child-marriage"] + reassure + Childline helpLine. Wrapper `EqualizeGame` kept. Read-first (GDD 26 + full
  library incl. all child-marriage scenarios verbatim); `--attest g26`; pre-commit gate validated;
  tsc/lint/build green. `feat/g26-equalize-v2` → `--no-ff` merged (`f1dac3c` → merge). Next: g27 Stand Up.

## 2026-06-23 · #g25 MythBuster: Gender built to GDD 25 v2 (gender myths · pseudo-science inoculation)
- **[MythBuster: Gender](../games/mythbuster-gender.md) (#g25, gameId `mythbuster-lab`, Ch.4)**: the
  gender-myth-busting node (Thread E, ages 12-15) and a flagship of the strike-and-rewrite signature, reworked
  off the old 5-mode build onto the **shared v2 engine** as a **90-scenario typed library**
  (`content/games/mythbuster-lab.ts`, faithful from GDD 25 JSON): ability-myths 18 · role-myths 15 ·
  emotion-leadership 14 · its-just-science 14 · equality-myths 15 · spot-and-flip 14. Seven typed play actions
  (strike-rewrite ×31 · sort ×15 · reflect ×12 · branch ×11 · match ×7 · role-play ×7 · spot ×7), **0% binary**,
  led by strike-rewrite + sort + spot. Evidence-based, EVENHANDED, never anti-boy (equality helps everyone incl
  boys; boys' struggles validated). Pseudo-science inoculation (naturalistic fallacy, averages≠individuals,
  cherry-picking). India-grounded. Builds on g18; prereq g24.
- **gameId trap:** library/GDD aspirational `mythbuster-gender` vs engine-host registry `mythbuster-lab`: config
  uses `mythbuster-lab`. **Engine:** no new mechanic; notable `binStyle` fix: **removed `doesn` from NEG** (was
  red-tinting g25's truth bin "Doesn't"; 8 other-game "Doesn't…" bins degrade gracefully, good side green, bad
  side neutral); added `pseudo`→red + `honest`→green; emulated all 15 g25 bins + regression clean. Spot ids
  injected (7); no builds. Wrapper `MythBusterGame` kept. Read-first (GDD 25 + full library incl. pseudo-science
  + equality scenarios); `--attest g25`; pre-commit gate validated; tsc/lint/build green. `feat/g25-mythbuster-v2`
  → `--no-ff` merged (`34d1d9f` → merge). Next: g26 Equalize.

## 2026-06-23 · Toolkit/engine/splash fixes (freeze world under toolkit, fill strike cards, splash creep)
- **Freeze the path world under the toolkit:** the drawer sets a `data-overlay` flag; path-scene's
  wheel/pointer handlers bail on it (the world was scrolling behind the open toolkit). Toolkit sheet now floats
  with a real gap above the bottom edge (was flush). **Help Map tool:** removed the duplicated helpline numbers
  (they live in the toolkit's "Get help" now). **strike-rewrite:** BOTH cards fill the screen: myth card flex-1
  + a UnReBeat `fill` mode, so neither shrinks between play and resolve. **Splash bar:** drei reports 0% until
  assets jump (cached loads emit no events) so it looked frozen; added a synthetic 8→92% creep that real
  progress overrides and snaps to 100. `feat/ui-batch-4` → `--no-ff` merged (`7364eef` → merge); tsc + build
  green; changed files lint-clean (path-scene has pre-existing lint debt, untouched).

## 2026-06-23 · Engine + Toolkit UI round (MCQ rows, pinned Next, flower/candle breathing, Get Help folded into Toolkit)
- **Engine (v2-engine):** reflect/MCQ options one per row; Next/Finish pinned to the bottom row (was floating);
  strike-rewrite "unlearn" card tall but BOUNDED (min-h-56, no flex-1 → no dramatic shrink on resolve); progress
  emojis lose the golden fill.
- **Toolkit:** the Toolkit trigger moved from a bottom-left floating pill to the **top toolbar** (top-right;
  icon-only on mobile) and is now always shown. **Get Help is folded into the Toolkit**: the standalone
  top-corner Get-Help pill is retired; the toolkit sheet always offers "Get help" (real helplines) + Breathing
  space, so help is one tap away even before a tool unlocks (no safety regression). The tool player + breathing
  use the in-game light app-bg backdrop (was a dark overlay). Sheet gets bottom padding (+ safe-area).
- **Breathing space redesigned** to the kid-friendly metaphor: **Smell the flowers 🌸 (in) → Blow the candle 🕯️
  (out)**, replacing the air-bubble/box-breathing visual.
- **Unlearn dock:** the "Hide notes" toggle is desktop-only now (hidden on mobile). Fixed a long-standing eslint
  false-positive (aliased the store's `useTool`). Two branches (`feat/ui-batch-3`, `feat/toolkit-toolbar`)
  `--no-ff` merged; tsc + lint + build green.

## 2026-06-23 · Engine: big sort zones, fresher rotation, layout tweaks
- **Sort dropzones**: 2-bin sorts now stack as **big top & bottom zones** (Reigns-style) with the chips
  between them; each zone is full-width and grows (flex-1). Drag up/down or tap. (>2 bins keep the grid.)
- **strike-rewrite "unlearn" card** grows tall (flex-1, min-h-48, bigger text), like the swipe card.
- **Home**: "Play with Lensy" CTA moved to the bottom; the topic grid is the browse area above.
- **Rotation freshness (fixes "the same sort repeats too often")**: beats are now drawn by **shuffle**
  (natural frequency), not by forcing mechanic variety. Forcing variety in a mechanic-skewed category
  (GLRL's swipe-heavy `flags` = 20 swipes but only 4 sorts) injected those rare sorts into nearly every
  session, so the same sort kept recurring. The library isn't shallow: the rotation was over-surfacing rare
  beats. `feat/sort-bigzones-rotation` → `--no-ff` merged (`767bc54` → merge); tsc + lint + build green.

## 2026-06-23 · Engine: pin the bottom row + strip chrome (co-play · home help pill · calm toggle)
- **Bottom row now pins to the edge**: the fill layout uses a column flex (GameShell) and the game column is
  `flex-1` (the prior `h-full` resolved against an auto-height parent and collapsed to content height, so the
  footer floated up). Removed: the in-game **Calm-Mode sparkle** (duplicated app Settings; OS reduce-motion is
  auto-honoured), the home **co-play toggle** (+ banner/state/COPLAY map), and the duplicate **home Get-Help
  pill** (the top-bar help icon covers it; the pill still surfaces on safety-beat resolves). Calmer home, stable
  frame. `feat/declutter-2` → `--no-ff` merged (`a4baca9` → merge); tsc + lint + build green.

## 2026-06-23 · Engine: stable three-zone game layout (stop the "dancing")
- Content was vertically centred, so each beat's different height made the screen jump. Replaced with a
  full-height **top-anchored** layout (GameShell gains `align="fill"`): **top** zone pinned under the bar
  (progress strip + Lensy bubble), a **flexible middle** holding the mechanic (only it reflows), and a **bottom**
  row glued to the screen edge (beat counter + Home, until content scrolls). Swipe card taller (min-h-72), sort
  dropzones taller (min-h-32). Other games keep the centred layout (`align` default). `feat/engine-stable-layout`
  → `--no-ff` merged (`23f9634` → merge); tsc + lint + build green.

## 2026-06-23 · Engine: declutter (one border per card · no redundant messaging · hide path · mixed swipe answers)
- **Shared chrome + GLRL**, on-device feedback. **One border per element**: the `.glass-card` already has a
  heavy border, so highlights stopped adding a second: **hook card removed** (the chat bubble already says the
  hook; a separate card just repeated it, which fixes "redundant messaging" in swipe AND sort); **swipe card recolours
  its existing offset shadow** (no inset ring); **sort dropzones → single dashed border + translucent tint fill**;
  **earned dots → single fill**; **earned home tiles → corner ✅** (no inset gold ring). Bubble shadow removed.
  Only one progress counter (per-mechanic "X/Y" dropped; beat counter stays). **Path/scene hidden behind a game**
  (opaque app-bg layer in GameShell). **GLRL:** merged `green-flags` + `red-flags` → one mixed **`flags`
  ("Green or red?")** category so each swipe is a real judgment (separate tiles telegraphed the answer); home now
  5 tiles. `feat/engine-declutter` → `--no-ff` merged (`f209965` → merge); tsc + lint + build green; status OK.

## 2026-06-23 · Engine: shared chrome polish (chat bubble · top progress strip · tertiary Home · stronger swipe highlight)
- **[Shared chrome](../games/swipeed-interaction-model.md#shared-chrome-the-frame-around-every-mechanic)** (one
  place, every game), from on-device review: **Lensy → chat bubble** (soft mist fill + tail toward Sam,
  content-width, not a card); **progress → a compact dot strip at the very top** (was a big card between the
  message and the content, eating space; per-beat "1/3" stays small below); **Home → a quiet tertiary text
  button** (not a card); **swipe red/green highlight much clearer**: the card fills with the side's colour
  (wash + thicker ring + glow), a large watermark flag appears, and the badge is bigger. `feat/engine-chrome-polish`
  → `--no-ff` merged (`cd6e414` → merge); tsc + lint + build green.

## 2026-06-23 · Engine: breathable swipe layout (drop the redundant hook card + static side columns)
- **[swipe](../games/swipeed-interaction-model.md)**: on-device feedback: the screen repeated "Swipe: green flag
  or red?" three times (Sam's bubble, a hook card, the hint) and static Red/Green flag columns ate the width.
  Now the **hook card is skipped for swipe** (Sam + the slim hint cover the instruction, and Sam now **speaks
  the cue**, which it never did), the **cue card is the full-width hero** (min-h-52, bigger text), and the
  red/green signal **lives in the gesture** (card tints toward the side + an edge badge fades in only while
  dragging; a slim "👈 left · ← → keys · right 👉" hint at rest). No static side columns. Keyboard / a11y /
  no-fail unchanged; reduced-motion → instant. `feat/swipe-breathable` → `--no-ff` merged (`4d5a412` → merge);
  tsc + lint + build green.

## 2026-06-23 · Engine: explore-label gesture (interaction model complete, all 10 mechanics)
- **[explore-label](../games/swipeed-interaction-model.md)**: the last mechanic still on a flat tap list,
  upgraded. Split by payload, **content-detected (no schema change)**: ANATOMY beats (every part maps to a body
  region) render a friendly body figure and you tap the part ON the body (lights up where it lives), the real
  "find the part" discovery verb; ABSTRACT beats (concept answers, such as melanin, "your body heals itself") become
  honest "which is true?" cards with distinct neutral icons. Of g06 Body Lab Juniors' 12 explore-label
  scenarios: 7 anatomy → body figure, 5 abstract → cards. Decorative SVG is `aria-hidden`; the regions are real
  labelled `<button>`s (AT-operable). **This completes the direct-manipulation interaction model: all 10 v2
  mechanics now embody their verb.** `feat/explore-label-gesture` → `--no-ff` merged (`9dd4695` → merge); tsc +
  lint + build green; no content/schema changes. Pattern #27 + the interaction-model spec updated.

## 2026-06-23 · Engine: direct-manipulation interaction model (real gestures across the v2 mechanics)
- **[The Interaction Model](../games/swipeed-interaction-model.md) (NEW doc) + [pattern #27](../games/swipeed-game-patterns.md).**
  Replaced the v2 engine's "tap a thing, tap another thing" input with **direct manipulation**, on shared
  primitives built once (`components/games/interactions.tsx`: `usePointerDrag` mouse+touch+pen with an 8px
  tap-fallback threshold, `hitTestZone`, `ConnectorOverlay`). Triggered by noticing the `swipe` mechanic was a
  spec violation (two `onClick` buttons whose aria-label lied "Swipe").
- **Mechanics:** swipe → real drag L/R + ←/→ keys, **no buttons** (per product decision); sort → drag chip into
  bin; match → draw a cord plug→socket (shared ①②③ end-token, relabels both columns); build → drag onto the
  slate; strike-rewrite → scrub the (now visible) myth away; role-play → equal shuffled speech cards; branch →
  shuffled options; spot → flag plants on the catch (was pre-stamped on every card); reflect → echoes the chosen
  feeling. **The native-button tap path is kept as the keyboard / screen-reader / ages-3-6 floor** on every
  gesture mechanic except swipe (the gesture is additive).
- **A11y:** the Sam bubble is now `aria-live` (every `say()` reaches SR/deaf/TTS-muted users, engine-wide, one
  place); pinch-zoom restored (WCAG 1.4.4/1.4.10); reduced-motion → instant; gestures scope `touch-action` so
  page scroll/zoom coexist. **Bugs fixed:** build always-wins (15 distractor scenarios) + min(3) truncation
  (100+ scenarios), branch never-shuffled, role-play double-buzz, spot pre-stamped flag, strike acting on
  nothing, match never relabelling the right column.
- Built from a 14-agent audit (per-mechanic analyses → synthesis → adversarial critiques: a11y / ages-3-6 /
  mobile touch). One cohesive branch over the shared engine; **no content or scenario-schema changes**; tsc +
  lint + build green. `feat/interaction-model-v2` → `--no-ff` merged (`21b047b` → merge). **Pending:**
  `explore-label` gesture (needs a schema change + a body SVG) and real-device gesture QA after deploy.

## 2026-06-23 · #g24 Green Light / Red Light built to GDD 24 v2: teen flagship; adds the 10th mechanic (swipe)
- **[Green Light / Red Light](../games/green-light-red-light.md) (#g24, gameId `glrl`, Ch.4)**: the **teen
  flagship** and namesake swipe game (relationships & consent, ages 12-15), reworked onto the **shared v2 engine**
  as an **84-scenario typed library** (`content/games/glrl.ts`, faithful from GDD 24 JSON): what-is-consent 14 ·
  green-flags 14 · red-flags 16 · read-any 15 · say-and-hear 14 · when-wrong 11. **Added the 10th v2 mechanic,
  `swipe`** (×28, the green/red flag-reading verb), plus branch ×13 · strike-rewrite ×12 · role-play ×12 ·
  sort ×9 · reflect ×8 · spot ×2. FRIES consent model; One Love green/red flags across friendships, family,
  romantic. Safeguarding: a crossed line is never your fault; coercion → trusted adult / Childline 1098/112;
  leaving = strength. School-comfort, non-explicit. GATED at path layer. Builds on g15; prereq g23.
- **Engine change (a new reusable mechanic, [pattern #26](../games/swipeed-game-patterns.md) updated):** added
  `SwipeScenario` (`cue`/`left`/`right`/`answer`) to `v2-schema.ts` + a `SwipePlay` renderer to `v2-engine.tsx`
  (two directional flag buttons, colour + emoji + label so colour is never the only signal; wrong swipe = warm
  nudge, no fail; relearn on resolve); `MECH`/`COPLAY` maps extended. **gameId trap:** library aspirational
  `green-light-red-light` vs registry `glrl`: config uses `glrl`. `binStyle`: consent + healthier valenced;
  flag-reading sort bins neutral (swipe colours flags via `flagSide`). Spot ids injected (2). Wrapper `GlrlGame`
  kept. Read-first (GDD 24 + full library incl. FRIES + all safeguarding scenarios); `--attest g24`; gate
  validated; tsc/lint/build green. `feat/g24-glrl-v2` → `--no-ff` merged (`dbd8f60` → merge). Next: g25
  MythBuster: Gender.

## 2026-06-23 · #g23 Outbreak: Stop the Spread built to GDD 23 v2 (STIs · public health · anti-stigma)
- **[Outbreak: Stop the Spread](../games/outbreak.md) (#g23, gameId `outbreak`, Ch.4)**: the STI + HIV public-health
  + anti-stigma node (Thread F · SRH, ages 12-15), reworked off the old containment-sim build onto the **shared
  v2 engine** as an **84-scenario typed library** (`content/games/outbreak.ts`, faithful from GDD 23 JSON):
  how-stis-spread 14 · silent-part 12 · stop-the-spread 16 · test-and-treat 14 · bust-myths 14 · end-stigma 14.
  Seven typed play actions (branch ×18 · strike-rewrite ×18 · sort ×16 · reflect ×14 · match ×7 · role-play ×6 ·
  build ×5), **0% binary**, led by branch + strike-rewrite + sort. How STIs spread (and don't) → silent part →
  toolkit (waiting/condoms/vaccines incl. HPV free for 14-yr-old girls in India/testing/treatment) → test & treat
  → bust myths → **end the stigma** (the real enemy is the infection + stigma, never the person; all STIs
  treatable, most curable). School-comfort, NON-EXPLICIT; clinic/doctor routing. GATED at path layer. Builds on
  g20; prereq g22.
- **gameId trap:** library/GDD aspirational id `outbreak-stop-the-spread` vs engine-host registry id `outbreak`:
  config uses `outbreak`. **Engine:** no new mechanic; the `binStyle` anti-stigma guardrail holds: every STI
  transmission-fact bin (can-spread/does-not, real-route/safe-everyday, worth-protecting/no-risk, "spreads it")
  stays **neutral**; only myth/false, reliability, and stigma-behavior (reduces/spreads stigma, kind/stigmatising)
  valenced; emulated all 16 g23 bins + a g20 regression (all transmission bins still neutral). No spots;
  `buildLabels` for assemble + sequence. Wrapper `OutbreakGame` kept. Read-first (GDD 23 + full library incl. all
  end-stigma scenarios); `--attest g23`; pre-commit gate validated; tsc/lint/build green. `feat/g23-outbreak-v2`
  → `--no-ff` merged (`40afdfe` → merge). Next: g24 Green Light / Red Light (the #24 swipe roguelike).

## 2026-06-23 · #g22 Plan It built to GDD 22 v2 (fertility · pregnancy · contraception; school-comfort)
- **[Plan It](../games/plan-it.md) (#g22, gameId `plan-it`, Ch.4)**: the fertility + pregnancy + contraception
  node (Thread F · SRH, ages 12-15), reworked off the old life-sim build onto the **shared v2 engine** as an
  **85-scenario typed library** (`content/games/plan-it.ts`, faithful from GDD 22 JSON): how-it-happens 13 ·
  bust-myths 15 · ways-to-prevent 14 · delaying-valid 15 · plan-future 12 · facts-help 16. Seven typed play
  actions (strike-rewrite ×21 · sort ×16 · reflect ×15 · branch ×11 · role-play ×9 · build ×7 · match ×6),
  **0% binary**, led by strike-rewrite + sort + branch. School-comfort: matter-of-fact, NON-EXPLICIT, values-first.
  Plain biology → bust dangerous myths (first time, withdrawal, douching, 'safe days', orgasm) → prevention
  overview (abstinence fully reliable & respected; condoms; ask a doctor) → **delaying is fully valid** → plan →
  facts from a doctor/trusted adult. GATED at the path layer (age band), untouched by the swap. Builds on g14;
  prereq g39.
- registry id matches (no trap). **Engine:** no new mechanic; notable `binStyle` fix: **removed `not needed`
  from the NEG set**, which was wrongly red-tinting pl-003's neutral factual bin (sorting "an orgasm by the girl"
  into "Not needed" for pregnancy) and Clean Crew's equally-neutral "Not needed" ("don't need to wash while
  sleeping"); both now correctly neutral (a strict, cross-game improvement). Added unreliable/made-up/rumour for
  the fact-vs-rumour sorts; emulated all 16 g22 bins + a clean-crew regression (improved). No spots; `buildLabels`
  for assemble + sequence. Wrapper `PlanItGame` kept. Read-first (GDD 22 + full library incl. delaying-valid +
  myth-busting verbatim); `--attest g22`; pre-commit gate validated; tsc/lint/build green. `feat/g22-plan-it-v2`
  → `--no-ff` merged (`7faf1f8` → merge). Next: g23 Outbreak: Stop the Spread (STIs · anti-stigma).

## 2026-06-23 · #g39 Bounce built to GDD 39 v2 (resilience · stress · teen mental health)
- **[Bounce](../games/bounce.md) (#g39, gameId `bounce`, Ch.4)**: the resilience + stress + teen-mental-health
  node (Thread C, ages 12-15), reworked off the old 5-mode (UN & RE) build onto the **shared v2 engine** as an
  **84-scenario typed library** (`content/games/bounce.ts`, faithful from GDD 39 JSON): what-resilience 12 ·
  reframe-setback 14 · bounce-toolkit 12 · exam-pressure 13 · support-friend 16 · reach-out 17. Seven typed play
  actions (branch ×19 · strike-rewrite ×17 · reflect ×14 · sort ×13 · role-play ×12 · build ×5 · match ×4),
  **0% binary**, led by branch + strike-rewrite + role-play. Real resilience (not toxic positivity / tough-it-out);
  reframe → toolkit → exam pressure → support a friend → reach out. Wellbeing-safe (crisis-routing first, never
  therapy): dark thoughts + lasting distress route firmly to a trusted adult, Tele-MANAS 14416, Childline
  1098/112. Builds on g38; prereq g21.
- registry id matches (no trap). **Engine:** no new mechanic; `binStyle` valences resilience/toxic, helps/harms,
  real-coping/avoidant, builds/chips, while the crisis distinction (reach-out-now / ordinary), the control
  dichotomy and growth/fixed mindset stay **neutral**. The new `avoidant` token verified to NOT match g20's
  anti-stigma "Avoid (blood risk)" (regression-checked). No spots (no id injection); `buildLabels` for
  assemble + sequence. Wrapper `BounceGame` kept. Read-first (GDD 39 + full library incl. all crisis scenarios);
  `--attest g39`; pre-commit gate validated; tsc/lint/build green. `feat/g39-bounce-v2` → `--no-ff` merged
  (`7b98361` → merge). Next: g22 Plan It (SRH life-sim).

## 2026-06-23 · #g21 Body Confident built to GDD 21 v2 (body image · media literacy): opens Chapter 4
- **[Body Confident](../games/body-confident.md) (#g21, gameId `body-confident`, Ch.4)**: the puberty-depth +
  body-image + media-literacy node (Thread A) and the game that **opens Chapter 4** (ages 12-15), reworked off
  the old 5-mode (Fact-or-Filter) build onto the **shared v2 engine** as an **84-scenario typed library**
  (`content/games/body-confident.ts`, faithful from GDD 21 JSON): changing-body 14 · real-vs-filtered 13 ·
  worth-not-looks 14 · beauty-myths 16 · care-not-fix 12 · when-heavy 15. Seven typed play actions
  (strike-rewrite ×23 · reflect ×14 · sort ×13 · spot ×12 · branch ×9 · role-play ×7 · build ×6), **0% binary**,
  led by strike-rewrite (bust the beauty myth) + spot (Fact-or-Filter) + sort. Body-NEUTRAL (worth untied from
  looks; never diet/ideal-body framing) + media literacy; names India's colourism/fair-skin pressure as a harmful
  false standard; gender-inclusive. Wellbeing-safe: body distress / disordered-eating signs route to a trusted
  adult, counsellor or doctor + Childline 1098. Builds on g13; prereq c3.
- registry id matches (no trap). **Engine:** no new mechanic (reuses 7 of 9); `binStyle` valence accretion
  (care/fix, kind/pressuring, trusted/not-reliable, healthy/harmful) while **real/filtered** and
  **reach-out/ordinary-off-day** stay **neutral** (media-literacy + distress distinctions not moralised; emulated
  all 13 sort bins + a repo-wide regression check clean). Generator injects spot scene-item ids; `buildLabels`
  set for assemble + sequence. Wrapper `BodyConfidentGame` kept. Read-first (GDD 21 + full library incl. all
  when-heavy + colourism scenarios verbatim); `--attest g21`; pre-commit gate validated; tsc/lint/build green.
  `feat/g21-body-confident-v2` → `--no-ff` merged (`0505a81` → merge). Next: g39 Bounce (resilience).

## 2026-06-23 · #c3 Capstone Growing Up Smart reworked to rich format v1: Chapter 3 graduation complete
- **[Capstone: Growing Up Smart](../games/capstones.md#capstone-3-growing-up-smart-built) (#c3, gameId
  `capstone-3`, Ch.3)**: reworked off the old eight-star tap build onto the **shared rich capstone engine**
  (`components/games/capstone-rich.tsx`), following the c1 reference. `capstone-3.ts` is now a typed
  `CapstoneConfig` generated faithfully from the c3 Landing JSON; `capstone-3.tsx` a thin `RichCapstone` wrapper.
  Closes Chapter 3 (#g13-g20): arrive → look back (the nine-sticker **Growing-Up constellation** gallery) → ten
  victory laps, each a chapter truth re-cued through a **different** mechanic (gallery · match · swipe · sort ×3 ·
  branch · spot · build, the variable-cue boost) → four reflects → certificate. No score, no fail.
- **New reusable capstone capability:** `CapBranchLap` + a `BranchLap` renderer, the **decision-game victory
  lap** ("you know your move now", pick the values-led option, no buzzer), since c3 is the first capstone whose
  chapter has a branching-dilemma flagship ([Crossroads](../games/crossroads.md) g16). Added the ten Chapter-3 glyph
  emojis to `GLYPH_EMOJI` (all distinct within the chapter). gameId `capstone-3` (Landing's `capstone-ch3` is
  design-doc only). Capstones carry no scenario library → no read-first attestation (matching c1/c2). tsc/lint/
  build green. `feat/c3-growing-up-smart-rich` → `--no-ff` merged (`fae107d` → merge). **Chapters 1-3 capstones
  are all rich now; Chapter 3 fully complete.** Next: Chapter 4 (#g21 Body Confident, ages 12-15).

## 2026-06-23 · #g20 Defenders of the Body built to GDD 20 v2 (immune system · HIV anti-stigma): Chapter 3 complete
- **[Defenders of the Body](../games/defenders-of-the-body.md) (#g20, gameId `defenders`, Ch.3)**: the
  immune-system + infection-myth-busting + HIV anti-stigma node (Thread F · SRH) and the **last Chapter 3
  game**, reworked off the old tower-defence build onto the **shared v2 engine** as an **84-scenario typed
  library** (`content/games/defenders.ts`, faithful from GDD 20 JSON): your-defenders 12 · how-germs-spread 12 ·
  defend-yourself 12 · HIV-basics 12 · spreads-or-not 18 · kindness-not-fear 18. Seven typed play actions
  (strike-rewrite ×22 · sort ×16 · branch ×12 · reflect ×10 · spot ×9 · role-play ×8 · match ×7), **0% binary**,
  led by strike-rewrite (myth-bust) + sort (true/false & spreads-or-not). Arc: defenders → germs → defend →
  HIV-simply → spreads-or-not → **kindness, not fear**. HIV taught age-right (facts + anti-stigma only; sexual
  transmission waits for Outbreak g23): a virus anyone can have, never a punishment; treatment = long healthy
  lives; health is private; people living with HIV belong fully. Builds on g12; prereq g19.
- **gameId trap:** library/GDD aspirational id `defenders-of-the-body` vs engine-host registry id `defenders`:
  config uses `defenders`. **Engine:** no new mechanic (reuses 7 of 9); `binStyle` valence accretion limited to
  **defence-quality / true-false / fact-myth**: every **HIV transmission-fact bin (can/cannot spread,
  how/not-how) stays NEUTRAL** and risk sides never red (anti-stigma guardrail; emulated all 16 sort bins to
  confirm). Generator injects spot scene-item ids. Wrapper `DefendersGame` kept (replaces tower-defence import).
  Read-first (GDD 20 + full library incl. all HIV + stigma scenarios verbatim); `--attest g20`; pre-commit gate
  validated; tsc/lint/build green. `feat/g20-defenders-v2` → `--no-ff` merged (`a16da3c` → merge).
  **Chapter 3 games (#g13-g20) are all v2.** Next: capstone c3 (rich-format rework) closes the chapter, then
  Chapter 4 (#g21 Body Confident on).

## 2026-06-23 · #g19 Speak Up built to GDD 19 v2 (bystander → upstander; the 5 Ds)
- **[Speak Up](../games/speak-up.md) (#g19, gameId `speak-up`, Ch.3)**: the bystander-to-upstander node, reworked
  onto the **shared v2 engine** as an **85-scenario typed library** (`content/games/speak-up.ts`, faithful from
  GDD 19 JSON): name-the-harm 14 · why-speak-up 12 · five-moves 17 · find-the-words 12 · get-help 14 ·
  be-the-upstander 16. Seven typed play actions (branch ×25 · role-play ×14 · sort ×12 · spot ×10 · reflect ×10 ·
  strike-rewrite ×10 · match ×4; no build), **0% binary**, led by the **five-moves chooser** (the 5 Ds:
  say-something/distract/get-help/check-in/report), the reference branch engine g27 & g20 reuse. Name
  gender-based harm → why → moves → words → help → act. Safety-over-heroics; never-blame-the-target;
  telling-not-tattling; freezing-is-okay; Childline 1098/112. Builds on g11; prereq g18.
- registry id matches. **Engine:** no new mechanic (reuses 7 of 9); `binStyle` valence accretion
  (harm/silent-bystander → red, upstander/fun-for-all/just-fine → green), while five-moves categorizations and
  get-help-now/check-in-after stay neutral distinctions. Generator injects spot scene-item ids. Wrapper kept
  `SpeakUpGame`. Read-first (GDD 19 + full library); `--attest g19`; pre-commit gate validated; build/lint/tsc
  green. `feat/g19-speak-up-v2` → `--no-ff` merged (`42bbaae` → merge). Next: g20 Defenders of the Body (the
  last Chapter 3 game; then capstone c3).

## 2026-06-23 · #g18 Norm Storm built to GDD 18 v2 (social norms; help/harm sort; good-norm test)
- **[Norm Storm](../games/norm-storm.md) (#g18, gameId `norm-storm`, Ch.3)**: the social-norms node, reworked onto
  the **shared v2 engine** as an **84-scenario typed library** (`content/games/norm-storm.ts`, faithful from GDD
  18 JSON): what-is-a-norm 13 · helpful-norms 10 · harmful-norms 16 · where-from 12 · good-norm-test 14 ·
  question-change 19. Seven typed play actions (sort ×20 · strike-rewrite ×16 · branch ×13 · reflect ×12 ·
  role-play ×9 · spot ×9 · match ×5; no build), **0% binary**, led by the **help/harm sorting board** + the
  strike-rewrite flip. Understand → sort → test → change; the **good-norm test** (respects everyone / hurts no
  one / fair both ways) is the reusable lens g19 inherits. Question-with-respect; keep-the-good; heavy topics
  (dowry/son-preference/untouchability/period-stigma) framed as norms to question, never graphic;
  change-feels-possible. Builds on/prereq g17.
- registry id matches. **Engine:** no new mechanic (reuses 7 of 9); `binStyle` valence accretion
  (harms/disrespect/fails/ranks-a-group-higher → red, caring-reason/real-change/passes/treats-all-equally →
  green); norm/fact, written/unwritten, law/norm, limits-girls/boys stay neutral distinctions. Generator injects
  spot scene-item ids (library omitted them, same as g17). Wrapper kept `NormStormGame`. Read-first (GDD 18 +
  full library); `--attest g18`; pre-commit gate validated; build/lint/tsc green. `feat/g18-norm-storm-v2` →
  `--no-ff` merged (`1091532` → merge). Next: g19 Speak Up.

## 2026-06-23 · #g17 Flip the Script built to GDD 17 v2 (gender stereotypes; strike-rewrite flagship)
- **[Flip the Script](../games/flip-the-script.md) (#g17, gameId `flip-script`, Ch.3)**: the gender-stereotype node
  and the **strike-and-rewrite (UN/RE) flagship**, reworked onto the **shared v2 engine** as an **84-scenario
  typed library** (`content/games/flip-script.ts`, faithful from GDD 17 JSON): spot-it 16 · jobs-roles 14 ·
  feelings-strength 16 · looks-stuff 12 · flip-it 14 · call-it-out 12. Seven typed play actions (strike-rewrite
  ×29 · spot ×14 · reflect ×12 · branch ×10 · role-play ×9 · sort ×7 · match ×3; no build), **0% binary**, led by
  the **strike-and-rewrite card** + **spot-the-stereotype** frames, the reference flip+spot renderers the gender
  thread (g25/g26/g12/g18) reuses. Spot → flip → call-it-out; question-don't-preach; respectful of culture;
  no-one's-the-villain; all genders freed; safe to call out. Builds on g10; prereq g16.
- **gameId trap:** library `flip-the-script` (aspirational) vs registry `flip-script`: config uses `flip-script`.
  **Engine:** no new mechanic (reuses 7 of 9); `binStyle` valence accretion (stereotype/made-up-rule/repeats-it →
  red, anyone/real-reason → green); the cross-game "Breaks it" collision with g07 (opposite valence) resolves to a
  neutral pair via the binStyles distinctness fallback. **Build catch:** g17's library `spot` scenes omitted the
  inner item `id` the strict `SpotScenario` schema requires: `tsc` caught it; the generator now injects a/b/c
  ids (faithful normalization). Wrapper kept `FlipScriptGame`. Read-first (GDD 17 + full library); `--attest g17`;
  pre-commit gate validated; build/lint/tsc green. `feat/g17-flip-script-v2` → `--no-ff` merged (`25e602c` →
  merge). Next: g18 Norm Storm.

## 2026-06-23 · #g16 Crossroads built to GDD 16 v2 (decision-making; the branching-dilemma flagship)
- **[Crossroads](../games/crossroads.md) (#g16, gameId `crossroads`, Ch.3)**: the decision-making node and the
  **branching-dilemma flagship**, reworked onto the **shared v2 engine** as an **84-scenario typed library**
  (`content/games/crossroads.ts`, faithful from GDD 16 JSON): stop-think 13 · see-options 11 · weigh-consequences
  16 · decide-with-values 15 · friendship-crossroads 15 · own-your-choice 14. Seven typed play actions (branch
  ×29 · reflect ×26 · strike-rewrite ×10 · role-play ×7 · sort ×7 · build ×3 · match ×2), **0% binary**, led by
  the **branching dilemma card**, the **reference branch engine** later relationship/ethics nodes (g27 Stand Up,
  g31 Mutual, adult dilemmas) reuse. Teaches the routine: stop & think, see options, weigh consequences, decide
  by values, own it. Decide-don't-dictate; real autonomy (>1 defensible move); safe-to-be-wrong (change course);
  big/risky calls → trusted adult (links g15/g08, Childline 1098). Builds on g09; prereq g15.
- registry id matches. **Engine:** no new mechanic (reuses 7 of 9); `binStyle` valence accretion
  (long-loss/going-along/dodging/only-now/regret-later/rushes-you → red,
  real-option/good-long-term/owning-it/thinking-ahead/wise-choice → green). Wrapper kept `CrossroadsGame`.
  Read-first (GDD 16 + full library); `--attest g16`; pre-commit gate validated; build/lint/tsc green.
  `feat/g16-crossroads-v2` → `--no-ff` merged (`45fb1ad` → merge). Next: g17 Flip the Script.

## 2026-06-23 · #g15 Boundary Bot built to GDD 15 v2 (consent & boundaries; empower never frighten)
- **[Boundary Bot](../games/boundary-bot.md) (#g15, gameId `boundary-bot`, Ch.3)**: the consent-and-boundaries
  node (Thread B), reworked onto the **shared v2 engine** as an **85-scenario typed library**
  (`content/games/boundary-bot.ts`, faithful from GDD 15 JSON): my-boundaries 15 · consent-mutual 14 ·
  respect-others 13 · peer-pressure 15 · online-boundaries 16 · crossed-support 12. Seven typed play actions
  (branch ×23 · reflect ×19 · strike-rewrite ×17 · role-play ×12 · sort ×7 · spot ×4 · build ×3), **0% binary**,
  led by boundary/pressure dilemmas (branch), the **say-the-line** rehearsal (role-play), the **pressure-escape
  kit** (build), and **spot-the-red-flag** scenes (spot). Empower never frighten; consent both-ways (mutual);
  safe-to-be-wrong (crossed boundary never your fault, even if you froze); online red flags (photo-request)
  taught calmly; gender-inclusive consent (boys ask too); private/solo; routes to a trusted adult & Childline
  1098. Builds on g08 & g02; prereq g14; feeds Ch.4.
- registry id matches. **Engine:** no new mechanic (reuses 7 of 9); `binStyle` valence accretion
  (not-a-boundary/not-consent/crosses/not-helpful → red, good-move → green); share/private and
  my-boundary/not-mine stay neutral distinctions. Wrapper kept `BoundaryBotGame`. Read-first (GDD 15 + full
  library); `--attest g15`; pre-commit gate validated; build/lint/tsc green. `feat/g15-boundary-bot-v2` →
  `--no-ff` merged (`e4a975c` → merge). Next: g16 Crossroads.

## 2026-06-23 · #g14 The Amazing Journey built to GDD 14 v2 (reproduction; inclusive families)
- **[The Amazing Journey](../games/the-amazing-journey.md) (#g14, gameId `amazing-journey`, Ch.3)**: the
  reproduction node (Thread F · SRH), reworked onto the **shared v2 engine** as an **84-scenario typed library**
  (`content/games/amazing-journey.ts`, faithful from GDD 14 JSON): spark-of-life 16 · growing-a-baby 12 ·
  being-born 11 · many-ways 16 · myths-busted 15 · amazing-and-mine 14. Seven typed play actions (reflect ×28 ·
  strike-rewrite ×20 · branch ×10 · match ×8 · sort ×8 · build ×6 · role-play ×4), **0% binary**, led by
  awe+facts (reflect), myth-busts (strike-rewrite), and the **journey-builder** (build sequence). Accurate &
  inclusive (egg+sperm, uterus, both births; adoption/IVF/surrogacy all real & loved); private/solo; never
  graphic; scope-disciplined; busts the harmful "baby's sex is the mother's fault" myth (it's from the sperm).
  Builds on g06 & g13; prereq g38; family-diversity links g03.
- **gameId trap:** library `the-amazing-journey` (aspirational) vs registry `amazing-journey`: config uses
  `amazing-journey`. **Engine:** no new mechanic (reuses 7 of 9); `binStyle` valence accretion (not-real/muddled
  → red, really-needed/real-path/correct → green). Wrapper kept `AmazingJourneyGame`. Read-first (GDD 14 + full
  library); `--attest g14`; pre-commit gate validated; build/lint/tsc green. `feat/g14-amazing-journey-v2` →
  `--no-ff` merged (`9da933b` → merge). Next: g15 Boundary Bot.

## 2026-06-23 · #g38 Mind Matters built to GDD 38 v2 (mental wellbeing; coping chooser; Childline 1098)
- **[Mind Matters](../games/mind-matters.md) (#g38, gameId `mind-matters`, Ch.3)**: the mental-wellbeing game,
  reworked onto the **shared v2 engine** as an **84-scenario typed library** (`content/games/mind-matters.ts`,
  faithful from GDD 38 JSON): mind-matters-too 12 · stress-and-pressure 14 · handling-rejection 14 ·
  mind-care-toolkit 16 · ask-for-help 14 · be-kind-to-mind 14. Seven typed play actions (branch ×25 ·
  strike-rewrite ×16 · sort ×11 · reflect ×10 · role-play ×8 · build ×8 · match ×6), **0% binary**, led by the
  **coping chooser** (branch), **build-your-toolkit** (build), and de-stigmatising myth-flips. Wellbeing-safe:
  healthy coping only (no pain-based tricks); never diagnoses; no harsh self-talk; routes big/lasting distress +
  dark thoughts to a trusted adult & **Childline 1098/112**. Builds on g01; prereq g13; shares the coping-chooser
  / toolkit-builder with g39 (Bounce) & g41 (Heart Smart).
- registry id matches (no trap). **Engine:** no new mechanic (reuses 7 of 9); `binStyle` valence accretion
  (neglected/false/adds-stress/harsh/unhealthy/revs-up/hard-on-your-mind → red, cared-for-mind/eases-stress →
  green); stress-sign/not, normal/get-help and in-moment/longer-term stay neutral distinctions. Wrapper kept
  `MindMattersGame`. Read-first (GDD 38 + full library; Ch.3 personas read earlier this session); `--attest g38`;
  pre-commit gate validated; build/lint/tsc green. `feat/g38-mind-matters-v2` → `--no-ff` merged (`2352341` →
  merge). Next: g14 The Amazing Journey.

## 2026-06-23 · #g13 Puberty Quest built to GDD 13 v2 (opens Chapter 3; private/solo, taboo-busting)
- **[Puberty Quest](../games/puberty-quest.md) (#g13, gameId `puberty-quest`, Ch.3)**: the puberty node and the
  **first Chapter 3 node** (register: matter-of-fact, near-peer, **private/solo**), reworked onto the **shared
  v2 engine** as an **85-scenario typed library** (`content/games/puberty-quest.ts`, faithful from GDD 13 JSON):
  whats-puberty 15 · girls-changes 14 · boys-changes 12 · body-care-mood 13 · periods-no-shame 19 ·
  where-to-find-out 12. Seven typed play actions (strike-rewrite ×23 · reflect ×23 · branch ×20 · match ×6 ·
  sort ×5 · build ×4 · role-play ×4), **0% binary**, led by **myth-busts** (the densest taboo-busting set so
  far, 23 myths). Accurate & inclusive (girls AND boys; boys learn about periods); busts India's menstrual
  taboos with dignity; period poverty handled with care; private/solo; routes to trusted sources (Childline
  1098). Builds on g06; feeds g14 & g38.
- **Read-first incl. a new chapter:** read GDD 13 + **Chapter 3 personas** (Diya/Aarav/Priya/Lakshmi/Asha) +
  the full 85-scenario library; `--attest g13`. registry id matches (no trap). **Engine:** no new mechanic
  (reuses 7 of 9); `binStyle` valence accretion (unhelpful/harmful → red, reliable → green); normal-vs-not and
  normal-vs-reach-out stay neutral distinctions. Wrapper kept `PubertyQuestGame`. Pre-commit gate validated;
  build/lint/tsc green. `feat/g13-puberty-quest-v2` → `--no-ff` merged (`649665b` → merge). Next: g38 Mind Matters.

## 2026-06-23 · Capstones c1 & c2 reworked to the rich "Capstone format v1" (new shared engine)
- Built the richer chapter-graduation defined by GDD c1/c2: a five-beat, no-fail, no-score celebration:
  **arrive & bloom → look back** (sticker gallery) **→ play back** (one *victory lap* per chapter truth, each
  **re-cued through a different mechanic**: gallery · match · sort · build · spot · swipe, the variable-cue
  retrieval boost) **→ reflect** (non-judged) **→ celebrate** (certificate + graduation glyph) → preview &
  share. New shared engine `components/games/capstone-rich.tsx` + typed schema `content/games/capstone-schema.ts`
  (glyph→emoji map). Every lap is celebratory; a wrong tap is a gentle nudge, never a buzzer.
- **[c1 My First Friends](../games/capstones.md)** is the **reference** (Friendship-Garden bloom); **c2 Fair & Safe
  Explorer** follows it (explorer-map + golden compass). Each is a thin `Landing` config
  (`content/games/capstone-{1,2}.ts`, faithful from its `Landing.json`) + a thin wrapper; registry ids
  `capstone-1`/`capstone-2` kept (the Landing `capstone-chN` is design-doc only); exports
  CapstoneOneGame/CapstoneTwoGame unchanged (engine-host untouched). The old `capstone-engine.tsx` (simple star
  recap) still serves **c3-c6**, pending their rework.
- Capstones are a separate standard from the v2 mechanic-game rework (they're celebrations, not scenario games),
  so the read-first `--gate` correctly no-ops on them (not v2-schema content); `swipeed_status --check` passed.
  Build/lint/tsc green. `feat/capstones-rich-format` → `--no-ff` merged to equal-lens main (`7bb8b3c` → merge).
  Next: resume the game rework at Chapter 3 (g13 Puberty Quest).

## 2026-06-23 · #g12 Smart Screen Heroes built to GDD 12 v2 (media literacy; ALL Chapter 2 games now v2)
- **[Smart Screen Heroes](../games/smart-screen-heroes.md) (#g12, gameId `smart-screen`, Ch.2)**: the early
  media-literacy game (opens the Values, Rights & Media thread), reworked off the v1 mini-game set onto the
  **shared v2 engine** as an **84-scenario typed library** (`content/games/smart-screen.ts`, faithful from GDD
  12 JSON): real-or-pretend 14 · spot-the-ad 14 · is-it-true 14 · screen-choices 14 · screen-hygiene 12 ·
  caring-online 16. Seven typed play actions (branch ×24 · reflect ×19 · strike-rewrite ×16 · sort ×9 · spot ×7
  · role-play ×6 · build ×3), **0% binary**, led by smart-screen **dilemmas** (branch), the signature
  **spot-the-ad/spot-the-fake** scenes (spot) and the balanced-day/healthy-screen **builders** (build). Real vs
  pretend, ads & persuasion, checking what's true, balance, screen hygiene (self-care), kind & safe online. Not
  anti-tech; persuasion named; safety hand-off (Childline 1098, links Safety Squad). Builds on/prereq g11.
  **This completes all eight Chapter 2 games (g06-g12, g41) to v2**: only the c2 capstone remains in Ch.2.
- **gameId trap:** library `smart-screen-heroes` (aspirational) vs registry `smart-screen`: config uses
  `smart-screen`. **Engine:** no new mechanic (reuses 7 of 9); `binStyle` valence accretion
  (not-a-real-check/not-so-great/hard-on-me/pushy-trick → red, good-check/great-choice/good-for-me/trustworthy →
  green), while **real/pretend, ad/content & highlight/real-life stay neutral distinctions** (a deliberate
  sort-tinting call: media-literacy categorisations aren't good-vs-bad). Wrapper kept `SmartScreenGame`.
- Read-first: `swipeed_status` confirmed next = g12; read GDD 12 + the full 84-scenario library; `--attest g12`.
  Pre-commit gate validated; build/lint/tsc green. `feat/g12-smart-screen-v2` → `--no-ff` merged (`75cd1c1` →
  merge). Next: c2 Capstone: Fair & Safe Explorer (Ch.2), then Chapter 3 (g13 Puberty Quest).

## 2026-06-23 · #g11 Not Fair, Not Funny built to GDD 11 v2 (gender teasing & ally; impact over intent)
- **[Not Fair, Not Funny](../games/not-fair-not-funny.md) (#g11, gameId `not-funny`, Ch.2)**: the gender-teasing
  & ally game, reworked off the v1 5-mode game onto the **shared v2 engine** as an **84-scenario typed library**
  (`content/games/not-funny.ts`, faithful from GDD 11 JSON): fun-vs-mean 11 · just-a-joke 12 · gender-teasing 15
  · how-it-feels 11 · be-an-ally 22 · my-own-jokes 13. Eight typed play actions (branch ×24 · reflect ×22 ·
  strike-rewrite ×15 · role-play ×9 · sort ×7 · build ×3 · spot ×3 · match ×1), **0% binary**, led by teasing
  **dilemmas** (branch), say-the-**comeback**/ally lines (role-play) and the **ally-toolkit builder** (build).
  Teaches fun-vs-mean, "just a joke" doesn't erase harm (**impact over intent**), refusing gender put-downs,
  the **upstander moves** (speak up · distract · support · tell · check in), and checking your own jokes. Don't
  villainise the joker; protect the target (reassure on how-it-feels); reporting-not-tattling (Childline 1098).
  Builds on/prereq g10.
- **gameId trap:** library `not-fair-not-funny` (aspirational) vs registry `not-funny`: config uses `not-funny`.
  **Engine:** no new mechanic (reuses 8 of 9); `binStyle` valence accretion (mean-teasing/put-down/not-an-ally →
  red, fun-teasing/ally-move → green). Wrapper kept `NotFunnyGame`.
- Read-first: `swipeed_status` confirmed next = g11; read GDD 11 + the full 84-scenario library; `--attest g11`.
  Pre-commit gate validated; build/lint/tsc green. `feat/g11-not-funny-v2` → `--no-ff` merged (`ca338aa` → merge).
  Next: g12 Smart Screen Heroes (the last Ch.2 lesson).

## 2026-06-23 · #g10 Fair Play World built to GDD 10 v2 (fairness as gender equality; India chore-gap)
- **[Fair Play World](../games/fair-play-world.md) (#g10, gameId `fair-play`, Ch.2)**: the fairness game in the
  Gender & Respect thread, reworked off the v1 Fairness-Meter sort game onto the **shared v2 engine** as an
  **84-scenario typed library** (`content/games/fair-play.ts`, faithful from GDD 10 JSON): what-is-fair 14 ·
  chores-shared 18 · fair-opportunity 15 · equal-vs-equity 10 · stand-up 17 · fair-everywhere 10. Eight typed
  play actions (branch ×25 · reflect ×19 · strike-rewrite ×12 · sort ×10 · role-play ×8 · match ×4 · build ×3 ·
  spot ×3), **0% binary**, led by fairness **dilemmas** (branch), the **fair-chore-chart builder** (build) and
  **spot-the-unfair-rule** scenes (spot). Fairness as gender equality; **India's chore gap named plainly**;
  equity (box-to-see-over-the-wall); decide-not-told (built for justice-seeker Ananya); both directions, no
  gender villain; family-safe. Builds on g07, prereq g41.
- **gameId trap caught by read-first:** the library/GDD use `fair-play-world` (aspirational) but the engine-host
  registry id is `fair-play`: the config uses `fair-play`, or the status tool wouldn't flag g10 v2 and the
  game wouldn't launch. **Engine:** no new mechanic (reuses 8 of 9); `binStyle` valence accretion
  (unfair/hogging/blocks-it/one-gender/not-really-fair → red). Wrapper kept `FairPlayGame`.
- Read-first: `swipeed_status` confirmed next = g10; read GDD 10 + the full 84-scenario library; `--attest g10`
  (`.read-first/g10.json`). Pre-commit gate validated the attestation; build/lint/tsc green. `feat/g10-fair-play-v2`
  → `--no-ff` merged to equal-lens main (`9517448` → merge). Next: g11 Not Fair, Not Funny.

## 2026-06-23 · #g41 Heart Smart built to GDD 41 v2 (emotional intelligence; completes Chapter 2 to v2)
- **[Heart Smart](../games/heart-smart.md) (#g41, gameId `heart-smart`, Ch.2)**: the deeper 6-9
  emotional-intelligence node, reworked off the old five-mode ModesEngine onto the **shared v2 engine** as an
  **84-scenario typed library** (`content/games/heart-smart.ts`, generated faithfully from the scorecard-passed
  GDD 41 JSON): complex-feelings 14 · handling-big 14 · empathy 14 · getting-along 12 · kindness-gratitude 14 ·
  heart-toolkit 16. Seven typed play actions (branch ×23 · reflect ×23 · role-play ×12 · strike-rewrite ×10 ·
  match ×7 · sort ×5 · build ×4), **0% binary**, led by feeling-moment **dilemmas** (branch), **say-the-self-talk**
  (role-play) and the **heart-toolkit builder** (build). Teaches naming the trickier feelings, a bigger
  regulation toolkit, empathy/perspective-taking, conflict repair, kindness & gratitude. All feelings valid;
  empathy for everyone (boys too; links g01); help-seeking normalised (Childline 1098 + reassure on toolkit
  beats). **This completes Chapter 2 (g06-g09, g41) to v2.**
- **Engine:** no new mechanic (reuses 7 of 9); only a `binStyle` valence accretion (calms/empathic → green,
  fuels/not-empathic → red, feeling-vs-action stays neutral). Wrapper kept as `HeartSmartGame` (engine-host
  unchanged). gameId `heart-smart`.
- **Read-first enforced for real:** ran `swipeed_status.py` (confirmed next = g41), read all five sources
  myself (GDD 41, Ch.2 personas, build bible, transition plan, the 84-scenario library), `read_first.py
  --attest g41` (hash-pinned `.read-first/g41.json`). At commit the pre-commit hook ran both gates: status
  `--check` OK and read-first `--gate` validated the attestation, and passed. Build/lint/tsc green. Tooling on
  `feat/g41-heart-smart-v2` → `--no-ff` merged to equal-lens main (`1189271` → merge). Next: g10 Fair Play World.

## 2026-06-23 · Enforcement: read-first source-doc gate (no build without bible+transition+GDD+personas+library)
- Mechanised the **other half** of the [read-first hard rule](../games/swipeed-game-patterns.md) (step 0, the
  master node table, was already enforced by `swipeed_status.py` + the pre-commit hook). New
  **`scripts/read_first.py`** (npm `read-first`) resolves a node's **five source docs** from `Strategy/` (build
  bible, transition plan, the node's **reworked-v2 GDD**, the **chapter personas**, the **scenario library**)
  and verifies they exist (`--require gXX`). After reading them, `--attest gXX` writes a **hash-pinned**
  `.read-first/<node>.json` naming each doc; it's committed with the build.
- The **pre-commit hook** now also runs `read_first.py --gate`: staging a **NEW** v2 game (v2 now, absent/non-v2
  at HEAD) without a valid, non-stale attestation **blocks the commit**; a changed source doc → hash mismatch →
  stale → must re-read & re-attest. Deliberate bypass: `READ_FIRST_OVERRIDE=1`. **Honest limit:** guarantees the
  docs exist + a doc-pinned attestation was produced before the build, not comprehension.
- Tested: `--require g41`/`g09` resolve all five (incl. zero-padded GDD names); `--verify` fails with no
  attestation; `--gate` blocks a staged new build, passes after `--attest`, and honors the override, all with
  full cleanup (no false g41 attestation left). Tooling on `chore/read-first-source-gate` → `--no-ff` merged to
  equal-lens main (`8afd650`).

## 2026-06-23 · #g09 Friend or Frenemy? built to GDD 09 v2 (healthy friendships; the real next Ch.2 node)
- **[Friend or Frenemy?](../games/friend-or-frenemy.md) (#g09, gameId `friend-frenemy`, Ch.2)**: the
  healthy-friendship game (Thread D; UNESCO 1.2/5.1/5.3/5.6/7.1), built to GDD 09 v2 on the shared
  [v2 engine](../games/swipeed-game-patterns.md): 82-scenario typed library generated **byte-identical** from the
  scorecard-passed GDD JSON, thin wrapper. Led by friendship **dilemmas** (branch ×28), say-the-line comebacks
  (role-play), frenemy-flag spot scenes; also strike/sort/reflect/build/match. Friendship-quality literacy +
  the frenemy flags. Builds on g03. **No new mechanic** (reuses 8 of 9); only a `binStyle` valence accretion
  (frenemy/makes-it-worse → red, real-friend/repair → green: friend-vs-frenemy is a good-vs-bad sort).
- Ethics per GDD: autonomy over verdicts; safe-to-be-wrong; name behaviours not "bad kids"; bullying/safety
  routes to a trusted adult: config wires `helpLine` (Childline 1098) + `reassure` + `reassureCats`
  ["frenemy-flags"] so frenemy-flag beats resolve on the "not your fault, telling is brave" banner + Get-Help.
  Verified: tsc/lint/prod build clean; 82-fidelity byte-identical; 8-sort binStyle truth-table + cross-game
  regression (no prior sort mis-tinted); live (home + Childline pill; strike → truth; frenemy-flag → reassurance
  + Childline; dilemma branch). Merged `--no-ff`; deployed prebuilt.
- **Process note:** this was the corrected next node: after g08 I'd wrongly said "Ch.2 complete / next g13".
  The master node table shows Ch.2 = g06-g12 + g41 + c2; the next nodes after g09 are **g41 Heart Smart, g10
  Fair Play World, g11 Not Fair Not Funny, g12 Smart Screen Heroes + capstone c2** (each has a v2 GDD+library).

## 2026-06-23 · #g08 Safety Squad built to GDD 08 v2 (the ninth mechanic; Chapters 1 & 2 now complete)
- **[Safety Squad](../games/safety-squad.md) (#g08, gameId `safety-squad`, Ch.2)**: the personal-safety /
  child-protection game (Thread B; UNESCO 4.1/4.2/4.3/3.3/5.5), built to GDD 08 v2 on the shared
  [v2 engine](../games/swipeed-game-patterns.md): 84-scenario typed library generated **byte-identical** from the
  scorecard-passed GDD JSON, thin wrapper. Led by safety **dilemmas** (branch), **"No, Go, Tell"** (role-play),
  and the **new signature `spot`-the-trick verb**. Builds on g02; feeds Boundary Bot (g15) + Firewall (g40).
- **Engine change: added the NINTH shared mechanic**: `spot` ([pattern #26](../games/swipeed-game-patterns.md);
  `SpotScenario` = scene[{id,text,trick}] + why; `SpotPlay` renderer: tap the trick → `why` reveal, no-fail)
  + a `binStyle` accretion (tricky/risky → red). Exercises the engine's **content-driven safety machinery**:
  config sets `helpLine`/`helpLabel` (**Childline 1098**) + `reassure` + `reassureCats`, so every touch beat
  and every `outcome:"safe"` branch resolves on the **"never your fault"** banner + the Childline Get-Help pill.
- **Safeguarding contracts enforced** (empower never frighten): safe/unsafe never good/bad (good/bad only as
  the myth erased); never the child's fault; tricky-people over stranger-danger (stranger myth erased); no
  graphic anatomy. Verified: tsc/lint/prod build clean; live (home + Childline pill; spot solving: family
  password trick → why; touch branch → debrief + reassurance + Childline pill); fidelity byte-identical;
  10-sort binStyle truth-table; a content safeguarding self-check (safe/unsafe, non-blame, no anatomy, Childline):
  all pass. Merged `--no-ff`; deployed prebuilt. **With g08, all nine "pre-protocol" libraries (g01-g08, g37)
  are v2** (the founder's Step-1 batch). NOTE: Chapter 2 is **not** complete: **g09 Friend or Frenemy, g41
  Heart Smart, g10 Fair Play World, g11 Not Fair Not Funny, g12 Smart Screen Heroes** (each has a v2 GDD +
  library) + capstone **c2** still need retrofit. By order/prereq the next node is **g09**.

## 2026-06-23 · Fix: free scribbles stick to the paper (3D world ink, not a screen overlay)
Reported: RE scribbles moved with the camera instead of staying on the canvas. Root cause: the free-draw was
a screen-space overlay, so strokes were pinned to the viewport while the 3D paper scrolled under them. Reworked
into `FreeInk` (inside the R3F scene): an invisible raycastable ground plane gives R3F the world hit point
(`e.point`), and each stroke renders as a drei `<Line>` just above the dotted paper, so strokes are real 3D
geometry that scroll/perspective-shift with the paper. RE draws coral ink; UN rubs whole strokes (world-radius
hit); Reset clears; two-finger/wheel scroll preserved. Also removed the earlier forward-to-myth hack: myth
notes (DOM, above the canvas) capture only when erasable and are click-through otherwise, so UN-over-myth
erases the myth (DOM) while open-paper UN/RE hit the ground plane (clean separation; RE can scribble over a
note too). Deleted the screen-space `FreeScribble`. Compiles + mounts with no console errors; **the on-paper
drawing/erasing itself needs a real-browser check** (R3F raycasting + render loop can't run in the
backgrounded automation tab). Deployed.

## 2026-06-23 · Feature: Unlearn's eraser also rubs out free scribbles
Symmetry follow-up to the RE free-scribble pen. The free-draw layer (`FreeScribble`) is now active in **both**
pen and eraser modes: pen lays coral ink (source-over), eraser rubs the free ink away (destination-out). Since
the layer sits above the myth notes, UN over a **myth** forwards the gesture to that note's own ink canvas
(`elementFromPoint` peek → re-dispatch the pointerdown, keep the free layer click-through until pointerup,
then restore + clean up the tracked pointer), so UN erases free scribbles on the open paper AND still erases
myths. Verified live (draw ~3.5k px with RE → rub with UN → 0 px). Deployed.

## 2026-06-23 · Fix: free scribble works on desktop + two-finger trackpad scroll; myths reveal-on-erase
Two desktop bugs (the free-scribble + trackpad scroll added the same day). (1) **Free scribble didn't work
on desktop**: it was a drei `<Html fullscreen>` layer that projects with the camera and drifted off-screen
(canvas at `top:-217/-351`, not covering the viewport), so real mouse events missed it (earlier "tests"
dispatched directly on the element, bypassing hit-testing). Replaced with a plain top-level
`<canvas class="fixed inset-0 z-10">` (`FreeScribble`), full viewport, hittable everywhere (verified:
elementFromPoint at centre/edges; a real mouse stroke paints), pointer-events:none in Browse/Unlearn, Reset
clears it, Get Help (z-50) stays above. (2) **Two-finger trackpad scroll**: a trackpad swipe is a `wheel`
event, and `onWheel` bailed when a tool was active; it now travels in every mode (except mid-game), so
trackpad scroll works in Unlearn/Relearn too. Because RE is now a free pen over the whole canvas (covering the
notes), myths now **reveal-on-erase**: UN rubs the myth out AND shows the truth directly (no separate
RE-draw-on-note). Verified the FreeScribble end-to-end; the in-`<Canvas>` note erase + camera scroll couldn't
be re-verified in the backgrounded automation tab (R3F frame loop paused) but are minimal, sound changes. Deployed.

## 2026-06-23 · Feature: free scribble on the canvas with RE (Relearn)
The Relearn pen now also free-draws anywhere on the open paper, not only inside an erased myth. New
`FreeDrawLayer` (full-viewport coral-ink layer, active only in pen mode) sits at a constant z **below** the
interactive myths + nodes and **above** the 3D world, so the myth draw-to-reveal and node taps keep priority
where they are while free scribble fills the empty space; `pointer-events: none` in Browse/Unlearn so
drag/scroll + erasing pass through; one-finger-draw / two-finger-scroll; Reset clears it. Backing sized from
the canvas's live rect (the fullscreen `<Html>` wrapper carries an offset → strokes map by getBoundingClientRect
at draw time). Verified live (free squiggle paints; two fingers don't draw; an erased myth still reveals its
truth when drawn on; UN/Browse pass through). Deployed.

## 2026-06-23 · Fix: the loose "written on canvas" myths are now erasable + drawable
Follow-up to the path housekeeping below. The interactive UN/RE ink layer had only been wired to the sticky-NOTE
cards; the **loose myths scribbled on the paper** (`ChapterDoodles`: the prominent, in-view ones a user points
at, and what "erase the struck out myths written on canvas" literally means) were `pointer-events: none`
decoration, so they couldn't be erased or drawn on (user-reported with a screenshot). Now they use the same
`MythInk` flow: rub UN to erase the myth (eraser blends into the page paper token), RE to draw the truth →
the truth scribble reveals; each loose myth carries its own truth. Verified live (erase "Some feelings are
bad." → draw → "All feelings are okay."). Both myth surfaces are now interactive. Deployed.

## 2026-06-22 · Path housekeeping: interactive UN/RE canvas, two-finger scroll, node gating, age onboarding, name personalization
Five platform features on the SwipeEd path world (isolated `swipeed-equal-lens` repo), three branches:
- **Real UN/RE drawing + two-finger scroll** ([path world](../games/swipeed-world.md)). The myth sticky-notes now
  use a real ink canvas (`MythInk`): **UN erases** the struck myth under your finger (paints the note's paper
  over the words), **RE draws** the truth in coral ink → reveal. No-fail; DOM text kept for screen readers.
  Drawing no longer locks travel: **one finger draws, two fingers scroll** (app-wide pointer map via
  capture-phase window listeners). Verified live (erase → relearn → truth; two fingers don't draw).
- **Node-level gating + age-band onboarding** ([gating](../games/swipeed-world.md), [app](../games/swipeed.md)).
  Onboarding captures an **age band** (`profile.entryAgeGate`); the learner enters at their chapter with its
  first node open (no need to clear earlier chapters), earlier chapters stay open for **revision**, and the
  path gates forward along the master table's `prereq` chain (new `locked` node state). Completion read from
  `profile.deckStars`. Legacy/no-age users stay ungated. Pure model `src/lib/node-unlock.ts`; gating
  truth-table verified against the real 77-node path; onboarding verified live.
- **Name personalization**. The onboarding name (was captured, unused) is threaded into the mascot greeting
  ("Aanya! …") and the path "Play, Aanya?" cue (`src/lib/personalize.ts`); empty name → unchanged. Verified live.
- tsc + lint + prod build clean on each branch; merged `--no-ff`; deployed prebuilt. (Camera-landing on the
  entry chapter + scroll motion couldn't be shown in the headless tab: R3F `useFrame`/RAF pauses when the
  tab is backgrounded, so those were verified by logic + deterministic tests rather than visually.)

## 2026-06-22 · #g07 What Makes Me, Me built to GDD 07 v2 (the gender-thread root, sex vs gender)
- **[What Makes Me, Me](../games/what-makes-me-me.md) (#g07, gameId `what-makes-me`, Ch.2)**: the **root of the
  Gender & Respect thread** (UNESCO 3.1, sex vs gender), built to GDD 07 v2 on the shared
  [v2 engine](../games/swipeed-game-patterns.md): 82-scenario typed library generated **byte-identical** from the
  scorecard-passed GDD JSON, thin wrapper. Led by the **me-collage build** ("the one and only you", many parts
  → one me) + a gentle **sex-vs-gender** explainer + respect-in-action role-play (use the name given) + the
  UN→RE myth set (17 strikes, incl. India's **NALSA 2014** third-gender fact). **Scope expanded from v1**
  (which stayed on learned roles): v2 teaches sex vs gender **and** "many ways to be", grounded in India's own
  **hijra heritage + NALSA**, not imported. Holds the GDD's ethics contracts: respect is the floor for *every*
  family; **self-knowledge, never pressure** (protects the gender-diverse child AND the majority child);
  scope-disciplined (no medical/romantic/political; anatomy stays light, deferred to g02/g06).
- **No new mechanic** (reuses all seven). Only engine change: a sanctioned `binStyle` valence accretion +
  a recorded **sort-tinting principle**: good-vs-bad sorts read green/red, but sex-vs-gender-vs-expression
  sorts stay **neutral** (tinting one side green would imply it's "better"). Verified by a 9-sort truth-table
  + prior-game regression (all pass). **Adversarial ethics/India/scope/quality audit: 0 confirmed violations**
  across all six GDD contracts; fidelity byte-identical to source. tsc + lint + prod build clean; live
  (build / neutral-sort / valence-sort / strike / role-play / reflect); merged `--no-ff`; deployed prebuilt.
  Chapter 2: g06, g07 done; **g08 Safety Squad remains**.

## 2026-06-22 · #g06 Body Lab Juniors built to GDD 06 v2 (the eighth mechanic, Chapter 2 opens)
- **[Body Lab Juniors](../games/body-lab-juniors.md) (#g06, gameId `body-lab`)**: the body-science game and
  **first Chapter-2 (ages 6-9) node**, built to GDD 06 v2 on the shared [v2 engine](../games/swipeed-game-patterns.md):
  82-scenario typed library generated from the GDD JSON, thin wrapper. Led by the **new signature
  `explore-label` verb** (tap the body part that matches a clue → it reveals a fun fact; wrong tap warmly
  re-asks, no fail). Themes: mostly the same inside; **every body & skin colour is good** (India colourism /
  "Dark is Beautiful" busted head-on, melanin taught as the science of skin colour); bodies grow & change at
  their own pace; curiosity is a superpower. Function over appearance; scope-disciplined (private-part anatomy
  + detailed puberty deferred to later nodes).
- **Engine change: added the EIGHTH shared mechanic**: `explore-label` ([pattern #26](../games/swipeed-game-patterns.md),
  schema `ExploreLabelScenario`, `ExploreLabelPlay` renderer), the first new *shape* since the g01/g02 pilots
  (g03-g05 needed zero engine change). The other seven mechanics are unchanged. Verified live (home + the new
  explore-label solving twice: digestion → tummy & gut, skin colour → melanin, both revealing facts; +
  reflect / role-play; a full category completed end-to-end). tsc + lint + prod build clean; merged `--no-ff`;
  deployed via the prebuilt flow. Chapter-1 v2 retrofit done (g01-g05, g37); **Chapter 2 begun**: g07, g08 remain.

## 2026-06-22 · #g05 Can-Do Kids built to GDD 05 v2 (sixth game on the shared engine)
- **[Can-Do Kids](../games/can-do-kids.md) (#g05, gameId `can-do`)**: the aspirations/careers game,
  retrofitted to GDD 05 v2 on the shared [v2 engine](../games/swipeed-game-patterns.md): 82-scenario typed
  library generated from the GDD JSON, thin wrapper. Led by **erasing occupational gender myths**
  (strike-rewrite ×27, the game's core) + the **dress-up "I can be that" build**. Any job for anyone; girls
  into STEM/leadership AND boys into care/arts; ability grows with practice; no dream off-limits by gender.
  Growth-mindset, never preachy. No safety beats.
- **No engine change**: g05's sort bins (anyone-can/fair/not-fair/silly-rule) are already in `binStyle`; the
  build label comes from config ("I can be that!"). The engine is now stable enough that a same-thread game
  needs zero new code. Verified live (home + the dress-up build "Anyone curious can be a scientist" +
  role-play / branch / match). tsc + lint + prod build clean; merged `--no-ff`. Chapter-1 v2 retrofit now:
  g01, g02, g03, g04, g05, g37 done; g06, g07 remain (+ g08 in Ch.2).

## 2026-06-22 · #g04 Same Same, Different built to GDD 04 v2 (fifth game on the shared engine)
- **[Same Same, Different](../games/same-same-different.md) (#g04, gameId `same-same`)**: the **gender-root**
  game, retrofitted to GDD 04 v2 on the shared [v2 engine](../games/swipeed-game-patterns.md): 82-scenario
  typed library generated from the GDD JSON, thin wrapper. Led by **erasing silly gender rules**
  (strike-rewrite ×18) + the anyone-can/silly-rule sort. Toys & colours for everyone; anyone can; strong AND
  gentle; equal inside, wonderfully different (India colourism / Dark is Beautiful); fair play. Both
  directions (frees girls AND boys), never preachy, no safety beats.
- Engine: `binStyle` gained fair/inclusion vocabulary (anyone can / fair / includes everyone → 💚, not fair /
  leaves out / silly old rule → 🛑). Verified live (home + the gender-myth strike-rewrite "no wrong toys"
  with un.svg UN→RE + the fair/not-fair sort 💚/🛑 + reflect/match). tsc + lint + prod build clean; merged
  `--no-ff`. Chapter-1 v2 retrofit now: g01, g02, g03, g04, g37 done; g05, g06, g07 remain (+ g08 in Ch.2).

## 2026-06-22 · #g37 Clean Crew built to GDD 37 v2 (fourth game on the shared engine)
- **[Clean Crew](../games/clean-crew.md) (#g37, gameId `clean-crew`)** retrofitted to GDD 37 v2 on the shared
  [v2 engine](../games/swipeed-game-patterns.md), 82-scenario typed library generated from the GDD JSON, thin
  wrapper. The hygiene/healthy-habits game, led by the signature **step-sequencer build** (put the
  wash/brush/bath/bedtime steps in order; pieces shuffled so the order is a real puzzle). For every gender,
  never babyish/"gross"; empower never shame; India-aware (no-soap resourcefulness). No safety beats.
- Engine: `binStyle` gained clean/healthy vocabulary so hygiene sorts read with green/red valence; build
  labels come from config (`buildLabels`: sequence "That's the clean way!" / assemble "All set!"). Verified
  live (home + the step-sequencer: shuffled steps, wrong-order nudge, wet→soap→scrub→rinse→dry → relearn;
  strike-rewrite UN→RE). tsc + lint + prod build clean; merged `--no-ff`. Chapter-1 v2 retrofit now: g01,
  g02, g03, g37 done.

## 2026-06-22 · #g03 My Family Garden built to GDD 03 v2 (third game on the shared engine)
- **[My Family Garden](../games/my-family-garden.md) (#g03, gameId `family-garden`)** retrofitted to GDD 03 v2
  on the shared [v2 engine](../games/swipeed-game-patterns.md), 82-scenario typed library generated from the
  GDD JSON, thin wrapper. The families/belonging game: affirms every family shape (joint, single-parent,
  grandparent-led, adoptive, blended, two-homes; India-centred), led by the signature **grow-your-garden
  build**. No safety beats (no reassurance: it's a pride/belonging game, not safety).
- Shared-engine generalised (additive; g01/g02 unaffected): per-game **`buildLabels`** so the build "done"
  button fits each game ("That's my garden!" vs "That's my team!"); `binStyle` gained family-belonging
  vocabulary so family sorts read with proper green/red valence (collision-avoidance still guarantees
  distinct bins). Verified live (home + reflect/match/role-play + the garden build → relearn); tsc + lint +
  prod build clean; merged `--no-ff`. Chapter-1 v2 retrofit now: g01, g02, g03 done; g37 + g08 remain.

## 2026-06-22 · GDD **v2** "mechanic-embodying" standard: shared engine + g02 & g01 retrofit
- The founder updated the GDDs to **v2** (the v1 libraries were "100% binary taps"). v2 re-encodes the same
  researched content into a **typed scenario** (`type` + per-type payload) across **seven play actions**
  (reflect · role-play · strike-rewrite · branch · sort · match · build), **0% binary**. This established
  **[pattern #26](../games/swipeed-game-patterns.md)**: ONE **shared v2 engine** (`components/games/v2-engine.tsx`,
  schema `content/games/v2-schema.ts`) renders all seven as the micro-loop; each game is a **thin wrapper**
  feeding its typed library + a `V2GameConfig`. Depth lives in the content, the GDD-sanctioned "shared
  templates", not the rejected MCQ ModesEngine. (Confirmed the scope/approach with the founder first:
  "pilot g02, then g01" with a shared engine.)
- **[My Body, My Rules](../games/my-body-my-rules.md) (#g02)** piloted the engine (84-scenario v2 library),
  then **[Feelings Friends](../games/feelings-friends.md) (#g01)** followed (84-scenario v2 library), both
  generated faithfully from the GDD JSONs (an adversarial review confirmed g02's content byte-identical).
- An **adversarial review** of the pilot hardened the shared engine (baked into pattern #26): completion no
  longer gated on a speech `onEnd` (a muted 3-6-y/o tap could swallow it); the **"never your fault"
  reassurance + Childline is content-driven** (any branch with an escape-and-tell `outcome:"safe"`), so
  grooming beats in non-reassure categories (e.g. consent-stop mb-050) surface it; branch consequences are
  spoken (audio-first) + no branch soft-lock; every sort bin gets a distinct emoji+colour (never red-🚫 a
  neutral category); sequence-build pieces shuffled; OS `prefers-reduced-motion` honoured.
- Verified live (all seven mechanics render + solve + resolve with no-fail nudges; completion →
  `finishDeck`); tsc + lint + prod build clean; merged `--no-ff` (Equal Lens repo, local-only). g03-g08
  follow on the same engine.

## 2026-06-22 · GDD rework continues: My Body, My Rules (#g02) rebuilt to the standard
- **[My Body, My Rules](../games/my-body-my-rules.md) (#g02) reworked to GDD 02**: the second build to the
  new standard, and the most safeguarding-sensitive in Chapter 1. Read-first, then built **bespoke** (the
  founder's hard rule: read strategy + personas + GDD + scenario library before building; never template
  off another game or the ModesEngine). Deepened from five hand-coded modes to **six verb-moves driven by
  each scenario's own `mechanic`**: *Whose body?* (yes-no) · *Name it* · *Safe or not?* (3-bin
  safe/not-safe/**uh-oh** sort) · *The Big No* (the tactile say-it-loud Voice verb) · *Secret or surprise?*
  (2-bin sort) · *Tell who?* (the additive **safety-team builder**), over an **86-scenario library**
  (my-body 12 · real-names 10 · safe-unsafe 16 · PANTS 12 · consent 14 · secret-surprise 8 · tell 14),
  anchored by the **PANTS song**. NSPCC PANTS + AAP correct names + POCSO/Childline 1098; deliberately
  **gender-neutral** (boys included).
- This established **[pattern #25](../games/swipeed-game-patterns.md)**, the *mechanic-driven loop with N
  bespoke verb renderers* (sort-into-bins · tactile Voice verb · additive roster builder · song anchor),
  plus two safeguarding contracts: **disclosure-routes-to-reassurance** (no buzzer on safety items; never
  scored) and **reference-don't-level** a Thread-C tool (a non-Thread-C game's non-blocking `ToolMoment`,
  e.g. g02 referencing Help-Map without leveling it).
- `gameId "my-body"` kept (the GDD names `my-body-rules` aspirationally but flags: confirm the existing id
  first: renaming would orphan completion). Verified live (all six verbs, no-fail, UN→RE on myths, the
  builder, Help-Map reference, completion → `finishDeck("my-body", 3, 15)`); typecheck + prod build clean;
  branch `feat/g02-my-body-rework` merged `--no-ff` (Equal Lens repo, local-only). The 67 remaining games
  follow, one at a time, read-first.

## 2026-06-22 · GDD rework begins: Feelings Friends (#g01) rebuilt to the new standard (pilot)
- The product's **Strategy/** rework (build bible · transition plan · reworked GDDs · scenario libraries
  · 8 chapters of personas) sets a new bar: every game = a distinct **verb** on a researched **80+
  scenario library**, "fun × learning, or neither counts", moving the catalogue out of the
  "accurate but boring" quadrant and off the shallow MCQ ModesEngine.
- **[Feelings Friends](../games/feelings-friends.md) (#g01) reworked to GDD 01** as the Chapter-1 pilot,
  the template the other 68 follow. Six verb-moves (Name it · It's okay UN→RE · Calm it · How do they
  feel? · Big No · I can help) over an **88-scenario library** (name 24 · all-okay 14 · calm 16 ·
  empathy 16 · big-no 10 · help 8), the Hook→Play→UN→RE→Apply→Sticker micro-loop, deepened Calm Corner
  + tactile Big No, no-fail, audio-first, co-play. `gameId "feelings"` unchanged.
- Adversarially reviewed (3 lenses: faithful · 0 blockers). New **[pattern #24](../games/swipeed-game-patterns.md)**
  records the build shape + two gotchas for the next 68: shuffle the answer slot (libraries list it
  first), and wire in-UI "Calm Mode" to the shared `prefersReducedMotion()` path. Built in the
  swipeed-equal-lens app; live.

## 2026-06-22 · Chapter 6 adult games complete (#g44-g52)
- Finished the College chapter on the [ModesEngine](../games/swipeed-game-patterns.md): **[Money & Independence](../games/money-independence.md)** (#g48),
  **[Mind & Belonging](../games/mind-belonging.md)** (#g49, wellbeing register: crisis routing Tele-MANAS 14416 / KIRAN),
  **[Find Your Feet](../games/find-your-feet.md)** (#g52, career anxiety), **[Equal & Confident](../games/equal-confident.md)** (#g50),
  **[Know Your Rights](../games/know-your-rights.md)** (#g51). **All of Chapter 6 (#g44-g52) is now live**, 57 built games.
- Next: Chapter 7 (Building a Life, #g53-g60) and Chapter 8 (Parenthood + Parent Layer, #g61-g69), then the c6/c7/c8 capstones.

## 2026-06-22 · Adult journey games begin: shared ModesEngine + Ch.6 #g44-g47
- The lifelong path's **adult chapters (Ch.6-8)** were added to the node table + canvas, and the **adult
  (dark) theme** ships; now the **adult games are being built, one GDD at a time** (going through GDD 44-69).
- **[Consent, For Real](../games/consent-for-real.md)** (#g44) built as the hand-built reference, the adult
  step of the consent spine (#2 → #15 → #24 → #31), with Drinks & Capacity and survivor support.
- Extracted a reusable **[ModesEngine](../games/swipeed-game-patterns.md)** (pattern #2 in practice): a
  mode-game is now a content **config + one registry line**. Built on it: **[Swipe Right?](../games/swipe-right.md)**
  (#g45), **[Real Relationships](../games/real-relationships.md)** (#g46), **[Own Your Health](../games/own-your-health.md)** (#g47).
- All inherit no-fail, safeguarding-never-scored + Get-Help routing, even-handed, non-explicit, India-aware.
  Implemented in the brand re-skin app (swipeed-equal-lens); catalog + patterns doc updated here in step.

## 2026-06-21 · World/Art artefact inventory (re-vibe scope): new reference doc
- Added **[world-art-tokens.md](../games/world-art-tokens.md)**, a holistic, living inventory of every
  artefact that defines SwipeEd's look-and-feel, so a future "change the vibe" pass can be scoped at a
  glance: 2D design tokens (`globals.css` + fonts), the thread colour system (xlsx `hex` → `path.ts`), the
  **34 `.glb`** model kit + 9 colormap atlases, the season & day/night palettes (`seasons.ts`,
  `time-of-day.ts`), the scene renderer (`path-scene.tsx` et al.), the companion (Sam) + brand assets, and
  feedback juice, each with a per-layer **effort note**. Headline: the 20% that gets ~80% of a new vibe is
  `globals.css` + `seasons.ts` + the colormap PNGs + thread hexes; the expensive part is swapping the GLTF
  kit. Cross-linked from [swipeed-world.md](../games/swipeed-world.md). (Scoping only, no re-vibe done.)

## 2026-06-21 · Master Node Table → 43 lessons; The Rabbit Hole built (node #g43, ages 12-15): online misogyny / the manosphere
- The **Master Node Table** added one node, **The Rabbit Hole (#g43)**, at **Chapter 4 order 36, between
  [Firewall](../games/firewall.md) (#g40) and [Reality Check](../games/reality-check.md) (#g28)**; g28's prereq
  re-stitched (g40→g43) → **43 lessons + 5 capstones (48 nodes)**. This is the **manosphere beat the dev
  hand-off had parked**, now spec'd (GDD 43) and built.
- Built **[The Rabbit Hole](../games/rabbit-hole.md)**, the game about **online misogyny and the
  "manosphere"** (dual **Threads E + G** · Gender & Media; the first dual-thread node). Extends
  [MythBuster: Gender](../games/mythbuster-gender.md) (#g25) & [Equalize](../games/equalize.md) (#g26) onto online
  misogyny; uses the media literacy of Reality Check/Decoded. UNESCO 3.2/3.1 + 5.4/5.1 + 1.3; UK RSHE 2025.
  Five no-fail modes: **The Funnel** (trace the radicalisation escalation: it's a designed funnel, not your
  failing), **Follow the Money** (the grift; bluntest line School-Comfort-gated), **Spot the Hook** (the
  **UN & RE** beat on the claims), **Real Strong** (positive masculinity: strength that lifts, never
  belittles), **Have Each Other's Backs** (call-in support + a Help-Map tool moment for the loneliness).
  5-badge book → `GameDone` (3★/30). Sam (teen) + UnReBeat + voice + School-Comfort.
- **Make-or-break rule honoured (GDD §18):** never "boys are the problem": **non-shaming**,
  compassionate to the need underneath, **media-literacy-led**, centred on **positive masculinity**, and it
  **never platforms real influencers/content** (synthetic examples only); routes the underlying loneliness
  to **Tele-MANAS 14416 / KIRAN**. Added **pattern #22** (the de-radicalisation register). First
  **dual-thread (E/G)** node, widened the path `ThreadKey` union + gender-tag logic in `gen-path.py`.
- **[Capstone 4](../games/capstones.md)** now lights an **eleventh** star (+The Rabbit Hole, after Firewall).
  Reconciled live node-counts (42→43 lessons / 47→48 nodes) across index, games catalog, swipeed, GLRL,
  capstones, swipeed-world and both READMEs. New engine id `rabbit-hole` → `/game/rabbit-hole`.

## 2026-06-21 · Life-Skills Toolkit (Thread C spine): fully built (Phases 1-6)
- Built the whole **[Life-Skills Toolkit](../games/life-skills-toolkit.md)** spine across six phased branches
  (one per phase, KB updated each merge), making **Thread C the connective tissue of SwipeEd**:
  - **Phase 1 (model):** `Profile.toolkit` (optional, default-merged), `lib/toolkit.ts` registry +
    `THREAD_C_LEVEL`, `content/toolkit.ts` guided content, store `unlockTool`/`levelTools`/`useTool`.
  - **Phase 2 (Cool-Down + Help Map + drawer):** the always-available **Toolkit drawer** (self-hides until
    the first tool is earned), a generic **tool player**, the **breathing space**, Thread-C completion →
    toolkit growth, and an enriched global Help Map (Tele-MANAS 14416 · KIRAN · cybercrime 1930).
  - **Phase 3 (Decision Steps + Talk-It-Out):** all four tools live in the drawer; Thread-C completions
    grow the whole toolkit a chapter at a time.
  - **Phase 4 (tool moments):** an optional, never-blocking `<ToolMoment>` injected at high-stakes beats in
    **8 games** (Firewall, Stand Up, Mutual, GLRL, Plan It, My Choices, Body Confident, Reality Check).
  - **Phase 5 (wellbeing shell):** **Calm Mode** (calm-aware `prefersReducedMotion`), a once-a-day,
    privacy-preserving **mood check-in**, and a **kind streak** with freezes (no shame). Wind-down already
    existed.
  - **Phase 6 (capstone reflection):** a "Skills you've grown" beat at each graduation (`ToolkitReflection`
    from `GameDone` for `capstone-*`); c5 is the whole-toolkit look-back.
- Guardrails held throughout: **healthy coping only**, **routes to real help**, **on-device/never-uploaded**
  (no mood values stored), **never therapy**. Reuse-first: extended the existing Get Help, day/night
  wind-down, and reduced-motion handling rather than rebuilding. Added **pattern #21** (the skills spine).

## 2026-06-21 · Life-Skills Toolkit (Thread C spine): design-of-record (Phase 0)
- Approved a phased build of the **[Life-Skills Toolkit](../games/life-skills-toolkit.md)**, the cross-cutting
  wellbeing system that makes **Thread C the spine of SwipeEd**: a persistent, on-device toolkit of **four
  tools** (Cool-Down · Decision Steps · Talk-It-Out · Help Map) a child builds & levels across all 15 years,
  taught in the five Thread-C games, **invoked in context** inside other games (authored "tool moments"),
  surfaced in a **wellbeing app-shell** (mood check-in · breathing space · calm mode · kind streaks ·
  day/night wind-down), reflected in the **capstones**, and carried by **Sam**.
- **Phase 0 (this entry, docs-only):** wrote the design-of-record `games/life-skills-toolkit.md` (four tools
  + UNESCO mapping, the persistent-toolkit data model, the in-context invocation mechanic, the wellbeing
  shell, capstone reflection, Sam-as-carrier, build order, and the healthy-coping/safeguarding/privacy
  guardrails: healthy-only library, routes to real help, on-device/DPDP, never therapy). Added
  **pattern #21** (the skills spine: a persistent toolkit + optional in-context tool moments) and
  cross-linked from [swipeed.md](../games/swipeed.md). Reuse noted: the Help Map extends the existing global
  **Get Help**; the **day/night wind-down already exists**; **reduced-motion** is already honored (calm mode
  extends it).
- **Build order (safeguarding-first, per the doc):** Phase 1 data model → Phase 2 Cool-Down + Help Map +
  drawer/breathing space → Phase 3 Decision Steps + Talk-It-Out → Phase 4 in-context tool moments → Phase 5
  wellbeing shell → Phase 6 capstone reflection. One branch per phase; KB updated each merge.

## 2026-06-21 · Master Node Table → 42 lessons; Heart Smart (#g41) & Life Ready (#g42): Thread C, end to end
- The **Master Node Table** added two **Thread C · Feelings & Life Skills** nodes: **Heart Smart (#g41,
  Ch.2)** and **Life Ready (#g42, Ch.5 penultimate)**, completing that thread **end to end across all
  five chapters** (Feelings Friends → Heart Smart → Mind Matters → Bounce → Life Ready). Dropped in the
  new `scripts/master-node-table.xlsx`, regenerated `path.ts`; they insert in order with re-stitched
  prereqs (g10←g41, g36←g42) and their emojis (💗 / 🌅) → **42 lessons + 5 capstones (47 nodes)**.
- Built **[Heart Smart](../games/heart-smart.md)**, #g41, ages 6-9, the **missing 6-9 link** between
  [Feelings Friends](../games/feelings-friends.md) (naming feelings) and [Mind Matters](../games/mind-matters.md)
  (managing them). Five no-fail modes: Feelings Detective (empathy), Big Feelings/Small Steps (healthy
  calm-down), Walk in Their Shoes (pick the kind action), Get-Along Gang (squabble repair step-by-step),
  Good Choices (**UN & RE's first gentle appearance**: "big kids don't cry" → all feelings okay). No
  Ask-It at this age (questions → a grown-up). Starts the shared Life-Skills Toolkit. 5-heart chart →
  `GameDone` (3★/20). `heart-smart` → `/game/heart-smart`.
- Built **[Life Ready](../games/life-ready.md)**, #g42, ages 15-18, the **penultimate lesson** (before the
  [Decoded](../games/decoded.md) finale) and the **capstone of Thread C**, grown from [Bounce](../games/bounce.md).
  Sam appears **grown**, a bookend to the small friend from Feelings Friends. Five modes: Know Yourself
  (values), Decide Like an Adult (pick the grown-up approach; no single 'right' path), Handle the Big
  Stuff (transitions/stress tools), People & Support (people-skills + support map + helplines), Life Myths
  (**UN & RE**: "asking for help means you failed at adulthood" → a lifelong strength). Healthy
  strategies only; pressure-free; not therapy; routes distress to help. 5-skill badge book → `GameDone`
  (3★/35). `life-ready` → `/game/life-ready`.
- **Capstones:** [Capstone 2](../games/capstones.md) now lights an **eighth** star (+Heart Smart, after
  Friend or Frenemy) and [Capstone 5](../games/capstones.md) a **ninth** (+Life Ready, after Justice League,
  before Decoded). Reconciled live node-counts (40→42 lessons / 45→47 nodes) across index, games catalog,
  swipeed, GLRL, capstones, swipeed-world and both READMEs.

## 2026-06-21 · Master Node Table → 40 lessons; Firewall built (node #g40, ages 12-15): teen online safety
- The **Master Node Table** added one node, **Firewall (#g40)**, at **Chapter 4 order 34, between
  [Stand Up](../games/stand-up.md) (#g27) and [Reality Check](../games/reality-check.md) (#g28)**; g28's prereq
  re-stitched (g27→g40) and the tail shifted by one → **40 lessons + 5 capstones (45 nodes)**. Dropped in
  the new `scripts/master-node-table.xlsx`, regenerated `path.ts`, added the `firewall` GAME mapping + 🧱
  emoji.
- Built **[Firewall](../games/firewall.md)**, the teen **online-safety** game (Thread B · Safety, Consent &
  Boundaries), closing the highest-risk gap between [Boundary Bot](../games/boundary-bot.md) (#g15) and
  [Decoded](../games/decoded.md) (#g36). UNESCO 4.3 (safe use of ICTs) + 4.1 + 5.5. Five modes: **Who's
  Really There?** (grooming/catfishing red flags), **Think Before You Share** (footprint + pressure;
  explicit sexting line **School-Comfort-gated**), **Sextortion: Don't Panic** (the signature, rehearse
  the calm, no-blame plan step-by-step under a persistent "it's not your fault" banner), **Online Myths
  Busted** (the **UN & RE** beat on the self-blame/privacy myths), **Lock It Down** (privacy, block &
  report, helplines). 5-skill badge book → `GameDone` (3★/30 coins); Sam (teen) + UnReBeat + voice.
- **High-stakes safeguarding (GDD §12 & §18):** non-explicit, never victim-blaming, **no how-to-harm**,
  **POCSO/IT-Act-aware** (minor = protected victim), urgent routing to **cybercrime 1930 /
  cybercrime.gov.in · Childline 1098**. The triaged anonymous Ask-It is GDD Phase 2 (deferred). New
  engine id `firewall` → `/game/firewall`.
- **[Capstone 4](../games/capstones.md)** now lights a **tenth** star for Firewall (after Stand Up, before
  Reality Check). Reconciled live node-counts (39→40 lessons / 44→45 nodes) across index, games catalog,
  swipeed, GLRL, capstones, swipeed-world and both READMEs; **extended pattern #16** with Firewall's teen
  online-safety register (rehearsable no-blame plan, no how-to-harm, minor-as-victim, urgent routing).

## 2026-06-21 · Capstones recap the three new nodes (c1 · c3 · c4)
- Each new life-skills node sits inside a chapter whose **capstone** recaps "one big idea per game", so
  the three affected graduations now light a star for the new node too (the star count is data-driven off
  each capstone's `RECAP`, so no component change was needed):
  - **Capstone 1** (My First Friends, ages 3-6): **+[Clean Crew](../games/clean-crew.md)** after My Body, My
    Rules → **6** ideas.
  - **Capstone 3** (Growing Up Smart, ages 9-12): **+[Mind Matters](../games/mind-matters.md)** after Puberty
    Quest → **9** ideas.
  - **Capstone 4** (Reading Relationships, ages 12-15): **+[Bounce](../games/bounce.md)** after Body
    Confident → **9** ideas.
- Inserted in path order; capstone comments + the [capstones doc](../games/capstones.md) updated to match.

## 2026-06-21 · Bounce built (node #g39, ages 12-15): Thread C complete; path back to 39 + 5 = 44 all live
- Built **[Bounce](../games/bounce.md)**, node #g39 (play order 27, Chapter 4, Thread C · Feelings & Life
  Skills), the teen mental-health-and-resilience game and the **grown-up step from
  [Mind Matters](../games/mind-matters.md)** (#g38), sitting beside [Body Confident](../games/body-confident.md)
  (#g21). UNESCO 5.6 (mental wellbeing & resilience) + 5.5 (finding help). It **completes Thread C** across
  the whole journey.
- Five no-fail modes: **Stress Signals** (normal hard patch vs a sign to get help; no self-diagnosis),
  **The Resilience Toolkit** (healthy skills only), **Bounce** (pick the kind-AND-true thought after a
  real setback, the signature), **Mind Myths Busted** (the **UN & RE** beat on teen stigma, the key
  unlearn), **Hold Space** (support a friend without carrying it alone; own help-seeking; helplines).
  5-skill badge book → `GameDone` (3★/30 coins); Sam (teen) + UnReBeat + voice.
- **Highest-care wellbeing (GDD §18):** healthy coping only (no harmful strategies can be authored in),
  **crisis routing first** (Tele-MANAS 14416 · KIRAN 1800-599-0019 · Childline 1098), never reinforces
  self-criticism, *skills & signposting, not therapy*. Persistent breathing-space + triaged Ask-It are
  GDD Phase 2 (deferred). New engine id `bounce` → `/game/bounce`.
- **Path status:** with g37/g38/g39 all live, the path is back to **whole**: **all 39 lesson nodes + 5
  capstones (44 nodes)** built and documented. Reconciled the live node-count statements across the KB
  (index, games catalog, swipeed, GLRL, capstones) from 36→39 lessons / 41→44 nodes.

## 2026-06-21 · Mind Matters built (node #g38, ages 9-12): the mental-wellbeing gap, closed
- Built **[Mind Matters](../games/mind-matters.md)**, node #g38 (play order 17, Chapter 3, Thread C ·
  Feelings & Life Skills), the emotional-and-mental-wellbeing game that **closes the curriculum's biggest
  gap** (UNESCO 5.6 emotions/resilience (*new*) + 5.5 finding help). Grows
  [Feelings Friends](../games/feelings-friends.md) (#g01) into bigger pre-teen emotions; follows
  [Puberty Quest](../games/puberty-quest.md) (#g13); hands to Bounce (#g39).
- Five no-fail modes: **Name It to Tame It**, **Cool-Down Toolkit** (healthy strategies only),
  **Bounce-Back Lab** (pick the kind-AND-true thought), **Mind Myths Busted** (the **UN & RE** beat on
  stigma, the key unlearn), **Reach Out** (when/how to ask for help, support a friend, helplines).
  5-skill badge book → `GameDone`; Sam (older child) + UnReBeat + voice.
- **Wellbeing-sensitive (GDD §18):** healthy coping only (no pain/shock strategies), never reinforces
  self-criticism, anti-stigma, **routes distress to real help** (Childline 1098 · Tele-MANAS 14416 ·
  KIRAN 1800-599-0019), *skills & signposting, not therapy*. The anonymous Ask-It Q&A with urgent triage
  is GDD Phase 2 (deferred). New engine id `mind-matters` → `/game/mind-matters`.

## 2026-06-21 · Master Node Table grew to 39 lessons; Clean Crew built (node #g37, ages 3-6)
- The **Master Node Table** was updated to **39 lessons + 5 capstones (44 nodes)**, adding three new
  life-skills nodes: **Clean Crew (#g37)** self-care at ages 3-6, and two mental-health/resilience nodes
  **Mind Matters (#g38)** and **Bounce (#g39)** (built next). Dropped in the new
  `scripts/master-node-table.xlsx` and regenerated `src/content/path.ts`; the three insert in `order`
  with **re-stitched prereqs** (g37 after g02, g38 after g13, g39 after g21) and their own emojis.
- Built **[Clean Crew](../games/clean-crew.md)**, node #g37, play order 3, the hygiene/self-care companion
  to body-safety. Five no-fail modes (Wash Up · Sparkle Smile · Daily Routine · Healthy Me · I Can Do
  It), a 5-sticker chart, Sam + voice. **Deliberately no formal UN & RE**: at 3-6 it's a precursor
  (Sam models the "germs wash away" reframe). New engine id `clean-crew` → `/game/clean-crew`. Follows
  [My Body, My Rules](../games/my-body-my-rules.md); feeds [Body Lab Juniors](../games/body-lab-juniors.md).

## 2026-06-21 · GLRL Flag-pedia fixes (node #24) + GameShell tall-content scroll
- Flag-pedia inside GLRL: its back control now stays in-app (returns to the GLRL home) via a new optional
  `onBack` prop on `FlagpediaView` (the standalone `/flagpedia` page still links to `/decks`).
- **GameShell** (shared chrome, all games): its body changed from a centered flex container to a scroll
  container + `min-h-full` centering wrapper, so short content still centres but **tall content (e.g.
  Flag-pedia) scrolls from the top instead of being clipped**. Verified live.

## 2026-06-21 · GLRL home rebuilt natively to match the other games (node #24)
- Follow-up to the shell-consistency change: the first pass just wrapped the bespoke Loadout card in
  GameShell, which still didn't match. Rebuilt the GLRL **home screen natively** in the exact shape every
  other node uses: **Sam header + greeting (audio-first) + a progress row + a 2-column mode grid** (Story ·
  Daily · Quick Play · Boss Rush · Flag-pedia) on the shared GameShell body, with **Story/Powers as native
  sub-screens** (deck list / perk grid + Start). Daily/Boss Rush launch the run directly; Quick Play is the
  v1 swipe; Flag-pedia mounts the collection. Mute/replay tools in the shell. The roguelike run (GlrlRunHost)
  + the swipe are the gameplay. Verified live: home column = Sam header → progress row → mode grid, identical
  structure to the other games. `components/games/glrl.tsx` fully rewritten.

## 2026-06-21 · GLRL made a first-class engine game for shell consistency (node #24)
- **Deliberate deviation from GDD 24** (user-approved, for path coherence): Green Light / Red Light now
  launches at `/game/glrl` and in place on the path through the same `EngineGameHost` + shared `GameShell`
  chrome as every other node, fronted by the Loadout's 5-tile mode menu, instead of its own bespoke
  overlay launched from `/decks`. The **roguelike run mechanic is unchanged**; only the launch/chrome are
  unified.
- New `src/components/games/glrl.tsx` (`GlrlGame`) owns a self-contained menu→run flow inside GameShell;
  "Easy" Quick Play owns its own swipe via `useSwipeGame` so the game works standalone. `Loadout` gained an
  `embedded` mode (drops its overlay + path-exit X when inside the shell). Registered `glrl` in engine-host;
  `gen-path.py` no longer special-cases glrl → node g24 resolves to `/game/glrl`; the path page's bespoke
  glrl state/mounting was removed. Recording (runDeckCleared/deckStars) unchanged → completion still tracks.
  `/decks` and `/play/mythbuster` remain reachable. Updated green-light-red-light.md accordingly.

## 2026-06-21 · Reconciled Green Light / Red Light doc to GDD 24 (node #24)
- A canonical numbered **GDD 24** ("standard node edition") surfaced for Green Light / Red Light, with the
  original v1 and the 2.0 roguelike-redesign GDDs named as its companion deep-dives. Verified the **live
  game is faithful to GDD 24**: Clarity run, Insight perks, story decks, the 20 signs and Flag-pedia are
  all built; only **Build-a-Flag UGC** is absent (correctly a deferred GDD Phase 2/3 item).
- Refreshed `green-light-red-light.md`: it still framed 2.0 as "(building)" though the roguelike has been
  live since the GLRL build, updated the description + the version callout to "2.0: now live (v1 kept as
  Quick Play)", referenced GDD 24 as the canonical node GDD, and changed the build-plan heading from
  "Building" to "Built & live". Docs-only; no code touched.

## 2026-06-21 · MythBuster converted to a 5-mode lab (node #25): live-game rebuilds complete
- Converted MythBuster from a 12-card swipe deck to the full 5-mode myth-busting lab DOM game per GDD 25:
  The Myth Lab (judge Myth/Fact → BUSTED/CONFIRMED + central UN & RE), the Busted gallery, the "It's Just
  Biology" Files (real averages vs pseudo-science), the Double-Standard Detector, and the Myth-Buster's
  Toolkit + Ask, plus a 5-badge Badge Book → GameDone. Evidence-based, even-handed; busts the myth not the
  believer. New engine id `mythbuster-lab`; node g25 repointed to `/game/mythbuster-lab`. The original
  swipe deck stays intact and reachable at `/play/mythbuster`.
- **This completes the audit + rebuild of the pre-pattern live games.** All five (MythBuster #25, Stand Up
  #27, Lead the Way #33, Change Makers #34, Justice League #35) are now built to their 5-mode + UN&RE GDDs;
  GLRL #24 was already faithful (the 2.0 roguelike). **Every one of the path's 36 lesson nodes + 5
  capstones now follows the established GDD pattern.** (GitHub push still pending auth restore, all local.)

## 2026-06-21 · Justice League rebuilt to the GDD (node #35): 5 modes
- Rebuilt to GDD 35: five modes: Know Your Rights (+ UN & RE: "rights aren't for someone like me"), Know
  the Law (POCSO/POSH/marriage age/cyber, plain language), Get Justice (FIR/committees/helplines/free legal
  aid), Rights in Action (spot the violation & respond), Your Rights Toolkit + Ask, plus a 5-badge Badge Book
  → GameDone. Educational, not legal advice. Same engine id `justice-league`/node g35 (no path change).

## 2026-06-20 · Change Makers rebuilt to the GDD (node #34): 5 modes
- Rebuilt to GDD 34: five modes: Find Your Cause (pick & sharpen + UN & RE: "too small to matter"), The
  Plan (goal/allies/tactics), **Build the Movement** (campaign sim with a Momentum meter), Make It Stick
  (measure/adapt/sustain/safe), Launch It + Ask, plus a 5-badge Badge Book → GameDone. Start small & real,
  collective, safe/lawful. Same engine id `change-makers`/node g34 (no path change).

## 2026-06-20 · Lead the Way rebuilt to the GDD (node #33): 5 modes
- Rebuilt to GDD 33. The earlier build had drifted into a structural-equality dashboard sim (overlapping
  Equalize #26); the actual GDD is about **personal allyship & quiet leadership**. Five modes: What
  Allyship Really Is (+ UN & RE: allyship is everyone's, male allyship is strength), Lead by Example, Lift
  as You Climb, **Call In Not Just Out** (respectful persuasion over public call-out), Your Leadership Style
  + Ask, plus a 5-badge Badge Book → GameDone. Same engine id `lead-the-way`/node g33 (no path change).

## 2026-06-20 · Audit + rebuild of the pre-pattern live games begins (Stand Up #27)
- Audited the 6 already-live games against their now-available GDDs. **GLRL #24** is already faithful (the
  2.0 roguelike). The other five (MythBuster #25, Stand Up #27, Lead the Way #33, Change Makers #34,
  Justice League #35) were thin **pre-pattern stubs** (no UN&RE, no 5-mode/badge structure), confirmed for
  rebuild to their 5-mode GDDs (user approved; MythBuster to be converted from swipe deck to a 5-mode DOM game).
- **Stand Up rebuilt** to GDD 27: five modes: Read the Room, **The 5 Ds** (Direct/Distract/Delegate/Delay/
  Document + UN & RE bystander beat), Safety First, Support the Target, Be an Upstander (181/1091/112/1098),
  plus a 5-badge Badge Book → GameDone. Safety-first; centres the target. Same engine id `stand-up`/node g27
  (no path change). Now follows the Sam + UnReBeat + voice-model pattern.

## 2026-06-20 · Capstone 5 built (node c5): THE PATH IS COMPLETE
- New capstone **"Ready for the World"**, the Chapter 5 (ages 15-18) graduation **and the final
  graduation of the whole journey**. Sam (now fully grown) recaps the chapter's **eight big ideas**
  (My Choices → Decoded), the player lights a star for each, and Sam graduates them into the world with
  the biggest celebration. New engine id `capstone-5`/node c5 → `/game/capstone-5`.
- **🎉 The entire SwipeEd path is now built: all 36 lesson nodes + all 5 capstones (ages 3-18).** This
  completes the requested Chapters 4 & 5 build-out. Of the 16 Ch4/5 lessons, 10 were built this batch
  (Body Confident, Plan It, Outbreak, Equalize, Reality Check; My Choices, Status, Mutual, Spectrum,
  Decoded) plus Capstones 4 & 5; the 6 already-live games (GLRL #24, MythBuster #25, Stand Up #27, Lead the
  Way #33, Change Makers #34, Justice League #35) were left as-is.
- **Note (still open):** GitHub push auth expired mid-Chapter-4. Every commit (both repos) is merged to
  local `main` and production is fully deployed via Vercel; a `git push` of swipeed + Praxis is pending the
  user restoring GitHub credentials. Local commits ahead: see `git status` in each repo.

## 2026-06-20 · Decoded built (node #36): the finale lesson; digital citizenship
- New game (ages 15-18), **the finale lesson node (36 of 36)**: a digital-citizenship capstone and summit
  of the media thread (#12/#17/#28). Five modes: Decode the Algorithm, **Decode the Influence** (UN & RE:
  "viral = true", "too smart to be manipulated", boss "a dark pattern is just design"), Decode Yourself
  (digital wellbeing), **The Decoder** (master decode-anything tool), and **Grow: Your Journey** (UN & RE's
  final reflective appearance: "Unlearn. Relearn. Grow.", plus a digital-life charter), plus a 5-badge Badge
  Book → GameDone. Sam appears fully grown (began in Feelings Friends #1). Critical not cynical.
- New engine id `decoded`/node g36 → `/game/decoded` (engine-host + gen-path GAME map + path.ts). Reuses
  Sam + UnReBeat + voice model. **This is the last LESSON node: only Capstone 5 remains.** Deferred per
  GDD: live "decode this feed" sandbox, crown levels, Hindi.

## 2026-06-20 · Spectrum built (node #32): diversity in identity, with dignity
- New game (ages 15-18), the diversity & respect step. Five modes: The Spectrum (orientation & gender
  identity; India's own history), Myths & Respect (UN & RE: "a choice", "an illness", "contagious", boss
  "a Western import"), **Dignity for All** (respect/anti-bullying scenes; never out someone; dignity across
  disagreement), Being You (support for anyone questioning; no pressure to label), and Support & Ask
  Anything (careful triage; KIRAN/Tele-MANAS 1800-599-0019, Childline 1098), plus a 5-badge Badge Book →
  GameDone. Never shames/outs; constitutional-values framing (NALSA / Transgender Act).
- New engine id `spectrum`/node g32 → `/game/spectrum` (engine-host + gen-path GAME map + path.ts). Reuses
  Sam + UnReBeat + voice model. Extends What Makes Me Me (#7) + MythBuster (#25). Deferred per GDD: fuller
  glossary, crown levels, careful live Ask-It triage, Hindi.

## 2026-06-20 · Mutual built (node #31): consent, communication & equal respect
- New game (ages 15-18), the consent step; the culmination of the consent journey (#2, #15, #24). Five
  modes: What Consent Really Is (the freely-given/reversible/enthusiastic/ongoing standard), Reading &
  Respecting (read cues, stop instantly), **Pressure & Coercion** (UN & RE on consent myths; boss
  "drunk/dressed = willing" → incapacitation is never consent), The Mutual Zone (mutual enthusiastic
  consent), and Your Right Their Right + Ask Anything (POCSO age-18; routing to 181/1091/1098/112), plus a
  5-badge Badge Book → GameDone. Never explicit; even-handed; strongest safeguarding routing.
- New engine id `mutual`/node g31 → `/game/mutual` (engine-host + gen-path GAME map + path.ts). Reuses Sam
  + UnReBeat + voice model. Pairs with Status (#30). Deferred per GDD: branching communication sim, crown
  levels, Hindi.

## 2026-06-20 · Status: Know It built (node #30, owning your sexual health)
- New game (ages 15-18), the SRH ownership step. Five modes: Know Your Status (testing as self-care +
  UN & RE shame-bust), The Prevention Stack (choose & combine; condoms/PrEP School-Comfort-gated), Talk
  About It (partner communication), Treat & Thrive (U=U; diagnosis isn't the end), and Dignity & Ask
  Anything (anti-stigma + open Q&A; NACO ICTC / Childline 1098), plus a 5-badge Badge Book → GameDone.
  Empowering, non-judgmental; "knowing is power, not shame".
- New engine id `status-know-it`/node g30 → `/game/status-know-it` (engine-host + gen-path GAME map +
  path.ts). Reuses Sam + UnReBeat + voice + School-Comfort. Personal completion of Outbreak (#23); pairs
  with My Choices (#29). Deferred per GDD: build-your-own-routine tracker, crown levels, Hindi.

## 2026-06-20 · My Choices, My Future built (node #29): opens Chapter 5
- New game (ages 15-18), Chapter 5 opener: the mature completion of Plan It (#22). Five modes: The Full
  Picture (contraception factual & non-explicit; method specifics School-Comfort-gated + UN & RE on
  "contraception harms your health"), If/When/Whether (reproductive choices & rights), **Decide It**
  (values-based decision sim), Access & Rights (RKSK clinic; confidentiality), and My Future + Ask Anything
  (open private Q&A; Childline 1098), plus a 5-badge Badge Book → GameDone. Comprehensive, non-judgmental,
  pressure-free; delaying respected. Young-adult Sam.
- New engine id `my-choices`/node g29 → `/game/my-choices` (engine-host + gen-path GAME map + path.ts).
  Reuses Sam + UnReBeat + voice + School-Comfort. Links to Status (#30), Mutual (#31). Deferred per GDD:
  deeper decision sim, method comparison, Hindi.

## 2026-06-20 · Capstone 4 built (node c4): Chapter 4 complete
- New capstone **"Reading Relationships"** (ages 12-15 graduation): Sam recaps the chapter's **eight big
  ideas** (Body Confident → Reality Check), the teen lights a star for each, and Sam graduates them
  ("Chapter Four complete! 🎓"). Mirrors Capstones 1-3. New engine id `capstone-4`/node c4 →
  `/game/capstone-4`. **Chapters 1-4 (ages 3-15) are now built.** Of Chapter 4's eight lessons, five were
  built this batch (Body Confident #21, Plan It #22, Outbreak #23, Equalize #26, Reality Check #28) and
  three were already live (GLRL #24, MythBuster #25, Stand Up #27). Next: Chapter 5 (ages 15-18).
- **Note:** GitHub auth went unavailable mid-batch (push credential expired); all commits are merged to
  local main in both repos and production is deployed via Vercel (which uploads local files). Pending a
  `git push` of both repos once auth is restored.

## 2026-06-20 · Reality Check built (node #28): what's real, staged, fake online
- New game (ages 12-15), the media-literacy step. Five modes: Real vs Reel (judge genuine vs staged), The
  Manipulation Files (UN & RE: "if it's online it's real"; highlight reels; boss "you can't tell what's
  fake"), Love & Sex on Screen (media idealises love; porn-is-performance card hidden in School-Comfort),
  Fakes & Your Rights (deepfakes; non-consensual images illegal; report 1930 / cybercrime.gov.in /
  Childline 1098), and Think for Yourself (critical-questions toolkit), plus a 5-badge Badge Book → GameDone.
  Critical & calm, never explicit.
- New engine id `reality-check`/node g28 → `/game/reality-check` (engine-host + gen-path GAME map +
  regenerated path.ts). Reuses Sam + UnReBeat + voice + School-Comfort. Culmination of #12 + #17; hands to
  Decoded (#36). Deferred per GDD: deepfake-detection mini-game, crown levels, Hindi.

## 2026-06-20 · Equalize built (node #26): closing the belief-vs-practice gap
- New game (ages 12-15), the Gender & Respect step that closes the gap between believing in equality and
  living it. Five modes: The Equality Gap, **The Second Shift** (share-to-balance household sim),
  **Equalize!** (spot-and-fix class/workplace/community), Equality Lifts Everyone (UN & RE on the zero-sum
  myth: "equality means men lose" → "everyone gets more freedom, closeness, less pressure"), and Be the
  Change, plus a 5-badge Badge Book → GameDone. Hopeful, non-zero-sum; changes the pattern not the person.
- New engine id `equalize`/node g26 → `/game/equalize` (engine-host + gen-path GAME map + regenerated
  path.ts). Reuses Sam + UnReBeat + voice model. Next step after MythBuster (#25); hands to Stand Up (#27).
  Deferred per GDD: drag-to-rebalance sim, crown levels, Ask-It, Hindi.

## 2026-06-20 · Outbreak: Stop the Spread built (node #23, STIs, knowledge-not-fear)
- New game (ages 12-15), the SRH infection step. Five modes: **Outbreak!** (deploy education/condoms/
  testing/treatment/vaccine to drop a Spread meter to zero), How It Spreads (UN & RE myth-bust: casual
  contact doesn't spread it; "tell by looking"; boss "only certain people get STIs"), Your Defense Kit
  (layered; condoms School-Comfort-gated), Test/Treat/Live Well (testing normal; HIV manageable; **U=U**),
  and **End the Stigma + Ask Anything** (UN & RE stigma beat + anti-stigma pledge; NACO ICTC / Childline
  1098), plus a 5-badge Badge Book → GameDone. Anti-stigma core; compassion-not-shame.
- New engine id `outbreak`/node g23 → `/game/outbreak` (engine-host + gen-path GAME map + regenerated
  path.ts). Reuses Sam + UnReBeat + voice model + School-Comfort. Picks up condoms (#22) + body's defences
  (#20). Deferred per GDD: richer population sim, crown levels, Hindi.

## 2026-06-20 · Plan It built (node #22): pregnancy, prevention & planning
- New game (ages 12-15), the SRH planning step. Five modes: The Fertility Cycle, **Myths Busted** (UN & RE
  on dangerous pregnancy myths: "first time / standing up / during a period", boss "withdrawal +
  infertility"), Ways to Prevent (delaying respected & always shown; contraception basics School-Comfort-
  gated), **Plan It!** life-sim (choices ripple, no fear/shame), and My Future + Ask Anything (doctor /
  RKSK clinic / Childline 1098), plus a 5-badge Badge Book → GameDone. Non-judgmental; abstinence respected.
- New engine id `plan-it`/node g22 → `/game/plan-it` (engine-host + gen-path GAME map + regenerated
  path.ts). Reuses Sam + UnReBeat + voice model + School-Comfort gating. Continues The Amazing Journey
  (#14); links to Outbreak (#23). Deferred per GDD: richer life-sim, crown levels, Hindi.

## 2026-06-20 · Body Confident built (node #21): opens Chapter 4
- New game (ages 12-15), Chapter 4 opener: a body-image self-care app. Five modes: **Fact or Filter**
  (judge media real/filtered + UN & RE), My Body My Pace (puberty at your pace; menstrual health; private
  cycle/wellbeing tracker, never weight), The Comparison Trap (body-neutral truths), Self-Care Quests
  (kind self-care, never about looks), and Ask Anything + Get Help (private Q&A; distress → KIRAN
  1800-599-0019 / Childline 1098), plus a 5-badge Badge Book → GameDone. **Body-neutral, NO weight/calorie
  tracking.** Continues Puberty Quest (#13) + Flip the Script (#17).
- New engine id `body-confident`/node g21 → `/game/body-confident` (engine-host + gen-path GAME map +
  regenerated path.ts). Reuses Sam + UnReBeat + voice model. **Starts the Chapter 4 & 5 build-out** (the
  6 already-live Ch4/5 games (GLRL #24, MythBuster #25, Stand Up #27, and the three 15-18 sims #33-35)
  are left as-is). Deferred per GDD: working private tracker, fuller bank, Hindi.

## 2026-06-20 · Capstone 3 built (node c3): Chapter 3 complete
- New capstone **"Growing Up Smart"** (ages 9-12 graduation): a warm, no-fail ceremony where Sam recaps
  the chapter's **eight big ideas** (Puberty Quest → Defenders of the Body), the child lights a star for
  each, and Sam graduates them ("Chapter Three complete! 🎓"). Mirrors Capstones 1 & 2. New engine id
  `capstone-3`/node c3 → `/game/capstone-3` (engine-host + gen-path GAME map + regenerated path.ts).
  Reuses Sam + voice model + juice. **Chapters 1-3 (ages 3-12) are now fully built**, all of nodes
  #1-20 plus three capstones. This completes the requested Chapter 3 batch (g13-g20 + c3). Next on the
  path: Chapter 4 (ages 12-15), starting with Body Confident (#21).

## 2026-06-20 · Defenders of the Body built (node #20): closes Chapter 3
- New game (ages 9-12), the SRH health step that **closes Chapter 3**: a gentle "defend the body's city"
  game. Five modes: Defend the Body (choose-the-defence waves), Stay Healthy (habits), **Fact Power-Ups**
  (UN & RE blast the myth-germs: "catch HIV from a hug", "death sentence", boss "tell by looking"),
  **Bust the Stigma** (befriend Ravi, a classmate with HIV: care, not fear), and Health Helpers, plus a
  5-badge defender Badge Book → GameDone. HIV at facts + anti-stigma only (sexual transmission → Outbreak #23).
- New engine id `defenders`/node g20 → `/game/defenders` (engine-host + gen-path GAME map + regenerated
  path.ts). Reuses Sam + UnReBeat + voice model. Grows Smart Screen Heroes' care-not-stigma seed. **All of
  Chapter 3's lessons (#13-20) are now built**: only Capstone 3 remains in the chapter. Deferred per GDD:
  real place-and-defend interaction, Ask-It, crown levels, Hindi.

## 2026-06-20 · Speak Up rebuilt to the GDD (node #19): 5 modes
- Rebuilt the gender-based-harm game from a single scenario screen to the full GDD. Safety-critical,
  never-victim-blaming. Five modes: Spot the Harm, The Safe Response (boundary/ally/tell/helpline), **It's
  Not Your Fault** (UN & RE: "she asked for it / boys will be boys / telling is snitching" → "no one asks
  to be harmed; it's the harmer's fault; telling is brave"), **The Help Map** (Childline 1098, POCSO e-Box,
  181), and Stand Together, plus a 5-badge Badge Book → GameDone. Grows Not Fair, Not Funny (#11).
- Same engine id `speak-up`/node g19 (no path change). Reuses Sam + UnReBeat + voice model. Deferred per
  GDD: fuller scenario bank, crown levels, facilitator guides, Hindi.

## 2026-06-20 · Norm Storm built (node #18): keep the good, question the harm
- New game (ages 9-12), the most culturally-sensitive, a **sort-and-reason** game where the *reason*
  matters as much as the bin. Five modes: Sort the Norm (Help/Depends/Harm; dowry School-Comfort-gated),
  **Keep the Good** (celebrates traditions worth keeping, the crucial balance), Rights Trump Harm (UN & RE
  Rights Cards), Norms Change (proof harmful norms change), and My Voice (keep one, question one), plus a
  5-badge Badge Book → GameDone. Message is never "your culture is bad".
- New engine id `norm-storm`/node g18 → `/game/norm-storm` (engine-host + gen-path GAME map + regenerated
  path.ts). Reuses Sam + UnReBeat + voice model + School-Comfort gating. Deferred per GDD: draggable
  storm-to-bin, fuller deck, crown levels, facilitator guides, Hindi.

## 2026-06-20 · Flip the Script rebuilt to the GDD (node #17): 5 modes
- Rebuilt the media game from a single remix screen to the full GDD: five media-editor modes: Spot the
  Stereotype, **Flip It!** (before→after), **Bust the Media Myth** (UN & RE on colourism), **Real Stars**
  (diverse role models), and **Make a Fair Ad** (Flipped Gallery), plus a 5-badge editor Badge Book →
  GameDone. The colourism flip is a key spiral relearn back to Body Lab's "every skin is good".
- Same engine id `flip-script`/node g17 (no path change). Reuses Sam + UnReBeat + voice model. Deferred per
  GDD: richer editor tools (swap image/role/recolour), crown levels, fuller bank, Hindi.

## 2026-06-20 · Crossroads built (node #16): a pre-teen's week of choices
- New game (ages 9-12), the Relationships step; grows Friend or Frenemy? into a **branching life-sim** of
  a pre-teen's week (Mon-Fri): peer-pressure dare, first crush, falling-out, family arguing, online
  teasing. Each choice moves a **Trust** meter and a **Wellbeing** meter; Crush Corner carries the UN & RE
  beat (crushes normalised, not pushed toward dating; softened under School-Comfort); an end-of-week
  **debrief** names the skills used and shows the meters; replayable.
- New engine id `crossroads`/node g16 → `/game/crossroads` (engine-host + gen-path GAME map + regenerated
  path.ts). Reuses Sam + UnReBeat + voice model. Introduces the **meter-driven life-sim + debrief** shape
  (template for the teen life-sims). Deferred per GDD: deeper branches, crown levels, Ask-It, Hindi.

## 2026-06-20 · Boundary Bot built (node #15): consent & online safety
- New game (ages 9-12), the Safety & Consent step; advances Safety Squad (#8). Five modes: Ask First
  (consent sim), No Means No (UN & RE: "no just means try harder" → "no means no; anyone can change their
  mind"), My Boundaries (assertive words), Online Shields (privacy / cyberbullying / grooming red-flags →
  tell), and **Ask Boundary Bot** (a SAFE, vetted, **non-generative** curated Q&A; serious matters route to
  a trusted adult / Childline 1098 / POCSO e-Box), plus a 5-badge Boundary Badge Book → GameDone. Consent
  kept everyday/non-sexual.
- New engine id `boundary-bot`/node g15 → `/game/boundary-bot` (engine-host + gen-path GAME map +
  regenerated path.ts). Reuses Sam + UnReBeat + voice model; chatbot safe by construction (static vetted
  answers). Deferred per GDD: live guardrailed Bot + classifier, crown levels, Hindi.

## 2026-06-20 · The Amazing Journey built (node #14): opens the SRH thread
- New game (ages 9-12): a wonder-first, science-framed **"journey" explainer** of how a new life begins.
  Four museum exhibits (Where Life Begins, The Big Meeting/fertilisation, Nine Amazing Months, A New
  Person): explore + a checkpoint stamps the Journey passport; the sensitive "how cells meet" line is
  School-Comfort-gated, prevention stays high-level (methods wait for Plan It #22), plus **Bust the Baby
  Myths** (UN & RE choose-the-truth; spiral boss "babies grow in a tummy" → "in the uterus, from two
  cells"). 5-stamp passport → GameDone.
- New engine id `amazing-journey`/node g14 → `/game/amazing-journey` (engine-host + gen-path GAME map +
  regenerated path.ts). Reuses Sam + UnReBeat + voice model + School-Comfort. Deferred per GDD: cell-voyage
  animation, returning Ask-It, crown levels, Hindi.

## 2026-06-20 · Puberty Quest built (node #13): opens Chapter 3
- New game (ages 9-12): a light **myth-busting quest** through Puberty Valley. Five areas: The Period
  Place (menstruation positive & practical), Changes All Over (all bodies), Moods & My Self (body image;
  masturbation card School-Comfort-gated), **Myth Monsters** (UN & RE: pick the true fact to bust the
  myth, incl. a boss), and the **Ask-It box** (anonymous Q&A; distress → Childline 1098), collected into
  a 5-badge Puberty Pocketbook → GameDone. Menstruation-positive, even-handed.
- New engine id `puberty-quest`/node g13 → `/game/puberty-quest` (engine-host + gen-path GAME map +
  regenerated path.ts). Reuses Sam + UnReBeat + voice model + School-Comfort. **Two new patterns added to
  the patterns doc: #18 Ask-It box, #19 myth-bust-by-choosing-the-truth.** Deferred per GDD: crown levels,
  live Ask-It triage, class leagues, Hindi.

## 2026-06-20 · Capstone 2 built (node c2): Chapter 2 complete
- New capstone **"Fair & Safe Explorer"** (ages 6-9 graduation): a warm, no-fail ceremony where Sam
  recaps the chapter's **seven big ideas** (Body Lab Juniors → Smart Screen Heroes), the child lights a
  star for each, and Sam graduates them ("Chapter Two complete! 🎓"). Mirrors Capstone 1. New engine id
  `capstone-2`/node c2 → `/game/capstone-2` (engine-host + gen-path GAME map + regenerated path.ts).
  Reuses Sam + voice model + juice. **Chapters 1 & 2 (ages 3-9) are now fully built.** Next: Chapter 3
  (ages 9-12), starting with Puberty Quest (#13).

## 2026-06-20 · Smart Screen Heroes built (node #12): closes Chapter 2
- New game (ages 6-9): a bright **set of four hero mini-games + a habits wrap** that opens the
  media-literacy and health threads. **Real or Pretend?** (sort screen things; UN & RE on the
  fairness-cream ad, tying back to Body Lab's anti-colourism), **Good Choice** (decision trees with
  friendly consequences), **Germ Busters** (tap-to-scrub + cover-the-cough rhythm), **Be Kind, Not Mean**
  (care-not-stigma; seeds the HIV work), and **Smart Screen Habits** (balance + tell-a-grown-up).
- 5-badge Hero Badge Book + a levelling cape → GameDone. No-fail, reading-light, even India-true ad
  parodies (never real brands). New engine id `smart-screen`/node g12 → `/game/smart-screen`
  (engine-host + gen-path GAME map + regenerated path.ts). Reuses Sam + UnReBeat + voice model. This is
  the last lesson before Capstone 2; deferred per GDD: "Make a True Ad", streak, Classroom polish, Hindi.

## 2026-06-20 · Not Fair, Not Funny rebuilt to the GDD (node #11)
- Rebuilt the ally game from a 3-choice single-scene to the full GDD: **five modes**: Not Fair, Not Funny
  (branching teasing scenes), **Just a Joke?** (bust "it's just a joke" with UN & RE), **Be an Ally** (the
  safe 3-step + a 6-phrase Comeback Kit), How Would You Feel? (empathy), and **Stand Tall** (protective
  lines if you're teased; Childline 1098), plus a 5-badge Ally Badge Book.
- The gentlest first step of the GBV/ally thread (ages 6-9), **even-handed** (boys teased too) and
  **empower-never-frighten** (#16): the ally action is kind/include/tell, never confront. Reuses Sam +
  UnReBeat + voice model. Same engine id `not-funny`/node g11. Deferred per GDD: fuller scene bank,
  illustrated characters, Classroom prompts, Hindi.

## 2026-06-19 · Fair Play World rebuilt to the GDD (node #10)
- Rebuilt the fairness game from a single assign screen to the full GDD: **run-a-fair-world** with the
  **Fairness Meter** at the centre. Five modes: Share the Work, Fair Chances, Rights for Every Child
  (Rights Cards), **Swap Day** (empathy), and **Bust the 'Rule'** (UN & RE), plus a Fair Play Badge Book.
  Even-handed, India-pointed (son-preference, unpaid care, girls' education; Beti Bachao framing).
- Reuses Sam + UnReBeat + voice model. Same engine id `fair-play`/node g10. Deferred per GDD: draggable
  leaning-world scene, fuller banks, Classroom polish, Hindi.

## 2026-06-19 · Friend or Frenemy? (node #9): friendships, the GLRL seed
- Built **[Friend or Frenemy?](../games/friend-or-frenemy.md)** (node g09, ages 6-9): the child-level seed
  of Green Light / Red Light. Five modes: branching friend **stories** (choose → consequence; behaviours
  not labels), the **Words Toolbox** (I-statement / No / Sorry / Can I join), **Pressure Moments** (the
  UN & RE beat), **Make It Right** (conflict repair), **True-Friend Check** (reflection + tell-an-adult).
  Reuses Sam + UnReBeat + voice model. Builds on My Family Garden.
- **20 of 41 path nodes live**, and all nine of the available GDDs (3-6 chapter complete + capstone;
  Chapter 2 well underway) are built. Deferred per GDD: fuller story bank, friendship meter, Classroom
  polish, Hindi.

## 2026-06-19 · Safety Squad (node #8): safety thread onto screens
- Built **[Safety Squad](../games/safety-squad.md)** (node g08, ages 6-9, safeguarding-critical): five
  missions: Spot the Unsafe (touch/online/bullying), the Safe Move (Say No · Get Away · Tell), Keep It
  Private (online vault), Good/Tell Secret (the **UN & RE** beat), and My Safety Squad (additive trusted
  adults + Childline 1098). Empowering-not-frightening, "never your fault"; **online safety** is the new
  content. Extends My Body, My Rules; reuses Sam + UnReBeat + the trusted-adults builder. 19 of 41 nodes live.
- Deferred per GDD: safe-move animation polish, fuller scenario bank, cyber-crime helpline, Classroom-Mode
  polish, disclosure-guide UI, daily streak, Hindi.

## 2026-06-19 · What Makes Me, Me (node #7): the gender-thread keystone
- Built **[What Makes Me, Me](../games/what-makes-me-me.md)** (node g07, ages 6-9, sex vs gender): sort
  traits into **Body (born with)** vs **Learned (taught)**, **bust the unfair learned "rules" with UN &
  RE** (shared `UnReBeat`), see "It Can Change" + "Same Body, Many Ways", and build a **What-Makes-Me
  identity card**. It-Can-Change Badge Book; even-handed; stays on learned roles. A flagship UN & RE game.
- Reuses Sam + the shared UnReBeat + voice model. 18 of 41 nodes live.
- Deferred per GDD: the song, drag-into-bins polish, fuller card bank, Classroom-Mode polish, Hindi.

## 2026-06-19 · Body Lab Juniors (node #6): Chapter 2 opens; UN & RE debut
- Built **[Body Lab Juniors](../games/body-lab-juniors.md)** (node g06, ages 6-9): a reading-light science
  "body lab" with five stations (Label the Body, Super Senses, the Growing Machine slider, Where Babies
  Grow [School-Comfort-gated], All Bodies Are Good) + a Body Lab Badge Book. Builds on My Body, My Rules.
- **UN & RE debut**: a shared **`UnReBeat`** component (`components/games/un-re.tsx`), the unlearn-relearn
  duo's first formal appearance, at the colourism myth and the "where babies grow" relearn. Core-principle
  doc status updated. 17 of 41 path nodes live.
- Deferred per GDD: senses experiments polish, the timeline save, Classroom-Mode polish, daily streak, Hindi.

## 2026-06-19 · Capstone 1 built; Chapter 1 (ages 3-6) complete
- Built **[Capstone 1: My First Friends](../games/capstones.md)** (node `c1`): the Chapter 1 graduation,
  a warm, no-fail ceremony where Sam helps the child light a star for each of the chapter's five big
  ideas (feelings, body-safety, family/kindness, same-same, can-do), then graduates them. Engine
  `capstone-1`; reuses Sam + voice model + juice. New `capstones.md` overview (c1 built; c2-c5 planned).
- **The whole ages-3-6 chapter is now playable end-to-end** (5 games + capstone): 16 of 41 path nodes live.

## 2026-06-19 · Can-Do Kids rebuilt to the GDD (node #5)
- Rebuilt the anti-stereotype game to the full GDD: **Sam**, home + five modes (Be Anything role-wheel,
  **Bust the Myth Monster** (even-handed, lifts boys up too), Feelings for All, Toys & Chores,
  Make-a-Can-Do-Kid), the **Can-Do Badge Book**, the new voice model. The myth-pop is the ages-3-6 seed
  of Unlearn → Relearn → Grow.
- **Consistency:** extracted a **shared inclusive avatar builder** (`components/games/make-a-kid.tsx`)
  now used by both Can-Do (Make-a-Can-Do-Kid) and Same Same (Make-a-Friend), one definition, disability
  inclusion baked in (noted on pattern #17). Same engine id `can-do`/node g05. Deferred per GDD: the
  song, group mode, fuller banks, Hindi.

## 2026-06-19 · Same Same, Different rebuilt to the GDD (node #4)
- Rebuilt the gender-opener from a thin same/different tapper to the full GDD: **Sam**, **friendship
  threads + a "become friends" payoff**, the **Friendship Garden**, a gentle **myth-bubble pop** (the
  ages-3-6 seed of Unlearn → Relearn → Grow: no UN&RE characters, no "you were wrong"), three layers
  (feelings / can-do / fair & safe), and an inclusive **Make-a-Friend** (skin tone + glasses / wheelchair
  / hearing aid). Uses the new voice model (held transitions + replay). Same engine id `same-same`/node g04.
- Deferred per GDD: the "Same Inside" song, group mode, fuller matrix, Hindi.

## 2026-06-19 · Voice model improved (narration contract)
- Upgraded the shared narration (`src/lib/speak.ts`): **strips emoji** before speaking (no more "smiling
  face"); fires **`onEnd`** when a line completes so games **hold mode/scene transitions until the audio
  finishes** (length-based fallback when muted, so pacing holds either way); added a **"hear it again"
  replay** button to the audio-first games (feelings, my-body, family-garden). Captured in patterns #10.

## 2026-06-19 · Inclusive family builders (same-sex parents)
- Fixed a real inclusivity gap: the family builder (My Family Garden) and the trusted-adults Safety Net
  (My Body, My Rules) used single-select, so a child with **two mums / two dads** couldn't build their
  family. Made both **additive (repeats allowed, tap-to-remove)** with an explicit "even two mums or two
  dads" prompt: any structure is now buildable. Goes beyond the GDDs (which omitted same-sex parents).
- Recorded as patterns doc **#17: "let every child build themselves in"** (additive identity/family
  builders, diverse cast, never make a child feel their family isn't an option).

## 2026-06-19 · My Family Garden shipped (node #3, ages 3-6): Relationships thread opens
- Built **[My Family Garden](../games/my-family-garden.md)**, node #3, the start of the Relationships
  thread. Five no-fail modes: Make My Family (radically inclusive builder), Families Care, Friends
  Forever, the **Kindness Garden** (each caring act blooms a flower, the age-right progression + the
  completion driver), and Kinds of Love (family/friend/pet affection, no romantic content). Reuses Sam.
- Engine `family-garden`, node **g03** (15 playable nodes). Three early-years games now chain as designed
  (feelings → body-safety → belonging). Deferred per GDD: the song, persisted album/garden, group mode,
  festival packs, Hindi.

## 2026-06-19 · My Body, My Rules shipped (node #2, ages 3-6): body safety
- Built **[My Body, My Rules](../games/my-body-my-rules.md)**, node #2, the body-safety foundation
  (PANTS / good-touch-bad-touch; POCSO/NCERT). Five no-fail modes: My Body (+ underwear rule), My Rules,
  Safe/Unsafe/Not-Sure, the Big No (for touch), and the Safety Net (3-5 trusted grown-ups + Childline
  1098). Empowering-never-frightening, "never your fault", co-play; reuses **Sam** (now a shared
  `sam.tsx` component) + the Big No from node #1; correct-names framing gated by School-Comfort.
- Engine `my-body`, node **g02** (gen-path.py → path.ts; 14 playable nodes). Established **patterns doc
  #16** (*sensitive topics: empower, never frighten*). Deferred per GDD: the song, caregiver disclosure
  guide UI, group mode, fuller scene bank, online-safety beat, Hindi.

## 2026-06-19 · Feelings Friends shipped (node #1, ages 3-6) + Sam's debut
- Built **[Feelings Friends](../games/feelings-friends.md)**, the path's first game (Thread C · Feelings &
  Life Skills) and the **first non-gender-thread lesson**. Warm, audio-first, no-fail SEL: five modes
  (Meet · Match · Mirror Me pick-a-face · The Big No · Calm Corner) + a Feelings Family collection + a
  daily check-in. Introduces **Sam** (an in-UI avatar here; the constant companion across the journey).
- Engineered as an engine game (`feelings`) like can-do/same-same: content-as-data, `speak.ts` narration,
  shared juice, no-fail; registered in `engine-host` and mapped to path node **g01** (gen-path.py →
  path.ts; now 13 playable nodes). Deferred per GDD: live camera, record/playback, the song, Hindi.

## 2026-06-19 · GLRL 2.0 run polish: portrait, music, timer
- Completed the GDD juice + mastery spec for runs: **character-portrait reactions**, a subtle
  Clarity-driven **escalating music bed** (ducks on serious cards, mute-aware), a distinct **"shatter"**
  on a busted disguised card, and a **gentle, non-punitive reading timer** with a speed bonus that only
  counts once accuracy is high (Calm Mind removes it; Slow-Mo widens disguised cards). The music
  controller lives in the shared `src/lib/juice.ts`.

## 2026-06-19 · Shared juice: consistent sound/feel across all games
- Made game feel consistent app-wide: the shared **`celebrate()`** now carries the chime (small →
  "green", big → "win"), so every game sounds alike with no per-game audio wiring; the swipe atom + run
  own their per-card sound (green / red / combo / **shatter** on a disguised bust) and silence their
  celebrate to avoid double-play. Added a **global mute** (Settings → Sound) synced to the juice layer.
- Strengthened patterns doc #11 (["one shared juice layer, consistent across games"](../games/swipeed-game-patterns.md)).
- (GLRL run polish (portrait reaction, escalating music, timer/speed-bonus) follows on its own branch.)

## 2026-06-19 · GLRL 2.0 powers to 8 (4 unlock by play)
- Added 4 powers: **X-Ray** (reveal the first disguised card's sign), **Streak Shield** (first wrong
  costs no Clarity), **Combo Master** (faster Clarity on combos), **Boss Bane** (bonus on the boss),
  taking the loadout to **8 powers**. The new four **unlock by play** (lifetime disguised-reads / runs /
  best-combo / a 3-star run), giving the meta-progression real teeth; effects are wired in the run
  engine and locked tiles show their unlock hint in the loadout. (Instance of the white-hat
  "[aids earned by play, never bought](../games/swipeed-game-patterns.md)" pattern.)

## 2026-06-19 · GLRL 2.0 matured: 6 story arcs, 85 cards
- Added 3 story arcs: **The Controlling Partner** (Kabir), **Family & Boundaries** (Anaya), **The Group
  Chat** (Veer), taking GLRL to **6 arcs / 85 cards** (hits the GDD's ~80 MVP target); +2 cast; Boss
  Rush auto-grows from the new disguised cards.
- New cross-game pattern recorded in the [patterns doc](../games/swipeed-game-patterns.md): **don't
  villainise a whole category**, balance reds with genuine greens (family/friends/partners), keep the
  control-myth as the boss and safeguarding a separate calm beat.
- (Powers → 8 follows on its own branch.)

## 2026-06-19 · Reusable game patterns doc (living, cross-game)
- Created **[reusable game patterns](../games/swipeed-game-patterns.md)**, the cross-game decisions proven
  in GLRL 2.0 + the gender games (content-as-data, one-engine-per-verb, no-fail + safeguarding-never-
  scored, white-hat, aids-never-auto-win, the Unlearn → Relearn → Grow beat, accessibility,
  juice-respects-reduced-motion, simple forward-compatible persistence, text-light age-adaptive tone,
  India + School-Comfort). Seeds of the future [Engine SDK](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/engine-sdk.md).
- Made it a **living doc**: referenced from the [game template](../games/_game-template.md), the
  [games catalog](../games/index.md) "documenting a new game" steps, the root + SwipeEd indexes and the GLRL
  doc; and added an `AGENTS.md` convention to **consult it when building a game and update it (same
  branch) when a new reusable decision is made**.

## 2026-06-19 · Green Light / Red Light 2.0 planned (roguelike rebuild)
- Adopted the **[GLRL 2.0](../games/green-light-red-light.md)** design: keep the swipe verb, rebuild around
  it as an **educational roguelike-lite**: short story **Runs**, a **Clarity** meter (no hard fail),
  **Insight-perk** loadouts, **branching forks**, **boss cards**, full **juice**, and white-hat
  meta-progression. Disguised cards carry the [Unlearn → Relearn → Grow](../games/swipeed-core-principle.md)
  beat. The run/perk shell is a reusable template for other SwipeEd swipe units.
- Documented v1-vs-2.0 + the extended card schema (`escalation_step`, `branch_id`, `character`) and a
  built-vs-planned status block in the GLRL doc.
- **Scope:** building the GDD **MVP / Phase 1** (run structure + 3 story decks + 4 perks + ~80 cards +
  juice + EN/HI + School-Comfort), runs primary with the v1 swipe kept as **Quick Play / Essentials**.
  Decomposed into 5 implementation branches (content model → run engine → run UI/juice → meta+modes →
  l10n/a11y), each merged with its KB update. Deferred: Build-a-Flag UGC, Classroom, Spot Check, teacher
  dashboard, full perk catalogue.

## 2026-06-19 · Core learning principle named: Unlearn → Relearn → Grow
- Adopted **[Unlearn → Relearn → Grow](../games/swipeed-core-principle.md)** as SwipeEd's single core
  learning principle (from the design doc): growth as gently un-learning half-truths and re-learning
  something truer; "replace, never just negate"; the **UN & RE** duo + a four-beat **Surface → Unlearn
  → Relearn → Grow** ritual, with Sam as the constant companion.
- Named it in [SwipeEd → design principles](../games/swipeed.md#design-principles); new concept doc; linked
  from the games + root indexes and from the games it already powers
  ([MythBuster: Gender](../games/mythbuster-gender.md), [Flip the Script](../games/flip-the-script.md),
  [Green Light / Red Light](../games/green-light-red-light.md)).
- **Status:** the principle is already embodied by shipped myth-bust/reveal/disguised-card mechanics +
  the spiral path; the **UN & RE characters** and the formal **ritual UI** are designed, not yet built.

## 2026-06-19 · Working conventions: branch-per-change + KB-with-every-merge
- Adopted a standing workflow: **every change on its own branch**, merged (`--no-ff`) or archived
  **before** the next thing: no committing straight to `main`, no stacking on unmerged work.
- **The knowledge base never lags the code:** each merge that touches a game or platform fact ships
  its `knowledge/…` update (concept doc + this log + cross-links) in the *same* branch.
- Recorded in `AGENTS.md` (+ `CLAUDE.md` → `@AGENTS.md`) here and in the SwipeEd repo's `AGENTS.md`.

## 2026-06-19 · SwipeEd path world: seasons, weather, day/night, companion
- New doc: **[SwipeEd: The Path World (3D)](../games/swipeed-world.md)**, the full R3F world behind the
  learning path (kept as a SwipeEd-app concept, not core-engine architecture).
- **Table-driven path:** the whole path (41 nodes, 5 chapter regions, thread tints, gold capstones,
  built-vs-disabled state, no gates) is generated from the **Master Node Table** xlsx via
  `gen-path.py` → `src/content/path.ts`. World scaled up (`PATH_SCALE=3`, ~3× node gaps, extended
  mountain horizon).
- **Seasons (Phase A):** five regions = Summer→Rainy→Autumn→Winter→Spring, as **per-region styling on
  the single path** (sky/fog/light/ground + foliage colormap recolour via `gen-colormaps.mjs`), with a
  smooth environment crossfade through a runtime `seasonRT` object. Autumn pushed orange, Winter near
  white; **Spring = cherry blossom** (a dedicated blossom colormap on the round-tree materials only).
- **Weather (Phase B):** camera-following rain / snow / falling leaves / blossom petals, tier-scaled,
  reduced-motion-aware. **Winter props (Phase 1.1):** season-aware Holiday Kit dressing (snow trees,
  snowmen, benches, lantern, snow patches/rocks), Holiday models shown only once winter is active.
- **Time of day + companion (Phase C):** a day/evening/night lighting layer composed on top of the
  season (moon/stars, lantern glow, once-per-session wind-down nudge); a **Mini-Characters companion**
  that walks the path beside the focused node, catches up on fast scrolls, faces the camera at rest,
  and casts a shadow.
- **Polish (Phase D):** weather **crossfades** at region boundaries (strength ramp) and **rain ground
  ripples** (instanced expanding-ring decals pinned to world ground, fading with the rain).
- **Mobile-safe loading:** staged mount (sky/land/mountains → path → visible-only foliage) + windowed
  fixed-capacity instanced foliage + dpr cap, after the 3× world OOM'd WebGL on phones.

## 2026-06-19 · SwipeEd becomes the app: 3D path + 10 gender games
- **Clarified the model:** **[SwipeEd](../games/swipeed.md) is the *app*** (the whole ages-3-18 RSE/CSE
  learning path), not a single game. [Green Light / Red Light](../games/green-light-red-light.md) is the
  *first game within it*. Reframed the docs and split each game into its own concept file: no "pack"
  lumping; see the [games catalog](../games/index.md).
- **3D learning path:** rebuilt the landing as a stylised React-Three-Fiber grassland path (Kenney CC0
  models, cel shading, instanced foliage, windowed nodes); `/path` is the default, `/classic` the 2D
  fallback. Rebranded to **SwipeEd** (name, logo, PWA icons).
- **Unified in-place play:** every game (swipe and engine alike) plays **in place over the
  grassland** via a shared `GameShell` + `engine-host` registry, and all finish into one shared
  `GameDone` card (`useSwipeGame` drives swipe decks).
- **Ten gender-equality games shipped**, each first-class, across five age bands and ~6 reusable lesson
  engines (tap, sort, choose-action, media-remix, sim): [Same Same, Different](../games/same-same-different.md),
  [Can-Do Kids](../games/can-do-kids.md), [Fair Play World](../games/fair-play-world.md),
  [Not Fair, Not Funny](../games/not-fair-not-funny.md), [Flip the Script](../games/flip-the-script.md),
  [Speak Up](../games/speak-up.md), [Stand Up](../games/stand-up.md), [Lead the Way](../games/lead-the-way.md),
  [Change Makers](../games/change-makers.md), [Justice League: Rights](../games/justice-league-rights.md).
- **Still self-contained:** these engines/games live in the SwipeEd repo, not yet on a shared Praxis
  [Engine SDK](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/engine-sdk.md): they are its seeds.

## 2026-06-18 · First game built: Green Light / Red Light (MVP)
- Built the real first game into the SwipeEd repo (the earlier scaffold was a placeholder):
  **[Green Light / Red Light](../games/green-light-red-light.md)**, a swipe game for spotting healthy vs unhealthy
  relationship behaviours (Next.js + vanilla shadcn + PWA), per the GDD's MVP. Live at
  https://swipeed.vercel.app.
- Data-driven cards (One Love 20-sign taxonomy), reveal, Flag-pedia, streaks/stars, end-of-deck
  debrief + review, persistent Get Help, School-Comfort Mode, unscored safeguarding cards, and
  accessible swipe (button + icon + label, never colour alone).

## 2026-06-18 · First game scaffolded & deployed (SwipeEd)
- [SwipeEd](../games/swipeed.md) scaffolded in its **own repo** (Next.js + vanilla shadcn + separate
  token system + PWA), pushed to GitHub, and deployed to **Vercel**, live at https://swipeed.vercel.app.
- Added [deployment](../architecture/deployment.md) (Vercel hosting model). Vercel Git auto-deploy needs
  a one-time GitHub-app authorization; CLI deploy used meanwhile.
