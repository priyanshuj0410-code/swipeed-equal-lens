---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/puberty-quest.md
title: Puberty Quest
description: A light myth-busting quest for ages 9-12 - explore Puberty Valley, collect accurate fact cards into the Pocketbook, bust Myth Monsters with the truth (UN & RE), and ask anything in the anonymous Ask-It box. Menstruation-positive, even-handed, no-fail.
resource: https://swipeed.vercel.app/game/puberty-quest
tags: [games, swipeed, puberty, body, ages-9-12, myth-bust, ask-it]
timestamp: 2026-06-20T14:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
---

# Puberty Quest

> **Reworked to GDD 13 v2 - the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The puberty node - and the **first Chapter 3 node**, where the register turns
> matter-of-fact, near-peer (Lensy grows up a little) and the play goes **private / solo** - is a
> **446-scenario typed library** (`content/games/puberty-quest.ts`: whats-puberty 44 · girls-changes 83 ·
> boys-changes 93 · body-care-mood 78 · periods-no-shame 66 · where-to-find-out 82), generated **faithfully**
> from the scorecard-passed GDD JSON, on the **shared v2 engine** (`components/games/v2-engine.tsx`). Every
> scenario is one of **seven typed play actions** (strike-rewrite ×101 · reflect ×92 · branch ×89 · match ×41 ·
> sort ×40 · build ×42 · role-play ×41), **0% binary tap**, led by **myth-busts** (strike-rewrite - the densest
> taboo-busting set so far, 23 myths), **private reflections**, and **real-moment dilemmas** (branch). Teaches:
> what puberty is & the wide range of normal, girls' changes (periods explained), boys' changes (voice, wet
> dreams, erections - the ones no one warns them about), body care & moods, **periods without shame** (busting
> India's menstrual taboos - "impure", can't-touch-food, must-miss-school - with dignity), and where to find
> trusted answers. Ethics: **private & solo** (no "show a parent"; embarrassment is the gatekeeper, so the app
> is the trusted source); **accurate & inclusive** (proper names; girls AND boys; boys learn about periods too);
> **bust taboos, respect families** (named as myths while keeping the child's dignity, never told to defy
> elders); **equity & dignity** (period poverty handled with care; no one should miss school - `reassure` +
> `reassureCats` ["periods-no-shame"] → the "you're never impure, you deserve dignity" banner); routes to
> trusted sources / support (`helpLine` Childline 1098). Engine: **no new mechanic** (reuses 7 of 9); a
> `binStyle` valence accretion (unhelpful/harmful → red, reliable → green) - normal-vs-not-a-puberty-thing and
> normal-ups-vs-reach-out stay neutral distinctions. `gameId "puberty-quest"` (matches the registry id). Builds
> on [Body Lab Juniors](body-lab-juniors.md) (g06); feeds [The Amazing Journey](the-amazing-journey.md) (g14) &
> [Mind Matters](mind-matters.md) (g38). **Opens Chapter 3 to the v2 standard.** The sections below describe the
> original v1 build (Puberty Valley quest), superseded by the v2 mechanic engine.

**Node #13 - opens Chapter 3 (ages 9-12)**, arriving right when most children begin puberty. A light
myth-busting **quest** through "Puberty Valley": the child collects accurate, friendly fact cards into a
**Puberty Pocketbook**, defeats **Myth Monsters** (the rumours and shame around puberty) by **choosing the
truth that busts them** (UN & RE), and can ask anything - anonymously - in the **Ask-It box**. A flagship
for the [Unlearn → Relearn → Grow](swipeed-core-principle.md) principle: puberty is the most myth-laden
topic a 9-12-year-old meets. **Menstruation-positive** and deliberately **even-handed** (boys learn about
periods and girls about boys' changes - shared knowledge kills stigma), with **School-Comfort** gating the
most sensitive content. Grows directly from [Body Lab Juniors](body-lab-juniors.md) (#6).

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `puberty-quest`, route `/game/puberty-quest`.
- **Type:** reading-light **myth-busting quest** (collect facts · bust myths · ask anonymously) · no fail.
- **Age band:** 9-12 · **Curriculum:** UNESCO 6.3 (puberty), 6.1 (anatomy), 6.4 (body image), 7.2 (body changes & feelings). Builds on Body Lab Juniors (#6); sets up The Amazing Journey (#14), Body Confident (#21), Plan It (#22).
- **Status:** live · https://swipeed.vercel.app/game/puberty-quest

## How it works - five valley areas + the Pocketbook
1. **The Period Place** - menstruation, positively and practically: what a period is, the cycle, pad/cloth
   use & disposal, tracking - *normal and healthy, nothing to hide* (taught co-ed by default).
2. **Changes All Over** - all-body changes (growth spurts, voice, body hair, sweat/odour, wet dreams) and
   the hygiene that goes with them, so everyone understands everyone.
3. **Moods & My Self** - mood swings are normal, different timing is normal, you're still you (body image).
   One **factual masturbation card** is gated by the **School-Comfort** setting (shown only in the fuller setting).
4. **Myth Monsters** - the **UN & RE core**: a monster voices a real myth ("periods are dirty!", "only
   girls change!", "a wet dream means something's wrong!", boss: "everyone develops at the same time!");
   the child **picks the true fact** to bust it (no-fail - a wrong pick nudges), then UN erases ("lots of
   kids hear this - it's not your fault") and RE redraws the truth, and the monster pops.
5. **Ask-It Box** - common anonymous questions with vetted, never-shaming answers; a distress item routes
   to a **trusted adult / counsellor / Childline 1098** (no PII collected). *(See patterns #18, #19.)*

A 5-badge **Puberty Pocketbook** (one badge per area) finishes into the shared [`GameDone`](swipeed.md)
card. Reuses **Lensy** (an older, explorer look) + the shared **`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), **Made-for-India + School-Comfort (#14)** (menstruation positive & practical aligned
to menstrual-hygiene schemes; masturbation factual + School-Comfort-gated), **empower-never-frighten
(#16)**, the **Ask-It box (#18)** and **myth-bust-by-choosing-the-truth (#19)** - both **debuting here**.

## Status & roadmap
- **Built:** Puberty Valley with The Period Place, Changes All Over, Moods & My Self; the Myth Monster
  battles (UN & RE, incl. a boss); the Ask-It box with a Childline help route; the Pocketbook;
  School-Comfort gating of the masturbation card; English narration.
- **Deferred (GDD Phase 2/3):** crown levels (revisit areas deeper), a fuller myth/fact bank, live Ask-It
  intake + human triage, optional class leagues, Classroom-Mode polish, calm mode, and **Hindi**.
