---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/defenders-of-the-body.md
title: Defenders of the Body
description: A gentle tower-defence for ages 9-12. Place good-habit defences to stop germs, blast the "myth-germs" with real HIV/health facts (UN & RE), befriend a classmate living with HIV (care, not fear), and meet the health helpers. No punishing fail. Closes Chapter 3.
resource: https://swipeed.vercel.app/game/defenders
tags: [games, swipeed, srh, hiv, health, anti-stigma, ages-9-12]
timestamp: 2026-06-20T17:30:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Defenders of the Body

> **Reworked to GDD 20 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The immune-system + infection-myth-busting + HIV anti-stigma node (and the game that
> **closes Chapter 3**) is now a **514-scenario typed library** (`content/games/defenders.ts`: your-defenders 12 ·
> how-germs-spread 91 · defend-yourself 80 · HIV-basics 12 · spreads-or-not 81 · kindness-not-fear 92),
> generated **faithfully** from the scorecard-passed GDD 20 JSON, on the **shared v2 engine**
> (`components/games/v2-engine.tsx`). The old tower-defence build is replaced by **seven typed play actions**
> (strike-rewrite ×105 · sort ×88 · branch ×71 · reflect ×57 · spot ×58 · role-play ×70 · match ×65), **0% binary
> tap**, led by **strike-rewrite** (myth-bust) + **sort** (true/false & spreads-or-not). Arc: your defenders →
> how germs spread → defend yourself → HIV simply → spreads-or-not → **kindness, not fear**. HIV is taught
> **age-right: facts + anti-stigma only** (sexual transmission waits for [Outbreak](outbreak.md) g23): HIV is a
> virus **anyone can have**, never a punishment or a verdict on character; with treatment people live long,
> healthy, normal lives; what spreads it (blood, parent-to-baby) vs what **never** does (hugs, sharing food,
> everyday contact, per CDC/NIH); **health is private**; people living with HIV **belong fully**: defend others'
> dignity. Engine: **no new mechanic** (reuses 7 of 9); a `binStyle` valence accretion limited to
> **defence-quality / true-false / fact-myth**: every **HIV transmission-fact bin (can/cannot spread,
> how/not-how) stays NEUTRAL** and risk sides are never red, so play never paints transmission as shameful (the
> anti-stigma guardrail). Generator injects spot scene-item ids (g20's library omitted them). `gameId "defenders"`
> (the engine-host registry id; the GDD/library aspirational id is `defenders-of-the-body`). Builds on
> [Smart Screen Heroes](smart-screen-heroes.md) (g12); prereq g19. The sections below describe the original v1
> tower-defence build, superseded by the v2 mechanic engine.

**Node #20: the SRH health step that closes Chapter 3** (ages 9-12). A gentle "defend the body's city"
game: the child places **good-habit defences** to stop germs, **powers up with real facts** to blast the
**"myth-germs"** (misinformation enemies like *"you can catch HIV from a hug!"*), and learns the biggest
lesson of all: **people who are unwell deserve care, never fear.** HIV is taught **at facts +
anti-stigma level only** (sexual transmission waits for **Outbreak #23**). It grows directly from
[Smart Screen Heroes](smart-screen-heroes.md) (#12): that game's hygiene and its gentle "be kind to a sick
friend" seed become **real health habits and a full anti-stigma storyline** here.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `defenders`, route `/game/defenders`.
- **Type:** reading-light **gentle tower-defence** (defend · stay healthy · blast myths · befriend · find help) · no punishing fail.
- **Age band:** 9-12 · **Curriculum:** UNESCO 8.2 (HIV & stigma), 8.3 (infections), both at this age level. Builds on #12; closes Chapter 3.
- **Status:** live · https://swipeed.vercel.app/game/defenders

## How it works: five modes + the defender Badge Book
1. **Defend the Body**: pick the **good-habit defence** (handwashing tower, vaccine shield, cover-the-cut)
   that stops each germ wave; if a germ gets through you simply learn why and try again.
2. **Stay Healthy**: build the everyday habits: wash hands, clean water, vaccines, cover cuts / **never
   share blades or needles**, eat and sleep well.
3. **Fact Power-Ups**: the **UN & RE** core. Blast each **myth-germ** with the real fact (*"catch HIV
   from a hug"*, *"HIV is a death sentence"*, *"mosquitoes/sharing food spread it"*, boss: *"you can tell
   who has HIV by looking"*). UN erases the fear, RE redraws the fact.
4. **Bust the Stigma**: the warm storyline: befriend **Ravi**, a classmate living with HIV who loves the
   same games. Choose **care, not fear**: *you can't catch HIV from everyday contact; it's manageable
   with medicine; care and friendship are the right response.*
5. **Health Helpers**: where to get help (a doctor, a hospital/clinic, an ASHA/health worker) and the
   reassurance that **HIV and most infections are treatable.**

A 5-badge **defender Badge Book** finishes into the shared [`GameDone`](swipeed.md) card. Reuses **Lensy** +
the shared **`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4: the tower-defence has *no punishing
game-over*), content-as-data (#1), shared juice (#11), audio contract (#10), the UN & RE move
([core principle](swipeed-core-principle.md): *the Fact power-ups*), **myth-bust-by-choosing-the-truth
(#19)**, **empower-never-frighten (#16)** (HIV handled as facts + **care, not fear**, never alarming), and
**India framing (#14)** (NACO/Adolescence Education alignment; ASHA workers; Swachh Bharat hygiene).

## Status & roadmap
- **Built:** Defend the Body (choose-the-defence waves), Stay Healthy, Fact Power-Ups (UN & RE myth-germ
  battle incl. a boss), Bust the Stigma (the Ravi care-not-fear storyline), Health Helpers; the defender
  Badge Book; English narration.
- **Deferred (GDD Phase 2/3):** a real place-and-defend tower-defence interaction, the returning Ask-It
  box, crown levels (harder waves), a fuller fact/myth bank, Classroom-Mode polish, calm mode, and **Hindi**.
