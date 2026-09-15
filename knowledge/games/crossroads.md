---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/crossroads.md
title: Crossroads
description: A branching life-sim for ages 9-12, where you live a pre-teen's week, choosing at each crossroads (peer pressure, a first crush, a falling-out, a family change) and watching the ripple through Trust and Wellbeing meters, then a debrief naming the skills used. No-fail, replayable.
resource: https://swipeed.vercel.app/game/crossroads
tags: [games, swipeed, relationships, decisions, ages-9-12, life-sim]
timestamp: 2026-06-20T15:30:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Crossroads

> **Reworked to GDD 16 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The decision-making node (and the **branching-dilemma flagship** of the whole app) is
> a **518-scenario typed library** (`content/games/crossroads.ts`: stop-think 80 · see-options 92 ·
> weigh-consequences 86 · decide-with-values 86 · friendship-crossroads 86 · own-your-choice 88), generated
> **faithfully** from the scorecard-passed GDD JSON, on the **shared v2 engine**
> (`components/games/v2-engine.tsx`). Every scenario is one of **seven typed play actions** (branch ×136 · reflect
> ×126 · strike-rewrite ×59 · role-play ×52 · sort ×49 · build ×48 · match ×48), **0% binary tap**, led by the
> **branching dilemma card** (branch: decide a real crossroads, see the ripple, get a debrief). **This is the
> reference branch engine** that later relationship/ethics nodes (Stand Up g27, Mutual g31, the adult dilemma
> games) reuse. Teaches the reusable routine: stop & think (pause), see your options (not black-and-white), weigh
> the consequences ("then what?", short vs long term), decide by your values, navigate friendship crossroads,
> and own your choice. Ethics: **decide, don't dictate**; **real autonomy** (dilemmas often have more than one
> defensible move; the game backs the child's reasoning); **safe to be wrong** (a weaker choice → learnable
> consequence, never a buzzer: "you can change course"; `reassure` + `reassureCats` ["own-your-choice"]);
> **values not preaching**; big/risky calls route to "ask a trusted adult" (safety dilemmas link
> [Boundary Bot](boundary-bot.md) g15 & [Safety Squad](safety-squad.md) g08: `helpLine` Childline 1098). Engine:
> **no new mechanic** (reuses 7 of 9); a `binStyle` valence accretion (long-loss/going-along/dodging/only-now/
> regret-later/rushes-you → red, real-option/good-long-term/owning-it/thinking-ahead/wise-choice → green).
> `gameId "crossroads"` (matches the registry id). Builds on [Friend or Frenemy?](friend-or-frenemy.md) (g09);
> prereq g15. The sections below describe the original v1 build (branching life-sim with meters), superseded by
> the v2 mechanic engine.

**Node #16: the ages 9-12 step of the Relationships thread.** It grows
[Friend or Frenemy?](friend-or-frenemy.md)'s friendship stories into a full **branching life-sim of a
pre-teen's week**: the player makes choices at the everyday crossroads of growing up (peer pressure, a
first crush, a falling-out, a change at home) and watches the consequences ripple through **Trust** and
**Wellbeing** meters, then gets a warm **debrief** from Lensy naming the skills they used. Replaying shows
there's rarely one "right" answer, but there are **wiser and kinder** ones. Crushes are handled gently,
**normalised as part of growing up, never pushed toward pre-teen dating** (which suits the age and the
Indian context). It is the child-level seed of the teen branching life-sims that follow.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `crossroads`, route `/game/crossroads`.
- **Type:** **branching life-sim** (a pre-teen's week) with **Trust + Wellbeing meters** + a reflective debrief · no fail · replayable.
- **Age band:** 9-12 · **Curriculum:** UNESCO 5.1 (peer influence), 5.2 (decisions), 5.3 (communication), 1.2/7.1 (feelings/crushes), 1.1/1.4 (family). Builds on Friend or Frenemy? (#9).
- **Status:** live · https://swipeed.vercel.app/game/crossroads

## How it works: a week at the crossroads
The week unfolds **Monday → Friday** as a branching story. Each crossroad offers choices; each choice
nudges the **Trust** meter (with friends/family) and the **Wellbeing** meter (how you feel) and plays out
a consequence. A **Stop · Think · Choose** reminder sits at every decision.
- **Peer Pressure** (a dare to skip class): go along · say no · suggest something else.
- **Crush Corner** (a first crush): the **UN & RE** beat: UN erases *"a crush is embarrassing/wrong, you
  must hide it or tell everyone"*, RE redraws *"a crush is a normal part of growing up; you don't have to
  act on it. Respect yourself and the other person."* Normalises the feeling **without** endorsing dating
  (softened further under **School-Comfort**).
- **Falling-out** (a best friend's new friend): sulk · spread a rumour · use your words.
- **Family change** (parents arguing): bottle it up · take it out on others · talk to a trusted adult.
- **Online teasing** (the class chat): join in · ignore · be an ally and report.

A choice that gives in to pressure might keep a friend happy but dent wellbeing; speaking up might cost a
little now but build trust and self-respect: **no fail, no single right answer.** The **end-of-week
debrief** names the skills used (refusing pressure, using your words, asking for help, being an ally,
respecting feelings) and shows the final meters; **replay** to explore the wiser, kinder paths. Finishes
into the shared [`GameDone`](swipeed.md) card. Reuses **Lensy** (narrator & debrief) + the shared
**`UnReBeat`** + the voice model.

## Inherited & new patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4: here a *consequence*, not a loss),
content-as-data (#1), shared juice (#11), audio contract (#10), the UN & RE move
([core principle](swipeed-core-principle.md)), **don't-villainise (#15)** (crushes normalised, never
shamed), **Made-for-India + School-Comfort (#14)**. Introduces the **meter-driven branching-life-sim +
reflective debrief** shape, the template the teen life-sims (Reality Check, Lines & Limits, Mutual)
inherit and deepen.

## Status & roadmap
- **Built:** the five-crossroad week with Trust & Wellbeing meters, the Crush Corner UN & RE beat, the
  Stop-Think-Choose tool, the skills debrief, and replay; English narration.
- **Deferred (GDD Phase 2/3):** deeper branching trees, crown levels (tougher weeks), the returning Ask-It
  box, the fuller Words Toolbox, Classroom-Mode polish, calm mode, and **Hindi**.
