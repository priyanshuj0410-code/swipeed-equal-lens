# forge: the content-growth pipeline (locked design)

Grow every game's scenario bank from ~84 → **target 400** (full fleet; ~21.8k new scenarios), each
GDD-grounded, persona-aligned, India-real, web-validated, in the typed v2 schema, ≤160/field, under its
chapter band ceiling, at the **upgraded mechanic shapes** (sort 6 items · spot 5 items / exactly 2 tricks ·
match 5 pairs). Reshape the legacy shapes too (797 sorts / 377 spots / 455 matches).

## Core principle (the whole point)
**Anything a Python script can prove, a script MUST prove and BLOCK on: recomputed from the committed
`.ts`, never from an agent's self-report.** Only irreducibly semantic judgments (is this answer key correct?
age-appropriate? a fresh idea or a reskin?) go to an **adversarial agent in a different context than the
generator**, and even those are **force-triggered by deterministic tripwires** so the review can't be skipped
where it matters (safeguarding/consent/puberty categories, young bands, structural-dup clusters). No agent
self-report is ever the gate. (This is the exact failure that bit the earlier trim workflow: 16 silently
skipped lines, agents self-certifying pass.)

## Architecture: PRAXIS-FORGE (composed)
Per-game resumable Task on its own branch `docs/forge-<gXX>`; fan-out generation per category; fan-out
adversarial validation; a **Python-only merge gate** that recomputes every count/shape/fact/dedup truth from
the committed `.ts`. Keystones folded in: whole-bank **structural-signature** dedup as the primary blocking
index; a hard **`parsed_count == intended_count`** assertion; a deterministic **claim-sniffer** that does NOT
trust the generator's `needsFact` self-classification.

## Per-game flow
1. **PLAN** (`forge_plan.py`) → `.forge/<gXX>/plan.json`: quota per (category × mechanic) sized from the
   library's `leadMechanics`, **band-aware mechanic allowlist** (Ch.1-2 disallows spot/swipe unless the
   library lists them: no "spot the predator" for ages 3-6), persona roster, band ceiling, intended_count,
   existing fingerprints, and the legacy-reshape worklist.
2. **GROUND**: an agent reads the 5 attested docs → `GROUNDING.md` (truth-anchors, persona voice, age band,
   exact helpline string, banned framings). `read_first.py --attest-expansion` hash-pins the docs.
3. **GENERATE**: one agent per category; each batch is handed a **forced mechanic** from the remaining quota
   (so the hard verbs get authored, not easy reflects), `GROUNDING.md`, the schema, and the category's
   structural-signature/bloom set. Emits NDJSON + `_evidence` / `_anchor` sidecars, ~15% over-slack.
4. **REGENERATION LOOP** (bounded, ≤1 bounce → else drop): `forge_lint.py` (deterministic) → web validation
   on sniffer-flagged claims → a **separate** adversarial reviewer agent for the semantic verdicts.
5. **ASSEMBLE + DEDUP**: `forge_assemble.py` writes the `.ts` (preserving the 84 + config), round-trips
   through the parser asserting count match; `forge_dedup.py` runs the whole-bank pass.
6. **MERGE GATE** (pre-commit chain, all Python): `forge_parse_or_die` → `read_first --gate-expansion` →
   `forge_helpline` → `content_gate` → `forge_shape` → `forge_mix` → `forge_dedup --verify` →
   `forge_evidence`. Green → `--no-ff` merge + KB update in the SAME branch. Red → re-enter at the failing
   stage, truth re-derived from the `.ts`.

## Locked decisions (founder + engineering)
- **Floor = quality-first.** Target 400/game, but a genuinely idea-thin game may land **under 400 with a
  KB-logged distinct-idea count** rather than ship paraphrase filler. The IDEA-EXHAUSTION agent + a
  deterministic diversity metric certify genuine exhaustion; this is the ONE logged exception. Reallocate
  within a game before ever dipping.
- **binStyle valence is now data-driven.** Sort `bins` carry an optional explicit `valence`
  (`pos`|`neg`|`tell`|`uhoh`|`neutral`); the engine uses it when present and falls back to the legacy regex
  only for un-migrated bins. Removes the regex-guessing valence-trap class for all new content. `forge_shape`
  requires every NEW sort bin to declare `valence`.
- **Direct-`.ts` authoring** (not library-first transpile); `forge_parse_or_die` pins integrity.
- **Dedup:** intra-band near-dups **BLOCK**; cross-band near-dups are **LOGGED** (legit age re-teaching).
  Threshold (~0.82 Jaccard) calibrated on the existing 84×69 corpus before the fleet run.
- **Helpline/law allowlist = the safety boundary.** Byte-exact name↔number binding, version-pinned, built
  from official sources and **signed off by the founder before the fleet run**. Periodic re-validation TTL
  (laws change: IPC→BNS already happened).

## Script inventory
`forge/common.py` (shared parse/normalize/data) · `forge_plan.py` · `forge_parse_or_die.py` ·
`forge_lint.py` · `forge_helpline.py` · `forge_shape.py` · `forge_mix.py` · `forge_dedup.py` ·
`forge_evidence.py` · `forge_assemble.py` · `forge_run.py` · `read_first.py` (extend: `--*-expansion`).
`bank_spec.py` stays the human-readable report; `forge_shape.py`/`forge_mix.py` are its blocking twins.
