---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/bounce.md
title: Bounce
description: SwipeEd node #g39 (ages 12-15), the teen mental-health & resilience game. With Lensy, a teen spots stress signals, builds a resilience toolkit, bounces back from setbacks with self-compassion, busts stigma (UN & RE), supports friends safely, and learns where to get help. Highest-care wellbeing, healthy coping only, crisis routing first.
resource: https://swipeed.vercel.app/game/bounce
tags: [games, swipeed, ages-12-15, mental-health, resilience, anti-stigma, help-seeking, crisis-routing, sam, un-re]
timestamp: 2026-06-21T13:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/785d53d2-2943-49b3-9cad-96dce0c54bfb  # SWED-62
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Bounce

> **Reworked to GDD 39 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The resilience + stress + teen-mental-health node (Thread C) is now a **518-scenario
> typed library** (`content/games/bounce.ts`: what-resilience 84 · reframe-setback 89 · bounce-toolkit 89 ·
> exam-pressure 85 · support-friend 87 · reach-out 84), generated **faithfully** from the scorecard-passed
> GDD 39 JSON, on the **shared v2 engine** (`components/games/v2-engine.tsx`). The old 5-mode (UN & RE) build is
> replaced by **seven typed play actions** (branch ×99 · strike-rewrite ×100 · reflect ×72 · sort ×53 ·
> role-play ×82 · build ×68 · match ×44), **0% binary tap**, led by **branch** (choose the move that actually
> helps), **strike-rewrite** (bust the resilience myth) and **role-play** (say the brave words). Arc: what
> resilience really is → reframe the setback → bounce-back toolkit → exam & performance pressure → being there
> for a friend → **when to reach out**. **Real resilience**, *not* toxic positivity or tough-it-out-alone; a
> coping toolkit that's real, not a poster. **Wellbeing-safe (crisis-routing first, never therapy):** persistent
> distress and any dark thoughts route **firmly** to a trusted adult, **Tele-MANAS 14416**, or
> **Childline 1098 / 112** (`reassure` + `reassureCats` ["reach-out"]). Engine: **no new mechanic** (reuses 7 of
> 9); a `binStyle` valence accretion (resilience/toxic, helps/harms, real-coping/avoidant, builds/chips), while
> the **crisis distinction** (reach-out-now / ordinary rough patch), the **control dichotomy** (in / not in my
> control) and **growth/fixed mindset** deliberately stay **neutral**. The new `avoidant` token was checked to
> *not* match [Defenders of the Body](defenders-of-the-body.md)'s anti-stigma "Avoid (blood risk)" bin.
> `gameId "bounce"` (matches the registry id). Builds on [Mind Matters](mind-matters.md) (g38); prereq g21. The
> sections below describe the original v1 build, superseded by the v2 mechanic engine.

