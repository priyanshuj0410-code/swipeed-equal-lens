---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/status-know-it.md
title: "Status: Know It"
description: A sexual-health-ownership app for ages 15-18. Knowing your status is power, not shame. Testing as self-care (UN & RE), a personal prevention stack, partner communication, treat-and-thrive (U=U), and dignity for all. Empowering, non-judgmental, non-explicit; some specifics School-Comfort-gated. No-fail.
resource: https://swipeed.vercel.app/game/status-know-it
tags: [games, swipeed, srh, sti, hiv, testing, ages-15-18]
timestamp: 2026-06-20T21:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Status: Know It

> **Reworked to GDD 30 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> The STI/HIV testing-&-treatment node (Thread F · SRH, ages 15-18) is now a **506-scenario typed library**
> (`content/games/status-know-it.ts`: know-your-status 84 · prevention-stack 79 · talk-about-it 88 ·
> treat-and-thrive 83 · dignity-no-stigma 84 · own-it-decide 88) on the **shared v2 engine**, with seven play
> actions (strike-rewrite ×92 · branch ×91 · reflect ×86 · sort ×71 · match ×57 · role-play ×61 · spot ×48),
> **0% binary**, led by strike-rewrite + branch + sort. **Testing is power, not shame**; build a prevention
> stack; talk to a partner; **treatment works** (HIV manageable, **U=U**; STIs treatable/curable); **dignity,
> zero stigma** (solidarity not pity; status is private; never a moral verdict). Comprehensive but never
> explicit; delaying respected. India: **NACO ICTC** free confidential testing, RKSK, PrEP; POCSO-aware; routes
> coercion/distress to a doctor / trusted adult / Childline 1098 (`reassureCats` [know-your-status ·
> dignity-no-stigma · own-it-decide] + `reassure` + helpLine). `gameId "status-know-it"` (matches registry).
> Engine: no new mechanic; `binStyle` added `dignity`→green + `^stigma`→red (anchored so "reduces stigma" stays
> green). Spot ids injected (4). Builds on [Outbreak](outbreak.md) (g23); pairs [My Choices, My Future](my-choices-my-future.md)
> (g29); links [Mutual](mutual.md) (g31). The sections below describe the original v1 build, superseded by v2.

**Node #30: the SRH ownership step of Chapter 5** (ages 15-18). *Knowing your status is power, not shame.
Testing is self-care, prevention is yours to own, treatment works, and everyone deserves dignity.* It is
the **personal, adult completion of [Outbreak](outbreak.md)** (#23): the population strategy becomes your
own routine, the Defense Kit becomes your **prevention stack**, and the anti-stigma core becomes
**self-respect and respect for others**. It pairs with [My Choices, My Future](my-choices-my-future.md)
(#29) and depends on [Mutual](mutual.md) (#31) for the consent inside the partner conversations. Empowering,
non-judgmental, non-explicit; some specifics gated by School-Comfort. Lensy returns as a young-adult peer.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `status-know-it`, route `/game/status-know-it`.
- **Type:** reading-rich **health-ownership app** · no fail · routine & Q&A private; School-Comfort gates some stack items.
- **Age band:** 15-18 · **Curriculum:** UNESCO 8.2 & 8.3 (STI/HIV, testing, treatment, stigma). Builds on #23; links to #29, #31.
- **Status:** live · https://swipeed.vercel.app/game/status-know-it

## How it works: five modes + the Badge Book
1. **Know Your Status**: testing as **routine, smart, empowering self-care** (what tests, when, where,
   confidentially: a NACO ICTC centre, an RKSK clinic, a doctor); then the **UN & RE** shame-bust:
   *"testing means you did something wrong"* → *"it's power: you can protect yourself and the people you
   care about."*
2. **The Prevention Stack**: your comprehensive toolkit to **choose and combine** (delaying, the HPV
   vaccine, regular testing, honest disclosure; **condoms and PrEP** added when School-Comfort is off).
3. **Talk About It**: partner communication about status/testing/protection: bring it up calmly and
   caringly; a partner who refuses to talk *tells you something*: your health and boundaries come first.
4. **Treat & Thrive**: fear removed: treatment works; HIV is manageable; **U=U**; most STIs are treated or
   cured; a diagnosis is not the end.
5. **Dignity & Ask Anything**: anti-stigma and self-respect; a fully open private Q&A; testing/help routes
   to a NACO ICTC centre, an RKSK clinic, or **Childline 1098**.

A 5-badge **Badge Book** finishes into the shared [`GameDone`](swipeed.md) card. Reuses the shared
**`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), the UN & RE move ([core principle](swipeed-core-principle.md)),
**empower-never-frighten (#16)** (testing as power; U=U; dignity), **don't-villainise (#15)** (no judging
a person for their status), the **Ask-It / safe-helper box (#18)** fully open, and **Made-for-India +
School-Comfort (#14)** (NACO ICTC; condoms/PrEP gated; non-explicit).

## Status & roadmap
- **Built:** Know Your Status (facts + UN & RE), The Prevention Stack (School-Comfort-gated condoms/PrEP),
  Talk About It (partner-talk scenes), Treat & Thrive (U=U), Dignity & Ask Anything (with the ICTC/RKSK/
  Childline route); the Badge Book; English narration.
- **Deferred (GDD Phase 2/3):** a build-your-own-routine tracker, a fuller scenario bank, crown levels,
  Classroom-Mode polish, calm mode, and **Hindi**.
