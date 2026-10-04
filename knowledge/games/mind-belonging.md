---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/mind-belonging.md
title: Mind & Belonging
description: College mental health for ages 18-22, covering homesickness & loneliness, building belonging, healthy coping, and busting help-seeking stigma (UN & RE). Thread C's adult wellbeing node, healthy-only, crisis-routing-first, skills not therapy.
resource: https://swipeed.vercel.app/game/mind-belonging
tags: [games, swipeed, wellbeing, mental-health, ages-18-22, adult-journey]
timestamp: 2026-06-22T13:05:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/785d53d2-2943-49b3-9cad-96dce0c54bfb  # SWED-62
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/02455c6c-fb84-4cc8-a691-58156ea1a13d  # SWED-104
---

# Mind & Belonging

> **Reworked to GDD 49 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> The College wellbeing anchor (Thread C · Feelings & Life Skills) **moved off the [ModesEngine](swipeed-game-patterns.md)
> onto the shared v2 mechanic engine**: a **490-scenario typed library** (`content/games/mind-belonging.ts`:
> settling-in 76 · find-your-people 81 · cope-well 91 · mind-and-self-worth 82 · reach-out 79 · tools-and-help
> 81) with seven play actions (branch ×96 · strike-rewrite ×79 · sort ×64 · reflect ×66 · role-play ×68 · spot
> ×58 · match ×59), **0% binary**, led by branch + strike-rewrite + sort. **Leaving home is exciting and lonely
> and hard:** settling in (homesickness/loneliness normalised), find your people (belonging is built), cope well
> (**healthy coping ONLY**, body image & self-worth), reach out (**help = strength**; UN&RE), tools & crisis
> routing. **HIGH-CARE:** any sign of distress is met with warmth and an immediate route to help, never
> assessment questions; only healthy coping (nothing using pain, restriction or shock; nothing reinforcing
> self-harm); anti-stigma, **NOT therapy**; persistent or serious distress is pointed to professionals.
> Even-handed; stigma is especially heavy on young men. India: academic pressure, hostel isolation, far from
> home, family expectations; **Tele-MANAS 14416 (primary)**, campus counsellors, a trusted
> person (`reassureCats` [settling-in · cope-well · mind-and-self-worth · reach-out] + `reassure` + helpLine).
> `gameId "mind-belonging"` (matches registry). Engine: no new mechanic; `binStyle` unchanged: no mis-colors,
> and a generic `deepens` token was **deliberately avoided** (it's good in mb-083 "Deepens [a friendship]" but
> bad in mb-008 "Deepens [the low mood]"). Spot ids injected (7). Builds on [Bounce](bounce.md) (g39), continues
> [Life Ready](life-ready.md) (g42); pairs g48 & g52; underpins every College node. The sections below describe
> the original ModesEngine v1 build, superseded by v2.

**Node #g49: Chapter 6 (College, ages 18-22).** Leaving home is one of life's hardest transitions and a
peak window for mental-health difficulty. The adult College node of the **[wellbeing register](swipeed-game-patterns.md)**
(healthy coping only · crisis-routing-first · stigma is the key unlearn · honest that it's **skills &
signposting, not therapy**), carrying the [Life-Skills Toolkit](life-skills-toolkit.md) at adult stakes.
On the [ModesEngine](swipeed-game-patterns.md).

## How it works: five modes
1. **Settling In**: homesickness & the bumpy first months, normalised (tap-reveal list).
2. **Find Your People**: building belonging by reaching out first (scenes).
3. **Cope Well**: healthy coping + a **Cool-Down ToolMoment**; body image & self-worth (list).
4. **Reach Out**: the **UN → RE** beat busting "asking for help means failing".
5. **Tools & Ask-It**: breathing space + private Q&A with **urgent crisis routing** (Tele-MANAS 14416, iCall).

## Related
- [Reusable Game Patterns](swipeed-game-patterns.md) · [Mind Matters](mind-matters.md) · [Bounce](bounce.md) · [Find Your Feet](find-your-feet.md) · [Games catalog](index.md)

## Multi-step stories ([SWED-104](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/02455c6c-fb84-4cc8-a691-58156ea1a13d), 2026-10-04)

All 96 branches and 68 role-plays are now 3 to 5 questions on one situation: 101 with 3, 55 with 4 and 8 with 5, 563 questions in all. Each question has 4 or 5 options and one best, revealed at the end. After a write, review and fix pass, a final certification ran up to four rounds of independent reviews: a blind best-option pick, a transition audit, and a safety and fidelity review. Round 1 found 92 blocking problems in this game. The stories the last fix changed were read in full before shipping. Every story with a safety or fidelity finding in any round, or naming a helpline, was read in full before shipping, and the owner reads the shipped stories on a [review page](https://claude.ai/artifact/XnwNT9aLihsz5Dy22bVV3u). Ten lines in two crisis stories (mb-1195, mb-048) were fixed by hand, so each scene stays in one place and each consequence follows from the choice. Procedure: [multi-step rollout](../playbooks/multi-step-rollout.md).
