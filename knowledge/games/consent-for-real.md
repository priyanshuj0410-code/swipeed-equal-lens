---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/consent-for-real.md
title: Consent, For Real
description: Adult consent in practice for ages 18-22 - an active, ongoing, sober-enough yes in real life (parties, dating, relationships, alcohol). Read real situations, learn how incapacitation removes consent, bust the myths that excuse harm (UN & RE), support a survivor, and find help. Non-explicit; even-handed; survivor-centred; no-fail.
resource: https://swipeed.vercel.app/game/consent-real
tags: [games, swipeed, consent, safeguarding, ages-18-22, adult-journey]
timestamp: 2026-06-22T12:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
---

# Consent, For Real

> **Reworked to GDD 44 v2 - the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> **The first Chapter-6 (adult, 18-22) node moved off the [ModesEngine](swipeed-game-patterns.md) onto the
> shared v2 mechanic engine** - the adult journey now follows the same standard as the child journey. It is a
> **524-scenario typed library** (`content/games/consent-real.ts`: real-situations 86 · drinks-and-capacity 85 ·
> spot-the-pressure 89 · after-harm-support 83 · consent-culture 89 · tools-and-help 92) - seven play actions
> (branch ×109 · strike-rewrite ×86 · sort ×66 · reflect ×78 · role-play ×67 · spot ×54 · match ×64), **0% binary**,
> led by branch (your move) + strike-rewrite (bust the myth) + role-play (say the line). **Consent in the messier
> realities of adult life:** an enthusiastic, ongoing, freely-given, revocable, **sober-enough** yes between
> equals - parties and alcohol, hook-ups, apps, hostel rooms. **Survivor-centred throughout:** believe, never
> blame, ask what they need, respect their choices about reporting, signpost help - **responsibility lies only
> with the person who ignored consent**. Even-handed across genders (anyone can be harmed or harm; **male and
> LGBTQ+ survivors are especially silenced**); trauma-aware and **strictly non-graphic**. India: hostel/PG/campus
> reality, parties families don't know about, acquaintance assault and stigma; helplines **181, 1091, 112**, the
> campus **Internal Committee (POSH/UGC)** (`reassureCats` [drinks-and-capacity · spot-the-pressure ·
> after-harm-support] + `reassure` + helpLine). **gameId trap:** library/GDD say `consent-for-real`; the
> engine-host registry id is **`consent-real`** - config uses `consent-real`. Engine: no new mechanic; `binStyle`
> added `enthusiastic`/`looking out`/`survivor-centred`/`real route`/`capacity present`→green (collision-checked;
> also correctly greens [Green Light / Red Light](green-light-red-light.md), [Outbreak](outbreak.md) &
> [Justice League](justice-league-rights.md) good bins). Spot ids injected (6). Builds on [Mutual](mutual.md)
> (g31); opens the adult journey before g45/g46/g47. The sections below describe the original ModesEngine v1
> build, superseded by v2.

**Node #g44 - the Chapter 6 opener (College, ages 18-22).** *Consent is an active, ongoing, sober-enough
yes - nothing less.* The **adult step of the consent spine**: the bodily autonomy of
[My Body, My Rules](my-body-my-rules.md) (#2) → the boundaries of [Boundary Bot](boundary-bot.md) (#15) →
the flag-reading of [Green Light / Red Light](green-light-red-light.md) (#24) → the intimate consent of
[Mutual](mutual.md) (#31), now in real adult life - parties, dating, relationships and alcohol. Lensy returns
as a level-headed adult peer. **Non-explicit; even-handed; survivor-centred; the strongest safeguarding
routing in the adult thread.**

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `consent-real`, route `/game/consent-real`.
- **Type:** reading-rich **scenario game** (hand-built reference for the [ModesEngine](swipeed-game-patterns.md)) · no-fail · consent never rushed; Q&A private.
- **Age band:** 18-22 · **Curriculum:** UNESCO 4.2 (consent), 4.1 (violence), 5.5 (help). Builds on #g31.
- **Status:** live · https://swipeed.vercel.app/game/consent-real

## How it works - five modes + the Badge Book
1. **Real Situations** - read the moment (a party, a date, a flirty message thread) and choose the consent-first move; mixed signals / coming over / earlier texts are never a yes.
2. **Drinks & Capacity** - the adult-specific lesson: someone drunk, high or incapacitated cannot consent; "they didn't resist" isn't consent; look out for friends.
3. **Spot the Pressure** - the **UN → RE** beat busting the myths that excuse harm ("they didn't say no", "we're together so it's assumed", "they came back to mine", "they were drunk/dressed").
4. **After Harm - Support** - survivor-centred response to a disclosure: **believe · don't blame · follow their lead · signpost help.**
5. **Tools & Ask-It** - private Q&A with **urgent help-routing** (Women Helpline 181 / 1091, Emergency 112, campus Internal Committee / counsellor).

## Patterns it inherits
No hard fail (#4); **safeguarding never scored**, calm support + a persistent **Get Help** route (#5, #16);
the **UN → RE** beat used with restraint (#9); survivor-first, "it's never your fault", non-graphic (#16);
**Ask-It** with distress routing (#18). India-aware: campus/hostel reality, acquaintance assault, stigma.

## Related
- [Reusable Game Patterns](swipeed-game-patterns.md) · [Mutual](mutual.md) (#31) · [Games catalog](index.md) · [SwipeEd](swipeed.md)