**Node #g39 of the SwipeEd path** (ages 12-15, Thread C · Feelings & Life Skills), at **play order 27,
right after [Body Confident](body-confident.md) (#g21)**, because looking after your mind belongs beside
looking after how you feel about your body. It is the **grown-up step from [Mind Matters](mind-matters.md)
(#g38)** (naming and cooling feelings becomes building real resilience and managing stress), and it
**completes Thread C across the whole journey**. Guided by **Lensy** (now a teen peer), a teenager learns to
**recognise** stress, anxiety and low mood (and tell a normal hard patch from a sign to get help), build a
**resilience toolkit** of healthy skills, **bounce back** from setbacks with self-compassion, **bust the
stigma myths** that stop teens reaching out, **support a friend** safely (without carrying it alone), and
**seek help early** and know exactly where to go. The teen years are the peak window for mental-health
difficulty, so this is the **most safeguarding-sensitive game in the feelings thread**.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path that launches in place (engine id `bounce`, route `/game/bounce`).
- **Type:** teen resilience-and-wellbeing toolkit · **tap-list + choose-the-thought + UN & RE** engine (no fail, no timer, never rushed).
- **Age band:** 12-15 (self-directed, private, matter-of-fact). **Curriculum:** UNESCO **5.6** (mental wellbeing & resilience, *new*) + **5.5** (finding help); India: exam/career stress, Manodarpan, Tele-MANAS.
- **Prereq:** [Body Confident](body-confident.md) (#g21). **Builds on:** [Mind Matters](mind-matters.md) (#g38). **Links to:** [Reality Check](reality-check.md) (#g28), [Decoded](decoded.md) (#g36) (digital wellbeing).
- **Status:** live · https://swipeed.vercel.app/game/bounce

## How it works: five no-fail modes
1. **Stress Signals**: recognise the physical/emotional signs of stress, anxiety and low mood, and **tell an ordinary hard patch from a sign to get help**, gently, with **no labelling or self-diagnosis**.
2. **The Resilience Toolkit**: build a kit of **healthy skills only**: reframe a thought, break it into steps, breathe & ground, protect sleep, move, stay connected, take a break from the feed, be kind to yourself.
3. **Bounce** *(the signature)*: for each real setback (failed exam, rejection, a falling-out, a humiliating moment), **pick the thought that's kind AND true**: growth mindset + self-compassion, never "just be positive."
4. **Mind Myths Busted** *(the UN & RE beat)*: **unlearn** the teen-specific stigma ("anxiety means you're weak", "everyone else has it together", "asking for help is failure") and **relearn** the truth, **without shame** for ever believing one.
5. **Hold Space**: support a friend (listen, take them seriously, **don't carry it alone, and involve a trusted adult**, especially if they may be at risk), your own help-seeking, and the **helplines**.

A **5-skill badge book** (💚 per mode) fills as each mode completes; the fifth finishes the node via
`GameDone` (`gameId="bounce"`, 3★ / 30 coins). **Lensy** (teen) hosts; voice via the shared `speak.ts`
model; the myth-busting reuses the shared **[UN & RE](swipeed-core-principle.md)** duo.

## Safeguarding & wellbeing (highest-care, read first, GDD §18)
- **Healthy coping only**: every strategy is safe and constructive; the game never models or suggests
  coping that uses pain, physical discomfort, shock, restriction, or anything that could reinforce
  self-harm (enforced by a curated, no-author-in library).
- **Crisis routing comes first**: any sign of self-harm, suicidal thoughts or serious distress is met
  with warmth and an **immediate, clear route to help**: **Tele-MANAS 14416 ·
  Childline 1098 · a trusted adult/counsellor**, never with safety-assessment questions, and without
  false promises about confidentiality.
- **Never reinforces self-criticism or hopelessness**: models self-compassion; doesn't amplify negative
  self-talk or dramatise distress; hopeful, never glib.
- **Body-image/eating distress** uses [Body Confident](body-confident.md)'s no-weight/shape approach.
- **Skills, not therapy**: it never claims to treat; it builds skills and signposts, and serious or
  persistent struggles are always pointed toward a person and professional help. Expert-reviewed.
- The anonymous **Ask-It** Q&A with the **strongest crisis/self-harm triage in the thread**, a persistent
  **"breathing space"** and an always-one-tap **Get Help** are **GDD Phase 2**, deferred here; the Hold
  Space mode carries the help-seeking learning and helplines, and Stress Signals carries the "get help
  today" distinction, without an un-triaged question box.

## Inherited & established patterns
Inherits the [reusable patterns](swipeed-game-patterns.md) (no-fail, content-as-data, play-in-place +
shared juice, audio-first, colour-never-only, the 5-mode grid on `GameShell` with a Lensy header + badge
row, and **UN & RE on the key unlearn**, here teen mental-health stigma). With [Mind Matters](mind-matters.md)
it anchors the **wellbeing register** of pattern #16 (empower, never frighten): **healthy coping only**,
**never reinforces self-criticism**, **crisis routing first**, *skills & signposting, not therapy*.

## Status & roadmap
- **Built:** all five modes (Stress Signals · Resilience Toolkit · Bounce · Mind Myths UN & RE · Hold
  Space), the 5-skill badge book, Lensy (teen) + voice, English narration, crisis-helpline signposting.
- **Deferred (GDD Phase 2/3):** the anonymous **Ask-It** Q&A with the strongest crisis triage, a
  persistent **breathing space** + always-on Get Help, crown levels, a reduced-stimulation calm mode,
  Classroom/exam-stress tools, a richer scenario bank, and **Hindi** (with the app-wide l10n pass).

## Related
- [SwipeEd (app)](swipeed.md) · [Mind Matters (#g38)](mind-matters.md) · [Body Confident (#g21)](body-confident.md) · [Feelings Friends (#g01)](feelings-friends.md) · [Reality Check (#g28)](reality-check.md) · [Decoded (#g36)](decoded.md) · [Core principle: Unlearn → Relearn → Grow](swipeed-core-principle.md) · [Life-Skills Toolkit (Thread C spine)](life-skills-toolkit.md) · [Reusable game patterns](swipeed-game-patterns.md) · [Games catalog](index.md)
