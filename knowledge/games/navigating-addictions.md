---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/navigating-addictions.md
title: Navigating Addictions
description: Recognising and responding (without shame) to a child's substance, screen or gaming dependence, for parents. Getting help early, modelling healthy habits. Shame and punishment drive addiction underground; calm, connection and the right help bring it into the light. Dependence is a treatable health condition, not weak willpower or a moral failing. High-care and firmly non-shaming of both child and parent; never any how-to for substances; acute risk is an emergency; not medical advice.
resource: https://swipeed.vercel.app/game/navigating-addictions
tags: [games, swipeed, parenting, addiction, substance-use, screen-time, mental-health, chapter-8, safeguarding]
timestamp: 2026-06-24T04:15:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/495e4449-492b-44bc-9f8f-ef896a79e330  # SWED-102
---

# Navigating Addictions

> **Built to GDD 68 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> **The eighth Chapter-8 node: a high-care Parent-Layer pillar.** *The core insight: **shame and punishment drive
> addiction underground, while calm, connection and the right help bring it into the light.*** A **435-scenario
> typed library** (`content/games/navigating-addictions.ts`: spot-the-signs 74 · respond-dont-rupture 74 ·
> its-a-health-issue 72 · get-the-right-help 66 · screens-and-modelling 74 · tools-and-safety 75), with seven play
> actions (strike-rewrite ×70 · branch ×68 · role-play ×71 · sort ×64 · match ×52 · reflect ×56 · spot ×54),
> **0% binary**, led by strike-rewrite (bust the myth) + branch (your move) + role-play (say it). Six modes: **spot
> the signs** (warning signs of substance and screen/gaming dependence, typical vs concerning, **calm noticing not
> panic or snooping**; gaming disorder is a recognised condition); **respond, don't rupture** (busts *"crack down /
> it's just willpower / good kids don't / shame will scare them straight"*; **connection over control &
> surveillance**; firm about the behaviour and **unconditionally there for the child**); **it's a health issue**
> (dependence is a treatable health condition involving brain, genes & environment, **not weak willpower or a
> moral failing**; treatment works and recovery is real); **get the right help** (counselling & de-addiction
> services *early*; **family involvement strongly improves outcomes**; routes to **Tele-MANAS 14416** and
> **Childline 1098**); **screens and modelling** (calm agreed screen limits the *whole family* keeps, healthy
> outlets, honestly tending your **own** substance & screen habits); **tools and safety** (a signs-and-help-finder
> & calm-response plan; **any acute risk such as a possible overdose or danger is an emergency: route immediately
> to 112 or a hospital**). **High-care and firmly non-shaming of both child *and* parent; frames dependence as
> health, not moral failure; never provides any how-to for obtaining or using substances; treats acute risk as an
> emergency; and is not medical advice, points to professionals** (`reassureCats` [respond-dont-rupture ·
> its-a-health-issue · get-the-right-help] + `reassure` + `helpLine`). **gameId:** library, GDD and engine-host
> registry all agree on **`navigating-addictions`** (no trap). Engine: **no new mechanic and no `binStyle` change**
> - verbatim, pair-aware `binStyles` emulation found no visible mis-colours (*"Keeps it open"* greens correctly as
> a good bin via the `keep` token; *Helpful fact* / *Helps manage it* / *Healthy boundary* / *Models healthy* green;
> *Harmful stigma* / *Fuels dependence* / *Risky gap* red; the rest neutral). Spot ids injected (9). New-node
> wiring: `g68 → navigating-addictions` in the gen-path `GAME` dict (+ 🎮 emoji), `path.ts` regenerated (75
> built/playable), registered in `engine-host`. Read-first attested. **Builds on** [Bounce](bounce.md) (g39) and
> connects to the screen-literacy thread: [Reality Check](reality-check.md) (g28) and [Decoded](decoded.md) (g36).

**Node #g68: Chapter 8, Parent Layer (positive parenting).** *Shame drives it underground; connection brings it
into the light.* The parent-side companion to the teen screen-literacy and resilience nodes: where
[Bounce](bounce.md) (#g39) built coping and [Reality Check](reality-check.md)/[Decoded](decoded.md) read the
screen, g68 helps a parent meet a child's substance, screen or gaming dependence the way the evidence says works:
calm, connected, and early. Lensy returns with the same warmth and the firm line that **the behaviour is addressed,
but the child is never abandoned**. **The spine: notice calmly (not by snooping); respond without rupturing the
relationship; treat dependence as a health condition, not a moral failing; get the right help early; model healthy
habits yourself; and treat any acute danger as the emergency it is.**

> **Multi-step branches and role-plays ([SWED-102](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/495e4449-492b-44bc-9f8f-ef896a79e330), 2026-09-30).** All 68 branches and 71 role-plays are now 3 to 5 questions on one situation (82 with 3, 51 with 4, 6 with 5; 480 questions), each with 4 or 5 options and one best, revealed at the end. After a write, review and fix pass, a final certification ran up to four rounds of three independent reviews (a blind best-option pick, a transition-by-transition audit, and a safety and fidelity review against the single-step source): round 1 found 114 blocking problems across all 139 stories, round 4 found 1 in the 12 it re-checked, and the 3 stories the last fix touched were read in full before shipping. Every story with a safety finding in any round or naming a helpline was also read in full before shipping, and the owner reads the shipped stories on a [review page](https://claude.ai/artifact/C9kGk6P1p5t9xHHZGXm3o6). Procedure: [multi-step rollout](../playbooks/multi-step-rollout.md).

## What it embodies

- **Spot the signs (14)**: warning signs of substance and screen/gaming dependence; typical vs concerning; **calm
  noticing, not panic or snooping**; gaming disorder is a recognised condition.
- **Respond, don't rupture (14)**: busts *"crack down / it's just willpower / good kids don't / shame will scare
  them straight"*; **connection over control & surveillance**; firm about the behaviour, unconditionally there for
  the child.
- **It's a health issue (14)**: dependence is a treatable health condition (brain, genes, environment), **not
  weak willpower or a moral failing**; treatment works and recovery is real.
- **Get the right help (14)**: counselling & de-addiction services *early*; family involvement strongly improves
  outcomes; **Tele-MANAS 14416, Childline 1098**.
- **Screens and modelling (14)**: calm agreed screen limits the whole family keeps, healthy outlets, and honestly
  tending your **own** substance & screen habits.
- **Tools and safety (14)**: a signs-and-help-finder and calm-response plan; **any acute risk (a possible
  overdose, danger) is an emergency: 112 or a hospital now**.

**Safeguarding (high-care).** Firmly non-shaming of **both child and parent**; frames dependence as health, not
moral failure; **never provides any how-to for obtaining or using substances**; treats acute risk as an emergency
(112 / a hospital); and is **not medical advice**. It points to professionals. India: youth substance use and
screen/gaming dependence are both rising while stigma and harsh punitive responses are common, exactly what drives
the problem deeper, so the node de-stigmatises and signposts real help (counselling, de-addiction centres,
Tele-MANAS 14416, Childline 1098).
