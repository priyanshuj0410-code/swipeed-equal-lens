---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/choosing-building.md
title: Choosing & Building
description: Choosing a life partner and building a relationship for ages 22 → first child - values over sparks, what it actually takes (communication, trust, repair), eyes-open commitment, love and arranged marriage as two paths to the same skills, and starting a partnership equal from day one. Every path respected, including not marrying; consent always; forced/coerced marriage routed to help.
resource: https://swipeed.vercel.app/game/choosing-building
tags: [games, swipeed, relationships, marriage, consent, ages-22-plus, adult-journey, chapter-7]
timestamp: 2026-09-15T00:00:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f9b2ee4c-8681-47c0-bc98-fa7fefd55543  # SWED-70
---

# Choosing & Building

> **Built to GDD 53 v2 - the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> **The opener of Chapter 7 (Building a Life, 22 → first child) and the first genuinely-new node built after the
> Ch.1-6 retrofit** - authored v2-native (no v1 to supersede), on the shared
> [v2 mechanic engine](swipeed-game-patterns.md), same standard as the rest of the path. A **498-scenario typed
> library** (`content/games/choosing-building.ts`: choosing-well 76 · what-it-takes 86 · love-and-arranged 78 ·
> commitment-clearly 91 · starting-strong 85 · tools-and-help 82) - seven play actions (branch ×90 ·
> strike-rewrite ×79 · sort ×70 · reflect ×67 · role-play ×62 · match ×69 · spot ×61), **0% binary**, led by branch
> (your move) + strike-rewrite (bust the myth) + sort (sort the signal). **Turns the story from "me" to "us":**
> choosing a partner on **values, not sparks**; what a relationship actually takes (communication, trust, repair -
> build *us* without erasing *me*); **eyes-open commitment** (a choice, not pressure or a fix - busts *"marriage
> will fix me / complete me / settle me down"*); **love and arranged marriage as two paths to the same skills**,
> consent always, family respected but the **couple's own judgement leads**; and **starting a partnership equal
> from day one** (names, money, chores, in-laws, careers - set the pattern early). **Every path is respected,
> including choosing not to marry or to wait.** Even-handed across genders; **forced or coerced marriage is never
> reframed as choice** - routed to help (`reassureCats` [commitment-clearly · love-and-arranged] + `reassure` +
> `helpLine` → **181, 1091, 112**, and **Childline 1098** for under-18 / forced-marriage situations). India:
> the timeline pressure ("*log kya kahenge*", the marriage clock), in-laws and joint-family reality, arranged
> introductions and family WhatsApp groups - grounded without judging the tradition. **gameId:** library, GDD and
> engine-host registry all agree on **`choosing-building`** (no trap). Engine: **no new mechanic and no `binStyle`
> change** - its good/bad bins are already covered, and its judgement-pair bins (e.g. *green flag / worth a talk*)
> are correctly left neutral. Spot ids injected (7). New-node wiring: `g53 → choosing-building` added to the
> gen-path `GAME` dict + `EMOJI` 💍, `path.ts` regenerated (59 built/playable), registered in `engine-host`.
> Read-first attested. **Builds on** [Real Relationships](real-relationships.md) (g46 - repair, the Four
> Horsemen) and [Mutual](mutual.md) (g31 - consent); **sets up** Equal Partners (g55) and The Family Map (g57).

**Node #g53 - the Chapter 7 opener (Building a Life, ages 22 → first child).** *Choose with your eyes open, and
build something equal from day one.* The first step of the adult **partnership** arc: after the self-standing
adult of Chapter 6 ([Standing on My Own](capstones.md)) learns to live independently, Chapter 7 asks the harder
question - **how do two whole people choose each other and build a shared life without either disappearing into
it?** Lensy returns as a grown peer who has been through the choosing. **A relationship is something you build, not
something that fixes you; commitment is a clear-eyed choice between equals; and whether the introduction comes
from an app, a friend, or your family, the skills - and the consent - are the same.**

## What it embodies

- **Choosing well (17)** - values, character and how someone treats people over chemistry and checklists; sort
  green flags from "worth a real talk"; the *"opposites/sparks will sort themselves out"* myth.
- **What it takes (15)** - communication, trust, and **repair after conflict** (the [Four Horsemen](real-relationships.md)
  carried forward); building *us* without erasing *me*; interdependence, not dependence.
- **Commitment, clearly (13)** - commitment as a chosen, eyes-open *yes*, never a fix or a rescue; busts
  *"marriage will fix me / complete me / settle me down"* and the sunk-cost *"we've come this far"*.
- **Love & arranged (15)** - both paths treated as legitimate routes to the same skills; **consent always**,
  the right to say no respected, family honoured but the **couple's judgement leads**; forced ≠ arranged.
- **Starting strong (12)** - set the pattern on day one: names, money, chores, in-laws, two careers - equality
  is built early or fought for later.
- **Tools & help (12)** - the conversations to have *before* committing, and where to turn when a "match"
  becomes pressure (181 / 1091 / 112; Childline 1098).

**Myth cards (2026-09-15, [SWED-70](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/f9b2ee4c-8681-47c0-bc98-fa7fefd55543)).** The first game with `mythCards` on, as the pilot for the
[playtest feedback plan](../playbooks/playtest-feedback-plan-2026-09-15.md): about half of its 79 strike-rewrite
beats play as a swipe card (Myth or True) instead of a scrub. Two truths that only made sense after their myth were
reworded to stand alone: cb-032 ("Love and arranged marriages need the same foundations...") and cb-041 ("Early
talks about money, roles and expectations are how you start strong...").

**Safeguarding.** The game celebrates marriage as one good choice among several and **never pressures toward
it** - staying single, waiting, or leaving a bad match are all framed as strong, valid choices. The bright line:
**any version of "you have no choice" is coercion, not tradition** - those scenarios reassure the player and route
to help, and forced/under-age marriage is sent to Childline 1098.
