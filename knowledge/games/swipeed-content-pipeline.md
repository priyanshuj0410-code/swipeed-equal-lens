---
type: architecture
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/swipeed-content-pipeline.md
title: SwipeEd content-growth pipeline (forge)
description: How the forge pipeline grew every SwipeEd scenario bank from about 84 to the 400 target, wave by wave, and the gates each batch had to pass.
status: COMPLETE - all 69 games (Ch.1-8, ages 3→parenthood) grown to ≥400 & deployed
tags: [swipeed, content, pipeline, validation, gender-games]
updated: 2026-06-29
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
---

# SwipeEd content-growth pipeline (`forge`)

Grow every game's scenario bank from ~84 → **target 400** (full fleet = 69 games, ~21,800 new scenarios at the 400 floor; the fleet actually landed at 33,542 scenarios, roughly 27,700 net-new),
each GDD-grounded, India-real, web-validated, typed, ≤160/field, under its chapter band ceiling, at the
**upgraded mechanic shapes** (sort 6 items · spot 5 items / exactly 2 tricks · match 5 pairs). Lives in the
isolated app repo at `swipeed-equal-lens/scripts/forge/` (see `scripts/forge/DESIGN.md`). Born from the
founder ask "games still feel like wrappers" - the deepest cause was a shallow bank (~14 scenarios/category),
which no engine tweak can fix.

## The one principle
**Anything a Python script can prove, a script proves and BLOCKS on - recomputed from the committed `.ts`,
never an agent's self-report.** Only irreducibly semantic judgments (is this answer key correct?
age-appropriate? a reskin?) go to an adversarial agent **in a different context than the generator**, and even
those are **force-triggered by deterministic tripwires** so the review can't be skipped where it matters
(safeguarding/consent/puberty, young bands, dup clusters). This is the lesson from the earlier trim workflow,
where agents self-certified "pass" and 16 malformed lines were silently skipped.

## Architecture - OWHILE-FORGE
Per-game resumable Task on its own branch; fan-out generation per category (forced mechanic per batch so the
hard verbs get authored, not easy reflects); fan-out adversarial validation; a **Python-only merge gate**.
Flow: PLAN → GROUND (read 5 attested docs, hash-pinned) → GENERATE → REGEN LOOP (deterministic lint → web fact
check → semantic reviewer, ≤1 bounce then drop) → ASSEMBLE + whole-bank DEDUP → MERGE GATE → `--no-ff` + KB.

## The tooling (built + verified against the live bank - now ~33,500 scenarios)
- `common.py` - the safety boundary in code: web-verified India helpline name↔number allowlist (precise
  direct-binding, **0 false positives** on the bank; the bank already uses only correct numbers), band map,
  **age-band mechanic allowlist** (Ch.1-2 disallow spot/swipe - no "spot the predator" for ages 3-6),
  must-be-true field roles (facts enforced only where the app asserts truth, **not** in deliberate myths/lies),
  parse-or-die, dedup normalization, per-mechanic structural validators.
