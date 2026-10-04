---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/can-do-kids.md
title: Can-Do Kids
description: An audio-first role-play game for ages 3-6, where any kid can be anything, and any feeling is for everyone.
resource: https://swipeed.vercel.app/game/can-do
tags: [games, swipeed, gender-equality, ages-3-6, tap-engine]
timestamp: 2026-06-19T12:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Can-Do Kids

> **Reworked to GDD 05 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The aspirations/careers game is a **503-scenario typed library**
> (`content/games/can-do.json`: anyone-be 87 · girls-can 88 · boys-can 85 · chores 11 · dream 15 · no-limit 84)
> on the **shared v2 engine** (`components/games/v2-engine.tsx`), where a thin wrapper feeds the library + a
> `V2GameConfig`. Every scenario is one of **seven typed play actions** (reflect · role-play · strike-rewrite
> · branch · sort · match · build), **0% binary tap**, led by **erasing occupational gender myths**
> (strike-rewrite ×134, the game's core, intentionally above the usual cap) + the **dress-up "I can be that"
> build** (try on any job; see yourself in the role). Any job for anyone; girls into STEM/leadership AND boys
> into care/arts (both directions); ability grows with practice; everyone helps at home; no dream off-limits
> by gender (India's "leaky pipeline"). Growth-mindset, never preachy, never villainising traditional roles.
> `gameId "can-do"` kept (the GDD's `can-do-kids` is design-doc only). The sections below describe the
> original v1 build.

**Node #5: the anti-stereotype step** of the Gender & Respect thread (ages 3-6), right after
[Same Same, Different](same-same-different.md): *we're all equal → so anyone can do anything.* Guided by
**Lensy**, the child spins a role wheel, gleefully pops an **even-handed myth monster**, and learns that
feelings, toys, colours and chores aren't gendered. Joyful, even-handed (lifts boys up too), no-fail.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · route `/game/can-do`
- **Type:** micro-learning game · **Dress-up / role-play** engine (no fail, no timer)
- **Age band:** 3-6 · **Curriculum:** UNESCO ITGSE topic 3.2 (gender equality & stereotypes); aligns with Beti Bachao, Beti Padhao
- **Status:** live (rebuilt to the GDD) · https://swipeed.vercel.app/game/can-do

## What it teaches
Any child can do any job (a girl can be a pilot; a boy can be a cook); all feelings are for everyone
(boys can cry; girls can be brave and strong); toys/colours/games aren't "for boys/girls"; and
"that's only for boys/girls" is a myth worth busting.

## How it works: Lensy + five modes (no-fail)
1. **Be Anything**: spin the role wheel (doctor · pilot · chef · cricketer · dancer · firefighter · teacher · scientist · soldier · artist); "Anyone can be a …!" + a do-the-job line; a **badge** lands in the **Can-Do Badge Book**.
2. **Bust the Myth Monster**: a lovable monster grumbles a stereotype → tap to **pop** it → "Anyone can!". **Even-handed**: challenges myths about boys (cook/cry/dance) as often as girls (lead/build/cricket) and about things (pink/trucks/dolls). Pop a *myth*, never a person. The ages-3-6 **seed of [Unlearn → Relearn → Grow](swipeed-core-principle.md)** (no UN&RE characters, no "you were wrong").
3. **Feelings for All**: boys can cry; girls can be brave (a callback to Feelings Friends).
4. **Toys & Chores**: Papa can cook; Didi can fix the cycle; pink/trucks/dolls for everyone.
5. **Make-a-Can-Do-Kid**: the **shared inclusive builder** (`components/games/make-a-kid.tsx`, also used by Same Same's Make-a-Friend); turns "anyone can" into "so can I".

Filling the **Can-Do Badge Book** (try 5 roles) is the celebratory finish. Uses the shared voice model
(emoji-stripped, held transitions, "hear it again" replay) and shared juice.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio-first contract (#10), the **shared inclusive builder** (#17), India framing (#14). Even-handed by
design: challenges stereotypes, never children, and never says one gender is "better".

## Status & roadmap
- **Built:** Lensy, all five modes, the Badge Book, the shared Make-a-Kid builder; English narration. Content in `src/content/games/can-do.json`.
- **Deferred (GDD Phase 2/3):** the "Anyone Can!" **song**, group/Anganwadi mode, a fuller role & myth bank, and **Hindi**.
