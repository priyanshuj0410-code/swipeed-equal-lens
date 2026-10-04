---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/equal-partners.md
title: Equal Partners
description: The equal home for ages 22+, covering sharing the domestic and care load, the invisible mental load, dual-career fairness, and the move from "helping" to OWNING an equal share. The most unequal place in most lives is the home. Even-handed, engages men as equal owners, never shames any current arrangement; coercive control named as abuse and routed to help.
resource: https://swipeed.vercel.app/game/equal-partners
tags: [games, swipeed, gender-equality, domestic-load, mental-load, dual-career, ages-22-plus, adult-journey, chapter-7]
timestamp: 2026-06-24T01:10:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8449d339-a540-489c-88e3-61d3d670fdd4  # SWED-100
---

# Equal Partners

> **Built to GDD 55 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> **The third Chapter-7 node and the equal-home heart of the chapter:** the most unequal place in most lives is
> the home. A **468-scenario typed library** (`content/games/equal-partners.json`: see-the-load 76 ·
> helping-vs-owning 71 · share-it-fairly 78 · two-careers 79 · keep-it-equal 82 · tools-and-help 82), with seven play
> actions (branch ×89 · strike-rewrite ×83 · sort ×65 · reflect ×71 · role-play ×60 · match ×55 · spot ×45),
> **0% binary**, led by branch (your move) + strike-rewrite (bust the myth) + role-play (say it). **The signature
> move reframes a man's role from "helping" to OWNING an equal share**: the planning and remembering (the
> invisible *mental load*), not just the handed-out chores. Themes: **see the load** (surface the invisible mental
> & care work behind a running home); **helping vs owning** (the core reframe: a partner *owns*, doesn't *assist*);
> **share it fairly** (an explicit, fair split of chores, care & money-time); **two careers** (dual-career
> fairness: whose job "flexes" shouldn't default to gender); **keep it equal** (renegotiate as life changes);
> **tools & help**. **Everyone gains: an equal home is happier and healthier for both.** Even-handed, **engages men
> as equal owners, never anti-men, and never shames any current arrangement**, but where inequality tips into
> **coercive control** (over money, movement, or who you can see) it is **named as abuse, not a chore gap**, and
> routed to [Respect at Home](swipeed-game-patterns.md) (g56) and help (`reassureCats` [tools-and-help] +
> `reassure` + `helpLine` → **181, 1091, 112**). **gameId:** library, GDD and engine-host registry all agree on
> **`equal-partners`** (no trap). Engine: **no new mechanic and no `binStyle` change**. *Fair* / *Unfair default*,
> *Quietly fails*, and *Genuinely shared* are correctly coloured by existing tokens; the reframe and abstract
> fairness pairs (e.g. *Owning* / *Just helping*, *Toward equal* / *Keeps unequal*) are left neutral, their valence
> carried by the bin labels themselves. Emulation confirmed no mis-colours and no cross-game collisions (same
> conservative call as g53/g54). Spot ids injected (7); **two "see the load" spots carry two valid `trick:true`
> items** (both are mental-load: the engine's `SpotPlay` solves on tapping *any* trick, so multi-answer spots work
> as-is). New-node wiring: `g55 → equal-partners` in the gen-path `GAME` dict (+ 🧺 emoji), `path.ts` regenerated
> (61 built/playable), registered in `engine-host`. Read-first attested. **Builds on** [Equalize](equalize.md)
> (g26: fair shares, challenging norms); **sets up** Equal Parents (g62: the equal home, after kids).

**Node #g55: Chapter 7, ages 22+ (Building a Life).** *An equal home is built on purpose, and it's happier for
both.* Where [Choosing & Building](choosing-building.md) (g53) chooses the partnership and
[Your Path, Your Call](your-path-your-call.md) (g54) defends the freedom not to, this node tackles the daily
reality *inside* a shared home: the second shift and the invisible mental load that, in India, leaves women doing
roughly **2.6× more unpaid care than men even in dual-income homes**, often reinforced by in-laws and joint-family
expectations. Lensy returns as a grown peer who learned the difference between *helping* and *owning* the hard way.
**The lesson is the reframe: an equal partner doesn't "help out". They own an equal share, including the planning
and the remembering.**

> **Multi-step branches and role-plays ([SWED-100](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8449d339-a540-489c-88e3-61d3d670fdd4), 2026-09-30).** All 89 branches and 60 role-plays are now 3 to 5 questions on one situation (93 with 3, 49 with 4, 7 with 5; 510 questions), each with 4 or 5 options and one best, revealed at the end. After a write, review and fix pass, a final certification ran up to four rounds of three independent reviews (a blind best-option pick, a transition-by-transition audit, and a safety and fidelity review against the single-step source): round 1 found 70 blocking problems across all 149 stories, round 4 found 1 in the 15 it re-checked, and the 6 stories the last fix touched were read in full before shipping. Procedure: [multi-step rollout](../playbooks/multi-step-rollout.md).

## What it embodies

- **See the load (17)**: surface the *invisible* work: knowing what's needed and when, tracking, remembering,
  the emotional labour, not just the visible chores.
- **Helping vs owning (16)**: the core reframe: a partner who *owns* a domain (and its mental load) vs one who
  "helps" when asked; busts *"some people are just naturally better at running a home."*
- **Share it fairly (15)**: negotiate an explicit, fair split of chores, care and money-time; fairness is named,
  not assumed.
- **Two careers (12)**: dual-career fairness; whose job "flexes" for the home shouldn't default to gender.
- **Keep it equal (12)**: the ongoing conversation: renegotiate the split as jobs, health and kids change.
- **Tools & help (12)**: the practical tools to rebalance, and the line where inequality becomes coercive
  control. That's abuse, and help exists.

**Safeguarding & even-handedness.** The game **engages men as equal owners and never shames any current
arrangement**. It normalises that an unequal home is common and not a personal failing, and that naming and
renegotiating it is the work. The bright line: **when inequality becomes control (over money, movement, or who
you can see) that is abuse, not a chore gap**, and it is never the victim's fault; those beats reassure and route
to Respect at Home (g56) and help (181 / 1091 / 112).
