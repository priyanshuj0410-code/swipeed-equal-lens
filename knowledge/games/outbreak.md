---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/outbreak.md
title: "Outbreak: Stop the Spread"
description: A containment-strategy sim for ages 12-15 - stop an outbreak with knowledge not fear. Deploy layered prevention, bust the transmission myths that fuel stigma (UN & RE), build a Defense Kit, normalise testing/treatment (U=U), and end the stigma. Anti-stigma core; condom depth School-Comfort-gated; no punitive fail.
resource: https://swipeed.vercel.app/game/outbreak
tags: [games, swipeed, srh, sti, hiv, anti-stigma, ages-12-15]
timestamp: 2026-06-20T19:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
---

# Outbreak: Stop the Spread

> **Reworked to GDD 23 v2 - the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)
> and the build bible). The STI + HIV public-health + anti-stigma node (Thread F · SRH) is now a **522-scenario
> typed library** (`content/games/outbreak.ts`: how-stis-spread 92 · silent-part 75 · stop-the-spread 92 ·
> test-and-treat 85 · bust-myths 92 · end-stigma 86), generated **faithfully** from the scorecard-passed GDD 23
> JSON, on the **shared v2 engine** (`components/games/v2-engine.tsx`). The old containment-sim build is replaced
> by **seven typed play actions** (branch ×106 · strike-rewrite ×98 · sort ×84 · reflect ×71 · match ×50 ·
> role-play ×60 · build ×53), **0% binary tap**, led by **branch** (make the public-health move), **strike-rewrite**
> (bust the STI myth) and **sort** (real route vs myth). Arc: how STIs spread (and don't) → **the silent part** →
> stop the spread (the toolkit) → testing & treatment → bust the STI myths → **end the stigma**. How STIs spread
> (sexual contact, blood, parent-to-baby) and DON'T (casual contact); many are **silent** so testing is the only
> way to know; the real toolkit (waiting - fully reliable; condoms; vaccines incl. the **HPV vaccine, free for
> 14-year-old girls in India**; testing; treatment); all STIs treatable, most curable; **stigma is the real
> harm** - care, not shame (`reassure` + `reassureCats` ["end-stigma"]). School-comfort, **NON-EXPLICIT**; routes
> to a **clinic / doctor** for testing & facts (confidential). **GATED** at the path layer (age band), untouched
> by the swap. **gameId trap:** library/GDD aspirational id is `outbreak-stop-the-spread` but the engine-host
> registry id is `outbreak` - config uses `outbreak`. Engine: **no new mechanic** (reuses 7 of 9); the `binStyle`
> anti-stigma guardrail holds - **every STI transmission-fact bin** (can-spread/does-not, real-route/safe-everyday,
> worth-protecting/no-risk, "spreads it") stays **neutral**; only myth/false, reliability, and **stigma-behavior**
> (reduces/spreads stigma, kind/stigmatising) are valenced (regression-checked against [Defenders of the
> Body](defenders-of-the-body.md)). Builds on g20; prereq g22. The sections below describe the original v1 build,
> superseded by the v2 mechanic engine.

**Node #23 - the SRH infection step of Chapter 4** (ages 12-15). *Stop the outbreak with knowledge, not
fear - and the real enemy is **stigma**, never the people who have an infection.* It picks up the condoms
introduced in [Plan It](plan-it.md) (#22) and the body's-defences idea from
[Defenders of the Body](defenders-of-the-body.md) (#20), turning both toward infection, and extends the
media scepticism of [Flip the Script](flip-the-script.md) (#17) onto **health misinformation**.
Knowledge-not-fear, compassion-not-shame; **testing and treatment are normalised** (**U=U**); condom
depth is set by the School-Comfort toggle.

## Overview
- **App:** a game on the [SwipeEd](swipeed.md) path · engine id `outbreak`, route `/game/outbreak`.
- **Type:** reading-light **containment-strategy sim** · no punitive fail · Q&A private; School-Comfort sets condom depth.
- **Age band:** 12-15 · **Curriculum:** UNESCO 8.2 (STI/HIV risk), 8.3 (HIV stigma, treatment & care). Builds on #20, #22; links to #24/#29/#30.
- **Status:** live · https://swipeed.vercel.app/game/outbreak

## How it works - five modes + the Badge Book
1. **Outbreak!** - the signature **strategy sim**: bring a spreading outbreak's **Spread meter** to zero by
   deploying **education, condoms, testing, treatment and the HPV vaccine** - *the tools stack*.
2. **How It Spreads (& How It Doesn't)** - the **UN & RE** myth-bust: infections spread by **specific
   routes, NOT casual contact** ("catch HIV from a hug", "mosquitoes/toilet seats", "tell by looking",
   boss: "only certain kinds of people get STIs") - *busting the myths that fuel stigma.*
3. **Your Defense Kit** - layered prevention that **stacks**: delaying (respected), the HPV vaccine,
   regular testing; **condoms** added when School-Comfort is off.
4. **Test, Treat, Live Well** - fear removed: testing is normal and smart; HIV is manageable; **U=U
   (undetectable = untransmittable)**; many STIs are completely curable.
5. **End the Stigma + Ask Anything** - the heart: a **UN & RE** stigma beat (*"people with an infection
   are dangerous/shameful"* → *"they deserve the same dignity and support as anyone; ending stigma is how
   we stop the spread"*), an **anti-stigma pledge**, and where to get tested/help (**NACO ICTC**, an RKSK
   clinic, a doctor, a trusted adult, **Childline 1098**).

A 5-badge **Badge Book** finishes into the shared [`GameDone`](swipeed.md) card. Lensy returns in the teen
look, calm and compassionate. Reuses the shared **`UnReBeat`** + the voice model.

## Inherited patterns
[Reusable patterns](swipeed-game-patterns.md): no-fail (#4 - no punitive fail), content-as-data (#1),
shared juice (#11), audio contract (#10), **myth-bust-by-choosing-the-truth (#19)**,
**empower-never-frighten (#16)** (knowledge-not-fear; testing/treatment normalised; U=U),
**don't-villainise (#15)** applied to people with infections (compassion-not-shame), the **Ask-It /
safe-helper box (#18)**, and **Made-for-India + School-Comfort (#14)** (NACO ICTC; condom depth gated).

## Status & roadmap
- **Built:** the Outbreak! deploy-to-contain sim (Spread meter), How It Spreads UN & RE myth-bust (incl. a
  boss), the layered Defense Kit (condoms School-Comfort-gated), Test/Treat/Live Well (U=U), End the Stigma
  (UN & RE + pledge + the ICTC/Childline help line); the Badge Book; English narration.
- **Deferred (GDD Phase 2/3):** a richer population-spread simulation, crown levels, a fuller myth/fact
  bank, Classroom-Mode polish, calm mode, and **Hindi**.
