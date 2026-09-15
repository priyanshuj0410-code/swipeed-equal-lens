---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/clean-crew.md
title: Clean Crew
description: SwipeEd node #g37 (ages 3-6), caring for your body. With Lensy and the Clean Crew, a child learns washing, brushing, a daily routine and simple healthy habits. The hygiene companion to body-safety; a gentle precursor to the unlearn-relearn beat.
resource: https://swipeed.vercel.app/game/clean-crew
tags: [games, swipeed, ages-3-6, hygiene, self-care, routines, healthy-habits, sam]
timestamp: 2026-06-20T12:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Clean Crew

> **Reworked to GDD 37 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The game is a **436-scenario typed library** (`content/games/clean-crew.ts`: hands 16 ·
> teeth 14 · bath-body 73 · toilet 9 · habits 17 · everyone 13) on the **shared v2 engine**
> (`components/games/v2-engine.tsx`), where a thin wrapper feeds the library + a `V2GameConfig`. Every scenario is
> one of **seven typed play actions** (reflect · role-play · strike-rewrite · branch · sort · match · build),
> **0% binary tap**, led by the signature **step-sequencer build** (put the wash/brush/bath/bedtime steps in
> order: the pieces are shuffled so the order is a real puzzle, "That's the clean way!"). Handwashing with
> soap; brush twice a day; bath/body; toilet hygiene; healthy habits, for every gender, never babyish,
> never "gross"; empower never shame; India-aware (no-soap resourcefulness). `gameId "clean-crew"` kept.
> The sections below describe the original v1 build.

**Node #g37 of the SwipeEd path** (ages 3-6, Thread A · Body & Growing Up), inserted at **play order 3:
right after [My Body, My Rules](my-body-my-rules.md)**. Once a child knows their body is *theirs*, Clean
Crew shows how to **look after it**: when and how to **wash**, **brushing** teeth and tidiness, a **daily
morning routine** done in order, and simple **healthy habits** (sleep, food, water, active play + rest).
Guided by **Lensy** and the friendly **Clean Crew**, it is **parent co-play, audio-first, no-fail, never
shaming**: germs "wash happily away," nobody is ever "dirty." Added in the 39-lesson Master Node Table
update; it feeds [Body Lab Juniors](body-lab-juniors.md) (#g06).

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path that launches in place (engine id `clean-crew`, route `/game/clean-crew`).
- **Type:** warm, audio-first self-care game · **tap-list + step-by-step** engine (no swipe, no fail, no timer).
- **Age band:** 3-6 (pre-literate) · co-play essential. **Curriculum:** UNESCO 6.5 (health/hygiene) + 6.1 (the body); India: NCERT/health & hygiene foundations.
- **Prereq:** [My Body, My Rules](my-body-my-rules.md) (#g02). **Builds toward:** [Body Lab Juniors](body-lab-juniors.md) (#g06).
- **Status:** live · https://swipeed.vercel.app/game/clean-crew

## How it works: five gentle modes (all no-fail)
1. **Wash Up!** *when* and *how* to wash (before food, after the toilet, after play/sneeze; soap & water). Tap each; germs wash happily away.
2. **Sparkle Smile**: brushing morning **and** night, little circles, comb, staying tidy after the toilet.
3. **Daily Routine** *(the heart)*: do the morning routine **step by step, in order**: wake → toilet → wash → brush → breakfast → water. A "✓ Did it!" advances; progress dots show the arc. The whole Crew cheers at the end.
4. **Healthy Me**: sleep, colourful food, water, active play **and** rest.
5. **I Can Do It!** celebrate doing it yourself, with a warm **grown-up-together** co-play prompt.

A **5-sticker chart** (📋 + one sticker per mode) fills as each mode is finished; the fifth sticker
finishes the node via `GameDone` (`gameId="clean-crew"`, 3★ / 20 coins). **Lensy** is the shared in-UI
companion (`src/components/games/sam.tsx`); voice via the shared `speak.ts` model with mute / replay tools.

## Inherited & established patterns
Inherits the [reusable patterns](swipeed-game-patterns.md) (no-fail, content-as-data, play-in-place +
shared juice, colour-never-only, audio-first, India framing, the 5-mode grid on `GameShell` chrome with a
Lensy header + sticker/badge row). **Deliberately has no formal UN & RE beat**, because at ages 3-6 this is a
*precursor*: Lensy models the gentle "germs we can't see wash away" reframe without naming the
unlearn→relearn ritual that [Green Light / Red Light](green-light-red-light.md) and the older nodes use.
Tone follows pattern #16 (empower, never frighten / never shame): nobody is "dirty," routines are warm
and celebrated, the grown-up is invited in rather than instructing.

## Status & roadmap
- **Built:** all five modes (Wash Up, Sparkle Smile, Daily Routine, Healthy Me, I Can Do It), the
  5-sticker chart, step-by-step routine sequencer, Lensy + voice (mute/replay), English audio narration.
- **Deferred (future):** a "Clean Crew" song, per-character Crew avatars, a fuller routine/food bank, an
  evening (bedtime) routine, and **Hindi** (with the app-wide l10n pass).

## Related
- [SwipeEd (app)](swipeed.md) · [My Body, My Rules (#g02)](my-body-my-rules.md) · [Body Lab Juniors (#g06)](body-lab-juniors.md) · [Reusable game patterns](swipeed-game-patterns.md) · [Games catalog](index.md)
