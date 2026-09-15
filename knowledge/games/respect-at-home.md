---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/respect-at-home.md
title: Respect at Home
description: Consent and mutual respect inside marriage for ages 22+, the chapter's highest-safeguarding node. Marriage doesn't cancel consent; love is never control. Recognising the forms of domestic abuse and coercive control, safety-planning basics, and where to get help. Survivor-centred, never victim-blaming, even-handed across genders, strictly non-graphic; DV Act 2005 civil framing; urgent routing 181/1091/112.
resource: https://swipeed.vercel.app/game/respect-at-home
tags: [games, swipeed, consent, domestic-violence, safeguarding, coercive-control, ages-22-plus, adult-journey, chapter-7]
timestamp: 2026-06-24T01:20:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
---

# Respect at Home

> **Built to GDD 56 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> **The fourth Chapter-7 node and the chapter's highest-safeguarding node: its protective backbone.** It carries
> the **consent thread into marriage and committed partnership: the place consent is most often assumed away.**
> *Marriage doesn't cancel consent, and love is never control.* A **518-scenario typed library**
> (`content/games/respect-at-home.ts`: respect-daily 83 · consent-inside 82 · spot-abuse-control 92 ·
> safety-and-help 86 · never-your-fault 89 · tools-and-help 86), with seven play actions (branch ×86 · strike-rewrite
> ×92 · sort ×69 · reflect ×76 · role-play ×68 · match ×67 · spot ×60), **0% binary**, led by strike-rewrite (bust
> the myth) + branch (your move) + role-play (say it). Five modes: **respect daily** (mutual respect & an equal
> voice); **consent inside** (married is **not** standing consent: your yes is still yours every time; UN&RE);
> **spot abuse & control** (the forms of domestic abuse: emotional, financial, sexual, physical, and coercive
> control; *it's never love*); **safety & help** (recognising danger, safety-planning basics, where to get help,
> **no blame**); **never your fault**; **tools & help**. **HIGH-STAKES and survivor-centred throughout: never
> victim-blaming** (*abuse is always the perpetrator's responsibility*) with urgent disclosure routing
> (`reassureCats` [spot-abuse-control · safety-and-help · never-your-fault] + `reassure` + `helpLine` → **181,
> 1091, 112**), **even-handed across genders** (men and others can be victims and are *especially silenced*), and
> **strictly non-graphic**. Protections are framed around India's **Protection of Women from Domestic Violence Act
> 2005** (covering physical, emotional, sexual and economic abuse; protection orders & maintenance); the
> **marital-consent *criminal*-law landscape is flagged as contested and evolving** (a live, dated topic). The
> game is **educational, not legal advice**, and safety-planning is handled with care because **risk can rise at
> the point of leaving.** **gameId:** library, GDD and engine-host registry all agree on **`respect-at-home`** (no
> trap). Engine: **no new mechanic and no `binStyle` change**. Verbatim-engine emulation over all 13 sort pairs
> found **no mis-colours**: the clearest safety pairs are correctly coloured (*Respects consent* / *Ignores it*,
> *Safety plan* / *Not safe*, *Supportive* / *Harmful*, *Respects autonomy* / *Violates it*), and the rest fall
> neutral with valence carried by the labels. Adding `abuse`/`control` as global red tokens was rejected as unsafe
> - *control* has positive senses (self-control), and an `abuse`→red token would wrongly red the *"Not abuse"*
> safe side (the safe-negation guard doesn't cover it). Spot ids injected (7); **three spots carry multiple valid
> `trick:true` items** (the engine's `SpotPlay` solves on tapping *any* trick). New-node wiring: `g56 →
> respect-at-home` in the gen-path `GAME` dict (+ 🏠 emoji), `path.ts` regenerated (62 built/playable), registered
> in `engine-host`. Read-first attested. **Builds on** [Mutual](mutual.md) (g31) and
> [Consent, For Real](consent-for-real.md) (g44): the consent spine, now inside marriage; **[Equal Partners](equal-partners.md)
> (g55) routes coercive control here.**

**Node #g56: Chapter 7, ages 22+ (Building a Life).** *Marriage doesn't cancel consent, and love is never
control.* This is the **adult, married step of the consent spine**: the bodily autonomy of
[My Body, My Rules](my-body-my-rules.md) (#2) → the boundaries of [Boundary Bot](boundary-bot.md) (#15) → the
flag-reading of [Green Light / Red Light](green-light-red-light.md) (#24) → the intimate consent of
[Mutual](mutual.md) (#31) → adult-life consent in [Consent, For Real](consent-for-real.md) (#44), now carried into
the one relationship where society most often assumes consent away. Lensy returns as a steady, level-headed adult
peer. **The whole node is built around one truth: a person's worth, safety and yes do not dissolve in a marriage,
and when respect curdles into control, that is abuse, never love, and never the victim's fault.**

## What it embodies

- **Respect daily (13)**: mutual respect and an equal voice in the everyday of a shared life.
- **Consent inside (13)**: **married is not standing consent**; a yes is freely given each time and can be
  withdrawn; busts the "you owe it / it's a duty" myths (UN&RE).
- **Spot abuse & control (17)**: name the forms: emotional, financial, sexual and physical abuse, and **coercive
  control** (isolation, monitoring, money control); *it's never love*.
- **Safety & help (14)**: recognise danger, safety-planning basics, and discreet, free help routes even with
  little money or privacy, **no blame, ever**.
- **Never your fault (14)**: responsibility lies **only** with the person choosing to harm; anyone, of any
  gender, can be hurt this way, and is not alone.
- **Tools & help (13)**: real sources of support (181, legal aid, a trusted person) vs the false hopes
  (bottling up, waiting for the abuser to change).

**Safeguarding (the strongest in Chapter 7).** Survivor-centred and never victim-blaming; even-handed (men and
LGBTQ+ survivors are especially silenced); strictly non-graphic; **DV Act 2005** civil framing with urgent routing
to **181 / 1091 / 112**. It deliberately does **not** make criminal-law claims about marital consent (contested
and evolving). It is educational, not legal advice, and treats safety-planning with the care the topic demands,
flagging that **risk can rise at the point of leaving.**
