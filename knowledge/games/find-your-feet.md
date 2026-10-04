---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/find-your-feet.md
title: Find Your Feet
description: "Career & future anxiety for ages 18-22, covering the comparison trap, the pressure to have life figured out, reframing setbacks, and a values-based path (worth beyond your CV; UN & RE). Wellbeing register: kind-and-true reframes, crisis-routing, not therapy."
resource: https://swipeed.vercel.app/game/find-your-feet
tags: [games, swipeed, wellbeing, ages-18-22, adult-journey]
timestamp: 2026-06-22T13:10:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/785d53d2-2943-49b3-9cad-96dce0c54bfb  # SWED-62
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/02455c6c-fb84-4cc8-a691-58156ea1a13d  # SWED-104
---

# Find Your Feet

> **Reworked to GDD 52 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> The career/future-anxiety node, completing the College wellbeing cluster (g48, g49, g52) (Thread C · Feelings
> & Life Skills), **moved off the [ModesEngine](swipeed-game-patterns.md) onto the shared v2 mechanic engine**
> - a **451-scenario typed library** (`content/games/find-your-feet.json`: comparison-trap 83 · not-all-sorted 85 ·
> bounce-from-setbacks 78 · worth-beyond-cv 74 · your-path 81 · tools-and-help 50) with seven play actions (branch
> ×86 · strike-rewrite ×76 · sort ×69 · reflect ×66 · role-play ×52 · match ×55 · spot ×47), **0% binary**, led by
> branch + strike-rewrite + sort. **Spoiler: no one has it figured out.** Five themes: the comparison trap
> (UN&RE), you don't need it all sorted, bounce from setbacks, your path (worth beyond CV), tools & crisis
> routing. Reframes the comparison spiral, the pressure to have life figured out, the placement/exam cooker and
> fear of failure: **no one has it sorted, setbacks are information not verdicts, failure is a comma not a full
> stop, your worth is not your CV.** Wellbeing-sensitive: healthy coping only, never reinforces hopelessness or
> 'you've failed', worth-beyond-CV throughout, crisis routing with warmth (**Tele-MANAS 14416**,
> a counsellor); **NOT careers-counselling or therapy**, signposts both. India: placement
> seasons, competitive exams (**JEE/NEET/UPSC**), the 'settled job' ideal, family expectations and intense peer
> comparison, validated then gently loosened (`reassureCats` [comparison-trap · not-all-sorted ·
> bounce-from-setbacks · worth-beyond-cv] + `reassure` + helpLine). `gameId "find-your-feet"` (matches registry).
> Engine: no new mechanic; `binStyle` unchanged: clear good/bad bins already coloured; the nuanced "real vs
> illusion" framing bins (highlight-reel↔real-picture, growth↔fixed, values-based↔approval-chasing,
> yours↔someone-else's, fits↔misfit) left neutral by design. Spot ids injected (7). Builds on [Life Ready](life-ready.md)
> (g42) & [Bounce](bounce.md) (g39); pairs g48 & g49. The sections below describe the original ModesEngine v1
> build, superseded by v2.

**Node #g52: Chapter 6 (College, ages 18-22).** Career & future anxiety: arguably the defining stressor
of these years in India (the comparison spiral, the placement/exam cooker, worth beyond your CV).
*"Spoiler: no one has it figured out."* A [wellbeing-register](swipeed-game-patterns.md) node on the
[ModesEngine](swipeed-game-patterns.md).

## How it works: five modes
1. **The Comparison Trap**: the **UN → RE** beat on "everyone's ahead of me" and the success highlight-reel.
2. **Not All Sorted**: uncertainty is normal; you need the next step, not the whole map (list).
3. **Bounce From Setbacks**: a setback is information, not a verdict (scenes; Cool-Down ToolMoment).
4. **Your Path**: values-based next steps; worth beyond your CV (scenes).
5. **Tools & Ask-It**: a next-step tool + private Q&A with **crisis routing** (Tele-MANAS 14416, iCall).

## Related
- [Reusable Game Patterns](swipeed-game-patterns.md) · [Mind & Belonging](mind-belonging.md) · [Life Ready](life-ready.md) · [Games catalog](index.md)

## Multi-step stories ([SWED-104](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/02455c6c-fb84-4cc8-a691-58156ea1a13d), 2026-10-04)

All 86 branches and 52 role-plays are now 3 to 5 questions on one situation: 104 with 3, 30 with 4 and 4 with 5, 452 questions in all. Each question has 4 or 5 options and one best, revealed at the end. After a write, review and fix pass, a final certification ran up to four rounds of independent reviews: a blind best-option pick, a transition audit, and a safety and fidelity review. Round 1 found 117 blocking problems in this game. The stories the last fix changed were read in full before shipping. Five lines were fixed by hand: two wrong options were made plausible, and two prompts and a follow-up were clarified. Procedure: [multi-step rollout](../playbooks/multi-step-rollout.md).
