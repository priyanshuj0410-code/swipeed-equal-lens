---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/plan-it.md
title: Plan It
description: An SRH planning game for ages 12-15 - how pregnancy happens, how it's prevented, and how planning protects your future. Map the fertility cycle, bust the dangerous pregnancy myths (UN & RE), weigh prevention (abstinence respected; contraception School-Comfort-gated), play the planning life-sim, and ask anything privately. Non-judgmental, no-fail.
resource: https://swipeed.vercel.app/game/plan-it
tags: [games, swipeed, srh, contraception, pregnancy, ages-12-15]
timestamp: 2026-06-20T18:30:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
---

# Plan It

> **Reworked to GDD 22 v2 - the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The fertility + pregnancy + contraception node (Thread F · SRH) is now a **504-scenario
> typed library** (`content/games/plan-it.ts`: how-it-happens 81 · bust-myths 93 · ways-to-prevent 83 ·
> delaying-valid 72 · plan-future 99 · facts-help 76), generated **faithfully** from the scorecard-passed GDD 22
> JSON, on the **shared v2 engine** (`components/games/v2-engine.tsx`). The old life-sim build is replaced by
> **seven typed play actions** (strike-rewrite ×101 · sort ×67 · reflect ×75 · branch ×80 · role-play ×72 ·
> build ×57 · match ×52), **0% binary tap**, led by **strike-rewrite** (bust the dangerous myth), **sort** (fact vs
> myth, reliable vs not) and **branch** (your own pace). Arc: how pregnancy happens → bust the dangerous myths →
> ways it's prevented → **delaying is valid** → plan your future → get the facts, not rumours. **School-comfort:
> matter-of-fact, NON-EXPLICIT, values-first.** Plain biology; busts the dangerous myths (first time, withdrawal,
> douching, 'safe days', orgasm); age-appropriate prevention overview (**abstinence fully reliable & respected**;
> condoms; *ask a doctor* about the rest); **delaying is fully valid** and respected (your pace vs "everyone's
> doing it" / "if you loved me"); facts from a **doctor / trusted adult**, not rumours. **GATED** at the path
> layer (age band) - untouched by the content/wrapper swap. Engine: **no new mechanic** (reuses 7 of 9); a
> notable `binStyle` fix - **removed `not needed` from the negative set**, because it was wrongly red-tinting a
> *neutral factual* bin (pl-003, which sorts "an orgasm by the girl" into "Not needed" for pregnancy) and the
> same neutral "Not needed" in [Clean Crew](clean-crew.md); both are now correctly neutral (a strict improvement).
> Added unreliable/made-up/rumour for the fact-vs-rumour sorts. `gameId "plan-it"` (matches the registry id).
> Builds on [The Amazing Journey](the-amazing-journey.md) (g14); prereq g39. The sections below describe the
> original v1 build, superseded by the v2 mechanic engine.

**Node #22 - the SRH planning step of Chapter 4** (ages 12-15). *Pregnancy isn't a mystery - it follows
clear rules.* The teen learns **how it happens, how it's prevented, and how planning protects the future
they want.** It continues [The Amazing Journey](the-amazing-journey.md)'s (#14) reproduction story into
**prevention and planning**, links the fertility cycle back to the menstrual-cycle learning of
[Puberty Quest](puberty-quest.md) / [Body Confident](body-confident.md), and hands forward to
[Outbreak](outbreak.md) (#23) on infections and condoms. **Non-judgmental; abstinence is respected as a real
choice; accurate, non-explicit contraception detail is gated by the School-Comfort setting.**

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `plan-it`, route `/game/plan-it`.
- **Type:** reading-light **life-sim + learning** · no fail · sim & Q&A private; School-Comfort sets the depth.
- **Age band:** 12-15 · **Curriculum:** UNESCO 6.2 (reproduction), 8.1 (pregnancy prevention). Builds on #14; links to #23, #29.
- **Status:** live · https://swipeed.vercel.app/game/plan-it

## How it works - five modes + the Badge Book
1. **The Fertility Cycle** - when pregnancy can happen (a sperm meets an egg; the fertile window isn't a
   single day; because cycles vary, you can't reliably "guess" a safe time).
2. **Myths Busted** - the **UN & RE** core on the **dangerous** pregnancy myths ("can't get pregnant the
   first time / standing up / during a period", boss: "pulling out is reliable + contraception causes
   infertility") - *these myths cause real, preventable harm.*
3. **Ways to Prevent** - **delaying / not having sex yet** as the only 100%-sure way and **a respected
   choice plenty of people make** (always shown); accurate, non-explicit contraception basics (a doctor/
   youth clinic explains them; condoms also protect against infection) added **only when School-Comfort
   is off**.
4. **Plan It!** - the signature **life-sim**: choices ripple into the future, **without fear or shame**
   (the safe choices keep your goals on track; a risky one is shown calmly with a chance to reconsider).
5. **My Future + Ask Anything** - private reflection + anonymous Q&A; pressure or pregnancy worry routes
   to a doctor, an **RKSK adolescent-friendly health clinic**, or **Childline 1098**. (No methods described.)

A 5-badge **Badge Book** finishes into the shared [`GameDone`](swipeed.md) card. Lensy returns in the teen
look as a calm, non-judgmental guide. Reuses the shared **`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), **myth-bust-by-choosing-the-truth (#19)**, **Made-for-India + School-Comfort (#14)**
(abstinence respected; contraception accurate/non-explicit + gated; RKSK clinics), **empower-never-frighten
(#16)** (no fear, no shame; planning framing), and the **Ask-It / safe-helper box (#18)**.

## Status & roadmap
- **Built:** The Fertility Cycle, Myths Busted (UN & RE, incl. a boss), Ways to Prevent (abstinence always
  shown; contraception School-Comfort-gated), Plan It! life-sim, My Future + Ask Anything (with the
  doctor/RKSK/Childline route); the Badge Book; English narration.
- **Deferred (GDD Phase 2/3):** a richer life-sim with longer-horizon ripples, crown levels, a fuller
  myth/fact bank, Classroom-Mode polish, calm mode, and **Hindi**.
