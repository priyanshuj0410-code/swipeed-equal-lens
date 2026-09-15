---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/lead-the-way.md
title: Lead the Way
description: A five-mode allyship-&-leadership game for ages 15-18. Become an active ally and a quiet leader for equality. Learn what allyship really is (UN & RE), lead by example, lift as you climb, call in not out, and find your leadership style. No title or megaphone required. No-fail.
resource: https://swipeed.vercel.app/game/lead-the-way
tags: [games, swipeed, gender-equality, allyship, leadership, ages-15-18]
timestamp: 2026-06-20T23:30:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Lead the Way

> **Reworked to GDD 33 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> The structural-equality → leadership node (Thread E · Gender & Respect) is now a **531-scenario typed library**
> (`content/games/lead-the-way.ts`: the-gaps 91 · what-allyship-is 86 · lead-by-example 90 · lift-as-you-climb
> 91 · call-in-not-out 72 · your-leadership-style 101) on the **shared v2 engine**, with seven play actions (reflect
> ×126 · branch ×114 · strike-rewrite ×81 · sort ×56 · role-play ×65 · match ×44 · spot ×45), **0% binary**, led by
> branch (your move) + strike-rewrite (bust the myth) + reflect. **You don't need a title or a megaphone to
> lead:** be the ally, set the example, lift others, change the room you're in, whatever your gender. Allyship
> is everyone's job and **men leading on gender equality is strength, not betrayal** (the key India reframe).
> Understands the real gaps (**pay ~34%** in India, women's leadership gap, unpaid-care load) and turns them into
> quiet, everyday leadership: lead by example, lift as you climb, **call in over call out**, lead from your
> values. India: engaging boys/men as allies is a top lever; respect families (persuasion over confrontation);
> **Women's Reservation Act 2023**; India's own role models. Safety-first: witnessing harm routes to a trusted
> adult/teacher, **181, 112, Childline 1098** (`reassureCats` [call-in-not-out] + `reassure` + helpLine).
> `gameId "lead-the-way"` (matches registry). Engine: no new mechanic; `binStyle` added
> `victim-blam`/`widens it`/`holds them down`/`undercuts`/`hardens them`/`shaming call`/`bystander`→red +
> `lifts others`/`active allyship`/`closes a gap`/`strong example`→green (full cross-game regression clean, also
> correctly reddened [Equalize](equalize.md)'s "Widens it" and [Stand Up](stand-up.md)/[Speak Up](speak-up.md)'s
> "Bystander"). Spot ids injected (3). Builds on [Equalize](equalize.md) (g26) & [Stand Up](stand-up.md) (g27);
> sets up [Change Makers](change-makers.md) (g34). The sections below describe the original v1 build, superseded
> by v2.

**Node #33: the allyship & quiet-leadership step (ages 15-18)**. *You don't need a title or a megaphone
to lead. Be the ally, set the example, lift others, and change the room you're in.* It builds on
[Equalize](equalize.md) (#26) and Stand Up (#27) and sets up Change Makers (#34). **Rebuilt to GDD 33**:
the earlier build had drifted into a structural-dashboard sim (overlapping Equalize); the GDD is about
**personal allyship and leadership**, now reflected here in the established 5-mode + UN&RE shape.
**Allyship is everyone's job; male allyship is a strength; call-in over call-out.**

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `lead-the-way`, route `/game/lead-the-way`.
- **Type:** reading-light **allyship & leadership** game · no fail · the plan & Q&A are private.
- **Age band:** 15-18 · **Curriculum:** UNESCO 3.2 (gender equality) & 4 (taking action). Builds on #26, #27; sets up #34.
- **Status:** live (rebuilt to the GDD) · https://swipeed.vercel.app/game/lead-the-way

## How it works: five modes + the Badge Book
1. **What Allyship Really Is**: listen, amplify, show up (not performative); collect each, then the
   **UN & RE** beat (*"allyship isn't my job, especially for boys"* → *"allyship is everyone's, and male
   allyship is a strength"*).
2. **Lead by Example**: your everyday behaviour sets the norm (share work & credit, don't laugh at a
   sexist joke, back people up): one steady example shifts the room, no speech needed.
3. **Lift as You Climb**: the signature: amplify a quieter teammate's ignored idea (and credit her);
   share opportunity rather than hoard it.
4. **Call In, Not Just Out**: challenge sexism **constructively**: a private *"that didn't sit right. Can
   we not?"* assuming good faith changes minds better than public humiliation.
5. **Your Leadership Style + Ask Anything**: find your authentic style; build a one-move action plan; Q&A.

A 5-badge **Badge Book** finishes into the shared [`GameDone`](swipeed.md) card. Reuses **Lensy** + the shared
**`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), the UN & RE move ([core principle](swipeed-core-principle.md)), **don't-villainise
(#15)** (call-in over call-out; assume good faith; non-zero-sum allyship that keeps boys/men on side), and
**India framing (#14)** (HeForShe / engaging men & boys; Beti Bachao changemaking).

## Status & roadmap
- **Built:** What Allyship Really Is (collect + UN & RE), Lead by Example, Lift as You Climb (scenes), Call
  In Not Just Out (scenes), Your Leadership Style + Ask; the Badge Book; English narration.
- **Deferred (GDD Phase 2/3):** a personal-action-plan builder, a fuller scenario bank, crown levels,
  Classroom-Mode practice, calm mode, and **Hindi**.
