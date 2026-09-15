---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/what-makes-me-me.md
title: What Makes Me, Me
description: SwipeEd node #7 (ages 6-9), the gender-thread keystone. Sort traits into Body (born with) vs Learned (taught), bust the unfair learned "rules" with UN & RE, and discover that what makes you you isn't your gender.
resource: https://swipeed.vercel.app/game/what-makes-me
tags: [games, swipeed, ages-6-9, gender, sex-vs-gender, un-re, sam]
timestamp: 2026-06-19T23:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# What Makes Me, Me

> **Reworked to GDD 07 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The **root of the gender thread** (UNESCO 3.1) is a **501-scenario typed library**
> (`content/games/what-makes-me.ts`: parts-of-me 85 · sex-and-gender 80 · not-what-you-like 85 · many-ways 83
> · respect-me 82 · be-yourself 86), generated **byte-identical** from the scorecard-passed GDD JSON, on the
> **shared v2 engine** (`components/games/v2-engine.tsx`). Every scenario is one of **seven typed play actions**
> (reflect ×98 · strike-rewrite ×92 · role-play ×72 · branch ×69 · sort ×55 · match ×58 · build ×57), **0% binary
> tap**, led by the **me-collage build** ("the one and only you": many parts → one me, gender one part among
> many) + a gentle **sex-vs-gender** explainer (the body you're born with vs who you know you are inside) +
> respect-in-action role-play (**use the name someone gives**). **Scope deliberately expanded from v1:** where
> the v1 build below stayed on *learned roles only* (not gender identity), v2 now teaches sex vs gender **and**
> "many ways to be": grounded in **India's own hijra heritage + the Supreme Court's NALSA (2014)** third-gender
> recognition (homegrown, not imported). It holds the GDD's hard **ethics contracts**: respect is the floor for
> *every* family; **self-knowledge, never pressure**: protecting the gender-diverse child **and** the majority
> child; scope-disciplined (no medical/romantic/political; body anatomy stays light: it lives in
> [My Body, My Rules](my-body-my-rules.md) / [Body Lab Juniors](body-lab-juniors.md); this node owns the *idea*,
> not the biology). An adversarial ethics/India/scope/quality audit returned **0 confirmed violations**.
> Engine: no new mechanic, only a sanctioned `binStyle` accretion so the respect/kindness sorts read green/red
> while the **sex-vs-gender-vs-expression sorts correctly stay neutral** (neither side is "better").
> `gameId "what-makes-me"` kept (the GDD's `what-makes-me-me` is design-doc only). The sections below describe
> the original v1 build (sort-and-reveal / `UnReBeat`), now superseded by the v2 mechanic engine.

**Node #7: the conceptual keystone of the Gender & Respect thread** (ages 6-9, sex vs gender). Teaches
the single most powerful idea in gender education at a child's level: some things are about the **body**
(born with), but most **"rules"** about what boys and girls should do are **learned, and learned things
can change.** A flagship **[Unlearn → Relearn → Grow](swipeed-core-principle.md)** game where **UN & RE**
do their clearest work. Even-handed, no-fail; stays on **learned roles** (not gender identity, age-right
and broadly acceptable).

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `what-makes-me`, route `/game/what-makes-me`.
- **Type:** reading-light **sort-and-reveal** · no fail, no timer (gentle It-Can-Change badges).
- **Age band:** 6-9 · **Curriculum:** UNESCO ITGSE 3.1 (the social construction of gender). Builds on Same Same, Different (#4) + Can-Do Kids (#5); base for Flip the Script, Norm Storm, MythBuster, the rights games.
- **Status:** live · https://swipeed.vercel.app/game/what-makes-me

## How it works: five modes + the It-Can-Change Badge Book
1. **Body or Learned?** sort each card into **Body (born with)** or **Learned (taught)**; a reveal explains. (Body = real biology kept simple; Learned = the "rules".)
2. **Bust the 'Rule' (UN & RE)**: for a learned rule treated as natural ("Boys are the leaders", "Girls should cook"), **UN** gently erases *"that's just how it is"* (never blaming the child or family) and **RE** redraws *"it's a learned rule, and it can change"*, earning an **It-Can-Change badge**. The signature beat (shared `UnReBeat`).
3. **It Can Change**: bright real examples (women fly planes & lead; men cook & care for babies).
4. **Same Body, Many Ways**: similar bodies, very different likes: your body doesn't decide who you are.
5. **What Makes Me, Me**: the payoff: a small self-portrait of likes + strengths, *none decided by being a boy or a girl.*

Even-handed throughout (busts rules about boys as often as girls; never says a gender is "better").
Reuses **Lensy** + the shared **`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio narration contract (#10), India + School-Comfort (#14: stays on learned roles), and the UN & RE
move (the [core principle](swipeed-core-principle.md)). The identity card lets every child portray
themselves (#17 spirit).

## Status & roadmap
- **Built:** all five modes, the Badge Book, the UN & RE rule-busting, the identity card; English narration.
- **Deferred (GDD Phase 2/3):** the "It Can Change" song, a drag-into-bins polish, a fuller card bank,
  Classroom-Mode polish, the gentle daily streak, and **Hindi**.

## Related
- [SwipeEd (app)](swipeed.md) · [Same Same, Different (#4)](same-same-different.md) · [Can-Do Kids (#5)](can-do-kids.md) · [Core principle (UN & RE)](swipeed-core-principle.md) · [Games catalog](index.md)
