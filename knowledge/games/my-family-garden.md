---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/my-family-garden.md
title: My Family Garden
description: "SwipeEd node #3 (ages 3-6), the start of the Relationships thread. With Lensy, a child builds their own family, learns to be a good friend, and grows a Kindness Garden that blooms with every caring act."
resource: https://swipeed.vercel.app/game/family-garden
tags: [games, swipeed, ages-3-6, relationships, families, kindness, sam]
timestamp: 2026-06-19T21:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# My Family Garden

> **Reworked to GDD 03 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The game is a **466-scenario typed library** (`content/games/family-garden.ts`:
> what-is-family 79 · family-shapes 80 · made-of-love 76 · all-real-good 79 · helping-belonging 71 ·
> my-family 81) on the **shared v2 engine** (`components/games/v2-engine.tsx`), where a thin wrapper feeds the
> library + a `V2GameConfig`. Every scenario is one of **seven typed play actions** (reflect · role-play ·
> strike-rewrite · branch · sort · match · build), **0% binary tap**, led by the signature **grow-your-garden
> build** ("That's my garden!"). Affirms every family shape (joint, single-parent, grandparent-led,
> adoptive, blended, two-homes; India-centred); a family is the people who love & care for you, in any shape,
> and every one is real and good. Empower never frighten, pride not shame, no-fail, audio-first. `gameId
> "family-garden"` kept. (Engine generalised here: per-game `buildLabels` for the build "done" button, and
> family-belonging vocabulary in the bin tinting.) The sections below describe the original v1 build.

**Node #3 of the SwipeEd path** (ages 3-6, Thread D · Relationships) and the **start of the Relationships
thread**. Guided by **Lensy**, a child builds their **own family, whatever it looks like**, learns that
families love and care for one another, practises being a good **friend**, and grows a **Kindness
Garden** that blooms a little more with every caring thing they do. The message: **every family is
special, and love means caring for each other.** Warm, audio-first, no-fail, co-played.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path that launches in place (engine id `family-garden`, route `/game/family-garden`).
- **Type:** warm, audio-first relationships & kindness game · **Build / tap** engine (no fail, no timer).
- **Age band:** 3-6 (pre-literate) · co-play. **Curriculum:** UNESCO 1.1 (Families), 1.2 (Friendship & love, at this age), 7.1 (giving/receiving love & affection). **Affection & care only, no romantic content.**
- **Status:** live · https://swipeed.vercel.app/game/family-garden

## How it works: five warm modes (all no-fail)
1. **Make My Family**: build your own family from a **radically inclusive** set (joint/extended led, plus nuclear, single-parent, grandparent-led, adoptive/foster/guardian, blended, + pets). The builder is **additive (repeats allowed)**, so *any* structure is buildable, including **two mums or two dads** (an explicit prompt says so). Lensy celebrates whatever you build: *every family is special, and yours is one of them.* (This goes beyond the GDD's Appendix A, which didn't list same-sex parents.)
2. **Families Care**: a short scene → tap the **caring** thing (comfort, help, celebrate together, say thank you); any tap is warm, a gentle nudge guides.
3. **Friends Forever**: kind friend-actions: share, take turns, include the new kid, say sorry, cheer.
4. **The Kindness Garden** *(signature)*: every kind act **blooms a flower**; care made visible. This is the age-right, white-hat progression (only growth, nothing to lose) and the run's completion driver.
5. **Kinds of Love**: family / friend / pet affection, and the everyday ways we show it.

The **Kindness Garden** grows across all the caring modes; filling it is the celebratory finish that
marks the node done. **Lensy** is the shared in-UI companion; his world (the macro "growing world") gains
the child's garden.

## Inherited patterns
Built on the [reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1),
play-in-place + shared juice (#3, #11), colour-never-only + audio-first (#10), text-light age-adaptive
(#13), and **India framing (#14)** leads with the beloved joint family while warmly including every
family shape so no child feels singled out. The garden is an instance of white-hat progression (#6).
It opens the **Relationships** thread that deepens to Friend or Frenemy? → Crossroads →
[Green Light / Red Light](green-light-red-light.md) → Mutual.

## Status & roadmap
- **Built:** all five modes, the inclusive family-builder, the blooming Kindness Garden, Lensy reused;
  English (audio narration). Content in `src/content/games/family-garden.ts`.
- **Deferred (GDD Phase 2/3):** the "Love Is Caring" **song**, persisted family album + garden, group/
  Anganwadi mode, festival packs, a fuller family & scene bank, and **Hindi** (app-wide l10n pass).

## Related
- [SwipeEd (app)](swipeed.md) · [Feelings Friends (#1)](feelings-friends.md) · [My Body, My Rules (#2)](my-body-my-rules.md) · [Reusable patterns](swipeed-game-patterns.md) · [Games catalog](index.md)
