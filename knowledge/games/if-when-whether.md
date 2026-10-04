---
type: Concept
owner: the-equal-lens
copied_from: owhile-engine@c182048:knowledge/games/if-when-whether.md
title: If, When & Whether
description: Reproductive planning for ages 22+, covering whether to have children, when, and how many, made with real knowledge, together, and free of pressure in any direction. Calm fertility awareness (women and men), preconception health, when-and-spacing on your own timeline, infertility with compassion and realism, and resisting son-preference and pressure. Childfree is a complete, valid life. Medically accurate but panic-free; not medical advice.
resource: https://swipeed.vercel.app/game/if-when-whether
tags: [games, swipeed, reproductive-health, fertility, childfree, autonomy, ages-22-plus, adult-journey, chapter-7]
timestamp: 2026-06-24T01:50:00Z
plane_issues:
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d0c7e8c6-12ce-49de-9247-6db797a309e7  # SWED-61
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/d5b7b622-1f59-42fa-8301-d7e985491850  # SWED-98
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8449d339-a540-489c-88e3-61d3d670fdd4  # SWED-100
  - https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/88bb2bfc-fb38-4df6-bc26-3895c72a67e6  # SWED-103
---

# If, When & Whether

> **Built to GDD 59 v2: the "mechanic-embodying" standard** (see [pattern #26](swipeed-game-patterns.md)).
> **The seventh Chapter-7 node, the reproductive-decision heart of the chapter and the adult version of
> [My Choices, My Future](my-choices-my-future.md) (g29):** *whether to have children, when, and how many, made
> with real knowledge, together, and free of pressure in **any** direction.* A **434-scenario typed library**
> (`content/games/if-when-whether.json`: whether-and-why 72 · fertility-for-real 75 · when-and-spacing 66 · if-its-hard
> 77 · free-of-pressure 75 · tools-and-help 69), with seven play actions (strike-rewrite ×100 · branch ×64 · reflect ×60
> · sort ×51 · match ×51 · role-play ×58 · spot ×50), **0% binary**, led by strike-rewrite (bust the myth) + branch
> (your move) + sort. Six modes: **whether & why** (children are an if/when/whether *choice*, not the assumed
> default; **childfree is a complete, valid life**; busts *"a woman who doesn't want kids is selfish"*); **fertility
> for real** (calm, honest fertility awareness: the fertile window, age trends for women **and** men, preconception
> health & folic acid; busts both *"there's always time"* and *"it just happens instantly"*; refuses scare tactics);
> **when & spacing** (timing, readiness as honest reflection not perfection, spacing & contraception, your own
> timeline not the crowd's); **if it's hard** (infertility with compassion & realism: **~1 in 6 people, men and
> women roughly equally**; options like IVF help many but aren't guaranteed; no false hope, no shame); **free of
> pressure** (the couple's autonomy; resisting "good news" pressure; confronting **son-preference and sex-selection,
> illegal under the PCPNDT Act**; refusing a weaponised fertility clock); **tools & help**. **Even-handed and
> non-coercive: no pressure toward children or against; childfree and many-paths-to-parenthood equally valid;
> medically accurate but panic-free; not medical advice, points to clinicians.** Where it's hard, it routes to
> [Many Ways to Family](swipeed-game-patterns.md) (g60); the emotionally-loaded cats reassure (`reassureCats`
> [free-of-pressure · if-its-hard] + `reassure` + `helpLine` → a doctor, a **government health centre** (PHC or CHC) or district hospital, and public reproductive-health
> services; sex selection is illegal under the PCPNDT Act). **gameId:** library, GDD and engine-host registry all
> agree on **`if-when-whether`** (no trap). Engine: **no new mechanic and no `binStyle` change**. Verbatim-engine
> emulation over all 11 sort pairs found no mis-colours (*Honest fact* / *Panic myth*, *Respects autonomy* /
> *Violates it*, *Healthy support* / *Harmful pressure*, *Compassionate truth* / *Harmful (or Cruel) myth* coloured
> by existing tokens; the rest neutral). Spot ids injected (7); one spot (iw-054) carries multiple valid
> `trick:true` items. **Unlike the other Chapter-7 nodes this carries no DV helpline** (it's a health/autonomy node,
> not a safety node). The help route is a doctor or a government health centre. New-node wiring: `g59 → if-when-whether` in the
> gen-path `GAME` dict (+ 🤰 emoji), `path.ts` regenerated (65 built/playable), registered in `engine-host`.
> Read-first attested. **Builds on** [My Choices, My Future](my-choices-my-future.md) (g29); **pairs with** Many
> Ways to Family (g60).

**Node #g59: Chapter 7, ages 22+ (Building a Life).** *Whether, when and how many is yours to decide, with real
knowledge, and free of pressure in any direction.* Where [My Choices, My Future](my-choices-my-future.md) (#g29)
taught the teenager that their future is theirs to plan, this node carries that autonomy into the single most
pressured reproductive decision an Indian adult faces: *when are you having children, and is it a son?* Lensy returns
as a calm, factual peer. **The spine: the decision is the couple's alone; the facts are honest and panic-free; and
every outcome (children now, later, never, or a hard road through infertility) is met without shame.**

> **Multi-step branches and role-plays ([SWED-100](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/8449d339-a540-489c-88e3-61d3d670fdd4), 2026-09-30).** All 64 branches and 58 role-plays are now 3 to 5 questions on one situation (76 with 3, 40 with 4, 6 with 5; 418 questions), each with 4 or 5 options and one best, revealed at the end. After a write, review and fix pass, a final certification ran up to four rounds of three independent reviews (a blind best-option pick, a transition-by-transition audit, and a safety and fidelity review against the single-step source): round 1 found 65 blocking problems across all 122 stories, round 4 found 0 in the 25 it re-checked, and the 9 stories the last fix touched were read in full before shipping. The reviewers also flagged that the game sends adults to RKSK, the adolescent health programme; that is a game-wide fix, filed as [SWED-103](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/88bb2bfc-fb38-4df6-bc26-3895c72a67e6). Procedure: [multi-step rollout](../playbooks/multi-step-rollout.md).

## What it embodies

- **Whether & why (14)**: children are an if/when/whether choice, not the assumed default; **childfree is a
  complete, valid life**; busts *"a woman who doesn't want kids is selfish."*
- **Fertility for real (14)**: calm, honest fertility awareness: the fertile window, age trends for **women and
  men**, preconception health; busts both *"there's always time"* and *"it just happens instantly"*; no scare
  tactics.
- **When & spacing (14)**: readiness as honest reflection (not perfection), spacing and contraception, your own
  timeline, not the crowd's.
- **If it's hard (14)**: infertility with compassion and realism (~1 in 6, men and women roughly equally; IVF
  helps many but isn't guaranteed), no false hope, no shame.
- **Free of pressure (14)**: the couple's autonomy; resisting "good news" and family pressure; **son-preference
  and sex-selection are illegal** (PCPNDT Act); refusing a weaponised fertility clock.
- **Tools & help (14)**: a decision-reflection tool, fertility basics, and public reproductive-health services at government health centres
  services & clinicians.

**Stance.** Non-coercive in every direction (no pressure toward children or against) and medically accurate but
deliberately panic-free. It is **not medical advice** and points to clinicians and public services; it names
**sex selection as illegal** under the PCPNDT Act, and meets infertility with realism and zero shame.

## Help route for adults (2026-10-03)

[SWED-103](https://app.plane.so/the-equal-lens/projects/59d0b01f-352e-4aee-bd3f-252cdf283a74/issues/88bb2bfc-fb38-4df6-bc26-3895c72a67e6): the game used to name RKSK (Rashtriya Kishor Swasthya Karyakram), which is the adolescent health programme for ages 10 to 19, as the real-help route for adults' fertility, preconception and infertility care. All 75 mentions in 37 scenarios now point to adult routes: a doctor, a government health centre (PHC or CHC), a district hospital, or a public hospital. The same change reached the help line, the help label ("Find care · a clinician / health centre"), the reassurance line and the game's local grounding file, so regrowth won't reintroduce RKSK. No scheme is named, so no scheme name can go stale.
