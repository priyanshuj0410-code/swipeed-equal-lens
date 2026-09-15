---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/mythbuster-gender.md
title: "MythBuster: Gender"
description: A five-mode myth-busting lab for ages 12-15. Put a gender claim in the lab, check the evidence, and bust the myth (not the believer). The Myth Lab (UN & RE), the Busted gallery, the "It's Just Biology" Files, the Double-Standard Detector, and the Myth-Buster's Toolkit. Evidence-based, even-handed, no-fail.
resource: https://swipeed.vercel.app/game/mythbuster-lab
tags: [games, swipeed, gender-equality, ages-12-15, myth-bust]
timestamp: 2026-06-21T00:30:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# MythBuster: Gender

> **Reworked to GDD 25 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible), a **flagship of the strike-and-rewrite signature**. The gender-myth-busting node
> (Thread E) is now a **524-scenario typed library** (`content/games/mythbuster-lab.ts`: ability-myths 90 ·
> role-myths 91 · emotion-leadership 83 · its-just-science 86 · equality-myths 82 · spot-and-flip 92),
> generated **faithfully** from the scorecard-passed GDD 25 JSON, on the **shared v2 engine**
> (`components/games/v2-engine.tsx`). The old 5-mode build is replaced by **seven typed play actions**
> (strike-rewrite ×144 · sort ×73 · reflect ×62 · branch ×60 · match ×52 · role-play ×59 · spot ×74), **0% binary
> tap**, led by **strike-rewrite** (bust the myth), **sort** (fact vs myth) and **spot** (catch the myth). Arc:
> ability isn't gendered → roles aren't gendered → emotion & leadership → **"it's just science"** → what
> equality really means → spot it & flip it. **Evidence-based and EVENHANDED, never anti-boy:** equality lifts
> everyone (boys included: less pressure to provide alone, freedom to feel); boys' real struggles are validated
> *and* equality championed. Strong **pseudo-science inoculation** (the naturalistic fallacy, averages-aren't-
> individuals, cherry-picking, "facts over feelings" shutdowns). India-grounded (women leaders + the reservation
> law). **gameId trap:** library/GDD aspirational id is `mythbuster-gender` but the engine-host registry id is
> `mythbuster-lab`: config uses `mythbuster-lab`. Engine: **no new mechanic** (reuses 7 of 10); a notable
> `binStyle` fix: **removed `doesn` from the negative set** because it was red-tinting g25's *truth* bin
> "Doesn't" (gender doesn't shape ability); the 8 other-game "Doesn't…" bins degrade gracefully (good side stays
> green, bad side → neutral). Added `pseudo`→red + `honest`→green. Spot scene-item ids injected. Builds on
> [Norm Storm](norm-storm.md) (g18); prereq g24. The sections below describe the original v1 build, superseded by
> the v2 mechanic engine.

**Node #25: the evidence step of the Gender & Respect thread (ages 12-15)**. *"Boys are better at
maths"? "Girls can't lead"? "Boys don't cry"? Put the claim in the lab, check the evidence, and watch the
myth get busted.* It builds on [Flip the Script](flip-the-script.md) (#17) and [Norm Storm](norm-storm.md)
(#18) and sets up [Equalize](equalize.md) (#26) / Stand Up (#27). **Converted to a 5-mode DOM game**
(`/game/mythbuster-lab`) to match GDD 25; the original **swipe deck** remains intact and reachable at
**`/play/mythbuster`**. Evidence-based and **even-handed**: genuine facts are **CONFIRMED**, and it
**busts the myth, not the believer**.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `mythbuster-lab`, route `/game/mythbuster-lab`.
- **Type:** reading-light **myth-busting lab** (test claims · check evidence) · no fail · Q&A private.
- **Age band:** 12-15 · **Curriculum:** UNESCO 3.1 (social construction of gender), 3.2 (equality, stereotypes & bias). Builds on #17/#18; sets up #26/#27.
- **Status:** live (rebuilt to the GDD; swipe deck retained) · https://swipeed.vercel.app/game/mythbuster-lab

## How it works: five modes + the Badge Book
1. **The Myth Lab**: the signature: judge a claim **Myth or Fact**, then see the evidence verdict
   (**BUSTED** or, for a genuine fact like "bodies can differ between the sexes", **CONFIRMED, but ability
   and character are not gendered**); caps with the central **UN & RE** beat.
2. **Busted! Gallery**: the big gender myths busted with evidence (ability, emotion, leadership, jobs),
   **including the ones that box in boys and men** ("boys must be tough", "caring isn't manly").
3. **The "It's Just Biology" Files**: separate **real bodily averages** from **pseudo-scientific
   stereotype**. *Individual variation beats any group average.*
4. **Double-Standard Detector**: spot the same act judged differently by gender (assertive boy = "leader"
   / assertive girl = "bossy"; "boys will be boys" vs a girl blamed).
5. **Myth-Buster's Toolkit + Ask Anything**: how to answer a gender myth in real life (ask for the
   evidence, check what it says, give a counter-example, answer with respect not a fight); Q&A.

A 5-badge **Badge Book** finishes into the shared [`GameDone`](swipeed.md) card. Reuses **Lensy** + the shared
**`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), the UN & RE move ([core principle](swipeed-core-principle.md), *central here*),
**don't-villainise (#15)** (bust the myth, **not the believer**; even-handed about boys and girls), and
**India framing (#14)** (Beti Bachao; challenging son-preference and the stereotypes teens hear constantly).

## Status & roadmap
- **Built:** The Myth Lab (Myth/Fact + UN & RE), the Busted gallery, the "It's Just Biology" Files, the
  Double-Standard Detector, the Myth-Buster's Toolkit + Ask; the Badge Book; English narration. The
  original swipe deck (One Love taxonomy) remains live at `/play/mythbuster`.
- **Deferred (GDD Phase 2/3):** a fuller claim/evidence bank, crown levels (subtler claims), Classroom-Mode
  debate, calm mode, and **Hindi**.
