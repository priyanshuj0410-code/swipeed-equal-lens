---
type: overview
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/swipeed-build-overview.md
title: "SwipeEd: what we built & why"
description: End-to-end synthesis of the SwipeEd content build, covering the product, the v2 mechanic-embodying engine, the forge content pipeline, the deterministic-gate + adversarial-reviewer safety design, and the run that grew all 69 games to ≥400 scenarios and shipped them live.
status: fleet complete, all 69 games grown to ≥400 & deployed (2026-06-29)
tags: [swipeed, overview, content, pipeline, engine, gender-games]
updated: 2026-06-29
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/96b2d905-cb66-4883-a846-9a897f7d8a03  # SWED-39
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/785d53d2-2943-49b3-9cad-96dce0c54bfb  # SWED-62
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/6d8a2d7c-843d-4058-964b-83f8181fc21b  # SWED-72
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# SwipeEd: what we built & why

This is the one-page-that-isn't-one-page: the whole picture of what the SwipeEd content build is,
how it's put together, and the reasoning behind each load-bearing decision. For the deep dives it
links out to the [content pipeline](swipeed-content-pipeline.md), the [reusable game
patterns](swipeed-game-patterns.md), the [core principle](swipeed-core-principle.md), and the
[SwipeEd app](swipeed.md) docs.

---

## 1. The product, in one breath

**SwipeEd (brand: The Equal Lens)** is an India-first, gender-equality & life-skills learning app for
**ages 3 → parenthood**. It teaches the skills of equal, safe, dignified relationships (consent,
boundaries, bodily autonomy, calling out bias, mental health, rights, money, parenting) through
**short, swipeable micro-interactions**, not lectures. It's a Next.js PWA, live at
**https://swipeed.vercel.app**, built in the repo `swipeed-equal-lens`, whose `knowledge/` folder is
the canonical [OKF](../README.md) knowledge base (copied there from owhile-engine on 2026-09-14).

The catalog is **69 games across 8 developmental chapters** (plus 8 ceremonial capstones), each game
a bank of bite-size scenarios. The design north star (from the GDD): *closer to a friendly messaging
app than a clinical health poster: cringe loses this audience.*

### The 8 chapters

| Ch | Age band | Theme | Games |
|----|----------|-------|-------|
| 1 | 3-6 | First feelings, body autonomy, fairness | 6 |
| 2 | 6-9 | Safety, friendship, media basics | 8 |
| 3 | 9-12 | Puberty, boundaries, values, defending the body | 9 |
| 4 | 12-15 | Body image, consent flags, online safety, rights | 11 |
| 5 | 15-18 | Sexual health, identity, allyship, the law | 9 |
| 6 | 18-22 | Dating, relationships, money, mind, rights (adult) | 9 |
| 7 | 22 → first child | Choosing a partner, equal partnership, family | 8 |
| 8 | Parenthood | Raising kids equally, safely, inclusively | 9 |

A child can, in principle, ride this from "my body, my rules" at age 4 to "be the safe adult" as a
parent, one continuous arc.

---

## 2. The engine: *mechanic-embodying*, not MCQ-in-a-skin

Every game renders through **one shared engine** (`src/components/games/v2-engine.tsx`); each game is
a **thin wrapper over a typed scenario library** (`v2-schema.ts`). The engine offers **7+ play
verbs**: `reflect`, `role-play`, `strike-rewrite`, `branch`, `sort`, `match`, `spot` (plus `swipe`,
`build`, `explore-label`).

**Why this shape.** The rejected v1 approach was an "MCQ factory": every lesson a quiz card in a new
skin. The v2 thesis is that *the mechanic itself is the lesson*: you don't answer a question about
consent, you **rewrite the myth** (strike-rewrite), **catch the red flags** (spot), **sort the
green/red** (sort), **say the line** (role-play). The interaction embodies the skill. See
[swipeed-game-patterns](swipeed-game-patterns.md) for the engine contracts.

A few engine decisions made earlier this arc, all to kill the "feels like a wrapper" complaint:
- **Anti-repeat rotation**: a per-game `swipeed:seen:<gid>` ring in localStorage; draws unseen beats
  first so a session feels fresh.
- **Shuffle-on-display** for every mechanic (sort chips, match columns) so answers aren't memorised by
  position.
- **Spot is multi-catch**: resolves only when *all* red flags are caught (enables "3 truths + 2 lies").
- **Explicit sort-bin `valence`** (`pos`/`neg`/`tell`/`uhoh`/`neutral`): the engine colours from data,
  not a brittle label-regex guess.

These are documented as the living [reusable patterns](swipeed-game-patterns.md): the seed
requirements for the future Engine SDK.

---

## 3. The problem we actually solved this run

The games *felt* like wrappers for two reasons. One was engine-side (fixed above). The deeper one was
a **shallow bank**: ~84 scenarios/game, ~14 per category. No engine tweak fixes that. With so few
beats, every session repeats and the world feels thin. **The fix had to be content: grow every game's
bank to a real depth.**

