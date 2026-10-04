---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/not-fair-not-funny.md
title: Not Fair, Not Funny
description: A five-mode choose-the-action game for ages 6-9. Spot gender-based teasing, learn "if it hurts, it's not a joke" (UN & RE), and be a SAFE ally (speak up kindly, include, tell), earning an Ally Badge Book and a Comeback Kit.
resource: https://swipeed.vercel.app/game/not-funny
tags: [games, swipeed, gender-equality, ages-6-9, choose-engine, gbv]
timestamp: 2026-06-20T12:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Not Fair, Not Funny

> **Reworked to GDD 11 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The gender-teasing & ally game is a **463-scenario typed library**
> (`content/games/not-funny.json`: fun-vs-mean 41 · just-a-joke 83 · gender-teasing 82 · how-it-feels 93 ·
> be-an-ally 82 · my-own-jokes 82), generated **faithfully** from the scorecard-passed GDD JSON, on the
> **shared v2 engine** (`components/games/v2-engine.tsx`). Every scenario is one of **eight typed play actions**
> (branch ×105 · reflect ×105 · strike-rewrite ×72 · role-play ×52 · sort ×45 · build ×42 · spot ×3 · match ×42),
> **0% binary tap**, led by teasing-moment **dilemmas** (branch: decide the kind/ally move, see the ripple,
> get a debrief), say-the-**comeback** / ally lines (role-play), and the **ally-toolkit builder** (build).
> Teaches: fun vs mean teasing, why **"just a joke" doesn't erase harm** (**impact over intent**), recognising
> & refusing gender put-downs ("like a girl", "boys don't cry", "so girly"), the concrete **upstander moves**
> (speak up · distract · support · tell · check in), and checking your own jokes. Ethics: **impact over intent**
> (how a joke lands, not whether it was "meant"); **don't villainise the joker** (the Reyansh-type checks &
> repairs, never branded "bad"); **protect the target** (the teased child is never at fault: config `reassure`
> + `reassureCats` ["how-it-feels"] → "not your fault, telling is brave" banner); **safe escalation** (telling a
> trusted adult is **reporting, not tattling**: `helpLine` Childline 1098). Engine: **no new mechanic** (reuses
> 8 of 9); a `binStyle` valence accretion (mean-teasing/put-down/not-an-ally → red, fun-teasing/ally-move →
> green). **`gameId "not-funny"`** kept: the GDD/library's `not-fair-not-funny` is **design-doc only**; the
> config must use the engine-host registry id. Wrapper kept as `NotFunnyGame`. The sections below describe the
> original v1 build (five-mode choose-the-action), superseded by the v2 mechanic engine.

**Node #11: the gentlest first step of the GBV / ally thread** (ages 6-9). Where Fair Play World made
chores and chances fair, this asks the next question: *when someone is teased for being a girl or a boy,
what do you do?* The child watches short playground scenes, learns that **"if it hurts the person it's
about, it's not a joke: it's not fair"** (busted with **UN & RE**), and practises being a **SAFE ally**:
speak up kindly, include, and tell a trusted adult if it keeps happening (**never escalate**).
Reading-light, no-fail, and deliberately **even-handed**: boys are teased too ("you cry like a girl",
teased for dancing), so no gender is cast as villain or victim.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `not-funny`, route `/game/not-funny`.
- **Type:** reading-light **choose-the-action / ally** game · no fail.
- **Age band:** 6-9 · **Curriculum:** UNESCO ITGSE 3.3 (gender-based teasing → being an ally), 1.3 (respect). Builds on Fair Play World (#10); seeds the GBV/bystander thread (Safety Squad #8 → Speak Up → Stand Up).
- **Status:** live (rebuilt to the GDD) · https://swipeed.vercel.app/game/not-funny

## How it works: five modes + the Ally Badge Book
1. **Not Fair, Not Funny**: branching teasing scenes (won't let a girl play cricket; a boy teased for
   crying; a boy teased for dancing). The **ally** choice brightens and advances; laughing along / ignoring
   gives a gentle, non-shaming **nudge** and a retry, never a fail.
2. **Just a Joke?** bust the "it's just a joke, can't you take a joke?" deflection (and "boys will be
   boys") with the shared **UN & RE** beat: UN erases *"teasing is just a joke"* (never blaming the family),
   RE redraws *"a joke is funny for everyone; if it hurts the person it's about, it's not funny."*
3. **Be an Ally**: the **safe three-step** (speak up kindly · include the person · tell a trusted adult
   if it keeps happening) + a **Comeback Kit** of six kind, brave phrases to collect ("That's not fair",
   "Not funny", "Anyone can", "Come play with us"…). Never coaches confrontation or retaliation.
4. **How Would You Feel?** the scene from the teased child's side (the empathy engine).
5. **Stand Tall**: protective, non-blaming lines if *you* are the one teased ("being teased is never your
   fault", "you can walk away", "keep telling until someone helps, Childline 1098").

A 5-badge **Ally Badge Book** tracks the modes; filling it finishes into the shared
[`GameDone`](swipeed.md) card. Reuses **Lensy** + the shared **`UnReBeat`** + the voice model (speak/replay).

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), the UN & RE move ([core principle](swipeed-core-principle.md)), **India framing
(#14)** (playground-realistic; Childline 1098), and **#16 empower-never-frighten**: the safe ally action
never asks a child to confront an aggressor, only to be kind, include, and tell.

## Status & roadmap
- **Built:** all five modes, the Ally Badge Book, the Comeback Kit, the UN & RE joke-busting, the
  Childline help route; English narration; even-handed scenes (boys and girls both teased).
- **Deferred (GDD Phase 2/3):** a fuller scene bank, illustrated characters, Classroom-Mode discussion
  prompts, the daily streak, and **Hindi**.
