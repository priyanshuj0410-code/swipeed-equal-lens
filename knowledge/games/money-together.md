---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/money-together.md
title: Money, Together
description: "Work and money in partnership for ages 22+, covering joint finances and planning, financial independence within a partnership, and financial control as abuse. Two incomes, one life: the money talk, joint and personal accounts, keeping your own footing, fair-not-gendered money roles, and economic abuse (allowances, cut-offs, seizing salary or stridhan) as recognised domestic violence. Even-handed; educational, not financial or legal advice."
resource: https://swipeed.vercel.app/game/money-together
tags: [games, swipeed, money, financial-independence, economic-abuse, gender-equality, ages-22-plus, adult-journey, chapter-7]
timestamp: 2026-06-24T01:40:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8449d339-a540-489c-88e3-61d3d670fdd4  # SWED-100
---

# Money, Together

> **Built to GDD 58 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> **The sixth Chapter-7 node carries the Work & Money domain from [Money & Independence](money-independence.md)
> (g48) into shared adult life:** *two incomes, one life, and a lot of decisions.* A **453-scenario typed library**
> (`content/games/money-together.ts`: money-talk 77 · plan-together 73 · stay-independent 75 · fair-not-gendered 76
> · control-is-abuse 79 · tools-and-help 73), with seven play actions (strike-rewrite ×94 · branch ×76 · reflect ×60 ·
> sort ×60 · match ×54 · spot ×53 · role-play ×56), **0% binary**, led by branch (your move) + strike-rewrite (bust
> the myth) + sort. Six modes: **the money talk** (open, early, honest about incomes/debts/goals: *talking money
> is care, not coldness*); **plan together** (joint **and** personal accounts, shared goals, budgeting for a
> baby/home/emergency, both partners knowing the money); **stay independent** (keep your own account, literacy &
> footing; busts *"he handles the money because he earns it"*; the homemaker's unpaid work is **real economic
> value**); **fair not gendered** (managing money isn't a man's job; the earner doesn't get a bigger vote; a
> stay-at-home partner is an **equal, not a dependent**); **control is abuse** (allowances, cut-offs, seizing a
> salary or **stridhan**, barring work are **economic abuse**: recognised domestic violence under the **PWDVA
> 2005**); **tools & help**. **Even-handed and warm; centres each partner's financial independence, especially
> women's; educational, not financial or legal advice.** Where money becomes control it routes to
> [Respect at Home](respect-at-home.md) (g56) and help (`reassureCats` [control-is-abuse] + `reassure` + `helpLine`
> → **181, 1091, 112, NALSA legal aid 15100**; stridhan is a woman's own property by law). **gameId:** library, GDD
> and engine-host registry all agree on **`money-together`** (no trap). Engine: **no new mechanic and no `binStyle`
> change**. Verbatim-engine emulation over all 11 sort pairs found no mis-colours (*Green flag* / *Red flag*,
> *Fair* / *Unfair*, *Healthy independence* / *Unhealthy dependence*, *Smart move* / *Risky gap*, *Protects
> independence* / *Erodes it*, *Protective habit* / *Harmful habit* coloured by existing tokens; *Economic abuse*
> left neutral: `abuse` can't be a global red token; its pair *Fair arrangement* is green). Spot ids injected (9);
> two spots (mt-056, mt-081) carry multiple valid `trick:true` items (engine solves on any). New-node wiring:
> `g58 → money-together` in the gen-path `GAME` dict (+ 💵 emoji), `path.ts` regenerated (64 built/playable),
> registered in `engine-host`. Read-first attested. **Builds on** [Money & Independence](money-independence.md)
> (g48); **pairs with** [Equal Partners](equal-partners.md) (g55) and **guards against** the financial control
> covered in [Respect at Home](respect-at-home.md) (g56).

**Node #g58: Chapter 7, ages 22+ (Building a Life).** *Two incomes, one life.* Where
[Money & Independence](money-independence.md) (#g48) taught the young adult to stand on their own financial feet,
this node carries that footing into a shared life, where money is one of the biggest sources of friction *and*
one of the most gendered. Lensy returns as a steady, practical peer. **The spine: talk money openly and plan
together, keep your own independence inside the partnership, treat money roles as fair not gendered, and know the
bright line where "managing the money" becomes economic abuse.**

> **Multi-step branches and role-plays ([SWED-100](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8449d339-a540-489c-88e3-61d3d670fdd4), 2026-09-30).** All 76 branches and 56 role-plays are now 3 to 5 questions on one situation (78 with 3, 48 with 4, 6 with 5; 456 questions), each with 4 or 5 options and one best, revealed at the end. After a write, review and fix pass, a final certification ran up to four rounds of three independent reviews (a blind best-option pick, a transition-by-transition audit, and a safety and fidelity review against the single-step source): round 1 found 108 blocking problems across all 132 stories, round 4 found 2 in the 17 it re-checked, and the 12 stories the last fix touched were read in full before shipping. Procedure: [multi-step rollout](../playbooks/multi-step-rollout.md).

## What it embodies

- **The money talk (14)**: open, early, honest conversations about incomes, debts and goals; *talking money is
  care, not coldness.*
- **Plan together (14)**: joint **and** personal accounts, shared goals, budgeting for the big stuff, and
  **both** partners knowing the money.
- **Stay independent (14)**: your own account, financial literacy and footing; busts *"he handles the money
  because he earns it"*; the homemaker's unpaid work is real economic value.
- **Fair, not gendered (14)**: managing money isn't a man's job; the higher earner doesn't get a bigger vote; a
  stay-at-home partner is an equal, not a dependent.
- **Control is abuse (14)**: allowances, cut-offs, seizing a salary or **stridhan**, or barring work are
  **economic abuse**, recognised domestic violence under the **PWDVA 2005**.
- **Tools & help (14)**: the money-talk script, the both-accounts setup, the monthly check-in, and the help
  routes.

**Safeguarding.** Even-handed and independence-centred; the bright line is clear: **controlling money is not
budgeting: it's economic abuse**, never the victim's fault, **stridhan is a woman's own property by law**, and
those beats route to 181 / 1091 / 112, NALSA legal aid 15100, and Respect at Home (g56). Educational, not financial
or legal advice.
