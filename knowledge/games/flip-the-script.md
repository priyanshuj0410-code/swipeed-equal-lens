---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/flip-the-script.md
title: Flip the Script
description: A five-mode media-editor game for ages 9-12 - spot the gender/colour/body stereotype hiding in ads and films, flip it fair (before→after), bust the colourism media myth (UN & RE), meet Real Stars, and make your own fair ad. No-fail.
resource: https://swipeed.vercel.app/game/flip-script
tags: [games, swipeed, gender-equality, ages-9-12, media-remix, media-literacy]
timestamp: 2026-06-20T16:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
---

# Flip the Script

> **Reworked to GDD 17 v2 - the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The gender-stereotype node - and the **strike-and-rewrite (UN/RE) flagship** the strategy
> names by name - is a **536-scenario typed library** (`content/games/flip-script.ts`: spot-it 94 · jobs-roles 84
> · feelings-strength 92 · looks-stuff 85 · flip-it 90 · call-it-out 91), generated **faithfully** from the
> scorecard-passed GDD JSON, on the **shared v2 engine** (`components/games/v2-engine.tsx`). Every scenario is
> one of **seven typed play actions** (strike-rewrite ×138 · spot ×89 · reflect ×61 · branch ×66 · role-play ×69 ·
> sort ×63 · match ×50; no build), **0% binary tap**, led by the **strike-and-rewrite card** (the signature flip:
> erase a stereotype, write the fair truth) and **spot-the-stereotype** media frames. **These flip + spot
> renderers are the reference implementation the whole gender thread** (MythBuster Gender g25, Equalize g26,
> Smart Screen g12, Norm Storm g18) reuses. The spot → flip → call-it-out arc: spot stereotypes in
> ads/films/songs/toys, that any job/role/trait/colour/feeling belongs to everyone, then flip a stereotyped
> message to a fair one and call it out kindly. Ethics: **question don't preach**; **respectful of culture**
> (flips family/tradition respectfully - "is this fair, na?" - question without attacking elders); **no one's the
> villain** (learned scripts, not bad people); **all genders freed** (boy-scripts AND girl-scripts - "boys can
> cry" beside "girls can lead"; `reassure` + `reassureCats` ["feelings-strength"]); **safe to call out** (kind,
> doable lines; one voice can spark others). Engine: **no new mechanic** (reuses 7 of 9); a `binStyle` valence
> accretion (stereotype/made-up-rule/repeats-it → red, anyone/real-reason → green) - note the cross-game "Breaks
> it" collision with [What Makes Me, Me](what-makes-me-me.md) (g07, where it's negative) resolves to a neutral
> pair here. Build note: g17's library `spot` scenes omitted the inner item `id` the strict `SpotScenario` schema
> requires, so the generator injects a/b/c ids. **`gameId "flip-script"`** kept - the GDD/library's
> `flip-the-script` is **design-doc only**. Builds on [Fair Play World](fair-play-world.md) (g10); prereq g16.
> The sections below describe the original v1 build, superseded by the v2 mechanic engine.

**Node #17 - the Gender & Respect media step of Chapter 3** (ages 9-12). The child becomes a **media
editor** who spots the gender, colour and body stereotypes hiding in ads and films, then **flips them
into something fair and real** - and *the flip IS the [UN & RE](swipeed-core-principle.md) move*. It picks
up the media literacy seeded in [Smart Screen Heroes](smart-screen-heroes.md) (#12, "real or pretend?"),
the gender ideas of [What Makes Me, Me](what-makes-me-me.md) (#7, "stereotypes are learned") and the
fairness of [Fair Play World](fair-play-world.md) (#10), and turns them into an **active, creative power**:
the child doesn't just notice unfairness, they remake it fair. The **colourism** work is a key spiral
relearn back to Body Lab's "every skin is good".

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `flip-script`, route `/game/flip-script`.
- **Type:** reading-light **media-editor** game (spot · flip · bust · meet · make) · no fail.
- **Age band:** 9-12 · **Curriculum:** UNESCO 3.1 & 3.2 (gender as social construction + stereotypes), 5.4 (media literacy). Builds on #7, #10, #12.
- **Status:** live (rebuilt to the GDD) · https://swipeed.vercel.app/game/flip-script

## How it works - five modes + the editor Badge Book
1. **Spot the Stereotype** - a mock poster/film appears; the child identifies the gender/colour/body
   stereotype hidden in it (rescued-heroine trope, fairness-cream colourism, "real boys don't cry").
2. **Flip It!** - the signature mode: swap the biased line for a fair one and see a satisfying
   **before → after** ("Get fair skin to find a husband" → "Every skin is beautiful - beauty isn't a colour").
3. **Bust the Media Myth** - the **UN & RE** beat on colourism: UN erases *"ads are made to sell; that
   message isn't true, and it's not your fault for soaking it up"*, RE redraws *"every skin is beautiful;
   beauty isn't a colour."*
4. **Real Stars** - against the media's narrow images, meet real, diverse role models (women scientists /
   pilots / leaders; men who cook, care and dance; every skin tone, size and ability).
5. **Make a Fair Ad** - design your own fair messages into the **Flipped Gallery**.

A 5-badge **editor Badge Book** finishes into the shared [`GameDone`](swipeed.md) card. Reuses **Lensy** +
the shared **`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), the UN & RE move ([core principle](swipeed-core-principle.md) - *the flip itself*),
**India framing (#14)** (Bollywood/TV/advertising literacy - "fairness" products & colourism, "for the
lady of the house", the rescued-heroine trope; never real brands; Beti Bachao framing), and
**don't-villainise (#15)** (critiques the media, celebrates real people).

## Status & roadmap
- **Built:** all five modes (Spot, Flip It! before→after, Bust the Media Myth UN & RE, Real Stars, Make a
  Fair Ad → Flipped Gallery), the editor Badge Book; English narration.
- **Deferred (GDD Phase 2/3):** richer editor tools (swap image/role/recolour), a fuller stereotype bank,
  crown levels (subtler bias), Classroom-Mode polish, calm mode, and **Hindi**.
