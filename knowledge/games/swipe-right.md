---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/swipe-right.md
title: Swipe Right? (Dating & Apps)
description: Modern dating & app safety for ages 18-22, covering realistic expectations, meeting safely, spotting catfishing & ghosting (UN & RE), dating with consent, and kindness on both sides of a no. Builds on flag-reading + online safety + adult consent.
resource: https://swipeed.vercel.app/game/swipe-right
tags: [games, swipeed, relationships, online-safety, ages-18-22, adult-journey]
timestamp: 2026-06-22T12:05:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/02455c6c-fb84-4cc8-a691-58156ea1a13d  # SWED-104
---

# Swipe Right? (Dating & Apps)

> **Reworked to GDD 45 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> The College dating node (Thread D · Relationships) **moved off the [ModesEngine](swipeed-game-patterns.md)
> onto the shared v2 mechanic engine**: a **503-scenario typed library** (`content/games/swipe-right.json`:
> dating-now 81 · meeting-safely 87 · fakes-and-ghosts 83 · date-with-respect 87 · profiles-are-people 80 ·
> tools-and-help 85) with seven play actions (branch ×88 · strike-rewrite ×75 · sort ×76 · reflect ×78 ·
> role-play ×62 · spot ×57 · match ×67), **0% binary**, led by branch + strike-rewrite + role-play. **Dating now
> runs on apps and DMs:** meet safely, spot the fakes, handle rejection both ways, and treat people like people,
> not profiles. **Practical safety, never fear-mongering:** meet in public, tell a trusted friend, your own way
> home, stay sober, trust your gut, **video-verify** before meeting. Verify AI-generated & catfish profiles (a
> **live video call** is the reliable check); be skeptical of fast love and money asks (**romance scams**);
> ghosting and leading-on isn't okay; rejection is survivable both ways. Profiles are people; consent and decency
> don't pause for apps (carried from g44/g31). Even-handed across genders and orientations. India: dating often
> hidden from family, so **tell a trusted friend even if not family**; image-based abuse/harassment routes to
> **cybercrime 1930 / cybercrime.gov.in**, 1098/181 (`reassureCats` [meeting-safely · fakes-and-ghosts ·
> tools-and-help] + `reassure` + helpLine). `gameId "swipe-right"` (matches registry). Engine: no new mechanic;
> `binStyle` added `disposable`/`draining`→red (rejected `real check`→green, which would mis-color
> [Smart Screen Heroes](smart-screen-heroes.md)'s "Not a real check"). Spot ids injected (8). Builds on
> [Green Light / Red Light](green-light-red-light.md) (g24), [Firewall](firewall.md) (g40) & [Consent, For Real](consent-for-real.md)
> (g44); precedes g46. The sections below describe the original ModesEngine v1 build, superseded by v2.

**Node #g45: Chapter 6 (College, ages 18-22).** Modern dating, real talk: meet safely, read people
honestly, and treat people kindly, including yourself. Carries [Green Light / Red Light](green-light-red-light.md)'s
flag-reading and [Firewall](firewall.md)'s online safety into adult dating, with
[Consent, For Real](consent-for-real.md) (#g44) underwriting respect.

## Overview
- **App:** [SwipeEd](swipeed.md) path · engine id `swipe-right`, route `/game/swipe-right` · the first game **built on the [ModesEngine](swipeed-game-patterns.md)** (config-only).
- **Type:** mode-based scenario game · no-fail · UNESCO 1.2, 4.3, 5.5 · 18-22.
- **Status:** live · https://swipeed.vercel.app/game/swipe-right

## How it works: five modes
1. **Dating Now**: realistic expectations vs the highlight-reel illusion (tap-reveal list).
2. **Meeting Safely**: first-meet safety: public place, tell a friend, your own transport, trust your gut.
3. **Fakes & Ghosts**: the **UN → RE** beat: catfishing/fake profiles ("they must be real"), and why ghosting/leading-on isn't okay either.
4. **Date with Respect**: pacing, consent in dating, and handling rejection kindly **both ways**.
5. **Tools & Ask-It**: meet-safe references + private Q&A with **report/help routing** (Cyber Crime 1930, Women Helpline 181, Emergency 112).

## Related
- [Reusable Game Patterns](swipeed-game-patterns.md) · [Consent, For Real](consent-for-real.md) · [Firewall](firewall.md) · [Games catalog](index.md)

## Multi-step stories ([SWED-104](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/02455c6c-fb84-4cc8-a691-58156ea1a13d), 2026-10-04)

All 88 branches and 62 role-plays are now 3 to 5 questions on one situation: 88 with 3, 56 with 4 and 6 with 5, 518 questions in all. Each question has 4 or 5 options and one best, revealed at the end. After a write, review and fix pass, a final certification ran up to four rounds of independent reviews: a blind best-option pick, a transition audit, and a safety and fidelity review. Round 1 found 162 blocking problems in this game. The stories the last fix changed were read in full before shipping. Every story with a safety or fidelity finding in any round, or naming a helpline, was read in full before shipping, and the owner reads the shipped stories on a [review page](https://claude.ai/artifact/See5aB5w4bfu98fxbgBoZq). Four lines were fixed by hand. Online threats now route to cybercrime 1930, with 181 for women, in the option, why, debrief and relearn. Procedure: [multi-step rollout](../playbooks/multi-step-rollout.md).
