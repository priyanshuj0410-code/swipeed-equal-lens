---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/body-confident.md
title: Body Confident
description: A body-image self-care app for ages 12-15 - judge media real vs filtered (UN & RE), grow through puberty at your own pace, escape the comparison trap, do kind self-care, and ask anything privately. Body-neutral, NO weight/calorie tracking, help-signposted. No-fail.
resource: https://swipeed.vercel.app/game/body-confident
tags: [games, swipeed, body-image, puberty, media-literacy, ages-12-15]
timestamp: 2026-06-20T18:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/785d53d2-2943-49b3-9cad-96dce0c54bfb  # SWED-62
---

# Body Confident

> **Reworked to GDD 21 v2 - the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible) - and the game that **opens Chapter 4** (ages 12-15). The puberty-depth + body-image +
> media-literacy node (Thread A) is now a **509-scenario typed library** (`content/games/body-confident.ts`:
> changing-body 84 · real-vs-filtered 90 · worth-not-looks 84 · beauty-myths 88 · care-not-fix 77 · when-heavy 86),
> generated **faithfully** from the scorecard-passed GDD 21 JSON, on the **shared v2 engine**
> (`components/games/v2-engine.tsx`). The old 5-mode (Fact-or-Filter) build is replaced by **seven typed play
> actions** (strike-rewrite ×107 · reflect ×76 · sort ×71 · spot ×76 · branch ×60 · role-play ×64 · build ×55),
> **0% binary tap**, led by **strike-rewrite** (bust the beauty myth), **spot** (Fact-or-Filter) and **sort**
> (real vs filtered, care vs 'fix'). Arc: still-changing body → real vs filtered → worth isn't looks → beauty
> myths → care-not-fix → **when it gets heavy**. **Body-NEUTRAL** (worth untied from looks; *never* diet or
> ideal-body framing) + media literacy (most posts are edited). Names India's **colourism / fair-skin pressure**
> as a harmful false standard (skin-lightening creams called out; vitiligo/scar representation; every skin tone,
> shape and size normal); **gender-inclusive** (boys face body pressure too). **Wellbeing-safe:** persistent body
> distress / disordered-eating signs (skipping meals, over-exercising) route to a trusted adult, school counsellor
> or doctor + **Childline 1098** (`reassure` + `reassureCats` ["when-heavy"]). Engine: **no new mechanic**
> (reuses 7 of 9); a `binStyle` valence accretion (care/fix, kind/pressuring, trusted/not-reliable,
> healthy/harmful) - while **real/filtered** and **reach-out/ordinary-off-day** deliberately stay **neutral**
> (media-literacy + distress distinctions are not moralised). Generator injects spot scene-item ids.
> `gameId "body-confident"` (matches the registry id). Builds on [Puberty Quest](puberty-quest.md) (g13); prereq
> c3. The sections below describe the original v1 build, superseded by the v2 mechanic engine.

**Node #21 - opens Chapter 4 (ages 12-15).** *Your body is changing, it's yours, and it's good - you don't
have to match anyone.* It continues [Puberty Quest](puberty-quest.md)'s (#13) body education into the
teens and turns its "everyone develops at a different time" message into a full **body-image** game, and
extends [Flip the Script](flip-the-script.md)'s (#17) media literacy and anti-colourism directly onto the
teen's own self-image. **Body-positive / body-neutral and never triggering** - there is **no weight or
calorie tracking** anywhere - with clear signposting to help for body-image or eating distress.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `body-confident`, route `/game/body-confident`.
- **Type:** reading-light **self-care app + mini-games** (Fact-or-Filter at its centre) · no fail · tracker & Q&A are private.
- **Age band:** 12-15 · **Curriculum:** UNESCO 6.4 (body image), 6.3 (puberty), 6.1 (anatomy). Builds on #13 and #17.
- **Status:** live · https://swipeed.vercel.app/game/body-confident

## How it works - five modes + the Badge Book
1. **Fact or Filter** - the signature mini-game: judge whether a media image is **real or filtered/edited**,
   learn the tricks media uses to manufacture "perfect", then the **UN & RE** beat - UN slides *"that
   perfect photo is real"* back to real, RE redraws *"real bodies are diverse and changing; you're far more
   than how you look."*
2. **My Body, My Pace** - puberty in the teens at everyone's own rate; **menstrual health with dignity**
   (cycle, pain, products); an **optional private tracker** logs cycle and wellbeing - **never weight**.
3. **The Comparison Trap** - body-neutral self-acceptance: comparison steals joy; your feed isn't real
   life; beauty isn't a colour; **your worth was never about your looks.**
4. **Self-Care Quests** - healthy, kind self-care that is **never about looks** (sleep, movement for joy
   not punishment, eating to fuel not shrink, rest, hygiene).
5. **Ask Anything + Get Help** - a private, anonymous Q&A; **body-image/eating distress is signposted** to
   a trusted adult/counsellor, **Tele-MANAS 14416**, or **Childline 1098** (no methods ever described).

A 5-badge **Badge Book** finishes into the shared [`GameDone`](swipeed.md) card. Lensy returns with an older,
teen look. Reuses the shared **`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4), content-as-data (#1), shared juice (#11),
audio contract (#10), the UN & RE move ([core principle](swipeed-core-principle.md)),
**empower-never-frighten (#16)** (body-neutral, never triggering, **no weight/calorie tracking**;
distress signposted, not diagnosed), the **Ask-It / safe-helper box (#18)** matured into a central private
Q&A, and **India framing (#14)** (anti-colourism; Tele-MANAS / Childline routes).

## Status & roadmap
- **Built:** Fact or Filter (judge + UN & RE), My Body My Pace, The Comparison Trap, Self-Care Quests, Ask
  Anything + Get Help (with the Tele-MANAS/Childline route); the Badge Book; English narration.
- **Deferred (GDD Phase 2/3):** the working private on-device tracker, a fuller Fact-or-Filter image bank,
  crown levels, Classroom-Mode polish, reduced-stimulation calm mode, and **Hindi**.
