---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/speak-up.md
title: Speak Up
description: A five-mode, never-victim-blaming game for ages 9-12. Spot when teasing crosses into gender-based harm, choose a safe response, bust the victim-blaming myths (UN & RE), build a Help Map of who to tell, and stand together. Safety-critical, supportive, no-fail.
resource: https://swipeed.vercel.app/game/speak-up
tags: [games, swipeed, gender-equality, ages-9-12, gbv, help-map, safeguarding]
timestamp: 2026-06-20T17:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/0c1b8795-8d5d-4208-92d0-e1365dd590bc  # SWED-122
---

# Speak Up

> **Reworked to GDD 19 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The bystander-to-upstander node is a **558-scenario typed library**
> (`content/games/speak-up.ts`: name-the-harm 95 · why-speak-up 91 · five-moves 92 · find-the-words 101 ·
> get-help 84 · be-the-upstander 95), generated **faithfully** from the scorecard-passed GDD JSON, on the
> **shared v2 engine** (`components/games/v2-engine.tsx`). Every scenario is one of **seven typed play actions**
> (branch ×120 · role-play ×96 · sort ×72 · spot ×79 · reflect ×61 · strike-rewrite ×72 · match ×58; no build),
> **0% binary tap**, led by the **five-moves chooser** (branch: the 5 Ds: **say something/Direct, Distract, get
> help/Delegate, check in/Delay, report/Document**). **This chooser is the reference branch engine** Stand Up
> (g27) & Defenders of the Body (g20) reuse. Across the name → why → moves → words → help → act arc: naming the
> forms of gender-based harm (gendered name-calling, exclusion, unwanted touch, body-mocking, online hate), why
> speaking up matters, the five safe moves, finding the actual words, where to get help, and being the upstander.
> Ethics: **safety over heroics** (never confront danger alone: "get help" always honoured); **never blame the
> target**; **telling is not tattling**; **freezing is okay** (a second chance); real routes: trusted adults,
> school counsellors, **Childline 1098 / 112** (`reassure` + `reassureCats` ["get-help"]). Engine: **no new
> mechanic** (reuses 7 of 9); a `binStyle` valence accretion (harm/silent-bystander → red,
> upstander/fun-for-all/just-fine → green). The five-moves categorizations and get-help-now/check-in-after stay
> neutral distinctions. Generator injects spot scene-item ids (g19's library omitted them). `gameId "speak-up"`
> (matches the registry id). Builds on [Not Fair, Not Funny](not-fair-not-funny.md) (g11); prereq g18; pairs
> [Safety Squad](safety-squad.md) (g08). The sections below describe the original v1 build, superseded by the v2
> mechanic engine.

**Node #19: the Gender & Respect step that names gender-based harm and finds help** (ages 9-12).
**Safety-critical, non-graphic, and unconditionally never-victim-blaming.** The child learns to spot when
something has **crossed from teasing into harm**, what a **safe response** looks like, and **exactly who
to tell**, *because it's never your fault, and you're never alone.* It grows directly from
[Not Fair, Not Funny](not-fair-not-funny.md) (#11) (the ally instinct and the "if it hurts, it's not a
joke" test mature into recognising real harm) and draws on [Safety Squad](safety-squad.md)'s (#8) safe
move and Safety Net. The Help Map and safe responses carry forward to **Stand Up (#27, the bystander 4 Ds)**
and the teen rights games.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `speak-up`, route `/game/speak-up`.
- **Type:** reading-light **scenario + help-map** game · no fail · supportive throughout.
- **Age band:** 9-12 · **Curriculum:** UNESCO 3.3 (gender-based violence), 5.5 (finding help). Builds on #8 and #11.
- **Status:** live (rebuilt to the GDD) · https://swipeed.vercel.app/game/speak-up

## How it works: five modes + the Badge Book
1. **Spot the Harm**: calm scenarios across the spectrum (body comments, exclusion "because girls are
   weak", a photo shared to shame): the child recognises what counts as harm and **why it's wrong**.
2. **The Safe Response**: choose a safe response: **set a boundary · find an ally · tell a trusted adult
   · use a helpline**, for the person and the bystander. **Never a risky confrontation** (passive/unsafe
   picks get a non-victim-blaming nudge).
3. **It's Not Your Fault**: the crucial **UN & RE** unlearn: UN erases *"she asked for it", "boys will be
   boys", "telling is snitching"*, RE redraws *"no one ever asks to be harmed; it's always the fault of the
   person who harms; telling is brave, not snitching."*
4. **The Help Map**: build a kept map of who and where to get help: a trusted adult/teacher, the school
   counsellor, **Childline 1098**, the **POCSO e-Box**, the **women's helpline 181**.
5. **Stand Together**: support the person, report together, and **keep telling until someone helps**.
   You're never alone.

A 5-badge **Badge Book** finishes into the shared [`GameDone`](swipeed.md) card. Reuses **Lensy** (hosting a
serious topic with warmth) + the shared **`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), the UN & RE move ([core principle](swipeed-core-principle.md)),
**empower-never-frighten (#16)** (serious, non-graphic, every safe response is boundary/ally/tell/helpline,
never escalate), and the **Help Map / safe-helper** lineage ([#18](swipeed-game-patterns.md)) routing to
Childline 1098 / POCSO e-Box / 181.

## Status & roadmap
- **Built:** all five modes (Spot the Harm, The Safe Response, It's Not Your Fault UN & RE, the Help Map,
  Stand Together), the Badge Book; English narration; never-victim-blaming throughout.
- **Deferred (GDD Phase 2/3):** a fuller scenario bank, crown levels (subtler harm), facilitator/Classroom
  guides, calm mode, and **Hindi**.

## Safety fixes (2026-10-02)

[SWED-122](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/0c1b8795-8d5d-4208-92d0-e1365dd590bc): `su-1183` matches Childline 1098 to "Free, and there to help" instead of "Free and confidential". See the [confidentiality sweep](../audits/confidentiality-sweep-2026-10-02.md).
