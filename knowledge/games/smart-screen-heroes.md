---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/smart-screen-heroes.md
title: Smart Screen Heroes
description: A four-mini-game hero set for ages 6-9. Tell real from pretend on a screen (UN & RE), make good everyday choices, bust germs, and be kind to a friend who's unwell. Closes Chapter 2 and opens the media-literacy and health threads.
resource: https://swipeed.vercel.app/game/smart-screen
tags: [games, swipeed, media-literacy, health, ages-6-9, mini-game-set]
timestamp: 2026-06-20T13:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Smart Screen Heroes

> **Reworked to GDD 12 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The early media-literacy game is a **436-scenario typed library**
> (`content/games/smart-screen.ts`: real-or-pretend 71 · spot-the-ad 67 · is-it-true 71 · screen-choices 74 ·
> screen-hygiene 74 · caring-online 79), generated **faithfully** from the scorecard-passed GDD JSON, on the
> **shared v2 engine** (`components/games/v2-engine.tsx`). Every scenario is one of **seven typed play actions**
> (branch ×115 · reflect ×91 · strike-rewrite ×76 · sort ×57 · spot ×7 · role-play ×48 · build ×49), **0% binary
> tap**, led by smart-screen **dilemmas** (branch), the signature **spot-the-ad / spot-the-fake** scenes (spot),
> and the balanced-day / healthy-screen **builders** (build). Foundational media literacy & digital wellbeing:
> real vs pretend, spotting ads & persuasion (auto-play, "free", "hurry", influencer/paid), checking what's
> true, balanced screen choices, screen hygiene (eyes/posture/sleep), and being kind & safe online. Ethics:
> **not anti-tech** (savvy & balance, never fear or banning: screens are one good thing among many);
> **persuasion named** (design tricks exposed so the child stays in charge); **wellbeing as self-care** (not
> rules imposed); **safety hand-off** (online strangers / upsetting content route to a trusted grown-up &
> [Safety Squad](safety-squad.md): `helpLine` Childline 1098; the two `outcome:"safe"` branches trigger the
> `reassure` "not your fault" banner). Engine: **no new mechanic** (reuses 7 of 9); a `binStyle` valence
> accretion (not-a-real-check/not-so-great/hard-on-me/pushy-trick → red, good-check/great-choice/good-for-me/
> trustworthy → green), while **real/pretend, ad/content and highlight/real-life stay neutral distinctions**
> (blue/purple, not good-vs-bad). **`gameId "smart-screen"`** kept: the GDD/library's `smart-screen-heroes` is
> **design-doc only**; the config must use the engine-host registry id. Wrapper kept as `SmartScreenGame`. **This
> completes all eight Chapter 2 games (g06-g12, g41) to v2.** The sections below describe the original v1 build
> (four-mini-game set), superseded by the v2 mechanic engine.

**Node #12 closes Chapter 2 (ages 6-9)** and quietly opens two long threads: **media literacy** and
**health**. Where Not Fair, Not Funny taught standing up for others, this hands the child their first
media-literacy tool (*"is this real, or just pretend?"*) and rolls it together with good everyday
choices, simple hygiene, and being kind to someone who's unwell. A bright, varied **set of four hero
mini-games + a habits wrap**, played in any order; reading-light, audio-first, and no-fail throughout.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `smart-screen`, route `/game/smart-screen`.
- **Type:** reading-light **mini-game set** (media · choices · health · kindness) · no fail, no timer.
- **Age band:** 6-9 · **Curriculum:** UNESCO 5.4 (media literacy), 5.2 (decision-making), 8.3 (hygiene), 8.2 (care, not stigma). Builds on Not Fair, Not Funny (#11); the last lesson before [Capstone 2](capstones.md).
- **Status:** live · https://swipeed.vercel.app/game/smart-screen

## How it works: four hero missions + a habits wrap & the Hero Badge Book
1. **Real or Pretend?** sort screen things (a fairness-cream ad, a snack ad, a flying cartoon, a real
   photo of a dog…) into **real** or **pretend**, learning that ads exaggerate and screens can show
   made-up things. The **fairness-cream ad carries the [UN & RE](swipeed-core-principle.md) beat**: UN
   erases *"ads are made to sell things; that promise isn't really true, and it's not your fault for
   believing it"*, RE redraws *"a screen can show pretend things; you decide what to believe, and your
   skin is already good"*, deliberately tying media literacy back to the **anti-colourism of Body Lab Juniors**.
2. **Good Choice**: simple decision trees (brush/skip, share/grab, ask/take, sleep/stay up): the good
   choice celebrates and advances; the other gives a **friendly, non-shaming consequence** and a retry.
3. **Germ Busters**: a gentle scrub rhythm: tap to wash the germs away, then cover your cough; sparkly-clean
   payoff. Hygiene made fun (aligned with Swachh Bharat / Ayushman Bharat health-and-wellness).
4. **Be Kind, Not Mean**: a friend is unwell; choose to sit with them and be gentle rather than tease or
   avoid. **Care, not stigma**: kept to ordinary illness, it plants the seed the HIV/infection games
   ([Defenders of the Body #20](index.md) and beyond) build on directly.
5. **Smart Screen Habits** *(wrap)*: take breaks, balance screen time, and **tell a grown-up if something
   online confuses or upsets you** (a callback to Safety Squad).

A 5-badge **Hero Badge Book** with a **levelling-up cape** (🦸) tracks the missions; filling it finishes
into the shared [`GameDone`](swipeed.md) card. Reuses **Lensy** + the shared **`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), the UN & RE move ([core principle](swipeed-core-principle.md)), **India framing
(#14)** (India-true ad parodies: fairness cream, junk food, toy ads, never real brands; Swachh Bharat
hygiene), and **#16 empower-never-frighten** (screens aren't "bad", just to be read wisely; upsetting
content routes to a trusted adult, no fear-mongering).

## Thread role
The pivot game of the path: its *"real or pretend?"* is the first rung of the **media-literacy ladder**
(→ Flip the Script #17, Reality Check #28, Decoded #36); its hygiene and care-not-stigma open the
**health thread** (→ Defenders of the Body #20, then the HIV/STI games); and its Good Choice deepens the
life-skills thread first met as "simple choices" in [Feelings Friends](feelings-friends.md).

## Status & roadmap
- **Built:** all four mini-games + the habits wrap, the Hero Badge Book + levelling cape, the UN & RE
  media beat, the Germ Busters scrub/cough rhythm, the care-not-stigma kindness scenes; English narration.
- **Deferred (GDD Phase 2/3):** "Make a True Ad" creation, a gentle daily streak, a fuller ad/scene bank,
  Classroom-Mode polish, calm (reduced-stimulation) mode, and **Hindi**.
