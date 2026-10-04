---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/heart-smart.md
title: Heart Smart
description: "SwipeEd node #g41 (ages 6-9), the empathy & getting-along game. With Lensy, an early-primary child reads feelings in self and others, handles big feelings in small healthy steps, chooses kindness, sorts squabbles, and meets the first gentle UN & RE. The missing 6-9 link in the Feelings & Life Skills thread."
resource: https://swipeed.vercel.app/game/heart-smart
tags: [games, swipeed, ages-6-9, sel, empathy, emotions, conflict-resolution, kindness, sam, un-re]
timestamp: 2026-06-21T14:30:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Heart Smart

> **Reworked to GDD 41 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The deeper 6-9 emotional-intelligence node, **completing Chapter 2 to v2**, is a
> **487-scenario typed library** (`content/games/heart-smart.json`: complex-feelings 82 · handling-big 81 ·
> empathy 14 · getting-along 85 · kindness-gratitude 78 · heart-toolkit 80), generated **faithfully** from the
> scorecard-passed GDD JSON, on the **shared v2 engine** (`components/games/v2-engine.tsx`). Every scenario is
> one of **seven typed play actions** (branch ×109 · reflect ×111 · role-play ×62 · strike-rewrite ×53 · match ×53
> · sort ×47 · build ×52), **0% binary tap**, led by **feeling-moment dilemmas** (branch: choose how to handle
> a feeling/conflict, see it shrink or mend, get a debrief), **say-the-self-talk** (role-play), and the
> **heart-toolkit builder** (build). SEL literacy for 6-9: naming the trickier feelings (jealousy, worry,
> disappointment, gratitude), a bigger regulation toolkit (name → breathe → talk → move → solve), empathy &
> perspective-taking, conflict repair, and kindness & gratitude. Ethics: **all feelings valid** (never shames a
> feeling; separates feeling from action); **empathy for everyone** (explicitly for boys too; links
> [Feelings Friends](feelings-friends.md) #g01); **safe to be wrong** (gentle debriefs, no buzzer);
> **help-seeking normalised** (config `helpLine` = Childline 1098 + `reassure` + `reassureCats`
> ["heart-toolkit"] → "asking for help is brave" banner + Get-Help pill on toolkit beats). Engine: **no new
> mechanic** (reuses 7 of 9); only a `binStyle` valence accretion (calms/empathic → green, fuels/not-empathic →
> red, feeling-vs-action stays neutral). `gameId "heart-smart"` kept; the wrapper stays `HeartSmartGame`
> (engine-host unchanged). The sections below describe the original v1 build (five tap-list modes), superseded
> by the v2 mechanic engine.

**Node #g41 of the SwipeEd path** (ages 6-9, Thread C · Feelings & Life Skills), inserted in **Chapter 2
between [Friend or Frenemy?](friend-or-frenemy.md) (#g09) and [Fair Play World](fair-play-world.md)
(#g10)**. It is **the missing 6-9 link** in the feelings-and-life-skills thread, the bridge between
[Feelings Friends](feelings-friends.md) (#g01), where the youngest learn to *name* feelings, and
[Mind Matters](mind-matters.md) (#g38), where pre-teens learn to *manage* them, turning the thread from
scattered games into a continuous spine. Guided by **Lensy** (a bit older), a child learns the heart of
emotional intelligence at their level: **noticing feelings in themselves and others** (empathy),
**handling big feelings in small, healthy steps**, **being kind**, and **getting along / sorting out
everyday squabbles**. It starts the shared **Life-Skills Toolkit** (a first Cool-Down and Talk-It-Out).

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path that launches in place (engine id `heart-smart`, route `/game/heart-smart`).
- **Type:** early-primary emotional-intelligence & getting-along game · **tap-list + choose-the-kind-action + repair-routine + UN & RE** engine (no fail, no timer).
- **Age band:** 6-9 (guided; audio support for early readers). **Curriculum:** UNESCO 5.6 (emotions & wellbeing) + 5.3 (communication & conflict) + 5.2 (decisions) + 1.3 (empathy/respect); India: Ayushman Bharat SEL / life-skills, anti-bullying.
- **Prereq:** [Friend or Frenemy?](friend-or-frenemy.md) (#g09). **Builds on:** [Feelings Friends](feelings-friends.md) (#g01). **Hands to:** [Mind Matters](mind-matters.md) (#g38). Pairs with [Not Fair, Not Funny](not-fair-not-funny.md) (#g11).
- **Status:** live · https://swipeed.vercel.app/game/heart-smart

## How it works: five gentle modes (all no-fail)
1. **Feelings Detective**: read feelings (happy, sad, angry, scared, excited, jealous, embarrassed, proud) from faces, bodies and situations, **first your own, then others'**: the start of empathy.
2. **Big Feelings, Small Steps**: simple, **healthy** calm-down: take a breath, count to five, take space, squeeze something soft, tell a trusted grown-up. The first Cool-Down tool.
3. **Walk in Their Shoes**: for an everyday situation (a new kid alone, a friend crying), **pick the kind, helpful thing** to do.
4. **Get-Along Gang**: sort an everyday squabble **step by step**: stop → use words → listen → make it right (sorry / a fair fix). The first Talk-It-Out tool.
5. **Good Choices**: the **first, gentlest [UN & RE](swipeed-core-principle.md)** beat: softly bust the everyday feelings-myths ("big kids don't cry", "being scared means you're not brave", "boys don't get sad"), never shaming a child for believing one.

A **5-heart chart** (💗 per mode) fills as each mode completes; the fifth finishes the node via
`GameDone` (`gameId="heart-smart"`, 3★ / 20 coins). **Lensy** hosts; voice via the shared `speak.ts`.

## Inherited & established patterns
Inherits the [reusable patterns](swipeed-game-patterns.md) (no-fail, content-as-data, play-in-place +
shared juice, audio-first/early-reader support, colour-never-only, the 5-mode grid on `GameShell` with a
Lensy header + sticker row). It marks **UN & RE's first gentle appearance** in a child's journey (per the
core principle's "formally from age 6+"), and the **wellbeing register** (healthy coping only, never
shaming, all feelings okay: see pattern #20) at its earliest age. At this age there is **no anonymous
Ask-It**. Questions are pointed to a trusted grown-up.

## Safeguarding & wellbeing (GDD §17)
- **All feelings are okay**: no feeling is framed as bad or shameful; no "big kids don't cry"; boys are shown feeling.
- **Healthy coping only**: calm-down steps are safe and gentle (breathe, count, space, squeeze, tell someone); never pain, discomfort or shock.
- **Kind, never mocking**: feelings and mistakes are treated warmly; no teasing modelled approvingly.
- **Questions to a grown-up**: no anonymous Q&A at this age. Calm audio, reduced-stimulation friendly.

## Status & roadmap
- **Built:** all five modes (Feelings Detective · Big Feelings, Small Steps · Walk in Their Shoes ·
  Get-Along Gang · Good Choices UN & RE), the 5-heart chart, Lensy + voice, English narration.
- **Deferred (GDD roadmap):** a fuller feelings/squabble bank, the sticker *collection* meta, Classroom
  SEL tools, a calm mode, and **Hindi** (with the app-wide l10n pass).

## Related
- [SwipeEd (app)](swipeed.md) · [Feelings Friends (#g01)](feelings-friends.md) · [Friend or Frenemy? (#g09)](friend-or-frenemy.md) · [Mind Matters (#g38)](mind-matters.md) · [Core principle: Unlearn → Relearn → Grow](swipeed-core-principle.md) · [Life-Skills Toolkit (Thread C spine)](life-skills-toolkit.md) · [Reusable game patterns](swipeed-game-patterns.md) · [Games catalog](index.md)
