---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/my-choices-my-future.md
title: My Choices, My Future
description: A reproductive-decision sim for ages 15-18, covering the full contraceptive picture, the real choices (whether/when/spacing) and the rights and access that protect them. Comprehensive, non-judgmental, pressure-free; delaying respected; non-explicit; method specifics School-Comfort-gated. No-fail.
resource: https://swipeed.vercel.app/game/my-choices
tags: [games, swipeed, srh, contraception, reproductive-rights, ages-15-18]
timestamp: 2026-06-20T20:30:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/5656f62f-d7dc-4f60-bdef-0e52c8a67b6b  # SWED-80
---

# My Choices, My Future

> **Reworked to GDD 29 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The contraception / family-planning / services node (Thread F · SRH, ages 15-18) and the
> **Chapter 5 opener** is now a **545-scenario typed library** (`content/games/my-choices.json`: the-full-picture
> 91 · if-when-whether 91 · decide-it 103 · access-and-rights 76 · talk-it-through 94 · my-future-no-pressure 90),
> generated **faithfully** from the scorecard-passed GDD 29 JSON, on the **shared v2 engine**
> (`components/games/v2-engine.tsx`). **Seven typed play actions** (branch ×100 · strike-rewrite ×92 · reflect
> ×80 · sort ×76 · role-play ×81 · spot ×57 · match ×59), **0% binary tap**, led by branch (decide it),
> strike-rewrite (bust the myth) and sort. Arc: the full picture (methods/effectiveness/access) → if, when &
> whether → decide it → access & rights → talk it through → my future, no pressure. **AUTONOMY-FIRST, mature,
> comprehensive but never explicit:** NO PRESSURE IN ANY DIRECTION: waiting / not having sex is fully valid,
> respected, and the only 100%-certain option; being active isn't irresponsible (informed, consensual, protected
> is what matters). India: RKSK / **Adolescent-Friendly Health Clinics (Ujala), confidential services**; age of
> consent 18, POCSO protects under-18s, **coercion/exploitation is a child-protection matter**, routes to a
> doctor / trusted adult / Childline 1098 (`reassureCats` [access-and-rights · if-when-whether ·
> my-future-no-pressure] + `reassure` + helpLine). **gameId trap:** library/GDD aspirational id is
> `my-choices-future` but the engine-host registry id is `my-choices`: config uses `my-choices`. Engine: **no
> new mechanic**; `binStyle` added `pressures`/`violation`/`undermines`→red + `respected`→green (autonomy bins;
> deliberately *not* `forced`, which would wrongly red the pro-autonomy "Never to be forced" bin). Spot
> scene-item ids injected (7). Builds on [Plan It](plan-it.md) (g22); links [Status: Know It](status-know-it.md)
> (g30) & [Mutual](mutual.md) (g31). The sections below describe the original v1 build, superseded by the v2
> mechanic engine.

**Node #29 opens Chapter 5 (ages 15-18).** *You're nearly an adult, and these are your choices: whether,
when and how, made with full information, your own values, and respect for your future.* It is the
**mature completion of [Plan It](plan-it.md)** (#22): the fertility and prevention basics become the **full
picture**, the life-sim becomes a genuine **values-based decision tool**, and **rights and access** take
centre stage. It connects to [Status: Know It](status-know-it.md) (#30) on sexual health and [Mutual](mutual.md) (#31) on consent.
**Comprehensive and non-judgmental, pressure-free; delaying respected throughout; non-explicit; method
specifics gated by School-Comfort.** Lensy returns in a young-adult look as a calm, non-judgmental peer.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `my-choices`, route `/game/my-choices`.
- **Type:** reading-rich **decision-sim + learning** · no fail · sim & Q&A private; School-Comfort gates method depth.
- **Age band:** 15-18 · **Curriculum:** UNESCO 8.1 (comprehensive pregnancy prevention) + reproductive rights. Builds on #22; links to #30, #31.
- **Status:** live · https://swipeed.vercel.app/game/my-choices

## How it works: five modes + the Badge Book
1. **The Full Picture**: the contraceptive options, **factual and non-explicit** (delaying = 100% and
   respected; methods differ in how they work and how effective; a clinic helps you choose privately).
   The **fuller setting** adds barrier/hormonal/long-acting basics; then the **UN & RE** beat busts
   *"contraception harms your health"* → *"standard methods are safe and effective. Now the choice is
   genuinely yours."*
2. **If, When & Whether**: the real reproductive choices (whether to have children, when, and spacing) and
   the **rights** that protect them; waiting until you're ready is always respected.
3. **Decide It**: the signature **values-based decision sim**: gather the facts, check your values, decide
   freely; pressure/hope options get a calm reframe (*no right answer. Decide well*; the choice is yours).
4. **Access & Rights**: confidential services (an **RKSK clinic**, a family-planning service, a doctor),
   reproductive rights, and talking it through with a partner or doctor.
5. **My Future + Ask Anything**: a values reflection and a fully open, private Q&A; pressure or
   uncertainty routes to a trusted adult, an RKSK clinic, or **Childline 1098**.

A 5-badge **Badge Book** finishes into the shared [`GameDone`](swipeed.md) card. Reuses the shared
**`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), the UN & RE move ([core principle](swipeed-core-principle.md)),
**Made-for-India + School-Comfort (#14)** (comprehensive but non-explicit; method specifics gated; RKSK
clinics), **empower-never-frighten (#16)** (pressure-free; "the choice is yours"), and the **Ask-It /
safe-helper box (#18)** now fully open.

## Status & roadmap
- **Built:** The Full Picture (facts + UN & RE; method specifics School-Comfort-gated), If/When/Whether,
  Decide It (values decision sim), Access & Rights, My Future + Ask Anything (with the RKSK/Childline
  route); the Badge Book; English narration.
- **Deferred (GDD Phase 2/3):** a deeper multi-factor decision sim with longer ripples, a fuller method
  comparison, crown levels, Classroom-Mode polish, calm mode, and **Hindi**.

## Safety fixes (2026-10-02)

[SWED-80](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/5656f62f-d7dc-4f60-bdef-0e52c8a67b6b): the game no longer says mandatory reporting is a myth. It now teaches the one legal limit on clinic confidentiality for under-18s: clinics don't tell your family, but if a clinician learns that someone under 18 is having sex or being abused, POCSO says they must tell the police. `mc-945`'s relearn was rewritten, and `mc-956`'s relearn names the limit. The "ask what stays private" role-plays (`mc-050`, `mc-904`, `mc-921`, `mc-1263`, `mc-1416`) say a clinician will explain, including that limit. `mc-931`, `mc-1320` and `mc-1375` no longer promise that everything stays private, and neither do the `helpLine` and the badge blurb. Every remaining confidential or private line is listed with a verdict in the [confidentiality sweep](../audits/confidentiality-sweep-2026-10-02.md).