The founder set the target: **≥400 scenarios per game, the full fleet of 69 games** (~21,800 net-new
scenarios at the floor; the fleet landed at 33,542, roughly 27,700 net-new), each **GDD-grounded, India-real, web-validated, age-correct, and safe**, at the upgraded
mechanic shapes (sort 6 items, spot 5/2, match 5). And a **quality-first floor**: a genuinely
idea-thin game may land *just under* 400 with a logged exhaustion note, rather than shipping
paraphrase filler.

---

## 4. The forge content pipeline: the engine of the build

The pipeline lives in `swipeed-equal-lens/scripts/forge/`. Its design is captured fully in
[swipeed-content-pipeline](swipeed-content-pipeline.md); the essence:

### The one principle
> **Anything a Python script can prove, a script proves and BLOCKS on, recomputed from the committed
> `.ts`, never an agent's self-report.** Only irreducibly semantic judgments (is this answer key
> correct? age-appropriate? a reskin?) go to an **adversarial agent in a different context than the
> generator**, force-triggered by deterministic tripwires.

This came from a hard lesson: in an earlier workflow, agents self-certified "pass" and silently
skipped 16 malformed lines. Self-report is not verification.

### The per-game workflow (`gen_workflow.js`, run via the Workflow tool, ~1M tokens/game)
1. **Ground**: read the game's GDD PDF + scenario library + chapter personas + schema; write a
   `GROUNDING.md` with per-category teaching intent, 6-10 GDD-cited "truth anchors", persona voices,
   the exact helpline string, and banned framings.
2. **Generate**: one agent per category, forced to the target mechanic shapes, self-validating against
   the deterministic gate until clean; **quality-first** (stop and log exhaustion rather than pad).
3. **Review**: a *different-context* adversarial agent per category independently re-derives every
   answer key and checks age-tone, autonomy, and truth-anchor faithfulness, editing in place.
4. **Assemble + gate**: merge all batches into `<game>.ts` (parse-or-die round-trip), run the blocking
   merge gate + whole-bank dedup; log `exhaustion.json` if under 400.

### The safety boundary, in code (`common.py`)
- **Verified India helpline allowlist** (name↔number), founder-signed-off: Childline 1098, Women
  181/1091, Emergency 112, Tele-MANAS 14416, Cyber 1930, NALSA 15100; laws pinned
  (age of consent 18, POCSO, POSH, DV Act, PCMA, PCPNDT, RPwD, BNS). **Direct number-binding only**, so
  a wrong or invented number is blocked. (KIRAN 1800-599-0019 was on the original list; it was retired on 2026-09-14 as merged into
  Tele-MANAS, [SWED-62](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/785d53d2-2943-49b3-9cad-96dce0c54bfb).)
- **Age-band mechanic allowlist**: ages 3-6/6-9 get **no spot/swipe** (no "spot the predator" for
  toddlers).
- **Required-field validation**: full Base + per-type fields, mirroring the TS Scenario union, so a
  scenario can't pass the gate and then fail `tsc`.
- **Band ceilings, length caps, dedup** (intra-band blocks / cross-band logs), narrator pin, US-framing
  bans, etc.

---

## 5. The two-layer design, and why the adversarial reviewer is load-bearing

The single most important architectural idea: **split verification by what each layer can actually
know.**

- The **deterministic gate** is perfect at *structure*: shapes, counts, lengths, helpline numbers,
  required fields, duplicate ids. It is **structurally blind to whether an answer key is correct.** A
  sort that bins "breakfast before the exam" as "stress-spiking" is *valid* JSON with a *valid* shape.
- The **adversarial reviewer**, in a different context than the generator and forced to re-derive every
  key from scratch, is the **only** thing that catches a wrong key. With no fail-state in the engine, a
  wrong key silently teaches the *unsafe* reflex. So this layer is the safety net, not a formality.

