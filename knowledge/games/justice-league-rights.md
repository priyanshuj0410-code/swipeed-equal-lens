---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/justice-league-rights.md
title: "Justice League: Rights Edition"
description: A five-mode rights-&-justice game for ages 15-18, covering your rights, the laws that protect you, and how to get justice. Know your rights (UN & RE), know the law in plain language, learn the routes to redress, apply rights in real scenarios, and keep a rights toolkit. Educational, not legal advice. No-fail.
resource: https://swipeed.vercel.app/game/justice-league
tags: [games, swipeed, rights, legal-literacy, ages-15-18]
timestamp: 2026-06-21T00:10:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Justice League: Rights Edition

> **Reworked to GDD 35 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> The rights-&-redress node (Thread G · Values, Rights & Media) is now a **492-scenario typed library**
> (`content/games/justice-league.ts`: know-your-rights 90 · know-the-law 73 · get-justice 76 · rights-in-action
> 78 · educational-not-advice 88 · your-rights-toolkit 87) on the **shared v2 engine**, with seven play actions
> (branch ×91 · reflect ×91 · sort ×62 · match ×65 · strike-rewrite ×75 · spot ×57 · role-play ×51), **0% binary**,
> led by branch (your move) + match (law → plain meaning) + strike-rewrite (bust the myth). **Empowerment through
> knowledge:** you have rights, laws protect you, and there are real routes to help and justice: knowing them is
> your superpower against exploitation. **EDUCATIONAL, NOT legal advice:** plain-language law, demystified redress,
> real authorities + free legal aid; never promises outcomes. India framework: **constitutional rights** (equality,
> dignity, RTE), **POCSO** (age of consent 18), **POSH Act** (workplace Internal Committee), **Prohibition of Child
> Marriage Act** (18/21), DV Act, cyber-law; routes a trusted adult, **police/FIR** (Zero FIR at any station),
> school/college **Internal Committees**, **Child Welfare Committees**, **NCPCR**/women's commissions, **free legal
> aid via NALSA** (15100, Article 39A), helplines (**Childline 1098, Women 181, 1091, emergency 112, cybercrime
> 1930**); live danger routes to help (`reassureCats` [get-justice · your-rights-toolkit · educational-not-advice]
> + `reassure` + helpLine). `gameId "justice-league"` (matches registry). Engine: no new mechanic; `binStyle`
> safe-negation guard += `not a violation`→green (jl-053's safe side) + NEG += `violates`→red (regression-clean,
> g35-only); the definitional/corrective/routing-categorisation bins (what-it-means↔what-it-isn't, real-route,
> in-the-toolkit, 112↔committee) correctly left neutral. Spot ids injected (4). Builds on [Defenders of the Body](defenders-of-the-body.md)
> (g20); pairs [Change Makers](change-makers.md) (g34); underwrites [Mutual](mutual.md) (g31). **All law content
> must be expert-reviewed, localised and kept current.** The sections below describe the original v1 build,
> superseded by v2.

**Node #35: the rights & justice step (ages 15-18)**. *You have rights, there are laws that protect you,
and there are real ways to get help and justice: knowing them is your superpower.* It builds on
[Defenders of the Body](defenders-of-the-body.md) (#20) and pairs with [Change Makers](change-makers.md)
(#34). **Rebuilt to GDD 35** into the established 5-mode + UN&RE shape. **Empowering & accurate:
educational, NOT legal advice** (all law content should be expert-reviewed, localised and kept current).

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `justice-league`, route `/game/justice-league`.
- **Type:** reading-rich **rights & justice** game · no fail · Q&A private; educational only.
- **Age band:** 15-18 · **Curriculum:** UNESCO Key Concept 1 (rights in relationships) & cross-cutting rights. Builds on #20; pairs with #34.
- **Status:** live (rebuilt to the GDD) · https://swipeed.vercel.app/game/justice-league

## How it works: five modes + the Badge Book
1. **Know Your Rights**: your fundamental & child rights (equality, dignity, education, protection) made
   real; then the **UN & RE** beat (*"rights aren't for someone like me"* → *"every child and teen holds
   rights, guaranteed by law, and here's how to claim them"*).
2. **Know the Law**: the key laws in plain language: **POCSO** (under-18s; age of consent 18), the **POSH
   Act** (harassment at work/college), the minimum **marriage age** (child marriage is illegal), and
   **cyber** laws (online abuse / non-consensual images).
3. **Get Justice**: the practical path to redress: a trusted adult/teacher/counsellor, the police (**FIR**:
   *must* be registered for serious offences), school/college **Internal Committees** & **Child Welfare
   Committees**, the **helplines** (1098 / 181 / 1091 / 112 / 1930), and **free legal aid** via the Legal
   Services Authority.
4. **Rights in Action**: apply rights to real scenarios (stream discrimination at school, a shared private
   image, a pushed child marriage): spot the violation and pick the move that claims the right.
5. **Your Rights Toolkit + Ask Anything**: a reference of rights/laws/helplines; Q&A; live danger routes to
   **112 / 1098 / 181 / 1091** and a trusted adult.

A 5-badge **Badge Book** finishes into the shared [`GameDone`](swipeed.md) card. Reuses **Lensy** + the shared
**`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), the UN & RE move ([core principle](swipeed-core-principle.md)),
**empower-never-frighten (#16)** (reporting is your right, never shameful; live danger routed to help), the
**Ask-It / safe-helper box (#18)**, and **Made-for-India (#14)** (POCSO / POSH / PCMA / IT Act; FIR;
Internal Committees; NALSA free legal aid). Explicitly **educational, not legal advice.**

## Status & roadmap
- **Built:** Know Your Rights (collect + UN & RE), Know the Law, Get Justice, Rights in Action (scenes),
  Your Rights Toolkit + Ask (with live-danger routing); the Badge Book; English narration.
- **Deferred (GDD Phase 2/3):** a fuller, continually-verified law/redress bank, a case-file simulator,
  crown levels, Classroom-Mode mock cases, calm mode, and **Hindi**, with ongoing legal-expert review.
