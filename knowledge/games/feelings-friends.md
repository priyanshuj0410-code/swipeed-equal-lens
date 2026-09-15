---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/feelings-friends.md
title: Feelings Friends
description: SwipeEd's first game (node #1, ages 3-6), a warm, audio-first SEL game where a child names, shows, refuses and calms big feelings, and meets Lensy for the first time. Reworked to GDD 01 (the Chapter-1 pilot): six verb-moves on an 88-scenario library.
resource: https://swipeed.vercel.app/game/feelings
tags: [games, swipeed, ages-3-6, sel, feelings, life-skills, sam, gdd-rework]
timestamp: 2026-06-22T16:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Feelings Friends

> **Reworked to GDD 01 v2: the "mechanic-embodying" standard** (see
> [pattern #26](swipeed-game-patterns.md) and the build bible). The game is now a **488-scenario typed
> library** (`content/games/feelings-friends.ts`: name-feelings · all-okay · calm-down · empathy ·
> big-no-help · my-feelings) running on the **shared v2 engine** (`components/games/v2-engine.tsx`), where a
> thin wrapper feeds the library + a `V2GameConfig`. Every scenario is one of **seven typed play actions**
> (reflect · role-play · strike-rewrite · branch · sort · match · build), **0% binary tap**, run as the
> Hook→Play→resolve→Sticker micro-loop (rotated, no mechanic twice running). No WRONG buzzer; all feelings
> valid (feeling vs action); both directions (boys cry, girls get angry); the big "no" + ask a trusted
> grown-up. `gameId "feelings"` unchanged. (An earlier rework took it to GDD 01 *v1*: six bespoke
> verb-moves on an 88-scenario flat library; v2 re-encoded the same SEL content to the shared typed
> engine.) The sections below describe the original v1 build.

**Node #1 of the SwipeEd path** and a child's very first game (ages 3-6, Thread C · Feelings & Life
Skills). A warm, **audio-first, no-fail** social-emotional game: the child names a feeling, matches it
to a moment, shows their own feeling, practises a big confident **"No!"**, and learns to **calm** a big
feeling, guided by **Lensy**, the shape-shifting companion the child will travel with for the whole
fourteen-year journey (this is Lensy's debut). It builds the bedrock everything else rests on: a child who
can name and voice feelings can later recognise unsafe situations, set boundaries, and seek help.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path that launches **in place** over the grassland (engine id `feelings`, route `/game/feelings`).
- **Type:** warm, audio-first SEL game · **Tap / make-a-face** engine (no swipe, no fail, no timer).
- **Age band:** 3-6 (pre-literate) · played with a parent or Anganwadi/pre-school teacher.
- **Curriculum:** UNESCO ITGSE 5.3 (communication, refusal & expressing needs) + 5.2 (simple choices); WHO Europe ages 0-6; the CASEL SEL foundation.
- **Status:** live · https://swipeed.vercel.app/game/feelings

## What it teaches
Name a handful of core feelings (happy, sad, angry, scared, shy, excited, calm); recognise which feeling
fits an everyday moment; show/tell how *you* feel; say a clear, confident **"No"** and ask for help; and
use one simple way to **calm** a big feeling. Every feeling is treated as okay.

## How it works: five warm modes (all no-fail)
1. **Meet**: tap a Feelings Friend; Lensy names it, it wobbles, Lensy says it's okay to feel that way; it joins your **Feelings Family**.
2. **Match**: a short everyday scene ("your ice cream falls") → tap the feeling that fits. Any tap gets a warm response; a **gentle nudge** guides, never "wrong".
3. **Mirror Me**: "How do *you* feel?", pick-a-face (the live front-camera option from the GDD is deferred; pick-a-face only, per privacy).
4. **The Big No**: big, bouncy buttons: **No! · Stop! · Yes! · I need help**. Lensy cheers every time (the refusal/safety foundation; sets up *My Body, My Rules*). Record/playback deferred.
5. **Calm Corner**: breathe with Lensy: **smell the flower** (in), **blow the candle** (out), simple belly-breathing with a soft animation.

A **daily check-in** ("How do you feel today?") opens each session. Collecting all the Feelings Friends
completes the **Feelings Family** (the celebratory finish that marks the node done). Audio-first via
`src/lib/speak.ts`; **Lensy** is a friendly in-UI avatar (the 3D path companion can't render in a DOM
overlay).

## Inherited patterns
Built on the [reusable game patterns](swipeed-game-patterns.md): **no hard fail** (#4), content-as-data
(#1), play-in-place + shared `GameDone`/juice (#3, #11), **accessibility: colour never the only cue**
(each feeling has emoji + name + colour), audio-first for pre-literacy (#10), text-light age-adaptive
tone (#13), and India + mother-tongue framing (#14) that normalises boys feeling scared/crying and girls
feeling angry. It opens the path to [Unlearn → Relearn → Grow](swipeed-core-principle.md): naming
feelings is the first "relearn".

## Status & roadmap
- **Built:** all five modes (Mirror Me as pick-a-face), Feelings Family collection + the daily check-in,
  Lensy's intro, shared juice; English (audio narration). Content in `src/content/games/feelings-friends.ts`.
- **Deferred (GDD Phase 2/3):** the live on-device **front-camera** in Mirror Me, **record/playback** in
  the Big No, the **"How Do You Feel?" song**, persisted Family album, the group/Anganwadi mode, a
  caregiver feelings-dashboard, and **Hindi** (with the app-wide l10n pass).

## Related
- [SwipeEd (app)](swipeed.md) · [Reusable game patterns](swipeed-game-patterns.md) · [Core principle](swipeed-core-principle.md) · [Life-Skills Toolkit (Thread C spine)](life-skills-toolkit.md) · [Games catalog](index.md) · [My Body, My Rules (node #2, next)](index.md)
