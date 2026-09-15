---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/own-your-health.md
title: Own Your Health
description: Adult SRH ownership for ages 18-22, covering dual protection, routine confidential testing, sexual wellbeing & pleasure (within consent & respect), and the partner health-talk. Non-explicit, behaviour-level, shame-busting (UN & RE); fully open Ask-It with services.
resource: https://swipeed.vercel.app/game/own-your-health
tags: [games, swipeed, srh, health, ages-18-22, adult-journey]
timestamp: 2026-06-22T12:15:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Own Your Health

> **Reworked to GDD 47 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> The College SRH-ownership node (Thread F · Sexual & Reproductive Health) **moved off the [ModesEngine](swipeed-game-patterns.md)
> onto the shared v2 mechanic engine**: a **487-scenario typed library** (`content/games/own-your-health.ts`:
> protection-sorted 83 · know-your-status 79 · pleasure-and-wellbeing 82 · the-health-talk 85 ·
> access-and-confidential 78 · tools-and-help 80) with seven play actions (branch ×100 · strike-rewrite ×82 ·
> sort ×62 · reflect ×72 · spot ×52 · role-play ×62 · match ×57), **0% binary**, led by branch + strike-rewrite +
> sort. **SRH becomes fully the young adult's own:** protection sorted (contraception & **dual protection**),
> know your status (routine testing as self-care, **U=U**, confidential), **pleasure & wellbeing** (a normal part
> of health, within consent & respect), the health talk (partner communication), confidential access.
> **Comprehensive and frank, never explicit-as-instruction, medically accurate and shame-free.** Confidentiality
> is foregrounded because fear of judgement keeps young adults from care. Even-handed across genders and
> orientations. India: **NACO free confidential ICTC testing, RKSK clinics**, doctors and pharmacies; sensitive
> for unmarried youth, handled frankly but respectfully (`reassureCats` [know-your-status · pleasure-and-wellbeing
> · access-and-confidential] + `reassure` + helpLine). `gameId "own-your-health"` (matches registry). Engine: no
> new mechanic; `binStyle` unchanged (all 13 bins emulated clean: good sides green, bad sides red/neutral). Spot
> ids injected (7). Builds on [Status: Know It](status-know-it.md) (g30), [My Choices, My Future](my-choices-my-future.md)
> (g29) & [Plan It](plan-it.md) (g22); pairs [Consent, For Real](consent-for-real.md) (g44); feeds Chapter 7. The
> sections below describe the original ModesEngine v1 build, superseded by v2.

**Node #g47: Chapter 6 (College, ages 18-22).** Your sexual health is yours to own: protection sorted,
testing routine, no shame, honest talk. The adult ownership step after [Status: Know It](status-know-it.md)
(#g30) and [My Choices, My Future](my-choices-my-future.md) (#g29). **Non-explicit and behaviour-level**;
the shame, not the body, is the boss myth.

## Overview
- **App:** [SwipeEd](swipeed.md) path · engine id `own-your-health`, route `/game/own-your-health` · on the [ModesEngine](swipeed-game-patterns.md).
- **Type:** mode-based scenario game · no-fail · UNESCO 8.1, 8.2, 8.3, 7.2 · 18-22.
- **Status:** live · https://swipeed.vercel.app/game/own-your-health

## How it works: five modes
1. **Protection, Sorted**: contraception & dual protection: choose, use and access confidently (tap-reveal list).
2. **Know Your Status**: routine testing as self-care; confidential; treatment works.
3. **Bust the Shame**: the **UN → RE** beat on the shame myths (testing = "did something wrong", "contraception is the woman's job", pleasure as unspeakable, "clinics will judge / tell my family").
4. **The Health Talk**: talking to a partner about testing, protection & needs without awkwardness; "no protection, no go".
5. **Tools & Ask-It**: service-finder + **fully open** private Q&A (National AIDS Helpline 1097, local health centre).

## Related
- [Reusable Game Patterns](swipeed-game-patterns.md) · [Status: Know It](status-know-it.md) · [Consent, For Real](consent-for-real.md) · [Games catalog](index.md)
