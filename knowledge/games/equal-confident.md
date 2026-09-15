---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/equal-confident.md
title: Equal & Confident
description: Gender equality at college/work for ages 18-22. Claim your voice, everyday leadership, spotting & calling in adult bias (interruptions, "bossy", office housework; UN & RE), and active allyship across genders. Even-handed.
resource: https://swipeed.vercel.app/game/equal-confident
tags: [games, swipeed, gender, allyship, ages-18-22, adult-journey]
timestamp: 2026-06-22T13:15:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Equal & Confident

> **Reworked to GDD 50 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> The voice/leadership/allyship node (Thread E · Gender & Respect, Leadership & Confidence domain) **moved off the
> [ModesEngine](swipeed-game-patterns.md) onto the shared v2 mechanic engine**: a **462-scenario typed
> library** (`content/games/equal-confident.ts`: claim-your-voice 84 · lead-the-room 80 · spot-counter-bias 82 ·
> be-the-ally 60 · equality-lifts-everyone 78 · tools-and-help 78) with seven play actions (branch ×85 ·
> strike-rewrite ×71 · sort ×65 · reflect ×71 · role-play ×62 · spot ×58 · match ×50), **0% binary**, led by branch
> + strike-rewrite + role-play. Takes the teen-years gender-equality & allyship work **into adult arenas where it
> bites:** the seminar room, the internship, the first job, public life. Five modes: claim your voice (don't be
> talked over), lead the room (**leadership without a title**), spot & counter bias (interruptions, the **'bossy'
> double-bind**, office housework; UN&RE), be the ally (active allyship across genders), tools & help. Builds
> women's confidence and leadership while engaging men as allies; **equality lifts everyone (not zero-sum)**.
> Evenhanded, **never anti-boy**; confidence framed inclusively. Harassment routes to rights/redress (**POSH**,
> covered in [Know Your Rights](know-your-rights.md) g51) and help (**181, POSH Internal Committees**)
> (`reassureCats` [claim-your-voice · spot-counter-bias · be-the-ally] + `reassure` + helpLine). India: women
> sharply under-represented in workforce and leadership; campus and workplace bias and harassment are real.
> `gameId "equal-confident"` (matches registry). Engine: no new mechanic; `binStyle` added `shrinks it`/`just
> optics`/`fades you out`/`drains it`→red (all g50-only, clearly bad-side); "Fair" (ec-027, bad-first bin order)
> correctly green. Spot ids injected (5). Builds on [Lead the Way](lead-the-way.md) (g33) & [Equalize](equalize.md)
> (g26); pairs g51; feeds Chapters 7-8 (Equal Partners g55, Equal Parents g62). The sections below describe the
> original ModesEngine v1 build, superseded by v2.

**Node #g50: Chapter 6 (College, ages 18-22).** Equality at college and work is built one moment at a
time. Builds on [Lead the Way](lead-the-way.md) (#g33) and [Stand Up](stand-up.md) (#g27). Even-handed;
allyship across genders. On the [ModesEngine](swipeed-game-patterns.md).

## How it works: five modes
1. **Claim Your Voice**: say the idea; "I'd like to finish my point" (tap-reveal list).
2. **Lead the Room**: everyday leadership: initiative, lifting & amplifying others (scenes).
3. **Spot & Counter Bias**: the **UN → RE** beat on interruptions, "bossy" and office housework.
4. **Be the Ally**: calling in everyday sexism, kindly and clearly (scenes).
5. **Tools & Ask-It**: confidence/call-in toolkit + private Q&A with **POSH/help routing**.

## Related
- [Reusable Game Patterns](swipeed-game-patterns.md) · [Lead the Way](lead-the-way.md) · [Stand Up](stand-up.md) · [Games catalog](index.md)
