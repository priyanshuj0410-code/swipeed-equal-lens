---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/swipeed.md
title: SwipeEd
description: A Duolingo-style micro-learning APP that turns the whole ages 3 → parenthood relationships, sexuality & life-skills curriculum into one gamified learning path, the first product built (toward) Owhile. All 69 games grown to ≥400 scenarios.
resource: https://swipeed.vercel.app
tags: [swipeed, app, micro-learning, learning-path, cse, rse]
timestamp: 2026-06-19T12:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/5f63c3db-0db3-4bb1-ab29-2806c72782cb  # SWED-83
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/73023a9c-e912-4e59-ab0a-b4028cacc7e7  # SWED-84
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/bebd5a55-4403-44f5-866f-2a30d6e79f17  # SWED-133
---

# SwipeEd

**SwipeEd is an app, not a single game.** It turns the entire **ages 3 → parenthood** relationships,
sexuality & life-skills (RSE/CSE) curriculum into one friendly, **Duolingo-style learning path** where
every lesson is a short play-to-learn game. It is **built and owned by [The Equal Lens](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/partners/the-equal-lens/index.md)**, Owhile's first customer and design partner, and is the app whose requirements shaped the [Owhile](../README.md) engine design (today
it is self-contained: see [current state](#current-state-vs-the-plan)).

> **Terminology: read this first.** "SwipeEd" names the app's signature interaction (the swipe), the
> repo is `swipeed-equal-lens`, and the URL is swipeed.vercel.app, so it is easy to mistake SwipeEd for "the
> swipe game." It is not. SwipeEd is the **whole path**; [Green Light / Red Light](green-light-red-light.md)
> is the *first game within it* (the exemplar of the swipe engine). Every game in the
> [catalog](index.md) is an individual game that lives on the SwipeEd path.

## Overview
- **Type:** micro-learning **app** (Sections → Units → lessons on one path), with coins/XP, streaks, levels, spaced review
- **Status:** live · https://swipeed.vercel.app
- **Repo:** [github.com/priyanshuj0410-code/swipeed-equal-lens](https://github.com/priyanshuj0410-code/swipeed-equal-lens) (public)
- **Stack:** Next.js (App Router) + React + Tailwind v4 + vanilla shadcn + **React-Three-Fiber** (the 3D path) + PWA: see [stack, build and deployment](../architecture/deployment.md) and [design system](../design.md)
- **Curriculum backbone:** UNESCO ITGSE concepts/topics; WHO Europe (ages 3-6); India: Ayushman Bharat, AEP, POCSO
- **Audience:** ages 3 → parenthood across eight age-gated chapters (experience shifts parent-led → self-directed → adult)

## The learning path
The landing screen (`/path`) is a stylised **3D winding path** over a grassland (R3F + Kenney CC0
models, cel-shaded, instanced foliage). Each node is a lesson (a game), shown as its lesson emoji with
a state badge (locked / current / completed). Tapping a playable node **launches the game in place
over the grassland**, no navigation away. The path windows to ~5 nodes at a time and loads more as
you travel (scroll/drag). A streak + stars pill sits top-left; **Get Help** is always one tap away
(collapsed to an icon during play). A 2D fallback lives at `/classic` for devices without WebGL.

The path is **driven by one spreadsheet** (the Master Node Table → `src/content/path.ts`) and its
chapter regions carry **per-region seasons, weather, day/night, and a walking companion**, all
styling layered on the *same* single path. See **[The Path World (3D)](swipeed-world.md)** for the full
world, loading, and performance model.

**Onboarding now captures an age band** (alongside name + avatar): the learner enters at *their* chapter
with its first node open (earlier chapters stay open for **revision**) and the path then **gates forward**
along the master table's `prereq` chain (locked nodes until prerequisites are done). The captured **name is
threaded into the messaging**: the mascot's per-game greeting ("Aanya! …") and the path's "Play, Aanya?"
cue (`src/lib/personalize.ts`). The UN/RE myth notes on the path are now **interactive drawing** (erase the
myth, draw the truth), with **one-finger-draw / two-finger-scroll**: see the Path World doc.

## The lesson engines (the keystone)
The curriculum's many games collapse into a **handful of reusable lesson engines**: build the engine
once, then feed it content per topic and age (exactly how Duolingo runs thousands of exercises on a
few types). Engines built so far:

| Engine | Games using it |
|--------|----------------|
| **Swipe** | [Green Light / Red Light](green-light-red-light.md), MythBuster: Gender |
| **Tap / celebrate** | [Same Same, Different](same-same-different.md), [Can-Do Kids](can-do-kids.md) |
| **Sort / assign** | [Fair Play World](fair-play-world.md) |
| **Choose-the-action / scenario** | [Not Fair, Not Funny](not-fair-not-funny.md), [Speak Up](speak-up.md), [Stand Up](stand-up.md) |
| **Media-remix** | [Flip the Script](flip-the-script.md) |
| **Sim** (dashboard · campaign · case) | [Lead the Way](lead-the-way.md), [Change Makers](change-makers.md), [Justice League: Rights](justice-league-rights.md) |

In code, every game plays in place via a shared **`GameShell`** (glass chrome over the path) +
an **`engine-host`** id→component registry; swipe decks run through `useSwipeGame`; **all** games
finish into one shared **`GameDone`** completion card. Audio-first narration (`speak.ts`) supports the
pre-literate youngest games.

## Games on the path
See the **[games catalog](index.md)** for every individual game. The **whole path is live**: all
**69 lesson nodes + 8 [capstone graduations](capstones.md)** across eight age-band chapters (ages 3 →
parenthood), each built and documented as its own first-class game. Every one of the 69 games has been
grown to **≥400 scenarios** via the [forge content pipeline](swipeed-content-pipeline.md): see
[what we built & why](swipeed-build-overview.md). Most follow a shared **5-mode + UN & RE** shape;
**Green Light / Red Light** (#24) is the flagship roguelike, and **MythBuster** also keeps its original
swipe deck.

## Design principles
**Core learning principle: [Unlearn → Relearn → Grow](swipeed-core-principle.md).** Growth on these
topics is as much about gently *un-learning* the half-truths children carry in (peers, screens, ads) and
*re-learning* something truer as it is about new facts, repeated across the spiral for fourteen years.
Everything else serves it: *you're not wrong, you're growing*, *changing your mind is brave*, and
*replace, never just negate* (debunking without a replacement doesn't stick). Expressed by the **UN & RE**
duo and a four-beat **Surface → Unlearn → Relearn → Grow** ritual.

Supporting principles: micro-learning (one idea, 3-5 min) · play-to-learn (always *do* something) ·
spiral (topics return deeper each band: each loop is a relearn) · **ethical gamification** (no
fail-state, no public ranking on sensitive topics, no heart-gating, cosmetic-only rewards) ·
**safety-first** (Get Help permanent; serious content is supported, never scored) · age-adaptive
(co-play + audio for the young; self-directed for teens).

**Owner decisions on safety content (2026-10-03).**
- **Health facts, care by referral ([SWED-84](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/73023a9c-e912-4e59-ab0a-b4028cacc7e7)).** The Equal Lens canon says it does no clinical content. The app's exception: SwipeEd teaches accurate health facts (STIs and HIV, contraception, body changes) and never gives treatment advice. Every clinical topic points to a clinician or service for care.
- **Correct body words from Chapter 1 ([SWED-83](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/5f63c3db-0db3-4bb1-ab29-2806c72782cb)).** My Body (3 to 6) and Body Lab (6 to 9) introduce the correct words for genitals and private parts at normal volume, alongside "private parts", as body-safety guidance recommends: a child who has the words can report abuse clearly. Defenders follows. The rewrite goes through the reviewed content pipeline, and it unblocks the body-safety pictures (SWED-121).

## Current state vs. the plan
SwipeEd is **self-contained today**. It does **not yet consume a shared Owhile
[Engine SDK](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/engine-sdk.md)**: the reusable lesson engines above live **inside the
SwipeEd repo** and are the *seeds* of the future shared engine. Likewise, its games are **in-app
modules** (route `/game/<id>`, or in-place for swipe), **not yet separate repos** in the planned
[poly-repo topology](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/repo-topology.md). As the Owhile engine is extracted, these
engines and games are intended to migrate onto it (the GDD's "embed as a module + feed anonymised
insights" maps onto the planned SDK + [registry](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/game-registry.md) + analytics).

## Related
- [Owhile vision](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/platform/vision.md) · [Games catalog](index.md) · [Reusable game patterns](swipeed-game-patterns.md) · [Life-Skills Toolkit (Thread C spine)](life-skills-toolkit.md) · [Core principle](swipeed-core-principle.md) · [Path world (3D)](swipeed-world.md) · [Engine](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/engine.md) · [Repo topology](https://github.com/priyanshuj0410-code/owhile-engine/blob/c182048bd6c9f4f3c2ef73c6d08dfac8d5c8c1e2/knowledge/architecture/repo-topology.md)
