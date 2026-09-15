---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/friend-or-frenemy.md
title: Friend or Frenemy?
description: SwipeEd node #9 (ages 6-9), the Relationships thread's first "is this healthy?" game. Branching friend stories with Lensy: spot a true friend vs frenemy behaviour, collect the words to handle the tricky stuff. The child-level seed of Green Light / Red Light.
resource: https://swipeed.vercel.app/game/friend-frenemy
tags: [games, swipeed, ages-6-9, relationships, friendship, un-re, sam]
timestamp: 2026-06-19T23:55:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Friend or Frenemy?

> **Reworked to GDD 09 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The healthy-friendship game, the **protocol's first reference implementation**, is a
> **506-scenario typed library** (`content/games/friend-frenemy.ts`: real-friend 67 · frenemy-flags 75 ·
> dilemmas 16 · stand-up 96 · repair 11 · good-friend 82), generated **byte-identical** from the
> scorecard-passed GDD JSON, on the **shared v2 engine** (`components/games/v2-engine.tsx`). Every scenario is
> one of **eight typed play actions** (branch ×135 · role-play ×80 · strike-rewrite ×65 · reflect ×65 · sort ×61
> · spot ×5 · build ×51 · match ×49), **0% binary tap**, led by friendship **dilemmas** (branch: decide, see
> the ripple, get a debrief), **say-the-line** comebacks (role-play), and **frenemy-flag spot** scenes.
> Friendship-quality literacy: what a real friend is, the frenemy flags (mean teasing, jealousy, control,
> exclusion, hot-and-cold, online), everyday dilemmas, assertive + ally lines, repair. Ethics: **autonomy over
> verdicts** (several good moves, never one "right" tap); **safe to be wrong** (a weaker branch → kind
> consequence, never a buzzer); **name behaviours, not "bad kids"**; **bullying / not-feeling-safe routes to a
> trusted adult** (config `helpLine` = Childline 1098 + `reassure` + `reassureCats` ["frenemy-flags"] → the
> "not your fault, telling is brave" banner + Get-Help pill on frenemy-flag beats; links [Safety Squad](safety-squad.md)).
> Engine: no new mechanic (reuses 8 of 9); only a `binStyle` valence accretion (frenemy/makes-it-worse → red,
> real-friend/repair → green). `gameId "friend-frenemy"` kept (the GDD's `friend-or-frenemy` is design-doc only).
> The sections below describe the original v1 build (branching story), superseded by the v2 mechanic engine.

**Node #9: the Relationships thread's first real "is this healthy?" game** (ages 6-9). Grows the warm
*be-a-good-friend* lessons of [My Family Garden](my-family-garden.md) into the harder real stuff: a
friend who leaves you out, a group that pressures you, a falling-out that needs fixing. Through short
**branching stories**, the child chooses what to do, sees the consequence, and learns to tell a **true
friend from a frenemy**, and picks up the **words** to handle it. The **child-level seed of
[Green Light / Red Light](green-light-red-light.md)**'s green-flag/red-flag mechanic. **Behaviours, never
labels.**

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `friend-frenemy`, route `/game/friend-frenemy`.
- **Type:** reading-light **branching-story** friendship game · no fail, no timer (gentle badges).
- **Age band:** 6-9 · **Curriculum:** UNESCO 1.2 (friendship), 5.1 (peer influence), 5.3 (communication & refusal), 7.1 (closeness). Builds on My Family Garden (#3); sets up Crossroads (#16) → Green Light / Red Light (#24).
- **Status:** live · https://swipeed.vercel.app/game/friend-frenemy

## How it works: five modes + the Words Toolbox & Friendship Badge Book
1. **Friend or Frenemy?** short **branching stories** (the group won't let the new kid play; a friend dares you to be mean): choose a response → see the consequence. A *frenemy* choice shows a gentle consequence and a **retry**, never a fail. Teaches true-friend vs frenemy *behaviours*.
2. **The Words Toolbox**: collect + practise the lines: an **I-statement** ("I feel left out when…"), an assertive **"No, I don't want to"**, a repair **"I'm sorry, I was wrong"**, an inclusion **"Can I join in?"**.
3. **Pressure Moments**: peer-pressure mini-stories (go along / say no / suggest else) + **the UN & RE beat** (shared `UnReBeat`): UN erases *"you have to say yes to keep friends"*, RE redraws *"real friends respect your no: say no, or suggest something else."*
4. **Make It Right**: conflict repair: Listen → Say sorry → Find a fair fix. Conflict is normal; handling it is the skill.
5. **True-Friend Check**: reflect on what makes a good friend (and that *if a friend makes you feel bad or unsafe, you can tell a trusted adult*; links to Safety Squad).

Reuses **Lensy**, the shared **`UnReBeat`**, and the voice model. *Behaviours not labels*, never brands a
child a "frenemy" (a real friend can have an off day), and never encourages cruelty in return.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), the UN & RE move ([core principle](swipeed-core-principle.md)), India framing
(#14: boys & girls can be friends; familiar tiffin/cricket/playground settings). The branching-story
engine + Words Toolbox are intended for reuse by later relationship games.

## Status & roadmap
- **Built:** all five modes, the Words Toolbox, the Friendship Badge Book, the pressure UN & RE beat; English narration.
- **Deferred (GDD Phase 2/3):** a fuller branching-story bank, a "play a Words tool inside a story" mechanic, a friendship meter, Classroom-Mode polish, the daily streak, and **Hindi**.

## Related
- [SwipeEd (app)](swipeed.md) · [My Family Garden (#3)](my-family-garden.md) · [Green Light / Red Light (#24)](green-light-red-light.md) · [Core principle (UN & RE)](swipeed-core-principle.md) · [Games catalog](index.md)
