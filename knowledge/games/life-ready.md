---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/life-ready.md
title: Life Ready
description: SwipeEd node #g42 (ages 15-18, penultimate) - the life-skills game for the threshold of adulthood. With grown-up Lensy, a young person maps their values, decides like an adult, handles big transitions, builds people-skills and a support network, and busts the life-myths (UN & RE). The capstone of the Feelings & Life Skills thread.
resource: https://swipeed.vercel.app/game/life-ready
tags: [games, swipeed, ages-15-18, life-skills, decision-making, self-awareness, resilience, help-seeking, sam, un-re]
timestamp: 2026-06-21T14:45:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
---

# Life Ready

> **Reworked to GDD 42 v2 - the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> The adult life-skills node (Thread C · Feelings & Life Skills), Chapter 5's penultimate lesson, is now a
> **509-scenario typed library** (`content/games/life-ready.ts`: know-yourself 88 · decide-like-an-adult 79 ·
> handle-the-big-stuff 84 · people-skills 84 · support-network 83 · life-ready-toolkit 91) on the **shared v2
> engine** - seven play actions (reflect ×130 · branch ×110 · strike-rewrite ×66 · sort ×49 · match ×48 · role-play
> ×58 · spot ×48), **0% binary**, led by branch (your move) + reflect + strike-rewrite. The **culmination of the
> feelings-and-life-skills thread** (Feelings Friends → Heart Smart → Mind Matters → Bounce → **Life Ready**),
> consolidating the Life-Skills Toolkit for adult life: know yourself & your values, decide like an adult, handle
> the big stuff (board exams, leaving home, failure, uncertainty), work with people, and build a support network.
> **Healthy strategies only** (never pain/shock/self-destructive); **pressure-free decisions** (no single 'right'
> life path beyond safety & law); **help-seeking is a lifelong strength, not a failure; NOT therapy.** India:
> board-exam pressure, family/career expectations, the transition to college/work; routes distress to **Tele-MANAS
> 14416, KIRAN 1800-599-0019, Manodarpan**, a trusted adult/mentor (`reassureCats` [handle-the-big-stuff ·
> support-network] + `reassure` + helpLine). `gameId "life-ready"` (matches registry). Engine: no new mechanic;
> `binStyle` added `makes it harder`/`isolates you`/`avoids it`/`poor basis`/`strains`→red + `builds support`/
> `strengthens`/`good basis`/`emotional intelligence`→green (regression-clean - also fixed [My Choices](my-choices-my-future.md)'s
> "Poor basis" bin; toolkit/method categorisation bins left neutral). Spot ids injected (2). Builds on
> [Bounce](bounce.md) (g39); draws on [Crossroads](crossroads.md) (g16); precedes [Decoded](decoded.md) (g36).
> The sections below describe the original v1 build, superseded by v2.

