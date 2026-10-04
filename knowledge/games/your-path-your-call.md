---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/your-path-your-call.md
title: Your Path, Your Call
description: Life-path autonomy for ages 22+. Marriage and children are one valid path, not the measure of a life or a verdict on worth. The freedom to marry or not, to have children or not; busting the "still unmarried?" / "when are you having kids?" stigma (heaviest on women); holding your ground with family kindly but firmly; worth beyond marital status, looks and the marriage market. No pressure in any direction; every path dignified; never shames those who do marry. Coercion/forced marriage routed to help.
resource: https://swipeed.vercel.app/game/your-path-your-call
tags: [games, swipeed, autonomy, marriage, childfree, gender-equality, ages-22-plus, adult-journey, chapter-7]
timestamp: 2026-06-24T01:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8449d339-a540-489c-88e3-61d3d670fdd4  # SWED-100
---

# Your Path, Your Call

> **Built to GDD 54 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> **The second Chapter-7 node and the deliberate counterpoint to [Choosing & Building](choosing-building.md) (g53)
> - the equity heart of the chapter:** g53 says "if you build a partnership, build it well and equal"; g54 says
> **marriage and children are *one* valid path, not the measure of a life or a verdict on your worth.** A
> **456-scenario typed library** (`content/games/your-path-your-call.json`: script-and-choice 76 · not-marrying 42 ·
> childfree-complete 82 · hold-your-ground 85 · worth-beyond-status 82 · tools-and-reflection 89), with seven play
> actions (branch ×86 · strike-rewrite ×75 · sort ×57 · reflect ×65 · role-play ×64 · match ×57 · spot ×52),
> **0% binary**, led by strike-rewrite (bust the stigma) + branch (your call) + role-play (hold your ground). Five
> themes: **the script & the choice** (autonomy over whether, when and whom you marry, and whether you have
> children); **not marrying** (a full life needs no marriage; busts the *"still unmarried?"* worth-questioning
> stigma; UN&RE); **childfree, complete** (the freedom not to have children: womanhood is not motherhood);
> **hold your ground** (handle family & social pressure kindly but firmly, without starting a family war); **worth
> beyond status** (your value is never your marital state, your looks, or the marriage market, including
> colourism). **No pressure in any direction; every path is dignified, and the game never shames those who *do*
> marry or have children (including early); it is even-handed**: men feel a version of the "settle down" pressure
> too, though it falls hardest on women. Distress from family conflict or coercion is routed to support, and
> **forced marriage, never acceptable, to help** (`reassureCats` [hold-your-ground · worth-beyond-status] +
> `reassure` + `helpLine` → **181, 1091, 112, Childline 1098**). India: the marriage timeline, *"log kya kahenge"*,
> and the worth-questioning stigma that falls sharpest on women. **gameId:** library, GDD and engine-host registry
> all agree on **`your-path-your-call`** (no trap). Engine: **no new mechanic and no `binStyle` change**. 8 of 13
> sort pairs are correctly coloured by existing tokens (e.g. *Respects* → green / *Pressures* → red, *True* /
> *Stigma myth*, *Kind & true* / *Imposed shame*); the other 5 are abstract worth-framing pairs (*Holds your
> ground* / *Loses you*, *Worth that lasts* / *World can take it*, *Stands for* / *Stands against*) left neutral:
> emulation confirmed no mis-colours and no cross-game collisions, the same conservative call as g53. Spot ids
> injected (7). New-node wiring: `g54 → your-path-your-call` in the gen-path `GAME` dict (+ 🛤️ emoji), `path.ts`
> regenerated (60 built/playable), registered in `engine-host`. Read-first attested. **Builds on**
> [Equal & Confident](equal-confident.md) (g50: voice & worth) and [Equalize](equalize.md) (g26: fair shares,
> challenging norms); **the counterpoint to** [Choosing & Building](choosing-building.md) (g53).

**Node #g54: Chapter 7, ages 22+ (Building a Life).** *Marriage and kids are one path, not the measure of a
life.* Where [Choosing & Building](choosing-building.md) equips the person who chooses partnership, this node
protects the person's **autonomy over whether to walk that path at all**, and dismantles the social machinery
(the marriage clock, the "log kya kahenge", the worth-questioning of unmarried and childfree adults, the
marriage-market scrutiny and colourism) that treats a wedding or a baby as a verdict on a life. Lensy returns as a
grown peer who has felt the pressure and chosen on their own terms. **The stigma is about social control, not
truth: a person's worth is never their marital status, and womanhood is not motherhood.**

> **Multi-step branches and role-plays ([SWED-100](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8449d339-a540-489c-88e3-61d3d670fdd4), 2026-09-30).** All 86 branches and 64 role-plays are now 3 to 5 questions on one situation (93 with 3, 49 with 4, 8 with 5; 515 questions), each with 4 or 5 options and one best, revealed at the end. After a write, review and fix pass, a final certification ran up to four rounds of three independent reviews (a blind best-option pick, a transition-by-transition audit, and a safety and fidelity review against the single-step source): round 1 found 55 blocking problems across all 150 stories, round 4 found 3 in the 23 it re-checked, and the 13 stories the last fix touched were read in full before shipping. Two stories that repeated each other's closing exchange (yp-051 and yp-1222) were made distinct by hand. Procedure: [multi-step rollout](../playbooks/multi-step-rollout.md).

## What it embodies

- **The script & the choice (14)**: the default "marry, then have biological children" script is *one* valid
  path among many; people hold real autonomy over whether, when and whom to marry and whether to have children.
- **Not marrying (14)**: a full, dignified life needs no marriage; busts *"still unmarried?"* and the idea that
  worth declines with age while single (UN&RE).
- **Childfree, complete (14)**: the freedom not to have children; **womanhood isn't motherhood**; a life without
  kids is whole, not lacking.
- **Hold your ground (14)**: meet family and social pressure **kindly but firmly**, separating love for family
  from obedience, without losing yourself or starting a family war.
- **Worth beyond status (15)**: your value is never your marital state, your looks, or the marriage market;
  resists colourism and looks-scrutiny.
- **Tools & reflection (13)**: the questions to ask yourself, and where to turn when pressure becomes coercion.

**Safeguarding & even-handedness.** The node applies **no pressure in any direction** and **never shames those
who do marry or have children, including early**. Every path is dignified. It is even-handed (men feel a version
of the "settle down" pressure too, though it lands hardest on women). The bright line is unchanged from g53: **any
version of "you have no choice" is coercion, not tradition**. Those beats reassure the player and route to help,
and forced/under-age marriage is sent to Childline 1098.
