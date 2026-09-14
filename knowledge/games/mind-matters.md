---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/mind-matters.md
title: Mind Matters
description: SwipeEd node #g38 (ages 9-12) - the emotional & mental-wellbeing game. With Lensy, a pre-teen names big feelings, builds a healthy cool-down toolkit, bounces back from setbacks with self-kindness, busts mental-health stigma (UN & RE), and learns when/how to ask for help. Healthy coping only; routes distress to real help.
resource: https://swipeed.vercel.app/game/mind-matters
tags: [games, swipeed, ages-9-12, mental-health, wellbeing, resilience, anti-stigma, help-seeking, sam, un-re]
timestamp: 2026-06-21T12:30:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
---

# Mind Matters

> **Reworked to GDD 38 v2 - the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The mental-wellbeing game is a **522-scenario typed library**
> (`content/games/mind-matters.ts`: mind-matters-too 91 · stress-and-pressure 88 · handling-rejection 77 ·
> mind-care-toolkit 91 · ask-for-help 91 · be-kind-to-mind 84), generated **faithfully** from the
> scorecard-passed GDD JSON, on the **shared v2 engine** (`components/games/v2-engine.tsx`). Every scenario is
> one of **seven typed play actions** (branch ×126 · strike-rewrite ×85 · sort ×64 · reflect ×65 · role-play ×65 ·
> build ×67 · match ×50), **0% binary tap**, led by the **coping chooser** (branch - decide a healthy response,
> see it help), the **build-your-toolkit** board (build), and **de-stigmatising myth-flips** (strike-rewrite).
> Carries Feelings Friends' (g01) "name your feelings" base into stress, setbacks & resilience: the mind has
> health too, stress & pressure, handling rejection, a personal toolkit of healthy coping moves, asking for help
> (the bravest skill), and being kind to your own mind. **Wellbeing-safe by design:** healthy coping ONLY
> (breathe · talk · move · rest · problem-break - **no pain-based or risky "tricks"**); **never diagnoses or
> labels**; **no harsh self-talk** (actively replaces self-criticism with self-compassion); normalising, never
> alarmist; **always a way to help** - big/lasting feelings or dark thoughts route firmly to a trusted adult &
> **Childline 1098 / 112** (`helpLine` + `reassure` + `reassureCats` ["ask-for-help"] → "it's okay to not be
> okay, asking is strong" banner). Engine: **no new mechanic** (reuses 7 of 9); a `binStyle` valence accretion
> (neglected/false/adds-stress/harsh/unhealthy/revs-up/hard-on-your-mind → red, cared-for-mind/eases-stress →
> green) - stress-sign/not, normal/get-help and in-moment/longer-term stay neutral distinctions. `gameId
> "mind-matters"` (matches the registry id). Builds on [Feelings Friends](feelings-friends.md) (g01); prereq
> g13; shares the coping-chooser / toolkit-builder with [Bounce](bounce.md) (g39) & [Heart Smart](heart-smart.md)
> (g41). The sections below describe the original v1 build, superseded by the v2 mechanic engine.

**Node #g38 of the SwipeEd path** (ages 9-12, Thread C · Feelings & Life Skills), at **play order 17 -
right after [Puberty Quest](puberty-quest.md) (#g13)**, because a changing body brings changing feelings.
It **grows [Feelings Friends](feelings-friends.md) (#g01)** into the bigger emotions of the pre-teen
years and hands forward to **[Bounce](bounce.md) (#g39)**, the teen-level version. Guided by **Lensy** (now
an older child), a child learns to **name** what they feel, **cool down** strong feelings with healthy
strategies, **bounce back** from rejection and failure with self-kindness, **bust the stigma myths** that
make struggling shameful, and know that **asking for help is normal and brave**. It closes the
curriculum's clearest gap - **mental wellbeing had no dedicated game after age six** (UNESCO Key Concept
5 · Skills for Health & Wellbeing), exactly the age stress and comparison arrive.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path - launches in place (engine id `mind-matters`, route `/game/mind-matters`).
- **Type:** pre-teen feelings-and-wellbeing toolkit · **tap-list + choose-the-thought + UN & RE** engine (no fail, no timer, no rushing).
- **Age band:** 9-12 (self-directed, warm). **Curriculum:** UNESCO **5.6** (emotions, mental wellbeing & resilience - *new*) + **5.5** (finding help); India: Ayushman Bharat SEL / Manodarpan; Tele-MANAS.
- **Prereq:** [Puberty Quest](puberty-quest.md) (#g13). **Builds on:** [Feelings Friends](feelings-friends.md) (#g01). **Hands to:** [Bounce](bounce.md) (#g39).
- **Status:** live · https://swipeed.vercel.app/game/mind-matters

## How it works - five no-fail modes
1. **Name It to Tame It** - recognise and name feelings beyond happy/sad/angry (nervous, jealous, embarrassed, lonely, overwhelmed, hopeful). Feelings are signals, all are normal - and **naming one already calms it**.
2. **Cool-Down Toolkit** - build a personal kit of **healthy strategies only**: slow breathing, grounding, talking to someone, moving, taking a break, being kind to yourself.
3. **Bounce-Back Lab** - for each setback (a bad mark, not being invited, missing the team), **pick the thought that's kind AND true** - growth mindset + self-compassion, never "just be positive."
4. **Mind Myths Busted** *(the UN & RE beat)* - gently **unlearn** the stigma myths ("strong people don't get sad", "just snap out of it", "asking for help is embarrassing") and **relearn** the truth, with **no shame for ever having believed one**.
5. **Reach Out** - when feelings are big enough to tell a grown-up, **who** to turn to, **how** to start ("Can we talk? I've been feeling…"), how to **support a friend**, and the helplines.

A **5-skill badge book** (💛 per mode) fills as each mode completes; the fifth finishes the node via
`GameDone` (`gameId="mind-matters"`, 3★ / 25 coins). **Lensy** hosts; voice via the shared `speak.ts`
model (mute / replay); the myth-busting reuses the shared **[UN & RE](swipeed-core-principle.md)** duo.

## Inherited & established patterns
Inherits the [reusable patterns](swipeed-game-patterns.md) (no-fail, content-as-data, play-in-place +
shared juice, audio-first, colour-never-only, the 5-mode grid on `GameShell` with a Lensy header + badge
row, and **UN & RE on the key unlearn** - here the stigma myths, the game's most important unlearn). It
reinforces pattern #16 (empower, never frighten) in the **wellbeing** register: **healthy coping only**
(no pain/shock/discomfort strategies can appear), **never reinforces self-criticism**, anti-stigma tone,
and **routes distress to real help rather than safety-assessment questions** - it is *skills &
signposting, not therapy*.

## Safeguarding & wellbeing (read first - see GDD §18)
- **Healthy coping only** - every strategy is safe and kind; the game never models coping that uses pain,
  shock, physical discomfort, or anything that could become a harmful habit (enforced by a curated set).
- **Never reinforces self-criticism** - models self-compassion; no negative-self-talk amplification; no
  ranking/comparing of feelings.
- **Routes distress to real help** - warmth + a clear nudge to a trusted adult and **Childline 1098 ·
  Tele-MANAS 14416 · KIRAN 1800-599-0019 · a school counsellor**, not assessment questions. **Not a
  therapist**; serious or lasting struggles are always pointed toward a person and professional help.
- The anonymous **Ask-It** Q&A with urgent distress/crisis triage is **GDD Phase 2** - deferred here; the
  Reach Out mode carries the help-seeking learning and helplines without an un-triaged question box.

## Status & roadmap
- **Built:** all five modes (Name It · Cool-Down · Bounce-Back · Mind Myths UN & RE · Reach Out), the
  5-skill badge book, Lensy + voice, English narration, helpline signposting.
- **Deferred (GDD Phase 2/3):** the anonymous **Ask-It** Q&A with urgent triage, crown levels, a
  reduced-stimulation calm mode + "breathing space", Classroom SEL tools, a richer feelings/scenario
  bank, and **Hindi** (with the app-wide l10n pass).

## Related
- [SwipeEd (app)](swipeed.md) · [Feelings Friends (#g01)](feelings-friends.md) · [Puberty Quest (#g13)](puberty-quest.md) · [Bounce (#g39)](bounce.md) · [Core principle - Unlearn → Relearn → Grow](swipeed-core-principle.md) · [Life-Skills Toolkit (Thread C spine)](life-skills-toolkit.md) · [Reusable game patterns](swipeed-game-patterns.md) · [Games catalog](index.md)