**Node #g42 of the SwipeEd path** (ages 15-18, Thread C · Feelings & Life Skills), the **penultimate
lesson - right before the [Decoded](decoded.md) finale (#g36)** and the final capstone, inserted after
[Justice League: Rights](justice-league-rights.md) (#g35). It is the **culmination of the
feelings-and-life-skills thread** ([Feelings Friends](feelings-friends.md) → [Heart Smart](heart-smart.md)
→ [Mind Matters](mind-matters.md) → [Bounce](bounce.md) → Life Ready), carrying its emotional-intelligence
work into the demands of near-adult life and consolidating the shared **Life-Skills Toolkit** a player has
built since age three. Guided by **Lensy - now grown** (a quiet bookend to the small friend from Feelings
Friends), a young person learns to **know themselves and their values**, **decide like an adult**,
**handle the big transitions and stresses** (board exams, leaving home, failure, uncertainty), **work
well with people**, and **build a support network they can lean on - for life**.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path - launches in place (engine id `life-ready`, route `/game/life-ready`).
- **Type:** young-adult life-skills & emotional-intelligence game · **tap-list + choose-the-mature-approach + UN & RE** engine (no fail, no timer; choices presented, never pushed).
- **Age band:** 15-18 (self-directed, private, adult tone). **Curriculum:** UNESCO 5.2 (decision-making) + 5.6 (wellbeing & resilience) + 5.1 (norms/independence) + 5.5 (finding help); India: board-exam/career/family pressure, Manodarpan, Tele-MANAS.
- **Prereq:** [Justice League: Rights](justice-league-rights.md) (#g35). **Builds on:** [Bounce](bounce.md) (#g39) & all of Thread C. **Draws on:** [Crossroads](crossroads.md) (#g16). **Precedes:** [Decoded](decoded.md) (#g36) finale.
- **Status:** live · https://swipeed.vercel.app/game/life-ready

## How it works - five no-fail modes
1. **Know Yourself** - map your **values, strengths and emotional self-awareness** (reflective; *there are no 'right' values, only the work of knowing your own*).
2. **Decide Like an Adult** - for realistic, higher-stakes dilemmas, **pick the grown-up approach**: gather facts → weigh your values & the long term → resist pressure → own the choice. *No single 'right' life path is pushed* (beyond safety & law) - the skill is **deciding well**. The grown-up of [Crossroads](crossroads.md).
3. **Handle the Big Stuff** - tools for real adult-threshold transitions and stress (exams, leaving home, failure, uncertainty) **without minimising them** - name it, break it down, healthy strategy, lean on your people, ask early.
4. **People & Support** - emotional intelligence with others (communicate, listen, set boundaries, resolve conflict) **and** building a **support map** (friends · family · mentor · counsellor · helplines) - *help-seeking continues into adulthood*.
5. **Life Myths** - the **[UN & RE](swipeed-core-principle.md)** beat on the threshold-of-adulthood myths ("asking for help means you've failed at adulthood", "you should have it all figured out by 18", "your exam result decides your whole future", "adults handle everything alone").

A **5-skill badge book** (🧭 per mode) fills as each mode completes; the fifth finishes the node via
`GameDone` (`gameId="life-ready"`, 3★ / 35 coins). **Lensy (grown)** hosts; voice via the shared
`speak.ts`.

## Inherited & established patterns
Inherits the [reusable patterns](swipeed-game-patterns.md) - and anchors the senior end of the
**wellbeing register** (pattern #20): **healthy strategies only**, **pressure-free** (no prescribed life
path), **routes distress to real help** (Tele-MANAS 14416 · KIRAN 1800-599-0019), and is honest that it
is **skills & signposting, not therapy**. It uses the 5-mode grid on `GameShell` with a Lensy header +
badge row, the **choose-the-mature-approach** mechanic (shared with Mind Matters/Bounce's "pick the kind
thought"), and **UN & RE on the key unlearn** (the self-blame "asking for help is failure" life-myth).

## Status & roadmap
- **Built:** all five modes (Know Yourself · Decide Like an Adult · Handle the Big Stuff · People &
  Support · Life Myths UN & RE), the 5-skill badge book, grown-up Lensy + voice, helpline signposting,
  English narration.
- **Deferred (GDD Phase 2/3):** a deeper branching **life-sim** + private values-map/life-plan, the
  anonymous **Ask-It** Q&A with distress triage, crown levels, a calm "reflect" space, Classroom
  life-skills/careers tools, a richer scenario bank, and **Hindi** (with the app-wide l10n pass).

## Related
- [SwipeEd (app)](swipeed.md) · [Bounce (#g39)](bounce.md) · [Mind Matters (#g38)](mind-matters.md) · [Heart Smart (#g41)](heart-smart.md) · [Feelings Friends (#g01)](feelings-friends.md) · [Crossroads (#g16)](crossroads.md) · [Decoded (#g36)](decoded.md) · [Capstones](capstones.md) · [Life-Skills Toolkit (Thread C spine)](life-skills-toolkit.md) · [Reusable game patterns](swipeed-game-patterns.md) · [Games catalog](index.md)
