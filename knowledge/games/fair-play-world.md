---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/fair-play-world.md
title: Fair Play World
description: A tap-to-assign game for ages 6-9. Share chores, schooling and play fairly across a household, raising a Fairness Meter and unlocking Rights Cards.
resource: https://swipeed.vercel.app/game/fair-play
tags: [games, swipeed, gender-equality, ages-6-9, sort-engine]
timestamp: 2026-06-19T12:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f4f2b093-af4a-4dc3-ba7e-ae11b7838c58  # SWED-85
---

# Fair Play World

> **Reworked to GDD 10 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The fairness game in the Gender & Respect thread is a **495-scenario typed library**
> (`content/games/fair-play.json`: what-is-fair 81 · chores-shared 73 · fair-opportunity 85 · equal-vs-equity 83
> · stand-up 83 · fair-everywhere 90), generated **faithfully** from the scorecard-passed GDD JSON, on the
> **shared v2 engine** (`components/games/v2-engine.tsx`). Every scenario is one of **eight typed play actions**
> (branch ×123 · reflect ×92 · strike-rewrite ×62 · sort ×66 · role-play ×57 · match ×47 · build ×48 · spot ×3),
> **0% binary tap**, led by fairness **dilemmas** (branch: decide the fair move, see the ripple, get a
> debrief), the **fair-chore-chart builder** (build), and **spot-the-unfair-rule** scenes (spot). Fairness as
> **gender equality**: what fair means (a turn / what you need), sharing chores by turns not gender (**India's
> chore gap named plainly**: girls do ~40% more), fair opportunity, **equity** (fair can mean meeting
> different needs, like the box-to-see-over-the-wall), and spotting/standing up to unfair rules. Ethics: **decide,
> not be told** (multiple good moves; the child reasons it out, built for the justice-seeker Ananya); **both
> directions** (frees girls toward chances AND boys toward home help; **no gender villain**); **safe to be
> wrong**; **family-safe** ("everyone helps the family", an elder can nod to). Engine: **no new mechanic**
> (reuses 8 of 9); a `binStyle` valence accretion (unfair/hogging/blocks-it/one-gender/not-really-fair → red).
> **`gameId "fair-play"`** kept (the GDD/library's `fair-play-world` is **design-doc only**); the config must
> use the engine-host registry id or the game won't launch. Wrapper kept as `FairPlayGame`. The sections below
> describe the original v1 build (Fairness-Meter sort game), superseded by the v2 mechanic engine.

**Node #10: the fairness step of the Gender & Respect thread** (ages 6-9). Where What Makes Me, Me
taught that gender "rules" are learned, this asks the next question: *so let's make things fair.* The
child **runs a little world**: share the chores, chances and rights fairly, watch the **Fairness Meter**
balance, feel unfairness on **Swap Day**, and bust the unfair "rule" with **UN & RE**. The most
India-pointed early game (son-preference, unpaid care, girls' education), warm, even-handed (boys share
the housework too), in the spirit of Beti Bachao, Beti Padhao.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `fair-play`, route `/game/fair-play`.
- **Type:** reading-light **run-a-fair-world / assign** game (the **Fairness Meter** at its centre) · no fail.
- **Age band:** 6-9 · **Curriculum:** UNESCO 3.2 (equality & stereotypes), 1.1 (families), 2.2 (rights), 1.3 (respect). Builds on What Makes Me, Me (#7); aligns with Beti Bachao, Beti Padhao.
- **Status:** live (rebuilt to the GDD) · https://swipeed.vercel.app/game/fair-play

## How it works: five modes + the Fair Play Badge Book & Rights Cards
1. **Share the Work**: assign chores (cooking, fixing the fan, the bills, baby care); "Everyone shares" balances the **Fairness Meter**, a single person gets a gentle nudge ("Only Ma? Let's share!").
2. **Fair Chances**: share opportunities (school, cricket, the new bike, computer time); "Share, both!" is fair (busting "send the boy, keep the girl home").
3. **Rights for Every Child**: collect **Rights Cards** (school, play, safety, a say).
4. **Swap Day**: flip the roles; feel the other side (the empathy engine).
5. **Bust the 'Rule' (UN & RE)**: unfair patterns dressed as natural ("only girls do the housework", "boys don't help"): UN erases *"that's just how it's always been"* (never blaming the family), RE redraws *"everyone shares; every child deserves the same chances."*

Even-handed throughout (boys sharing housework matters as much as girls getting chances; never says one
gender is "better"). Reuses **Lensy** + the shared **`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), the UN & RE move ([core principle](swipeed-core-principle.md)), **India framing
(#14)**, warm, positive, preserves caring for family/elders while showing the work can be shared.

## Status & roadmap
- **Built:** all five modes, the Fairness Meter, the Badge Book + Rights Cards, the UN & RE rule-busting; English narration.
- **Deferred (GDD Phase 2/3):** a draggable scene with a literally-leaning world, a fuller chore/chance/rights bank, Classroom-Mode polish, the daily streak, and **Hindi**.

## Statistics (2026-10-03)

[SWED-85](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f4f2b093-af4a-4dc3-ba7e-ae11b7838c58): the chore gap in `fp-014`, `fp-069` and `fp-946` is now the worldwide figure it is, attributed to UNICEF: girls aged 5 to 14 do about 40% more unpaid chores than boys. It is no longer presented as India's figure.
