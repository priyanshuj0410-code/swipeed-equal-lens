---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/family-map.md
title: The Family Map
description: In-laws and extended/joint family for ages 22+ - in India you don't just marry a person, you join a family. Mapping the web and your new place in it, setting kind boundaries that protect the couple without rejecting anyone, standing as a couple-team, respect that flows both ways, and recognising when in-law dynamics (dowry, coercive control) turn harmful. Even-handed and warm; never "cut them off" as a default.
resource: https://swipeed.vercel.app/game/family-map
tags: [games, swipeed, family, in-laws, joint-family, boundaries, dowry, ages-22-plus, adult-journey, chapter-7]
timestamp: 2026-06-24T01:30:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
---

# The Family Map

> **Built to GDD 57 v2 - the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> **The fifth Chapter-7 node and the full-circle callback to [My Family Garden](my-family-garden.md) (g03):** the
> child who learned that families come in many shapes is now the adult who, *in India, doesn't just marry a person
> - they join a family* (and so does their partner). A **447-scenario typed library**
> (`content/games/family-map.ts`: web-you-join 74 · kind-boundaries 77 · couple-team 74 · respect-both-ways 74 ·
> when-it-turns-harmful 77 · tools-and-help 71) - seven play actions (strike-rewrite ×88 · branch ×84 · reflect
> ×59 · sort ×58 · match ×56 · spot ×52 · role-play ×50), **0% binary**, led by branch (your move) + strike-rewrite
> (bust the myth) + sort. Six modes: **the web you join** (map the extended family and your new place - both
> partners join each other's families); **kind boundaries** (respectful limits that protect the couple *without*
> rejecting anyone; busts *"family always knows best" / "interference is love" / "a good bahu never says no"*);
> **couple as a team** (the couple is the primary team - a united, kind front; refuse triangulation; decide
> together, then face family as one); **respect both ways** (honour elders & culture while keeping your own voice -
> **respect is not obedience, and it flows both ways**); **when it turns harmful** (**dowry is illegal under the
> Dowry Prohibition Act 1961**; coercive in-law control, threats and dowry harassment are **abuse, not friction**);
> **tools & help**. **Even-handed and warm; never "cut them off" as a default** - it honours the value India places
> on family while equipping couples to set kind limits. Where dynamics become abusive it routes to
> [Respect at Home](respect-at-home.md) (g56) and help (`reassureCats` [when-it-turns-harmful] + `reassure` +
> `helpLine` → **181, 112, a counsellor**); it links [Equal Partners](equal-partners.md) (g55) for the load.
> **gameId:** library, GDD and engine-host registry all agree on **`family-map`** (no trap). Engine: **no new
> mechanic and no `binStyle` change** - verbatim-engine emulation over all 11 sort pairs found no mis-colours
> (*Healthy boundary* / *Unkindly shutting out*, *Unfair expectation*, *Undermines the couple*, *Red flag, get
> help* coloured by existing tokens; the rest neutral, valence in the labels). Spot ids injected (8); one spot
> (fm-060) carries multiple valid `trick:true` items (engine solves on any). New-node wiring: `g57 → family-map` in
> the gen-path `GAME` dict (+ 🗺️ emoji), `path.ts` regenerated (63 built/playable), registered in `engine-host`.
> Read-first attested. **Builds on** [My Family Garden](my-family-garden.md) (g03); links g55 and g56.

**Node #g57 - Chapter 7, ages 22+ (Building a Life).** *You don't just marry a person - you join a family, and so
does your partner.* This closes a loop opened at the very start of the journey: [My Family Garden](my-family-garden.md)
(#3) taught the small child that families come in many loving shapes; now the adult navigates the **web of in-laws
and extended/joint family** that, in India, is central to married life and a leading source of marital strain.
Lensy returns as a warm, grown peer. **The spine of the node: the two of you are the primary team - decide together,
then face family as one - and kind boundaries protect the couple without rejecting anyone.**

## What it embodies

- **The web you join (14)** - map the extended family and your new place in it; *both* partners join each other's
  families (sons-in-law adjust too, though expectations fall heaviest on the daughter-in-law).
- **Kind boundaries (14)** - respectful limits that protect the couple without rejecting anyone; busts *"family
  always knows best," "interference is love,"* and *"a good bahu never says no."*
- **Couple as a team (14)** - the couple is the primary team; a united, kind front; refuse triangulation; decide
  together, then face family as one.
- **Respect both ways (14)** - honour elders and culture while keeping your own voice; **respect is not obedience,
  and it flows both ways.**
- **When it turns harmful (14)** - **dowry is illegal** (Dowry Prohibition Act 1961); coercive in-law control,
  threats and dowry harassment are abuse, not friction - route to Respect at Home (g56) and help.
- **Tools & help (14)** - the couple check-in, the warm "no," the repeatable team line, and the help routes.

**Safeguarding.** Warm and even-handed, the game **never makes "cut them off" the default** - it normalises that
ordinary in-law friction is workable. The bright line: **coercive control, threats, or any dowry demand is abuse,
not friction** - never the victim's fault, dowry is illegal, and those beats route to 181 / 112, a counsellor, and
Respect at Home (g56).