**The evidence it earned its place** (every one structurally valid → invisible to the gate; every one
caught and fixed before merge, independently re-verified):
- **bounce**: 7 exam-stress *sort* boards with **fully inverted keys** (calm habits keyed "stress-
  spiking", self-compassion keyed "harsh").
- **speak-up ×8, glrl ×7, body-confident ×1**: *spot* scenes where the *good/upstander* item was
  marked the red-flag-to-catch (would brand "fetch a teacher" a red flag, praise "films the teasing").
- **firewall**: a grooming "meet-them-to-verify-identity" framing; **crossroads**: "secret-keeping =
  loyalty"; **change-makers / lead-the-way / justice-league**: under-18 disclosures misrouted to the
  women's line instead of Childline 1098, and a DV item that named the legal process before "call 112
  now".
- **mind-belonging / body-confident**: depicted disordered-eating methods removed; **flip-script**: a
  transphobic slur stripped from a 9-12 hook; **break-the-cycle**: the shaken-baby urge keyed to "lay
  baby down safely, step out"; **be-the-safe-adult**: CSA disclosure handled as believe / never-
  promise-total-secrecy / report.

**Zero answer-key inversions shipped.** Where a failure mode recurred, we then hardened the *generator*
so fewer are produced wrong in the first place (see §6).

---

## 6. The run (14 → 69), and the hardenings learned along the way

Starting from 14/69 grown, the fleet ran in **waves of 2 games**, each wave: plan → generate ×2 →
independently verify (`forge_check --game` + `forge_dedup --verify` + `check_msg_len` + `tsc` +
narrator==Lensy) → commit on its own branch → `--no-ff` merge → deploy via the prebuilt Vercel flow →
update the KB. **27 waves grew 55 games**; combined with the prior 14, **all 69 are at ≥400 and live**
(two logged quality-first dips: looking-after-you 397, raising-neurodiverse-kids 396).

**Three pipeline hardenings shipped mid-run, each after a failure mode showed up, and each drove its
error class to zero on the next wave:**
- **Ground-stage retry (SWED-10)**: a transient server rate-limit nuked a whole run at grounding; now
  it retries 3× and fails with a clear, actionable error.
- **Spot-polarity rule (SWED-17)**: after 16 spot key-inversions, the generator prompt now pins
  `trick:true` = the red-flag-to-catch and forbids hooks that point at the good items. Zero spot
  inversions afterward.
- **Narrator pin (SWED-27)**: a stale GROUNDING leaked the original "Sam:" narrator (the live re-skin
  uses "Lensy:"); the generator prompt now pins Lensy. Verified 0 "Sam" on every subsequent game.

**Resilience:** the build survived two account session-limits and a transient throttle. Each time the
workflow rolled back cleanly (it only writes after full validation), and we recovered with a backoff +
**staggered single-game relaunch**, no content lost.

---

## 7. Tooling, guardrails, and process

- **forge toolkit** (`scripts/forge/`): `common.py` (the safety boundary), `bank_spec.py` (gap report),
  `forge_plan.py` (band-aware quotas), `forge_check.py` (the deterministic gate, used as both per-batch
  lint and blocking merge gate), `forge_assemble.py` (parse-or-die merge), `forge_dedup.py` (whole-bank
  MinHash/simhash dedup), `gen_workflow.js` (the per-game orchestration), `test_gates.py` (fixtures
  proving malformed content is rejected).
- **Repo guardrails** (git hooks, and since SWED-72 every build): `content_gate.py` (every per-scenario check, ≤160/field,
  band ceilings, helplines on every field, bank size; replaced `check_msg_len.py`), the **read-first guard** (prints the
  authoritative master-node-table on game-file commits so the next node is never mis-stated), and a
  **Plane-issue guard** (blocks app-code edits without an active `[SWED-n]` marker).
- **Process discipline** (per `AGENTS.md`): branch per change, `--no-ff` merge before the next thing,
  **the knowledge base never lags** (every merge updates `knowledge/`), and **Plane tracking**: a SWED
  project with 39 issues at the time (2026-06-29), all closed, every commit `[SWED-n]`-tagged.

---

## 8. Repo topology & deployment

*Updated 2026-09-14; during the June run the picture was different, see the note below.*

- **`swipeed-equal-lens`**: the app repo (Next.js + the v2 engine + the forge tooling + content), on
  GitHub at `priyanshuj0410-code/swipeed-equal-lens`. Vercel project `swipeed` is git-connected to it, so
  **a push or merge to `main` deploys** to https://swipeed.vercel.app. See [deployment](../architecture/deployment.md).
- **This knowledge base**: `knowledge/` in the same repo: the game catalog, patterns, content pipeline,
  [log](../log/log.md), [v2 engine](../architecture/v2-engine.md), [question bank](../schemas/question-bank.md)
  and [design system](../design.md). It was copied here from owhile-engine on 2026-09-14 (SWED-61) so the
  docs can ship in the same change as the code.
- **`owhile-engine`**: the Owhile venture's repo (formerly Praxis). It held SwipeEd's knowledge base until
  2026-09-14 and keeps its own engine and forge docs; see its [repo topology](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/repo-topology.md).

> **During the June run** the app repo had no GitHub remote, the Vercel git connection pointed at the older
> `SwipeEd` repo, and each wave shipped with the prebuilt CLI flow (`vercel build --prod`, then
> `vercel deploy --prebuilt --prod`). That changed on 2026-09-01.

---

## 9. Where it stands & what's next

**Done:** all **69 games (Chapters 1-8, ages 3 → parenthood)** grown to ≥400 scenarios: India-real,
GDD-grounded, age-correct, gate-verified, adversarially reviewed, merged, and **live**. No answer-key
inversions shipped; every helpline/number on the verified allowlist; the whole arc deployable today.

**Possible follow-ups (not started):**
- Grow the **8 ceremonial chapter capstones** (intentionally small today).
- A periodic **whole-bank `forge_dedup` sweep** as the bank keeps growing.
- Fold the proven mechanic shapes + the gate/reviewer split into the future **[Engine
  SDK](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/engine-sdk.md)**: the forge `common.py` contracts are its content-validation seed.

## Related
- [Content pipeline (forge)](swipeed-content-pipeline.md) · [Reusable game patterns](swipeed-game-patterns.md)
  · [Core principle: Unlearn → Relearn → Grow](swipeed-core-principle.md) · [SwipeEd app](swipeed.md)
  · [Project log](../log/log.md)
