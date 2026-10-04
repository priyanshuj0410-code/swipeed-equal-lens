---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/change-makers.md
title: Change Makers
description: A five-mode project-builder + campaign sim for ages 15-18. Turn what you care about into real, collective change. Find & sharpen a cause (UN & RE), make a plan, build the movement (Momentum sim), make it stick, and launch a real safe first step. Start small & real; collective; safe/lawful. No-fail.
resource: https://swipeed.vercel.app/game/change-makers
tags: [games, swipeed, gender-equality, civic-action, ages-15-18, campaign-sim]
timestamp: 2026-06-20T23:50:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Change Makers

> **Reworked to GDD 34 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> The campaign / collective-change node (Thread E · Gender & Respect) is now a **512-scenario typed library**
> (`content/games/change-makers.json`: find-your-cause 86 · make-the-plan 85 · build-the-movement 86 ·
> the-law-as-a-tool 83 · make-it-stick 87 · launch-it 85) on the **shared v2 engine**, with seven play actions
> (branch ×132 · reflect ×84 · sort ×68 · strike-rewrite ×63 · match ×60 · role-play ×57 · spot ×48), **0% binary**,
> led by branch (your move) + sort + strike-rewrite. **Scales [Lead the Way](lead-the-way.md) (g33) into
> organised, collective change:** pick a cause, make a plan, build a movement, measure impact, take a real, safe
> first step. **Change is possible AND practical**; start small and real; almost nothing meaningful is achieved
> alone; activism must be **safe, lawful, non-violent, ethical, sustainable** and, for sensitive causes, backed by
> trusted adults or institutions. **The law is a tool:** India's **Domestic Violence Act 2005, POSH Act 2013,
> Dowry Prohibition Act, BNS 2023** plus helplines (**181, 1098, 112**) a campaign can use and point people to.
> India: student councils, panchayats, NGOs, **Beti Bachao Beti Padhao**; India's own young changemakers
> (`reassureCats` [the-law-as-a-tool · make-it-stick] + `reassure` + helpLine). `gameId "change-makers"` (matches
> registry). Engine: no new mechanic; `binStyle` added `too vague`/`over-reach`/`stalls it`/`just noise`/`risks
> it`→red + `real impact`/`actionable`/`good partner`/`lawful & ethical`/`real protection`→green (collision-free;
> only genuinely good/bad bins coloured, while nuanced "not-yet" bins like "Still planning"/"Not the priority" and the
> tactic-categorisation bin advocacy↔awareness left neutral by design). Spot ids injected (4). Builds on
> [Equalize](equalize.md) (g26) & [Lead the Way](lead-the-way.md) (g33); pairs [Justice League: Rights](justice-league-rights.md)
> (g35). The sections below describe the original v1 build, superseded by v2.

**Node #34: the collective-action step (ages 15-18)**. *Pick something you care about, make a plan, bring
people with you, and start small, for real. Young people change the world; here's how.* It builds on
[Lead the Way](lead-the-way.md) (#33) and connects to [Justice League](justice-league-rights.md) (#35).
**Rebuilt to GDD 34** into the established 5-mode + UN&RE shape: change is possible & practical; start
small & real; collective; safe, ethical and lawful.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `change-makers`, route `/game/change-makers`.
- **Type:** reading-light **project-builder + campaign sim** · no fail · the plan & Q&A are private.
- **Age band:** 15-18 · **Curriculum:** UNESCO 4 (taking action) & 3.2 (gender equality). Builds on #33; connects to #35.
- **Status:** live (rebuilt to the GDD) · https://swipeed.vercel.app/game/change-makers

## How it works: five modes + the Badge Book
1. **Find Your Cause**: pick and **sharpen** an issue (make it specific & actionable); then the **UN & RE**
   beat (*"you're too young/small to change anything"* → *"young people have driven real change throughout
   history: pick one real thing, bring a few people, take one safe step"*).
2. **The Plan**: set a real goal, map allies & stakeholders, and choose tactics (awareness, advocacy,
   service, organising) into a doable plan.
3. **Build the Movement**: the signature **campaign sim**: deploy each move (recruit allies, build a team,
   communicate the message, partner) to grow a **Momentum** meter, collective change in motion.
4. **Make It Stick**: measure real impact over the noise, adapt, sustain (avoid burnout), and keep it
   safe, ethical and lawful.
5. **Launch It + Ask Anything**: turn the plan into a **real, safe first step** ("one concrete step this
   week beats a perfect plan that never launches"); Q&A.

A 5-badge **Badge Book** finishes into the shared [`GameDone`](swipeed.md) card. Reuses **Lensy** + the shared
**`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), the UN & RE move ([core principle](swipeed-core-principle.md)), the **deploy-to-fill
a meter** sim shape (shared with [Outbreak](outbreak.md)'s containment), and **India framing (#14)**
(youth-led action; Beti Bachao community change). Safe/lawful/ethical action is foregrounded throughout.

## Status & roadmap
- **Built:** Find Your Cause (pick & sharpen + UN & RE), The Plan, Build the Movement (Momentum sim), Make
  It Stick, Launch It + Ask; the Badge Book; English narration.
- **Deferred (GDD Phase 2/3):** a fuller campaign sim with stakeholder maps and tactic trade-offs, real
  launch templates, crown levels, Classroom-Mode team play, calm mode, and **Hindi**.
