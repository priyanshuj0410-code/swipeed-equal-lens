---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/equalize.md
title: Equalize
description: A balancing-sim for ages 12-15 - close the gap between believing in equality and living it. Spot the belief-vs-practice gap, rebalance the second shift, equalize a class/workplace/community, bust the zero-sum myth (UN & RE), and be the change. Hopeful, non-zero-sum, no-fail.
resource: https://swipeed.vercel.app/game/equalize
tags: [games, swipeed, gender-equality, ages-12-15, balancing-sim]
timestamp: 2026-06-20T19:30:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
---

# Equalize

> **Reworked to GDD 26 v2 - the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The gender-equality **balancing-sim** node (Thread E, ages 12-15) is now a
> **520-scenario typed library** (`content/games/equalize.ts`: belief-vs-practice 91 · unpaid-load 85 ·
> pay-and-power 81 · pays-off 82 · child-marriage 91 · rebalance-it 90), generated **faithfully** from the
> scorecard-passed GDD 26 JSON, on the **shared v2 engine** (`components/games/v2-engine.tsx`). The old
> balancing-sim build is replaced by **seven typed play actions** (branch ×110 · strike-rewrite ×93 · sort ×81 ·
> reflect ×66 · match ×53 · role-play ×60 · build ×57), **0% binary tap**, led by **branch** (rebalance choices),
> **strike-rewrite** (bust the myth) and **sort** (gap vs lived practice). Arc: belief vs practice → the unpaid
> load → pay & power → equality pays off → child marriage → rebalance it. Spot the gap between *believing* and
> *living* equality, share the invisible unpaid-care load, see equality is **not zero-sum** (lifts everyone,
> boys included), and rebalance home/school/community. **Child marriage is handled as a RIGHTS issue** -
> respectful, non-graphic, legally accurate (illegal in India; 18 for girls), **never blaming the target**,
> evenhanded (it harms boys too), and it **always routes an at-risk child to a trusted adult / Childline 1098**
> (`reassureCats` ["child-marriage"] + `reassure` + helpLine). `gameId "equalize"` (matches the registry id).
> Engine: **no new mechanic** (reuses 7 of 10); `binStyle` unchanged (existing regexes handle the valenced
> bins - fair/unfair, fact/myth, anyone/one-gender, helps-men; the rest are acceptable neutral two-category
> distinctions). Build modes assemble+sequence → buildLabels. Builds on [Fair Play World](fair-play-world.md)
> (g10); prereq g25. The sections below describe the original v1 build, superseded by the v2 mechanic engine.

**Node #26 - the Gender & Respect step that closes the gap between *believing* in equality and *living*
it** (ages 12-15). Most people say they believe in equality - so why is the work, the pay and the power
still so unequal? The teen **spots the gap, rebalances it, and sees that equality lifts everyone**
(non-zero-sum). It's the natural next step after **MythBuster: Gender (#25)** - once you know the
stereotypes are false, this shows where the inequality still *lives* and how to shift it - and carries the
fairness instinct of [Fair Play World](fair-play-world.md) (#10) and [Not Fair, Not Funny](not-fair-not-funny.md)
(#11) into **structural** fairness, handing directly to **Stand Up (#27)**. Hopeful throughout; it changes
the **pattern**, not the person.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `equalize`, route `/game/equalize`.
- **Type:** reading-light **balancing-sim + learning** · no punitive fail · Q&A private.
- **Age band:** 12-15 · **Curriculum:** UNESCO 3.2 (gender equality), 4.1 (gender-based discrimination). Builds on #25; sets up #27/#33/#34.
- **Status:** live · https://swipeed.vercel.app/game/equalize

## How it works - five modes + the Badge Book
1. **The Equality Gap** - the belief-practice gap in plain sight: "we share the housework" (but mostly she
   does), "equal pay" (yet a real gap remains), "anyone can lead" (yet few women hold power).
2. **The Second Shift** - a household sim: every unpaid chore starts "on her"; tap each to **share** it
   until the load is **genuinely balanced**.
3. **Equalize!** - the signature: spot the imbalance in a **class / workplace / community** and rebalance
   it (equal turns to lead, fair hiring by default, equal voice and representation).
4. **Equality Lifts Everyone** - the **UN & RE** beat: UN busts *"equality means men lose"*, RE shows
   *"when the old roles loosen, everyone - including boys and men - gets more freedom, closeness and less
   pressure."* (Non-zero-sum.)
5. **Be the Change** - concrete actions a teen can take now (share chores, speak up when a girl's idea is
   ignored, encourage anyone toward any role, split group work fairly, name a double standard).

A 5-badge **Badge Book** finishes into the shared [`GameDone`](swipeed.md) card. Reuses **Lensy** (teen look)
+ the shared **`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), the UN & RE move ([core principle](swipeed-core-principle.md)), **India framing
(#14)** (the second shift / unpaid care; Beti Bachao framing), and **don't-villainise (#15)** - *changes
the pattern, not the person*; the non-zero-sum reframe keeps boys and men on side.

## Status & roadmap
- **Built:** The Equality Gap, The Second Shift (share-to-balance sim), Equalize! (spot-and-fix scenes),
  Equality Lifts Everyone (UN & RE), Be the Change; the Badge Book; English narration.
- **Deferred (GDD Phase 2/3):** a richer drag-to-rebalance sim, a fuller scenario bank, crown levels, the
  returning Ask-It Q&A, Classroom-Mode polish, calm mode, and **Hindi**.
