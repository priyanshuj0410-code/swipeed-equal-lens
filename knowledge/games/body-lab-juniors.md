---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/body-lab-juniors.md
title: Body Lab Juniors
description: "SwipeEd node #6 (ages 6-9) that opens Chapter 2. A friendly, reading-light \"body lab\" run by Lensy where a child learns how the body works and grows, a simple answer to \"where do babies grow?\", and that every body is good. UN & RE debut here."
resource: https://swipeed.vercel.app/game/body-lab
tags: [games, swipeed, ages-6-9, body, science, un-re, sam]
timestamp: 2026-06-19T22:30:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Body Lab Juniors

> **Reworked to GDD 06 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The body-science game is a **537-scenario typed library** (`content/games/body-lab.ts`:
> how-it-works 98 · same-inside 90 · different-good 84 · grow-change 85 · curiosity 92 · amazing-mine 88) on
> the **shared v2 engine** (`components/games/v2-engine.tsx`), where a thin wrapper feeds the library + a
> `V2GameConfig`. Every scenario is one of **eight typed play actions**, **0% binary tap**, led by the **new
> signature `explore-label` verb** (tap the body part that matches a clue, like "where food is broken down for
> energy" → tummy & gut, and it reveals a fun fact; a wrong tap warmly re-asks, no fail). g06 **added the
> eighth shared mechanic** (explore-label); the other seven (reflect ×89 · strike-rewrite ×93 · branch ×61 ·
> match ×56 · role-play ×55 · sort ×57 · build ×48) are unchanged shared-engine code. Themes: we're mostly the
> **same inside**; **every body & skin colour is good** (India colourism / "Dark is Beautiful" busted
> head-on, and **melanin** taught as the natural science of skin colour); bodies **grow & change** at their
> own pace; **curiosity is a superpower**. Function over appearance, never clinical; scope-disciplined
> (private-part anatomy + detailed puberty live in later nodes: [Puberty Quest](puberty-quest.md),
> [The Amazing Journey](the-amazing-journey.md)). `gameId "body-lab"` kept (the GDD's `body-lab-juniors` is
> design-doc only). The sections below describe the original aspirational v1 build (stations/slider/UnReBeat),
> superseded by the v2 mechanic engine.

**Node #6 opens Chapter 2 (ages 6-9, Thread A · Body & Growing Up).** A friendly, **reading-light**
(audio-supported) science lab run by **Lensy**: the body thread steps from *my body is mine*
([My Body, My Rules](my-body-my-rules.md)) to **understanding how the body works and grows**. Curiosity-led,
science-framed, no-fail; works solo or in Classroom Mode.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `body-lab`, route `/game/body-lab`.
- **Type:** reading-light "body explorer" · **drag-label / match / slide** · no fail, no timer (gentle badges only).
- **Age band:** 6-9 · **Curriculum:** UNESCO 6.1 (anatomy & function), 6.3 (growth/puberty pre-onset), 6.2 (reproduction, simple), 6.4 (body image). Science-aligned (Ayushman Bharat health hour).
- **Status:** live · https://swipeed.vercel.app/game/body-lab

## How it works: five lab stations + the Body Lab Badge Book
1. **Label the Body**: tap each organ (heart, lungs, brain, tummy, muscles, bones); it lights up and Lensy says what it does.
2. **Super Senses**: the five senses (see/hear/smell/taste/feel).
3. **The Growing Machine**: a **slider** morphs a body baby → child *(you are here)* → teen → grown-up → older; bigger changes (puberty) are flagged gently, no detail yet.
4. **Where Babies Grow**: calm, museum-style: babies grow in the uterus; **School-Comfort gates the depth** (lighter = "in the uterus"; fuller adds "a tiny egg + a tiny sperm"). No romance, no mechanics, non-graphic.
5. **All Bodies Are Good**: body positivity across size, skin colour, hair, ability; directly counters colourism/size teasing.

Each station earns a **Body Lab Badge**; filling the book is the "Body Boss" finish.

## UN & RE debut
This is the **first game old enough (6+) to meet UN & RE**, the unlearn-relearn duo. They appear via a
shared **`UnReBeat`** component (`components/games/un-re.tsx`) at two beats: the **colourism myth** in
All Bodies ("Fair skin is better" → **UN** gently erases, **RE** redraws "every skin is good"), and the
**spiral relearn** in Where Babies Grow ("babies come from a tummy" → "the uterus, from an egg and a
sperm"). Hosted by Lensy, never shaming. See [Unlearn → Relearn → Grow](swipeed-core-principle.md).

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio narration contract (#10), India + School-Comfort (#14, gating the reproduction depth). Reuses
**Lensy** and the shared voice model. Builds on [My Body, My Rules](my-body-my-rules.md); sets up Puberty
Quest (#13), The Amazing Journey (#14) and Body Confident (#21).

## Status & roadmap
- **Built:** all five stations, the Badge Book, the UN & RE beats, School-Comfort gating; English narration.
- **Deferred (GDD Phase 2/3):** the senses mini-experiments polish, the "my growing-up timeline" save, a
  fuller organ/senses set, Classroom-Mode polish, the gentle daily streak, and **Hindi**.

## Related
- [SwipeEd (app)](swipeed.md) · [My Body, My Rules (#2)](my-body-my-rules.md) · [Core principle (UN & RE)](swipeed-core-principle.md) · [Reusable patterns](swipeed-game-patterns.md) · [Games catalog](index.md)