- `bank_spec.py` - coverage/gap report (the generator's input).
- `forge_plan.py` - band-aware per-(category × mechanic) quota + legacy-reshape worklist.
- `forge_check.py` - the deterministic validator, used as **both** the per-batch lint and the blocking merge
  gate. Correctly blocks the un-upgraded bank (legacy 4-item sorts, missing valence, mix/count).
- `forge_assemble.py` - merge a batch into `<game>.ts` with a parse-or-die round-trip.
- `forge_dedup.py` - whole-bank structural + prose dedup, band-aware, helpline-masked. **Intra-band blocks,
  cross-band logs.** Surfaced 10 pre-existing intra-chapter twins (cross-game reflects) worth cleaning. (A 2026-09-14 re-check found 2 intra-chapter pairs still present; see the [question bank](../schemas/question-bank.md#known-issues).)

## Verified allowlist (the safety boundary - founder-signed-off 2026-06-24)
Childline **1098** · Women **181**/**1091** · Emergency/Police **112**/**100** · Tele-MANAS **14416** · KIRAN
**1800-599-0019** · Cyber **1930** · NALSA legal aid **15100**. Laws pinned: age of consent **18**, POCSO 2012,
POSH 2013, DV Act 2005, BNS 2023, PCMA 2006. Web-verified vs india.gov.in + childlineindia.org.

## Locked decisions
- **Floor = quality-first** (founder): target 400/game, but a genuinely idea-thin game may land **under 400 with
  a KB-logged distinct-idea count** rather than ship paraphrase filler. The one logged exception in the rubric.
- **Explicit sort-bin `valence`** (`pos`/`neg`/`tell`/`uhoh`/`neutral`) - engine colours from it, regex only
  for legacy bins. Kills the binStyle guessing-trap class for new content. See [[game-patterns-doc]].
- Direct-`.ts` authoring; dedup ~0.82 Jaccard, intra-band blocks / cross-band logs.

## Proven (2-game pilot, deployed)
Full per-game workflow (ground → generate + adversarial-review/category → assemble → merge gate; 14 agents,
~1M tokens, ~21 min/game) validated on two opposite games and independently gate-verified:
- **my-body** (Ch.1, 3-6): 84 → **486** - no spot/swipe for the band, sorts at 6+valence, matches at 5.
- **consent-real** (Ch.6, adult): 84 → **524** - spots 5/2, survivor-centred, helplines allowlist-only,
  correctly **no Childline 1098** in an adult game.
Verifying caught two real bugs (now fixed): the band counter was looser than the pre-commit guard (aligned), and
a filename≠gameId game lost its chapter (chapter_of resolves the runtime gameId). The generation workflow is
`scripts/forge/gen_workflow.js` (parameterised by gameId).

## Progress
**ALL 69 games at ≥400 - fleet complete** (Chapters 1-8, ages 3 → parenthood). Waves 5-31 grew 55 games
(smart-screen … navigating-addictions 435, be-the-safe-adult 406). 67 games at ≥400; two logged quality-first
dips (looking-after-you 397, raising-neurodiverse-kids 396, both `exhaustion.json`). Every game independently
gate-verified, `--no-ff` merged, and deployed per wave. **Narrator note:** the
Equal Lens re-skin narrator is **"Lensy:"** (bank-wide); GROUNDING derived from original GDDs can leak the old
**"Lensy:"** - generator prompt hardened to pin Lensy (SWED-27; validated 0-Lensy on wave 21). **Answer-key inversions were a
systematic generator failure** through waves 8-11 - speak-up ×8, body-confident ×1, glrl ×7 (16 **spot** hook/key
inversions), plus bounce ×7 **sort**; all structurally valid → shape-gate blind; the different-context reviewer's
re-derivation caught every one (load-bearing; see [[swipeed-game-patterns]]). **Wave 12 (after SWED-17 added an
explicit spot-polarity rule to the generator prompt) produced 0 spot inversions** across both games - hardening
validated; reviewer stays the safety net.

**Hardening (wave 5):** the Ground stage now retries 3× on a transient server rate-limit (a 3-at-once burst
killed mind-matters' first attempt there; it rolled back clean). Cadence is now **waves of 2** to avoid
over-saturating the API.

## Next - the fleet
**0 remaining games - the fleet is complete.** All 69 nodes (g01-g69, Chapters 1-8) grown to ≥400 and live.
Possible follow-ups (not started): grow the 8 chapter capstones (ceremonial, intentionally small today); a periodic
forge_dedup --verify sweep across the whole bank; fold the proven shapes into the future Engine SDK. Remaining
nicety: `read_first --gate-expansion` (the current `--gate` no-ops on expansions since every game is already v2 -
the existing pre-commit hooks + a deliberate override cover the runs).
