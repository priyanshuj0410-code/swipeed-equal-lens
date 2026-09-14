---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/same-same-different.md
title: Same Same, Different
description: An audio-first tap game for ages 3-6 - we share the same feelings and worth, and every difference is wonderful.
resource: https://swipeed.vercel.app/game/same-same
tags: [games, swipeed, gender-equality, ages-3-6, tap-engine]
timestamp: 2026-06-19T12:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
---

# Same Same, Different

> **Reworked to GDD 04 v2 - the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The **gender-root** game is a **434-scenario typed library**
> (`content/games/same-same.ts`: toys-for-all 69 · colours-for-all 74 · anyone-can 75 · strong-gentle 71 ·
> different-wonderful 74 · fair-friends 71) on the **shared v2 engine** (`components/games/v2-engine.tsx`) - a
> thin wrapper feeds the library + a `V2GameConfig`. Every scenario is one of **seven typed play actions**
> (reflect · role-play · strike-rewrite · branch · sort · match · build), **0% binary tap**, led by **erasing
> silly gender rules** (strike-rewrite ×87) + the anyone-can/silly-rule sort. Toys & colours for everyone;
> anyone can do anything; strong AND gentle; equal inside, wonderfully different (India colourism / Dark is
> Beautiful); fair play means everyone belongs. Both directions (frees girls AND boys), never preachy,
> no-fail, audio-first. `gameId "same-same"` kept (the GDD's `same-same-different` is design-doc only).
> The sections below describe the original v1 build.

**Node #4 - the gender opener** (ages 3-6, Thread E). A warm, **audio-first, no-fail** discovery game:
guided by **Lensy**, the child meets two children who look different, **taps what they SHARE** (each tap
lights a **friendship thread**) until they **become friends** - a flower blooms in the **Friendship
Garden** - then celebrates what's **different** ("different is wonderful"). Plants the first root of
gender equality: *same inside, gloriously different outside, everyone deserves respect.*

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · route `/game/same-same`
- **Type:** micro-learning game · **Tap / discovery** engine (no fail, no timer)
- **Age band:** 3-6 · **Curriculum:** UNESCO ITGSE 3.1 (social construction of gender) + 1.3 (respect), light 3.2 (anti-stereotype)
- **Status:** live (rebuilt to the GDD) · https://swipeed.vercel.app/game/same-same

## What it teaches
We all feel the same things and deserve the same kindness; **anyone can do anything** regardless of
gender; and everyone deserves a turn, to be included, and to be safe. Three gently deepening **layers**:
Feelings → Can-Do → Fair & Safe.

## How it works
- Two diverse children appear (India-diverse cast incl. a child using a wheelchair). **"What do they
  share?"** - the child taps the sames; each lights a friendship thread, and when all connect they
  **become friends** (a Friendship-Garden flower blooms, with a celebration).
- **"What's different? Different is wonderful!"** - every difference is celebrated, never ranked.
- A gentle **myth-bubble pop** ("Science is only for boys!" → pop → "Anyone can!") - the ages-3-6 **seed
  of [Unlearn → Relearn → Grow](swipeed-core-principle.md)** (no UN & RE characters, no "you were wrong" -
  over-correcting the very young is counterproductive).
- **Make-a-Friend** - an inclusive avatar builder (skin tone + accessibility: glasses / wheelchair /
  hearing aid) whose friend "can do anything" (per pattern #17).
- **No wrong taps**, no fail; audio-first narration (the shared voice model - emoji-stripped, transitions
  held until the line finishes, with a "hear it again" replay); finishes into the shared [`GameDone`](swipeed.md) card.

## Inherited patterns
Built on the [reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared
juice (#11), audio-first narration contract (#10), the inclusive builder (#17), and the India framing
(#14 - a wide skin-tone spectrum to counter colourism; non-stereotyped roles to counter son-preference).

## Status & roadmap
- **Built:** the discover loop (share → friends → different), Lensy, the Friendship Garden, the myth-pop,
  Make-a-Friend, all three layers; English narration. Content in `src/content/games/same-same.ts`.
- **Deferred (GDD Phase 2/3):** the "Same Inside" **song**, group/Anganwadi mode, a fuller diversity
  matrix & friend album, caregiver guidance, and **Hindi**.
