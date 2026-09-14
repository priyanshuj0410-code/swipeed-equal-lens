---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/my-body-my-rules.md
title: My Body, My Rules
description: SwipeEd node #2 (ages 3-6) - the body-safety foundation. With Lensy, a child learns body names, that their body is theirs, safe vs unsafe touch, the Big No, and who to tell. Taught as empowerment, never fear.
resource: https://swipeed.vercel.app/game/my-body
tags: [games, swipeed, ages-3-6, body-safety, consent, safeguarding, pocso, sam]
timestamp: 2026-06-19T20:30:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
---

# My Body, My Rules

> **Reworked to GDD 02 v2 - the "mechanic-embodying" standard** (the pilot for the shared v2 engine; see
> [pattern #26](swipeed-game-patterns.md) and the build bible). The game is a **486-scenario typed library**
> (`content/games/my-body.ts`: my-body-mine 86 · real-names 76 · safe-unsafe 81 · consent-stop 81 ·
> secret-surprise 83 · tell-trusted 79) on the **shared v2 engine** (`components/games/v2-engine.tsx`) - a
> thin wrapper feeds the library + a `V2GameConfig`. Every scenario is one of **seven typed play actions**
> (reflect · role-play · strike-rewrite · branch · sort · match · build), **0% binary tap**, run as the
> Hook→Play→resolve→Sticker micro-loop (rotated, no mechanic twice running). PANTS / AAP real names /
> safe-unsafe (never good/bad) / secrets-vs-surprises / trusted-adults; empower never frighten; the
> **"never your fault" reassurance + Childline 1098 is content-driven** (fires on any branch with an
> escape-and-tell `outcome:"safe"`, so grooming beats in *any* category get it); no-fail, audio-first,
> Calm Mode + OS reduced-motion, gender-neutral (POCSO). `gameId "my-body"` kept (renaming would orphan
> completion). (An earlier rework took it to GDD 02 *v1* - six bespoke verb-moves + a PANTS song on an
> 86-scenario flat library; v2 re-encoded the same content to the shared typed engine.) The sections below
> describe the original five-mode build.

**Node #2 of the SwipeEd path** (ages 3-6, Thread A · Body & Growing Up) and **the most
safeguarding-critical early game**. Played right after [Feelings Friends](feelings-friends.md) - because
naming and voicing feelings is what makes body-safety *telling* possible. Guided by **Lensy** (continuing
from node #1), a child learns the names of their body, that **their body belongs to them**, the
difference between **safe / unsafe / not-sure touch**, how to say a big **"No"**, and exactly **who to
tell**. Built on the **PANTS / good-touch-bad-touch** model (POCSO / NCERT). Taught as **empowerment,
never fear**; audio-first, no-fail, co-played with a parent or Anganwadi/pre-school teacher.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path - launches in place (engine id `my-body`, route `/game/my-body`).
- **Type:** warm, audio-first body-safety game · **Tap / sort** engine (no swipe, no fail, no timer).
- **Age band:** 3-6 (pre-literate) · co-play essential. **Curriculum:** UNESCO 4.2 (consent, privacy, bodily integrity) + 6.1 (body names), 7.2 (privacy), 5.5 (finding help), 4.3 (basic online); India: POCSO + NCERT good-touch-bad-touch.
- **Status:** live · https://swipeed.vercel.app/game/my-body

## How it works - five warm modes (all no-fail)
1. **My Body** - tap a friendly, non-clinical cartoon body; Lensy names parts, matter-of-factly, plus the **underwear rule** ("the parts under your underwear/swimsuit are private - they're yours").
2. **My Rules** - the core rule, celebrated: **"my body, my rules."** The private (underwear) zone glows.
3. **Safe or Not** - sort gentle, **non-graphic** cartoon situations into **safe / unsafe / not-sure**; the constant lesson for unsafe-or-not-sure is **say no, move away, tell a trusted grown-up - and it is never your fault.**
4. **The Big No** - carried over from Feelings Friends, pointed at touch: No! · Stop! · I don't like that! · Move away.
5. **Safety Net** - build 3-5 **trusted grown-ups** (pick-an-avatar, no photos; **additive - repeats allowed**, so a child with **two mums / two dads** can add both); learn good vs upsetting secrets, **keep telling until someone helps**, and meet **Childline 1098** / the POCSO e-Box.

**Lensy** is the shared in-UI companion (`src/components/games/sam.tsx`, reused by Feelings Friends).
Completing the Safety Net (3+ trusted adults) is the "My Body Boss" finish that marks the node done.

## Inherited & established patterns
Inherits the [reusable patterns](swipeed-game-patterns.md) (no-fail, content-as-data, play-in-place +
shared juice, colour-never-only, audio-first, India framing). It **established pattern #16 - sensitive
topics: empower, never frighten** (warm tone, child shown capable, *never your fault* unconditional,
co-play expected, calm non-graphic cartoons, persistent Get Help + helpline, "keep telling"). The
underwear rule is the gentle default; **correct anatomical names are introduced with caregiver framing
only when School-Comfort is OFF** (never listed clinically in the UI). This is the seed of the whole
**Safety & Consent** thread that deepens to Safety Squad → Boundary Bot → [Green Light / Red Light](green-light-red-light.md) → Mutual.

## Safeguarding (read first - see GDD §18)
Empowering never frightening; "it's never your fault" repeated and unconditional; co-play expected; a
persistent grown-up **Get Help** route (Childline 1098 / POCSO e-Box / a trusted adult) is always
available; **keep telling** counters the silence abusers rely on. The game may surface disclosures -
the caregiver guide carries the POCSO disclosure protocol (stay calm, believe, don't promise secrecy,
mandatory reporting). All content is non-graphic cartoon + plain words.

## Status & roadmap
- **Built:** all five modes (Safe-or-Not included), the Safety Net + Childline, underwear rule, Lensy &
  the Big No reused; School-Comfort gates correct-names framing; English (audio narration).
- **Deferred (GDD Phase 2/3):** the "My Body, My Rules" **song**, the on-device disclosure **caregiver
  guide** UI, group/Anganwadi mode, a fuller touch-scene bank, a basic online-safety beat, and **Hindi**
  (with the app-wide l10n pass).

## Related
- [SwipeEd (app)](swipeed.md) · [Feelings Friends (node #1)](feelings-friends.md) · [Reusable game patterns](swipeed-game-patterns.md) · [Green Light / Red Light](green-light-red-light.md) · [Games catalog](index.md)
