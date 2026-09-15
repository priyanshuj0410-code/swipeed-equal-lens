---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/stand-up.md
title: Stand Up
description: A five-mode bystander game for ages 12-15, from bystander to upstander, safely. Read the room, learn the 5 Ds (UN & RE), judge risk safety-first, support the target, and be an upstander. Safety comes first; centres the target; helplines built in. No-fail.
resource: https://swipeed.vercel.app/game/stand-up
tags: [games, swipeed, gender-equality, ages-12-15, bystander, gbv]
timestamp: 2026-06-20T23:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Stand Up

> **Reworked to GDD 27 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The teen bystander-to-upstander node (Thread B · Safety, ages 12-15), the gender
> thread's **call to action** on GBV & harassment, is now a **538-scenario typed library**
> (`content/games/stand-up.ts`: gbv-and-rights 90 · spot-harassment 99 · safety-first 91 · five-ds 87 ·
> after-support 85 · be-the-upstander 86), generated **faithfully** from the scorecard-passed GDD 27 JSON, on
> the **shared v2 engine** (`components/games/v2-engine.tsx`). The old 5-mode build is replaced by **seven typed
> play actions** (branch ×121 · reflect ×70 · strike-rewrite ×78 · role-play ×75 · sort ×59 · spot ×87 · match
> ×48), **0% binary tap**, led by the **five-moves chooser** (branch: **the same 5 Ds engine as
> [Speak Up](speak-up.md) g19**: Direct · Distract · Delegate · Delay · Document), role-play and spot. Arc: GBV &
> your rights → spot the harassment → safety first → the 5 Ds → after & support → be the upstander.
> **Safety-first, non-graphic:** never confront danger alone ("can I help safely?"; distract/delegate/de-escalate,
> don't chase); the **target is never to blame** (freezing is normal; "it wasn't your fault"; "I believe you");
> survivor-centred support; real routes: a trusted adult, **Women Helpline 181, ERSS 112, Childline 1098**
> (`reassureCats` [gbv-and-rights · spot-harassment · safety-first · after-support] + `reassure` + helpLine).
> `gameId "stand-up"` (matches the registry id). Engine: **no new mechanic** (reuses 7 of 10); `binStyle` gained
> `harassment`→red + `escalates`→red so the harassment / safe-vs-risky / safety-first bins read correctly. Spot
> scene-item ids injected (10). Builds on [Speak Up](speak-up.md) (g19); prereq g26. The sections below describe
> the original v1 build, superseded by the v2 mechanic engine.

**Node #27: the bystander step (ages 12-15)**, *from bystander to upstander, safely*. When someone's
being harassed, you don't have to be a hero or do nothing. There are **five safe ways to help, and your
safety comes first.** It builds on [Speak Up](speak-up.md) (#19) and the equality work of MythBuster (#25)
/ [Equalize](equalize.md) (#26). **Rebuilt to its GDD** from a pre-pattern stub into the established
5-mode + UN&RE shape.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `stand-up`, route `/game/stand-up`.
- **Type:** reading-light **scenario game** · no fail · nothing rewards unsafe action; Q&A private.
- **Age band:** 12-15 · **Curriculum:** UNESCO 4.2 (violence & keeping safe), 3.2 (gender-based harassment). Builds on #19/#25/#26.
- **Status:** live (rebuilt to the GDD) · https://swipeed.vercel.app/game/stand-up

## How it works: five modes + the Badge Book
1. **Read the Room**: spot harassment and the moment to act: real harm vs banter (the bus, friends, a
   group chat): who's targeted and how they feel is the signal.
2. **The 5 Ds**: **Direct · Distract · Delegate · Delay · Document**, a safe option for every situation;
   collect each, then the **UN & RE** bystander beat (*"you don't have to be a hero or freeze"* → *"pick a
   safe D: even a small, safe act changes everything"*).
3. **Safety First**: judging risk: when Direct isn't safe, Distract/Delegate; call **112 / 181 / a guard**.
4. **Support the Target**: after the moment: check in, believe, ask what they need, offer to report together.
5. **Be an Upstander + Ask Anything**: a pledge-style Q&A; serious matters route to **Women Helpline 181,
   1091, Emergency 112, Childline 1098**.

A 5-badge **Badge Book** finishes into the shared [`GameDone`](swipeed.md) card. Reuses **Lensy** + the shared
**`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), the UN & RE move ([core principle](swipeed-core-principle.md)),
**empower-never-frighten (#16)** (safety-first; never confront when unsafe; centres the target), and the
**Ask-It / safe-helper box (#18)** (181/1091/112/1098).

## Status & roadmap
- **Built:** Read the Room, The 5 Ds (collect + UN & RE), Safety First, Support the Target, Be an Upstander
  (with the helpline routing); the Badge Book; English narration.
- **Deferred (GDD Phase 2/3):** a fuller scenario bank, crown levels (subtler/riskier calls), Classroom-Mode
  rehearsal, calm mode, and **Hindi**.
